import {React, useState} from "react";
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

// 프로필 그리니 이미지 10개 배열로 불러오기
const profileImages = [
  require("../assets/images/basic_greeni_pink.png"), //기본 그리니
  require("../assets/images/basic_greeni_green.png"),
  require("../assets/images/quiz_greeni_pink.png"), //퀴즈 그리니
  require("../assets/images/quiz_greeni_green.png"),
  require("../assets/images/20_greeni_pink.png"), //스무고개 그리니
  require("../assets/images/20_greeni_green.png"),
  require("../assets/images/umbrella_greeni_pink.png"), //우산 그리니
  require("../assets/images/umbrella_greeni_green.png"),
  require("../assets/images/mustache_greeni_pink.png"), //콧수염 그리니
  require("../assets/images/mustache_greeni_green.png"),
];

// 각 Profile 컴포넌트
function Profile({ image, onPress, selected }) {
  return (
    <TouchableOpacity
      style={styles.profile}
      onPress={onPress}
    >
      <Image
        source={image}
        style={[
          styles.image,
          selected && styles.imageSelected
        ]}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

export default function ProfileCreateScreen1({navigation}) {

    // 현재 선택된 이미지의 인덱스를 저장 -> ProfileCreateScreen2로 정보 전달
    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleSelect = (index) => {
        setSelectedIndex(index);
    };

    return (
    <View style={styles.root}>
        <StatusBar style="dark" />

         {/* 상단 뒤로가기 버튼 및 '프로필 만들기' 제목 */}
        <View style={styles.titleWrap}>
            <Image style={styles.backBtn} source={require("../assets/images/back_arrow.png")} onTouchEnd={() => navigation.navigate("ProfileSelectScreen")}></Image>
            <Text style={styles.title}>프로필 만들기</Text>
        </View>

        {/* / 프로필 이미지 */}
        <View style={styles.profileWrap}>
            {profileImages.map((img, idx) => (
                <Profile
                    key={idx}
                    image={img}
                    onPress={() => handleSelect(idx)}
                    selected={selectedIndex === idx}
                />
            ))}
        </View>

         {/* 다음 버튼 */}
         {/* 선택된 이미지가 있으면 다음 버튼 활성화됨. 선택 안 하면 눌러도 효과없음 */}
        <View style = {styles.bottomWrap}>
            <Button title="다음" buttonColor='#BEEA8B' titleColor="#000" width={108} height={49} borderRadius={24.5}
                onPress={() => {
                    if (selectedIndex !== null) {
                        navigation.navigate("ProfileCreateScreen2", {
                            selectedImage: profileImages[selectedIndex],
                        })
                    }
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
    left: W * 0.3
  },

  // 10개의 그리니 이미지를 감싸는 wrapper
  profileWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    top: -H * 0.05,
    margin: 20,
    marginLeft: 30,
  },
  profile: {
    width: 104,
    height: 104,
    margin: 5
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageSelected: {
  },

  // 다음 버튼을 감싸는 wrapper
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