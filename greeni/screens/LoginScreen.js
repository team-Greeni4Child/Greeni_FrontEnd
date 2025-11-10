import React, { useState, useContext } from "react";
import colors from "../theme/colors";
import { AuthContext } from "../App"; 
import Button from "../components/Button";
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
  const [password, setPassword] = useState("");
  const {setStep} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.topBackground} />

      {/* 로그인 박스 */}
      <View style={styles.loginBox}>
        <Text style={styles.loginTitle}>로그인</Text>

        {/* 이메일, 비밀번호 입력 */}
        <View style={styles.inputsWrap}>
            <TextInput
            style={styles.input}
            placeholder="이메일"
            placeholderTextColor={colors.brown}
            value={email}
            onChangeText={setEmail}
            />
            <TextInput
            style={styles.input}
            placeholder="비밀번호"
            placeholderTextColor={colors.brown}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            />
        </View>

        {/* 로그인 버튼 */}
        <Button
          title="로그인"
          width="100%"
          height={46}
          borderRadius= {10}
          fontSize={14}
          onPress={() => setStep("profile")}
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
