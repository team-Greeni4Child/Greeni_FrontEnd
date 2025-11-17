import React, { useState } from "react";
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
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

const AR = {
  greeni: 509 / 852,
};

// 임시: 이미 가입된 이메일 / 인증코드 (백엔드 연동 시 교체)
const MOCK_EXISTING_EMAILS = ["aaa"];
const MOCK_VERIFY_CODE = "aaa";

// 비밀번호 규칙 (영문 + 숫자 + ASCII 특수문자 + 8자리 이상)
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!-/:-@[-`{-~]).{8,}$/;

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

  // 이메일 인증 버튼
  const handleVerifyEmail = () => {
    setEmailError("");
    setCodeError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmail("");
      setEmailError("이메일을 입력해주세요");
      return;
    }

    // 회원가입: 이미 가입된 이메일이면 에러
    if (MOCK_EXISTING_EMAILS.includes(trimmedEmail)) {
      setEmail("");
      setEmailError("이미 가입된 이메일입니다");
      return;
    }

    // 여기서 실제로는 인증코드 발송 API 호출
    // 테스트용으로는 아무것도 안 함
  };

  // 가입하기 버튼
  const handleSignUp = () => {
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

    // 2) 인증코드 검사 (공란 + 불일치 둘 다 체크)
    if (!trimmedCode) {
      setCode("");
      setCodeError("인증코드를 입력해주세요");
      hasError = true;
    } else if (trimmedCode !== MOCK_VERIFY_CODE) {
      setCode("");
      setCodeError("인증코드가 일치하지 않습니다");
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

    // TODO: 실제 회원가입 API 호출
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
            style={styles.verificationButton}
            onPress={handleVerifyEmail}
          >
            <Text style={styles.verificationButtonText}>인증</Text>
          </TouchableOpacity>
        </View>

        {/* 인증코드 */}
        <TextInput
          style={[
            styles.input,
            codeError ? { borderBottomColor: "#f36945" } : {},
          ]}
          fontFamily="Maplestory_Light"
          placeholder={codeError ? codeError : "인증코드"}
          placeholderTextColor={codeError ? "#f36945" : colors.brown}
          value={code}
          onChangeText={(text) => {
            setCode(text);
            if (codeError) setCodeError("");
          }}
        />

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
          placeholder={
            checkPasswordError ? checkPasswordError : "비밀번호 확인"
          }
          placeholderTextColor={
            checkPasswordError ? "#f36945" : colors.brown
          }
          secureTextEntry
          value={CheckPassword}
          onChangeText={(text) => {
            setCheckPassword(text);
            if (checkPasswordError) setCheckPasswordError("");
          }}
        />

        {/* 비밀번호 규칙 안내문*/}
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
        />
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
    paddingBottom: 50,
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
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  verificationButtonText: {
    fontSize: 12,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
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
});
