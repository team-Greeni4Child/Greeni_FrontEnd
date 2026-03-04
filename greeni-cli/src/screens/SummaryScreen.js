    import React, { useState, useEffect, useContext } from "react";
    import { 
      View, 
      Text, 
      StyleSheet, 
      Dimensions, 
      ScrollView
    } from "react-native";
    import { StatusBar } from "react-native";

    import { getDailyActivityList } from "../api/activity";
    import { AuthContext } from "../App";
    import { ProfileContext } from "../context/ProfileContext";

    import BackButton from "../components/BackButton";
    import colors from "../theme/colors";
    
    // 현재 기기의 화면 너비 W, 화면 높이 H
    const { width: W, height: H } = Dimensions.get("window");
    
    export default function SummaryScreen({navigation}) {

        const [today, setToday] = useState("");
        const { selectedProfile } = useContext(ProfileContext);
        const { setStep } = useContext(AuthContext);
        const [days, setDays] = useState([]);
        const [cursorCreatedAt, setCursorCreatedAt] = useState(null);
        const [cursorId, setCursorId] = useState(null);
        const [hasNext, setHasNext] = useState(true);
        const [loading, setLoading] = useState(false);
        
        useEffect(() => {
            const date = new Date();
            const formatted = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
            setToday(formatted);
        }, []);

        useEffect(() => {
            const loadFirst = async () => {
                if (!selectedProfile?.profileId) return;

                try {
                setLoading(true);
                const res = await getDailyActivityList({
                    profileId: selectedProfile.profileId,
                    size: 8,
                });
                const result = res?.result ?? {};
                setDays(result.days ?? []);
                setCursorCreatedAt(result.nextCursorCreatedAt ?? null);
                setCursorId(result.nextCursorId ?? null);
                setHasNext(!!result.hasNext);
                } catch (e) {
                if (e?.code === "PROFILE4031" || e?.code === "PROFILE4041") {
                    setStep("profile");
                    return;
                }
                console.log("LOAD SUMMARY LIST FAIL:", e);
                setDays([]);
                } finally {
                setLoading(false);
                }
            };

            loadFirst();
        }, [selectedProfile?.profileId, navigation, setStep]);

        const loadMore = async () => {
            if (!hasNext || loading || !selectedProfile?.profileId) return;

            try {
                setLoading(true);
                const res = await getDailyActivityList({
                profileId: selectedProfile.profileId,
                cursorCreatedAt,
                cursorId,
                size: 8,
                });
                const result = res?.result ?? {};
                setDays((prev) => [...prev, ...(result.days ?? [])]);
                setCursorCreatedAt(result.nextCursorCreatedAt ?? null);
                setCursorId(result.nextCursorId ?? null);
                setHasNext(!!result.hasNext);
            } catch (e) {
                console.log("LOAD MORE SUMMARY FAIL:", e);
            } finally {
                setLoading(false);
            }
        };


        return (
            <View style={styles.root}>
                <StatusBar style="dark-content" />
    
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
                        onMomentumScrollEnd={loadMore}
                    >
                        {days.length === 0 && !loading ? (
                            <Text style={styles.activityDetails}>활동 내역이 없어요.</Text>
                        ) : (
                            days.map((day) => (
                            <View key={day.date} style={styles.dailySummaryWrap}>
                                <View style={styles.dailyDateWrap}>
                                <Text style={styles.dailyDateText}>{day.date}</Text>
                                </View>
                                <View style={styles.dailyActivitiesWrap}>
                                {(day.activities ?? []).map((a, idx) => (
                                    <View key={`${day.date}-${idx}`} style={styles.activityItemWrap}>
                                    <Text style={styles.activityTitle}>[활동] {a.name}</Text>
                                    <Text style={styles.activityDetails}>{a.description}</Text>
                                    </View>
                                ))}
                                </View>
                            </View>
                            ))
                        )}
                        {/* 당일 */}
                        {/* <View style={styles.dailySummaryWrap}>
                            <View style={styles.dailyDateWrap}>
                                <Text style={styles.dailyDateText}>{today}</Text>
                            </View>
                            <View style={styles.dailyActivitiesWrap}>
                                {loading ? (
                                    <Text style={styles.activityDetails}>불러오는 중...</Text>
                                ) : activityList.length === 0 ? (
                                    <Text style={styles.activityDetails}>오늘 활동 요약이 없어요.</Text>
                                ) : (
                                    activityList.map((item, idx) => (
                                    <View key={`${item}-${idx}`} style={styles.activityItemWrap}>
                                        <Text style={styles.activityTitle}>[활동]</Text>
                                        <Text style={styles.activityDetails}>{item}</Text>
                                    </View>
                                    ))
                                )} */}
                                {/* <View style={styles.activityItemWrap}>
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
                                </View> */}
                         

                        {/* 하루 전 */}
                        {/* <View style={styles.dailySummaryWrap}>
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
                        </View> */}

                        {/* 이틀 전 */}
                        {/* <View style={styles.dailySummaryWrap}>
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
                        </View> */}
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
        fontSize: 13,
        fontFamily: "Maplestory_Light",
        color: colors.brown,
      },
      dailyActivitiesWrap: {
        flexDirection: 'column',
      },
      activityItemWrap: {
        flexDirection: 'column',
        marginLeft: 5
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
