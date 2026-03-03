import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
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

const { width: W, height: H } = Dimensions.get("window");

// "YYYY-MM-DD" | Date -> "M/D"
const toMD = (input) => {
  let d;
  if (typeof input === "string") {
    const [y, m, day] = input.split("-").map((v) => parseInt(v, 10));
    d = new Date(y, m - 1, day);
  } else if (input instanceof Date) {
    d = input;
  } else {
    d = new Date();
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export default function DiaryRecordScreen({ navigation, route }) {

  // 토글 상태: "picture" | "text"
  const [mode, setMode] = useState("picture");

  // 일기 요약 높이 측정용
  const [sheetH, setSheetH] = useState(0);

  // route.params?.date 가 있으면 그 날짜, 없으면 오늘
  const titleDate = useMemo(() => {
    const paramDate = route?.params?.date; // "YYYY-MM-DD" 기대
    return toMD(paramDate || new Date());
  }, [route?.params?.date]);

  const handlePressHeadset = () => {
    // TODO: 추후 "그날 일기 음성 대화 기록 재생" 기능 연결
  };

  const isText = mode === "text";

  // 측정된 높이를 기반으로 완전히 숨길 translateY 계산
  // sheetH가 아직 0이면 임시값으로 조금 크게 숨김
  const HIDE_Y = (sheetH || 220) + 40;

  // 토글이 일기 요약 위로 얼마나 뜰지 (값이 클수록 갭이 작음)
  const TOGGLE_GAP = 80;

  const t = useSharedValue(isText ? 1 : 0);

  useEffect(() => {
    t.value = withTiming(isText ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [isText, t]);

  const sheetAnimStyle = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [HIDE_Y, 0]);
    return {
      transform: [{ translateY: ty }],
      opacity: t.value,
    };
  }, [HIDE_Y]);

  const toggleAnimStyle = useAnimatedStyle(() => {
    const lift = interpolate(t.value, [0, 1], [0, HIDE_Y - TOGGLE_GAP]);
    return {
      transform: [{ translateY: -lift }],
    };
  }, [HIDE_Y]);

  // 일기 요약 높이 측정
  const onSheetLayout = useCallback((e) => {
    const h = e?.nativeEvent?.layout?.height ?? 0;
    if (h > 0) setSheetH(h);
  }, []);

  return (
    <View style={styles.root}>

      {/* 상단 바 */}
      <View style={styles.topBar}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>{titleDate}</Text>

        {/* 헤드셋 아이콘 (오른쪽 상단) */}
        <TouchableOpacity
          style={styles.headsetBtn}
          activeOpacity={0.8}
          onPress={handlePressHeadset}
        >
          <Image
            source={require("../assets/images/headset.png")}
            style={styles.headsetIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 그림 영역 (지금은 빈 공간) */}
      <View style={styles.drawArea} />

      {/* 토글 */}
      <Animated.View style={[styles.toggleWrap, toggleAnimStyle]}>
        <DiarySummaryToggle value={mode} onChange={setMode} />
      </Animated.View>

      {/* 일기 요약 sheet */}
      <Animated.View
        pointerEvents={isText ? "auto" : "none"}
        style={[styles.sheet, sheetAnimStyle]}
        onLayout={onSheetLayout}
      >
        <View style={styles.sheetInner}>
          {/* 나중에 내용 들어갈 자리 */}
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

  // 오른쪽 상단 헤더 아이콘
  headsetBtn: {
    position: "absolute",
    right: 20,
    top: 70,
    padding: 8, // 터치 영역 확보
  },
  headsetIcon: {
    width: 30,
    height: 30,
  },

  drawArea: {
    flex: 1,
  },

  // 토글
  toggleWrap: {
    position: "absolute",
    bottom: 50,
    right: 20,
  },

  // 일기 요약
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
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },
});
