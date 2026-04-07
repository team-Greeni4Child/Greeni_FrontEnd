import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import MicButton from "../components/MicButton";
import Button from "../components/Button";
import TutorialOverlay from "../components/TutorialOverlay";
import { ProfileContext } from "../context/ProfileContext";
import { useTutorial } from "../context/TutorialContext";
import { uploadDiaryVoice } from "../api/s3";
import { sendDiaryVoice } from "../api/diary";
import { requestDiaryAi, closeDiaryAi } from "../api/diaryAi";
import { playBase64Mp3, stopAiAudio } from "../utils/audio";

const { width: W, height: H } = Dimensions.get("window");
const MAX_DIARY_TURNS = 10;

function createSessionId() {
  return `diary_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
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
    stopTutorial,
    registerTarget,
    clearTarget,
  } = useTutorial();

  const [isSending, setIsSending] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [bubbleText, setBubbleText] = useState("오늘 어떤 일이 있었어?");

  const sessionIdRef = useRef(createSessionId());
  const turnRef = useRef(0);
  const isScreenActiveRef = useRef(true);
  const isEndingRef = useRef(false);
  const isClosingRef = useRef(false);

  // 튜토리얼용 일기 Ref
  const rootRef = useRef(null);
  const micTouchableRef = useRef(null);
  const drawButtonRef = useRef(null);

  const shouldStartDiaryTutorial = route.params?.tutorialFlowId === "diary";

  useEffect(() => {
    isScreenActiveRef.current = true;

    return () => {
      isScreenActiveRef.current = false;
      stopAiAudio();
    };
  }, []);

  // 일기 튜토리얼 분기
  useEffect(() => {
    if (!shouldStartDiaryTutorial) return;
    if (startedFlows.diary) return;
    if (isTutorialEnabled) return;
    startTutorial("diary");
  }, [shouldStartDiaryTutorial, startedFlows.diary, isTutorialEnabled, startTutorial]);

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

  const handleCloseDiarySession = async () => {
    if (isClosingRef.current || isEndingRef.current) return;

    try {
      isClosingRef.current = true;

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

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

      navigation.replace("DiaryDraw", {
        sessionId: sessionIdRef.current,
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

    try {
      setIsSending(true);

      if (!filePath || !selectedProfile?.profileId) {
        return;
      }

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

      // 1) S3 업로드
      const uploadRes = await uploadDiaryVoice(filePath);

      if (!uploadRes?.fileUrl) {
        throw new Error("fileUrl 없음");
      }

      // 2) voice API 호출
      await sendDiaryVoice({
        url: uploadRes.fileUrl,
        profileId: selectedProfile.profileId,
        role: "user",
      });

      if (!isScreenActiveRef.current) return;

      setBubbleText("...");

      const aiRes = await requestDiaryAi({
        profileId: selectedProfile.profileId,
        sessionId: sessionIdRef.current,
        voiceUrl: uploadRes.fileUrl,
        filePath,
      });

      if (!isScreenActiveRef.current) return;

      const result = aiRes?.result ?? aiRes ?? {};
      const nextSessionId = result?.sessionId || "";
      const aiText = result?.text || "";
      const aiVoiceBase64 = result?.base64Voice || "";

      if (nextSessionId) {
        sessionIdRef.current = nextSessionId;
      }

      turnRef.current += 1;

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
        setBubbleText("다시 한 번 말해줄래?");
      }
    } finally {
      if (isScreenActiveRef.current) {
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
      padX: -20,
      padY: -20,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  // 일기 Ref 측정 - 그림일기 버튼 hole view
  const measureDrawButton = useCallback(() => {
    measureTarget("drawDiaryButton", drawButtonRef, 24.5, {
      padX: 5,
      padY: 5,
      radiusOffset: 10,
    });
  }, [measureTarget]);

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
    const isDrawButtonStep =
      isTutorialEnabled && activeFlowId === "diary" && currentStep?.id === "draw_button_intro";

    if (isDrawButtonStep) {
      goToStep("tools_intro");
      await handleEndDiary({ tutorialFlowId: "diary" });
      return;
    }

    await handleEndDiary();
  };

  const isMicDisabled = isSending || isAiSpeaking || isEndingRef.current || isClosingRef.current;
  const isDiaryTutorial = isTutorialEnabled && activeFlowId === "diary";
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
        onPressSkip={stopTutorial}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentTutorialStep?.id === "draw_button_intro" ? handleTutorialPressDrawDiary : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 170 }}
      />

      {/* 상단 뒤로가기 + 제목 */}
      <BackButton navigation={{ ...navigation, goBack: handleCloseDiarySession }} top={H * 0.08} />
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

      {/* 일기 그리러 가는 버튼 */}
      <View ref={drawButtonRef} style={styles.diaryButton} onLayout={measureDrawButton}>
        <Button
          title="그림일기"
          onPress={handleTutorialPressDrawDiary}
          disabled={isEndingRef.current || isClosingRef.current}
        />
      </View>
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
    height: H * 0.14,
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
    lineHeight: 26,
  },
  greeni: {
    width: W * 0.5,
    height: W * 0.5,
  },

  // 일기 그리러 가는 버튼
  diaryButton: {
    position: "absolute",
    top: H * 0.07,
    right: 15,
  },
});
