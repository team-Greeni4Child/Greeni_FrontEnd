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
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import MicButton from "../components/MicButton";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function TwentyQuestionsScreen({navigation}) {

  const hints = [
    "나는 회색이야!",
    "나는 귀가 커!",
    "내 코는 길어!",
    "나는 물을 좋아해!",
    "나는 큰 몸을 가지고 있어!"
  ];

  const [currentHint, setCurrentHint] = useState(0);

  const handleNextHint = () => {
    if(currentHint < hints.length - 1) {
      setCurrentHint(currentHint + 1);
    }
  };

  const progress = (currentHint + 1) / hints.length;

  return (
    <View style={styles.root}>
      <View style={styles.topBackground} />

        {/* 상단 뒤로가기 버튼 및 '스무고개' 제목 */}
        <View style={styles.titleWrap}>
          <BackButton navigation={navigation}
                      top={H * 0.001}
                      left={W * 0.05}/>
          <Text style={styles.title}>스무고개</Text>
        </View>

        {/* 점수/힌트 진행도 */}
        <View style={styles.scoreWrap}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>

          <View style={styles.hintProgressTextWrap}>
            <Text style={styles.hintProgressLabel}>힌트 진행도</Text>
            <Text style={styles.hintProgressValue}>
              {currentHint + 1}/{hints.length}
            </Text>
          </View>

          <View style={styles.scoreDetailWrap}>
            <Text style={styles.scoreItem}>맞춘 개수</Text>
            <Text style={styles.scoreItemValue}>2개</Text>
            <Text style={styles.scoreItem}>틀린 개수</Text>
            <Text style={[styles.scoreItemValue, { color: colors.pinkDark }]}>3개</Text>
          </View>

        </View>

        {/* 문제 + 힌트 */}
        <TouchableOpacity style={styles.questionsWrap} onPress={handleNextHint}>
          <Text style={styles.questionText}>ㅋㄲㄹ</Text>

          <View style={styles.hintContainer}>
            <ImageBackground
              source={require("../assets/images/bubble_20.png")}
              style={styles.hintBubble}
              resizeMode="stretch"
            >
              <Text style={styles.hintText}>{hints[currentHint]}</Text>
            </ImageBackground>
          </View>
        </TouchableOpacity>


        {/* greeni */}
        <View style={styles.greeniWrap}>
          <Image style={styles.greeni} source={require("../assets/images/20_greeni_big.png")}/>
        </View>

        <MicButton />
      
    </View>
  );
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
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.72,
    backgroundColor: colors.pink, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

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
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // 힌트 진행도 및 점수
  scoreWrap: {
    width: 345,
    height: 115,
    top: -H * 0.15,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: 293,
    height: 10,
    top: H * 0.02,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.green
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#BEEA8B"
  },
  hintProgressTextWrap: {
    flexDirection: "row",
    justifyContent: 'space-between',
    top: H * 0.002,
    width: 293,
    zIndex: 4
  },
  hintProgressLabel: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: colors.brown
  },
  hintProgressValue: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
  scoreDetailWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 293,
    top: -H * 0.02,
  },
  scoreItem: {
    fontsize: 14,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
  },
  scoreItemValue: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: colors.greenDark,
  },

  // 문제 및 힌트
  questionsWrap: {
    width: 345,
    height: 223,
    top: -H * 0.11,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  questionText: {
    fontSize: 40,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
    top: H * 0.07,
    fontWeight: 'bold',
  },
  hintContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 45,
    left: W * 0.12,
  },  
  hintBubble: {
    minWidth: 220,
    maxWidth: W * 0.6,
    paddingHorizontal: 40,
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  hintText: {
    fontSize: 28,
    fontFamily: "gangwongyoyuksaeeum",
    color: colors.brown,
    textAlign: "center",
    lineHeight: 25,
    flexWrap: 'wrap',
  },

  // 그리니
  greeniWrap: {
    position: "absolute",
    top: H * 0.53,
    left: W * 0.1,
    zIndex: 3
  },
  greeni: {
    aspectRatio: 92.35 / 124,
    width: 92.35,
    height: 124,
  },
})