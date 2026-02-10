import { React, useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Alert } from "react-native";
import { StatusBar } from "react-native";
import { AuthContext } from "../App";
import { ProfileContext } from "../context/ProfileContext";
import { searchProfileList, searchSingleProfile } from "../api/profile";
import { toImageSource } from "../utils/profileImageMap";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");
const MAX_PROFILES = 6;

export default function ProfileSelectScreen({route, navigation}) {

  const { profiles, setProfiles, setSelectedProfile } = useContext(ProfileContext);
  const { setStep } = useContext(AuthContext);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectProfile = async (p) => {
    if (isSelecting) return;

    try {
      setIsSelecting(true);

      const res = await searchSingleProfile(p.profileId);
      const detail = res?.result;

      if (!detail) {
        Alert.alert("오류", "프로필 정보를 불러오지 못했습니다.");
        return;
      }
      const selected = {
        ...detail,
        image: toImageSource(detail.profileImage),
      };
      setSelectedProfile(selected);
      setStep("main");
    } catch(e) {
      console.log("Select Profile Fail:", e);
    } finally {
      setIsSelecting(false);
    }
  };
  
  useEffect(() => {
    const load = async () => {
      try {
        const res = await searchProfileList();
        const list = res?.result?.profileLists ?? [];

        const mapped = list.map((p) => ({
          profileId: p.profileId,
          name: p.name,
          birth: p.birth,
          profileImage: p.profileImage,          // 서버 문자열
          image: toImageSource(p.profileImage),  // RN source
        }));

        setProfiles(mapped);
      } catch (e) {
        console.log("LOAD PROFILE LIST FAIL:", e);
        // 필요하면 모달 처리
      }
    };

    load();
  }, [setProfiles]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark-content" />

      {/* 제목 */}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>프로필 선택</Text>
      </View>

      {/* 프로필 목록 */}
      <View style={styles.profileWrap}>
        {profiles.map((p, idx) => (
          <TouchableOpacity 
            key={p.profileId} 
            style={styles.profile} 
            onPress={() => handleSelectProfile(p)}  
          >
            <Image source={p.image} style={styles.profileImage} />
            <Text 
              style={styles.profileName}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}

        {/* + 버튼: 새로운 프로필 생성 */}
        {profiles.length < MAX_PROFILES && (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() =>
              // navigation.navigate("ProfileImageSelect", { existingProfiles: profiles })
              navigation.navigate("ProfileImageSelect")
            }>
            <Image source={require("../assets/images/create.png")} style={styles.createImage} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory,
  },

  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  profileWrap: {
    width: W * 0.8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: 120,
    height: 120,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    aspectRatio: 1,
    width: '80%',
    height: '80%',
    borderRadius: 9999,
    resizeMode: 'cover',
  },
  profileName: {
    width: '80%',
    marginTop: 10,
    fontsize: 14,
    fontFamily: "Maplestory_Light",
    textAlign: 'center',
  },

  createBtn: {
    width: 120,
    height: 120,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createImage: {
    width: '70%',
    height: '70%',
    resizeMode: "contain",
  },
});
