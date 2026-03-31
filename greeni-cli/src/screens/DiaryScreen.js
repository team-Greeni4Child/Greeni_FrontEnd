import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions, ImageBackground } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import MicButton from "../components/MicButton";
import Button from "../components/Button";
import { ProfileContext } from "../context/ProfileContext";
import { uploadDiaryVoice } from "../api/s3";
import { sendDiaryVoice } from "../api/diary";
import { requestDiaryAi, closeDiaryAi } from "../api/diaryAi";
import { playBase64Mp3, stopAiAudio } from "../utils/audio";

const { width: W, height: H } = Dimensions.get("window");
const MAX_DIARY_TURNS = 10;

function createSessionId() {
  return `diary_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export default function DiaryScreen({ navigation }) {
  const { selectedProfile } = useContext(ProfileContext);

  const [isSending, setIsSending] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [bubbleText, setBubbleText] = useState("오늘 어떤 일이 있었어?");

  const sessionIdRef = useRef(createSessionId());
  const turnRef = useRef(0);
  const isScreenActiveRef = useRef(true);
  const isEndingRef = useRef(false);

  useEffect(() => {
    isScreenActiveRef.current = true;

    return () => {
      isScreenActiveRef.current = false;
      stopAiAudio();
    };
  }, []);

  const playDiaryVoice = async audioBase64 => {
    if (!audioBase64 || !isScreenActiveRef.current) return;

    try {
      setIsAiSpeaking(true);
      await playBase64Mp3(audioBase64);
    } catch (e) {
      console.log("[DIARY] AI 음성 재생 실패:", e);
    } finally {
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }
    }
  };

  const handleEndDiary = async () => {
    if (isEndingRef.current) return;
    if (!selectedProfile?.profileId) return;

    try {
      isEndingRef.current = true;

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

      await closeDiaryAi({
        profileId: selectedProfile.profileId,
        sessionId: sessionIdRef.current,
      });

      navigation.replace("DiaryDraw", {
        sessionId: sessionIdRef.current,
      });
    } catch (e) {
      console.log("[DIARY] 종료 실패:", e);
    } finally {
      isEndingRef.current = false;
    }
  };

  const handleRecordComplete = async filePath => {
    if (isSending || isAiSpeaking || isEndingRef.current) return;

    try {
      setIsSending(true);

      if (!filePath || !selectedProfile?.profileId) {
        return;
      }

      await stopAiAudio();
      if (isScreenActiveRef.current) {
        setIsAiSpeaking(false);
      }

      // 1) S3 업로드
      const uploadRes = await uploadDiaryVoice(filePath);

      if (!uploadRes?.fileUrl) {
        throw new Error("fileUrl 없음");
      }

      // 2) voice API 호출
      await sendDiaryVoice({
        url: uploadRes.fileUrl,
        profileId: selectedProfile.profileId,
        role: "user",
      });

      if (!isScreenActiveRef.current) return;

      setBubbleText("...");

      const aiRes = await requestDiaryAi({
        profileId: selectedProfile.profileId,
        sessionId: sessionIdRef.current,
        voiceUrl: uploadRes.fileUrl,
        filePath,
      });

      if (!isScreenActiveRef.current) return;

      const result = aiRes?.result ?? aiRes ?? {};
      const nextSessionId = result?.sessionId || "";
      const aiText = result?.text || "";
      const aiVoiceBase64 = result?.base64Voice || "";

      console.log("[DIARY] AI 응답:", {
        sessionId: nextSessionId,
        hasText: !!aiText,
        hasVoice: !!aiVoiceBase64,
        nextTurn: turnRef.current + 1,
      });

      if (nextSessionId) {
        sessionIdRef.current = nextSessionId;
      }

      turnRef.current += 1;

      if (aiText) {
        setBubbleText(aiText);
      } else {
        setBubbleText("다시 한 번 말해줄래?");
      }

      if (aiVoiceBase64) {
        await playDiaryVoice(aiVoiceBase64);
      }

      if (turnRef.current >= MAX_DIARY_TURNS) {
        await handleEndDiary();
      }
    } catch (e) {
      console.log("[DIARY] 음성 전송 실패:", e);

      const code = e?.code || e?.response?.code;

      if (code === "DIARY_ALREADY_EXISTS") {
        navigation.replace("Home", {
          diaryAlreadyExists: true,
        });
        return;
      }

      if (isScreenActiveRef.current) {
        setBubbleText("다시 한 번 말해줄래?");
      }
    } finally {
      if (isScreenActiveRef.current) {
        setIsSending(false);
      }
    }
  };

  const isMicDisabled = isSending || isAiSpeaking || isEndingRef.current;

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

      <MicButton onRecordComplete={handleRecordComplete} disabled={isMicDisabled} />

      {/* 일기 그리러 가는 임시 버튼 */}
      <View style={styles.diaryButton}>
        <Button title="그림일기" onPress={handleEndDiary} disabled={isEndingRef.current} />
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
