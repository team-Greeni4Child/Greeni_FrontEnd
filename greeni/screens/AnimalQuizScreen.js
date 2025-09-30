import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity 
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import { color } from "react-native-reanimated";

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
              <Image
                style={styles.bubble}
                source={require("../assets/images/bubble_animal.png")}/>
              <Image
                style={styles.greeni}
                source={require("../assets/images/quiz_greeni_big.png")}/>
              <Text style={styles.bubbleText}>
                {mode === 'image'
                ? "이 동물은 어떤 소리를 낼까?"
              : "어떤 동물이 이런 소리를 낼까?"}
              </Text>
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


            <View style={styles.minWrap}>
              <Image
                style={styles.micImage}
                source={require("../assets/images/mic.png")}/>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  // 전체 화면, 아이템 세로 정렬, 가로세로 중앙 정렬, 배경색
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory, 
  },

  // 뒤로가기 버튼과 제목을 감싸는 wrapper 
  // root 기준으로 정렬, 수평 중앙 정렬, colorToken 변경
  titleWrap: {
    position: "absolute",
    alignItems: 'center',
    top: H * 0.08,
    width: W,
  },
  // colorToken 변경
  title: {
    fontSize: 28,
    fontWeight: "800",
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
    aspectRatio: 85/144,
    width: 86,
    height: 144,
    top: 0, left: -W * 0.28,
  },
  bubble: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    aspectRatio: 295/112,
    width: 295,
    height: 112,
    resizeMode: 'contain',
  },
  bubbleText: {
    position: 'absolute',
    top: W * 0.087,
    width: 215,
    fontWeight: '500',
    fontSize: 18,
    color: colors.brown,
  },

  quizWrap: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 344,
    height: 203,
    top: H * 0.5,
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

  minWrap: {
    position: 'absolute',
    width: W,
    alignItems: 'center',
    bottom: H * 0.05,
  },
  micImage: {
    aspectRatio: 1,
    width: 164,
    height: 164
  }
})