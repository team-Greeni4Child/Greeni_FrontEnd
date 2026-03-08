import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../../theme/colors";

export default function EraserOptionsPanel({ eraserWidth, setEraserWidth }) {
  return (
    <View style={styles.panel}>
      <View style={styles.presetRow}>
        <TouchableOpacity
          style={[
            styles.presetBtn,
            eraserWidth === 10 && styles.presetBtnActive,
          ]}
          onPress={() => setEraserWidth(10)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.presetText,
              eraserWidth === 10 && styles.presetTextActive,
            ]}
          >
            작음
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.presetBtn,
            eraserWidth === 30 && styles.presetBtnActive,
          ]}
          onPress={() => setEraserWidth(30)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.presetText,
              eraserWidth === 30 && styles.presetTextActive,
            ]}
          >
            보통
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.presetBtn,
            eraserWidth === 60 && styles.presetBtnActive,
          ]}
          onPress={() => setEraserWidth(60)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.presetText,
              eraserWidth === 60 && styles.presetTextActive,
            ]}
          >
            큼
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.thicknessRow}>
        <TouchableOpacity
          style={styles.thicknessBtn}
          onPress={() => setEraserWidth((v) => Math.max(5, v - 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.thicknessBtnText}>—</Text>
        </TouchableOpacity>

        <Slider
          style={{ flex: 1, marginHorizontal: 5 }}
          minimumValue={5}
          maximumValue={80}
          step={1}
          value={eraserWidth}
          onValueChange={setEraserWidth}
          minimumTrackTintColor={colors.brown}
          maximumTrackTintColor={colors.brown}
          thumbTintColor={colors.brown}
        />

        <TouchableOpacity
          style={styles.thicknessBtn}
          onPress={() => setEraserWidth((v) => Math.min(80, v + 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.thicknessBtnText}>＋</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.previewRow}>
        <View
          style={[
            styles.previewDot,
            {
              width: eraserWidth,
              height: eraserWidth,
              borderRadius: eraserWidth / 2,
              borderWidth: Math.max(2, eraserWidth * 0.04),
            },
          ]}
        />
        <Text style={styles.previewText}>{eraserWidth}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
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
  thicknessBtnText: {
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
    fontSize: 28,
    lineHeight: 28,
  },

  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  previewDot: {
    backgroundColor: colors.white,
    borderColor: colors.brown,
  },
  previewText: {
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    fontSize: 12,
  },
});
