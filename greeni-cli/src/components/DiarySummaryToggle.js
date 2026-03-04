import React, { useEffect, useMemo } from "react";
import { Pressable, StyleSheet, View, Text } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import colors from "../theme/colors";

import PictureIconImport from "../assets/images/icon_picture.svg";
import TextIconImport from "../assets/images/icon_text.svg";

/**
 * PinkToggle
 * - 트랙: 항상 colors.pink
 * - 왼쪽: picture 아이콘 / 오른쪽: text 아이콘
 * - value === "picture" -> 썸 왼쪽 / picture ON(분홍) / text OFF(아이보리)
 * - value === "text"    -> 썸 오른쪽 / text ON(분홍) / picture OFF(아이보리)
 *
 * value: "picture" | "text"
 */
export default function DiarySummaryToggle({
  value,
  onChange,
  disabled = false,

  width = 84,
  height = 41,
  padding = 5,
  duration = 180,

  pictureSize = 22,
  textSize = 18,
}) {
  const isPicture = value === "picture";

  // 0 = picture(left), 1 = text(right)
  const t = useSharedValue(isPicture ? 0 : 1);

  useEffect(() => {
    t.value = withTiming(isPicture ? 0 : 1, {
      duration,
      easing: Easing.out(Easing.cubic),
    });
  }, [isPicture, duration, t]);

  // transformer 케이스 대응: {default: Comp} or Comp
  const PictureIcon = useMemo(() => {
    const x = PictureIconImport;
    return x && typeof x === "object" && x.default ? x.default : x;
  }, []);
  const TextIcon = useMemo(() => {
    const x = TextIconImport;
    return x && typeof x === "object" && x.default ? x.default : x;
  }, []);

  const thumbSize = height - padding * 2;
  const travel = width - padding * 2 - thumbSize;

  const thumbStyle = useAnimatedStyle(() => {
    const x = interpolate(t.value, [0, 1], [0, travel]);
    return { transform: [{ translateX: x }] };
  });

  const handleToggle = () => {
    if (disabled) return;
    onChange?.(isPicture ? "text" : "picture");
  };

  const offColor = colors.ivory;
  const onColor = colors.pinkDark;

  return (
    <Pressable
      onPress={handleToggle}
      disabled={disabled}
      hitSlop={10}
      accessibilityRole="switch"
      accessibilityState={{ checked: !isPicture, disabled }}
      style={{ opacity: disabled ? 0.55 : 1 }}
    >
      <View
        style={[
          styles.track,
          {
            width,
            height,
            borderRadius: height / 2,
            backgroundColor: colors.pinkDark, 
          },
        ]}
      >
        {/* 트랙 위 좌/우 OFF 아이콘(항상 아이보리로 보이게) */}
        <View pointerEvents="none" style={[styles.sideIcons, { paddingHorizontal: 12 }]}>
          <PictureIcon
            width={pictureSize}
            height={pictureSize}
            color={offColor}
            fill={offColor}
          />

          <TextIcon
            width={textSize}
            height={textSize}
            color={offColor}
            fill={offColor}
          />
        </View>

        {/* 흰 썸(좌/우 이동) */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              left: padding,
              top: padding,
            },
            thumbStyle,
          ]}
        >
          {/* 선택된 아이콘을 썸 안에 분홍색으로 */}
          {isPicture ? (
            typeof PictureIcon === "function" ? (
              <PictureIcon
                width={pictureSize}
                height={pictureSize}
                color={onColor}
                fill={onColor}
              />
            ) : null
          ) : typeof TextIcon === "function" ? (
            <TextIcon
              width={textSize}
              height={textSize}
              color={onColor}
              fill={onColor}
            />
          ) : null}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    overflow: "hidden",
    justifyContent: "center",
  },
  sideIcons: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  thumb: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 4,
    elevation: 3,
  },
});