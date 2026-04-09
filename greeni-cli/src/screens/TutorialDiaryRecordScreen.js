import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import DiarySummaryToggle from "../components/DiarySummaryToggle";
import TutorialOverlay from "../components/TutorialOverlay";
import { useTutorial } from "../context/TutorialContext";

const { width: W, height: H } = Dimensions.get("window");

const emotionToIcon = {
  HAPPY: require("../assets/images/happy.png"),
  SAD: require("../assets/images/sad.png"),
  ANGRY: require("../assets/images/angry.png"),
  SURPRISED: require("../assets/images/surprised.png"),
  ANXIETY: require("../assets/images/anxiety.png"),
};

function toMD(input) {
  if (!input) return "";
  const [y, m, d] = String(input).split("-").map(Number);
  const date = new Date(y, (m || 1) - 1, d || 1);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export default function TutorialDiaryRecordScreen({ navigation, route }) {
  const {
    isTutorialEnabled,
    activeFlowId,
    currentStep,
    targets,
    tutorialDiary,
    nextStep,
    stopTutorial,
    completeTutorial,
    startTutorial,
    registerTarget,
    clearTarget,
    clearTutorialDiary,
  } = useTutorial();

  const [mode, setMode] = useState("picture");
  const [sheetH, setSheetH] = useState(0);

  const rootRef = useRef(null);
  const backButtonRef = useRef(null);
  const toggleRef = useRef(null);
  const headsetButtonRef = useRef(null);

  const diaryData = tutorialDiary;
  const titleDate = useMemo(
    () => toMD(route?.params?.date || tutorialDiary?.date),
    [route?.params?.date, tutorialDiary?.date],
  );

  const measureTarget = useCallback(
    (targetKey, targetRef, borderRadius = 18, options = {}) => {
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

  const measureBackButton = useCallback(() => {
    measureTarget("diaryRecordBackButton", backButtonRef, 18, {
      padX: 5,
      padY: 5,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  const measureToggle = useCallback(() => {
    measureTarget("diaryRecordToggle", toggleRef, 24, {
      padX: 5,
      padY: 5,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  const measureHeadsetButton = useCallback(() => {
    measureTarget("diaryRecordHeadsetButton", headsetButtonRef, 18, {
      padX: 0,
      padY: 0,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  useEffect(() => {
    if (!isTutorialEnabled || activeFlowId !== "calendar") return;

    if (currentStep?.targetKey === "diaryRecordBackButton") {
      const timer = setTimeout(measureBackButton, 50);
      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "diaryRecordToggle") {
      const timer = setTimeout(measureToggle, 50);
      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "diaryRecordHeadsetButton") {
      const timer = setTimeout(measureHeadsetButton, 50);
      return () => clearTimeout(timer);
    }

    clearTarget("diaryRecordBackButton");
    clearTarget("diaryRecordToggle");
    clearTarget("diaryRecordHeadsetButton");
  }, [
    isTutorialEnabled,
    activeFlowId,
    currentStep?.targetKey,
    measureBackButton,
    measureToggle,
    measureHeadsetButton,
    clearTarget,
  ]);

  const handleTutorialToggle = () => {
    setMode(prev => (prev === "picture" ? "text" : "picture"));

    if (currentStep?.id === "record_toggle_intro") {
      nextStep();
    }
  };

  const handleTutorialBack = () => {
    if (currentStep?.id === "record_back_intro") {
      clearTutorialDiary();
      startTutorial("stats");
      navigation.goBack();
      return;
    }

    navigation.goBack();
  };

  const handleTutorialSkip = async () => {
    await completeTutorial();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const currentTutorialStep =
    isTutorialEnabled &&
    activeFlowId === "calendar" &&
    currentStep?.screen === "TutorialDiaryRecord"
      ? currentStep
      : null;

  const isText = mode === "text";
  const hideY = (sheetH || 220) + 40;
  const toggleGap = 80;
  const t = useSharedValue(isText ? 1 : 0);

  useEffect(() => {
    t.value = withTiming(isText ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [isText, t]);

  const sheetAnimStyle = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [hideY, 0]);
    return {
      transform: [{ translateY: ty }],
      opacity: t.value,
    };
  }, [hideY]);

  const toggleAnimStyle = useAnimatedStyle(() => {
    const lift = interpolate(t.value, [0, 1], [0, hideY - toggleGap]);
    return {
      transform: [{ translateY: -lift }],
    };
  }, [hideY]);

  const emotionIcon = emotionToIcon[String(diaryData?.emotion ?? "").toUpperCase()];

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={() => {
        measureBackButton();
        measureToggle();
        measureHeadsetButton();
      }}
    >
      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={nextStep}
        onPressSkip={handleTutorialSkip}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentStep?.id === "record_toggle_intro"
            ? handleTutorialToggle
            : currentStep?.id === "record_back_intro"
            ? handleTutorialBack
            : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 160 }}
      />

      <View style={styles.topBar}>
        <BackButton
          navigation={{ ...navigation, goBack: handleTutorialBack }}
          touchableRef={backButtonRef}
        />
        <Text style={styles.title}>{titleDate}</Text>
        <TouchableOpacity
          ref={headsetButtonRef}
          style={styles.headsetBtn}
          activeOpacity={0.8}
          disabled
        >
          <Image
            source={require("../assets/images/headset.png")}
            style={styles.headsetIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.drawArea}>
        {diaryData?.localImageSource ? (
          <Image
            source={diaryData.localImageSource}
            style={styles.diaryImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.emptyWrap} />
        )}
      </View>

      <Animated.View
        ref={toggleRef}
        style={[styles.toggleWrap, toggleAnimStyle]}
        onLayout={measureToggle}
      >
        <DiarySummaryToggle value={mode} onChange={setMode} />
      </Animated.View>

      <Animated.View
        pointerEvents={isText ? "auto" : "none"}
        style={[styles.sheet, sheetAnimStyle]}
        onLayout={e => {
          const h = e?.nativeEvent?.layout?.height ?? 0;
          if (h > 0) setSheetH(h);
        }}
      >
        <View style={styles.sheetInner}>
          <View style={styles.metaWrap}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>감정 :</Text>
              {emotionIcon ? (
                <Image source={emotionIcon} style={styles.emotionIcon} resizeMode="contain" />
              ) : (
                <View style={styles.emotionIcon} />
              )}
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>오늘의 키워드 :</Text>
              <Text style={styles.keywordText}>{diaryData?.keyword ?? ""}</Text>
            </View>
          </View>

          <View style={styles.divider} />
          <Text style={styles.summaryText}>{diaryData?.summary ?? ""}</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  topBar: {
    backgroundColor: colors.pink,
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  title: {
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
  },
  headsetBtn: {
    position: "absolute",
    right: 20,
    top: 70,
    padding: 8,
  },
  headsetIcon: {
    width: 30,
    height: 30,
  },
  drawArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  diaryImage: {
    width: "70%",
    height: "70%",
  },
  emptyWrap: {
    flex: 1,
  },
  toggleWrap: {
    position: "absolute",
    bottom: 50,
    right: 20,
  },
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: -3,
    backgroundColor: "transparent",
  },
  sheetInner: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    minHeight: 170,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 90,
  },
  metaWrap: {
    paddingHorizontal: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
  },
  emotionIcon: {
    width: 40,
    height: 40,
    marginLeft: 8,
    bottom: 3,
  },
  keywordText: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
    marginLeft: 8,
  },
  divider: {
    height: 2,
    backgroundColor: colors.pinkDark,
    marginTop: 13,
    marginBottom: 10,
    borderRadius: 2,
  },
  summaryText: {
    fontFamily: "gangwongyoyuksaeeum",
    fontSize: 30,
    color: colors.brown,
    lineHeight: 30,
    paddingHorizontal: 10,
  },
});
