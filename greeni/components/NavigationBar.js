import React, { useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

export default function NavigationBar({ state = 1, onTabPress }) {
  const animValues = [0, 1, 2].map(() => useRef(new Animated.Value(0)).current);
  const dentAnimValues = [0, 1, 2].map(() => useRef(new Animated.Value(0)).current);
  const dotAnimValues = [0, 1, 2].map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    // dent 이동
    dentAnimValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === state ? 1 : 0,
        useNativeDriver: true,
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

  const icons = [
    {
      default: require("../assets/images/tab_calendar.png"),
      active: require("../assets/images/tab_calendar_active.png"),
    },
    {
      default: require("../assets/images/tab_home.png"),
      active: require("../assets/images/tab_home_active.png"),
    },
    {
      default: require("../assets/images/tab_mypage.png"),
      active: require("../assets/images/tab_mypage_active.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {icons.map((icon, i) => {
        const isActive = state === i;

        // dent 
        const dentTranslateY = dentAnimValues[i].interpolate({
          inputRange: [0, 1],
          outputRange: [-80, -18], 
        });

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
              {/*凹 도형 이미지 */}
              <Animated.Image
                source={require("../assets/images/dent.png")}
                style={[
                  styles.dent,
                  { transform: [{ translateY: dentTranslateY }] },
                ]}
                resizeMode="contain"
              />

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
    left: W * 0.1, // 센터 정렬
    width: W * 0.8,
    height: 60,
    paddingHorizontal: 30,
    backgroundColor: colors.green,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    overflow: "visible",
  },
  tab: {
    flex: 1,
    alignItems: "center",
  },
  dent: {
    position: "absolute",
    width: W * 0.28,
  },
  icon: {
    width: W * 0.07,
    height: W * 0.07,
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
