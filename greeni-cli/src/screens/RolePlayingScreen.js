import React, { useState, useCallback, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "react-native";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import TutorialOverlay from "../components/TutorialOverlay";
import colors from "../theme/colors";
import MicButton from "../components/MicButton";
import { playButtonSound } from "../utils/soundEffects";
import { createRolePlayingActivity } from "../api/activity";
import { requestRolePlaying, closeRolePlaying } from "../api/rolePlaying";
import { playBase64Mp3, stopAiAudio } from "../utils/audio";
import { ProfileContext } from "../context/ProfileContext";
import { useTutorial } from "../context/TutorialContext";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

function makeSessionId() {
  return `role_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function getInitialBubbleText(role) {
  if (!role) {
    return `밑에 있는 세가지 상황 중에\n하나를 골라줘`;
  }
  if (role === "shop") return "어서 오세요.\n그리니 잡화점입니다!";
  if (role === "teacher") return "안녕!\n오늘은 선생님과 이야기해보자.";
  if (role === "friend") return "만나서 반가워!\n나랑 같이 놀자~";
  return "";
}

function toActivityRole(role) {
  if (role === "shop") return "SHOP";
  if (role === "teacher") return "TEACHER";
  if (role === "friend") return "FRIEND";
  return null;
}

export default function RolePlayingScreen({ navigation }) {
  const { selectedProfile } = useContext(ProfileContext);
  const {
    isTutorialEnabled,
    activeFlowId,
    currentStep,
    targets,
    nextStep,
    startTutorial,
    stopTutorial,
    completeTutorial,
    registerTarget,
    clearTarget,
  } = useTutorial();
  const isSubmittingRef = useRef(false);
  const isScreenActiveRef = useRef(true);
  const failCountRef = useRef(0);

  // 튜토리얼용 역할놀이 Ref
  const rootRef = useRef(null);
  const backButtonRef = useRef(null);
  const shopRoleButtonRef = useRef(null);

  const [selectedSituation, setSelectedSituation] = useState(null);
  const [bubbleText, setBubbleText] = useState(getInitialBubbleText(null));
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const displayedBubbleText = isLoading ? "    ...    " : bubbleText;
  const useLongBubble = displayedBubbleText.length >= 55;

  useEffect(() => {
    isScreenActiveRef.current = true;

    return () => {
      isScreenActiveRef.current = false;
      stopAiAudio();
    };
  }, []);

  const handleSituation = key => {
    playButtonSound();
    setSelectedSituation(key);
    setBubbleText(getInitialBubbleText(key));
    setSessionId("");
    failCountRef.current = 0;
  };

  const handleRecordComplete = async voicePath => {
    if (!selectedSituation) return;
    if (isLoading) return;
    if (!voicePath) return;
    if (!isScreenActiveRef.current) return;
    if (showErrorModal) return;

    try {
      setIsLoading(true);

      const currentSessionId = sessionId || makeSessionId();

      const result = await requestRolePlaying({
        sessionId: currentSessionId,
        role: selectedSituation,
        voicePath,
      });

      if (!isScreenActiveRef.current) return;

      failCountRef.current = 0;

      const nextSessionId = result?.sessionId || currentSessionId;
      setSessionId(nextSessionId);

      if (result?.text) {
        setBubbleText(result.text);
      }

      setIsLoading(false);

      if (result?.base64Voice && isScreenActiveRef.current) {
        try {
          setIsAiSpeaking(true);
          await playBase64Mp3(result.base64Voice);
        } finally {
          if (isScreenActiveRef.current) {
            setIsAiSpeaking(false);
          }
        }
      }
    } catch (e) {
      console.log("REQUEST ROLE PLAYING FAIL:", e);

      if (isScreenActiveRef.current) {
        failCountRef.current += 1;
        setIsLoading(false);

        if (failCountRef.current >= 2) {
          setShowErrorModal(true);
          return;
        }

        setBubbleText("앗, 잘 못 들었어.\n한 번만 다시 말해줄래?");
      }
    }
  };

  const handleBackPress = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    isScreenActiveRef.current = false;

    try {
      await stopAiAudio();
      setIsAiSpeaking(false);

      if (sessionId) {
        try {
          await closeRolePlaying(sessionId);
        } catch (e) {
          console.log("CLOSE ROLE PLAYING FAIL:", e);
        }
      }

      const profileId = Number(selectedProfile?.profileId);

      if (selectedSituation && Number.isFinite(profileId)) {
        const roleName = toActivityRole(selectedSituation);

        const activityRes = await createRolePlayingActivity({
          profileId,
          roleName,
        });
      }
    } catch (e) {
      console.log("CREATE ROLE PLAYING ACTIVITY FAIL:", e);
    } finally {
      isSubmittingRef.current = false;
      navigation.goBack();
    }
  }, [navigation, selectedProfile?.profileId, selectedSituation, sessionId]);

  const handleErrorModalOk = async () => {
    playButtonSound();
    setShowErrorModal(false);
    await handleBackPress();
  };

  // 역할놀이 Ref 측정
  const measureTarget = useCallback(
    (targetKey, targetRef, borderRadius = 15, options = {}) => {
      const { padX = 0, padTop = 0, padBottom = 0, radiusOffset = 0 } = options;

      if (!rootRef.current || !targetRef.current) return;

      rootRef.current.measureInWindow((rootX, rootY) => {
        targetRef.current.measureInWindow((x, y, width, height) => {
          registerTarget(targetKey, {
            x: x - rootX - padX,
            y: y - rootY - padTop * 1.5 - padBottom,
            width: width + padX * 2,
            height: height + (padTop + padBottom) * 2,
            borderRadius: borderRadius + radiusOffset,
          });
        });
      });
    },
    [registerTarget],
  );

  const measureBackButton = useCallback(() => {
    measureTarget("roleBackButton", backButtonRef, 18, {
      padX: 5,
      padTop: 2,
      padBottom: 2,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  const measureShopRoleButton = useCallback(() => {
    measureTarget("shopRoleButton", shopRoleButtonRef, 12, {
      padX: 5,
      padTop: 10,
      padBottom: -10,
      radiusOffset: 0,
    });
  }, [measureTarget]);

  useEffect(() => {
    if (!isTutorialEnabled || activeFlowId !== "role") return;

    if (currentStep?.targetKey === "shopRoleButton") {
      const timer = setTimeout(measureShopRoleButton, 50);
      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "roleBackButton") {
      const timer = setTimeout(measureBackButton, 50);
      return () => clearTimeout(timer);
    }

    clearTarget("shopRoleButton");
    clearTarget("roleBackButton");
  }, [
    isTutorialEnabled,
    activeFlowId,
    currentStep?.targetKey,
    measureShopRoleButton,
    measureBackButton,
    clearTarget,
  ]);

  // 뒤로가기 버튼 눌렀을 때 튜토리얼 흐름을 이어주기 위한 분기 추가
  const handleTutorialBackPress = async () => {
    const isRoleBackStep =
      isTutorialEnabled && activeFlowId === "role" && currentStep?.id === "role_back_intro";

    if (isRoleBackStep) {
      startTutorial("nav");
    }

    await handleBackPress();
  };

  const handleTutorialSkip = async () => {
    await completeTutorial();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const currentTutorialStep =
    isTutorialEnabled && activeFlowId === "role" && currentStep?.screen === "RolePlaying"
      ? currentStep
      : null;

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={() => {
        measureBackButton();
        measureShopRoleButton();
      }}
    >
      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={nextStep}
        onPressSkip={handleTutorialSkip}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentTutorialStep?.id === "role_back_intro" ? handleTutorialBackPress : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 150 }}
      />

      <View style={styles.topBackground} />

      {/* 상단 뒤로가기 버튼 및 '역할놀이' 제목 */}
      <View style={styles.titleWrap}>
        <BackButton
          navigation={{ ...navigation, goBack: handleTutorialBackPress }}
          top={H * 0.001}
          left={W * 0.05}
          touchableRef={backButtonRef}
        />
        <Text style={styles.title}>역할놀이</Text>
      </View>

      <View
        style={[
          styles.greeniWrap,
          selectedSituation ? styles.greeniWrapSelected : styles.greeniWrap,
        ]}
      >
        <ImageBackground
          style={[
            styles.bubble,
            selectedSituation ? styles.bubbleSelected : styles.bubble,
            useLongBubble && styles.bubbleLong,
          ]}
          source={
            useLongBubble
              ? require("../assets/images/bubble_role_long.png")
              : require("../assets/images/bubble_diary.png")
          }
          resizeMode="stretch"
        >
          <Text
            style={[
              styles.bubbleText,
              selectedSituation ? styles.bubbleTextSelected : styles.bubbleText,
            ]}
          >
            {displayedBubbleText}
          </Text>
        </ImageBackground>
        <Image
          style={[styles.greeni, selectedSituation ? styles.greeniSelected : styles.greeni]}
          source={require("../assets/images/mustache_greeni_big.png")}
        />
      </View>

      {!selectedSituation && (
        <View style={styles.situationWrap}>
          <View ref={shopRoleButtonRef} onLayout={measureShopRoleButton}>
            <Button
              title="가게 주인과 손님"
              backgroundColor={colors.white}
              borderRadius={10}
              borderWidth={2}
              borderColor={colors.greenDark}
              width={345}
              height={51}
              style={{ marginBottom: 12 }}
              onPress={() => handleSituation("shop")}
            />
          </View>
          <Button
            title="선생님과 아이"
            backgroundColor={colors.white}
            borderRadius={10}
            borderWidth={2}
            borderColor={colors.greenDark}
            width={345}
            height={51}
            style={{ marginBottom: 12 }}
            onPress={() => handleSituation("teacher")}
          ></Button>
          <Button
            title="친구 사이"
            backgroundColor={colors.white}
            borderRadius={10}
            borderWidth={2}
            borderColor={colors.greenDark}
            width={345}
            height={51}
            style={{ marginBottom: 12 }}
            onPress={() => handleSituation("friend")}
          ></Button>
        </View>
      )}

      <MicButton
        onRecordComplete={handleRecordComplete}
        disabled={!selectedSituation || isLoading || isAiSpeaking || showErrorModal}
      />

      <Modal transparent visible={showErrorModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>네트워크 오류가 발생했습니다.</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleErrorModalOk}
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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

  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // 그리니가 말하는 부분을 감싸는 Wrapper
  greeniWrap: {
    position: "absolute",
    top: H * 0.17,
    justifyContent: "center",
    alignItems: "center",
  },
  greeniWrapSelected: {
    top: H * 0.2,
  },
  bubble: {
    maxWidth: W * 0.85,
    minWidth: W * 0.5,
    paddingHorizontal: 40,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleSelected: {
    paddingHorizontal: 40,
    paddingVertical: 50,
    marginTop: 30,
  },
  bubbleLong: {
    minWidth: W * 0.5,
    maxWidth: W * 0.85,
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  bubbleText: {
    fontSize: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
    lineHeight: 28,
  },
  bubbleTextSelected: {
    fontSize: 28,
    lineHeight: 28,
  },
  greeni: {
    aspectRatio: 80 / 110,
    width: 80,
    height: 110,
  },
  greeniSelected: {
    aspectRatio: 120 / 165,
    width: 120,
    height: 165,
    marginTop: 20,
  },

  situationWrap: {
    position: "absolute",
    bottom: H * 0.26,
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
