import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { StatusBar } from "react-native";
import { AuthContext } from "../App";
import { ProfileContext } from "../context/ProfileContext";
import { searchProfileList, searchSingleProfile } from "../api/profile";
import { toImageSource } from "../utils/profileImageMap";
import { saveSelectedProfile, clearAuth, clearSelectedProfile } from "../utils/tokenStorage";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");
const MAX_PROFILES = 6;

export default function ProfileSelectScreen({ route, navigation }) {
  const { profiles, setProfiles, setSelectedProfile } = useContext(ProfileContext);
  const { step, setStep } = useContext(AuthContext);

  const [isSelecting, setIsSelecting] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const goNext = () => {
    if (step === "main") {
      navigation.reset({
        index: 0,
        routes: [{ name: "Home" }],
      });
    } else {
      setStep("main");
    }
  };

  const goAuthAndReset = async () => {
    try {
      await clearAuth();
      await clearSelectedProfile();
    } catch (err) {
      console.log("CLEAR AUTH FAIL:", err);
    } finally {
      setSelectedProfile(null);
      setProfiles([]);
      setStep("auth");
    }
  };

  const isAuthError = e => {
    return (
      e?.status === 401 ||
      e?.code === "AUTH401" ||
      e?.code === "COMMON401" ||
      e?.message?.includes("인증") ||
      e?.message?.includes("로그인") ||
      e?.message?.includes("토큰")
    );
  };

  const handleSelectProfile = async p => {
    if (isSelecting) return;

    try {
      setIsSelecting(true);

      const res = await searchSingleProfile(p.profileId);
      const detail = res?.result;

      const selected = detail
        ? {
            ...detail,
            image: toImageSource(detail.profileImage),
          }
        : {
            ...p,
            image: toImageSource(p.profileImage),
          };

      if (!detail) {
        console.log("Select Profile Fallback: detail not found");
      }

      setSelectedProfile(selected);
      await saveSelectedProfile(selected);
      console.log("pressed profile", p.profileId);
      goNext();
    } catch (e) {
      console.log("Select Profile Fail:", e);

      if (isAuthError(e)) {
        await goAuthAndReset();
        return;
      }

      const fallbackSelected = {
        ...p,
        image: toImageSource(p.profileImage),
      };
      setSelectedProfile(fallbackSelected);
      await saveSelectedProfile(fallbackSelected);
      goNext();
    } finally {
      setIsSelecting(false);
    }
  };

  const handleLogout = async () => {
    try {
      {
        /* 로그아웃 api 수정 완료되면 주석 풀기 */
      }
      // await logout();
    } catch (e) {
      console.log("Logout Fail:", e);
    } finally {
      await clearAuth();
      await clearSelectedProfile();
      setLogoutModalVisible(false);
      setSelectedProfile(null);
      setProfiles([]);
      setStep("auth");
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await searchProfileList();
        const list = res?.result?.profileLists ?? [];

        const mapped = list.map(p => ({
          profileId: p.profileId,
          name: p.name,
          birth: p.birth,
          profileImage: p.profileImage,
          image: toImageSource(p.profileImage),
        }));

        setProfiles(mapped);
      } catch (e) {
        console.log("LOAD PROFILE LIST FAIL:", e);

        if (isAuthError(e)) {
          await goAuthAndReset();
        }
      }
    };

    load();
  }, [setProfiles, setSelectedProfile, setStep]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark-content" />

      <View style={styles.titleWrap}>
        <Text style={styles.title}>프로필 선택</Text>
      </View>

      <View style={styles.profileWrap}>
        {profiles.map(p => (
          <TouchableOpacity
            key={p.profileId}
            style={styles.profile}
            onPress={() => handleSelectProfile(p)}
          >
            <Image source={p.image} style={styles.profileImage} />
            <Text style={styles.profileName} numberOfLines={1} ellipsizeMode="tail">
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}

        {profiles.length < MAX_PROFILES && (
          <TouchableOpacity
            style={styles.createBtn}
            onPress={() => navigation.navigate("ProfileImageSelect")}
          >
            <Image source={require("../assets/images/create.png")} style={styles.createImage} />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.logoutTextWrap}
        activeOpacity={0.7}
        onPress={() => setLogoutModalVisible(true)}
      >
        <Image
          source={require("../assets/images/logout.png")}
          style={styles.logoutIcon}
          resizeMode="contain"
        />
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={isLogoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPressOut={() => setLogoutModalVisible(false)}
        >
          <TouchableWithoutFeedback>
            <View style={styles.modalWrap}>
              <Text style={styles.modalText}>정말 로그아웃하시겠습니까?</Text>
              <View style={styles.modalButtonWrap}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.leftButton]}
                  onPress={handleLogout}
                >
                  <Text style={styles.modalButtonText}>예</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.rightButton]}
                  onPress={() => setLogoutModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.brown }]}>아니오</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory,
  },

  titleWrap: {
    position: "absolute",
    alignItems: "center",
    top: H * 0.08,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  profileWrap: {
    width: W * 0.8,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: H * 0.08,
  },
  profile: {
    width: 120,
    height: 120,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    aspectRatio: 1,
    width: "80%",
    height: "80%",
    borderRadius: 9999,
    resizeMode: "cover",
  },
  profileName: {
    width: "80%",
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    textAlign: "center",
  },

  createBtn: {
    width: 120,
    height: 120,
    margin: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  createImage: {
    width: "70%",
    height: "70%",
    resizeMode: "contain",
  },

  logoutTextWrap: {
    position: "absolute",
    bottom: H * 0.06,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  logoutIcon: {
    width: 18,
    height: 18,
    tintColor: "#E57373",
  },

  logoutText: {
    fontSize: 14,
    fontFamily: "Maplestory_Light",
    color: "#E57373",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: colors.lightGray95,
    justifyContent: "center",
    alignItems: "center",
  },
  modalWrap: {
    width: W * 0.8,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    paddingTop: 30,
    paddingBottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modalText: {
    fontSize: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    textAlign: "center",
    marginBottom: 30,
  },
  modalButtonWrap: {
    flexDirection: "row",
    height: 44,
    width: "100%",
  },
  modalButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  leftButton: {
    borderBottomLeftRadius: 20,
    backgroundColor: colors.ivory,
    width: "50%",
  },
  rightButton: {
    borderBottomRightRadius: 17,
    borderLeftWidth: 0,
    backgroundColor: colors.pink,
    width: "50%",
  },
  modalButtonText: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
});
