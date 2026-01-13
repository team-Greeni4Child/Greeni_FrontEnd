import React, { useEffect, useRef, useState } from "react";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions, 
  Platform,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  greeni: 509 / 852
};

// 임시: 가입된 이메일 & 인증코드 (나중에 API 연동 시 교체)
const MOCK_USER_EMAIL = "aaa";
const MOCK_VERIFY_CODE = "aaa";

// 인증번호 유효시간 3분
const DEFAULT_EXPIRE_SECONDS = 3 * 60;
// 재전송 쿨타임(10초)
const RESEND_COOLDOWN_SECONDS = 10;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  // 인증코드 유효시간 타이머
  const [secondsLeft, setSecondsLeft] = useState(null); // null이면 미표시
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef(null);

  // 인증 버튼 쿨타임 + 문구
  const [isVerifyDisabled, setIsVerifyDisabled] = useState(false);
  const [verifyLabel, setVerifyLabel] = useState("인증");
  const cooldownRef = useRef(null);

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

  // 인증 버튼 클릭
  const handleVerifyEmail = () => {
    if (isVerifyDisabled) return;

    setEmailError("");
    setCodeError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmail("");
      setEmailError("이메일을 입력해주세요");
      return;
    }

    if (trimmedEmail !== MOCK_USER_EMAIL) {
      setEmail("");
      setEmailError("가입되지 않은 이메일입니다");
      return;
    }
    // 인증코드 발송 API 호출
    // 성공했다고 가정하고 타이머 시작
    startTimer(DEFAULT_EXPIRE_SECONDS);

    // 전송 직후: 전송됨 (10초 후 재전송으로 변경)
    startCooldown();

    // 재전송 버튼을 누르면 인증코드 입력칸을 비움
    setCode("");
  };

  // 완료 버튼 클릭
  const handleComplete = () => {
    setEmailError("");
    setCodeError("");

    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();

    let hasError = false;

    if (!trimmedEmail) {
      setEmail("");
      setEmailError("이메일을 입력해주세요");
      hasError = true;
    }

    if (!trimmedCode) {
      setCode("");
      setCodeError("인증코드를 입력해주세요");
      hasError = true;
    }

    if (hasError) return;

    // 인증코드 만료
    if (secondsLeft === 0 || isExpired) {
      setCode("");
      setCodeError("인증코드가 만료되었습니다");
      return;
    }

    // 이메일 + 코드 일치 여부만 간단히 체크
    if (trimmedEmail !== MOCK_USER_EMAIL || trimmedCode !== MOCK_VERIFY_CODE) {
      setCode("");
      setCodeError("인증코드가 일치하지 않습니다");
      return;
    }

    navigation.navigate("ResetPassword");
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
            />

            <TouchableOpacity
              style={[
                styles.verificationButton,
                isVerifyDisabled && styles.verificationButtonDisabled,
              ]}
              onPress={handleVerifyEmail}
              activeOpacity={0.6}
              disabled={isVerifyDisabled}
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
});
