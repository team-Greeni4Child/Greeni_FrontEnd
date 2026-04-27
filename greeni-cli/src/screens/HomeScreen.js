import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Platform,
  Modal,
} from "react-native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";
import TutorialOverlay from "../components/TutorialOverlay";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../App";
import { ProfileContext } from "../context/ProfileContext";
import { useTutorial } from "../context/TutorialContext";
import { getAccessToken, clearAuth } from "../utils/tokenStorage";
import { getDiaryByDay } from "../api/diary";

const { width: W, height: H } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const { setStep } = useContext(AuthContext);
  const { selectedProfile } = useContext(ProfileContext);
  const {
    isTutorialEnabled,
    activeFlowId,
    currentStep,
    targets,
    startedFlows,
    isProfileTutorialCompleted,
    isTutorialReady,
    startTutorial,
    nextStep,
    stopTutorial,
    completeTutorial,
    registerTarget,
    clearTarget,
  } = useTutorial();

  const [tab, setTab] = useState(0);

  // 튜토리얼용 홈화면 Ref
  const rootRef = useRef(null);
  const diaryButtonRef = useRef(null);
  const fiveQuestionsButtonRef = useRef(null);
  const rolePlayingButtonRef = useRef(null);
  const homeTabButtonRef = useRef(null);
  const calendarTabButtonRef = useRef(null);

  // "오늘 일기 작성 완료" 여부
  const [hasWrittenTodayDiary, setHasWrittenTodayDiary] = useState(false);

  // 안내 모달 on/off
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  // 종료 확인 모달 on/off
  const [showExitModal, setShowExitModal] = useState(false);

  // 일기 존재 여부 확인 중복 클릭 방지
  const [isCheckingDiary, setIsCheckingDiary] = useState(false);
  const homeStartedKey = selectedProfile?.profileId ? `home:${selectedProfile.profileId}` : "home";

  // 인증 상태 확인
  const checkAuth = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        await clearAuth();
        setStep("auth");
      }
    } catch (e) {
      console.log("AUTH CHECK FAIL:", e);
      await clearAuth();
      setStep("auth");
    }
  };

  const isEmptyDiaryResult = result => {
    if (result == null) return true;
    if (Array.isArray(result)) return result.length === 0;
    if (typeof result === "object") return Object.keys(result).length === 0;
    return false;
  };

  const fetchTodayDiaryStatus = useCallback(async () => {
    try {
      const profileId = selectedProfile?.profileId;
      if (!profileId) {
        setHasWrittenTodayDiary(false);
        return false;
      }

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();

      const res = await getDiaryByDay({
        year,
        month,
        day,
        profileId,
      });

      const exists = !isEmptyDiaryResult(res?.result);
      setHasWrittenTodayDiary(exists);
      return exists;
    } catch (e) {
      console.log("GET TODAY DIARY FAIL:", e);
      setHasWrittenTodayDiary(false);
      return false;
    }
  }, [selectedProfile?.profileId]);

  // 화면 들어올 때 인증 체크 + 오늘 일기 여부 갱신
  useFocusEffect(
    useCallback(() => {
      checkAuth();
      fetchTodayDiaryStatus();
    }, [fetchTodayDiaryStatus]),
  );

  // 일기 버튼 클릭 처리
  const handlePressDiary = async (params = undefined) => {
    if (isCheckingDiary) return;

    try {
      setIsCheckingDiary(true);

      // 버튼 누르는 시점에 한 번 더 최신 상태 확인
      const alreadyWritten = await fetchTodayDiaryStatus();

      if (alreadyWritten) {
        setShowDiaryModal(true);
        return;
      }

      navigation.navigate("Diary", params);
    } finally {
      setIsCheckingDiary(false);
    }
  };

  // 일기버튼 눌렀을 때 다음 튜토리얼로 넘어가기 위한 핸들러
  const handleTutorialPressDiary = async () => {
    const isDiaryIntroStep =
      isTutorialEnabled && activeFlowId === "home" && currentStep?.id === "diary_intro";

    if (isDiaryIntroStep) {
      stopTutorial();
      startTutorial("diary");
      await handlePressDiary({ tutorialFlowId: "diary" });
      return;
    }

    await handlePressDiary();
  };

  const handlePressFiveQuestions = (params = undefined) => {
    navigation.navigate("FiveQuestions", params);
  };

  // 다섯고개 버튼 눌렀을 때 다음 튜토리얼로 넘어가기 위한 핸들러
  const handleTutorialPressFiveQuestions = () => {
    const isFiveIntroStep =
      isTutorialEnabled && activeFlowId === "five" && currentStep?.id === "home_five_intro";

    if (isFiveIntroStep) {
      nextStep();
      handlePressFiveQuestions({ tutorialFlowId: "five" });
      return;
    }

    handlePressFiveQuestions();
  };

  const handlePressRolePlaying = (params = undefined) => {
    navigation.navigate("RolePlaying", params);
  };

  // 역할놀이 버튼 눌렀을 때 다음 튜토리얼로 넘어가기 위한 핸들러
  const handleTutorialPressRolePlaying = () => {
    const isRoleIntroStep =
      isTutorialEnabled && activeFlowId === "role" && currentStep?.id === "home_role_intro";

    if (isRoleIntroStep) {
      nextStep();
      handlePressRolePlaying({ tutorialFlowId: "role" });
      return;
    }

    handlePressRolePlaying();
  };

  const handlePressCalendar = (params = undefined) => {
    setTab(1);
    navigation.navigate("Calendar", params);
  };

  // 달력 버튼 눌렀을 때 다음 튜토리얼로 넘어가기 위한 핸들러
  const handleTutorialPressCalendar = () => {
    const isCalendarIntroStep =
      isTutorialEnabled && activeFlowId === "nav" && currentStep?.id === "nav_calendar_intro";

    if (isCalendarIntroStep) {
      startTutorial("calendar");
      handlePressCalendar({ tutorialFlowId: "calendar" });
      return;
    }

    handlePressCalendar();
  };

  const handleTutorialSkip = async () => {
    await completeTutorial();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  // 종료 모달 띄우기
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS !== "android") return false;

        // 다른 모달이 열려있으면 닫기
        if (showDiaryModal) {
          setShowDiaryModal(false);
          return true;
        }

        if (showExitModal) {
          setShowExitModal(false);
          return true;
        }

        // 종료 확인 모달 띄우기
        setShowExitModal(true);
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [showDiaryModal, showExitModal]),
  );

  // 모달 확인 버튼 처리
  const handleDiaryModalOk = () => {
    setShowDiaryModal(false);
  };

  // 홈화면 Ref 측정
  const measureDiaryButton = useCallback(() => {
    if (!rootRef.current || !diaryButtonRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      diaryButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("diaryButton", {
          x: x - rootX - 5,
          y: y - rootY - 5,
          width: width + 10,
          height: height + 10,
          borderRadius: 15,
        });
      });
    });
  }, [registerTarget]);

  const measureFiveQuestionsButton = useCallback(() => {
    if (!rootRef.current || !fiveQuestionsButtonRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      fiveQuestionsButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("fiveQuestionsButton", {
          x: x - rootX - 5,
          y: y - rootY - 5,
          width: width + 10,
          height: height + 10,
          borderRadius: 15,
        });
      });
    });
  }, [registerTarget]);

  const measureRolePlayingButton = useCallback(() => {
    if (!rootRef.current || !rolePlayingButtonRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      rolePlayingButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("rolePlayingButton", {
          x: x - rootX - 5,
          y: y - rootY - 5,
          width: width + 10,
          height: height + 10,
          borderRadius: 15,
        });
      });
    });
  }, [registerTarget]);

  const measureHomeTabButton = useCallback(() => {
    if (!rootRef.current || !homeTabButtonRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      homeTabButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("homeTabButton", {
          x: x - rootX + 12,
          y: y - rootY - 13,
          width: width - 25,
          height: height + 25,
          borderRadius: 10,
        });
      });
    });
  }, [registerTarget]);

  const measureCalendarTabButton = useCallback(() => {
    if (!rootRef.current || !calendarTabButtonRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      calendarTabButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("calendarTabButton", {
          x: x - rootX + 12,
          y: y - rootY - 13,
          width: width - 25,
          height: height + 25,
          borderRadius: 10,
        });
      });
    });
  }, [registerTarget]);

  useEffect(() => {
    if (startedFlows[homeStartedKey]) return;
    if (!selectedProfile?.profileId) return;
    if (!isTutorialReady) return;
    if (isProfileTutorialCompleted) return;
    if (isTutorialEnabled) return;
    startTutorial("home");
  }, [
    startedFlows,
    homeStartedKey,
    selectedProfile?.profileId,
    isTutorialReady,
    isProfileTutorialCompleted,
    isTutorialEnabled,
    startTutorial,
  ]);

  useEffect(() => {
    if (!isTutorialEnabled) return;

    if (currentStep?.targetKey === "diaryButton") {
      const timer = setTimeout(() => {
        measureDiaryButton();
      }, 50);

      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "fiveQuestionsButton") {
      const timer = setTimeout(() => {
        measureFiveQuestionsButton();
      }, 50);

      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "rolePlayingButton") {
      const timer = setTimeout(() => {
        measureRolePlayingButton();
      }, 50);

      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "homeTabButton") {
      const timer = setTimeout(() => {
        measureHomeTabButton();
      }, 50);

      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "calendarTabButton") {
      const timer = setTimeout(() => {
        measureCalendarTabButton();
      }, 50);

      return () => clearTimeout(timer);
    }

    clearTarget("diaryButton");
    clearTarget("fiveQuestionsButton");
    clearTarget("rolePlayingButton");
    clearTarget("homeTabButton");
    clearTarget("calendarTabButton");
  }, [
    isTutorialEnabled,
    currentStep?.targetKey,
    clearTarget,
    measureDiaryButton,
    measureFiveQuestionsButton,
    measureRolePlayingButton,
    measureHomeTabButton,
    measureCalendarTabButton,
  ]);

  const currentTutorialStep =
    isTutorialEnabled && currentStep?.screen === "Home" ? currentStep : null;

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={() => {
        measureDiaryButton();
        measureFiveQuestionsButton();
        measureRolePlayingButton();
        measureHomeTabButton();
        measureCalendarTabButton();
      }}
    >
      {/* 오늘 일기 작성 완료 안내 모달 */}
      <Modal transparent visible={showDiaryModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>오늘의 일기 작성 완료!{"\n"}달력에서 확인해주세요!</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={handleDiaryModalOk}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 앱 종료 확인 모달 */}
      <Modal transparent visible={showExitModal} onRequestClose={() => setShowExitModal(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>앱을 종료하시겠습니까?</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton, { width: "50%", backgroundColor: colors.ivory }]}
                onPress={() => BackHandler.exitApp()}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { width: "50%" }]}
                onPress={() => setShowExitModal(false)}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>아니요</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={nextStep}
        onPressSkip={handleTutorialSkip}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentTutorialStep?.id === "diary_intro"
            ? handleTutorialPressDiary
            : currentTutorialStep?.id === "home_five_intro"
            ? handleTutorialPressFiveQuestions
            : currentTutorialStep?.id === "home_role_intro"
            ? handleTutorialPressRolePlaying
            : currentTutorialStep?.id === "nav_calendar_intro"
            ? handleTutorialPressCalendar
            : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 90 }}
      />

      {/* 연못 */}
      <Image
        source={require("../assets/images/pond_home.png")}
        style={styles.pond}
        resizeMode="cover"
      />

      {/* 네비게이션 바 */}
      <NavigationBar
        state={tab}
        tabRefs={[homeTabButtonRef, calendarTabButtonRef]}
        onTabPress={i => {
          setTab(i);
          if (i === 0) navigation.navigate("Home");
          if (i === 1) handleTutorialPressCalendar();
          if (i === 2) navigation.navigate("Statistics");
          if (i === 3) navigation.navigate("MyPage");
        }}
      />

      {/* 말풍선 */}
      <ImageBackground
        source={require("../assets/images/bubble_home.png")}
        style={styles.bubble}
        resizeMode="stretch"
      >
        <Text style={styles.bubbleText}>
          안녕 나는 그리니야!{"\n"}오늘은 또 어떤 하루를 보냈어?{" "}
        </Text>
      </ImageBackground>

      {/* 그리니 */}
      <Image
        source={require("../assets/images/pond_greeni.png")}
        style={styles.greeni}
        resizeMode="contain"
      />

      {/* 버튼들 */}
      <View style={styles.grid}>
        {/* 일기 */}
        <TouchableOpacity
          ref={diaryButtonRef}
          style={[styles.diaryButton, { backgroundColor: colors.pink }]}
          onPress={handleTutorialPressDiary}
          disabled={isCheckingDiary}
          onLayout={measureDiaryButton}
        >
          <Image source={require("../assets/images/icon_diary.png")} style={styles.icon} />
          <Text style={styles.buttonText}>일기</Text>
        </TouchableOpacity>

        {/* 다섯고개 */}
        <TouchableOpacity
          ref={fiveQuestionsButtonRef}
          style={[styles.button, { backgroundColor: colors.green }]}
          onPress={handleTutorialPressFiveQuestions}
          onLayout={measureFiveQuestionsButton}
        >
          <Image source={require("../assets/images/icon_twenty.png")} style={styles.icon} />
          <Text style={styles.buttonText}>다섯고개</Text>
        </TouchableOpacity>

        {/* 역할놀이 */}
        <TouchableOpacity
          ref={rolePlayingButtonRef}
          style={[styles.button, { backgroundColor: "#E1EE95" }]}
          onPress={handleTutorialPressRolePlaying}
          onLayout={measureRolePlayingButton}
        >
          <Image source={require("../assets/images/icon_role.png")} style={styles.icon} />
          <Text style={styles.buttonText}>역할놀이</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  pond: {
    position: "absolute",
    top: H * 0.2,
    width: W,
    height: H * 1.2,
  },

  bubble: {
    bottom: -10,
    maxWidth: W * 0.85,
    paddingHorizontal: 40,
    paddingVertical: 60,
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
    height: H * 0.2,
    marginRight: H * 0.04,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: W * 0.85,
    marginTop: 10,
    marginBottom: H * 0.15,
  },
  diaryButton: {
    width: W * 0.38 * 2 + 16,
    height: W * 0.38,
    margin: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  button: {
    width: W * 0.38,
    height: W * 0.38,
    margin: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    height: "50%",
    marginBottom: 10,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
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
    width: "100%",
    backgroundColor: colors.green,
  },
  modalButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
});
