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

// 무음 상태가 유지되어야 하는 시간
const SILENCE_MS = 1200;

// 말소리가 감지되지 않았을 때 자동 종료까지 기다리는 시간
const NO_SPEECH_TIMEOUT_MS = 2000;

// 강제 종료까지의 최대 녹음 시간
const MAX_RECORDING_MS = 15000;

// 자동 종료를 막는 최소 녹음 시간
const MIN_RECORDING_MS = 800;

// 주변 소음보다 이 정도 커야 말소리로 판단. 말소리 잘 못잡으면 2낮추기
const SPEECH_MARGIN_DB = 12;

// 주변 소음 기준값의 최소/최대 범위
const NOISE_FLOOR_MIN = -60;
const NOISE_FLOOR_MAX = -28;

// 동적 기준이 안정되기 전 사용할 기본 무음 기준
const DEFAULT_NOISE_FLOOR = -50;

// 주변 소음 기준을 천천히 갱신하는 비율
const NOISE_UPDATE_ALPHA = 0.08;

export default function MicButton({ onRecordComplete, disabled = false, touchableRef = null }) {
  const [active, setActive] = useState(false);
  const [frame, setFrame] = useState(0);

  const silenceStartedAtRef = useRef(null);
  const recordStartedAtRef = useRef(null);
  const maxRecordingTimerRef = useRef(null);
  const noSpeechTimerRef = useRef(null);
  const isStoppingRef = useRef(false);
  const recordPathRef = useRef("");

  const noiseFloorRef = useRef(null);
  const hasDetectedSpeechRef = useRef(false);

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
      clearMaxRecordingTimer();
      clearNoSpeechTimer();

      try {
        Sound.removeRecordBackListener();
      } catch (e) {
        console.log("REMOVE RECORD LISTENER FAIL:", e);
      }
    };
  }, []);

  const clearMaxRecordingTimer = () => {
    if (maxRecordingTimerRef.current) {
      clearTimeout(maxRecordingTimerRef.current);
      maxRecordingTimerRef.current = null;
    }
  };

  const clearNoSpeechTimer = () => {
    if (noSpeechTimerRef.current) {
      clearTimeout(noSpeechTimerRef.current);
      noSpeechTimerRef.current = null;
    }
  };

  const clampNoiseFloor = value => {
    return Math.max(NOISE_FLOOR_MIN, Math.min(NOISE_FLOOR_MAX, value));
  };

  const getNoiseFloor = () => {
    if (typeof noiseFloorRef.current === "number") {
      return clampNoiseFloor(noiseFloorRef.current);
    }

    return DEFAULT_NOISE_FLOOR;
  };

  const getSpeechThreshold = () => {
    return getNoiseFloor() + SPEECH_MARGIN_DB;
  };

  const updateNoiseFloor = meter => {
    if (typeof meter !== "number") return;

    const safeMeter = clampNoiseFloor(meter);

    if (noiseFloorRef.current === null) {
      noiseFloorRef.current = safeMeter;
      return;
    }

    const prev = noiseFloorRef.current;
    const next = prev * (1 - NOISE_UPDATE_ALPHA) + safeMeter * NOISE_UPDATE_ALPHA;

    noiseFloorRef.current = clampNoiseFloor(next);
  };

  const resetRecordingRefs = () => {
    silenceStartedAtRef.current = null;
    recordStartedAtRef.current = null;
    recordPathRef.current = "";
    noiseFloorRef.current = null;
    hasDetectedSpeechRef.current = false;
  };

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

  const stopRecording = async () => {
    if (isStoppingRef.current) return;

    try {
      isStoppingRef.current = true;
      clearMaxRecordingTimer();
      clearNoSpeechTimer();

      const resultPath = await Sound.stopRecorder();
      Sound.removeRecordBackListener();

      setActive(false);

      const finalPath = resultPath || recordPathRef.current || "";

      console.log("RECORD COMPLETE:", finalPath);

      if (typeof onRecordComplete === "function" && finalPath) {
        await onRecordComplete(finalPath);
      }
    } catch (e) {
      console.log("STOP RECORD FAIL:", e);
    } finally {
      resetRecordingRefs();
      isStoppingRef.current = false;
    }
  };

  const startRecording = async () => {
    if (active || disabled) return;

    const granted = await requestMicPermission();
    if (!granted) {
      Alert.alert("권한 필요", "마이크 권한이 필요합니다.");
      return;
    }

    try {
      isStoppingRef.current = false;
      resetRecordingRefs();

      recordStartedAtRef.current = Date.now();

      clearMaxRecordingTimer();
      clearNoSpeechTimer();

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
        const startedAt = recordStartedAtRef.current;

        if (meter === null || !startedAt) return;

        const elapsed = now - startedAt;

        if (elapsed < MIN_RECORDING_MS) {
          updateNoiseFloor(meter);
          return;
        }

        const speechThreshold = getSpeechThreshold();
        const isSpeech = meter >= speechThreshold;

        if (isSpeech) {
          hasDetectedSpeechRef.current = true;
          clearNoSpeechTimer();
          silenceStartedAtRef.current = null;
          return;
        }

        updateNoiseFloor(meter);

        if (!hasDetectedSpeechRef.current) {
          return;
        }

        if (!silenceStartedAtRef.current) {
          silenceStartedAtRef.current = now;
          return;
        }

        if (now - silenceStartedAtRef.current >= SILENCE_MS) {
          stopRecording();
        }
      });

      const uri = await Sound.startRecorder(undefined, audioSet, true);
      recordPathRef.current = uri;
      setActive(true);

      noSpeechTimerRef.current = setTimeout(() => {
        if (!hasDetectedSpeechRef.current) {
          stopRecording();
        }
      }, NO_SPEECH_TIMEOUT_MS);

      maxRecordingTimerRef.current = setTimeout(() => {
        stopRecording();
      }, MAX_RECORDING_MS);

      console.log("RECORD START:", uri);
    } catch (e) {
      console.log("START RECORD FAIL:", e);

      clearMaxRecordingTimer();
      clearNoSpeechTimer();

      try {
        Sound.removeRecordBackListener();
      } catch (err) {
        console.log("REMOVE RECORD LISTENER FAIL:", err);
      }

      resetRecordingRefs();
      setActive(false);
    }
  };

  const toggleMic = async () => {
    if (disabled) return;

    if (active) {
      await stopRecording();
      return;
    }

    await startRecording();
  };

  return (
    <TouchableOpacity
      ref={touchableRef}
      onPress={toggleMic}
      style={styles.button}
      disabled={disabled}
    >
      <Image source={micIcons[frame]} style={[styles.icon, disabled && styles.iconDisabled]} />
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
    width: W * 0.42,
    height: W * 0.42,
  },
  iconDisabled: {
    opacity: 0.45,
  },
});
