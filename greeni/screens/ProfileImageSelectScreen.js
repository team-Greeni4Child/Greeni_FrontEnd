import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";

import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

// 프로필 이미지 배열
const profileImages = [
  require("../assets/images/basic_greeni_pink.png"),
  require("../assets/images/basic_greeni_green.png"),
  require("../assets/images/quiz_greeni_pink.png"),
  require("../assets/images/quiz_greeni_green.png"),
  require("../assets/images/20_greeni_pink.png"),
  require("../assets/images/20_greeni_green.png"),
  require("../assets/images/umbrella_greeni_pink.png"),
  require("../assets/images/umbrella_greeni_green.png"),
  require("../assets/images/mustache_greeni_pink.png"),
  require("../assets/images/mustache_greeni_green.png"),
  require("../assets/images/greeni_image_upload.png"), // 업로드 버튼
];

// 프로필 아이템 컴포넌트
// 프로필 선택시 border 생기게
function Profile({ image, onPress, selected }) {
  return (
    <TouchableOpacity style={styles.profile} onPress={onPress}>
      <Image
        source={image}
        style={[styles.image, selected && styles.imageSelected]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default function ProfileImageSelectScreen({ navigation }) {
  // 선택한 이미지의 index
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);

    const handleSelect = async (index) => {
    if (index === profileImages.length - 1) {
      // 업로드 버튼 선택 시
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("권한 필요", "사진 라이브러리 접근 권한이 필요합니다.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        aspect: [1,1],
        quality: 1,
      });
      if (!result.canceled) {
        setUploadImage({ uri: result.assets[0].uri });
        setSelectedIndex(index);
      }
    } else {
      setSelectedIndex(index);
      setUploadImage(null); // 기존 이미지 선택 시 uploadImage 초기화
    }
  };

  // 선택된 이미지 가져오기
  const getSelectedImage = () => {
    if (selectedIndex === null) return null;
    return selectedIndex === profileImages.length - 1 ? uploadImage : profileImages[selectedIndex];
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* 상단 제목 & 뒤로가기 */}
      <View style={styles.titleWrap}>
        <BackButton navigation={navigation}
                    top={H * 0.001}
                    left={W * 0.05}/>
        <Text style={styles.title}>프로필 만들기</Text>
      </View>

      {/* 프로필 이미지 선택 */}
      {/* 이미지 선택시 선택한 이미지 index를 넘겨줌 */}
      <View style={styles.profileWrap}>
        {profileImages.map((img, idx) => {
          const source = idx === profileImages.length - 1 && uploadImage ? uploadImage : img;
          return (
            <Profile
              key={idx}
              image={source}
              onPress={() => handleSelect(idx)}
              selected={selectedIndex === idx}
            />
          );
        })}
      </View>

      {/* 다음 버튼 */}
      {/* 이미지 선택하면 다음 버튼 활성화, 선택 안 하면 회색으로 비활성화 */}
      <View style={styles.bottomWrap}>
        <Button
          title="다음"
          onPress={() =>{
            const selected = getSelectedImage();
            if (!selected) return;
            navigation.navigate("ProfileInfoForm", { selectedImage: selected });
          }}
          icon={require("../assets/images/next.png")}
          disabled={selectedIndex === null}
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
  // 뒤로 가기, 타이틀 감싸는 Wrapper
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

  // 프로필 이미지 11개를 감싸는 Wrapper
  // 이미지 선택 시, 이미지 크기만큼 brown border 생성
  // Width = (이미지 가로) * 3 + (이미지 마진)
  profileWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    top: -H * 0.05,
    margin: 20,
    width: W * 0.24 * 3 + 65,
    alignSelf: "center",
  },
  profile: {
    aspectRatio: 1,
    width: W * 0.24,
    margin: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: W * 0.24 / 2,
  },
  imageSelected: {
    borderWidth: 5,
    borderColor: colors.brown,
    borderRadius: W * 0.24 / 2,
  },

  // '다음' 버튼 감싸는 Wrapper 
  bottomWrap: {
    position: "absolute",
    width: W,
    bottom: H * 0.15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: W * 0.09,
  },
});