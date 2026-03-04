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
  Modal,
} from "react-native";
import { StatusBar } from "react-native";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import { verifyParentPassword } from "../api/auth";
import { getAccessToken } from "../utils/tokenStorage";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function SettingsPasswordScreen({navigation}) {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 네트워크/서버 오류 모달
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 요청 중 중복 클릭 방지
  const [isVerifying, setIsVerifying] = useState(false);

  const handleErrorOk = () => {
    setShowErrorModal(false);
  };

  const validate = () => {
    setPasswordError("");
    let valid = true;

    const trimmedPw = password.trim();

    // 비밀번호 불일치
    if (!trimmedPw) {
      setPassword("");
      setPasswordError("비밀번호가 일치하지 않습니다");
      valid = false;
      return;
    }

    return valid;
  };

  const handlePassword = async () => {
    if (isVerifying) return;
    if (!validate()) return;

    const trimmedPw = password.trim();

    try {
      setIsVerifying(true);

      const accessToken = await getAccessToken();

      if (!accessToken) {
        console.log("NO_ACCESS_TOKEN");
        setShowErrorModal(true);
        return;
      }

      const res = await verifyParentPassword({
        accessToken,
        password: trimmedPw,
      });

      if (res?.code === "COMMON200") {
        navigation.replace("Settings");
        return;
      }

      // 예상치 못한 응답
      console.log("UNEXPECTED_RESPONSE:", res);
      setShowErrorModal(true);

    } catch (e) {
      console.log("PARENT PASSWORD VERIFY FAIL:", e);

      // 비밀번호 불일치
      if (e?.code === "MEMBER4007") {
        setPassword("");
        setPasswordError("비밀번호가 일치하지 않습니다");
        return;
      }

      // 그 외는 모달
      setShowErrorModal(true);
    } finally {
      setIsVerifying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPassword("");
      setPasswordError("");
      setShowErrorModal(false);
      setIsVerifying(false);
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
                        borderBottomColor: passwordError ? colors.red : colors.greenDark 
                      }
                    ]}
                    placeholder={passwordError ? passwordError : "비밀번호를 입력해주세요"}
                    placeholderTextColor={passwordError ? colors.red : colors.lightGrayPh}
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
                    disabled={password.length === 0 || isVerifying}
                />
            </View>

            {/* 네트워크/서버 오류 모달 */}
            <Modal transparent visible={showErrorModal}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalWrap}>
                        <Text style={styles.modalText}>
                            {"오류가 발생했습니다.\n잠시 후 다시 시도해주세요."}
                        </Text>

                        <View style={styles.modalButtonWrap}>
                            <TouchableOpacity style={[styles.modalButton]} onPress={handleErrorOk}>
                                <Text style={styles.modalButtonText}>확인</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
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
//</Modal>     fontSize: 14,
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