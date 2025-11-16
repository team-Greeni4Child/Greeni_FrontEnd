import React, { useState, useContext } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "react-native-modal-datetime-picker";

import colors from "../theme/colors";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { ProfileContext } from "../context/ProfileContext";


// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function ProfileInfoFormScreen({ route, navigation }) {
  
  const { profiles, setProfiles } = useContext(ProfileContext);
  const selectedImage = profiles[0]?.image || null;

  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  const [nameError, setNameError] = useState("");
  const [birthError, setBirthError] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    setBirth(formatted);
    setBirthError("")
    hideDatePicker();
  };

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

    if (!birth) {
      setBirthError("생년월일을 선택해주세요.");
      valid = false;
    } else {
      setBirthError("");
    }

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
    setProfiles([newProfile]);
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
        <View style={styles.inputWrap}>
          <TextInput
            style={[
              styles.input,
              nameError ? { borderBottomColor: '#f36945' } : {},
            ]}
            fontFamily="Maplestory_Light"
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

        {/* 생년월일 Picker */}
        <TouchableOpacity
          onPress={showDatePicker}
          style={[
            styles.input,
            { justifyContent: "center" },
            birthError ? { borderBottomColor: "#f36945" } : {},
          ]}
        >
          <Text
            style={{
              color: birth ? "#000" : birthError ? "#f36945" : "#999",
              fontSize: 14,
              fontFamily: "Maplestory_Light",
            }}
          >
              {birth
                ? birth
                : birthError
                ? birthError
                : "생년월일을 선택해주세요"}
            </Text>
          </TouchableOpacity>

          {/* 모달 DatePicker */}
          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            maximumDate={new Date()} // 미래 날짜 선택 불가
            locale="ko-KR"
          />
        </View>
      </View>

      {/* 생성 버튼 */}
      <View style={styles.bottomWrap}>
        <Button
          title="생성"
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
    width: W * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // borderWidth: 2,
    // borderColor: 'red'
  },
  input: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    lineHeight: 20,
    letterSpacing: -0.32,
    width: 345,
    marginBottom: 15,
    paddingTop: 12,
    paddingBottom: Platform.OS ==='ios' ? 5 : 8,
    borderBottomColor: colors.greenDark,
    borderBottomWidth: 2,
    // borderWidth: 2,
    // borderColor: 'red'
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
