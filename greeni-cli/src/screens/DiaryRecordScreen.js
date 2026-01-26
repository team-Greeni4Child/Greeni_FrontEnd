import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
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

export default function DiaryRecordScreen({ navigation, route }) {
  // 하단 탭 상태 (기본: 캘린더)
  const [tab, setTab] = useState(0);

  // route.params?.date 가 있으면 그 날짜, 없으면 오늘
  const titleDate = useMemo(() => {
    const paramDate = route?.params?.date; // "YYYY-MM-DD" 기대
    return toMD(paramDate || new Date());
  }, [route?.params?.date]);

  const handlePressHeadset = () => {
    // TODO: 추후 "그날 일기 음성 대화 기록 재생" 기능 연결
  };

  return (
    <View style={styles.root}>

      {/* 상단 바 */}
      <View style={styles.topBar}>
        <BackButton navigation={navigation} />
        <Text style={styles.title}>{titleDate}</Text>

        {/* 헤드셋 아이콘 (오른쪽 상단) */}
        <TouchableOpacity
          style={styles.headsetBtn}
          activeOpacity={0.8}
          onPress={handlePressHeadset}
        >
          <Image
            source={require("../assets/images/headset.png")}
            style={styles.headsetIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
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

  // 오른쪽 상단 헤더 아이콘
  headsetBtn: {
    position: "absolute",
    right: 20,
    top: 70,
    padding: 8, // 터치 영역 확보
  },
  headsetIcon: {
    width: 28,
    height: 28,
  },

  drawArea: {
    height: H - 180,
  },
});
