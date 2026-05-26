import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Modal,
  BackHandler,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import MicButton from "../components/MicButton";
import { playButtonSound } from "../utils/soundEffects";
import TutorialOverlay from "../components/TutorialOverlay";
import { ProfileContext } from "../context/ProfileContext";
import { useTutorial } from "../context/TutorialContext";
import { uploadDiaryVoice } from "../api/s3";
import { sendDiaryVoice } from "../api/diary";
import { requestDiaryAi, closeDiaryAi } from "../api/diaryAi";
import { playBase64Mp3, stopAiAudio } from "../utils/audio";

const { width: W, height: H } = Dimensions.get("window");
const MAX_DIARY_TURNS = 10;
const DRAW_TRANSITION_MESSAGE = "이제 그림일기 그리러 가자!";
const DRAW_TRANSITION_DELAY_MS = 1200;

function createSessionId() {
  return `diary_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default function DiaryScreen({ navigation, route }) {
  const { selectedProfile } = useContext(ProfileContext);
  const {
    isTutorialEnabled,
    activeFlowId,
    currentStep,
    targets,
    startedFlows,
    startTutorial,
    goToStep,
    completeTutorial,
    registerTarget,
    clearTarget,
  } = useTutorial();

  const [isSending, setIsSending] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [bubbleText, setBubbleText] = useState("오늘 어떤 일이 있었어?");
  const [showExitModal, setShowExitModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // AI와 대화를 1번 이상 완료했을 때만 그림일기 버튼 표시
  const [hasDiaryConversation, setHasDiaryConversation] = useState(false);
  const drawButtonOpacity = useRef(new Animated.Value(0)).current;

  const sessionIdRef = useRef(createSessionId());
  const turnRef = useRef(0);
  const isScreenActiveRef = useRef(true);
  const isEndingRef = useRef(false);
  const isClosingRef = useRef(false);
  const failCountRef = useRef(0);

  // 튜토리얼용 일기 Ref
  const rootRef = useRef(null);
  const micTouchableRef = useRef(null);
  const drawButtonRef = useRef(null);
  const diaryStartedKey = selectedProfile?.profileId
    ? `diary:${selectedProfile.profileId}`
    : "diary";

  const shouldStartDiaryTutorial = route.params?.tutorialFlowId === "diary";

  useEffect(() => {
    isScreenActiveRef.current = true;

    console.log("[DIARY][ENTER]", {
      sessionId: sessionIdRef.current,
      selectedProfileId: selectedProfile?.profileId,
      routeParams: route.params,
    });

    return () => {
      isScreenActiveRef.current = false;
      stopAiAudio();
    };
  }, [route.params, selectedProfile?.profileId]);

  // 일기 튜토리얼 분기
  useEffect(() => {
    if (!shouldStartDiaryTutorial) return;
    if (startedFlows[diaryStartedKey]) return;
    if (isTutorialEnabled) return;
    startTutorial("diary");
  }, [shouldStartDiaryTutorial, startedFlows, diaryStartedKey, isTutorialEnabled, startTutorial]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS !== "android") return false;

        if (showErrorModal) {
          setShowErrorModal(false);
          setErrorMessage("");
          return true;
        }

        if (showExitModal) {
          setShowExitModal(false);
          return true;
        }

        if (isEndingRef.current || isClosingRef.current) {
          return true;
        }

        setShowExitModal(true);
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [showExitModal, showErrorModal]),
  );

  const playDiaryVoice = async audioBase64 => {
    if (!audioBase64 || !isScreenActiveRef.current) return;

    try {
      setIsAiSpeaking(true);
      await playBase64Mp3(audioBase64);
    } catch (e) {
      console.log("[DIARY] AI 음성 재생 실패:", e);
    } finally {
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }
    }
  };

  const handleOpenExitModal = () => {
    if (isEndingRef.current || isClosingRef.current) return;
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    playButtonSound();
    setShowExitModal(false);
  };

  const handleCloseErrorModal = async () => {
    playButtonSound();
    setShowErrorModal(false);
    setErrorMessage("");
    await handleCloseDiarySession({ withSound: false });
  };

  const handleCloseDiarySession = async ({ withSound = true } = {}) => {
    if (isClosingRef.current || isEndingRef.current) return;

    if (withSound) {
      playButtonSound();
    }

    try {
      isClosingRef.current = true;
      setShowExitModal(false);

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

      console.log("[DIARY][CLOSE_REQUEST]", {
        profileId: selectedProfile?.profileId,
        sessionId: sessionIdRef.current,
        turnCount: turnRef.current,
      });

      if (selectedProfile?.profileId && sessionIdRef.current) {
        await closeDiaryAi({
          profileId: selectedProfile.profileId,
          sessionId: sessionIdRef.current,
        });
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      console.log("[DIARY] 세션 종료 실패:", e);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } finally {
      isClosingRef.current = false;
    }
  };

  const handleEndDiary = async (params = {}) => {
    if (isEndingRef.current || isClosingRef.current) return;

    try {
      isEndingRef.current = true;

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

      console.log("[DIARY][GO_DRAW]", {
        sessionId: sessionIdRef.current,
        turnCount: turnRef.current,
        drawingOnly: turnRef.current === 0,
        selectedProfileId: selectedProfile?.profileId,
        extraParams: params,
      });

      navigation.replace("DiaryDraw", {
        sessionId: sessionIdRef.current,
        turnCount: turnRef.current,
        drawingOnly: turnRef.current === 0,
        ...params,
      });
    } catch (e) {
      console.log("[DIARY] 종료 실패:", e);
    } finally {
      isEndingRef.current = false;
    }
  };

  const handleRecordComplete = async filePath => {
    if (isSending || isAiSpeaking || isEndingRef.current || isClosingRef.current) return;
    if (showErrorModal) return;

    try {
      setIsSending(true);

      if (!filePath || !selectedProfile?.profileId) {
        console.log("[DIARY][RECORD_SKIP]", {
          filePath,
          selectedProfileId: selectedProfile?.profileId,
        });
        return;
      }

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

      console.log("[DIARY][RECORD_COMPLETE]", {
        filePath,
        sessionId: sessionIdRef.current,
        turnCount: turnRef.current,
        selectedProfileId: selectedProfile?.profileId,
      });

      // 1) S3 업로드
      const uploadRes = await uploadDiaryVoice(filePath);

      console.log("[DIARY][VOICE_UPLOADED]", {
        uploadRes,
        voiceUrl: uploadRes?.fileUrl,
      });

      if (!uploadRes?.fileUrl) {
        throw new Error("fileUrl 없음");
      }

      // 2) voice API 호출
      await sendDiaryVoice({
        url: uploadRes.fileUrl,
        profileId: selectedProfile.profileId,
        role: "user",
      });

      console.log("[DIARY][VOICE_SAVED]", {
        profileId: selectedProfile.profileId,
        voiceUrl: uploadRes.fileUrl,
      });

      if (!isScreenActiveRef.current) return;

      setBubbleText("...");

      console.log("[DIARY][AI_REQUEST]", {
        profileId: selectedProfile.profileId,
        sessionId: sessionIdRef.current,
        voiceUrl: uploadRes.fileUrl,
        filePath,
      });

      const aiRes = await requestDiaryAi({
        profileId: selectedProfile.profileId,
        sessionId: sessionIdRef.current,
        voiceUrl: uploadRes.fileUrl,
        filePath,
      });

      if (!isScreenActiveRef.current) return;

      failCountRef.current = 0;

      const result = aiRes?.result ?? aiRes ?? {};
      const nextSessionId = result?.sessionId || "";
      const aiText = result?.text || "";
      const aiVoiceBase64 = result?.base64Voice || "";

      console.log("[DIARY][AI_RESULT]", {
        prevSessionId: sessionIdRef.current,
        nextSessionId,
        hasText: !!aiText,
        hasVoice: !!aiVoiceBase64,
        turnBeforeIncrease: turnRef.current,
        rawResult: result,
      });

      if (nextSessionId) {
        sessionIdRef.current = nextSessionId;
      }

      turnRef.current += 1;
      setHasDiaryConversation(true);

      console.log("[DIARY][TURN_INCREASED]", {
        sessionId: sessionIdRef.current,
        turnCount: turnRef.current,
        hasDiaryConversation: true,
      });

      if (aiText) {
        setBubbleText(aiText);
      } else {
        setBubbleText("다시 한 번 말해줄래?");
      }

      const isLastTurn = turnRef.current >= MAX_DIARY_TURNS;

      if (aiVoiceBase64) {
        await playDiaryVoice(aiVoiceBase64);
      }

      if (!isScreenActiveRef.current) return;

      if (isLastTurn) {
        setBubbleText(DRAW_TRANSITION_MESSAGE);

        await wait(DRAW_TRANSITION_DELAY_MS);

        if (!isScreenActiveRef.current) return;

        await handleEndDiary();
      }
    } catch (e) {
      console.log("[DIARY] 음성 전송 실패:", e);

      const code = e?.code || e?.response?.code;

      if (code === "DIARY_ALREADY_EXISTS") {
        navigation.replace("Home", {
          diaryAlreadyExists: true,
        });
        return;
      }

      if (isScreenActiveRef.current) {
        failCountRef.current += 1;

        if (failCountRef.current >= 2) {
          setErrorMessage("네트워크 오류가 발생했습니다.");
          setShowErrorModal(true);
          setIsSending(false);
          return;
        }

        setBubbleText("다시 한 번 말해줄래?");
      }
    } finally {
      if (isScreenActiveRef.current && !showErrorModal) {
        setIsSending(false);
      }
    }
  };

  // 일기 Ref 측정
  const measureTarget = useCallback(
    (targetKey, targetRef, borderRadius = 15, options = {}) => {
      const { padX = 0, padY = 0, radiusOffset = 0 } = options;

      if (!rootRef.current || !targetRef.current) return;

      rootRef.current.measureInWindow((rootX, rootY) => {
        targetRef.current.measureInWindow((x, y, width, height) => {
          registerTarget(targetKey, {
            x: x - rootX - padX,
            y: y - rootY - padY,
            width: width + padX * 2,
            height: height + padY * 2,
            borderRadius: borderRadius + radiusOffset,
          });
        });
      });
    },
    [registerTarget],
  );

  // 일기 Ref 측정 - 마이크 버튼 hole view
  const measureMicButton = useCallback(() => {
    measureTarget("micButton", micTouchableRef, W * 0.21, {
      padX: -25,
      padY: -25,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  // 일기 Ref 측정 - 그림일기 버튼 hole view
  const measureDrawButton = useCallback(() => {
    measureTarget("drawDiaryButton", drawButtonRef, 24.5, {
      padX: 3,
      padY: -3,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  const isDiaryTutorial = isTutorialEnabled && activeFlowId === "diary";
  const shouldShowDrawDiaryButton = hasDiaryConversation || isDiaryTutorial;

  useEffect(() => {
    if (!shouldShowDrawDiaryButton) {
      drawButtonOpacity.setValue(0);
      return;
    }

    drawButtonOpacity.setValue(0);

    Animated.timing(drawButtonOpacity, {
      toValue: 1,
      duration: 450,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(() => {
      measureDrawButton();
    });
  }, [shouldShowDrawDiaryButton, drawButtonOpacity, measureDrawButton]);

  useEffect(() => {
    if (!isTutorialEnabled || activeFlowId !== "diary") return;

    if (currentStep?.targetKey === "micButton") {
      const timer = setTimeout(measureMicButton, 50);
      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "drawDiaryButton") {
      const timer = setTimeout(measureDrawButton, 50);
      return () => clearTimeout(timer);
    }

    clearTarget("micButton");
    clearTarget("drawDiaryButton");
  }, [
    isTutorialEnabled,
    activeFlowId,
    currentStep?.targetKey,
    measureMicButton,
    measureDrawButton,
    clearTarget,
  ]);

  // DiaryDraw로 넘어갈 때 튜토리얼 흐름을 이어주기 위한 분기 추가
  const handleTutorialPressDrawDiary = async () => {
    playButtonSound();

    const isDrawButtonStep =
      isTutorialEnabled &&
      activeFlowId === "diary" &&
      currentStep?.id === "draw_button_target_intro";

    if (isDrawButtonStep) {
      goToStep("tools_intro");
      await handleEndDiary({ tutorialFlowId: "diary" });
      return;
    }

    await handleEndDiary();
  };

  const handleTutorialSkip = async () => {
    await completeTutorial();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const isMicDisabled =
    isSending || isAiSpeaking || isEndingRef.current || isClosingRef.current || showErrorModal;

  const currentTutorialStep =
    isDiaryTutorial && currentStep?.screen === "Diary" ? currentStep : null;

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={() => {
        measureMicButton();
        measureDrawButton();
      }}
    >
      <View style={styles.topBackground} />

      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={() => {
          if (currentTutorialStep?.allowBackgroundPress) {
            goToStep(currentTutorialStep.nextStepId);
          }
        }}
        onPressSkip={handleTutorialSkip}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentTutorialStep?.id === "draw_button_target_intro"
            ? handleTutorialPressDrawDiary
            : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 220 }}
      />

      {/* 상단 뒤로가기 + 제목 */}
      <BackButton navigation={{ ...navigation, goBack: handleOpenExitModal }} top={H * 0.08} />
      <Text style={styles.title}>일기쓰기</Text>

      {/* 말풍선 + 그리니 */}
      <View style={styles.greeniWrap}>
        <ImageBackground
          source={require("../assets/images/bubble_diary.png")}
          style={styles.bubble}
          resizeMode="stretch"
        >
          <Text style={styles.bubbleText}>{bubbleText}</Text>
        </ImageBackground>

        <Image
          source={require("../assets/images/umbrella_greeni_big.png")}
          style={styles.greeni}
          resizeMode="contain"
        />
      </View>

      <MicButton
        touchableRef={micTouchableRef}
        onRecordComplete={handleRecordComplete}
        disabled={isMicDisabled}
      />

      {shouldShowDrawDiaryButton && (
        <Animated.View
          style={[
            styles.diaryButton,
            {
              opacity: drawButtonOpacity,
            },
          ]}
        >
          <TouchableOpacity
            ref={drawButtonRef}
            onPress={handleTutorialPressDrawDiary}
            activeOpacity={0.8}
            onLayout={measureDrawButton}
          >
            <Image
              source={require("../assets/images/icon_draw_diary.png")}
              style={styles.diaryButtonIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* 중단 확인 모달 */}
      <Modal transparent visible={showExitModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              지금 나가면{"\n"}대화 내용이 저장되지 않아요.{"\n"}일기쓰기를 그만할까요?
            </Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton, { width: "50%", backgroundColor: colors.ivory }]}
                onPress={handleCancelExit}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>아니요</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { width: "50%" }]}
                onPress={handleCloseDiarySession}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 에러 안내 모달 */}
      <Modal transparent visible={showErrorModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>{errorMessage}</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleCloseErrorModal}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.ivory,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.15,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    fontFamily: "Maplestory_Bold",
    fontSize: 28,
    color: colors.brown,
  },

  greeniWrap: {
    bottom: H * 0.35,
    alignItems: "center",
  },
  bubble: {
    maxWidth: W * 0.85,
    minWidth: W * 0.5,
    paddingHorizontal: 40,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleText: {
    fontSize: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
    lineHeight: 28,
  },
  greeni: {
    width: W * 0.5,
    height: W * 0.5,
  },

  // 일기 그리러 가는 버튼
  diaryButton: {
    position: "absolute",
    top: H * 0.075,
    right: 15,
  },
  diaryButtonIcon: {
    width: 50,
    height: 50,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: colors.lightGray95,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrap: {
    width: W * 0.7,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.greenDark,
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    textAlign: "center",
    margin: 30,
  },
  modalButtonWrap: {
    flexDirection: "row",
    height: 45,
    width: "100%",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  modalButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
});
