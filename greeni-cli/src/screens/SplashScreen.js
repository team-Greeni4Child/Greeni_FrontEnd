import React, { useEffect, useRef } from "react";
import { View, Animated, Text, StyleSheet, Dimensions, Easing } from "react-native";
import { StatusBar } from "react-native";
import colors from "../theme/colors";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  cloud: 522 / 234,   // ≈2.23
  sun: 117 / 117,     // 1
  pond: 1136 / 678,
  greeniUmbrella: 250 / 469,
  leaf1: 454 / 164,
  leaf2: 142 / 52,
  leaf3: 86 / 28,
  leaf4: 324 / 130,
  flower: 170 / 138,
};

export default function SplashScreen({ onDone }) {
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
          toValue: H * 0.5, //gpt 추천 값 0.06
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

        // 해: 오른쪽 위에서 → 제자리 
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
          duration: DURATION * 1.5,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start(({ finished }) => {
      // 애니메이션이 끝나면 상위(App.js)로 알려서 다음 화면으로 전환
      if (finished && typeof onDone === "function") onDone();
    });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* 연못, 연잎, 연꽃, 그리니*/}
      <View style={styles.pondWrap}>
        <Animated.Image source={require("../assets/images/pond.png")} style={styles.pond} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/leaf1.png")} style={styles.leaf1} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/leaf4.png")} style={styles.leaf4} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/leaf2.png")} style={styles.leaf2} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/leaf3.png")} style={styles.leaf3} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/flower.png")} style={styles.flower1} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/flower.png")} style={styles.flower2} resizeMode="contain" />
        <Animated.Image source={require("../assets/images/umbrella_greeni_big.png")} style={styles.greeni} resizeMode="contain" />
      </View>

      {/* 비 */}
      <Animated.Image
        source={require("../assets/images/rain.png")}
        style={[
          styles.rain,
          { opacity: rainOpacity, transform: [{ translateY: rainDropY }] },
        ]}
        resizeMode="contain"
      />

      {/* 구름 */}
      <Animated.Image
        source={require("../assets/images/cloud.png")}
        style={[styles.cloud1, { transform: [{ translateX: cloud1X }] }]}
        resizeMode="contain"
      />
      <Animated.Image
        source={require("../assets/images/cloud.png")}
        style={[styles.cloud2, { transform: [{ translateX: cloud2X }] }]}
        resizeMode="contain"
      />
      <Animated.Image
        source={require("../assets/images/cloud.png")}
        style={[styles.cloud3, { transform: [{ translateX: cloud3X }] }]}
        resizeMode="contain"
      />

      {/* 해 */}
      <Animated.Image
        source={require("../assets/images/sun.png")}
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
    backgroundColor: colors.ivory,
    alignItems: "center",
    justifyContent: "center",
  },

  cloud1: {
    position: "absolute",
    zIndex: 6,
    top: -H * 0.15,
    left: -H * 0.31,
    width: W * 1.9,
    height: H * 0.4,
    aspectRatio: AR.cloud,
  },
  cloud2: {
    position: "absolute",
    zIndex: 6,
    top: H * 0.005,
    left: W * 0.25,
    width: W * 1,
    aspectRatio: AR.cloud,
  },
  cloud3: {
    position: "absolute",
    zIndex: 6,
    top: H * 0.06,
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
    width: W * 1.5,
  },

  /* 타이틀 */
  titleWrap: {
    position: "absolute",
    zIndex: 7,
    top: H * 0.37,
    alignItems: "center",
  },
  titleKr: {
    fontSize: 70,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },
  titleEn: {
    fontSize: 20,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  /* 연못 */
  pondWrap: {
    position: "absolute",
    zIndex: 2,
    bottom: -H * 0.08,  
    alignSelf: "center",
    width: W * 1.22,    
    aspectRatio: AR.pond,
  },
  pond: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "110%",
    height: "110%",
  },

  // 큰 연잎(그리니 발판)
  leaf1: {
    position: "absolute",
    zIndex: 3,
    left: "11%",
    bottom: "42%",
    width: "50%",
    aspectRatio: AR.leaf1,
  },

  // 오른쪽 아래 큰 연잎(부분 노출)
  leaf4: {
    position: "absolute",
    zIndex: 2,
    right: "-2%",
    bottom: "10%",
    width: "35%",
    aspectRatio: AR.leaf4,
  },

  // 작은 연잎(중앙에서 오른쪽)
  leaf2: {
    position: "absolute",
    zIndex: 2,
    left: "53%",
    bottom: "43%",
    width: "15%",
    aspectRatio: AR.leaf2,
  },

  // 가장 작은 연잎(더 아래쪽)
  leaf3: {
    position: "absolute",
    zIndex: 2,
    left: "40%",
    bottom: "36%",
    width: "9%",
    aspectRatio: AR.leaf3,
  },

  // 큰 꽃
  flower1: {
    position: "absolute",
    zIndex: 3,
    right: "18%",
    bottom: "55%",
    width: "19%",
    aspectRatio: AR.flower,
  },
  // 작은 꽃
  flower2: {
    position: "absolute",
    zIndex: 5,
    left: "10%",
    bottom: "33%",
    width: "12%",
    aspectRatio: AR.flower,
  },
  // 그리니
  greeni: {
    position: "absolute",
    zIndex: 4,
    left: "18%",
    bottom: "30%",
    width: "26%",
    aspectRatio: AR.greeniUmbrella,
  },
});
