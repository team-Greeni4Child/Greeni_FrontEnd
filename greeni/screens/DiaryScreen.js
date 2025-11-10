import React from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import MicButton from "../components/MicButton";
import Button from "../components/Button";

const { width: W, height: H } = Dimensions.get("window");

export default function DiaryScreen({ navigation }) {
  return (
    <View style={styles.root}>
      {/* 상단 뒤로가기 + 제목 */}
      <BackButton navigation={navigation}/>
        <Text style={styles.title}>일기쓰기</Text>

      {/* 말풍선 + 그리니 */}
      <View style={styles.greeniWrap}>
        <ImageBackground
          source={require("../assets/images/bubble_home.png")}
          style={styles.bubble}
          resizeMode="stretch"
        >
          <Text style={styles.bubbleText}>
            안녕 ○○아,{"\n"}오늘의 일기쓰기를 시작해볼까?
          </Text>
        </ImageBackground>

        <Image
          source={require("../assets/images/umbrella_greeni_big.png")}
          style={styles.greeni}
          resizeMode="contain"
        />
      </View>

      {/* 마이크 버튼 */}
      <MicButton />

      {/* 일기 그리러 가는 임시 버튼 */}
      <View style={styles.diaryButton} >
        <Button 
          title="그림일기"
          onPress={() => navigation.navigate("DiaryDraw")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end", 
    backgroundColor: colors.ivory,
  },

  title: {
    position: "absolute",
    alignItems: "center",
    top: 80,
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
  },

  greeniWrap: {
    bottom: H * 0.35,
    alignItems: "center",
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
    lineHeight: 25,
  },
  greeni: {
    width: W * 0.5,
    height: W * 0.5,
  },

  // 일기 그리러 가는 임시 버튼
  diaryButton: {
    position: "absolute",
    left: 20,
    bottom: 50,
  },
});
