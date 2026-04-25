import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import BackButton from "../components/BackButton";
import TutorialOverlay from "../components/TutorialOverlay";
import colors from "../theme/colors";
import MicButton from "../components/MicButton";
import { createFiveQuestionsActivity } from "../api/activity";
import { createFiveQuestionsHint, checkFiveQuestionsAnswer } from "../api/fiveQuestions";
import { playBase64Mp3, stopAiAudio } from "../utils/audio";
import { ProfileContext } from "../context/ProfileContext";
import { getRandomFiveQuestionsAnswer } from "../utils/fiveQuestionsAnswers";
import { useTutorial } from "../context/TutorialContext";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function TwentyQuestionsScreen({ navigation }) {
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

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [hints, setHints] = useState([]);
  const [currentHint, setCurrentHint] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [bubbleText, setBubbleText] = useState("힌트를 준비하고 있어!");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(true);
  const [isCheckingAnswer, setIsCheckingAnswer] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [canAnswerCurrentQuestion, setCanAnswerCurrentQuestion] = useState(false);
  const [showAnswerText, setShowAnswerText] = useState(false);
  const [isAnswerFeedbackShowing, setIsAnswerFeedbackShowing] = useState(false);

  const initialScoreRef = useRef(null);
  const isSubmittingRef = useRef(false);
  const isMovingNextRef = useRef(false);
  const isScreenActiveRef = useRef(true);
  const nextQuestionTimerRef = useRef(null);

  // 튜토리얼용 다섯고개 Ref
  const rootRef = useRef(null);
  const backButtonRef = useRef(null);

  useEffect(() => {
    if (!initialScoreRef.current) {
      initialScoreRef.current = { correctCount: 0, wrongCount: 0 };
    }

    isScreenActiveRef.current = true;

    return () => {
      isScreenActiveRef.current = false;

      if (nextQuestionTimerRef.current) {
        clearTimeout(nextQuestionTimerRef.current);
        nextQuestionTimerRef.current = null;
      }

      stopAiAudio();
    };
  }, []);

  const getHintListFromResponse = res => {
    const result = res?.result || res || {};
    return Array.isArray(result?.hints) ? result.hints : [];
  };

  const getSessionIdFromResponse = res => {
    const result = res?.result || res || {};
    return result?.sessionId || result?.session_id || "";
  };

  const playHintVoice = useCallback(async audioBase64 => {
    if (!audioBase64) return;
    if (!isScreenActiveRef.current) return;

    try {
      setIsAiSpeaking(true);
      await playBase64Mp3(audioBase64);
    } catch (e) {
      console.log("PLAY FIVE QUESTIONS HINT FAIL:", e);
    } finally {
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }
    }
  }, []);

  const goToNextQuestion = useCallback(callback => {
    if (isMovingNextRef.current) return;
    isMovingNextRef.current = true;
    setCanAnswerCurrentQuestion(false);
    setIsAnswerFeedbackShowing(true);

    if (nextQuestionTimerRef.current) {
      clearTimeout(nextQuestionTimerRef.current);
    }

    nextQuestionTimerRef.current = setTimeout(() => {
      nextQuestionTimerRef.current = null;

      if (!isScreenActiveRef.current) return;

      if (typeof callback === "function") {
        callback();
      }

      loadNewQuestionRef.current();
    }, 2000);
  }, []);

  const loadNewQuestionRef = useRef(() => {});

  const loadNewQuestion = useCallback(async () => {
    try {
      if (!isScreenActiveRef.current) return;

      setIsLoadingQuestion(true);
      setIsCheckingAnswer(false);
      setHints([]);
      setCurrentHint(0);
      setSessionId("");
      setBubbleText("힌트를 준비하고 있어!");
      setCanAnswerCurrentQuestion(false);
      setShowAnswerText(false);
      setIsAnswerFeedbackShowing(false);
      isMovingNextRef.current = false;

      await stopAiAudio();

      if (!isScreenActiveRef.current) return;

      setIsAiSpeaking(false);

      const nextQuestion = getRandomFiveQuestionsAnswer();
      setCurrentQuestion(nextQuestion);

      const res = await createFiveQuestionsHint(nextQuestion.answer);

      if (!isScreenActiveRef.current) return;

      console.log("HINT RAW RES:", res);
      console.log("HINT RESULT:", res?.result);
      console.log("HINTS:", res?.result?.hints);
      console.log("FIRST HINT:", res?.result?.hints?.[0]);
      console.log("FIRST AUDIO BASE64 LENGTH:", res?.result?.hints?.[0]?.audioBase64?.length);

      const nextHints = getHintListFromResponse(res);
      const nextSessionId = getSessionIdFromResponse(res);

      if (!Array.isArray(nextHints) || nextHints.length === 0) {
        throw new Error("힌트를 받아오지 못했어요.");
      }

      setHints(nextHints);
      setSessionId(nextSessionId);
      setCurrentHint(0);
      setBubbleText(nextHints[0]?.text || "첫 번째 힌트를 줄게!");
      setCanAnswerCurrentQuestion(true);
      setIsLoadingQuestion(false);

      if (nextHints[0]?.audioBase64 && isScreenActiveRef.current) {
        await playHintVoice(nextHints[0].audioBase64);
      }
    } catch (e) {
      console.log("CREATE FIVE QUESTIONS HINT FAIL:", e);

      if (isScreenActiveRef.current) {
        setCanAnswerCurrentQuestion(false);
        goToNextQuestion();
      }
    } finally {
      if (isScreenActiveRef.current) {
        setIsLoadingQuestion(false);
      }
    }
  }, [playHintVoice, goToNextQuestion]);

  useEffect(() => {
    loadNewQuestionRef.current = loadNewQuestion;
  }, [loadNewQuestion]);

  // useEffect(() => {
  //   loadNewQuestion();
  // }, [loadNewQuestion]);

  // 튜토리얼 과정 중에는 문제가 자동으로 시작하지 않게
  useEffect(() => {
    if (isFiveTutorial) return;
    loadNewQuestion();
  }, [loadNewQuestion, isFiveTutorial]);

  const showNextHint = useCallback(async () => {
    if (!isScreenActiveRef.current) return false;

    if (currentHint < hints.length - 1) {
      const nextIndex = currentHint + 1;
      const nextHint = hints[nextIndex];

      if (!isScreenActiveRef.current) return false;

      setCurrentHint(nextIndex);
      setBubbleText(nextHint?.text || "다음 힌트를 줄게!");

      if (nextHint?.audioBase64 && isScreenActiveRef.current) {
        await playHintVoice(nextHint.audioBase64);
      }

      return true;
    }

    return false;
  }, [currentHint, hints, playHintVoice]);

  const handleRecordComplete = useCallback(
    async recordPath => {
      if (!recordPath || !currentQuestion?.answer) return;
      if (isCheckingAnswer || isLoadingQuestion) return;
      if (!isScreenActiveRef.current) return;
      if (!canAnswerCurrentQuestion) return;
      if (isAnswerFeedbackShowing) return;

      try {
        setIsCheckingAnswer(true);
        setBubbleText("   ...   ");

        const res = await checkFiveQuestionsAnswer({
          recordPath,
          answer: currentQuestion.answer,
          sessionId,
        });

        if (!isScreenActiveRef.current) return;

        console.log("CHECK RES:", res);

        const result = res?.result || res || {};
        const isCorrect = !!result.correct;

        if (isCorrect) {
          setCorrectCount(prev => prev + 1);
          setShowAnswerText(true);
          setBubbleText("맞았어!");
          goToNextQuestion(() => {
            if (isScreenActiveRef.current) {
              setShowAnswerText(false);
              setIsAnswerFeedbackShowing(false);
            }
          });
          return;
        }

        const hasNextHint = await showNextHint();

        if (!isScreenActiveRef.current) return;

        if (hasNextHint) {
          setIsCheckingAnswer(false);
          return;
        }

        setWrongCount(prev => prev + 1);
        setShowAnswerText(true);
        setBubbleText("틀렸어!");
        goToNextQuestion(() => {
          if (isScreenActiveRef.current) {
            setShowAnswerText(false);
            setIsAnswerFeedbackShowing(false);
          }
        });
      } catch (e) {
        console.log("CHECK FIVE QUESTIONS ANSWER FAIL:", e);

        if (isScreenActiveRef.current) {
          setBubbleText("다시 한 번 말해줄래?");
        }
      } finally {
        if (isScreenActiveRef.current) {
          setIsCheckingAnswer(false);
        }
      }
    },
    [
      currentQuestion?.answer,
      sessionId,
      isCheckingAnswer,
      isLoadingQuestion,
      canAnswerCurrentQuestion,
      isAnswerFeedbackShowing,
      showNextHint,
      goToNextQuestion,
    ],
  );

  const handleBackPress = useCallback(async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    isScreenActiveRef.current = false;

    if (nextQuestionTimerRef.current) {
      clearTimeout(nextQuestionTimerRef.current);
      nextQuestionTimerRef.current = null;
    }

    try {
      await stopAiAudio();
      setIsAiSpeaking(false);

      const initialScore = initialScoreRef.current ?? { correctCount, wrongCount };
      const hasScoreChanged =
        initialScore.correctCount !== correctCount || initialScore.wrongCount !== wrongCount;

      if (hasScoreChanged && selectedProfile?.profileId) {
        await createFiveQuestionsActivity({
          profileId: selectedProfile.profileId,
          count: correctCount,
        });
      }
    } catch (e) {
      console.log("CREATE FIVE QUESTIONS ACTIVITY FAIL:", e);
    } finally {
      isSubmittingRef.current = false;
      navigation.goBack();
    }
  }, [correctCount, wrongCount, navigation, selectedProfile?.profileId]);

  // 다섯고개 Ref 측정
  const measureBackButton = useCallback(() => {
    if (!rootRef.current || !backButtonRef.current) return;

    const padX = 5;
    const padY = 5;
    const radiusOffset = 10;

    rootRef.current.measureInWindow((rootX, rootY) => {
      backButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("fiveBackButton", {
          x: x - rootX - padX,
          y: y - rootY - padY,
          width: width + padX * 2,
          height: height + padY * 2,
          borderRadius: 18 + radiusOffset,
        });
      });
    });
  }, [registerTarget]);

  useEffect(() => {
    if (!isTutorialEnabled || activeFlowId !== "five") return;

    if (currentStep?.targetKey === "fiveBackButton") {
      const timer = setTimeout(measureBackButton, 50);
      return () => clearTimeout(timer);
    }

    clearTarget("fiveBackButton");
  }, [isTutorialEnabled, activeFlowId, currentStep?.targetKey, measureBackButton, clearTarget]);

  // 다섯고개 튜토리얼 이후 튜토리얼 흐름을 이어주기 위한 분기 추가
  const handleTutorialBackPress = async () => {
    const isBackTutorialStep =
      isTutorialEnabled && activeFlowId === "five" && currentStep?.id === "five_back_intro";

    if (isBackTutorialStep) {
      startTutorial("role");
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

  const progress = hints.length > 0 ? (currentHint + 1) / hints.length : 0;
  const isMicDisabled =
    isLoadingQuestion || isCheckingAnswer || isAiSpeaking || isAnswerFeedbackShowing;

  const isFiveTutorial = isTutorialEnabled && activeFlowId === "five";
  const currentTutorialStep =
    isTutorialEnabled && activeFlowId === "five" && currentStep?.screen === "FiveQuestions"
      ? currentStep
      : null;

  return (
    <View ref={rootRef} style={styles.root} onLayout={measureBackButton}>
      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={nextStep}
        onPressSkip={handleTutorialSkip}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentTutorialStep?.id === "five_back_intro" ? handleTutorialBackPress : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 130 }}
      />

      <View style={styles.topBackground} />

      {/* 상단 뒤로가기 버튼 및 '다섯고개' 제목 */}
      <View style={styles.titleWrap}>
        <BackButton
          navigation={{ ...navigation, goBack: handleTutorialBackPress }}
          top={H * 0.001}
          left={W * 0.05}
          touchableRef={backButtonRef}
        />
        <Text style={styles.title}>다섯고개</Text>
      </View>

      {/* 점수/힌트 진행도 */}
      <View style={styles.scoreWrap}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>

        <View style={styles.hintProgressTextWrap}>
          <Text style={styles.hintProgressLabel}>힌트 진행도</Text>
          <Text style={styles.hintProgressValue}>
            {hints.length > 0 ? currentHint + 1 : 0}/{hints.length}
          </Text>
        </View>

        <View style={styles.scoreDetailWrap}>
          <Text style={styles.scoreItem}>맞힌 개수</Text>
          <Text style={styles.scoreItemValue}>{correctCount}개</Text>
          <Text style={styles.scoreItem}>틀린 개수</Text>
          <Text style={[styles.scoreItemValue, { color: colors.pinkDark }]}>{wrongCount}개</Text>
        </View>
      </View>

      {/* 문제 */}
      <View style={styles.questionsWrap}>
        <Text style={styles.questionText}>
          {showAnswerText
            ? currentQuestion?.answer || "   ...   "
            : currentQuestion?.initial || "   ...   "}
        </Text>
      </View>

      {/* greeni  + 힌트*/}
      <View style={styles.greeniWrap}>
        <Image style={styles.greeni} source={require("../assets/images/20_greeni_big.png")} />

        <ImageBackground
          source={require("../assets/images/bubble_20.png")}
          style={styles.hintBubble}
          resizeMode="stretch"
        >
          <Text style={styles.hintText}>{bubbleText}</Text>
        </ImageBackground>
      </View>

      <MicButton onRecordComplete={handleRecordComplete} disabled={isMicDisabled} />
    </View>
  );
}

const styles = StyleSheet.create({
  // 전체 화면, 아이템 세로 정렬, 가로세로 중앙 정렬, 배경색
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
    height: H * 0.72,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  // root 기준으로 정렬, 수평 중앙 정렬, colorToken 변경
  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
  },
  // colorToken 변경
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // 힌트 진행도 및 점수
  scoreWrap: {
    width: 345,
    height: 115,
    top: -H * 0.15,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressBarBackground: {
    width: 293,
    height: 10,
    top: H * 0.02,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.green,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.green,
  },
  hintProgressTextWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    top: H * 0.002,
    width: 293,
    zIndex: 4,
  },
  hintProgressLabel: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
  hintProgressValue: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
  scoreDetailWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 293,
    top: -H * 0.02,
  },
  scoreItem: {
    fontSize: 14,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
  },
  scoreItemValue: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: colors.greenDark,
  },

  // 문제 및 힌트
  questionsWrap: {
    width: 345,
    height: 223,
    top: -H * 0.11,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  questionText: {
    fontSize: 40,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
    fontWeight: "bold",
  },
  hintBubble: {
    maxWidth: W * 0.65,
    paddingHorizontal: 30,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
    top: -45,
  },
  hintText: {
    fontSize: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
    lineHeight: 34,
  },

  // 그리니
  greeniWrap: {
    position: "absolute",
    flexDirection: "row",
    top: H * 0.6,
    left: W * 0.08,
    zIndex: 3,
  },
  greeni: {
    aspectRatio: 92.35 / 124,
    width: W * 0.25,
  },
});
