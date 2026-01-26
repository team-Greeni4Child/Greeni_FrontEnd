import React, { useState, useContext } from "react";
import colors from "../theme/colors";
import { AuthContext } from "../App"; 
import Button from "../components/Button";
import { login } from "../api/auth";
import { saveAuth } from "../utils/tokenStorage";
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

// 원본 비율(레이아웃 안정화)
const AR = {
  greeni: 509 / 852
};

// 이메일 형식 검증 (기본)
const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 에러 상태
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { setStep } = useContext(AuthContext);

  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    // 연타 막기
    if (isLoggingIn) return;

    // 이전 에러 초기화
    setEmailError("");
    setPasswordError("");

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    let hasError = false;

    // 이메일 미입력
    if (!trimmedEmail) {
      setEmail(""); // 입력값 비우기
      setEmailError("이메일을 입력해주세요");
      hasError = true;
    }

    // 이메일 형식 오류
    else if (!emailRule.test(trimmedEmail)) {
      setEmail("");
      setEmailError("이메일 형식이 올바르지 않습니다");
      hasError = true;
    }

    // 비밀번호 미입력
    if (!trimmedPassword) {
      setPassword("");
      setPasswordError("비밀번호를 입력해주세요");
      hasError = true;
    }

    // 이메일이나 비밀번호가 비어있으면 여기서 종료
    if (hasError) return;

    try {
      setIsLoggingIn(true);
      console.log("LOGIN REQUEST:", { email: trimmedEmail });

      // 1) 로그인 API 호출
      const res = await login({ email: trimmedEmail, password: trimmedPassword });

      // 2) accessToken: 헤더 authorization에서 꺼내기
      const authorization = res?.headers?.authorization; // "Bearer xxx"
      const accessToken = authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length)
        : authorization;

      // 3) refreshToken/memberId: body(result)에서 꺼내기
      const refreshToken = res?.result?.refreshToken;
      const memberId = res?.result?.memberId;

      console.log("LOGIN OK:", {
        memberId,
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });

      // 방어코드: 토큰이 없으면 로그인 성공 처리하면 안 됨
      if (!accessToken || !refreshToken) {
        // 서버/프록시/CORS 설정 문제 가능성
        setPasswordError("로그인 응답 토큰을 확인할 수 없습니다.");
        return;
      }

      // 4) 저장
      await saveAuth({ accessToken, refreshToken, memberId });

      console.log("LOGIN SAVE TOKEN OK:", { memberId });

      // 5) 다음 단계로 이동
      setStep("profile");
    } catch (e) {
      console.log("LOGIN FAIL:", e);

      const code = e?.code;

      if (code === "MEMBER4004") {
        setEmail("");
        setPassword("");
        setEmailError("가입되지 않은 이메일입니다");
        return;
      }

      if (code === "MEMBER4007") {
        setPassword("");
        setPasswordError("비밀번호가 일치하지 않습니다");
        return;
      }

      // // 그 외(네트워크/서버 오류 등) => 모달
      console.log(e?.message || "로그인에 실패했습니다");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      {/* 로그인 박스 */}
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>로그인</Text>

        {/* 이메일, 비밀번호 입력 */}
        <View style={styles.inputsWrap}>
          <TextInput
            style={[
              styles.input,
              emailError ? { borderBottomColor: "#f36945" } : {},
            ]}
            fontFamily="Maplestory_Light"
            placeholder={emailError ? emailError : "이메일"}
            placeholderTextColor={emailError ? "#f36945" : colors.brown}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError("");
            }}
            autoCapitalize="none"
          />
          <TextInput
            style={[
              styles.input,
              passwordError ? { borderBottomColor: "#f36945" } : {},
            ]}
            fontFamily="Maplestory_Light"
            placeholder={passwordError ? passwordError : "비밀번호"}
            placeholderTextColor={passwordError ? "#f36945" : colors.brown}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError("");
            }}
            secureTextEntry
          />
        </View>

        {/* 로그인 버튼 */}
        <Button
          title="로그인"
          width="100%"
          height={46}
          borderRadius={10}
          fontSize={14}
          onPress={handleLogin}
        />
      </View>   

      <View style={styles.bottomWrap}>
        {/* 그리니 */}
        <Image 
          source={require("../assets/images/greeni_shy.png")} 
          style={styles.greeni}
          resizeMode="contain"
        />

        {/* 비밀번호 찾기, 회원가입 하기 */}
        <View style={styles.linkWrap}>
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate("FindPassword")}
          >
            <Text style={styles.linkText}>비밀번호 찾기   {'>'}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate("Signup")}
          >
            <Text style={styles.linkText}>회원가입 하기   {'>'}</Text>
          </TouchableOpacity>
        </View>
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
  loginBox: {
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
  loginTitle: {
    fontFamily: "Maplestory_Bold",
    fontSize: 24,
    color: colors.brown,
    textAlign: "center",
  },
  inputsWrap: {
    alignItems: "stretch",        
  },
  input: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    fontFamily: "Maplestory_Light",
    fontSize: 14,
    paddingVertical: 8,
    marginBottom: 8,
    color: colors.brown,
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
  linkWrap: {
    flexDirection: "column", 
    justifyContent: "flex-end",
    height: H * 0.2,
  },
  linkButton: {
    borderWidth: 2,
    borderColor: colors.greenDark,
    backgroundColor: colors.white,
    borderRadius: 21,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: H * 0.03,
    alignItems: "center",
  },
  linkText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
});
