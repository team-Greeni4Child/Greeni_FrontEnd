import React, { useState, useContext } from "react";
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  Dimensions, 
} from "react-native";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";

import { ProfileContext } from "../context/ProfileContext";

// 현재 기기의 화면 너비 W, 화면 높이 H
const { width: W, height: H } = Dimensions.get("window");

export default function SettingsScreen({route, navigation}) {

    const { profiles, setProfiles } = useContext(ProfileContext);
    const [selectedImage, setSelectedImage] = useState(route.params?.selectedImage || null);

    return (
        <View style={styles.root}>
            <View style={styles.topBackground}>

                {/* 상단 뒤로가기 버튼 및 '역할놀이' 제목 */}
                <View style={styles.titleWrap}>
                    <BackButton navigation={navigation}
                                top={H * 0.001}
                                left={W * 0.05}/>
                    <Text style={styles.title}>설정</Text>
                </View>

                {/* 프로필 이미지 */}
                <View style={styles.profileWrap}>
                  <View style={styles.profile}>
                    <View style={styles.imageWrap}>
                      <Image style={styles.image} source={require("../assets/images/basic_greeni_pink.png")}/>
                      <Image style={styles.editIcon} source={require("../assets/images/edit_icon.png")}/>
                    </View>
                  </View>
                  <View style={styles.profileInfo}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLalbe}>이름</Text>
                      <Text style={styles.infoValue}>김 그리니</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLalbe}>생년월일</Text>
                      <Text style={styles.infoValue}>2002.11.28</Text>
                    </View>
                  </View>
                </View>


                <View style={styles.optionWrap}>
                    <Button 
                        title='부모페이지 가기' 
                        backgroundColor={colors.ivory} 
                        borderRadius={10} 
                        borderWidth={2} 
                        borderColor={colors.pinkDark} 
                        width={345} 
                        height={51} 
                        style={{ marginBottom: 12 }}
                        onPress={() => navigation.navigate("ParentsPage")}
                    />
                    <Button 
                        title='프로필 전환' 
                        backgroundColor={colors.ivory} 
                        borderRadius={10} 
                        borderWidth={2} 
                        borderColor={colors.pinkDark} 
                        width={345} 
                        height={51} 
                        style={{ marginBottom: 12 }}
                    />
                    <Button 
                        title='프로필 삭제' 
                        backgroundColor={colors.ivory} 
                        borderRadius={10} 
                        borderWidth={2} 
                        borderColor={colors.pinkDark} 
                        width={345} 
                        height={51} 
                        style={{ marginBottom: 12 }}
                    />
                    <Button 
                        title='로그아웃' 
                        backgroundColor={colors.ivory} 
                        borderRadius={10} 
                        borderWidth={2} 
                        borderColor={colors.pinkDark} 
                        width={345} 
                        height={51} 
                        style={{ marginBottom: 12 }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
    alignItems: "center",
  },
  topBackground: {
    width: W,
    height: H * 0.82,
    backgroundColor: colors.pink,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: H * 0.08,
  },

  titleWrap: {
    alignItems: "center",
    marginBottom: 30,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "KCC-Murukmuruk",
    color: colors.brown,
  },

  profileWrap: {
    alignItems: "center",
    marginBottom: 40,
  },
  profile: {
    width: 104,
    height: 104,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  imageWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 104,
    height: 104,
    borderRadius: 52,
    resizeMode: "cover",
  },
  editIcon: {
    aspectRatio: 1,
    width: 17.5,
    height: 17.5,
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
  profileInfo: {
    width: 345,
    height: 115,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
  },
  infoRow: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoLabel: {
    color: colors.brown,
    fontSize: 16,
  },
  infoValue: {
    color: colors.brown,
    fontSize: 16
  },
  profileText: {
    fontFamily: "WantedSans-Regular",
    color: colors.brown,
  },

  optionWrap: {
    alignItems: "center",
  },
});