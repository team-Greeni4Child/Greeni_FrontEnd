import {React, useState, useEffect} from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function ProfileSelectScreen({route, navigation}) {

  // 생성된 프로필 목록 배열로 관리
  const [profiles, setProfiles] = useState([]);

  // 새로운 프로필이 생성되면 profiles 배열에 추가
  useEffect(() => {
    if (route.params?.newProfile) {
      setProfiles((prev) => [...prev, route.params.newProfile]);
    }
  }, [route.params?.newProfile]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* 제목 */}
      <Text style={styles.title}>프로필 선택</Text>

      {/* 생성한 프로필 목록 */}
      <View style={styles.profileWrap}>
        {profiles.map((p, idx) => (
          <View key={idx} style={styles.profile}>
            <Image source={p.image} style={styles.profileImage} />
          </View>
        ))}
      </View>

       {/* + 버튼 누르면 프로필 이미지 선택 창으로 이동 */}
      <TouchableOpacity
        onPress={() => navigation.navigate("ProfileCreateScreen1")}>
      <Image source={require("../assets/images/create_btn.png")} style={styles.createBtn} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDEE", 
  },

  // 프로필 선택하기 제목
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#5A463C",
    top: -W * 0.6,
    marginBottom: 12,
  },

  // 생성한 프로필 감싸는 wrapper
  profileWrap: {

  },

  // + 버튼
  createBtn: {
    width: 69,
    height: 69,
    top: W * 0.6
  }
});