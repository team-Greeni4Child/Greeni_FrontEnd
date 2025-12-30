import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  BackHandler,
  Platform,
} from "react-native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

const { width: W, height: H } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [tab, setTab] = useState(1);

  //뒤로가기 앱 종료
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (Platform.OS === "android") {
            BackHandler.exitApp();   // 앱 종료
          }
          return true; 
        };
  
        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => backHandler.remove();
      }, [])
    );

  return (
    <View style={styles.root}>

      {/* 네비게이션 바 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
          setTab(i);
          if (i === 0) navigation.navigate("Calendar");
          if (i === 1) navigation.navigate("Home");
          if (i === 2) navigation.navigate("MyPage");
        }}
      />

      {/* 말풍선 */}
      <ImageBackground
        source={require("../assets/images/bubble_home.png")}
        style={styles.bubble}
        resizeMode="stretch"
      >
        <Text style={styles.bubbleText}>
          안녕 나는 그리니야!{"\n"}오늘은 또 어떤 하루를 보냈어? {/*배고프면 밥을 먹고 움직이자. 내일을 또 살아가야 하니까 말이야...*/}
        </Text>
      </ImageBackground>

      {/* 그리니 */}
      <Image
        source={require("../assets/images/greeni_shy.png")}
        style={styles.greeni}
        resizeMode="contain"
      />

      {/* 버튼들 */}
      <View style={styles.grid}>
        {/* 일기 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.pink }]}
          onPress={() => navigation.navigate("Diary")}
        >
          <Image
            source={require("../assets/images/icon_diary.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>일기</Text>
        </TouchableOpacity>

        {/* 스무고개 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.green }]}
          onPress={() => navigation.navigate("TwentyQuestions")}
        >
          <Image
            source={require("../assets/images/icon_twenty.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>스무고개</Text>
        </TouchableOpacity>

        {/* 동물퀴즈 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.green }]}
          onPress={() => navigation.navigate("Statistics")}
        >
          <Image
            source={require("../assets/images/icon_animal.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>동물퀴즈</Text>
        </TouchableOpacity>

        {/* 역할놀이 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.pink }]}
          onPress={() => navigation.navigate("RolePlaying")}
        >
          <Image
            source={require("../assets/images/icon_role.png")}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>역할놀이</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
    justifyContent: "flex-end", 
    alignItems: "center",
  },

  bubble: {
    bottom: -10,
    maxWidth: W * 0.85, 
    paddingHorizontal: 40,
    paddingVertical: 60,
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

  greeni: {
    height: H * 0.2,
  },
  
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: W * 0.85,
    marginTop: 10,
    marginBottom: H * 0.15,
  },
  button: {
    width: W * 0.38,
    height: W * 0.38,
    margin: 8,
    borderRadius: 15,
    borderWidth: 2,     
    borderColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: "50%",
    marginBottom: 10,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },
});
