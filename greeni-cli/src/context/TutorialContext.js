import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TutorialContext = createContext(null);

const TUTORIAL_COMPLETED_KEY = "hasCompletedOnboardingTutorial";

const TUTORIAL_FLOWS = {
  home: {
    initialStepId: "intro",
    steps: {
      intro: {
        id: "intro",
        screen: "Home",
        type: "message",
        message: "안녕 나는 그리니야.\n도움이 필요하면 내게 말해줘!",
        nextStepId: "skip_intro",
      },
      skip_intro: {
        id: "skip_intro",
        screen: "Home",
        type: "message",
        message: "바로 시작하고 싶다면,\n건너뛰기 버튼을 눌러줘!",
        nextStepId: "home_intro",
      },
      home_intro: {
        id: "home_intro",
        screen: "Home",
        type: "message",
        message: "여기는 홈화면이야!\n여기에서 하고 싶은 활동을 선택할 수 있어.",
        nextStepId: "diary_intro",
      },
      diary_intro: {
        id: "diary_intro",
        screen: "Home",
        type: "target",
        message: "먼저 일기를 써볼까?",
        targetKey: "diaryButton",
        nextStepId: null,
        allowBackgroundPress: false,
      },
    },
  },
  diary: {
    initialStepId: "mic_intro",
    steps: {
      mic_intro: {
        id: "mic_intro",
        screen: "Diary",
        type: "target",
        message:
          "마이크 버튼을 누르면 나와 대화 할 수 있어. 할 말을 다하면 버튼을 한 번 더 누르면 돼!",
        targetKey: "micButton",
        nextStepId: "draw_button_intro",
        allowBackgroundPress: true,
      },
      draw_button_intro: {
        id: "draw_button_intro",
        screen: "Diary",
        type: "message",
        message: "10번 대화를 주고받고 나면, 그림일기를 그리러 갈거야.",
        nextStepId: "draw_button_target_intro",
        allowBackgroundPress: true,
      },
      draw_button_target_intro: {
        id: "draw_button_target_intro",
        screen: "Diary",
        type: "target",
        message: "대화를 그만하고, 바로 그림일기를 그리고 싶으면 여기를 눌러줘",
        targetKey: "drawDiaryButton",
        nextStepId: "tools_intro",
        allowBackgroundPress: false,
      },
      tools_intro: {
        id: "tools_intro",
        screen: "DiaryDraw",
        type: "target",
        message: "펜이랑 지우개로 그림을 그리고,\n사진도 넣을 수 있어!",
        targetKey: "toolsBar",
        nextStepId: "save_intro",
        allowBackgroundPress: true,
      },
      save_intro: {
        id: "save_intro",
        screen: "DiaryDraw",
        type: "target",
        message: "그림을 다 그렸으면, 저장하기 버튼을 눌러줘!",
        targetKey: "saveButton",
        nextStepId: null,
        allowBackgroundPress: false,
      },
    },
  },
  five: {
    initialStepId: "home_five_intro",
    steps: {
      home_five_intro: {
        id: "home_five_intro",
        screen: "Home",
        type: "target",
        message: "이번에는 다섯고개를 하러 갈까?",
        targetKey: "fiveQuestionsButton",
        nextStepId: "five_intro_1",
        allowBackgroundPress: false,
      },
      five_intro_1: {
        id: "five_intro_1",
        screen: "FiveQuestions",
        type: "message",
        message: "내가 주는 힌트를 잘 보고 정답을 맞혀주면 돼!",
        nextStepId: "five_intro_2",
        allowBackgroundPress: true,
      },
      five_intro_2: {
        id: "five_intro_2",
        screen: "FiveQuestions",
        type: "message",
        message: "문제를 다 풀면 계속하기와 그만하기를 선택할 수 있어.",
        nextStepId: "five_back_intro",
        allowBackgroundPress: true,
      },
      five_back_intro: {
        id: "five_back_intro",
        screen: "FiveQuestions",
        type: "target",
        message: "위에 있는 뒤로가기 버튼을 눌러 홈화면으로 돌아가자!",
        targetKey: "fiveBackButton",
        nextStepId: null,
        allowBackgroundPress: false,
      },
    },
  },
  role: {
    initialStepId: "home_role_intro",
    steps: {
      home_role_intro: {
        id: "home_role_intro",
        screen: "Home",
        type: "target",
        message: "이제 역할놀이를 해볼까?",
        targetKey: "rolePlayingButton",
        nextStepId: "role_intro_1",
        allowBackgroundPress: false,
      },
      role_intro_1: {
        id: "role_intro_1",
        screen: "RolePlaying",
        type: "target",
        message: "나와 해보고 싶은 상황을 하나 고르면 대화를 시작할 수 있어!",
        targetKey: "shopRoleButton",
        nextStepId: "role_intro_2",
        allowBackgroundPress: true,
      },
      role_intro_2: {
        id: "role_intro_2",
        screen: "RolePlaying",
        type: "message",
        message: "역할놀이가 끝나면 다시하기와 그만하기를 선택할 수 있어.",
        nextStepId: "role_back_intro",
        allowBackgroundPress: true,
      },
      role_back_intro: {
        id: "role_back_intro",
        screen: "RolePlaying",
        type: "target",
        message: "위에 있는 뒤로가기 버튼을 눌러 홈화면으로 돌아가자!",
        targetKey: "roleBackButton",
        nextStepId: null,
        allowBackgroundPress: false,
      },
    },
  },
  nav: {
    initialStepId: "nav_intro",
    steps: {
      nav_intro: {
        id: "nav_intro",
        screen: "Home",
        type: "message",
        message: "이제 아래에 있는 버튼에 대해 설명해줄게.",
        nextStepId: "nav_home_intro",
        allowBackgroundPress: true,
      },
      nav_home_intro: {
        id: "nav_home_intro",
        screen: "Home",
        type: "target",
        message: "이 버튼을 눌러봐!\n언제든지 여기로 돌아올 수 있어!",
        targetKey: "homeTabButton",
        nextStepId: "nav_calendar_intro",
        allowBackgroundPress: true,
      },
      nav_calendar_intro: {
        id: "nav_calendar_intro",
        screen: "Home",
        type: "target",
        message: "이 버튼을 누르면\n전에 쓴 일기를 볼 수 있어!",
        targetKey: "calendarTabButton",
        nextStepId: null,
        allowBackgroundPress: false,
      },
    },
  },
  calendar: {
    initialStepId: "calendar_date_intro",
    steps: {
      calendar_date_intro: {
        id: "calendar_date_intro",
        screen: "Calendar",
        type: "target",
        message: "일기를 작성하면 감정 스티커가 붙어.\n스티커가 붙어있는 날을 눌러볼까?",
        targetKey: "tutorialDiaryDate",
        nextStepId: "record_intro_1",
        allowBackgroundPress: false,
      },
      record_intro_1: {
        id: "record_intro_1",
        screen: "TutorialDiaryRecord",
        type: "message",
        message: "이전에 그린 그림일기는 여기서 다시 볼 수 있어.",
        nextStepId: "record_intro_2",
        allowBackgroundPress: true,
      },
      record_intro_2: {
        id: "record_intro_2",
        screen: "TutorialDiaryRecord",
        type: "target",
        message: "헤드셋 버튼을 누르면,\n나랑 했던 대화를 다시 들을 수 있어.",
        targetKey: "diaryRecordHeadsetButton",
        nextStepId: "record_toggle_intro",
        allowBackgroundPress: true,
      },
      record_toggle_intro: {
        id: "record_toggle_intro",
        screen: "TutorialDiaryRecord",
        type: "target",
        message: "아래 버튼을 누르면 오늘의 기분,\n키워드, 대화 내용도 볼 수 있어!",
        targetKey: "diaryRecordToggle",
        nextStepId: "record_back_intro",
        allowBackgroundPress: false,
      },
      record_back_intro: {
        id: "record_back_intro",
        screen: "TutorialDiaryRecord",
        type: "target",
        message: "위에 있는 뒤로가기 버튼을 눌러 달력으로 돌아가자!",
        targetKey: "diaryRecordBackButton",
        nextStepId: null,
        allowBackgroundPress: false,
      },
    },
  },
  stats: {
    initialStepId: "stats_calendar_intro",
    steps: {
      stats_calendar_intro: {
        id: "stats_calendar_intro",
        screen: "Calendar",
        type: "target",
        message: "이 버튼을 눌러봐!",
        targetKey: "statisticsTabButton",
        nextStepId: "stats_intro",
        allowBackgroundPress: false,
      },
      stats_intro: {
        id: "stats_intro",
        screen: "Statistics",
        type: "message",
        message: "여기서는 너의 활동을 한눈에 볼 수 있어!",
        nextStepId: "stats_mypage_intro",
        allowBackgroundPress: true,
      },
      stats_mypage_intro: {
        id: "stats_mypage_intro",
        screen: "Statistics",
        type: "target",
        message: "이 버튼을 눌러봐!",
        targetKey: "myPageTabButton",
        nextStepId: "mypage_intro_1",
        allowBackgroundPress: false,
      },
      mypage_intro_1: {
        id: "mypage_intro_1",
        screen: "MyPage",
        type: "message",
        message: "여기는 마이페이지야!",
        nextStepId: "mypage_intro_2",
        allowBackgroundPress: true,
      },
      mypage_intro_2: {
        id: "mypage_intro_2",
        screen: "MyPage",
        type: "message",
        message: "여기서는 모은 배지를 볼 수 있어.",
        nextStepId: "home_return_intro",
        allowBackgroundPress: true,
      },
      home_return_intro: {
        id: "home_return_intro",
        screen: "Home",
        type: "message",
        message: "이제 준비 끝! 앞으로도 나를 많이 찾아줘!",
        nextStepId: null,
        allowBackgroundPress: true,
      },
    },
  },
};

function getStep(flowId, stepId) {
  if (!flowId || !stepId) return null;
  return TUTORIAL_FLOWS[flowId]?.steps?.[stepId] ?? null;
}

export function TutorialProvider({ children }) {
  const [isTutorialEnabled, setIsTutorialEnabled] = useState(false);
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [activeStepId, setActiveStepId] = useState(null);
  const [targets, setTargets] = useState({});
  const [startedFlows, setStartedFlows] = useState({});
  const [tutorialDiary, setTutorialDiary] = useState(null);
  const [hasCompletedTutorial, setHasCompletedTutorial] = useState(false);
  const [isTutorialReady, setIsTutorialReady] = useState(false);

  const currentStep = useMemo(
    () => getStep(activeFlowId, activeStepId),
    [activeFlowId, activeStepId],
  );

  useEffect(() => {
    let isMounted = true;

    const loadTutorialStatus = async () => {
      try {
        const savedValue = await AsyncStorage.getItem(TUTORIAL_COMPLETED_KEY);

        if (!isMounted) return;
        setHasCompletedTutorial(savedValue === "true");
      } catch (e) {
        console.log("LOAD TUTORIAL STATUS FAIL:", e);
      } finally {
        if (isMounted) {
          setIsTutorialReady(true);
        }
      }
    };

    loadTutorialStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const createTutorialDiary = useCallback(() => {
    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
      today.getDate(),
    ).padStart(2, "0")}`;

    return {
      date,
      emotion: "HAPPY",
      keyword: "튜토리얼",
      summary: "오늘은 튜토리얼을 따라\n그리니와 함께 앱을 둘러봤어!",
      localImageSource: require("../assets/images/icon_diary.png"),
    };
  }, []);

  const startTutorial = useCallback(
    (flowId, initialStepId = null) => {
      if (hasCompletedTutorial) return;

      const flow = TUTORIAL_FLOWS[flowId];
      if (!flow) return;

      setIsTutorialEnabled(true);
      setActiveFlowId(flowId);
      setActiveStepId(initialStepId || flow.initialStepId);
      setStartedFlows(prev => ({
        ...prev,
        [flowId]: true,
      }));

      if (flowId === "calendar") {
        setTutorialDiary(prev => prev ?? createTutorialDiary());
      }
    },
    [createTutorialDiary, hasCompletedTutorial],
  );

  const stopTutorial = useCallback(() => {
    setIsTutorialEnabled(false);
    setActiveFlowId(null);
    setActiveStepId(null);
    setTargets({});
    setTutorialDiary(null);
  }, []);

  const completeTutorial = useCallback(async () => {
    try {
      await AsyncStorage.setItem(TUTORIAL_COMPLETED_KEY, "true");
      setHasCompletedTutorial(true);
    } catch (e) {
      console.log("SAVE TUTORIAL STATUS FAIL:", e);
    } finally {
      stopTutorial();
    }
  }, [stopTutorial]);

  const nextStep = useCallback(() => {
    const nextStepId = currentStep?.nextStepId ?? null;

    if (!nextStepId) {
      completeTutorial();
      return;
    }

    setActiveStepId(nextStepId);
  }, [completeTutorial, currentStep]);

  const goToStep = useCallback(
    stepId => {
      const step = getStep(activeFlowId, stepId);
      if (!step) return;
      setActiveStepId(stepId);
    },
    [activeFlowId],
  );

  const registerTarget = useCallback((targetKey, layout) => {
    setTargets(prev => {
      const currentTarget = prev[targetKey];
      if (
        currentTarget &&
        currentTarget.x === layout.x &&
        currentTarget.y === layout.y &&
        currentTarget.width === layout.width &&
        currentTarget.height === layout.height &&
        currentTarget.borderRadius === layout.borderRadius
      ) {
        return prev;
      }

      return {
        ...prev,
        [targetKey]: layout,
      };
    });
  }, []);

  const clearTarget = useCallback(targetKey => {
    setTargets(prev => {
      if (!(targetKey in prev)) {
        return prev;
      }

      const next = { ...prev };
      delete next[targetKey];
      return next;
    });
  }, []);

  const clearTargets = useCallback(() => {
    setTargets({});
  }, []);

  const clearTutorialDiary = useCallback(() => {
    setTutorialDiary(null);
  }, []);

  const resetTutorial = useCallback(
    flowId => {
      if (!flowId) return;

      setStartedFlows(prev => {
        const next = { ...prev };
        delete next[flowId];
        return next;
      });

      if (activeFlowId === flowId) {
        stopTutorial();
      }
    },
    [activeFlowId, stopTutorial],
  );

  const value = useMemo(
    () => ({
      isTutorialEnabled,
      activeFlowId,
      activeStepId,
      currentStep,
      targets,
      tutorialDiary,
      startedFlows,
      hasCompletedTutorial,
      isTutorialReady,
      startTutorial,
      stopTutorial,
      completeTutorial,
      nextStep,
      goToStep,
      registerTarget,
      clearTarget,
      clearTargets,
      clearTutorialDiary,
      resetTutorial,
    }),
    [
      isTutorialEnabled,
      activeFlowId,
      activeStepId,
      currentStep,
      targets,
      tutorialDiary,
      startedFlows,
      hasCompletedTutorial,
      isTutorialReady,
      clearTutorialDiary,
    ],
  );

  return <TutorialContext.Provider value={value}>{children}</TutorialContext.Provider>;
}

export function useTutorial() {
  const context = useContext(TutorialContext);

  if (!context) {
    throw new Error("useTutorial must be used within TutorialProvider");
  }

  return context;
}
