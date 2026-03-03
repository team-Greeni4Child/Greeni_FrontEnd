import React, { useMemo, useState, useCallback, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ImageBackground,
  Alert,
  BackHandler,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";
import { getDiariesByMonth } from "../api/diary";
import { ProfileContext } from "../context/ProfileContext";

const { width: W, height: H } = Dimensions.get("window");

// -------- Utils --------
const pad2 = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

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

  // 뒤로가기 누르면 Home으로
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true; // 이벤트 소비 → 앱 종료 방지
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [navigation])
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

        // 테스트용: 3월 3일
        if (year === 2026 && month === 2) {
          const testKey = `${year}-03-03`;
          next[testKey] = emotionToSticker["HAPPY"];
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

  const diaryDates = useMemo(() => new Set(Object.keys(stickerMap)), [stickerMap]);

  const matrix = useMemo(() => buildMonthMatrix(year, month), [year, month]);

  const hasDiary = useCallback((d) => (d ? diaryDates.has(ymd(d)) : false), [diaryDates]);

  // 날짜별 스티커 얻기
  const getStickerSource = useCallback(
    (d) => {
      if (!d) return null;
      const key = ymd(d);
      return stickerMap[key] || null;
    },
    [stickerMap]
  );

  const goPrev = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
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

  const openDiary = (d) => {
    if (!hasDiary(d)) return; // 스티커 없으면 아무 것도 안 함
    const dateKey = ymd(d);
    // '일기 보기' 화면으로 이동
    // 아직 상세화면이 없다면 아래 Alert를 유지하고, 준비되면 navigate로 교체
    try {
      navigation.navigate("DiaryRecord", { date: dateKey });
    } catch {
      Alert.alert("일기 보기", `${dateKey} 일기 화면으로 이동합니다 (화면 연결 필요)`);
    }
  };

  const monthLabel = `${year}년 ${month + 1}월`;
  const weekdayLabels = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <View style={styles.root}>
      {/* 네비게이션 바 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
          setTab(i);
          if (i === 0) navigation.navigate("Home");
          if (i === 1) navigation.navigate("Calendar");
          if (i === 2) navigation.navigate("Statistics");
          if (i === 3) navigation.navigate("MyPage");
        }}
      />
      
      <Text style={styles.title}>일기 보기</Text>

      {/* 상단 타이틀/말풍선/그리니 영역 */}
      <View style={styles.headerWrap}>
        <ImageBackground
          source={require("../assets/images/bubble_calendar2.png")}
          style={styles.bubble}
          resizeMode="stretch"
        >
          <Text style={styles.bubbleText}>예전에 쓴 일기를 볼 수 있어요</Text>
        </ImageBackground>

        <Image
          source={require("../assets/images/greeni_face.png")}
          style={styles.greeni}
          resizeMode="contain"
        />

        {/* 월 이동/표시 */}
        <View style={styles.monthRow}>
          <TouchableOpacity onPress={goPrev} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthText}>{monthLabel}</Text>
          <TouchableOpacity onPress={goNext} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {weekdayLabels.map((w, i) => (
          <Text key={i} style={[styles.weekLabel, i === 0 ? styles.sun : i === 6 ? styles.sat : null]}>
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

              return (
                <View key={c} style={styles.cell}>
                  {/* 날짜 숫자 */}
                  <Text
                    style={[
                      styles.dayNum,
                      !isThisMonth && styles.dim,
                      c === 0 ? styles.sun : c === 6 ? styles.sat : null,
                    ]}
                  >
                    {dayNum}
                  </Text>

                  {/* 스티커/빈칸 */}
                  {d ? (
                    diary ? (
                      // 스티커 붙은 날: 터치 가능
                      <TouchableOpacity
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
                    <View style={{ height: 28 }} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const CELL_W = Math.floor((W - 32) / 7); // 좌우 여백 감안

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", 
    backgroundColor: colors.ivory,
    paddingTop: 120,
  },
  title: {
    position: "absolute",
    // top: 80,
    top: 65,
    fontFamily: "Maplestory_Bold",
    // fontSize: 24,
    fontSize: 28,
    color: colors.brown,
  },
  // --- 상단 ---
  headerWrap: {
    width: W,
    height: H * 0.25,
    //backgroundColor:"red",
  },
  bubble: {
    maxWidth: W * 0.75, 
    paddingHorizontal: 10,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    top: 10,
    right: -65,
  },
  bubbleText: {
    fontSize: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
    lineHeight: 26,
  },
  greeni: {
    // height: H * 0.15,
    // left: -50,
    // top: -50,
    width: 72,
    height: 62,
    left: 35,
    top: -92,
  },
  monthRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 18,
    left:80,
    // top: -90,
    top: -25,
  },
  arrowBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 4 
  },
  arrowText: { 
    fontSize: 24, 
    color: colors.brown, 
    fontFamily: "Maplestory_Bold" 
  },
  monthText: {
    fontSize: 18,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // --- 요일 ---
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: W - 32,
    // marginTop: 12,
    marginTop: -35,
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    paddingBottom: 8,
  },
  weekLabel: {
    width: CELL_W,
    textAlign: "center",
    fontFamily: "Maplestory_Light",
    fontSize: 14,
    color: colors.brown,
  },
  sun: { color: "#C85A54" },
  sat: { color: "#5A6AC8" },

  // --- 그리드 ---
  grid: {
    width: W - 32,
    marginTop: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cell: {
    width: CELL_W,
    alignItems: "center",
  },
  dayNum: {
    fontSize: 13,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    marginBottom: 6,
  },
  dim: { opacity: 0.25 },

  stickerHit: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  stickerImage: {
    width: 36,
    height: 36,
  },
});
