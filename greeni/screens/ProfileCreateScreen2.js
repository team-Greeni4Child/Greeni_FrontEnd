import {React, useState} from "react";
import { View, Text, Image, TextInput, StyleSheet, Platform, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function ProfileCreateScreen1({route, navigation}) {

    // 프로필 이미지 선택창에서 선택한 이미지 값 받아오기
    const {selectedImage} = route.params;
    const [name, setName] = useState("");
    const [birth, setBirth] = useState("");

    return (
    <View style={styles.root}>
        <StatusBar style="dark" />

         {/* 상단 뒤로가기 버튼 및 '프로필 만들기' 제목 */}
        <View style={styles.titleWrap}>
            <Image style={styles.backBtn} source={require("../assets/images/back.png")} 
                  onTouchEnd={() => navigation.navigate("ProfileCreate1")}/>
            <Text style={styles.title}>프로필 만들기</Text>
        </View>

         {/* 선택한 프로필 이미지 및 이름, 생년월일 입력 */}
        <View style={styles.profileWrap}>
            <Image style={styles.image} source={selectedImage} />
            <TextInput
                placeholder="이름을 입력해주세요"
                placeholderTextColor="#58453E60"
                value={name}
                onChangeText={setName}
                style={styles.input}>
            </TextInput>
            <TextInput
                placeholder="생년월일을 입력해주세요(예: 20xx.xx.xx)"
                placeholderTextColor="#58453E60"
                value={birth}
                onChangeText={setBirth}
                style={styles.input}>
            </TextInput>
        </View>

        {/* 생성 버튼 */}
        {/* 생성 버튼 누르면 프로필 선택창으로 넘어감 */}
        <View style = {styles.bottomWrap}>
            <Button title="생성" buttonColor='#BEEA8B' titleColor="#000" width={108} height={49} borderRadius={24.5}
                onPress={() => {
                  const newProfile = { image: selectedImage, name, birth };
                  navigation.navigate("ProfileSelect", { newProfile });
            }}></Button>
        </View>
    </View>  
    )}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDEE", 
  },

  // 뒤로가기 버튼과 제목을 감싸는 wrapper 
  titleWrap: {
    position: "absolute",
    alignItems: 'center',
    top: H * 0.08,
    width: W,
  },
  backBtn: {
    position: "absolute",
    top: H * 0.005,
    left: W * 0.05,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#5A463C",
  },

  // 선택한 프로필 이미지와 이름, 생년월일 입력창을 감싸는 wrapper
  profileWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    top: -H * 0.15,
    margin: 20,
    marginLeft: 30,
  },
  profile: {
    width: 104,
    height: 54,
    margin: 5,
    borderWidth: 2,
    borderColor: "black"
  },
  image: {
    width: 104,
    height: 104,
    marginBottom: 70,
  },
  input: {
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 20,
    letterSpacing: -0.32,
    // height: 20,
    width: 345,
    marginBottom: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios'? 5 : 8,
    borderBottomColor: "#9EA95F",
    borderBottomWidth: 2,
  },

  // 생성 버튼을 감싸는 wrapper
  bottomWrap: {
    position: "absolute",
    width: 108,
    height: 49,
    borderRadius: 24.5,
    top: H * 0.78,

    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingLeft: 300,  
  },
})