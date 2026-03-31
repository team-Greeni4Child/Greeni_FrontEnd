import React, { useEffect, useMemo, useState, useCallback, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Pressable,
} from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Sound from "react-native-nitro-sound";

import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import DiarySummaryToggle from "../components/DiarySummaryToggle";
import { ProfileContext } from "../context/ProfileContext";
import { getDiaryByDay, getDiaryVoiceByDay } from "../api/diary";

const { width: W, height: H } = Dimensions.get("window");

const S3_PUBLIC_BASE_URL = "https://greeni-upload-files.s3.ap-northeast-2.amazonaws.com";

// "YYYY-MM-DD" | Date -> "M/D"
const toMD = input => {
  let d;
  if (typeof input === "string") {
    const [y, m, day] = input.split("-").map(v => parseInt(v, 10));
    d = new Date(y, m - 1, day);
  } else if (input instanceof Date) {
    d = input;
  } else {
    d = new Date();
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const emotionToIcon = {
  HAPPY: require("../assets/images/happy.png"),
  SAD: require("../assets/images/sad.png"),
  ANGRY: require("../assets/images/angry.png"),
  SURPRISED: require("../assets/images/surprised.png"),
  ANXIETY: require("../assets/images/anxiety.png"),
};

function buildDiaryImageUri(diaryImage) {
  if (!diaryImage || typeof diaryImage !== "string") return "";

  const trimmed = diaryImage.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `${S3_PUBLIC_BASE_URL}/${trimmed}`;
}

function normalizeVoiceList(rawVoiceList) {
  if (!Array.isArray(rawVoiceList)) return [];

  return rawVoiceList
    .map((item, index) => ({
      id: `${item?.createdAt ?? index}-${index}`,
      url: typeof item?.voiceUrl === "string" ? item.voiceUrl.trim() : "",
      role: item?.voiceRole ?? "",
      createdAt: item?.createdAt ?? "",
      title:
        item?.voiceRole === "GREENI"
          ? `그리니 음성 ${index + 1}`
          : item?.voiceRole === "CHILD"
          ? `아이 음성 ${index + 1}`
          : `음성 ${index + 1}`,
    }))
    .filter(item => item.url.length > 0);
}

function formatMs(ms) {
  const safe = Math.max(0, Number(ms) || 0);
  const totalSec = Math.floor(safe / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function DiaryRecordScreen({ navigation, route }) {
  const { selectedProfile } = useContext(ProfileContext);

  // 토글 상태: "picture" | "text"
  const [mode, setMode] = useState("picture");

  // 일기 요약 높이 측정용
  const [sheetH, setSheetH] = useState(0);

  // 서버에서 받은 일기 데이터
  const [diaryData, setDiaryData] = useState(null);

  // 서버에서 받은 음성 데이터
  const [voiceData, setVoiceData] = useState(null);

  // 플레이어 상태
  const [isVoiceLoading, setIsVoiceLoading] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVoiceIndex, setCurrentVoiceIndex] = useState(0);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progressBarW, setProgressBarW] = useState(0);

  const isMountedRef = useRef(true);

  // route.params?.date 가 있으면 그 날짜, 없으면 오늘
  const titleDate = useMemo(() => {
    const paramDate = route?.params?.date; // "YYYY-MM-DD" 기대
    return toMD(paramDate || new Date());
  }, [route?.params?.date]);

  const diaryImageUri = useMemo(() => {
    return buildDiaryImageUri(diaryData?.diaryImage);
  }, [diaryData?.diaryImage]);

  const voiceList = useMemo(() => {
    return normalizeVoiceList(voiceData?.voiceList);
  }, [voiceData]);

  const currentVoice = useMemo(() => {
    return voiceList[currentVoiceIndex] ?? null;
  }, [voiceList, currentVoiceIndex]);

  // 일별 일기 조회 연동
  useEffect(() => {
    let alive = true;

    async function loadDiary() {
      const profileId = selectedProfile?.profileId;
      const paramDate = route?.params?.date; // "YYYY-MM-DD"

      // date 없이 들어온 경우(오늘 보기 등)에는 서버 조회 스킵
      if (!profileId || !paramDate) return;

      const [y, m, d] = paramDate.split("-").map(Number);

      try {
        const res = await getDiaryByDay({
          year: y,
          month: m,
          day: d,
          profileId,
        });

        if (alive) setDiaryData(res?.result ?? null);
      } catch (e) {
        // 해당 날짜에 일기 없음
        if (e?.code === "DIARY4004") {
          if (alive) setDiaryData(null);
          return;
        }

        if (e?.message === "NO_ACCESS_TOKEN") {
          return;
        }

        console.log("[DAY] error:", e);
      }
    }

    loadDiary();
    return () => {
      alive = false;
    };
  }, [route?.params?.date, selectedProfile?.profileId]);

  const stopPlayback = useCallback(async ({ hide = false, resetIndex = false } = {}) => {
    try {
      await Sound.stopPlayer();
    } catch (e) {}

    try {
      Sound.removePlayBackListener?.();
    } catch (e) {}

    try {
      Sound.removePlaybackEndListener?.();
    } catch (e) {}

    if (!isMountedRef.current) return;

    setIsPlaying(false);
    setCurrentPosition(0);
    setDuration(0);

    if (hide) setShowPlayer(false);
    if (resetIndex) setCurrentVoiceIndex(0);
  }, []);

  const startPlayback = useCallback(
    async (voiceItem, list, index) => {
      if (!voiceItem?.url) return;

      console.log("[VOICE][START REQUEST]", {
        index,
        role: voiceItem.role,
        url: voiceItem.url,
        createdAt: voiceItem.createdAt,
      });

      await stopPlayback();

      try {
        setIsVoiceLoading(true);
        setShowPlayer(true);
        setCurrentPosition(0);
        setDuration(0);
        setCurrentVoiceIndex(index);

        Sound.setSubscriptionDuration(0.1);

        Sound.addPlayBackListener(e => {
          if (!isMountedRef.current) return;

          const nextPosition = Number(e?.currentPosition ?? 0);
          const nextDuration = Number(e?.duration ?? 0);

          setCurrentPosition(nextPosition);
          setDuration(nextDuration);
        });

        Sound.addPlaybackEndListener(() => {
          if (!isMountedRef.current) return;

          console.log("[VOICE][END]", {
            endedIndex: index,
            endedRole: voiceItem.role,
            endedUrl: voiceItem.url,
            endedCreatedAt: voiceItem.createdAt,
          });

          setIsPlaying(false);
          setCurrentPosition(0);

          const nextIndex = index + 1;

          if (nextIndex < list.length) {
            const nextVoice = list[nextIndex];

            console.log("[VOICE][AUTO NEXT]", {
              nextIndex,
              nextRole: nextVoice?.role,
              nextUrl: nextVoice?.url,
              nextCreatedAt: nextVoice?.createdAt,
            });

            setTimeout(() => {
              if (nextVoice?.url) {
                startPlayback(nextVoice, list, nextIndex);
              }
            }, 50);
          } else {
            console.log("[VOICE][AUTO NEXT] no more voice");
          }
        });

        console.log("[VOICE][PLAY]", {
          index,
          role: voiceItem.role,
          url: voiceItem.url,
          createdAt: voiceItem.createdAt,
        });

        await Sound.startPlayer(voiceItem.url);

        if (!isMountedRef.current) return;
        setIsPlaying(true);
      } catch (e) {
        console.log("[VOICE][PLAY] error:", e);
        Alert.alert("오류", "음성을 재생하지 못했어요.");

        if (isMountedRef.current) {
          setShowPlayer(false);
          setIsPlaying(false);
        }
      } finally {
        if (isMountedRef.current) {
          setIsVoiceLoading(false);
        }
      }
    },
    [stopPlayback],
  );

  const handleTogglePlayPause = useCallback(async () => {
    if (!currentVoice?.url || isVoiceLoading) return;

    try {
      if (isPlaying) {
        console.log("[VOICE][PAUSE]", {
          index: currentVoiceIndex,
          role: currentVoice?.role,
          url: currentVoice?.url,
          createdAt: currentVoice?.createdAt,
        });

        await Sound.pausePlayer();
        setIsPlaying(false);
      } else {
        console.log("[VOICE][RESUME]", {
          index: currentVoiceIndex,
          role: currentVoice?.role,
          url: currentVoice?.url,
          createdAt: currentVoice?.createdAt,
        });

        await Sound.resumePlayer();
        setIsPlaying(true);
      }
    } catch (e) {
      try {
        console.log("[VOICE][RESUME FAIL -> RESTART]", {
          index: currentVoiceIndex,
          role: currentVoice?.role,
          url: currentVoice?.url,
          createdAt: currentVoice?.createdAt,
        });

        await startPlayback(currentVoice, voiceList, currentVoiceIndex);
      } catch (err) {
        console.log("[VOICE][TOGGLE] error:", err);
      }
    }
  }, [currentVoice, currentVoiceIndex, isVoiceLoading, isPlaying, startPlayback, voiceList]);

  const handleSeek = useCallback(
    async locationX => {
      if (!duration || !progressBarW) return;

      const ratio = Math.max(0, Math.min(1, locationX / progressBarW));
      const nextMs = Math.floor(duration * ratio);

      console.log("[VOICE][SEEK]", {
        index: currentVoiceIndex,
        role: currentVoice?.role,
        url: currentVoice?.url,
        nextMs,
      });

      try {
        await Sound.seekToPlayer(nextMs);
        setCurrentPosition(nextMs);
      } catch (e) {
        console.log("[VOICE][SEEK] error:", e);
      }
    },
    [duration, progressBarW, currentVoiceIndex, currentVoice],
  );

  const handlePrevVoice = useCallback(async () => {
    if (voiceList.length <= 1 || currentVoiceIndex === 0) return;

    const nextIndex = currentVoiceIndex - 1;
    const nextVoice = voiceList[nextIndex];

    console.log("[VOICE][PREV]", {
      fromIndex: currentVoiceIndex,
      toIndex: nextIndex,
      toRole: nextVoice?.role,
      toUrl: nextVoice?.url,
      toCreatedAt: nextVoice?.createdAt,
    });

    await startPlayback(nextVoice, voiceList, nextIndex);
  }, [voiceList, currentVoiceIndex, startPlayback]);

  const handleNextVoice = useCallback(async () => {
    if (voiceList.length <= 1 || currentVoiceIndex >= voiceList.length - 1) {
      return;
    }

    const nextIndex = currentVoiceIndex + 1;
    const nextVoice = voiceList[nextIndex];

    console.log("[VOICE][NEXT]", {
      fromIndex: currentVoiceIndex,
      toIndex: nextIndex,
      toRole: nextVoice?.role,
      toUrl: nextVoice?.url,
      toCreatedAt: nextVoice?.createdAt,
    });

    await startPlayback(nextVoice, voiceList, nextIndex);
  }, [voiceList, currentVoiceIndex, startPlayback]);

  // 헤드셋 버튼: 일기 상세 음성 조회 연동
  const handlePressHeadset = useCallback(async () => {
    const profileId = selectedProfile?.profileId;
    const paramDate = route?.params?.date; // "YYYY-MM-DD"

    if (!profileId || !paramDate || isVoiceLoading) return;

    const [y, m, d] = paramDate.split("-").map(Number);

    try {
      setIsVoiceLoading(true);

      const res = await getDiaryVoiceByDay({
        year: y,
        month: m,
        day: d,
        profileId,
      });

      const result = res?.result ?? null;
      const normalized = normalizeVoiceList(result?.voiceList);

      console.log("[VOICE][RAW RESULT]", result);
      console.log("[VOICE][RAW VOICE LIST]", result?.voiceList ?? []);
      console.log(
        "[VOICE][NORMALIZED LIST]",
        normalized.map((item, index) => ({
          index,
          role: item.role,
          url: item.url,
          createdAt: item.createdAt,
          id: item.id,
        })),
      );

      if (normalized.length >= 2) {
        console.log("[VOICE][COMPARE 0-1 SAME URL]", normalized[0].url === normalized[1].url);
      }
      if (normalized.length >= 3) {
        console.log("[VOICE][COMPARE 1-2 SAME URL]", normalized[1].url === normalized[2].url);
      }

      setVoiceData(result);

      if (normalized.length === 0) {
        setShowPlayer(false);
        Alert.alert("안내", "해당 날짜에 저장된 음성이 없어요.");
        return;
      }

      await startPlayback(normalized[0], normalized, 0);
    } catch (e) {
      if (e?.code === "DIARY4004") {
        Alert.alert("안내", "해당 날짜에 작성한 일기가 없어요.");
        return;
      }

      if (e?.message === "NO_ACCESS_TOKEN") return;

      console.log("[VOICE] error:", e);
      Alert.alert("오류", e?.message || "음성 데이터를 불러오지 못했어요.");
    } finally {
      if (isMountedRef.current) {
        setIsVoiceLoading(false);
      }
    }
  }, [route?.params?.date, selectedProfile?.profileId, isVoiceLoading, startPlayback]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      stopPlayback({ hide: true, resetIndex: true });
    };
  }, [stopPlayback]);

  const isText = mode === "text";

  // 측정된 높이를 기반으로 완전히 숨길 translateY 계산
  // sheetH가 아직 0이면 임시값으로 조금 크게 숨김
  const HIDE_Y = (sheetH || 220) + 40;

  // 토글이 일기 요약 위로 얼마나 뜰지 (값이 클수록 갭이 작음)
  const TOGGLE_GAP = 80;

  const t = useSharedValue(isText ? 1 : 0);

  useEffect(() => {
    t.value = withTiming(isText ? 1 : 0, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [isText, t]);

  const sheetAnimStyle = useAnimatedStyle(() => {
    const ty = interpolate(t.value, [0, 1], [HIDE_Y, 0]);
    return {
      transform: [{ translateY: ty }],
      opacity: t.value,
    };
  }, [HIDE_Y]);

  const toggleAnimStyle = useAnimatedStyle(() => {
    const lift = interpolate(t.value, [0, 1], [0, HIDE_Y - TOGGLE_GAP]);
    return {
      transform: [{ translateY: -lift }],
    };
  }, [HIDE_Y]);

  // 일기 요약 높이 측정
  const onSheetLayout = useCallback(e => {
    const h = e?.nativeEvent?.layout?.height ?? 0;
    if (h > 0) setSheetH(h);
  }, []);

  const emotionKey = String(diaryData?.emotion ?? "").toUpperCase();
  const emotionIcon = emotionToIcon[emotionKey];

  const safeDuration = Math.max(0, duration || 0);
  const safePosition = Math.min(Math.max(0, currentPosition || 0), safeDuration || 0);
  const progressRatio = safeDuration > 0 ? safePosition / safeDuration : 0;

  return (
    <View style={styles.root}>
      {/* 상단 바 */}
      <View style={styles.topBar}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>{titleDate}</Text>

        {/* 헤드셋 아이콘 (오른쪽 상단) */}
        <TouchableOpacity
          style={styles.headsetBtn}
          activeOpacity={0.8}
          onPress={handlePressHeadset}
          disabled={isVoiceLoading}
        >
          <Image
            source={require("../assets/images/headset.png")}
            style={[styles.headsetIcon, isVoiceLoading && { opacity: 0.5 }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 그림 영역 */}
      <View style={styles.drawArea}>
        {diaryImageUri ? (
          <Image source={{ uri: diaryImageUri }} style={styles.diaryImage} resizeMode="contain" />
        ) : (
          <View style={styles.emptyWrap} />
        )}
      </View>

      {/* 음성 플레이어 */}
      {showPlayer && (
        <View style={styles.playerWrap}>
          <View style={styles.playerTopRow}>
            <Text style={styles.playerTitle}>
              {currentVoice?.role === "GREENI"
                ? "그리니"
                : currentVoice?.role === "CHILD"
                ? "아이"
                : "음성"}
              {voiceList.length > 1 ? ` (${currentVoiceIndex + 1}/${voiceList.length})` : ""}
            </Text>

            <TouchableOpacity
              onPress={() => stopPlayback({ hide: true, resetIndex: false })}
              activeOpacity={0.8}
            >
              <Text style={styles.playerClose}>닫기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.playerControlRow}>
            <TouchableOpacity
              style={[styles.sideBtn, currentVoiceIndex === 0 && styles.sideBtnDisabled]}
              onPress={handlePrevVoice}
              activeOpacity={0.8}
              disabled={currentVoiceIndex === 0}
            >
              <Text style={styles.sideBtnText}>‹</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playBtn}
              onPress={handleTogglePlayPause}
              activeOpacity={0.85}
              disabled={isVoiceLoading}
            >
              <Text style={styles.playBtnText}>
                {isVoiceLoading ? "..." : isPlaying ? "❚❚" : "▶"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sideBtn,
                currentVoiceIndex >= voiceList.length - 1 && styles.sideBtnDisabled,
              ]}
              onPress={handleNextVoice}
              activeOpacity={0.8}
              disabled={currentVoiceIndex >= voiceList.length - 1}
            >
              <Text style={styles.sideBtnText}>›</Text>
            </TouchableOpacity>
          </View>

          <Pressable
            style={styles.progressArea}
            onLayout={e => {
              setProgressBarW(e?.nativeEvent?.layout?.width ?? 0);
            }}
            onPress={e => {
              handleSeek(e.nativeEvent.locationX);
            }}
          >
            <View style={styles.progressTrack} />
            <View style={[styles.progressFill, { width: `${progressRatio * 100}%` }]} />
            <View style={[styles.progressThumb, { left: `${progressRatio * 100}%` }]} />
          </Pressable>

          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatMs(safePosition)}</Text>
            <Text style={styles.timeText}>{formatMs(safeDuration)}</Text>
          </View>
        </View>
      )}

      {/* 토글 */}
      <Animated.View style={[styles.toggleWrap, toggleAnimStyle]}>
        <DiarySummaryToggle value={mode} onChange={setMode} />
      </Animated.View>

      {/* 일기 요약 sheet */}
      <Animated.View
        pointerEvents={isText ? "auto" : "none"}
        style={[styles.sheet, sheetAnimStyle]}
        onLayout={onSheetLayout}
      >
        <View style={styles.sheetInner}>
          {/* 감정 + 오늘의 키워드 */}
          <View style={styles.metaWrap}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>감정 :</Text>
              {emotionIcon ? (
                <Image source={emotionIcon} style={styles.emotionIcon} resizeMode="contain" />
              ) : (
                <View style={styles.emotionIcon} />
              )}
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>오늘의 키워드 :</Text>
              <Text style={styles.keywordText}>{diaryData?.keyword ?? ""}</Text>
            </View>
          </View>

          {/* 분홍 구분선 */}
          <View style={styles.divider} />

          {/* 일기 요약 텍스트 */}
          <Text style={styles.summaryText}>{diaryData?.summary ?? ""}</Text>
        </View>
      </Animated.View>
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
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  title: {
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
  },

  // 오른쪽 상단 헤더 아이콘
  headsetBtn: {
    position: "absolute",
    right: 20,
    top: 70,
    padding: 8, // 터치 영역 확보
  },
  headsetIcon: {
    width: 30,
    height: 30,
  },

  drawArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  diaryImage: {
    width: "100%",
    height: "100%",
  },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  playerWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    top: 155,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: colors.greenDark,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    zIndex: 20,
  },
  playerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  playerTitle: {
    flex: 1,
    fontFamily: "Maplestory_Bold",
    fontSize: 14,
    color: colors.brown,
    marginRight: 10,
  },
  playerClose: {
    fontFamily: "Maplestory_Light",
    fontSize: 13,
    color: colors.brown,
  },
  playerControlRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    gap: 12,
  },
  sideBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory,
  },
  sideBtnDisabled: {
    opacity: 0.35,
  },
  sideBtnText: {
    fontSize: 22,
    color: colors.brown,
    fontFamily: "Maplestory_Bold",
    bottom: 1,
  },
  playBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
  },
  playBtnText: {
    fontSize: 24,
    color: colors.brown,
    fontFamily: "Maplestory_Bold",
  },
  progressArea: {
    justifyContent: "center",
    height: 22,
  },
  progressTrack: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E8E3D3",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    height: 8,
    borderRadius: 999,
    backgroundColor: colors.green,
  },
  progressThumb: {
    position: "absolute",
    marginLeft: -7,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.greenDark,
  },
  timeRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timeText: {
    fontFamily: "Maplestory_Light",
    fontSize: 12,
    color: colors.brown,
  },

  // 토글
  toggleWrap: {
    position: "absolute",
    bottom: 50,
    right: 20,
  },

  // 일기 요약
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: -3,
    backgroundColor: "transparent",
  },

  sheetInner: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    minHeight: 170,
    paddingHorizontal: 25,
    paddingTop: 25,
    paddingBottom: 90,
  },

  metaWrap: {
    paddingHorizontal: 10,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaLabel: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
  },

  emotionIcon: {
    width: 40,
    height: 40,
    marginLeft: 8,
    bottom: 3,
  },

  keywordText: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
    marginLeft: 8,
  },

  divider: {
    height: 2,
    backgroundColor: colors.pinkDark,
    marginTop: 13,
    marginBottom: 10,
    borderRadius: 2,
  },

  summaryText: {
    fontFamily: "gangwongyoyuksaeeum",
    fontSize: 30,
    color: colors.brown,
    lineHeight: 30,
    paddingHorizontal: 10,
  },
});
