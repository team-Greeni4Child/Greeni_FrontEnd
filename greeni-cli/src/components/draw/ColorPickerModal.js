import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Modal, View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import colors from "../../theme/colors";
import { runOnJS } from "react-native-reanimated";
import ColorPicker, { Panel1, HueSlider } from "reanimated-color-picker";

export default function ColorPickerModal({ visible, initialColor = "#FF0000", onClose, onApply }) {
  const [temp, setTemp] = useState(initialColor);      // 확정값(손 뗐을 때 확정)
  const [preview, setPreview] = useState(initialColor); // 미리보기(드래그 중)

  useEffect(() => {
    // 모달 열릴 때 초기화
    if (visible) {
      setTemp(initialColor);
      setPreview(initialColor);
    }
  }, [visible, initialColor]);

  const setPreviewJS = useCallback((hex) => setPreview(hex), []);
  const setTempJS = useCallback((hex) => {
    setTemp(hex);
    setPreview(hex);
  }, []);

  const onChangePick = useCallback((result) => {
    "worklet";
    if (result?.hex) runOnJS(setPreviewJS)(result.hex);
  }, [setPreviewJS]);

  const onCompletePick = useCallback((result) => {
    "worklet";
    if (result?.hex) runOnJS(setTempJS)(result.hex);
  }, [setTempJS]);

  const previewStyle = useMemo(() => [{ backgroundColor: preview }], [preview]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.root}>
        {/* 배경 클릭 닫기: 드래그 제스처를 덜 방해함 */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.card}>
          <Text style={styles.title}>색상 선택</Text>

          <View style={styles.pickerWrap}>
            <ColorPicker
              value={preview}
              onChange={onChangePick}       // 드래그 중 미리보기
              onComplete={onCompletePick}   // 손 떼면 확정
              style={{ flex: 1 }}
            >
              <Panel1 style={styles.panel} />
              <View style={{ height: 14 }} />
              <HueSlider style={styles.hue} />
            </ColorPicker>
          </View>

          <View style={styles.previewRow}>
            <View style={[styles.previewBox, ...previewStyle]} />
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
