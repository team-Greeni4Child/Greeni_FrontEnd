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
  Modal, 
} from "react-native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

const { width: W, height: H } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [tab, setTab] = useState(0);

  // "오늘 일기 작성 완료" 여부 (나중에 API/스토리지로 대체)
  const [hasWrittenTodayDiary, setHasWrittenTodayDiary] = useState(true);

  // 안내 모달 on/off
  const [showDiaryModal, setShowDiaryModal] = useState(false);

  // 일기 버튼 클릭 처리
  const handlePressDiary = () => {
    if (hasWrittenTodayDiary) {
      setShowDiaryModal(true);
      return;
    }
    navigation.navigate("Diary");
  };

  // 모달 확인 버튼 처리
  const handleDiaryModalOk = () => {
    setShowDiaryModal(false);
  };

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
      {/* 오늘 일기 작성 완료 안내 모달 */}
      <Modal transparent visible={showDiaryModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              오늘의 일기는{"\n"}이미 작성 완료 됐습니다.
            </Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={handleDiaryModalOk}
                activeOpacity={1}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 연못 */}
      <Image
        source={require("../assets/images/pond_home.png")}
        style={styles.pond}
        resizeMode="cover"
      />

      {/* 네비게이션 바 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
          setTab(i);
          if (i === 0) navigation.navigate("Home");
          if (i === 1) navigation.navigate("Calendar");
          if (i === 2) navigation.navigate("Statistics");
          if (i === 3) navigation.navigate("MyPage");
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
          style={[styles.diaryButton, { backgroundColor: colors.pink }]}
          onPress={handlePressDiary} 
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

        {/* 역할놀이 */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#E1EE95" }]}
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
  pond: {
    position: "absolute",
    top: H * 0.2,
    width: W,
    height: H * 1.2,
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
  diaryButton: {
    width: W * 0.38 * 2 + 16,
    height: W * 0.38,
    margin: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.greenDark,
    alignItems: "center",
    justifyContent: "center",
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
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
    // 그림자
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,    
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

  modalBackground: {
    flex: 1,
    backgroundColor: colors.lightGray95,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrap: {
    width: W * 0.7,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    padding: 0,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    textAlign: "center",
    margin: 30,
  },
  modalButtonWrap: {
    flexDirection: "row",
    height: 45,
    width: "100%",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: colors.pink,
  },
  modalButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
});
