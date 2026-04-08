import React, { useMemo, useState, useCallback, useEffect, useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";
import TutorialOverlay from "../components/TutorialOverlay";
import { getDiariesByMonth } from "../api/diary";
import { ProfileContext } from "../context/ProfileContext";
import { useTutorial } from "../context/TutorialContext";
import { center } from "@shopify/react-native-skia";

const { width: W, height: H } = Dimensions.get("window");

// -------- Utils --------
const pad2 = n => String(n).padStart(2, "0");
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

const emotionToSticker = {
  HAPPY: require("../assets/images/happy.png"),
  SAD: require("../assets/images/sad.png"),
  ANGRY: require("../assets/images/angry.png"),
  SURPRISED: require("../assets/images/surprised.png"),
  ANXIETY: require("../assets/images/anxiety.png"),
};

// 월 달력(6x7) 행렬 생성 (일요일 시작)
function buildMonthMatrix(year, month) {
  // month: 0~11
  const first = new Date(year, month, 1);
  const firstWeekday = first.getDay(); // 0=일
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  const leading = firstWeekday;
  const total = 42; // 6주 고정

  for (let i = 0; i < total; i++) {
    const dayNum = i - leading + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push(null);
    } else {
      cells.push(new Date(year, month, dayNum));
    }
  }
  // 6행 x 7열
  const rows = [];
  for (let r = 0; r < 6; r++) {
    rows.push(cells.slice(r * 7, (r + 1) * 7));
  }

  return rows;
}

export default function CalendarScreen({ navigation }) {
  // 현재 월 상태
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0~11
  const [tab, setTab] = useState(1);

  const { selectedProfile } = useContext(ProfileContext);

  // 서버 연동 스티커 맵: "YYYY-MM-DD" -> require(...)
  const [stickerMap, setStickerMap] = useState({});

  // 튜토리얼용 달력 Ref
  const rootRef = useRef(null);
  const tutorialDiaryRef = useRef(null);
  const statisticsTabButtonRef = useRef(null);

  const {
    isTutorialEnabled,
    activeFlowId,
    currentStep,
    targets,
    tutorialDiary,
    nextStep,
    stopTutorial,
    registerTarget,
    clearTarget,
  } = useTutorial();

  // 뒤로가기 누르면 Home으로
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true; // 이벤트 소비 → 앱 종료 방지
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [navigation]),
  );

  // 월별 일기 목록 조회 (year/month/profileId 바뀔 때마다)
  useEffect(() => {
    let alive = true;

    async function loadMonth() {
      const profileId = selectedProfile?.profileId;
      if (!profileId) return;

      try {
        const res = await getDiariesByMonth({
          year,
          month: month + 1, // API는 1~12
          profileId,
        });

        const diaries = res?.result?.diaries ?? [];
        const next = {};

        for (const item of diaries) {
          const day = item?.day;
          const emotion = item?.emotion;
          if (!day || !emotion) continue;

          const key = `${year}-${pad2(month + 1)}-${pad2(day)}`;
          const img = emotionToSticker[emotion];
          if (img) next[key] = img;
        }

        if (alive) setStickerMap(next);
      } catch (e) {
        if (e?.code === "DIARY4001") {
          Alert.alert("안내", "미래의 달은 조회할 수 없어요.");
          return;
        }
        if (e?.code === "DIARY4002") {
          Alert.alert("오류", "월 값이 올바르지 않아요.");
          return;
        }
        if (e?.code === "PROFILE4041") {
          Alert.alert("오류", "존재하지 않는 프로필입니다.");
          return;
        }
        if (e?.code === "PROFILE4031") {
          Alert.alert("오류", "해당 프로필에 접근할 권한이 없습니다.");
          return;
        }
        if (e?.message === "NO_ACCESS_TOKEN") {
          Alert.alert("오류", "로그인이 필요해요.");
          return;
        }

        Alert.alert("오류", "월별 일기 목록을 불러오지 못했어요.");
      }
    }

    loadMonth();
    return () => {
      alive = false;
    };
  }, [year, month, selectedProfile?.profileId]);

  // 튜토리얼용 날짜 (오늘 날짜)
  const tutorialDiaryDate = tutorialDiary?.date || "";

  const mergedStickerMap = useMemo(() => {
    if (!tutorialDiaryDate) return stickerMap;

    return {
      ...stickerMap,
      [tutorialDiaryDate]: emotionToSticker[tutorialDiary?.emotion] || emotionToSticker.HAPPY,
    };
  }, [stickerMap, tutorialDiaryDate, tutorialDiary?.emotion]);

  const diaryDates = useMemo(() => new Set(Object.keys(mergedStickerMap)), [mergedStickerMap]);
  const matrix = useMemo(() => buildMonthMatrix(year, month), [year, month]);

  const hasDiary = useCallback(d => (d ? diaryDates.has(ymd(d)) : false), [diaryDates]);

  // 날짜별 스티커 얻기
  const getStickerSource = useCallback(
    d => {
      if (!d) return null;
      const key = ymd(d);
      return mergedStickerMap[key] || null;
    },
    [mergedStickerMap],
  );

  const goPrev = () => {
    if (month === 0) {
      setYear(y => y - 1);
      setMonth(11);
    } else setMonth(m => m - 1);
  };

  const goNext = () => {
    const currentY = today.getFullYear();
    const currentM = today.getMonth(); // 0~11

    const nextY = month === 11 ? year + 1 : year;
    const nextM = month === 11 ? 0 : month + 1;

    // 미래 달 이동 방지
    if (nextY > currentY || (nextY === currentY && nextM > currentM)) return;

    setYear(nextY);
    setMonth(nextM);
  };

  const openDiary = d => {
    if (!hasDiary(d)) return; // 스티커 없으면 아무 것도 안 함
    const dateKey = ymd(d);

    // '일기 보기' 화면으로 이동

    // 튜토리얼용 Mock Diary
    const isTutorialMockDiary =
      isTutorialEnabled &&
      activeFlowId === "calendar" &&
      tutorialDiaryDate &&
      dateKey === tutorialDiaryDate;

    try {
      navigation.navigate(isTutorialMockDiary ? "TutorialDiaryRecord" : "DiaryRecord", {
        date: dateKey,
        tutorialMockDiary: isTutorialMockDiary,
      });
    } catch {
      Alert.alert("일기 보기", `${dateKey} 일기 화면으로 이동합니다.`);
    }
  };

  const measureTutorialDiaryDate = useCallback(() => {
    if (!rootRef.current || !tutorialDiaryRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      tutorialDiaryRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("tutorialDiaryDate", {
          x: x - rootX - 5,
          y: y - rootY - 5,
          width: width + 10,
          height: height + 10,
          borderRadius: 28,
        });
      });
    });
  }, [registerTarget]);

  const measureStatisticsTabButton = useCallback(() => {
    if (!rootRef.current || !statisticsTabButtonRef.current) return;

    rootRef.current.measureInWindow((rootX, rootY) => {
      statisticsTabButtonRef.current.measureInWindow((x, y, width, height) => {
        registerTarget("statisticsTabButton", {
          x: x - rootX + 12,
          y: y - rootY - 13,
          width: width - 25,
          height: height + 25,
          borderRadius: 10,
        });
      });
    });
  }, [registerTarget]);

  useEffect(() => {
    if (!isTutorialEnabled) return;

    if (currentStep?.targetKey === "tutorialDiaryDate") {
      const timer = setTimeout(measureTutorialDiaryDate, 50);
      return () => clearTimeout(timer);
    }

    if (currentStep?.targetKey === "statisticsTabButton") {
      const timer = setTimeout(measureStatisticsTabButton, 50);
      return () => clearTimeout(timer);
    }

    clearTarget("tutorialDiaryDate");
    clearTarget("statisticsTabButton");
  }, [
    isTutorialEnabled,
    activeFlowId,
    currentStep?.targetKey,
    measureTutorialDiaryDate,
    measureStatisticsTabButton,
    clearTarget,
  ]);

  // 튜토리얼용 Mock Diary 눌렀을 때 튜토리얼 흐름을 이어주기 위한 분기 추가
  const handleTutorialOpenDiary = () => {
    if (!tutorialDiaryDate) return;

    nextStep();
    navigation.navigate("TutorialDiaryRecord", {
      date: tutorialDiaryDate,
      tutorialMockDiary: true,
    });
  };

  const handlePressStatistics = (params = undefined) => {
    setTab(2);
    navigation.navigate("Statistics", params);
  };

  // 통계 버튼 눌렀을 때 튜토리얼 흐름을 이어주기 위한 분기 추가
  const handleTutorialPressStatistics = () => {
    const isStatsIntroStep =
      isTutorialEnabled && activeFlowId === "stats" && currentStep?.id === "stats_calendar_intro";

    if (isStatsIntroStep) {
      nextStep();
      handlePressStatistics({ tutorialFlowId: "stats" });
      return;
    }

    handlePressStatistics();
  };

  const currentTutorialStep =
    isTutorialEnabled && currentStep?.screen === "Calendar" ? currentStep : null;

  const monthLabel = `${year}년 ${month + 1}월`;
  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <View
      ref={rootRef}
      style={styles.root}
      onLayout={() => {
        measureTutorialDiaryDate();
        measureStatisticsTabButton();
      }}
    >
      <TutorialOverlay
        visible={!!currentTutorialStep}
        message={currentTutorialStep?.message || ""}
        onPressPrimary={nextStep}
        onPressSkip={stopTutorial}
        allowBackgroundPress={currentTutorialStep?.allowBackgroundPress !== false}
        onPressTarget={
          currentTutorialStep?.id === "calendar_date_intro"
            ? handleTutorialOpenDiary
            : currentTutorialStep?.id === "stats_calendar_intro"
            ? handleTutorialPressStatistics
            : undefined
        }
        target={
          currentTutorialStep?.targetKey ? targets[currentTutorialStep.targetKey] ?? null : null
        }
        contentStyle={{ marginTop: 100 }}
      />
      {/* 네비게이션 바 */}
      <NavigationBar
        state={tab}
        tabRefs={[null, null, statisticsTabButtonRef]}
        onTabPress={i => {
          setTab(i);
          if (i === 0) navigation.navigate("Home");
          if (i === 1) navigation.navigate("Calendar");
          if (i === 2) handleTutorialPressStatistics();
          if (i === 3) navigation.navigate("MyPage");
        }}
      />

      <Text style={styles.title}>일기 보기</Text>

      <View style={styles.contents}>
        {/* 월 이동/표시 */}
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={goPrev} style={styles.arrowBtn} activeOpacity={0.7}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.monthText}>{monthLabel}</Text>

          <TouchableOpacity onPress={goNext} style={styles.arrowBtn} activeOpacity={0.7}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* 요일 헤더 */}
        <View style={styles.weekHeader}>
          {weekdayLabels.map((w, i) => (
            <Text
              key={i}
              style={[styles.weekLabel, i === 0 ? styles.sun : i === 6 ? styles.sat : null]}
            >
              {w}
            </Text>
          ))}
        </View>

        {/* 달력 그리드 */}
        <View style={styles.grid}>
          {matrix.map((row, r) => (
            <View key={r} style={styles.row}>
              {row.map((d, c) => {
                const isThisMonth = !!d;
                const dayNum = d ? d.getDate() : "";
                const diary = hasDiary(d);
                const stickerSource = getStickerSource(d);
                const dateKey = d ? ymd(d) : "";
                const isTutorialDate = tutorialDiaryDate && dateKey === tutorialDiaryDate;

                return (
                  <View key={c} style={styles.cell}>
                    <Text style={[styles.dayNum, !d && styles.invisible]}>{dayNum}</Text>

                    {/* 스티커/빈칸 */}
                    {d ? (
                      diary ? (
                        // 스티커 붙은 날: 터치 가능
                        <TouchableOpacity
                          ref={isTutorialDate ? tutorialDiaryRef : null}
                          style={styles.stickerHit}
                          activeOpacity={0.8}
                          onPress={() => openDiary(d)}
                        >
                          <Image
                            source={stickerSource}
                            style={styles.stickerImage}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      ) : (
                        // 스티커 없는 날: 터치 X
                        <Image
                          source={require("../assets/images/date_greeni_ivory.png")}
                          style={styles.stickerImage}
                          resizeMode="contain"
                        />
                      )
                    ) : (
                      <View style={styles.stickerPlaceholder} />
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const H_PADDING = 18;
const GRID_W = W - H_PADDING * 2;
const CELL_W = GRID_W / 7;
const ROW_H = 62;
const ROW_GAP = 8;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.ivory,
    paddingTop: H * 0.08 + 30,
    paddingBottom: H * 0.06 + 60,
  },
  title: {
    position: "absolute",
    top: H * 0.08,
    fontFamily: "Maplestory_Bold",
    fontSize: 28,
    color: colors.brown,
  },

  contents: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  monthRow: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowBtn: {
    width: 42,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  arrowText: {
    fontSize: 24,
    color: colors.brown,
    fontFamily: "Maplestory_Bold",
  },
  monthText: {
    minWidth: 150,
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // --- 요일 ---
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: GRID_W,
    marginTop: H * 0.04,
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    paddingBottom: 10,
  },
  weekLabel: {
    width: CELL_W,
    textAlign: "center",
    fontFamily: "Maplestory_Light",
    fontSize: 16,
    color: colors.brown,
  },
  sun: { color: "#C85A54" },
  sat: { color: "#5A6AC8" },

  // --- 그리드 ---
  grid: {
    width: GRID_W,
    marginTop: 15,
    height: ROW_H * 6 + ROW_GAP * 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: ROW_H,
    marginBottom: 10,
  },
  cell: {
    width: CELL_W,
    height: ROW_H,
    alignItems: "center",
  },
  dayNum: {
    fontSize: 13,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    marginBottom: 5,
  },

  invisible: {
    opacity: 0,
  },

  stickerHit: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  stickerImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },

  stickerPlaceholder: {
    width: 40,
    height: 40,
  },
});
