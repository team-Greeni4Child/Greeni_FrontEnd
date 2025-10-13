import React, { useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity 
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
              <Image
                style={styles.bubble}
                source={require("../assets/images/bubble_role.png")}/>
              <Text style={styles.bubbleText}>밑에 있는 세가지 상황 중에 하나를 골라줘</Text>
            </View>


            <View style={styles.situationWrap}>
              <Button title='가게 주인과 손님' backgroundColor='#FFFFFF' borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51}></Button>
              <Button title='선생님과 아이' backgroundColor='#FFFFFF' borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51}></Button>
              <Button title='친구 사이' backgroundColor='#FFFFFF' borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51}></Button>
            </View>


            <MicButton />
        </View>
    )
}

const styles = StyleSheet.create({
  // 전체 화면, 아이템 세로 정렬, 가로세로 중앙 정렬, 배경색
  root: {
    flex: 1,
    flexDirection: 'column',
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory, 
  },

  // 뒤로가기 버튼과 제목을 감싸는 wrapper 
  // root 기준으로 정렬, 수평 중앙 정렬, colorToken 변경
  titleWrap: {
    position: "absolute",
    alignItems: 'center',
    top: H * 0.08,
    width: W,
  },
  // colorToken 변경
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.brown,
  },

  // 그리니가 말하는 부분을 감싸는 Wrapper
  greeniWrap: {
    position: 'absolute',
    flexDirection: 'column',
    top: H * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeni: {
    position: 'absolute',
    aspectRatio: 95/130,
    width: 94.72,
    height: 130,
    top: -H * 0.002
  },
  bubble: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    width: 302,
    height: 123,
    top: H * 0.155
  },
  bubbleText: {
    position: 'absolute',
    top: W * 0.47,
    width: 215,
    fontWeight: '500',
    fontSize: 20,
    color: colors.brown,
  },

  situationWrap: {
    position: 'absolute',
    top: H * 0.53,
  },
})