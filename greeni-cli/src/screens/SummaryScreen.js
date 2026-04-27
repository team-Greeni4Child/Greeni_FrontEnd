import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, FlatList } from "react-native";
import { StatusBar } from "react-native";

import { getDailyActivityList } from "../api/activity";
import { AuthContext } from "../App";
import { ProfileContext } from "../context/ProfileContext";

import BackButton from "../components/BackButton";
import colors from "../theme/colors";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

// 같은 요일의 활동요약 합치기
function mergeDaysByDate(prevDays, nextDays) {
  const merged = [...prevDays];

  nextDays.forEach(nextDay => {
    const existingIndex = merged.findIndex(day => day.date === nextDay.date);

    if (existingIndex === -1) {
      merged.push(nextDay);
      return;
    }

    merged[existingIndex] = {
      ...merged[existingIndex],
      activities: [...(merged[existingIndex].activities ?? []), ...(nextDay.activities ?? [])],
    };
  });

  return merged;
}

export default function SummaryScreen({ navigation }) {
  const { selectedProfile } = useContext(ProfileContext);
  const { setStep } = useContext(AuthContext);
  const [days, setDays] = useState([]);
  const [cursorCreatedAt, setCursorCreatedAt] = useState(null);
  const [cursorId, setCursorId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listHeight, setListHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const loadingRef = useRef(false);

  useEffect(() => {
    const loadFirst = async () => {
      if (!selectedProfile?.profileId) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        const res = await getDailyActivityList({
          profileId: selectedProfile.profileId,
        });
        const result = res?.result ?? {};
        const nextDays = result.days ?? [];

        setDays(nextDays);
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
        loadingRef.current = false;
        setLoading(false);
      }
    };

    loadFirst();
  }, [selectedProfile?.profileId, setStep]);

  const loadMore = useCallback(async () => {
    if (!hasNext || loadingRef.current || !selectedProfile?.profileId) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      const res = await getDailyActivityList({
        profileId: selectedProfile.profileId,
        cursorCreatedAt,
        cursorId,
      });
      const result = res?.result ?? {};
      const nextPageDays = result.days ?? [];

      setDays(prev => mergeDaysByDate(prev, nextPageDays));
      setCursorCreatedAt(result.nextCursorCreatedAt ?? null);
      setCursorId(result.nextCursorId ?? null);
      setHasNext(!!result.hasNext);
    } catch (e) {
      console.log("LOAD MORE SUMMARY FAIL:", e);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [cursorCreatedAt, cursorId, hasNext, selectedProfile?.profileId]);

  useEffect(() => {
    const contentDoesNotFillList =
      listHeight > 0 && contentHeight > 0 && contentHeight <= listHeight;

    if (contentDoesNotFillList && hasNext && !loading) {
      loadMore();
    }
  }, [contentHeight, hasNext, listHeight, loadMore, loading]);

  const renderDay = ({ item: day }) => (
    <View style={styles.dailySummaryWrap}>
      <View style={styles.dailyDateWrap}>
        <Text style={styles.dailyDateText}>{day.date}</Text>
      </View>
      <View style={styles.dailyActivitiesWrap}>
        {(day.activities ?? []).map((activity, idx) => (
          <View key={`${day.date}-${idx}`} style={styles.activityItemWrap}>
            <Text style={styles.activityTitle}>[활동] {activity.name}</Text>
            <Text style={styles.activityDetails}>{activity.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark-content" />

      {/* 상단 뒤로가기 버튼 및 '활동요약' 제목 */}
      <View style={styles.titleWrap}>
        <BackButton navigation={navigation} top={H * 0.001} left={W * 0.05} />
        <Text style={styles.title}>활동요약</Text>
      </View>

      {/* ScrollView에서 FlatList로 변경 */}
      <FlatList
        style={styles.summaryList}
        contentContainerStyle={styles.summaryListContent}
        data={days}
        keyExtractor={day => day.date}
        renderItem={renderDay}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        onLayout={event => setListHeight(event.nativeEvent.layout.height)}
        onContentSizeChange={(_, height) => setContentHeight(height)}
        ListEmptyComponent={
          !loading ? <Text style={styles.activityDetails}>활동 내역이 없어요.</Text> : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: colors.ivory,
  },

  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
    zIndex: 10,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  summaryList: {
    flex: 1,
    width: W,
    marginTop: H * 0.15,
  },
  summaryListContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  dailySummaryWrap: {
    width: W * 0.9,
    flexDirection: "column",
    marginBottom: 20,
  },
  dailyDateWrap: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  dailyDateText: {
    paddingVertical: 2,
    paddingHorizontal: 15,
    backgroundColor: "#E2DCB5",
    borderRadius: 20,
    fontSize: 13,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
  dailyActivitiesWrap: {
    flexDirection: "column",
  },
  activityItemWrap: {
    flexDirection: "column",
    marginLeft: 5,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
    marginBottom: 5,
  },
  activityDetails: {
    fontSize: 20,
    fontFamily: "gangwongyoyuksaeeum",
    color: colors.brown,
    marginBottom: 15,
  },
});
