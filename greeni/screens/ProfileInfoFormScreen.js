import React, { useState, useContext } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";

import { StatusBar } from "expo-status-bar";

import colors from "../theme/colors";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { ProfileContext } from "../context/ProfileContext";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function ProfileInfoFormScreen({ route, navigation }) {
  // Context 불러와서 사용
  const { profiles, setProfiles } = useContext(ProfileContext);

  // ProfileImageSelectScreen에서 넘어온 선택 이미지
  // 이름, 생년월일 상태
  const [selectedImage, setSelectedImage] = useState(route.params?.selectedImage || null);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  // 에러 메시지 상태
  const [nameError, setNameError] = useState("");
  const [birthError, setBirthError] = useState("");

  // 유효성 검사
  const validate = () => {
    let valid = true;

    const nameRegex = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]{1,20}$/;

    if (!nameRegex.test(name)) {
      setName("");
      setNameError("20자 이내의 영문, 한글로만 입력 가능합니다.");
      valid = false;
    } else {
      setNameError("");
    }

// 생년월일 형식 
const regex = /^20\d{2}\.(0[1-9]|1[0-2])\.(0[1-9]|[12]\d|3[01])$/;

if (!birth.match(regex)) { 
  setName("");
  setBirthError("생년월일을 형식에 맞게 입력해주세요."); 
  valid = false; 
} else { 
  // 실제 날짜 객체 생성 
  const [year, month, day] = birth.split(".").map((n) => parseInt(n, 10)); 
  const inputDate = new Date(year, month - 1, day); 
  const today = new Date(); 
  today.setHours(0, 0, 0, 0); 
  // 미래 날짜 입력 검사 
  if (inputDate > today) { 
    setBirthError("미래의 날짜는 입력할 수 없습니다."); 
    valid = false; 
  } else { setBirthError(""); } } 
  return valid; 
};

  // 유효성 검사 통과하면, 새로운 프로필 생성
  const handleCreate = () => {
    if (!validate()) return;

    const newProfile = {
      name,
      birth,
      image: selectedImage,
    };

    // 생성한 프로필을 Context에 추가
    setProfiles([...profiles, newProfile]);
    navigation.navigate("ProfileSelect");
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* 상단 제목 & 뒤로가기 */}
      <View style={styles.titleWrap}>
        <BackButton navigation={navigation}
                    top={H  *0.001}
                    left={W * 0.05}/>
        <Text style={styles.title}>프로필 만들기</Text>
      </View>

      {/* 프로필 이미지 + 입력 영역 */}
      <View style={styles.profileWrap}>
        <View style={styles.profile}>
          {selectedImage && (
            <Image source={selectedImage} style={styles.image} />
          )}
        </View>

        <TextInput
            style={[
              styles.input,
              nameError ? { borderBottomColor: '#f36945' } : {},
            ]}
            placeholder={nameError ? nameError : "이름을 입력해주세요"}
            placeholderTextColor={nameError ? "#f36945" : "#999"}
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
            onFocus={() => {
              if (nameError) {
                setNameError("");
              }
            }}
          />

        <TextInput
          style={[
            styles.input,
            birthError ? { borderBottomColor: '#f36945' } : {},
          ]}
          placeholder={birthError ? birthError : "생년월일을 입력해주세요(예: 20xx.xx.xx)"}
          placeholderTextColor={birthError ? "#f36945" : "#999"}
          value={birth}
          onChangeText={(text) => {
            setBirth(text);
          }}
          onFocus={() => {
            if(birthError){
              setBirthError("");
            }
          }}
        />

      </View>

      {/* 생성 버튼 */}
      <View style={styles.bottomWrap}>
        <Button
          title="생성"
          width={108}
          height={49}
          onPress={handleCreate}
          icon={require("../assets/images/next.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory,
  },

  // 상단 제목과 뒤로 가기 버튼을 감싸는 Wrapper
  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.brown,
  },

  // 프로필 이미지와 input을 감싸는 Wrapper
  profileWrap: {
    width: W * 0.9,
    top: -H * 0.15,
    justifyContent: 'center',
    alignContent: 'center',
  },
  profile: {
    width: W * 0.9,
    height: 104,
    justifyContent: 'center',
    alignItems: "center",
    marginBottom: 50,
  },
  image: {
    aspectRatio: 1,
    width: 104,
    height: 104,
    borderRadius: 52,
    resizeMode: 'cover',
  },
  inputWrap: {
  },
  input: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.32,
    width: 345,
    marginBottom: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS ==='ios' ? 5 : 8,
    borderBottomColor: colors.greenDark,
    borderBottomWidth: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left',
    alignSelf: 'flex-start'
  },

  // 생성버튼 
  bottomWrap: {
    position: "absolute",
    bottom: H * 0.15,
    width: W,
    alignItems: "flex-end",
    paddingRight: W * 0.09,
  },
});
