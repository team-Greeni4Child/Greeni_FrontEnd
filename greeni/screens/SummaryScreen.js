    import React, { useState, useEffect } from "react";
    import { 
      View, 
      Text, 
      Image, 
      StyleSheet, 
      Dimensions, 
      TouchableOpacity, 
      ImageBackground,
      ScrollView
    } from "react-native";
    import { StatusBar } from "expo-status-bar";
    import BackButton from "../components/BackButton";
    import colors from "../theme/colors";
    import { color } from "react-native-reanimated";
    import MicButton from "../components/MicButton";
    
    // 현재 기기의 화면 너비 W, 화면 높이 H
    const { width: W, height: H } = Dimensions.get("window");
    
    export default function SummaryScreen({navigation}) {
    
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

        const [today, setToday] = useState("");
        
        useEffect(() => {
            const date = new Date();
            const formatted = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            setToday(formatted);
        }, []);
    
        return (
            <View style={styles.root}>
                <StatusBar style="dark" />
    
                 {/* 상단 뒤로가기 버튼 및 '활동요약' 제목 */}
                <View style={styles.titleWrap}>
                    <BackButton navigation={navigation}
                                top={H * 0.001}
                                left={W * 0.05}/>
                    <Text style={styles.title}>활동요약</Text>
                </View>

                <View>
                    <ScrollView
                        style={styles.summaryScrollWrap}
                        contentContainerStyle={{ alignItems: 'center', paddingBottom: 20 }}
                    >
                        {/* 당일 */}
                        <View style={styles.dailySummaryWrap}>
                            <View style={styles.dailyDateWrap}>
                                <Text style={styles.dailyDateText}>{today}</Text>
                            </View>
                            <View style={styles.dailyActivitiesWrap}>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 역할놀이</Text>
                                    <Text style={styles.activityDetails}>역할놀이에서 친구 역할을 했어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 동물퀴즈</Text>
                                    <Text style={styles.activityDetails}>동물퀴즈에서 병아리 문제를 맞혔어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 스무고개</Text>
                                    <Text style={styles.activityDetails}>스무고개에서 5문제를 맞혔어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 일기쓰기</Text>
                                    <Text style={styles.activityDetails}>일기 작성을 완료했어요. 보러 가실래요?</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 나는야 퀴즈왕</Text>
                                    <Text style={styles.activityDetails}>나는야 퀴즈왕 배지를 획득했어요.</Text>
                                </View>
                            </View>
                        </View>

                        {/* 하루 전 */}
                        <View style={styles.dailySummaryWrap}>
                            <View style={styles.dailyDateWrap}>
                                <Text style={styles.dailyDateText}>2025년 11월 22일</Text>
                            </View>
                            <View style={styles.dailyActivitiesWrap}>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 역할놀이</Text>
                                    <Text style={styles.activityDetails}>역할놀이에서 친구 역할을 했어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 동물퀴즈</Text>
                                    <Text style={styles.activityDetails}>동물퀴즈에서 병아리 문제를 맞혔어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 스무고개</Text>
                                    <Text style={styles.activityDetails}>스무고개에서 5문제를 맞혔어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 일기쓰기</Text>
                                    <Text style={styles.activityDetails}>일기 작성을 완료했어요. 보러 가실래요?</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 나는야 퀴즈왕</Text>
                                    <Text style={styles.activityDetails}>나는야 퀴즈왕 배지를 획득했어요.</Text>
                                </View>
                            </View>
                        </View>

                        {/* 이틀 전 */}
                        <View style={styles.dailySummaryWrap}>
                            <View style={styles.dailyDateWrap}>
                                <Text style={styles.dailyDateText}>2025년 11월 21일</Text>
                            </View>
                            <View style={styles.dailyActivitiesWrap}>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 역할놀이</Text>
                                    <Text style={styles.activityDetails}>역할놀이에서 친구 역할을 했어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 동물퀴즈</Text>
                                    <Text style={styles.activityDetails}>동물퀴즈에서 병아리 문제를 맞혔어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 스무고개</Text>
                                    <Text style={styles.activityDetails}>스무고개에서 5문제를 맞혔어요.</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 일기쓰기</Text>
                                    <Text style={styles.activityDetails}>일기 작성을 완료했어요. 보러 가실래요?</Text>
                                </View>
                                <View style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] 나는야 퀴즈왕</Text>
                                    <Text style={styles.activityDetails}>나는야 퀴즈왕 배지를 획득했어요.</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
    
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
        zIndex: 10
      },
      title: {
        fontSize: 28,
        fontFamily: "Maplestory_Bold",
        color: colors.brown,
      },

      summaryScrollWrap: {
        flex: 1,
        width: W,
        marginTop: H * 0.15
      },
      dailySummaryWrap: {
        width: '90%',
        flexDirection: 'column',
        marginBottom: 20
      },
      dailyDateWrap: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
      },
      dailyDateText: {
        paddingVertical: 2,
        paddingHorizontal: 15,
        backgroundColor: '#E2DCB5',
        borderRadius: 20,
        fontSize: 18,
        fontFamily: "gangwongyoyuksaeeum",
        color: colors.brown,
      },
      dailyActivitiesWrap: {
        flexDirection: 'column'
      },
      activityItemWrap: {
        flexDirection: 'column'
      },
      activityTitle: {
        fontSize: 18,
        fontFamily: "Maplestory_Bold",
        color: colors.brown,
        marginBottom: 5
      },
      activityDetails: {
        fontSize: 20,
        fontFamily: "gangwongyoyuksaeeum",
        color: colors.brown,
        marginBottom: 15
      }
    })