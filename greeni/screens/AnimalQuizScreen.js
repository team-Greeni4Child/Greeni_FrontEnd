import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ImageBackground
} from "react-native";
import { StatusBar } from "expo-status-bar";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import { color } from "react-native-reanimated";
import MicButton from "../components/MicButton";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function AnimalQuizScreen({navigation}) {

    const [mode, setMode] = useState("image");
    const [animal, setAnimal] = useState({
      name: '오리',
      image: require("../assets/images/animal_duck.png"),
      sound: require("../assets/images/speaker.png"),
    });

    // 2가지 모드를 랜덤하게 나오게 한다
    useEffect(() => {
      const randomMode = Math.random() > 0.5 ? 'image' : 'sound';
      setMode(randomMode);
    }, []);

    return (
        <View style={styles.root}>
            <StatusBar style="dark" />

             {/* 상단 뒤로가기 버튼 및 '동물퀴즈' 제목 */}
            <View style={styles.titleWrap}>
                <BackButton navigation={navigation}
                            top={H * 0.001}
                            left={W * 0.05}/>
                <Text style={styles.title}>동물퀴즈</Text>
            </View>

            {/* Greeni 영역*/}
            {/* 모드에 따라 그리니 말풍선 내용 변경 */}
            <View style={styles.greeniWrap}>
              <ImageBackground
                style={styles.bubble}
                source={require("../assets/images/bubble_animal.png")}
                resizeMode="stretch"
              >
                <Text style={styles.bubbleText}>
                  {mode === 'image'
                  ? "이 동물은 어떤 소리를 낼까?"
                  : "어떤 동물이 이런 소리를 낼까?"}
                </Text>
              </ImageBackground>
              <Image
                style={styles.greeni}
                source={require("../assets/images/quiz_greeni_big.png")}/>
            </View>

            {/* 문제가 나오는 영역 */}
            {/* 모드에 따라 문제 영역 그림 변경 */}
            <View style={styles.quizWrap}>
              {mode === "image" ? (
                <Image source={animal.image} style={styles.quizImage} />
              ) : (
                <TouchableOpacity >
                  <Image
                    source={require("../assets/images/speaker.png")}
                    style={styles.speakerImage}
                  />
                </TouchableOpacity>
              )}
            </View>

            <MicButton />
        </View>
    )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory, 
  },

  titleWrap: {
    position: "absolute",
    alignItems: 'center',
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // 그리니가 말하는 부분을 감싸는 Wrapper
  greeniWrap: {
    position: 'absolute',
    flexDirection: 'column',
    top: H * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeni: {
    position: 'relative',
    aspectRatio: 90/140,
    width: 90,
    height: 140,
    top: 0, 
    left: -W * 0.25,
  },
  bubble: {
    maxWidth: W * 0.85, 
    paddingHorizontal: 40,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleText: {
    fontSize: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
    lineHeight: 26,
  },

  quizWrap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: W * 0.9,
    height: W * 0.5,
    top: H * 0.48,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.greenDark,
  },
  quizImage: {
    aspectRatio: 141 / 131,
    width: 141.21, height: 131,
    resizeMode: 'contain',
  },
  speakerImage: {
    aspectRatio: 65 / 57,
    width: 54, height: 57,
  },
})