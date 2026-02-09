import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import colors from "../../theme/colors";

export default function EraserOptionsPanel({ eraserWidth, setEraserWidth }) {
  return (
    <View style={styles.panel}>
      <View style={styles.thicknessRow}>
        <TouchableOpacity
          style={styles.thicknessBtn}
          onPress={() => setEraserWidth((v) => Math.max(1, v - 1))}
          activeOpacity={0.8}
        >
          <Text style={styles.thicknessBtnText}>—</Text>
        </TouchableOpacity>

        <Slider
          style={{ flex: 1, marginHorizontal: 5 }}
          minimumValue={1}
          maximumValue={40}
          step={1}
          value={eraserWidth}
          onValueChange={setEraserWidth}
          minimumTrackTintColor={colors.brown}
          maximumTrackTintColor={colors.brown}
          thumbTintColor={colors.brown}
        />

        <TouchableOpacity
          style={styles.thicknessBtn}
          onPress={() => setEraserWidth((v) => Math.min(40, v + 1))}
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
            },
          ]}
        />
        <Text style={styles.previewText}>{eraserWidth}px</Text>
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
    backgroundColor: colors.brown,
  },
  previewText: {
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    fontSize: 12,
  },
});
