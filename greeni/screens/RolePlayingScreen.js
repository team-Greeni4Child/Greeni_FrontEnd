import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ImageBackground
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import MicButton from "../components/MicButton";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function RolePlayingScreen({navigation}) {
    return (
        <View style={styles.root}>
            <StatusBar style="dark" />

             {/* 상단 뒤로가기 버튼 및 '역할놀이' 제목 */}
            <View style={styles.titleWrap}>
                <BackButton navigation={navigation}
                            top={H * 0.001}
                            left={W * 0.05}/>
                <Text style={styles.title}>역할놀이</Text>
            </View>

              {/*  */}
            <View style={styles.greeniWrap}>
              <Image
                style={styles.greeni}
                source={require("../assets/images/mustache_greeni_big.png")}/>
              <ImageBackground
                style={styles.bubble}
                source={require("../assets/images/bubble_role.png")}
              >
                <Text style={styles.bubbleText}>밑에 있는 세가지 상황 중에{"\n"} 하나를 골라줘</Text>
              </ImageBackground>
            </View>


            <View style={styles.situationWrap}>
              <Button title='가게 주인과 손님' backgroundColor={colors.white} borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51} style={{ marginBottom: 12 }}></Button>
              <Button title='선생님과 아이' backgroundColor={colors.white} borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51} style={{ marginBottom: 12 }}></Button>
              <Button title='친구 사이' backgroundColor={colors.white} borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51} style={{ marginBottom: 12 }}></Button>
            </View>


            <MicButton />
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

  titleWrap: {
    position: "absolute",
    alignItems: 'center',
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "KCC-Murukmuruk",
    color: colors.brown,
  },

  // 그리니가 말하는 부분을 감싸는 Wrapper
  greeniWrap: {
    position: 'absolute',
    flexDirection: 'column',
    top: H * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeni: {
    position: 'absolute',
    aspectRatio: 80/110,
    width:80,
    height: 110,
    top: -H * 0.002
  },
  bubble: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 230/120,
    width: 230,
    height: 120,
    top: H * 0.155,
  },
  bubbleText: {
    fontSize: 17,
    fontFamily: "WantedSans-Regular",
    color: colors.brown,
    textAlign: 'center',
    maxWidth : 270,
  },

  situationWrap: {
    position: 'absolute',
    top: H * 0.50,
  },
})