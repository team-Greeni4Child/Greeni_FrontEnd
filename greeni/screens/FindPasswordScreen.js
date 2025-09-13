import React, { useState } from "react";
import colors from "../theme/colors";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Dimensions 
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

// 원본 비율(레이아웃 안정화)
const AR = {
  greeni: 509 / 852
};

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      {/* 뒤로가기 버튼 */}
      <TouchableOpacity 
        onPress={() => navigation.goBack()} 
        style={styles.backButton}
      >
        <Image 
          source={require("../assets/images/back.png")} 
          style={styles.backIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 비밀번호 찾기 박스 */}
      <View style={styles.box}>
        <Text style={styles.title}>비밀번호 찾기</Text>

        {/* 이메일, 인증코드 입력 */}
        <View style={styles.inputsWrap}>
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

          <TextInput
            style={styles.code}
            placeholder="인증코드"
            placeholderTextColor={colors.brown}
            value={code}
            onChangeText={setCode}
          />
        </View>

        {/* 완료 버튼 */}
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>완료</Text>
        </TouchableOpacity>
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
    fontSize: 14,
    paddingVertical: 8,
    color: colors.brown,
  },
  verificationButton:{
    bottom: -4,
    backgroundColor: colors.pink,
    borderRadius: 5,
    height: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  verificationButtonText:{
    fontSize: 12,
    color: colors.brown,
  },
  code: {
    width: "100%",
    borderBottomWidth: 2,
    borderBottomColor: colors.greenDark,
    fontSize: 14,
    paddingVertical: 8,
    marginBottom: 8,
    color: colors.brown,
  },
  finishButton: {
    backgroundColor: colors.green,
    borderRadius: 10,
    width: "100%",
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  finishButtonText: {
    fontSize: 14,
    fontWeight: "700",
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
