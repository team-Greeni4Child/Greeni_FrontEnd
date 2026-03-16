import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  Alert,
  Modal,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

import PenOptionsPanel from "../components/draw/PenOptionsPanel";
import EraserOptionsPanel from "../components/draw/EraserOptionsPanel";
import ColorPickerModal from "../components/draw/ColorPickerModal";
import SkiaDrawCanvas from "../components/draw/SkiaDrawCanvas";
import { uploadDiaryJpeg } from "../api/s3";

const { width: W, height: H } = Dimensions.get("window");

export default function DiaryDrawScreen({ navigation }) {
  const canvasRef = useRef(null);

  const [activeTool, setActiveTool] = useState("pen"); // pen | eraser | photo

  // 패널 on/off
  const [showPenPanel, setShowPenPanel] = useState(false);
  const [showEraserPanel, setShowEraserPanel] = useState(false);

  // 펜 옵션
  const [penWidth, setPenWidth] = useState(15);
  const [penColor, setPenColor] = useState("#000000");

  // 지우개 옵션
  const [eraserWidth, setEraserWidth] = useState(30);

  // 컬러 모달
  const [showColorModal, setShowColorModal] = useState(false);

  // 저장 확인 모달
  const [showSaveModal, setShowSaveModal] = useState(false);

  // 저장 중 중복 클릭 방지
  const [isSaving, setIsSaving] = useState(false);

  // 배경 사진
  const [backgroundUri, setBackgroundUri] = useState(null);

  const closeAllPanels = () => {
    setShowPenPanel(false);
    setShowEraserPanel(false);
  };

  const isAnyPanelOpen = showPenPanel || showEraserPanel;

  // 사진 선택
  const pickBackgroundImage = async () => {
    try {
      const res = await launchImageLibrary({
        mediaType: "photo",
        selectionLimit: 1, //1장만
        quality: 1,
      });

      if (res.didCancel) return;

      if (res.errorCode) {
        Alert.alert("오류", `사진을 불러오지 못했어요. (${res.errorCode})`);
        return;
      }

      const uri = res.assets?.[0]?.uri;
      if (!uri) {
        Alert.alert("오류", "사진 URI를 가져오지 못했어요.");
        return;
      }

      setBackgroundUri(uri);
    } catch (e) {
      console.log(e);
      Alert.alert("오류", "사진을 불러오지 못했어요.");
    }
  };

  const handlePressSave = () => {
    if (isSaving) return;
    setShowSaveModal(true);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  const handleConfirmSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setShowSaveModal(false);
      closeAllPanels();

      const base64 = canvasRef.current?.exportBase64?.();

      if (!base64) {
        Alert.alert("오류", "그림을 저장하지 못했어요.");
        return;
      }

      const uploaded = await uploadDiaryJpeg(base64);

      console.log("[DIARY S3 KEY]:", uploaded.key);
      console.log("[DIARY S3 FILE URL]:", uploaded.fileUrl);

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      console.log("SAVE DIARY JPEG FAIL:", e);
      Alert.alert("오류", e?.message || "그림일기를 저장하지 못했어요.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <BackButton
          navigation={navigation}
          top={H * 0.08}
        />    

        {/* 제목 */}
        <Text style={styles.title}>일기쓰기</Text>

        {/* 도구 아이콘 영역 */}
        <View style={styles.tools}>
          {/* 펜 */}
          <TouchableOpacity
            onPress={() => {
              setActiveTool("pen");
              setShowEraserPanel(false);
              setShowPenPanel((v) => !v);
            }}
            activeOpacity={0.85}
          >
            <Image
              source={require("../assets/images/icon_pen.png")}
              style={[styles.icon, activeTool === "pen" && styles.iconActive]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* 지우개 */}
          <TouchableOpacity
            onPress={() => {
              setActiveTool("eraser");
              setShowPenPanel(false);
              setShowEraserPanel((v) => !v);
            }}
            activeOpacity={0.85}
          >
            <Image
              source={require("../assets/images/icon_eraser.png")}
              style={[styles.icon, activeTool === "eraser" && styles.iconActive]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* 사진 */}
          <TouchableOpacity
            onPress={async () => {
              setActiveTool("photo");
              closeAllPanels();
              await pickBackgroundImage();
              setActiveTool("pen");
            }}
            activeOpacity={0.85}
          >
            <Image
              source={require("../assets/images/icon_photo.png")}
              style={[styles.icon, activeTool === "photo" && styles.iconActive]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 그림 영역 */}
      <View style={styles.drawArea}>
        <View style={styles.captureArea}>

          {/* 캔버스 */}
          <SkiaDrawCanvas
            ref={canvasRef}
            tool={activeTool}
            penColor={penColor}
            penWidth={penWidth}
            eraserWidth={eraserWidth}
            enabled={activeTool === "pen" || activeTool === "eraser"}
            backgroundUri={backgroundUri}
          />
        </View>

        {/* 바깥 터치 → 열려있는 패널 닫기 */}
        {isAnyPanelOpen && (
          <Pressable style={styles.backdrop} onPress={closeAllPanels} />
        )}

        {/* 펜 옵션 패널 */}
        {activeTool === "pen" && showPenPanel && (
          <View style={styles.panelOverlay} pointerEvents="box-none">
            <PenOptionsPanel
              penWidth={penWidth}
              setPenWidth={setPenWidth}
              penColor={penColor}
              setPenColor={(c) => {
                setPenColor(c);
                setShowPenPanel(false);
              }}
              onPressCustomColor={() => {
                setShowPenPanel(false);
                setShowColorModal(true);
              }}
            />
          </View>
        )}

        {/* 지우개 옵션 패널 */}
        {activeTool === "eraser" && showEraserPanel && (
          <View style={styles.panelOverlay} pointerEvents="box-none">
            <EraserOptionsPanel
              eraserWidth={eraserWidth}
              setEraserWidth={setEraserWidth}
            />
          </View>
        )}
      </View>

      {/* 저장 버튼 */}
      <View style={styles.bottomWrap}>
        <Button 
          title="저장하기" 
          width={130}
          backgroundColor={colors.greenLight} 
          onPress={handlePressSave}
          disabled={isSaving}
        />
      </View>

      {/* 컬러 피커 모달 */}
      <ColorPickerModal
        visible={showColorModal}
        initialColor={penColor}
        onClose={() => setShowColorModal(false)}
        onApply={(c) => {
          setPenColor(c);
          setShowColorModal(false);
        }}
      />

      {/* 저장 확인 모달 */}
      <Modal transparent visible={showSaveModal} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              오늘의 일기 작성을{"\n"}마무리할까요?
            </Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={handleCancelSave}
                activeOpacity={0.8}
              >
                <Text style={[styles.modalButtonText, { color: colors.brown }]}>
                  아니오
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirmButton]}
                onPress={handleConfirmSave}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  topBar: {
    backgroundColor: colors.pink,
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: H * 0.08,
  },
  title: {
    fontFamily: "Maplestory_Bold",
    fontSize: 28,
    color: colors.brown,
  },
  tools: {
    flexDirection: "row",
    marginTop: 20, 
    gap: W * 0.2,
  },
  icon: {
    width: W * 0.07,
    height: W * 0.07,
    opacity: 0.65,
  },
  iconActive: {
    opacity: 1,
  },

  drawArea: {
    flex: 1,
    backgroundColor: colors.ivory,
    position: "relative",
  },

  captureArea: {
    flex: 1,
    backgroundColor: colors.ivory,
    overflow: "hidden",
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },

  panelOverlay: {
    position: "absolute",
    top: 10, 
    left: 0,
    right: 0,
    alignItems: "center",
  },

  bottomWrap: {
    position: "absolute",
    left: 0,
    right: 0, 
    alignItems: "center",
    bottom: H * 0.05,
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalWrap: {
    width: W * 0.8,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.greenDark,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 18,
    alignItems: "center",
  },
  modalText: {
    fontFamily: "Maplestory_Light",
    fontSize: 16,
    color: colors.brown,
    textAlign: "center",
    lineHeight: 24,
  },
  modalButtonWrap: {
    flexDirection: "row",
    marginTop: 22,
    gap: 12,
  },
  modalButton: {
    minWidth: 110,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  modalCancelButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.greenDark,
  },
  modalConfirmButton: {
    backgroundColor: colors.greenLight,
    borderWidth: 2,
    borderColor: colors.greenDark,
  },
  modalButtonText: {
    fontFamily: "Maplestory_Bold",
    fontSize: 14,
    color: colors.brown,
  },
});
