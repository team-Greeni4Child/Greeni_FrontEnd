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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [emailError, setEmailError] = useState("");
  const [codeError, setCodeError] = useState("");

  // 인증 버튼 클릭
  const handleVerifyEmail = () => {
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
    // 여기서 실제로는 인증코드 발송 API 호출
    // 테스트용으로는 아무것도 안 함
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

    // 여기서는 이미 인증을 했다고 가정하고,
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
              style={styles.verificationButton}
              onPress={handleVerifyEmail}
            >
              <Text 
                style={styles.verificationButtonText}>인증</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={[
              styles.code,
              codeError ? { borderBottomColor: "#f36945" } : {},
            ]}
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
  },
  email: {
    width: "75%",
    height: 35,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    paddingVertical: 8,
    color: colors.brown,
  },
  verificationButton:{
    //bottom: Platform.OS === "ios" ? 4 : -4,
    backgroundColor: colors.pink,
    borderRadius: 5,
    height: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  verificationButtonText:{
    fontSize: 12,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
  code: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
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
});
