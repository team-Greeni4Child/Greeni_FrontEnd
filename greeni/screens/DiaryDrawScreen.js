// screens/DiaryDrawScreen.js
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import colors from "../theme/colors";
import BackButton from "../components/BackButton";
import Button from "../components/Button";

const { width: W, height: H } = Dimensions.get("window");

export default function DiaryDrawScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <BackButton navigation={navigation} />    

        {/* 제목 */}
        <Text style={styles.title}>일기쓰기</Text>

        {/* 도구 아이콘 영역 */}
        <View style={styles.tools}>
          <TouchableOpacity>
            <Image
              source={require("../assets/images/icon_pen.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("../assets/images/icon_eraser.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={require("../assets/images/icon_photo.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 그림 영역 (지금은 빈 공간) */}
      <View style={styles.drawArea} />

      {/* 저장 버튼 */}
      <View style={styles.bottomWrap}>
        <Button 
          title="저장하기" 
          width={130}
          backgroundColor={colors.greenLight} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  topBar: {
    backgroundColor: colors.pink,
    height: 180,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "start",
    paddingTop: 80,
  },
  title: {
    fontFamily: "KCC-Murukmuruk",
    fontSize: 24,
    color: colors.brown,
  },
  tools: {
    flexDirection: "row",
    marginTop: 76 * 0.2, 
    gap: W * 0.2,
  },
  icon: {
    width: W * 0.07,
    height: W * 0.07,
  },
  drawArea: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
  bottomWrap: {
    alignItems: "center",
    marginBottom: H * 0.05,
  },
});
