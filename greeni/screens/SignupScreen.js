// screens/SignUpScreen.js
import React, { useState } from "react";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
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

const AR = {
  greeni: 509 / 852,
};

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [CheckPassword, setCheckPassword] = useState("");

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <BackButton navigation={navigation} />

      {/* 입력 박스 */}
      <View style={styles.box}>
        <Text style={styles.title}>회원가입</Text>

        {/* 이메일 + 인증 버튼 */}
        <View style={styles.emailWrap}>
          <TextInput
            style={styles.email}
            placeholder="이메일"
            placeholderTextColor={colors.brown}
            value={email}
            onChangeText={setEmail}
          />
          <TouchableOpacity style={styles.verificationButton}>
            <Text style={styles.verificationButtonText}>인증</Text>
          </TouchableOpacity>
        </View>

        {/* 인증코드 */}
        <TextInput
          style={styles.input}
          placeholder="인증코드"
          placeholderTextColor={colors.brown}
          value={code}
          onChangeText={setCode}
        />

        {/* 비밀번호 */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          placeholderTextColor={colors.brown}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* 비밀번호 확인 */}
        <TextInput
          style={styles.input}
          placeholder="비밀번호 확인"
          placeholderTextColor={colors.brown}
          value={CheckPassword}
          onChangeText={setCheckPassword}
          secureTextEntry
        />
      </View>

      {/* 그리니 + 가입하기 버튼 */}
      <View style={styles.bottomWrap}>
        <Image
          source={require("../assets/images/greeni_shy.png")}
          style={styles.greeni}
          resizeMode="contain"
        />

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.submitButtonText}>가입하기</Text>
        </TouchableOpacity>
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
    fontSize: 14,
    paddingVertical: 8,
    color: colors.brown,
  },
  verificationButton:{
    bottom: Platform.OS === "ios" ? 4 : -4,
    backgroundColor: colors.pink,
    borderRadius: 5,
    height: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  verificationButtonText: {
    fontSize: 12,
    color: colors.brown,
  },
  input: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    fontSize: 14,
    paddingVertical: 8,
    marginBottom: 8,
    color: colors.brown,
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
  submitButton: {
    backgroundColor: colors.green,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: W * 0.1,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.brown,
  },
});
