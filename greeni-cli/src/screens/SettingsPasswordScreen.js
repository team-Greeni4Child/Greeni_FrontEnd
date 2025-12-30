import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text,
  TextInput, 
  Image, 
  StyleSheet, 
  Dimensions, 
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "react-native";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import { useFocusEffect } from "@react-navigation/native";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

// 임시: 가입된 이메일/비밀번호 목록 (나중에 API 연동 시 수정)
const MOCK_USERS = {
  "pputtymin@gmail.com": "minseo2002.",
  "aaa": "aaa",
};

export default function SettingsPasswordScreen({navigation}) {

    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const validate = () => {
      setPasswordError("");
      let valid = true;
      const registeredPassword = "aaa";

      if (registeredPassword !== password) {
        setPassword("");
        setPasswordError("비밀번호가 일치하지 않습니다");
        valid = false;
        return;
      }

      return valid;
    };

    const handlePassword = () => {
      if (!validate()) return;
      navigation.navigate("Settings", { password })
    }

    useFocusEffect(
      useCallback(() => {
        setPassword("");
      }, [])
    );

    // return (
    //     <View style={styles.root}>
    //         <StatusBar style="dark-content" />

    //         {/* 상단 뒤로가기 버튼 */}
    //         <BackButton navigation={navigation} />

    //         {/* 그리니 말풍선 */}
    //         <View style={styles.greeniWrap}>
    //           <ImageBackground
    //             style={styles.bubble}
    //             source={require("../assets/images/bubble_settingspassword.png")}
    //           >
    //             <Text style={styles.bubbleText}>여기서부터는 보호자만{"\n"} 볼 수 있어요!</Text>
    //           </ImageBackground>
    //           <Image
    //             style={styles.greeni}
    //             source={require("../assets/images/settings_greeni_big.png")}/>
    //         </View>

    //         {/* 비밀번호 찾기 */}
    //         <View style={styles.linkWrap}>
    //           <TouchableOpacity 
    //             style={styles.linkButton}
    //             onPress={() => navigation.navigate("FindPassword")}
    //           >
    //             <Text style={styles.linkText}>비밀번호 찾기   {'>'}</Text>
    //           </TouchableOpacity>
    //         </View>

    //         {/* 비밀번호 입력 */}
    //         <View style={styles.inputWrap}>
    //             <TextInput
    //                 style={[styles.input,
    //                   {
    //                     borderBottomColor: passwordError ? '#f36945' : colors.greenDark 
    //                   }
    //                 ]}
    //                 placeholder={passwordError ? passwordError : "비밀번호를 입력해주세요"}
    //                 placeholderTextColor={passwordError ? "#f36945" : "#999"}
    //                 secureTextEntry
    //                 value={password}
    //                 onChangeText={(text) => {
    //                   setPassword(text);
    //                 }}
    //                 onPressIn={() => setPasswordError("")}
    //             />
    //         </View>

    //         {/* 다음 버튼 */}
    //         <View style={styles.bottomWrap}>
    //             <Button
    //                 title="다음"
    //                 onPress={handlePassword}
    //                 icon={require("../assets/images/next.png")}
    //                 disabled={password.length === 0}
    //             />
    //         </View>
    //     </View>
    // )




    return (
        <View style={styles.root}>
            <StatusBar style="dark-content" />

            {/* 상단 뒤로가기 버튼 */}
            <BackButton navigation={navigation} />

            {/* 그리니 말풍선 */}
            <View style={styles.greeniWrap}>
              <ImageBackground
                style={styles.bubble}
                source={require("../assets/images/bubble_settingspassword.png")}
              >
                <Text style={styles.bubbleText}>여기서부터는 보호자만{"\n"} 볼 수 있어요!</Text>
              </ImageBackground>
              <View style={styles.greeniRow}>
                <Image
                  style={styles.greeni}
                  source={require("../assets/images/settings_greeni_big.png")}/>
                {/* 비밀번호 찾기 */}
            
                <TouchableOpacity 
                  style={styles.findPasswordBtn}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate("FindPassword")}
                >
                  <Text style={styles.findPasswordBtnText}>비밀번호 찾기   {'>'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputWrap}>
                <TextInput
                    style={[styles.input,
                      {
                        borderBottomColor: passwordError ? '#f36945' : colors.greenDark 
                      }
                    ]}
                    placeholder={passwordError ? passwordError : "비밀번호를 입력해주세요"}
                    placeholderTextColor={passwordError ? "#f36945" : "#999"}
                    secureTextEntry
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                    }}
                    onPressIn={() => setPasswordError("")}
                />
            </View>

            {/* 다음 버튼 */}
            <View style={styles.bottomWrap}>
                <Button
                    title="다음"
                    onPress={handlePassword}
                    icon={require("../assets/images/next.png")}
                    disabled={password.length === 0}
                />
            </View>
        </View>
    )
}

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     flexDirection: 'column',
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: colors.ivory, 
//   },

//   greeniWrap: {
//     position: 'absolute',
//     flexDirection: 'column',
//     top: H * 0.17,
//     justifyContent: 'center',
//     alignItems: 'flex-start',
//   },
//   greeni: {
//     aspectRatio: 90/125,
//     width: 90,
//     height: 125,
//   },
//   bubble: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     aspectRatio: 230/120,
//     width: 230,
//     height: 120,
//     marginLeft: 40,
//   },
//   bubbleText: {
//     fontSize: 24,
//     fontFamily: "gangwongyoyuksaeeum",
//     color: colors.brown,
//     textAlign: 'center',
//     maxWidth : 270,
//   },

//   inputWrap: {
//     position: 'absolute',
//     top: H * 0.50,
//     width: W,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   input: {
//     fontSize: 14,
//     fontFamily: "Maplestory_Light",
//     height: 40,
//     letterSpacing: -0.32,
//     width: 258,
//     paddingBottom: 5,
//     paddingTop: 12,
//     borderBottomColor: colors.greenDark,
//     borderBottomWidth: 2,
//   },

//   bottomWrap: {
//     position: "absolute",
//     width: W,
//     bottom: H * 0.15,
//     flexDirection: "row",
//     justifyContent: "flex-end",
//     alignItems: "center",
//     paddingRight: W * 0.15,
//   },


//   // linkWrap: {
//   //   flexDirection: "column", 
//   //   justifyContent: "flex-end",
//   //   height: H * 0.2,
//   // },
//   // linkButton: {
//   //   borderWidth: 2,
//   //   borderColor: colors.greenDark,
//   //   backgroundColor: colors.white,
//   //   borderRadius: 21,
//   //   paddingVertical: 5,
//   //   paddingHorizontal: 20,
//   //   marginTop: H * 0.03,
//   //   alignItems: "center",
//   // },
//   // linkText: {
//   //   color: colors.brown,
//   //   fontSize: 16,
//   //   fontFamily: "Maplestory_Light",
//   // },
// })


const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory, 
  },

  greeniWrap: {
    position: 'absolute',
    flexDirection: 'column',
    top: H * 0.17,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  greeniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  greeni: {
    aspectRatio: 90/125,
    width: 90,
    height: 125,
  },
  bubble: {
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 230/120,
    width: 230,
    height: 120,
    marginLeft: 40,
  },
  bubbleText: {
    fontSize: 24,
    fontFamily: "gangwongyoyuksaeeum",
    color: colors.brown,
    textAlign: 'center',
    maxWidth : 270,
  },

  inputWrap: {
    position: 'absolute',
    top: H * 0.50,
    width: W,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    height: 40,
    letterSpacing: -0.32,
    width: 258,
    paddingBottom: 5,
    paddingTop: 12,
    borderBottomColor: colors.greenDark,
    borderBottomWidth: 2,
  },

  bottomWrap: {
    position: "absolute",
    width: W,
    bottom: H * 0.15,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingRight: W * 0.15,
  },


  findPasswordBtn: {
    borderWidth: 2,
    borderColor: colors.greenDark,
    backgroundColor: colors.white,
    borderRadius: 21,
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: H * 0.1,
    alignItems: "center",
    justifyContent: 'center',
    marginLeft: 14
  },
  findPasswordBtnText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
})