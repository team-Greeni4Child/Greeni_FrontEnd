import {React, useState, useEffect, useContext} from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../App";
import colors from "../theme/colors";
import { ProfileContext } from "../context/ProfileContext";

const { width: W, height: H } = Dimensions.get("window");

export default function ProfileSelectScreen({route, navigation}) {
  const { profiles } = useContext(ProfileContext);
  const { setStep } = useContext(AuthContext);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* 제목 */}
      <View style={styles.titleWrap}>
        <Text style={styles.title}>프로필 선택</Text>
      </View>

      {/* 프로필 목록 */}
      <View style={styles.profileWrap}>
        {profiles.map((p, idx) => (
          <TouchableOpacity 
            key={idx} 
            style={styles.profile} 
            onPress={() => setStep("main")}  
          >
            <Image source={p.image} style={styles.profileImage} />
          </TouchableOpacity>
        ))}

        {/* + 버튼: 새로운 프로필 생성 */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() =>
            navigation.navigate("ProfileImageSelect", { existingProfiles: profiles })
          }>
          <Image source={require("../assets/images/create.png")} style={styles.createImage} />
        </TouchableOpacity>
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

  // 프로필 선택을 감싸고 있는 Wrapper
  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "KCC-Murukmuruk",
    color: colors.brown,
  },

  // 생성된 프로필과 + 버튼을 감싸고 있는 Wrapper
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
    resizeMode: "contain",
  },
  profileName: {
    width: '80%',
    fontsize: 14,
    fontFamily: "WantedSans-Regular",
    textAlign: 'center',
    marginTop: 10,
  },
  createBtn: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  createImage: {
    width: '70%',
    height: '70%',
    resizeMode: "contain",
  },
});
