import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import colors from "../../theme/colors";
import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker";

export default function ColorPickerModal({ visible, initialColor = "#FF0000", onClose, onApply }) {
  const [temp, setTemp] = useState(initialColor);      // 확정값(손 뗐을 때 확정)
  const [preview, setPreview] = useState(initialColor); // 미리보기(드래그 중)
  const [pickerKey, setPickerKey] = useState(0);

  useEffect(() => {
    // 모달 열릴 때 초기화
    if (visible) {
      setTemp(initialColor);
      setPreview(initialColor);
      setPickerKey((prev) => prev + 1);
    }
  }, [visible, initialColor]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.root}>
        {/* 배경 클릭 닫기: 드래그 제스처를 덜 방해함 */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          <Text style={styles.title}>색상 선택</Text>

          <View style={styles.pickerWrap}>
            <ColorPicker
              key={pickerKey}
              value={initialColor}
              onChangeJS={(result) => {
                if (result?.hex) setPreview(result.hex);
              }}
              onCompleteJS={(result) => {
                if (result?.hex) {
                  setTemp(result.hex);
                  setPreview(result.hex);
                }
              }}
              style={{ flex: 1 }}
            >
              <Panel1 style={styles.panel} />
              <View style={{ height: 14 }} />
              <HueSlider style={styles.hue} />
            </ColorPicker>
          </View>

          <View style={styles.previewRow}>
            <View style={[styles.previewBox, { backgroundColor: preview }]} />
            <Text style={styles.previewText}>{preview}</Text>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.btn, styles.ghost]} onPress={onClose}>
              <Text style={styles.ghostText}>취소</Text>
            </TouchableOpacity>

            {/* 적용은 확정값(temp) */}
            <TouchableOpacity style={styles.btn} onPress={() => onApply?.(temp)}>
              <Text style={styles.btnText}>적용</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.lightGray95,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.green,
    padding: 20,
  },
  title: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
    textAlign: "center",
    marginBottom: 15,
  },
  pickerWrap: {
    height: 300,
    borderRadius: 10,
    borderWidth: 10,
    borderColor: "#E7E0BC",
    padding: 10,
    backgroundColor: colors.ivory,
  },
  panel: { flex: 1, borderRadius: 12 },
  hue: { borderRadius: 999 },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 5,
    marginTop: 12,
  },
  previewBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
  },
  previewText: {
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    fontSize: 12,
  },
  btnRow: { 
    flexDirection: "row", 
    gap: 10, 
    marginTop: 12 
  },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: { 
    fontFamily: "Maplestory_Bold", 
    color: colors.brown, 
    fontSize: 14 
  },
  ghost: { 
    backgroundColor: colors.white, 
    borderWidth: 2, 
    borderColor: colors.greenDark 
  },
  ghostText: { 
    fontFamily: "Maplestory_Bold", 
    color: colors.brown, 
    fontSize: 14 
  },
});
