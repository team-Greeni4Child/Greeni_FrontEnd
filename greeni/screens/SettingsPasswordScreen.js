import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text,
  TextInput, 
  Image, 
  StyleSheet, 
  Dimensions, 
  ImageBackground
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import { useFocusEffect } from "@react-navigation/native";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function SettingsPasswordScreen({navigation}) {

    const [password, setPassword] = useState("");

    useFocusEffect(
      useCallback(() => {
        setPassword("");
      }, [])
    );

    return (
        <View style={styles.root}>
            <StatusBar style="dark" />

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
              <Image
                style={styles.greeni}
                source={require("../assets/images/settings_greeni_big.png")}/>
            </View>

            {/* 비밀번호 입력 */}
            <View style={styles.inputWrap}>
                <TextInput
                    style={[styles.input]}
                    placeholder={"비밀번호"}
                    placeholderTextColor={"#999"}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
            </View>

            {/* 다음 버튼 */}
            <View style={styles.bottomWrap}>
                <Button
                    title="다음"
                    onPress={() => navigation.navigate("Settings", { password })}
                    icon={require("../assets/images/next.png")}
                    disabled={password.length === 0}
                />
            </View>
        </View>
    )
}

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
})