import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../../theme/colors";
import { playButtonSound } from "../../utils/soundEffects";

// 색상 + 이미지 매핑
const COLOR_ITEMS = [
  { color: "#FF2024", img: require("../../assets/images/leaf_red.png") },
  { color: "#FCAC00", img: require("../../assets/images/leaf_orange.png") },
  { color: "#FFF200", img: require("../../assets/images/leaf_yellow.png") },
  { color: "#63D756", img: require("../../assets/images/leaf_green.png") },
  { color: "#3C73FF", img: require("../../assets/images/leaf_blue.png") },
  { color: "#C232FF", img: require("../../assets/images/leaf_purple.png") },
];

const RAINBOW_IMG = require("../../assets/images/leaf_rainbow.png");

export default function PenOptionsPanel({
  penWidth,
  setPenWidth,
  penColor,
  setPenColor,
  onPressCustomColor,
}) {
  const handleSetPenWidth = width => {
    playButtonSound();
    setPenWidth(width);
  };

  const handleDecrease = () => {
    playButtonSound();
    setPenWidth(v => Math.max(1, v - 1));
  };

  const handleIncrease = () => {
    playButtonSound();
    setPenWidth(v => Math.min(30, v + 1));
  };

  const handleSetPenColor = color => {
    playButtonSound();
    setPenColor(color);
  };

  const handlePressCustomColor = () => {
    playButtonSound();
    onPressCustomColor?.();
  };

  return (
    <View style={styles.penPanel}>
      <View style={styles.presetRow}>
        <TouchableOpacity
          style={[styles.presetBtn, penWidth === 5 && styles.presetBtnActive]}
          onPress={() => handleSetPenWidth(5)}
          activeOpacity={0.8}
        >
          <Text style={[styles.presetText, penWidth === 5 && styles.presetTextActive]}>작음</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetBtn, penWidth === 15 && styles.presetBtnActive]}
          onPress={() => handleSetPenWidth(15)}
          activeOpacity={0.8}
        >
          <Text style={[styles.presetText, penWidth === 15 && styles.presetTextActive]}>보통</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.presetBtn, penWidth === 25 && styles.presetBtnActive]}
          onPress={() => handleSetPenWidth(25)}
          activeOpacity={0.8}
        >
          <Text style={[styles.presetText, penWidth === 25 && styles.presetTextActive]}>큼</Text>
        </TouchableOpacity>
      </View>

      {/* 두께 */}
      <View style={styles.thicknessRow}>
        <TouchableOpacity style={styles.thicknessBtn} onPress={handleDecrease} activeOpacity={0.8}>
          <View style={styles.minusIcon}>
            <View style={styles.minusLine} />
          </View>
        </TouchableOpacity>

        <Slider
          style={{ flex: 1, marginHorizontal: 5 }}
          minimumValue={1}
          maximumValue={30}
          step={1}
          value={penWidth}
          onValueChange={setPenWidth}
          minimumTrackTintColor={colors.brown}
          maximumTrackTintColor={colors.brown}
          thumbTintColor={colors.brown}
        />

        <TouchableOpacity style={styles.thicknessBtn} onPress={handleIncrease} activeOpacity={0.8}>
          <View style={styles.plusIcon}>
            <View style={styles.plusHorizontal} />
            <View style={styles.plusVertical} />
          </View>
        </TouchableOpacity>
      </View>

      {/* 색상 */}
      <View style={styles.colorRow}>
        {COLOR_ITEMS.map(({ color, img }) => {
          const selected = penColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => handleSetPenColor(color)}
              activeOpacity={0.85}
              style={styles.colorBtn}
            >
              <Image source={img} style={styles.colorImg} resizeMode="contain" />

              {/* 선택 표시 */}
              {selected && <View pointerEvents="none" style={styles.selectedRing} />}
            </TouchableOpacity>
          );
        })}

        {/* 커스텀 색상(무지개 아이콘) */}
        <TouchableOpacity
          onPress={handlePressCustomColor}
          activeOpacity={0.85}
          style={styles.colorBtn}
        >
          <Image source={RAINBOW_IMG} style={styles.colorImg} resizeMode="contain" />
          <View pointerEvents="none" style={styles.rainbowHint} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  penPanel: {
    alignSelf: "center",
    width: "83%",
    marginTop: 14,
    paddingVertical: 16,
    paddingHorizontal: 14,
    borderWidth: 3,
    borderColor: colors.green,
    borderRadius: 12,
    backgroundColor: colors.white,
  },

  presetRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  presetBtn: {
    minWidth: 80,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.green,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  presetBtnActive: {
    backgroundColor: colors.green,
  },
  presetText: {
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
    fontSize: 15,
  },
  presetTextActive: {
    color: colors.white,
  },

  thicknessRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  thicknessBtn: {
    width: 34,
    height: 28,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  minusIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  minusLine: {
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.brown,
  },
  plusIcon: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  plusHorizontal: {
    position: "absolute",
    width: 16,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.brown,
  },
  plusVertical: {
    position: "absolute",
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.brown,
  },

  colorRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  // 이미지 버튼 컨테이너
  colorBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  // 실제 이미지 크기
  colorImg: {
    width: 32,
    height: 32,
  },

  selectedRing: {
    position: "absolute",
    left: -4,
    top: -4,
    right: -4,
    bottom: -4,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.green,
  },
});
