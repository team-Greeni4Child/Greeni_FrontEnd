import React, { useEffect, useState } from "react";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import { resetPassword } from "../api/auth";
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  Image, 
  Dimensions, 
  TouchableOpacity,
  Modal,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  greeni: 509 / 852,
};

// 비밀번호 규칙 (영문 + 숫자 + ASCII 특수문자 + 8자리 이상)
const passwordRule = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!-/:-@[-`{-~]).{8,}$/;

export default function ResetPasswordScreen({ navigation, route }) {
  // FindPasswordScreen에서 넘겨준 email
  const email = route?.params?.email ?? "";

  const [password, setPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [checkPasswordError, setCheckPasswordError] = useState("");
  const [ruleError, setRuleError] = useState(false); // 비밀번호 규칙 안내문 색상 용

  // 비밀번호 재설정 완료 모달 on/off
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // 네트워크/서버 오류 모달
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 확인 누르면 Login화면으로 돌아갈건가
  const [goLogin, setGoLogin] = useState(false);

  // 요청 중 중복 클릭 방지 (UI는 그대로, 로직만 차단)
  const [isResetting, setIsResetting] = useState(false);

  // 화면 진입 즉시 email 넘어왔는지 검사
  useEffect(() => {
    if (!route?.params?.email) {
      setGoLogin(true);
      setShowErrorModal(true);
    }
  }, []);

  const openErrorModal = (err) => {
    console.log(err?.message);
    setGoLogin(false);
    setShowErrorModal(true);
  };

  const handleErrorOk = () => {
    setShowErrorModal(false);

    // email 없는 경우
    if (goLogin) {
      setGoLogin(false);
      goLoginAndResetStack();
    }
  };

  const handleComplete = async () => {
    if (isResetting) return;

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

    try {
      setIsResetting(true);

      const res = await resetPassword({ email, password: trimmedPw });
      console.log("RESET PASSWORD OK:", res);

      // 성공 → 완료 모달 띄우기
      setShowCompleteModal(true);
    } catch (e) {
      console.log("RESET PASSWORD FAIL:", e);

      if (e?.code === "MEMBER4004") {
        // 존재하지 않는 메일
        setPasswordError("존재하지 않는 메일입니다");
        return;
      }

      // 비밀번호 찾기 검증을 안 하고 들어온 경우 → 모달 띄운 후 Login으로 이동
      if (e?.code === "MEMBER4005") {
        setGoLogin(true);
        setShowErrorModal(true);
        return;
      }

      // 그 외(네트워크/서버 오류 등) => 모달
      openErrorModal(e);
    } finally {
      setIsResetting(false);
    }
  };

  // 모달에서 확인 버튼 누르면 로그인 화면으로 이동
  const handleCompleteOk = () => {
    setShowCompleteModal(false);
    goLoginAndResetStack();
  };

  const goLoginAndResetStack = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      {/* 뒤로가기 버튼 */}
      <BackButton navigation={{ ...navigation, goBack: goLoginAndResetStack }} />

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
          disabled={isResetting}
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

      {/*비밀번호 재설정 완료 모달 */}
      <Modal
        transparent
        visible={showCompleteModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              비밀번호가 재설정되었습니다.
            </Text>

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

      {/* 오류 모달 */}
      <Modal transparent visible={showErrorModal}>
        <View style={styles.modalBackground}>
          <View style={styles.modalWrap}>
            <Text style={styles.modalText}>
              {"오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
            </Text>

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
