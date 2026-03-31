import React, { useContext, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import MicButton from "../components/MicButton";
import Button from "../components/Button";
import { ProfileContext } from "../context/ProfileContext";
import { uploadDiaryVoice } from "../api/s3";
import { sendDiaryVoice } from "../api/diary";

const { width: W, height: H } = Dimensions.get("window");

export default function DiaryScreen({ navigation }) {
  const { selectedProfile } = useContext(ProfileContext);
  const [isSending, setIsSending] = useState(false);

  const handleRecordComplete = async filePath => {
    if (isSending) return;

    try {
      setIsSending(true);

      console.log("[DIARY] 녹음 파일 경로:", filePath);

      if (!filePath) {
        console.log("[DIARY] 파일 경로 없음");
        return;
      }

      if (!selectedProfile?.profileId) {
        console.log("[DIARY] profileId 없음");
        return;
      }

      // 1) S3 업로드
      const uploadRes = await uploadDiaryVoice(filePath);

      console.log("[DIARY] 음성 업로드 성공:", uploadRes);

      if (!uploadRes?.fileUrl) {
        throw new Error("fileUrl 없음");
      }

      // 2) voice API 호출
      const res = await sendDiaryVoice({
        url: uploadRes.fileUrl,
        profileId: selectedProfile.profileId,
        role: "user",
      });

      console.log("[DIARY] /api/diaries/voice 성공:", res);

      // 👉 다음 단계로 연결 (원하면 활성화)
      // navigation.navigate("DiaryDraw");
    } catch (e) {
      console.log("[DIARY] 음성 전송 실패:", e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.topBackground} />
      {/* 상단 뒤로가기 + 제목 */}
      <BackButton navigation={navigation} top={H * 0.08} />
      <Text style={styles.title}>일기쓰기</Text>

      {/* 말풍선 + 그리니 */}
      <View style={styles.greeniWrap}>
        <ImageBackground
          source={require("../assets/images/bubble_diary.png")}
          style={styles.bubble}
          resizeMode="stretch"
        >
          <Text style={styles.bubbleText}>안녕 ○○아,{"\n"}오늘의 일기쓰기를 시작해볼까?</Text>
        </ImageBackground>

        <Image
          source={require("../assets/images/umbrella_greeni_big.png")}
          style={styles.greeni}
          resizeMode="contain"
        />
      </View>

      <MicButton onRecordComplete={handleRecordComplete} />

      {/* 일기 그리러 가는 임시 버튼 */}
      <View style={styles.diaryButton}>
        <Button title="그림일기" onPress={() => navigation.navigate("DiaryDraw")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.ivory,
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.14,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    fontFamily: "Maplestory_Bold",
    fontSize: 28,
    color: colors.brown,
  },

  greeniWrap: {
    bottom: H * 0.35,
    alignItems: "center",
  },
  bubble: {
    maxWidth: W * 0.85,
    paddingHorizontal: 40,
    paddingVertical: 50,
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
    width: W * 0.5,
    height: W * 0.5,
  },

  // 일기 그리러 가는 임시 버튼
  diaryButton: {
    position: "absolute",
    left: 20,
    bottom: 50,
  },
});
