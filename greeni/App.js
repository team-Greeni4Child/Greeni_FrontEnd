import React, { useEffect, useRef } from "react";
import { View, Animated, Text, StyleSheet, Dimensions, Easing } from "react-native";
import { StatusBar } from "expo-status-bar";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  cloud: 522 / 234,   // ≈2.23
  rain: 606 / 605,    // ≈1.00
  greeni: 169 / 311,  // ≈0.54
  ground: 1145 / 210, // ≈5.45
  sun: 117 / 117      // 1
};

export default function App() {
  /*** 애니메이션 값들 ***/
  // 비: 아래로 살짝 떨어지며 사라짐
  const rainOpacity = useRef(new Animated.Value(1)).current;
  const rainDropY   = useRef(new Animated.Value(0)).current;

  // 구름: 좌/우로 화면 밖까지 이동
  const cloud1X = useRef(new Animated.Value(0)).current;
  const cloud2X = useRef(new Animated.Value(0)).current;
  const cloud3X = useRef(new Animated.Value(0)).current;

  // 해: 오른쪽 위에서 등장
  const sunOpacity = useRef(new Animated.Value(0)).current;
  const sunScale   = useRef(new Animated.Value(1)).current;
  const sunX       = useRef(new Animated.Value(W * 0.12)).current;   // 오른쪽에서 시작
  const sunY       = useRef(new Animated.Value(-H * 0.12)).current;  // 위에서 시작

  useEffect(() => {
    runScene();
  }, []);

  const runScene = () => {
    const PRE_ROLL_MS = 1500;   // 비 오는 모습 먼저 보여줌
    const DURATION    = 2200;   // 전환 시간
    const EASE        = Easing.inOut(Easing.cubic);

    Animated.sequence([
      Animated.delay(PRE_ROLL_MS),
      Animated.parallel([
        // 비: 아래로 떨어지며 서서히 사라짐
        Animated.timing(rainDropY, {
          toValue: H * 0.06,
          duration: DURATION,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(rainOpacity, {
          toValue: 0,
          duration: DURATION,
          easing: EASE,
          useNativeDriver: true,
        }),

        // 구름: 좌우로 완전히 사라짐
        Animated.timing(cloud1X, { toValue: -W * 1.6, duration: DURATION, easing: EASE, useNativeDriver: true }),
        Animated.timing(cloud2X, { toValue:  W * 1.6, duration: DURATION, easing: EASE, useNativeDriver: true }),
        Animated.timing(cloud3X, { toValue: -W * 1.4, duration: DURATION, easing: EASE, useNativeDriver: true }),

        // 해: 오른쪽 위에서 → 제자리 (styles.sun 기준)
        Animated.timing(sunX, {
          toValue: 0,
          duration: DURATION,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(sunY, {
          toValue: 0,
          duration: DURATION,
          easing: EASE,
          useNativeDriver: true,
        }),
        Animated.timing(sunOpacity, {
          toValue: 1,
          duration: Math.round(DURATION * 0.9),
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(sunScale, {
          toValue: 1.02,
          duration: DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* 바닥 */}
      <Animated.Image source={require("./assets/ground.png")} style={styles.ground} resizeMode="contain" />

      {/* 개구리 */}
      <Animated.Image source={require("./assets/greeni.png")} style={styles.greeni} resizeMode="contain" />

      {/* 비 */}
      <Animated.Image
        source={require("./assets/rain.png")}
        style={[
          styles.rain,
          { opacity: rainOpacity, transform: [{ translateY: rainDropY }] },
        ]}
        resizeMode="contain"
      />

      {/* 구름 */}
      <Animated.Image source={require("./assets/cloud.png")} style={[styles.cloud1, { transform: [{ translateX: cloud1X }] }]} resizeMode="contain" />
      <Animated.Image source={require("./assets/cloud.png")} style={[styles.cloud2, { transform: [{ translateX: cloud2X }] }]} resizeMode="contain" />
      <Animated.Image source={require("./assets/cloud.png")} style={[styles.cloud3, { transform: [{ translateX: cloud3X }] }]} resizeMode="contain" />

      {/* 해 */}
      <Animated.Image
        source={require("./assets/sun.png")}
        style={[
          styles.sun,
          { opacity: sunOpacity, transform: [{ translateX: sunX }, { translateY: sunY }, { scale: sunScale }] },
        ]}
        resizeMode="contain"
      />

      {/* 타이틀 */}
      <View style={styles.titleWrap}>
        <Text style={styles.titleKr}>그리니</Text>
        <Text style={styles.titleEn}>Greeni</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFFDEE",
    alignItems: "center",
    justifyContent: "center",
  },

  cloud1: {
    position: "absolute",
    zIndex: 6,
    top: -H * 0.08,
    left: -W * 0.4,
    width: W * 1.7,
    aspectRatio: AR.cloud,
  },
  cloud2: {
    position: "absolute",
    zIndex: 6,
    top: -H * 0.02,
    left: W * 0.2,
    width: W * 1.1,
    aspectRatio: AR.cloud,
  },
  cloud3: {
    position: "absolute",
    zIndex: 6,
    top: H * 0.05,
    left: -W * 0.2,
    width: W * 0.8,
    aspectRatio: AR.cloud,
  },

  sun: {
    position: "absolute",
    zIndex: 5,
    top: H * 0.09,   
    left: W * 0.25, 
    width: W * 1,
    aspectRatio: AR.sun,
  },

  rain: {
    position: "absolute",
    zIndex: 4,
    top: H * 0.09,
    width: W * 1.5,
    aspectRatio: AR.rain,
  },

  titleWrap: {
    position: "absolute",
    zIndex: 7,
    top: H * 0.37,
    alignItems: "center",
  },
  titleKr: {
    fontSize: 70,
    fontWeight: "800",
    color: "#5A463C",
  },
  titleEn: {
    fontSize: 20,
    fontWeight: "800",
    color: "#5A463C",
  },

  greeni: {
    position: "absolute",
    zIndex: 3,
    bottom: H * 0.1,
    left: W * 0.1,
    width: W * 0.3,
    aspectRatio: AR.greeni,
  },

  ground: {
    position: "absolute",
    zIndex: 2,
    bottom: -H * 0.03,
    left: -W * 2,
    width: W * 4,
    aspectRatio: AR.ground,
  },
});
