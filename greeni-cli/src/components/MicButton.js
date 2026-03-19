import React, { useEffect, useRef, useState } from "react";
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import Sound, { AudioEncoderAndroidType, AudioSourceAndroidType } from "react-native-nitro-sound";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

const micIcons = [
  require("../assets/images/mic1.png"),
  require("../assets/images/mic2.png"),
  require("../assets/images/mic3.png"),
  require("../assets/images/mic4.png"),
];

const SILENCE_MS = 3000;
const SILENCE_DB = -45;

export default function MicButton({ onRecordComplete }) {
  const [active, setActive] = useState(false);
  const [frame, setFrame] = useState(0);

  const silenceStartedAtRef = useRef(null);
  const isStoppingRef = useRef(false);
  const isPlayingRef = useRef(false);
  const recordPathRef = useRef("");

  useEffect(() => {
    let interval;
    if (active) {
      interval = setInterval(() => {
        setFrame(prev => (prev + 1) % micIcons.length);
      }, 200);
    } else {
      if (frame > 0) {
        interval = setInterval(() => {
          setFrame(prev => (prev > 0 ? prev - 1 : 0));
        }, 200);
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [active, frame]);

  useEffect(() => {
    return () => {
      try {
        Sound.removeRecordBackListener();
      } catch (e) {
        console.log("REMOVE RECORD LISTENER FAIL:", e);
      }

      try {
        Sound.removePlayBackListener();
      } catch (e) {
        console.log("REMOVE PLAYBACK LISTENER FAIL:", e);
      }
    };
  }, []);

  const requestMicPermission = async () => {
    if (Platform.OS !== "android") return true;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "마이크 권한",
          message: "음성 녹음을 위해 마이크 권한이 필요합니다.",
          buttonPositive: "확인",
          buttonNegative: "취소",
        },
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (e) {
      console.log("MIC PERMISSION FAIL:", e);
      return false;
    }
  };

  const startRecording = async () => {
    if (active || isPlayingRef.current) return;

    const granted = await requestMicPermission();
    if (!granted) {
      Alert.alert("권한 필요", "마이크 권한이 필요합니다.");
      return;
    }

    try {
      isStoppingRef.current = false;
      silenceStartedAtRef.current = null;
      recordPathRef.current = "";

      Sound.setSubscriptionDuration(0.2);

      const audioSet = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AudioSamplingRate: 44100,
        AudioEncodingBitRate: 128000,
        AudioChannels: 1,
      };

      Sound.addRecordBackListener(e => {
        const meter = typeof e.currentMetering === "number" ? e.currentMetering : null;
        const now = Date.now();

        if (meter === null) return;

        if (meter < SILENCE_DB) {
          if (!silenceStartedAtRef.current) {
            silenceStartedAtRef.current = now;
          } else if (now - silenceStartedAtRef.current >= SILENCE_MS) {
            stopRecording();
          }
        } else {
          silenceStartedAtRef.current = null;
        }
      });

      const uri = await Sound.startRecorder(undefined, audioSet, true);
      recordPathRef.current = uri;
      setActive(true);

      console.log("RECORD START:", uri);
    } catch (e) {
      console.log("START RECORD FAIL:", e);
      Alert.alert("오류", "녹음을 시작하지 못했어요.");

      try {
        Sound.removeRecordBackListener();
      } catch (err) {
        console.log("REMOVE RECORD LISTENER FAIL:", err);
      }
    }
  };

  const playRecordedFile = async filePath => {
    if (!filePath) return;

    try {
      isPlayingRef.current = true;

      console.log("PLAY START:", filePath);

      await Sound.startPlayer(filePath);

      Sound.addPlayBackListener(e => {
        if (e.currentPosition >= e.duration && e.duration > 0) {
          stopPlaying();
        }
      });
    } catch (e) {
      console.log("START PLAY FAIL:", e);
      isPlayingRef.current = false;
      Alert.alert("오류", "녹음 파일 재생에 실패했어요.");
    }
  };

  const stopPlaying = async () => {
    try {
      await Sound.stopPlayer();
    } catch (e) {
      console.log("STOP PLAY FAIL:", e);
    }

    try {
      Sound.removePlayBackListener();
    } catch (e) {
      console.log("REMOVE PLAYBACK LISTENER FAIL:", e);
    }

    isPlayingRef.current = false;
    console.log("PLAY END");
  };

  const stopRecording = async () => {
    if (isStoppingRef.current) return;

    try {
      isStoppingRef.current = true;

      const resultPath = await Sound.stopRecorder();
      Sound.removeRecordBackListener();

      setActive(false);
      silenceStartedAtRef.current = null;

      const finalPath = resultPath || recordPathRef.current || "";

      console.log("RECORD COMPLETE:", finalPath);

      if (typeof onRecordComplete === "function") {
        onRecordComplete(finalPath);
      }

      await playRecordedFile(finalPath);
    } catch (e) {
      console.log("STOP RECORD FAIL:", e);
      Alert.alert("오류", "녹음을 종료하지 못했어요.");
    } finally {
      isStoppingRef.current = false;
    }
  };

  const toggleMic = async () => {
    if (active) {
      await stopRecording();
      return;
    }

    if (isPlayingRef.current) {
      await stopPlaying();
      return;
    }

    await startRecording();
  };

  return (
    <TouchableOpacity onPress={toggleMic} style={styles.button}>
      <Image source={micIcons[frame]} style={styles.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    alignItems: "center",
    bottom: H * 0.06,
  },
  icon: {
    //backgroundColor: "green",
    width: W * 0.42,
    height: W * 0.42,
  },
});
