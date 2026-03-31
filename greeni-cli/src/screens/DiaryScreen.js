import React, { useContext, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import MicButton from "../components/MicButton";
import Button from "../components/Button";
import { ProfileContext } from "../context/ProfileContext";
import { uploadDiaryVoice } from "../api/s3";
import { sendDiaryVoice } from "../api/diary";
import { requestDiaryAi } from "../api/diaryAi";

const { width: W, height: H } = Dimensions.get("window");

function createSessionId() {
  return `diary_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function DiaryScreen({ navigation }) {
  const { selectedProfile } = useContext(ProfileContext);

  const [isSending, setIsSending] = useState(false);
  const [bubbleText, setBubbleText] = useState("오늘 어떤 일이 있었어?");
  const sessionIdRef = useRef(createSessionId());

  const handleRecordComplete = async filePath => {
    if (isSending) return;

    try {
      setIsSending(true);

      console.log("[DIARY] 녹음 파일 경로:", filePath);
      console.log("[DIARY] sessionId:", sessionIdRef.current);

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
      await sendDiaryVoice({
        url: uploadRes.fileUrl,
        profileId: selectedProfile.profileId,
        role: "user",
      });

      setBubbleText("...");

      const aiRes = await requestDiaryAi({
        profileId: selectedProfile.profileId,
        sessionId: sessionIdRef.current,
        voiceUrl: uploadRes.fileUrl,
        filePath,
      });

      console.log("[DIARY] /api/ai/diaries JSON:", JSON.stringify(aiRes, null, 2));

      const result = aiRes?.result ?? aiRes ?? {};
      const nextSessionId = result?.sessionId || "";
      const aiText = result?.text || "";

      if (nextSessionId) {
        sessionIdRef.current = nextSessionId;
      }

      if (aiText) {
        setBubbleText(aiText);
      } else {
        setBubbleText("다시 한 번 말해줄래?");
      }
    } catch (e) {
      console.log("[DIARY] 음성 전송 실패:", e);

      const code = e?.code || e?.response?.code;

      if (code === "DIARY_ALREADY_EXISTS") {
        navigation.navigate("Home", {
          diaryAlreadyExists: true,
        });
        return;
      }

      setBubbleText("다시 한 번 말해줄래?");
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
          <Text style={styles.bubbleText}>{bubbleText}</Text>
        </ImageBackground>

        <Image
          source={require("../assets/images/umbrella_greeni_big.png")}
          style={styles.greeni}
          resizeMode="contain"
        />
      </View>

      <MicButton onRecordComplete={handleRecordComplete} disabled={isSending} />

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
