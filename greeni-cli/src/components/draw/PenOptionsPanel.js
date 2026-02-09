import React from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../../theme/colors";

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
  return (
    <View style={styles.penPanel}>
      {/* 두께 */}
      <View style={styles.thicknessRow}>
        <TouchableOpacity
          style={styles.thicknessBtn}
          onPress={() => setPenWidth((v) => Math.max(1, v - 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.thicknessBtnText}>—</Text>
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

        <TouchableOpacity
          style={styles.thicknessBtn}
          onPress={() => setPenWidth((v) => Math.min(30, v + 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.thicknessBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      {/* 색상 */}
      <View style={styles.colorRow}>
        {COLOR_ITEMS.map(({ color, img }) => {
          const selected = penColor === color;
          return (
            <TouchableOpacity
              key={color}
              onPress={() => setPenColor(color)}
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
          onPress={onPressCustomColor}
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
  thicknessBtnText: {
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
    fontSize: 28,
    lineHeight: 28,
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
