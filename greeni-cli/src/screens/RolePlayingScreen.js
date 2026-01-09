import React, { useState, useMemo } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ImageBackground
} from "react-native";
import { StatusBar } from "react-native";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";
import MicButton from "../components/MicButton";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function RolePlayingScreen({navigation}) {

  const [selectedSituation, setSelectedSituation] = useState(null);
  const bubbleText = useMemo(() => {
    if (!selectedSituation) {
      return `밑에 있는 세가지 상황 중에\n하나를 골라줘`;
    }
    if (selectedSituation === "shop") return '어서 오세요.\n신선 과일가게입니다!';
    if (selectedSituation === "teacher") return '안녕!\n오늘은 선생님과 이야기해보자.';
    if (selectedSituation === "friend") return '만나서 반가워!\n나랑 같이 놀자~';
  }, [selectedSituation]);

  const handleSituation = (key) => {
    setSelectedSituation(key);
  };

    return (
        <View style={styles.root}>
          <View style={styles.topBackground} />

             {/* 상단 뒤로가기 버튼 및 '역할놀이' 제목 */}
            <View style={styles.titleWrap}>
                <BackButton navigation={navigation}
                            top={H * 0.001}
                            left={W * 0.05}/>
                <Text style={styles.title}>역할놀이</Text>
            </View>

              {/*  */}
            <View style={[styles.greeniWrap,
              selectedSituation ? styles.greeniWrapSelected : styles.greeniWrap,
            ]}>
              <ImageBackground
                style={[styles.bubble,
                  selectedSituation ? styles.bubbleSelected : styles.bubble
                ]}
                source={require("../assets/images/bubble_diary.png")}
                resizeMode="stretch"
              >
                <Text style={[styles.bubbleText.
                  selectedSituation ? styles.bubbleTextSelected : styles.bubbleText
                ]}>{bubbleText}</Text>
              </ImageBackground>
              <Image
                style={[styles.greeni,
                  selectedSituation ? styles.greeniSelected : styles.greeni
                ]}
                source={require("../assets/images/mustache_greeni_big.png")}/>
            </View>

            {!selectedSituation && (
              <View style={styles.situationWrap}>
              <Button title='가게 주인과 손님' backgroundColor={colors.white} borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51} style={{ marginBottom: 12 }} onPress={() => handleSituation("shop")}></Button>
              <Button title='선생님과 아이' backgroundColor={colors.white} borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51} style={{ marginBottom: 12 }} onPress={() => handleSituation("teacher")}></Button>
              <Button title='친구 사이' backgroundColor={colors.white} borderRadius={10} borderWidth={2} borderColor={colors.greenDark} width={345} height={51} style={{ marginBottom: 12 }} onPress={() => handleSituation("friend")}></Button>
            </View>
            )}


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
  topBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: H * 0.14,
    backgroundColor: colors.pink, 
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  titleWrap: {
    position: "absolute",
    alignItems: 'center',
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  // 그리니가 말하는 부분을 감싸는 Wrapper
  greeniWrap: {
    position: 'absolute',
    top: H * 0.17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeniWrapSelected: {
    top: H * 0.20,
  },
  bubble: {
    maxWidth: W * 0.85, 
    paddingHorizontal: 40,
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  bubbleSelected: {
    paddingHorizontal: 40,
    paddingVertical: 50,
    marginTop: 30
  },
  bubbleText: {
    fontSize: 28,
    color: colors.brown,
    fontFamily: "gangwongyoyuksaeeum",
    textAlign: "center",
    lineHeight: 26,
  },
  bubbleTextSelected: {
    fontSize: 20,
    lineHeight: 24,
  },
  greeni: {
    aspectRatio: 80/110,
    width:80,
    height: 110,
  },
  greeniSelected: {
    aspectRatio: 120/165,
    width: 120,
    height: 165,
    marginTop: 20,
  },

  situationWrap: {
    position: 'absolute',
    bottom: H * 0.26,
  },
})