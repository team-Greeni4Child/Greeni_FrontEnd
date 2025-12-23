import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import NavigationBar from "../components/NavigationBar";

const { width: W, height: H } = Dimensions.get("window");

// "YYYY-MM-DD" | Date -> "M/D"
const toMD = (input) => {
  let d;
  if (typeof input === "string") {
    const [y, m, day] = input.split("-").map((v) => parseInt(v, 10));
    d = new Date(y, m - 1, day);
  } else if (input instanceof Date) {
    d = input;
  } else {
    d = new Date();
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export default function DiaryDrawScreen({ navigation, route }) {
  // 하단 탭 상태 (기본: 캘린더)
  const [tab, setTab] = useState(0);

  // route.params?.date 가 있으면 그 날짜, 없으면 오늘
  const titleDate = useMemo(() => {
    const paramDate = route?.params?.date; // "YYYY-MM-DD" 기대
    return toMD(paramDate || new Date());
  }, [route?.params?.date]);

  return (
    <View style={styles.root}>
      {/* 하단 네비게이션 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
          setTab(i);
          if (i === 0) navigation.navigate("Calendar");
          if (i === 1) navigation.navigate("Home");
          if (i === 2) navigation.navigate("MyPage");
        }}
      />

      {/* 상단 바 */}
      <View style={styles.topBar}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>{titleDate}</Text>
      </View>

      {/* 그림 영역 (지금은 빈 공간) */}
      <View style={styles.drawArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  topBar: {
    backgroundColor: colors.pink,
    height: 140,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
  },
  title: {
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
  },
  drawArea: {
    height: H - 180,
  },
});
