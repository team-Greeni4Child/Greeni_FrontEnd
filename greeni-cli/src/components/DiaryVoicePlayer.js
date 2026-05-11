import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Pressable,
  Dimensions,
} from "react-native";

import colors from "../theme/colors";

const { width: W } = Dimensions.get("window");

function formatMs(ms) {
  const safe = Math.max(0, Number(ms) || 0);
  const totalSec = Math.floor(safe / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

export default function DiaryVoicePlayer({
  title,
  currentIndex,
  totalCount,
  isPlaying,
  isLoading,
  currentPosition,
  duration,
  progressRatio,
  isPrevDisabled,
  isNextDisabled,
  onPressPrev,
  onPressNext,
  onPressPlayPause,
  onPressClose,
  onSeek,
  onProgressLayout,
}) {
  const safeProgressRatio = Math.max(0, Math.min(1, progressRatio || 0));

  return (
    <View style={styles.playerWrap}>
      <View style={styles.topRow}>
        <Text style={styles.countText}>
          {currentIndex + 1}/{totalCount}
        </Text>

        <Text style={styles.titleText} numberOfLines={1}>
          {title}
        </Text>

        <TouchableOpacity style={styles.closeButton} onPress={onPressClose} activeOpacity={0.8}>
          <Text style={styles.closeText}>×</Text>
        </TouchableOpacity>
      </View>

      <Pressable
        style={styles.progressArea}
        onLayout={onProgressLayout}
        onPress={e => {
          onSeek?.(e.nativeEvent.locationX);
        }}
      >
        <View style={styles.progressTrack} />

        <View style={[styles.progressThumb, { left: `${safeProgressRatio * 100}%` }]} />
      </Pressable>

      <View style={styles.bottomRow}>
        <Text style={styles.timeText}>{formatMs(currentPosition)}</Text>

        <View style={styles.controlRow}>
          <TouchableOpacity
            onPress={onPressPrev}
            activeOpacity={0.85}
            disabled={isPrevDisabled}
            style={[styles.sideButton, isPrevDisabled && styles.disabledButton]}
          >
            <Image
              source={require("../assets/images/voice_prev.png")}
              style={styles.sideIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressPlayPause}
            activeOpacity={0.9}
            disabled={isLoading}
            style={[styles.playButton, isLoading && styles.disabledButton]}
          >
            <Image
              source={
                isPlaying
                  ? require("../assets/images/voice_pause.png")
                  : require("../assets/images/voice_play.png")
              }
              style={styles.playIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressNext}
            activeOpacity={0.85}
            disabled={isNextDisabled}
            style={[styles.sideButton, isNextDisabled && styles.disabledButton]}
          >
            <Image
              source={require("../assets/images/voice_next.png")}
              style={styles.sideIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.timeText}>{formatMs(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playerWrap: {
    position: "absolute",
    left: 18,
    right: 18,
    top: 155,
    height: 158,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.green,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    zIndex: 20,
  },

  topRow: {
    height: 31,
    flexDirection: "row",
    alignItems: "center",
  },

  countText: {
    position: "absolute",
    left: 0,
    top: -8,
    width: 70,
    fontFamily: "gangwongyoyuksaeeum",
    fontSize: 24,
    color: colors.brown,
  },

  titleText: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Maplestory_Light",
    fontSize: 18,
    color: colors.brown,
  },

  closeButton: {
    position: "absolute",
    right: -7,
    top: -8,
    width: 70,
    alignItems: "flex-end",
    justifyContent: "center",
  },

  closeText: {
    fontFamily: "Maplestory_Light",
    fontSize: 30,
    color: colors.brown,
    lineHeight: 32,
  },

  progressArea: {
    height: 28,
    justifyContent: "center",
    marginHorizontal: 14,
  },

  progressTrack: {
    height: 3,
    borderRadius: 999,
    backgroundColor: colors.brown,
  },

  progressThumb: {
    position: "absolute",
    width: 18,
    height: 18,
    marginLeft: -9,
    borderRadius: 9,
    backgroundColor: colors.greenDark,
  },

  bottomRow: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  timeText: {
    fontFamily: "gangwongyoyuksaeeum",
    fontSize: 24,
    color: colors.brown,
  },

  controlRow: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  sideButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 7,
  },

  sideIcon: {
    width: 27,
    height: 27,
  },

  playButton: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },

  playIcon: {
    width: 58,
    height: 58,
  },

  disabledButton: {
    opacity: 0.35,
  },
});
