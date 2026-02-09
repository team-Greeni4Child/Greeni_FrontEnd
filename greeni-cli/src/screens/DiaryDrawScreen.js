import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

import PenOptionsPanel from "../components/draw/PenOptionsPanel";
import EraserOptionsPanel from "../components/draw/EraserOptionsPanel";
import ColorPickerModal from "../components/draw/ColorPickerModal";
import SkiaDrawCanvas from "../components/draw/SkiaDrawCanvas";

const { width: W, height: H } = Dimensions.get("window");

export default function DiaryDrawScreen({ navigation }) {
  const [activeTool, setActiveTool] = useState("pen"); // pen | eraser | photo

  // 패널 on/off
  const [showPenPanel, setShowPenPanel] = useState(false);
  const [showEraserPanel, setShowEraserPanel] = useState(false);

  // 펜 옵션
  const [penWidth, setPenWidth] = useState(10);
  const [penColor, setPenColor] = useState("#000000");

  // 지우개 옵션
  const [eraserWidth, setEraserWidth] = useState(18);

  // 컬러 모달
  const [showColorModal, setShowColorModal] = useState(false);

  const closeAllPanels = () => {
    setShowPenPanel(false);
    setShowEraserPanel(false);
  };

  const isAnyPanelOpen = showPenPanel || showEraserPanel;

  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <BackButton navigation={navigation}
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
            onPress={() => {
              setActiveTool("photo");
              closeAllPanels();
              // TODO: 사진 업로드 로직 연결
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
        <SkiaDrawCanvas
          tool={activeTool}
          penColor={penColor}
          penWidth={penWidth}
          eraserWidth={eraserWidth}
          enabled={activeTool === "pen" || activeTool === "eraser"}
        />

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
});
