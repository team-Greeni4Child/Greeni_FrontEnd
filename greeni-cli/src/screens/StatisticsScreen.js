import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";
import EmotionVander from "../components/EmotionVander";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

const emotionSourceMap = {
  happy: require("../assets/images/happy.png"),
  sad: require("../assets/images/sad.png"),
  angry: require("../assets/images/angry.png"),
  surprised: require("../assets/images/surprised.png"),
  anxiety: require("../assets/images/anxiety.png"),
};

// 예시 데이터 (하루하루 쌓이면 배열에 push)
const monthEmotions = ["sad", "angry", "happy", "surprised", "anxiety", "sad", "angry", "happy", "surprised", "anxiety", "angry", "happy", "surprised", "anxiety","angry", "happy", "surprised", "anxiety",];

export default function StatisticsScreen({route, navigation}) {

    // const [tab, setTab] = useState(2);

    return (
        <View style={styles.root}>

            <View style={styles.topBackground}>
                <View style={styles.titleWrap}>
                    <BackButton navigation={navigation}
                        top={H * 0.001}
                        left={W * 0.05}/>
                    <Text style={styles.title}>통계</Text>
                </View>
            </View>
            {/* <View style={styles.titleWrap}>
                <BackButton navigation={navigation}
                    top={H * 0.001}
                    left={W * 0.05}/>
                <Text style={styles.title}>통계</Text>
            </View> */}

            <View style={{ flex: 1, width: W }}>
                <ScrollView
                    style={styles.statisticsScrollWrap}
                    contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                    showsVerticalScrollIndicator={false}
                >
                    {/* 출석 버전 1 */}
                    <View style={styles.attendanceWrap}>
                        <Image style={styles.greeniFace} source={require("../assets/images/greeni_face.png")}/>
                        <View style={styles.attendanceTextWrap}>
                            <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 28,}}>OO이는 100일 출석했고</Text>
                            <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 28,}}>우리는 함께 99일의 일기를 작성했어!</Text>
                        </View>
                    </View>
                    {/* 출석 버전 2 */}
                    <View style={styles.attendanceWrap}>
                        <Image style={styles.greeniFace} source={require("../assets/images/greeni_face.png")}/>
                        <View style={styles.attendanceTextWrap}>
                          <Text style={styles.attendanceText}>
                            OO이는{" "}
                            <Text style={styles.attendanceNumber}>100</Text>
                            일 출석했고
                          </Text>

                          <Text style={styles.attendanceText}>
                            우리는 함께{" "}
                            <Text style={styles.attendanceNumber}>99</Text>
                            일의 일기를 작성했어!
                          </Text>
                        </View>
                    </View>

                    {/* 감정 */}
                    <View style={styles.emotionWrap}>
                        <View style={styles.emotionTitleWrap}>
                            <Text style={{fontFamily: "Maplestory_Bold", fontSize: 18, color:colors.brown,}}>이번달 감정</Text>
                        </View>
                        <View style={styles.emotionDetailsWrap}>
                            <View style={styles.emotionVander}>
                              <EmotionVander 
                                emotions={monthEmotions}
                                sourceMap={emotionSourceMap}
                                max={31}
                                seed={202512}
                              />
                            </View>
                            <View style={styles.emotionCountWrap}>
                                <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 24,}}>기쁨 2</Text>
                                <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 24,}}>슬픔 3</Text>
                                <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 24,}}>화남 5</Text>
                                <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 24,}}>놀람 4</Text>
                                <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 24,}}>불안 3</Text>
                            </View>
                        </View>
                    </View>

                    {/* 키워드 */}
                    <View style={styles.keywordWrap}>
                        <View style={styles.keywordTitle}>
                            <Text style={{fontFamily: "Maplestory_Bold", fontSize: 18, color:colors.brown,}}>일기 오늘의 키워드</Text>
                        </View>
                        <View style={styles.keywordContent}>
                            <Text style={{fontFamily: "gangwongyoyuksaeeum", fontSize: 38,}}>파앤피</Text>
                        </View>
                    </View>

                    {/* 활동요약 */}
                    <TouchableOpacity 
                      style={styles.summaryWrap}
                      onPress={() => navigation.navigate("Summary")}>
                        <View style={styles.summaryHeader}>
                          <Text style={styles.summaryTitle}>활동 요약</Text>
                            <Image
                              source={require("../assets/images/next_arrow.png")}
                              style={styles.nextArrow}
                            />
                        </View>
                        <View style={styles.summaryContent}>
                          <View style={styles.chatLeft}>
                            <Image 
                              source={require("../assets/images/settings_greeni_big.png")}
                              style={styles.greeni}
                              resizeMode="contain"
                            />
                            <View style={styles.bubble}>
                              <Text style={styles.bubbleText}>오늘 그리니는 역할놀이에서{"\n"}환자 역할을 했어요.</Text>
                            </View>
                          </View>

                          <View style={styles.chatRight}>
                            <View style={styles.bubble}>
                              <Text style={styles.bubbleText}>다섯고개 20문제 중에서 5문제를{"\n"}틀렸어요.</Text>
                            </View>
                            <Image 
                              source={require("../assets/images/20_greeni_big.png")}
                              style={styles.greeni}
                              resizeMode="contain"
                            />
                          </View>

                          <View style={styles.chatLeft}>
                            <Image 
                              source={require("../assets/images/quiz_greeni_big.png")}
                              style={[styles.greeni, { width: 80, height: 85 }]}
                              resizeMode="contain"
                            />
                            <View style={styles.bubble}>
                              <Text style={[styles.bubbleText, { paddingTop: 10, paddingBottom: 10, textAlign: 'center' }]}>동물퀴즈 10문제를 모두 맞혔어요.</Text>
                            </View>
                          </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
    alignItems: "center",
  },
  topBackground: {
    width: W,
    height: H * 0.17,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: H * 0.08,
  },

  titleWrap: {
    alignItems: "center",
    marginBottom: 45,
    width: W,
    zIndex: 1
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  statisticsScrollWrap: {
    flex: 1,
    width: W,
    marginTop: H * 0.001,
  },
  attendanceWrap: {
    height: 153,
    width: '90%',
    flexDirection: 'column',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    fontSize: 18,
    fontFamily: "gangwongyoyuksaeeum",
    color: colors.brown,
    borderWidth: 2,
    borderColor: colors.green,
    marginTop: 30,
    position: 'relative',
    overflow: 'visible'
  },
  greeniFace: {
    position: 'absolute',
    left: -10,
    top: -28,
    width: 76,
    height: 66.34,
    resizeMode: 'contain'
  },
  attendanceTextWrap: {
    alignItems: 'center',
    fontSize: 18,
    fontFamily: "gangwongyoyuksaeeum",
    color: colors.brown,
  },
  attendanceText: {
    fontFamily: "gangwongyoyuksaeeum",
    fontSize: 24,
    textAlign: "center",
  },

  attendanceNumber: {
    fontFamily: "gangwongyoyuksaeeum",
    fontSize: 34,
  },
  emotionWrap: {
    borderWidth: 2,
    borderColor: colors.pink,
    height: 267,
    width: '90%',
    flexDirection: 'column',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  emotionTitleWrap: {
    width: '77%',
    alignItems: 'flex-start',
    fontFamily: "Maplestory_Bold", // 시안은 굵게
    fontSize: 18,
    color: colors.brown,
    marginLeft: -40,
    marginBottom: 5
  },
  emotionDetailsWrap: {
    width: '100%',
    height: '75%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emotionVander: {
    borderWidth: 2,
    borderColor: colors.pink,
    width: '70%',
    height: '90%',
    marginRight: 20,
    borderRadius: 10,
    backgroundColor: colors.ivory
  },
  emotionCountWrap: {
    // borderWidth: 2,
    // borderColor: 'black',
    width: '15%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  keywordWrap: {
    borderWidth: 2,
    borderColor: colors.green,
    height: 167,
    width: '90%',
    flexDirection: 'column',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: 16
  },
  keywordTitle: {
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 0
  },
  keywordContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  summaryWrap: {
    borderWidth: 2,
    borderColor: colors.pink,
    height: 300,
    width: '90%',
    flexDirection: 'column',
    marginBottom: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: 10,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: '100%',
    paddingTop: 20,
    marginLeft: 30,
  },
  summaryTitle: {
    fontFamily: "Maplestory_Bold",
    fontSize: 18,
    color: colors.brown,
    marginRight: 6,
  },
  nextArrow: {
    width: 8,
    height: 15,
    aspectRatio: 7/12,
    resizeMode: 'contain',
  },
  summaryContent: {
    flex : 1,
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 44,
    paddingBottom: 28,
  },
  chatLeft: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
    marginBottom: 20,
  },
  chatRight: {
    width: '100%',
    height: '30%',
    flexDirection: 'row',
    justifyContent: "flex-end",
    alignItems: 'center',
    marginBottom: 20,
  },
  greeni: {
    width: '20%',
    height: '120%',
    marginLeft : 15,
    marginRight : 15,
    // borderWidth: 2,
    // borderColor: 'red'
  },
  bubble: {
    backgroundColor: colors.pink,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
    maxWidth: '70%',
    flexShrink: 1,
  },
  bubbleText: {
    paddingHorizontal: 5,
    fontSize: 20,
    fontFamily: "gangwongyoyuksaeeum",
    color: colors.brown,
  }
})