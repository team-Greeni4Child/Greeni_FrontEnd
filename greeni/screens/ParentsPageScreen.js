import React, { useState, useContext, useEffect } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  ImageBackground
} from "react-native";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";

import { ProfileContext } from "../context/ProfileContext";
import { BottomTabs } from "react-native-screens";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function ParentsPageScreen({route, navigation}) {

    const [today, setToday] = useState("");

    useEffect(() => {
      const date = new Date();
      const formatted = `${date.getMonth() + 1}월 ${date.getDate()}일`;
      setToday(formatted);
    }, []);

    const { profiles, setProfiles } = useContext(ProfileContext);
    const [selectedImage, setSelectedImage] = useState(route.params?.selectedImage || null);

    return (
        <View style={styles.root}>

            {/* 상단 뒤로가기 버튼 및 '부모페이지' 제목 */}
            <View style={styles.titleWrap}>
                <BackButton navigation={navigation}
                    top={H * 0.001}
                    left={W * 0.05}/>
                <Text style={styles.title}>부모페이지</Text>
            </View>

            {/* 부모페이지 섹션 */}
            <View style={styles.parentsPageWrap}>
              <View style={styles.topSection}>

                <View style={styles.topLeftWrap}>

                  {/* 프로필 영역 */}
                  <View style={styles.profile}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        width: '90%',
                        height: '90%',
                        borderWidth: 3,
                        borderColor: colors.greenDark,
                        borderRadius: 15,
                        backgroundColor: colors.white,
                        paddingHorizontal: 16
                      }}
                    >
                      <Image
                        source={require("../assets/images/basic_greeni_pink.png")}
                        style={{
                          width: '50%',
                          height: '70%',
                          borderRadius: 30,
                          marginRight: 16
                        }}
                      />
                      <Text
                        style={{
                          width: '50%',
                          fontFamily: 'WantedSans-SemiBold',
                          fontSize: 15,
                          color: colors.brown
                        }}
                      >
                        김 그리니
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* 배지 영역 */}
                  <View style={styles.badge}>
                    <TouchableOpacity
                      style={styles.badgeButton}
                    >
                      <View style={styles.badgeHeader}>
                        <Text style={styles.badgeTitle}>활동배지</Text>
                        <Image
                          source={require("../assets/images/next_arrow.png")}
                          style={styles.nextArrow}
                        />
                      </View>
                      <View style={styles.badgeIconsRow}>
                        
                      </View>
                      <View style={styles.badgeFooter}>
                        <Text style={styles.badgeDescription}>
                          퀴즈 배지 획득
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 일기 영역 */}
                <View style={styles.topRightWrap}>
                  <TouchableOpacity style={styles.dairyButton}>
                    <View style={styles.dairyHeader}>
                      <Text style={styles.dateText}>{today}</Text>
                      <Image
                        source={require("../assets/images/next_arrow.png")}
                        style={styles.nextArrow}
                      />
                    </View>
                    <View style={styles.diary}>

                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {/* 활동 요약 영역 */}
              <View style={styles.bottomWrap}>
                <TouchableOpacity style={styles.summaryButton}>
                  <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle}>활동 요약</Text>
                     <Image
                        source={require("../assets/images/next_arrow.png")}
                        style={styles.nextArrow}
                      />
                  </View>
                  <View style={styles.summaryFooter}>

                  </View>
                </TouchableOpacity>
              </View>
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

  titleWrap: {
    alignItems: "center",
    marginBottom: 30,
    width: W,
    top: H * 0.03,
  },
  title: {
    fontSize: 28,
    fontFamily: "KCC-Murukmuruk",
    color: colors.brown,
  },

  parentsPageWrap: {
    width: W,
    height: H * 0.82,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '90%',
    height: '50%',
  },
  topLeftWrap: {
    flex: 1,
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    width: '100%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    width: '100%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeButton: {
    width: '90%',
    height: '90%',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.greenDark,
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  badgeTitle: {
    fontFamily: 'WantedSans-SemiBold',
    fontSize: 18,
    color: colors.brown
  },
  nextArrow: {
    width: 18,
    height: 18,
    resizeMode: 'contain'
  },
  badgeIconsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8
  },
  badgeIcon: {

  },
  badgeFooter: {
    alignItems: 'center',
  },
  badgeDescription: {
    fontFamily: 'WantedSans-Regular',
    fontSize: 14,
    color: colors.brown,
    textAlign: 'center'
  },

  topRightWrap: {
    flex: 1,
    flexDirection: 'column',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dairyButton: {
    width: '90%',
    height: '94%',
    borderWidth: 3,
    borderColor: colors.greenDark,
    borderRadius: 15,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: "center",
  },
  dairyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center'
  },
  dateText: {
    fontFamily: 'WantedSans-SemiBold',
    fontSize: 18,
    color: colors.brown
  },


  bottomWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '50%',
    // borderWidth: 2,
    // borderColor: 'purple'
  },
  summaryButton: {
    width: "94%",
    height: "90%",
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.greenDark,
    backgroundColor: colors.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  summaryTitle: {
    fontFamily: "WantedSans-SemiBold",
    fontSize: 18,
    color: colors.brown,
    marginRight: 6
  },
});