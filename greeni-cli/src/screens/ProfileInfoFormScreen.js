import React, { useState, useContext } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Dimensions, Platform, Alert } from "react-native";

import { StatusBar } from "react-native";

import colors from "../theme/colors";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { ProfileContext } from "../context/ProfileContext";
import { createProfile, searchProfileList } from "../api/profile";
import { fileByIndex, toImageSource } from "../utils/profileImageMap";

import DateTimePicker from "react-native-modal-datetime-picker";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function ProfileInfoFormScreen({ route, navigation }) {
  
  const { profiles, setProfiles } = useContext(ProfileContext);

  const [selectedImage, setSelectedImage] = useState(route.params?.selectedImage || null);
  const selectedIndex = route.params?.selectedIndex;
  const isUploaded = route.params?.isUploaded === true;

  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");

  const [nameError, setNameError] = useState("");
  const [birthError, setBirthError] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    setBirth(formatted);
    hideDatePicker();
  };

  // 유효성 검사
  const validate = () => {
    let valid = true;

    const nameRegex = /^[a-zA-Z가-힣ㄱ-ㅎㅏ-ㅣ]{1,20}$/;

    if (!nameRegex.test(name)) {
      setName("");
      if (name.length == 0) {
        setNameError("이름을 입력해주세요")
      }
      else {
        setNameError("20자 이내의 영문, 한글로만 입력 가능합니다.");
      }
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
  const handleCreate = async () => {
    if (isCreating) return;
    if (!validate()) return;

    if (isUploaded) {
      Alert.alert(
        "알림",
        "현재 업로드 이미지로 프로필 생성은 아직 API 연동이 필요합니다.\n 기본 이미지로 먼저 생성해 주세요."
      );
      return;
    }

    try {
      setIsCreating(true);
      const profileImage = typeof selectedIndex === "number" ? fileByIndex(selectedIndex) : null;
      
      if (!profileImage) {
        Alert.alert("오류", "프로필 이미지를 다시 선택해 주세요.");
        return;
      }
      if (typeof profileImage !== "string" || profileImage.trim().length === 0) {
      Alert.alert("오류", "프로필 이미지 값이 올바르지 않습니다. (문자열 필요)");
      console.log("[CREATE_PROFILE] INVALID profileImage:", profileImage);
      return;
}

      const safeName = name.trim();
      const safeBirth = birth.trim();

      console.log("[CREATE_PROFILE] selectedIndex:", selectedIndex, "isUploaded:", isUploaded);
      console.log("[CREATE_PROFILE] profileImage:", profileImage, "typeof:", typeof profileImage);
      console.log("[CREATE_PROFILE] name:", safeName, "len:", safeName.length);
      console.log("[CREATE_PROFILE] birth:", safeBirth);
      console.log("[CREATE_PROFILE] payload:", {
        profileImage,
        name: safeName,
        birth: safeBirth,
      });


      // 생성 API
      const res = await createProfile({
        profileImage: profileImage.trim(),
        name: safeName,
        birth: safeBirth,
      });
      console.log("CREATE PROFILE OK:", res);

      // 목록 불러오기
      const listRes = await searchProfileList();
      const list = listRes?.result?.profileLists ?? [];
      const mapped = list.map((p) => ({
        profileId: p.profileId,
        name: p.name,
        profileImage: p.profileImage,
        image: toImageSource(p.profileImage),
      }));
      setProfiles(mapped);

      // 프로필 선택 화면으로
      navigation.navigate("ProfileSelect");
    } catch (e) {
      console.log("CREATE PROFILE FAIL:", e);
      console.log("[CREATE_PROFILE][ERR] status:", e?.status);
      console.log("[CREATE_PROFILE][ERR] code:", e?.code);
      console.log("[CREATE_PROFILE][ERR] message:", e?.message);
      console.log("[CREATE_PROFILE][ERR] result:", e?.result);
      Alert.alert("오류", e?.message || "프로필 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.");
      console.log("CREATE PROFILE FAIL:", e);

      if (e?.code === "PROFILE4002") {
        Alert.alert("알림", "프로필은 최대 6개까지 생성할 수 있습니다.");
        return;
      }
      if (e?.code === "MEMBER4041"){
        Alert.alert("오류", "존재하지 않는 회원입니다. 다시 로그인해 주세요.");
        return;
      }
      Alert.alert("오류", "프로필 생성에 실패했습니다.\n잠시 후 다시 시도해주세요.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark-content" />

      {/* 상단 제목 & 뒤로가기 */}
      <View style={styles.titleWrap}>
        <BackButton navigation={navigation}
                    top={H * 0.001}
                    left={W * 0.05}/>
        <Text style={styles.title}>프로필 정보 입력</Text>
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
              {
                borderBottomColor: nameError ? '#f36945' : colors.greenDark }
            ]}
            fontFamily="Maplestory_Light"
            placeholder={nameError ? nameError : "이름을 입력해주세요"}
            placeholderTextColor={nameError ? "#f36945" : "#999"}
            value={name}
            onChangeText={(text) => {
              setName(text);
            }}
            onFocus={() => {
              setNameError("");
              setName("");
            }}
          />

        {/* 생년월일 Picker */}
        <TouchableOpacity
          onPress={showDatePicker}
          style={[
            styles.input,
            { justifyContent: "center", borderBottomColor: birthError ? '#f36945' : colors.greenDark },
          ]}
          onPressIn={() => {
            setBirthError("");
            setBirth("");
          }}
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
            display="spinner"
          />
        </View>
      </View>

      {/* 생성 버튼 */}
      <View style={styles.bottomWrap}>
        <Button
          title="생성"
          onPress={handleCreate}
          icon={require("../assets/images/next.png")}
          disabled={isCreating}
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
    alignItems: 'center'
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
    width: W * 0.88,
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
    height: 40,
    letterSpacing: -0.32,
    width: '100%',
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
