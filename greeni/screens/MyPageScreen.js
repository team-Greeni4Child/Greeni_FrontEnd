import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Platform,
} from "react-native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";

const { width: W, height: H } = Dimensions.get("window");

// 테스트 배지 2개만 우선 노출. (나중에 여기 배열만 늘리면 자동 정렬)
const TEST_BADGES = [
  { id: "b1", src: require("../assets/images/attendance_bedge1.png"), label: "출석 1일" },
  { id: "b2", src: require("../assets/images/diary_bedge1.png"), label: "일기작성 1일" },
  /*
  { id: "b3", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b4", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b5", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b6", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b7", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b8", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b9", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b10", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b11", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b12", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b13", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b14", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b15", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b16", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b17", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b18", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b19", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b20", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b21", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b22", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b23", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b24", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b25", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b26", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b27", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b28", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
  { id: "b29", src: require("../assets/images/diary_bedge1.png"), label: "출석 7일" },
   */
];

export default function MyPageScreen({ navigation }) {
  const [tab, setTab] = useState(2);

  // 뒤로가기 → 앱 종료
  useEffect(() => {
    const onBackPress = () => {
      if (Platform.OS === "android") {
        BackHandler.exitApp();
      }
      return true;
    };
    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      {/* 상단 배경 */}
      <View style={styles.topBg} />

      {/* 하단 네비게이션바 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
          setTab(i);
          if (i === 0) navigation.navigate("Calendar");
          if (i === 1) navigation.navigate("Home");
          if (i === 2) navigation.navigate("MyPage");
        }}
      />

      {/* 타이틀 */}
      <Text style={styles.title}>마이페이지</Text>

      {/* 설정 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("Settings")}
        >
          <Image
            source={require("../assets/images/setting.png")}
            style={styles.settingIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 프로필 카드 */}
      <View style={styles.profileRow}>
        <Image
          source={require("../assets/images/basic_greeni_green.png")}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>김 그리니</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>출석</Text>
            <Text style={styles.statValue}>85일</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>뱃지</Text>
            <Text style={styles.statValue}>{TEST_BADGES.length}개</Text>
          </View>
        </View>
      </View>

      {/* 섹션 타이틀 */}
      <Text style={styles.sectionTitle}>활동 배지</Text>

      {/* 배지 영역 (View + flexWrap) */}
      <View style={styles.badgeGrid}>
        {TEST_BADGES.map((item) => (
          <View key={item.id} style={styles.badgeWrap}>
            <Image source={item.src} style={styles.badgeImage} resizeMode="contain" />
          </View>
        ))}
      </View>
    </View>
  );
}

const CARD_H = 92;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
    alignItems: "center",
  },
  topBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.35,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    position: "absolute",
    top: 80,
    right: 40,
  },
  title: {
    position: "absolute",
    top: 80,
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
  },
  settingBtn: {
    padding: 0,
  },
  settingIcon: {
    width: 30,
    height: 30,
  },

  profileRow: {
    width: W * 0.9,
    marginTop: H * 0.19,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 14,
  },
  profileCard: {
    flex: 1,
    backgroundColor: colors.ivory,
    borderWidth: 2,
    borderColor: colors.greenDark,
    borderRadius: 12,
    height: CARD_H,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  profileName: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
    marginBottom: 6,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  statLabel: {
    fontFamily: "Maplestory_Light",
    fontSize: 14,
    color: colors.brown,
  },
  statValue: {
    fontFamily: "Maplestory_Light",
    fontSize: 14,
    color: colors.brown,
  },

  sectionTitle: {
    width: W * 0.9,
    marginTop: H * 0.1,
    marginBottom: 15,
    fontFamily: "Maplestory_Bold",
    fontSize: 20,
    color: colors.brown,
  },

  badgeGrid: {
    width: (W * 0.15 + 12) * 5,
    left: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
//    backgroundColor: "#baf8baff"
  },
  badgeWrap: {
    width: W * 0.15,
    aspectRatio: 1,
    borderRadius: 9999,
    marginBottom: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeImage: {
    width: "100%",
    height: "100%",
  },
});
