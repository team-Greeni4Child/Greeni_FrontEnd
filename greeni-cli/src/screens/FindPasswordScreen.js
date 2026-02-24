import React, { useEffect, useRef, useState } from "react";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { requestEmailVerification, verifyPasswordResetCode } from "../api/auth";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  Modal,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  greeni: 509 / 852
};

// 이메일 규칙 
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 인증번호 유효시간 3분
const DEFAULT_EXPIRE_SECONDS = 3 * 60;
// 재전송 쿨타임(10초)
const RESEND_COOLDOWN_SECONDS = 10;

export default function FindPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  // 네트워크/서버 오류 모달
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 인증코드 유효시간 타이머
  const [secondsLeft, setSecondsLeft] = useState(null); // null이면 미표시
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef(null);

  // 인증 버튼 쿨타임 + 문구
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
  const [verifyLabel, setVerifyLabel] = useState("인증");
  const cooldownRef = useRef(null);

  // 요청 중 중복 클릭 방지
  const [isRequestingEmail, setIsRequestingEmail] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearCooldown = () => {
    if (cooldownRef.current) {
      clearTimeout(cooldownRef.current);
      cooldownRef.current = null;
    }
  };

  const startCooldown = () => {
    setIsVerifyDisabled(true);
    setVerifyLabel("전송됨");

    clearCooldown();
    cooldownRef.current = setTimeout(() => {
      setIsVerifyDisabled(false);
      setVerifyLabel("재전송");
    }, RESEND_COOLDOWN_SECONDS * 1000);
  };

  const startTimer = (sec) => {
    clearTimer();
    setIsExpired(false);
    setSecondsLeft(sec);

    timerRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev === null) return null;

        if (prev <= 1) {
          clearTimer();
          setIsExpired(true);

          // 만료 후: 버튼은 재전송 가능 상태로
          setIsVerifyDisabled(false);
          setVerifyLabel("재전송");

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearTimer();
      clearCooldown();
    };
  }, []);

  const formatMMSS = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(1, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const openErrorModal = (err) => {
    console.log(err?.message);
    setShowErrorModal(true);
  };

  const handleErrorOk = () => {
    setShowErrorModal(false);
  };

  // 이메일 인증 버튼
  const handleVerifyEmail = async () => {
    if (isVerifyDisabled) return;
    if (isRequestingEmail) return;

    setEmailError("");
    setCodeError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmail("");
      setEmailError("이메일을 입력해주세요");
      return;
    }

    if (!emailRule.test(trimmedEmail)) {
      setEmail("");
      setEmailError("이메일 형식이 올바르지 않습니다");
      return;
    }

    try {
      setIsRequestingEmail(true);

      // 이메일 인증 요청 API 호출
      const res = await requestEmailVerification(trimmedEmail);
      console.log("EMAIL REQUEST OK:", res);

      // 타이머 시작
      startTimer(DEFAULT_EXPIRE_SECONDS);

      // 전송 직후: 전송됨 (10초 후 재전송으로 변경)
      startCooldown();

      // 재전송 버튼을 누르면 인증코드 입력칸을 비움
      setCode("");
    } catch (e) {
      console.log("EMAIL REQUEST FAIL:", e);

      // 인증 코드 전송 실패
      if (e?.code === "MEMBER4006") {
        setCode("");
        setCodeError("인증코드 전송에 실패했습니다.");
        return;
      }

      // 그 외(네트워크/서버 오류 등) => 모달
      openErrorModal(e);
    } finally {
      setIsRequestingEmail(false);
    }
  };

  // 완료 버튼 클릭
  const handleComplete = async () => {
    if (isVerifyingCode) return;

    setEmailError("");
    setCodeError("");

    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    let hasError = false;

    // 이메일 검사
    if (!trimmedEmail) {
      setEmail("");
      setEmailError("이메일을 입력해주세요");
      hasError = true;
    } else if (!emailRule.test(trimmedEmail)) {
      setEmail("");
      setEmailError("이메일 형식이 올바르지 않습니다");
      hasError = true;
    }

    // 인증코드 검사
    if (!trimmedCode) {
      setCode("");
      setCodeError("인증코드를 입력해주세요");
      hasError = true;
    }

    // 인증코드 만료 검사 (프론트 타이머 기준)
    if (secondsLeft !== null && (secondsLeft === 0 || isExpired)) {
      setCode("");
      setCodeError("인증코드가 만료되었습니다");
      hasError = true;
    }

    // 에러 하나라도 있으면 회원가입 중단
    if (hasError) return;

    try {
      setIsVerifyingCode(true);

      const res = await verifyPasswordResetCode({
        email: trimmedEmail,
        code: trimmedCode,
      });
      console.log("VERIFY CODE OK:", res);

      // 성공 → ResetPassword로 email 넘기기
      navigation.navigate("ResetPassword", { email: trimmedEmail });
    } catch (e) {
      console.log("VERIFY CODE FAIL:", e);

      if (e?.code === "MEMBER4002") {
        setCode("");
        setCodeError("인증코드가 만료되었습니다.");

        // 만료 UX 정리
        setIsExpired(true);
        setSecondsLeft(0);
        setIsVerifyDisabled(false);
        setVerifyLabel("재전송");
        return;
      }

      if (e?.code === "MEMBER4003") {
        setCode("");
        setCodeError("인증코드가 올바르지 않습니다.");
        return;
      }

      if (e?.code === "MEMBER4004") {
        setEmail("");
        setEmailError("존재하지 않는 메일입니다");
        return;
      }

      // 그 외(네트워크/서버 오류 등) => 모달
      openErrorModal(e);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      {/* 뒤로가기 버튼 */}
      <BackButton navigation={navigation} />

      {/* 비밀번호 찾기 박스 */}
      <View style={styles.box}>
        <Text style={styles.title}>비밀번호 찾기</Text>

        {/* 이메일, 인증코드 입력 */}
        <View style={styles.inputsWrap}>
          <View
            style={[
              styles.emailWrap,
              emailError ? { borderBottomColor: "#f36945" } : {},
            ]}
          >
            <TextInput
              style={styles.email}
              fontFamily="Maplestory_Light"
              placeholder={emailError ? emailError : "이메일"}
              placeholderTextColor={emailError ? "#f36945" : colors.brown}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                // 이메일 입력 시: 이메일 에러 초기화
                if (emailError) setEmailError("");
              }}
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[
                styles.verificationButton,
                (isVerifyDisabled || isRequestingEmail) &&
                  styles.verificationButtonDisabled,
              ]}
              onPress={handleVerifyEmail}
              activeOpacity={0.6}
              disabled={isVerifyDisabled || isRequestingEmail}
            >
              <Text style={styles.verificationButtonText}>{verifyLabel}</Text>
            </TouchableOpacity>
          </View>

          {/* 인증코드 입력칸 + 오른쪽 유효시간 */}
          <View
            style={[
              styles.codeWrap,
              codeError ? { borderBottomColor: "#f36945" } : {},
            ]}
          >
            <TextInput
              style={styles.codeInput}
              fontFamily="Maplestory_Light"
              placeholder={codeError ? codeError : "인증코드"}
              placeholderTextColor={codeError ? "#f36945" : colors.brown}
              value={code}
              onChangeText={(text) => {
                setCode(text);
                // 인증코드 입력 시: 코드 에러 초기화
                if (codeError) setCodeError("");
              }}
            />

            {/* 인증코드 유효시간 타이머 */}
            {secondsLeft !== null ? (
              isExpired ? (
                <Text style={styles.expiredText}>만료</Text>
              ) : (
                <Text style={styles.timerText}>{formatMMSS(secondsLeft)}</Text>
              )
            ) : (
              <View style={styles.timerPlaceholder} />
            )}
          </View>
        </View>

        {/* 완료 버튼 */}
        <Button
          title="완료"
          width="100%"
          height={46}
          borderRadius= {10}
          fontSize={14}
          onPress={handleComplete}
          disabled={isVerifyingCode}
        />
      </View>

      <View style={styles.bottomWrap}>
        {/* 그리니 */}
        <Image 
          source={require("../assets/images/greeni_shy.png")} 
          style={styles.greeni}
          resizeMode="contain"
        />

        {/* 오른쪽 공간 (비워둠) */}
        <View style={{ width: W * 0.402 }} />
      </View>

      {/* 네트워크/서버 오류 모달 */}
      <Modal transparent visible={showErrorModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              {"오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
            </Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity style={[styles.modalButton]} onPress={handleErrorOk}>
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.ivory, 
    alignItems: "center",
  },
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.6,
    backgroundColor: colors.pink, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  box: {
    marginTop: H * 0.2,
    width: W * 0.8,
    height: H * 0.35,
    backgroundColor: colors.white,
    borderRadius: 21,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.greenDark,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
    textAlign: "center",
  },
  inputsWrap: {
    alignItems: "stretch",        
  },
  emailWrap: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    marginBottom: 8,
    alignItems: "center", //인증버튼 위치 이상한 기종 있으면 이거 지우기
  },
  email: {
    width: "75%",
    height: 35,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    paddingVertical: 8,
    color: colors.brown,
  },
  verificationButton: {
    backgroundColor: colors.pink,
    borderRadius: 5,
    height: 30,
    width: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  verificationButtonDisabled: {
    backgroundColor: colors.lightGray95,
  },
  verificationButtonText: {
    fontSize: 12,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },

  // 인증코드 입력 + 타이머
  codeWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    marginBottom: 8,
  },
  codeInput: {
    width: "75%",
    height: 35,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    paddingVertical: 8,
    color: colors.brown,
  },
  timerText: {
    width: 60,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    paddingBottom: 2,
  },
  expiredText: {
    width: 60,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Maplestory_Light",
    color: "#f36945",
    paddingBottom: 2,
  },
  timerPlaceholder: {
    width: 60,
  },

  bottomWrap: {
    marginTop: H * 0.08,
    flexDirection: "row",    
    alignItems: "center",
  },
  greeni: {
    width: W * 0.35,         
    aspectRatio: AR.greeni,   
    marginRight: W * 0.04, 
  },

  // 모달창
  modalBackground: {
    flex: 1,
    backgroundColor: colors.lightGray95,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrap: {
    width: W * 0.7,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.greenDark,
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
    backgroundColor: colors.green,
  },
  modalButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
});
