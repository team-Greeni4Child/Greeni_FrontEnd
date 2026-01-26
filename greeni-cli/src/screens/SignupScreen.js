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
  Modal,
} from "react-native";
import { requestEmailVerification, signUp } from "../api/auth";

const { width: W, height: H } = Dimensions.get("window");

const AR = {
  greeni: 509 / 852,
};

// 비밀번호 규칙 (영문 + 숫자 + ASCII 특수문자 + 8자리 이상)
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!-/:-@[-`{-~]).{8,}$/;

// 인증번호 유효시간 3분 (현재는 프론트 타이머로 운영)
const DEFAULT_EXPIRE_SECONDS = 3 * 60;
// 재전송 쿨타임(10초)
const RESEND_COOLDOWN_SECONDS = 10;

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [CheckPassword, setCheckPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");
  const [ruleError, setRuleError] = useState(false);

  // 회원가입 완료 모달 on/off
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // 네트워크/서버 오류 모달
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 이미 가입된 이메일 모달
  const [showDuplicateEmailModal, setShowDuplicateEmailModal] = useState(false);

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
  const [isSigningUp, setIsSigningUp] = useState(false);

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

  // 전부 리셋
  const resetSignUpForm = () => {
    // 입력값
    setEmail("");
    setCode("");
    setPassword("");
    setCheckPassword("");

    // 에러 표시
    setEmailError("");
    setCodeError("");
    setPasswordError("");
    setCheckPasswordError("");
    setRuleError(false);

    // 타이머/쿨다운
    clearTimer();
    clearCooldown();
    setSecondsLeft(null);
    setIsExpired(false);

    setIsVerifyDisabled(false);
    setVerifyLabel("인증");

    // 진행중 플래그
    setIsRequestingEmail(false);
    setIsSigningUp(false);
  };

  const openErrorModal = () => {
    console.log(e?.message);
    setShowErrorModal(true);
  };

  const handleErrorOk = () => {
    setShowErrorModal(false);
  };

  const handleDuplicateEmailOk = () => {
    setShowDuplicateEmailModal(false);
    resetSignUpForm();
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
      openErrorModal();
    } finally {
      setIsRequestingEmail(false);
    }
  };

  // 가입하기 버튼
  const handleSignUp = async () => {
    if (isSigningUp) return;

    // 에러 초기화
    setEmailError("");
    setCodeError("");
    setPasswordError("");
    setCheckPasswordError("");
    setRuleError(false);

    const trimmedEmail = email.trim();
    const trimmedCode = code.trim();
    const trimmedPw = password.trim();
    const trimmedCheckPw = CheckPassword.trim();

    let hasError = false;
    let shouldValidateCheckPw = true; // 비밀번호 규칙에 걸리면 false로 바꿈

    // 1) 이메일 검사
    if (!trimmedEmail) {
      setEmail("");
      setEmailError("이메일을 입력해주세요");
      hasError = true;
    }

    // 2) 인증코드 검사
    if (!trimmedCode) {
      setCode("");
      setCodeError("인증코드를 입력해주세요");
      hasError = true;
    }

    // 2-1) 인증코드 만료 검사 (프론트 타이머 기준)
    if (secondsLeft !== null && (secondsLeft === 0 || isExpired)) {
      setCode("");
      setCodeError("인증코드가 만료되었습니다");
      hasError = true;
    }

    // 3) 비밀번호 검사
    if (!trimmedPw) {
      // 비밀번호 공란
      setPassword("");
      setPasswordError("비밀번호를 입력해주세요");
      hasError = true;
      // 이 경우에는 규칙 에러는 아니니까
      // 비밀번호 확인은 그대로 검사하게 둔다
    } else if (!passwordRule.test(trimmedPw)) {
      // 비밀번호 규칙 위반 → 이 경우에는 규칙 경고만 보여주기
      setPassword("");
      setCheckPassword("");
      setRuleError(true);        // 안내문만 빨간색 + Bold
      hasError = true;
      shouldValidateCheckPw = false; // 비밀번호 확인 관련 에러는 막기
    }

    // 4) 비밀번호 확인 검사 (비밀번호 규칙 통과한 경우에만)
    if (shouldValidateCheckPw) {
      if (!trimmedCheckPw) {
        setCheckPassword("");
        setCheckPasswordError("비밀번호 확인을 입력해주세요");
        hasError = true;
      } else if (trimmedPw && trimmedPw !== trimmedCheckPw) {
        setCheckPassword("");
        setCheckPasswordError("비밀번호가 일치하지 않습니다");
        hasError = true;
      }
    }

    // 에러 하나라도 있으면 회원가입 중단
    if (hasError) return;

    try {
      setIsSigningUp(true);

      const res = await signUp({
        email: trimmedEmail,
        password: trimmedPw,
        code: trimmedCode,
      });
      console.log("SIGNUP OK:", res);

      // 회원가입 완료 모달 띄우기
      setShowCompleteModal(true);
    } catch (e) {
      console.log("SIGNUP FAIL:", e);

      // 이미 가입된 이메일 => 모달
      if (e?.code === "MEMBER4001") {
        setShowDuplicateEmailModal(true);
        return;
      }
      if (e?.code === "MEMBER4002") {
        setCode("");
        setCodeError("인증코드가 만료되었습니다.");
        return;
      }
      if (e?.code === "MEMBER4003") {
        setCode("");
        setCodeError("인증코드가 일치하지 않습니다.");
        return;
      }

      // 비밀번호 형식 오류
      if (e?.code === "COMMON400") {
        setPassword("");
        setCheckPassword("");
        setRuleError(true);
        return;
      }

      // 그 외(네트워크/서버 오류 등) => 모달
      openErrorModal();
    } finally {
      setIsSigningUp(false);
    }
  };

  // 모달에서 확인 버튼 누르면 로그인 화면으로 이동
  const handleCompleteOk = () => {
    setShowCompleteModal(false);
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <BackButton navigation={navigation} />

      {/* 입력 박스 */}
      <View style={styles.box}>
        <Text style={styles.title}>회원가입</Text>

        {/* 이메일 + 인증 버튼 */}
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
              if (emailError) setEmailError("");
            }}
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
              if (codeError) setCodeError("");
            }}
          />

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

        {/* 비밀번호 */}
        <TextInput
          style={[
            styles.input,
            passwordError ? { borderBottomColor: "#f36945" } : {},
          ]}
          fontFamily="Maplestory_Light"
          placeholder={passwordError ? passwordError : "비밀번호"}
          placeholderTextColor={passwordError ? "#f36945" : colors.brown}
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (passwordError) setPasswordError("");
            if (ruleError) setRuleError(false);
          }}
        />

        {/* 비밀번호 확인 */}
        <TextInput
          style={[
            styles.input,
            checkPasswordError ? { borderBottomColor: "#f36945" } : {},
          ]}
          fontFamily="Maplestory_Light"
          placeholder={checkPasswordError ? checkPasswordError : "비밀번호 확인"}
          placeholderTextColor={checkPasswordError ? "#f36945" : colors.brown}
          secureTextEntry
          value={CheckPassword}
          onChangeText={(text) => {
            setCheckPassword(text);
            if (checkPasswordError) setCheckPasswordError("");
          }}
        />

        {/* 비밀번호 규칙 안내문 */}
        <Text
          style={[
            styles.ruleText,
            ruleError
              ? { color: "#f36945", fontFamily: "Maplestory_Bold" }
              : { fontFamily: "Maplestory_Light" },
          ]}
        >
          ※ 비밀번호는 영문, 숫자, 특수문자 포함 8자리 이상 입력해야 합니다.
        </Text>
      </View>

      {/* 그리니 + 가입하기 버튼 */}
      <View style={styles.bottomWrap}>
        <Image
          source={require("../assets/images/greeni_shy.png")}
          style={styles.greeni}
          resizeMode="contain"
        />

        <Button
          title="가입하기"
          width={W * 0.35}
          height={46}
          borderRadius={10}
          fontSize={14}
          onPress={handleSignUp}
          disabled={isSigningUp}
        />
      </View>

      {/* 회원가입 완료 모달 */}
      <Modal transparent visible={showCompleteModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>회원가입이 완료되었습니다.</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={handleCompleteOk}  
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 이미 가입된 이메일 모달 */}
      <Modal transparent visible={showDuplicateEmailModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>이미 가입된 이메일입니다.</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={handleDuplicateEmailOk}
              >
                <Text style={styles.modalButtonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 네트워크/서버 오류 모달 */}
      <Modal transparent visible={showErrorModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>{"오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}</Text>

            <View style={styles.modalButtonWrap}>
              <TouchableOpacity
                style={[styles.modalButton]}
                onPress={handleErrorOk}
              >
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
  backButton: {
    position: "absolute",
    top: 80,
    left: 25,
  },
  backIcon: {
    width: 19 * 1.5,
    height: 22 * 1.5,
  },
  box: {
    marginTop: H * 0.15,
    width: W * 0.8,
    height: H * 0.45,
    backgroundColor: colors.white,
    borderRadius: 21,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 2,
    borderColor: colors.greenDark,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 24,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
    textAlign: "center",
    margin: 20,
  },
  emailWrap: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    marginBottom: 8,
    alignItems: "center",
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

  input: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    paddingVertical: 8,
    marginBottom: 8,
    color: colors.brown,
  },
  ruleText: {
    fontSize: 10,
    height: 30,
    verticalAlign: "bottom",
    color: colors.brown,
    fontFamily: "Maplestory_Light",
  },
  bottomWrap: {
    marginTop: H * 0.03,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  greeni: {
    width: W * 0.35,
    aspectRatio: AR.greeni,
    marginRight: W * 0.1,
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
