import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { AuthContext } from "../App";
import { ProfileContext } from "../context/ProfileContext";
import { searchBadgeList } from "../api/badge";
import { toBadgeImageUrl } from "../utils/badgeImageMap";
import LinearGradient from "react-native-linear-gradient";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";

const { width: W, height: H } = Dimensions.get("window");

const BADGE_FALLBACK_IMAGE = require("../assets/images/attendance_bedge1.png");

export default function MyPageScreen({ navigation }) {
  const [tab, setTab] = useState(3);
  const NAV_H = H * 0.06 + 60 + 6;

  const { selectedProfile } = useContext(ProfileContext);
  const { setStep } = useContext(AuthContext);
  const formatBirth = (s) => (typeof s === "string" ? s.replaceAll("-", ".") : "");

  const [badges, setBadges] = useState([]);

  // 뒤로가기 누르면 Home으로
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate("Home");
        return true;
      };

      const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
      return () => sub.remove();
    }, [navigation])
  );

  // 선택된 profile 없으면 바로 프로필 선택 화면으로
  useEffect(() => {
    if (!selectedProfile) {
      setStep("profile");
    }
  }, [selectedProfile, setStep]);

  useEffect(() => {
  const loadBadges = async () => {
    if (!selectedProfile?.profileId) {
      console.log("[BADGE] no profileId");
      setBadges([]);
      return;
    }

    try {
      console.log("[BADGE] profileId:", selectedProfile.profileId);
      const res = await searchBadgeList(selectedProfile.profileId);
      console.log("[BADGE] raw response:", res);
      const list = res?.result?.badgeLists ?? [];
      console.log("[BADGE] list length:", list.length);
      console.log("[BADGE] first item:", list[0]);
      setBadges(list);
    } catch (e) {
      console.log("LOAD BADGE LIST FAIL:", e);
      console.log("[BADGE][ERR] status:", e?.status);
      console.log("[BADGE][ERR] code:", e?.code);
      console.log("[BADGE][ERR] message:", e?.message);
      console.log("[BADGE][ERR] result:", e?.result);
      setBadges([]);
    }
  };

  loadBadges();
}, [selectedProfile?.profileId]);

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

  if (!selectedProfile) return null;

  const profileName = selectedProfile.name;
  const profileBirth = formatBirth(selectedProfile.birth);
  const profileImageSource = selectedProfile.image;

  return (
    <View style={styles.root}>
      {/* 상단 배경 */}
      <View style={styles.topBg} />

      {/* 하단 네비게이션바 */}
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

      {/* 타이틀 */}
      <Text style={styles.title}>마이페이지</Text>

      {/* 설정 버튼 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.settingBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("SettingsPassword")}
        >
          <Image
            source={require("../assets/images/setting.png")}
            style={styles.settingIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 프로필 카드 */}
      <View style={styles.profileCol}>
        <Image
          source={profileImageSource}
          style={styles.avatar}
          resizeMode="contain"
        />
        <View style={styles.profileCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>이름</Text>
            <Text style={styles.statValue}>{profileName}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>생년월일</Text>
            <Text style={styles.statValue}>{profileBirth}</Text>
          </View>
        </View>
      </View>

      {/* 섹션 타이틀
      <Text style={styles.sectionTitle}>활동 배지</Text> */}

      <ScrollView
        style={[
          styles.scrollWrap,
          { backgroundColor: colors.ivory },
        ]}
        contentContainerStyle={{
          alignItems: "center",
          paddingTop: 0,          
          paddingBottom: NAV_H+20 
        }}
        showsVerticalScrollIndicator={false}
        bounces={false}                 
        overScrollMode="never"         
      >
        {/* 섹션 타이틀 */}
        <Text style={styles.sectionTitle}>활동 배지</Text>

        {/* 배지 영역 (View + flexWrap) */}
        <View style={styles.badgeGrid}>
          {/* {TEST_BADGES.map((item) => (
            <View key={item.id} style={styles.badgeWrap}>
              <Image source={item.src} style={styles.badgeImage} resizeMode="contain" />
            </View>
          ))} */}
          {/* {badges.map((item) => (
            <View key={item.badgeId} style={styles.badgeWrap}>
              <Image
                source={
                  toBadgeImageUrl(item.imageUrl)
                    ? { uri: toBadgeImageUrl(item.imageUrl) }
                    : BADGE_FALLBACK_IMAGE
                }
                style={styles.badgeImage}
                resizeMode="contain"
              />
            </View>
          ))} */}
          {badges.map((item) => {
            const uri = toBadgeImageUrl(item.imageUrl);
            console.log("[BADGE] imageUrl(raw):", item.imageUrl);
            console.log("[BADGE] imageUrl(final):", uri);

            return (
              <View key={item.badgeId} style={styles.badgeWrap}>
                <Image
                  source={uri ? { uri } : require("../assets/images/attendance_bedge1.png")}
                  style={styles.badgeImage}
                  resizeMode="contain"
                />
              </View>
            );
          })}

        </View>
      </ScrollView>

      {/* 하단 페이드 마스크 */}
      <LinearGradient
        pointerEvents="none"
        colors={[
          "rgba(255, 253, 238, 0)",
          "rgba(255, 253, 238, 0.55)",
          "rgba(255, 253, 238, 0.9)",
          "rgba(255, 253, 238, 1)",
        ]}
        locations={[0, 0.45, 0.75, 1]}
        style={[styles.bottomFade, { bottom: NAV_H }]}
      />
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
    height: H * 0.48,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
  header: {
    position: "absolute",
    top: 80,
    right: 40,
    zIndex: 1,
  },
  title: {
    position: "absolute",
    top: 80,
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
    zIndex: 1,
  },
  settingBtn: {
    padding: 0,
  },
  settingIcon: {
    width: 30,
    height: 30,
  },

  profileCol: {
    width: W * 0.9,
    marginTop: H * 0.16,
    flexDirection: "column",
    alignItems: "center",
    // borderWidth: 2,
    // borderColor: 'red'
    zIndex: 1,
  },
  avatar: {
    width: 94,
    height: 94,
    aspectRatio: 1,
    borderRadius: 52,
    resizeMode: "cover",
    marginBottom: 30,
  },
  profileCard: {
    // flex: 1,
    // backgroundColor: colors.ivory,
    // borderWidth: 2,
    // borderColor: colors.greenDark,
    // borderRadius: 12,
    // height: CARD_H,
    // paddingHorizontal: 14,
    // paddingVertical: 10,
    width: 345,
    height: 135,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  profileName: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
    marginBottom: 6,
  },
  statRow: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  statLabel: {
    fontFamily: "Maplestory_Light",
    fontSize: 16,
    color: colors.brown,
  },
  statValue: {
    fontFamily: "Maplestory_Light",
    fontSize: 16,
    color: colors.brown,
  },

  scrollWrap: {
    width: W,
    padding: H * 0.03,
    marginBottom: H * 0.15,
  },

  sectionTitle: {
    width: W * 0.9,
    marginTop: H * 0.02,
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

  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 60,   // 흐려지는 범위
  },
});

