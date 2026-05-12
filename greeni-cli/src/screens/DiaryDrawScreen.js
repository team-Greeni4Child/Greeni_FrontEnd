import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  Modal,
  BackHandler,
  Platform,
  ActivityIndicator,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useFocusEffect } from "@react-navigation/native";

import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import TutorialOverlay from "../components/TutorialOverlay";

import PenOptionsPanel from "../components/draw/PenOptionsPanel";
import EraserOptionsPanel from "../components/draw/EraserOptionsPanel";
import ColorPickerModal from "../components/draw/ColorPickerModal";
import SkiaDrawCanvas from "../components/draw/SkiaDrawCanvas";
import { uploadDiaryJpeg } from "../api/s3";
import { summarizeDiaryAi, closeDiaryAi } from "../api/diaryAi";
import { ProfileContext } from "../context/ProfileContext";
import { useTutorial } from "../context/TutorialContext";

const { width: W, height: H } = Dimensions.get("window");

export default function DiaryDrawScreen({ navigation, route }) {
  const canvasRef = useRef(null);

  // 튜토리얼용 일기 Ref
  const rootRef = useRef(null);
  const toolsBarRef = useRef(null);
  const saveButtonRef = useRef(null);

  const { selectedProfile } = useContext(ProfileContext);
  const { sessionId } = route.params || {};

  const [activeTool, setActiveTool] = useState("pen"); // pen | eraser | photo

  const {
    isTutorialEnabled,
    activeFlowId,
    currentStep,
    targets,
    goToStep,
    startTutorial,
    stopTutorial,
    completeTutorial,
    registerTarget,
    clearTarget,
  } = useTutorial();

  // 패널 on/off
  const [showPenPanel, setShowPenPanel] = useState(false);
  const [showEraserPanel, setShowEraserPanel] = useState(false);
  const [showPhotoActionPanel, setShowPhotoActionPanel] = useState(false);

  // 펜 옵션
  const [penWidth, setPenWidth] = useState(15);
  const [penColor, setPenColor] = useState("#000000");

  // 지우개 옵션
  const [eraserWidth, setEraserWidth] = useState(30);

  // 컬러 모달
  const [showColorModal, setShowColorModal] = useState(false);

  // 저장 확인 모달
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 저장 중 중복 클릭 방지
  const [isSaving, setIsSaving] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // 에러 메세지
  const [errorMessage, setErrorMessage] = useState("");

  // 배경 사진
  const [backgroundUri, setBackgroundUri] = useState(null);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const closeAllPanels = () => {
    setShowPenPanel(false);
    setShowEraserPanel(false);
    setShowPhotoActionPanel(false);
  };

  const isAnyPanelOpen = showPenPanel || showEraserPanel || showPhotoActionPanel;

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (Platform.OS !== "android") return false;

        if (showColorModal) {
          setShowColorModal(false);
          return true;
        }

        if (showSaveModal) {
          setShowSaveModal(false);
          return true;
        }

        if (showExitModal) {
          setShowExitModal(false);
          return true;
        }

        if (showErrorModal) {
          setShowErrorModal(false);
          setErrorMessage("");
          return true;
        }

        if (isSaving || isExiting) {
          return true;
        }

        closeAllPanels();
        setShowExitModal(true);
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [showColorModal, showSaveModal, showExitModal, showErrorModal, isSaving, isExiting]),
  );

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
        console.log("PHOTO PICK FAIL:", res.errorCode);
        return;
      }

      const uri = res.assets?.[0]?.uri;
      if (!uri) {
        console.log("PHOTO PICK FAIL: no uri");
        return;
      }

      setBackgroundUri(uri);
    } catch (e) {
      console.log("PHOTO PICK FAIL:", e);
    }
  };

  const handlePressPhoto = async () => {
    setActiveTool("photo");
    setShowPenPanel(false);
    setShowEraserPanel(false);

    if (!backgroundUri) {
      setShowPhotoActionPanel(false);
      await pickBackgroundImage();
      setActiveTool("pen");
      return;
    }

    setShowPhotoActionPanel(v => !v);
  };

  const handleChangePhoto = async () => {
    setShowPhotoActionPanel(false);
    await pickBackgroundImage();
    setActiveTool("pen");
  };

  const handleDeletePhoto = () => {
    setBackgroundUri(null);
    setShowPhotoActionPanel(false);
    setActiveTool("pen");
  };

  const handleUndo = () => {
    canvasRef.current?.undo?.();
  };

  const handleRedo = () => {
    canvasRef.current?.redo?.();
  };

  const handlePressSave = () => {
    if (isSaving || isExiting) return;
    closeAllPanels();
    setShowSaveModal(true);
  };

  const handleCancelSave = () => {
    setShowSaveModal(false);
  };

  const handleOpenExitModal = () => {
    if (isSaving || isExiting) return;
    closeAllPanels();
    setShowExitModal(true);
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  const handleConfirmExit = async () => {
    if (isExiting) return;

    try {
      setIsExiting(true);
      setShowExitModal(false);

      if (selectedProfile?.profileId && sessionId) {
        await closeDiaryAi({
          profileId: selectedProfile.profileId,
          sessionId,
        });
      }

      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } catch (e) {
      console.log("CLOSE DIARY SESSION FAIL:", e);
      setErrorMessage("오류가 발생했습니다.\n잠시후 다시 시도해 주세요.");
      setShowErrorModal(true);
    } finally {
      setIsExiting(false);
    }
  };

  const handleConfirmSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      setShowSaveModal(false);
      closeAllPanels();

      if (!selectedProfile?.profileId) {
        throw new Error("profileId가 없습니다.");
      }

      if (!sessionId) {
        throw new Error("sessionId가 없습니다.");
      }

      const base64 = canvasRef.current?.exportBase64?.();

      if (!base64) {
        setErrorMessage("오류가 발생했습니다.\n잠시후 다시 시도해 주세요.");
        setShowErrorModal(true);
        return;
      }

      const uploaded = await uploadDiaryJpeg(base64);

      await summarizeDiaryAi({
        profileId: selectedProfile.profileId,
        sessionId,
        imageUrl: uploaded.fileUrl,
      });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home",
            params: {
              diaryAlreadyExists: true,
              playDiarySaveAnimation: true,
            },
          },
        ],
      });
    } catch (e) {
      console.log("SAVE DIARY FAIL:", e);
      setErrorMessage("오류가 발생했습니다.\n잠시후 다시 시도해 주세요.");
      setShowErrorModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  // 그림일기 Ref 측정
  const measureTarget = useCallback(
    (targetKey, targetRef, borderRadius = 15, options = {}) => {
      const { padX = 0, padY = 0, radiusOffset = 0 } = options;

      if (!rootRef.current || !targetRef.current) return;

      rootRef.current.measureInWindow((rootX, rootY) => {
        targetRef.current.measureInWindow((x, y, width, height) => {
          registerTarget(targetKey, {
            x: x - rootX - padX,
            y: y - rootY - padY,
            width: width + padX * 2,
            height: height + padY * 2,
            borderRadius: borderRadius + radiusOffset,
          });
        });
      });
    },
    [registerTarget],
  );

  // 그림일기 Ref 측정 - 그림 tool 버튼 hole view
  const measureToolsBar = useCallback(() => {
    measureTarget("toolsBar", toolsBarRef, 12, {
      padX: 13,
      padY: 13,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  // 그림일기 Ref 측정 - 저장하기 버튼 hole view
  const measureSaveButton = useCallback(() => {
    measureTarget("saveButton", saveButtonRef, 24.5, {
      padX: 7,
      padY: 7,
      radiusOffset: 10,
    });
  }, [measureTarget]);

  useEffect(() => {
    if (!isTutorialEnabled || activeFlowId !== "diary") return;

    if (currentStep?.targetKey === "toolsBar") {
      const timer = setTimeout(measureToolsBar, 50);
      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "saveButton") {
      const timer = setTimeout(measureSaveButton, 50);
      return () => clearTimeout(timer);
    }

    clearTarget("toolsBar");
    clearTarget("saveButton");
  }, [
    isTutorialEnabled,
    activeFlowId,
    currentStep?.targetKey,
    measureToolsBar,
    measureSaveButton,
    clearTarget,
  ]);

  // 일기 저장할 때 튜토리얼 흐름을 이어주기 위한 분기 추가
  const handleTutorialSave = () => {
    const isSaveTutorialStep =
      isTutorialEnabled && activeFlowId === "diary" && currentStep?.id === "save_intro";

    if (isSaveTutorialStep) {
      startTutorial("five");
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
      return;
    }

    handlePressSave();
  };

  const handleTutorialSkip = async () => {
    await completeTutorial();
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  const isDiaryTutorial = isTutorialEnabled && activeFlowId === "diary";
  const currentTutorialStep =
    isDiaryTutorial && currentStep?.screen === "DiaryDraw" ? currentStep : null;

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={() => {
        measureToolsBar();
        measureSaveButton();
      }}
    >
      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={() => {
          if (currentTutorialStep?.nextStepId) {
            goToStep(currentTutorialStep.nextStepId);
          }
        }}
        onPressSkip={handleTutorialSkip}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={currentTutorialStep?.id === "save_intro" ? handleTutorialSave : undefined}
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 250 }}
      />

      <View style={styles.topBar}>
        <BackButton navigation={{ ...navigation, goBack: handleOpenExitModal }} top={H * 0.08} />

        {/* 제목 */}
        <Text style={styles.title}>일기쓰기</Text>

        {/* 도구 아이콘 영역 */}
        <View ref={toolsBarRef} style={styles.tools} onLayout={measureToolsBar}>
          {/* 펜 */}
          <TouchableOpacity
            onPress={() => {
              setActiveTool("pen");
              setShowEraserPanel(false);
              setShowPhotoActionPanel(false);
              setShowPenPanel(v => !v);
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
              setShowPhotoActionPanel(false);
              setShowEraserPanel(v => !v);
            }}
            activeOpacity={0.85}
          >
            <Image
              source={require("../assets/images/icon_eraser.png")}
              style={[styles.icon, activeTool === "eraser" && styles.iconActive]}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* redo, undo */}
          <View style={styles.historyTools}>
            <TouchableOpacity
              onPress={handleUndo}
              activeOpacity={canUndo ? 0.85 : 1}
              disabled={!canUndo}
            >
              <Image
                source={require("../assets/images/icon_undo.png")}
                style={[styles.smallIcon, { opacity: canUndo ? 1 : 0.3 }]}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRedo}
              activeOpacity={canRedo ? 0.85 : 1}
              disabled={!canRedo}
            >
              <Image
                source={require("../assets/images/icon_redo.png")}
                style={[styles.smallIcon, { opacity: canRedo ? 1 : 0.3 }]}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* 사진 */}
          <TouchableOpacity onPress={handlePressPhoto} activeOpacity={0.85}>
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
            onHistoryChange={({ canUndo, canRedo }) => {
              setCanUndo(canUndo);
              setCanRedo(canRedo);
            }}
          />
        </View>

        {isAnyPanelOpen && (
          <Pressable
            style={styles.backdrop}
            onPress={() => {
              closeAllPanels();
              if (activeTool === "photo") {
                setActiveTool("pen");
              }
            }}
          />
        )}

        {activeTool === "pen" && showPenPanel && (
          <View style={styles.panelOverlay} pointerEvents="box-none">
            <PenOptionsPanel
              penWidth={penWidth}
              setPenWidth={setPenWidth}
              penColor={penColor}
              setPenColor={c => {
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
            <EraserOptionsPanel eraserWidth={eraserWidth} setEraserWidth={setEraserWidth} />
          </View>
        )}

        {activeTool === "photo" && showPhotoActionPanel && (
          <View style={styles.photoActionWrap} pointerEvents="box-none">
            <View style={styles.photoActionPanel}>
              <TouchableOpacity
                style={styles.photoActionButton}
                onPress={handleChangePhoto}
                activeOpacity={0.85}
              >
                <Image
                  source={require("../assets/images/icon_photo_change.png")}
                  style={styles.photoActionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <View style={styles.photoDivider} />

              <TouchableOpacity
                style={styles.photoActionButton}
                onPress={handleDeletePhoto}
                activeOpacity={0.85}
              >
                <Image
                  source={require("../assets/images/icon_photo_delete.png")}
                  style={styles.photoActionIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 저장 버튼 */}
      <View style={styles.bottomWrap}>
        <View ref={saveButtonRef} onLayout={measureSaveButton}>
          <Button
            title="저장하기"
            width={130}
            backgroundColor={colors.green}
            onPress={handleTutorialSave}
            disabled={isSaving || isExiting}
          />
        </View>
      </View>

      {/* 컬러 피커 모달 */}
      <ColorPickerModal
        visible={showColorModal}
        initialColor={penColor}
        onClose={() => setShowColorModal(false)}
        onApply={c => {
          setPenColor(c);
          setShowColorModal(false);
        }}
      />

      {/* 저장 확인 모달 */}
      <Modal transparent visible={showSaveModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>오늘의 일기쓰기를{"\n"}저장할까요?</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton, { width: "50%", backgroundColor: colors.ivory }]}
                onPress={handleCancelSave}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>아니요</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { width: "50%" }]}
                onPress={handleConfirmSave}
                activeOpacity={1}
                disabled={isSaving}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 저장 중 모달 */}
      <Modal transparent visible={isSaving}>
        <View style={styles.modalBackground}>
          <View style={styles.savingModalWrap}>
            <ActivityIndicator size="large" color={colors.greenDark} />
            <Text style={styles.savingText}>저장중</Text>
          </View>
        </View>
      </Modal>

      {/* 중단 확인 모달 */}
      <Modal transparent visible={showExitModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              지금 나가면{"\n"} 대화 내용이 저장되지 않아요.{"\n"}일기쓰기를 그만할까요?
            </Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton, { width: "50%", backgroundColor: colors.ivory }]}
                onPress={handleCancelExit}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>아니요</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { width: "50%" }]}
                onPress={handleConfirmExit}
                activeOpacity={1}
                disabled={isExiting}
              >
                <Text style={styles.modalButtonText}>예</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 에러 안내 모달 */}
      <Modal transparent visible={showErrorModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>{errorMessage}</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={handleCloseErrorModal}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>확인</Text>
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
    height: H * 0.15 + 50,
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
    gap: W * 0.11,
  },
  icon: {
    width: 30,
    height: 30,
    opacity: 0.5,
  },
  iconActive: {
    opacity: 1,
  },
  historyTools: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  smallIcon: {
    width: 28,
    height: 28,
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

  photoActionWrap: {
    position: "absolute",
    top: 10,
    right: W * 0.06,
  },
  photoActionPanel: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 4,
  },
  photoActionButton: {
    width: 44,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  photoActionIcon: {
    width: 30,
    height: 30,
  },
  photoDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.lightGray,
    marginHorizontal: 2,
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
    backgroundColor: colors.lightGray95,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrap: {
    width: W * 0.7,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.greenDark,
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    textAlign: "center",
    margin: 30,
  },
  modalButtonWrap: {
    flexDirection: "row",
    height: 45,
    width: "100%",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.green,
    width: "100%",
  },
  modalButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },

  savingModalWrap: {
    width: W * 0.65,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.greenDark,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  savingText: {
    fontSize: 18,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    textAlign: "center",
    marginTop: 16,
  },
});
