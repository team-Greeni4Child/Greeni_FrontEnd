import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ImageBackground,
  Image,
  Dimensions,
} from "react-native";
import { RNHoleView } from "react-native-hole-view";
import colors from "../theme/colors";
import { playButtonSound } from "../utils/soundEffects";

const { width: W } = Dimensions.get("window");

export default function TutorialOverlay({
  visible = false,
  message = "",
  onPressPrimary,
  onPressSkip,
  dimmed = true,
  target = null,
  allowBackgroundPress = true,
  onPressTarget,
  children,
  contentStyle,
}) {
  const skipPressedRef = useRef(false);

  if (!visible) return null;

  const handleOverlayRelease = () => {
    if (!allowBackgroundPress) {
      skipPressedRef.current = false;
      return;
    }

    if (skipPressedRef.current) {
      skipPressedRef.current = false;
      return;
    }

    if (typeof onPressPrimary === "function") {
      onPressPrimary();
    }
  };

  const handlePressSkip = () => {
    playButtonSound();
    onPressSkip?.();
  };

  return (
    <View
      style={[styles.overlay, (!dimmed || target) && styles.overlayTransparent]}
      onStartShouldSetResponder={() => true}
      onResponderRelease={handleOverlayRelease}
    >
      {target && (
        <>
          <RNHoleView
            style={styles.holeOverlay}
            holes={[
              {
                x: target.x,
                y: target.y,
                width: target.width,
                height: target.height,
                borderRadius: target.borderRadius ?? 15,
              },
            ]}
            pointerEvents="none"
          />

          {typeof onPressTarget === "function" && (
            <Pressable
              style={[
                styles.targetPressArea,
                {
                  left: target.x,
                  top: target.y,
                  width: target.width,
                  height: target.height,
                  borderRadius: target.borderRadius ?? 15,
                },
              ]}
              onPress={onPressTarget}
            />
          )}
        </>
      )}

      {children}

      <View style={[styles.content, contentStyle]} pointerEvents="box-none">
        <View style={styles.bubbleWrap} pointerEvents="box-none">
          <Image
            source={require("../assets/images/greeni_face.png")}
            style={styles.greeniFace}
            resizeMode="contain"
            pointerEvents="none"
          />
          <ImageBackground
            source={require("../assets/images/bubble_tutorial.png")}
            style={styles.messageBubble}
            resizeMode="stretch"
            pointerEvents="none"
          >
            <Text style={styles.message}>{message}</Text>
          </ImageBackground>

          {typeof onPressSkip === "function" && (
            <TouchableOpacity
              style={styles.skipButton}
              onPressIn={() => {
                skipPressedRef.current = true;
              }}
              onPress={handlePressSkip}
            >
              <Text style={styles.skipText}>건너뛰기</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    zIndex: 999,
    elevation: 999,
  },
  overlayTransparent: {
    backgroundColor: "transparent",
  },
  holeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    width: "88%",
    alignItems: "center",
    marginTop: 96,
  },
  targetPressArea: {
    position: "absolute",
    zIndex: 2,
    backgroundColor: "transparent",
  },
  bubbleWrap: {
    width: "100%",
    alignItems: "center",
  },
  greeniFace: {
    position: "absolute",
    left: 3,
    top: -18,
    width: 60,
    height: 60,
    aspectRatio: 96 / 96,
    zIndex: 2,
  },
  messageBubble: {
    width: Math.min(W * 0.8, 340),
    minHeight: 100,
    paddingHorizontal: 28,
    paddingVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    fontSize: 24,
    lineHeight: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
  },
  skipButton: {
    position: "absolute",
    right: 20,
    bottom: -50,
    backgroundColor: colors.beige,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  skipText: {
    textAlign: "center",
    color: colors.brown,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
  },
});
