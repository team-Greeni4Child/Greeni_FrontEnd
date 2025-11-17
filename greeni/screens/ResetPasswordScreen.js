import React, { useState } from "react";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  Dimensions, 
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  greeni: 509 / 852,
};

// 비밀번호 규칙 (영문 + 숫자 + ASCII 특수문자 + 8자리 이상)
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!-/:-@[-`{-~]).{8,}$/;

export default function ResetPasswordScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");
  const [ruleError, setRuleError] = useState(false); // 비밀번호 규칙 안내문 색상 용

  const handleComplete = () => {
    setPasswordError("");
    setCheckPasswordError("");
    setRuleError(false);

    const trimmedPw = password.trim();
    const trimmedCheckPw = checkPassword.trim();

    let hasError = false;
    let shouldValidateCheckPw = true; // 비밀번호 규칙에 걸리면 false

    // 1) 비밀번호 검사
    if (!trimmedPw) {
      // 공란
      setPassword("");
      setPasswordError("비밀번호를 입력해주세요");
      hasError = true;
    } else if (!passwordRule.test(trimmedPw)) {
      // 규칙 위반 
      setPassword("");
      setCheckPassword("");
      setRuleError(true);     
      hasError = true;
      shouldValidateCheckPw = false; // 비밀번호 확인 관련 에러 막기
    }

    // 2) 비밀번호 확인 검사 (규칙 통과한 경우에만)
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

    // 에러 있으면 종료
    if (hasError) return;

    // 성공 → 로그인 화면으로 이동
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      {/* 뒤로가기 버튼 */}
      <BackButton navigation={navigation} />

      {/* 비밀번호 재설정 박스 */}
      <View style={styles.box}>
        <Text style={styles.title}>비밀번호 재설정</Text>

        <View style={styles.inputsWrap}>
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
            value={checkPassword}
            onChangeText={(text) => {
              setCheckPassword(text);
              if (checkPasswordError) setCheckPasswordError("");
            }}
          />

          {/* 비밀번호 규칙 안내문 (기본 갈색, 규칙 위반 시 빨간색) */}
          <Text
            style={[
              styles.ruleText,
              ruleError
                ? { color: "#f36945", fontFamily: "Maplestory_Bold" }
                : { fontFamily: "Maplestory_Light" },
            ]}
          >
            ※ 영문, 숫자, 특수문자 포함 8자리 이상 입력해야 합니다.
          </Text>
        </View>

        {/* 완료 버튼 */}
        <Button
          title="완료"
          width="100%"
          height={46}
          borderRadius={10}
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
    height: 25,
    verticalAlign: "bottom",
    marginLeft: 5,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
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
