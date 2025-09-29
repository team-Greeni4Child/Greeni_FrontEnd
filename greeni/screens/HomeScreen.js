// screens/HomeScreen.js
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      {/* 말풍선 */}
      <ImageBackground
        source={require("../assets/images/bubble_home.png")}
        style={styles.bubble}
        resizeMode="stretch"
      >
        <Text style={styles.bubbleText}>
          안녕 나는 그리니야!{"\n"}오늘은 또 어떤 하루를 보냈어?{"\n"}난 지독한 하루를 보냈어...
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
          style={[styles.gameButton, { backgroundColor: colors.pink }]}
          onPress={() => navigation.navigate("Diary")}
        >
          <Image
            source={require("../assets/images/icon_diary.png")}
            style={styles.icon}
          />
          <Text style={styles.gameText}>일기</Text>
        </TouchableOpacity>

        {/* 스무고개 */}
        <TouchableOpacity
          style={[styles.gameButton, { backgroundColor: colors.green }]}
          onPress={() => navigation.navigate("TwentyQuestions")}
        >
          <Image
            source={require("../assets/images/icon_twenty.png")}
            style={styles.icon}
          />
          <Text style={styles.gameText}>스무고개</Text>
        </TouchableOpacity>

        {/* 동물퀴즈 */}
        <TouchableOpacity
          style={[styles.gameButton, { backgroundColor: colors.green }]}
          onPress={() => navigation.navigate("AnimalQuiz")}
        >
          <Image
            source={require("../assets/images/icon_animal.png")}
            style={styles.icon}
          />
          <Text style={styles.gameText}>동물퀴즈</Text>
        </TouchableOpacity>

        {/* 역할놀이 */}
        <TouchableOpacity
          style={[styles.gameButton, { backgroundColor: colors.pink }]}
          onPress={() => navigation.navigate("RolePlaying")}
        >
          <Image
            source={require("../assets/images/icon_role.png")}
            style={styles.icon}
          />
          <Text style={styles.gameText}>역할놀이</Text>
        </TouchableOpacity>
      </View>

      {/* 네비게이션 바 (임시) */}
      <View style={styles.tabBar}>
        <Text style={styles.tabText}>달력</Text>
        <Text style={styles.tabText}>홈</Text>
        <Text style={styles.tabText}>마이</Text>
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
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  bubbleText: {
    fontSize: 18,
    color: colors.brown,
    fontFamily: "WantedSans-Regular",
    textAlign: "center",
    lineHeight: 25,
  },

  greeni: {
    height: H * 0.2,
  },
  
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: W * 0.85,
    marginVertical: 25,
  },
  gameButton: {
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
    marginBottom: 8,
    resizeMode: "contain",
  },
  gameText: {
    fontSize: 20,
    fontFamily: "KCC-Murukmuruk",
    color: colors.brown,
  },

  tabBar: {
    marginBottom: H * 0.06,
    marginTop: 10,
    width: W * 0.8,
    height: 55,
    backgroundColor: colors.green,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabText: {
    fontSize: 14,
  },
});
