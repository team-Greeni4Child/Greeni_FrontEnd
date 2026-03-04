import React, { useRef, useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import colors from "../theme/colors";
import MaskedView from "@react-native-masked-view/masked-view";
import Svg, { Defs, Mask, Rect, Path, G } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");
const AnimatedG = Animated.createAnimatedComponent(G);

// dent.png 원본 크기
const DENT_VIEWBOX_W = 226;
const DENT_VIEWBOX_H = 180;

// dent.png 외곽선 path
const DENT_D =
  "M 120.5 180 L 100.5 179 L 91.5 176 L 83.5 171 L 70 157.5 L 47 118.5 L 34.5 103 L 21.5 94 L 12.5 91 L 0 89.5 L 1 75.5 L 5.5 62.5 L 11.5 50.5 L 20 38.5 L 29.5 29 L 44.5 18 L 65.5 8 L 86.5 2 L 100.5 1 L 101.5 0.5 L 124.5 0.5 L 128 1 L 141.5 2 L 162.5 8 L 183.5 18 L 198.5 29 L 208 38.5 L 216.5 50.5 L 222.5 62.5 L 227 75.5 L 228 89.5 L 215.5 91 L 206.5 94 L 193.5 103 L 181 118.5 L 158 157.5 L 144.5 171 L 136.5 176 L 127.5 179 L 120.5 180 Z";

export default function NavigationBar({ state = 0, onTabPress }) {
  // 탭 개수 = 4
  const TAB_COUNT = 4;

  const animValues = Array.from({ length: TAB_COUNT }).map(
    () => useRef(new Animated.Value(0)).current
  );
  const dentAnimValues = Array.from({ length: TAB_COUNT }).map(
    () => useRef(new Animated.Value(0)).current
  );
  const dotAnimValues = Array.from({ length: TAB_COUNT }).map(
    () => useRef(new Animated.Value(0)).current
  );

  useEffect(() => {
    // dent 이동 (SVG transform이라 JS driver)
    dentAnimValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === state ? 1 : 0,
        useNativeDriver: false,
        damping: 30,    
      }).start();
    });

    // 아이콘 이동
    animValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === state ? -12 : 0,
        useNativeDriver: true,
      }).start();
    });

    // 점 이동
    dotAnimValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === state ? -10 : 0,
        useNativeDriver: true,
      }).start();
    });
  }, [state]);

  // 순서: home, calendar, statistics, mypage
  const icons = [
    {
      default: require("../assets/images/tab_home.png"),
      active: require("../assets/images/tab_home_active.png"),
    },
    {
      default: require("../assets/images/tab_calendar.png"),
      active: require("../assets/images/tab_calendar_active.png"),
    },
    {
      default: require("../assets/images/tab_statistics.png"),
      active: require("../assets/images/tab_statistics_active.png"),
    },
    {
      default: require("../assets/images/tab_mypage.png"),
      active: require("../assets/images/tab_mypage_active.png"),
    },
  ];

  const BAR_W = W * 0.9;
  const BAR_H = 60;

  const DENT_W = W * 0.245;
  const DENT_H = DENT_W * (DENT_VIEWBOX_H / DENT_VIEWBOX_W);

  const BAR_PAD_X = 20;

  const tabCentersX = useMemo(() => {
    const innerW = BAR_W - BAR_PAD_X * 2;
    return Array.from({ length: TAB_COUNT }).map(
      (_, i) => BAR_PAD_X + (innerW / TAB_COUNT) * (i + 0.5)
    );
  }, [BAR_W]);

  const dentTranslateY = dentAnimValues[state].interpolate({
    inputRange: [0, 1],
    outputRange: [-60, -18],
  });

  const dentLeft = tabCentersX[state] - DENT_W / 2;
  const dentBaseTop = -22; // 여기만 미세조정

  const scaleX = DENT_W / DENT_VIEWBOX_W;
  const scaleY = DENT_H / DENT_VIEWBOX_H;

  return (
    <View style={styles.container}>
      <View style={styles.barClip}>
        <MaskedView
          style={styles.maskFill}
          maskElement={
            <Svg width={BAR_W} height={BAR_H}>
              <Defs>
                <Mask
                  id="barCut"
                  x="0"
                  y="0"
                  width={BAR_W}
                  height={BAR_H}
                  maskUnits="userSpaceOnUse"
                >
                  <Rect x="0" y="0" width={BAR_W} height={BAR_H} fill="white" />
                  <AnimatedG
                    transform={[
                      { translateX: dentLeft },
                      { translateY: dentBaseTop },
                      { translateY: dentTranslateY },
                    ]}
                  >
                    <Path
                      d={DENT_D}
                      fill="black"
                      transform={[{ scaleX }, { scaleY }]}
                    />
                  </AnimatedG>
                </Mask>
              </Defs>
              <Rect
                x="0"
                y="0"
                width={BAR_W}
                height={BAR_H}
                fill="white"
                mask="url(#barCut)"
              />
            </Svg>
          }
        >
          <View style={styles.greenFill} />
        </MaskedView>
      </View>

      {icons.map((icon, i) => {
        const isActive = state === i;

        return (
          <TouchableOpacity
            key={i}
            style={styles.tab}
            onPress={() => onTabPress && onTabPress(i)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={{
                transform: [{ translateY: animValues[i] }],
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* 아이콘 */}
              <Image
                source={isActive ? icon.active : icon.default}
                style={styles.icon}
                resizeMode="contain"
              />

              {/* 점 */}
              {isActive && (
                <Animated.View
                  style={[
                    styles.dot,
                    { transform: [{ translateY: dotAnimValues[i] }] },
                  ]}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: H * 0.06,
    left: W * 0.05,
    width: W * 0.9,
    height: 60,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "visible",
  },
  barClip: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: W * 0.9,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
  },
  maskFill: {
    width: "100%",
    height: "100%",
  },
  greenFill: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.green,
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  icon: {
    width: W * 0.065,
    height: W * 0.065,
  },
  dot: {
    position: "absolute",
    top: 0,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.brown,
  },
});
