import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import { AuthContext } from "../App";
import { ProfileContext } from "../context/ProfileContext";
import { deleteProfile, modifyProfile, searchProfileList } from "../api/profile";
import { uploadProfileAsset } from "../api/s3";
import { logout } from "../api/auth";
import { clearAuth } from "../utils/tokenStorage";
import { fileByIndex, toImageSource } from "../utils/profileImageMap";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

export default function SettingsScreen({ route, navigation }) {
  const { setStep } = useContext(AuthContext);
  const { setProfiles, selectedProfile, setSelectedProfile } = useContext(ProfileContext);

  const renderCount = useRef(0);
  renderCount.current += 1;
  console.log(
    "[SettingsScreen] render#",
    renderCount.current,
    "selectedProfile:",
    !!selectedProfile
  );

  const formatBirth = (s) => (typeof s === "string" ? s.replaceAll("-", ".") : "");

  // 훅은 무조건 실행
  const [draftName, setDraftName] = useState("");
  const [draftBirth, setDraftBirth] = useState("");

  const [editEnabled, setEditEnabled] = useState(false);
  const [editingField, setEditingField] = useState(null);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  // selectedProfile 바뀔 때 draft 동기화
  useEffect(() => {
    if (selectedProfile) {
      setDraftName(selectedProfile?.name ?? "");
      setDraftBirth(selectedProfile?.birth ?? "");
    }
  }, [selectedProfile?.profileId]);

  // selectedProfile 없이 Settings로 들어오는 것 방지
  useEffect(() => {
    if (!selectedProfile) {
      setStep("profile");
    }
  }, [selectedProfile, setStep]);

  // 렌더 중에 절대 selectedProfile을 직접 dereference 하지 말고 safe 객체 사용
  const safeProfile = selectedProfile ?? {
    profileId: null,
    name: "",
    birth: "",
    profileImage: "",
    image: null,
  };

  const profileName = safeProfile.name;
  const shownBirth = formatBirth(draftBirth || safeProfile.birth);
  const profileImageSource = safeProfile.image;

  const toggleEditEnabled = () => {
    setEditEnabled((prev) => !prev);
  };

  const startEditField = (field) => {
    if (!editEnabled) return;

    if (field === "name") {
      setEditingField("name");
    } else if (field === "birthday") {
      setDatePickerVisibility(true);
    }
  };

  const finishEdit = useCallback(async () => {
    if (!editEnabled && !editingField) return;
    if (!selectedProfile) return;

    const nextName = (draftName ?? "").trim();
    const nextBirth = (draftBirth ?? "").trim();

    const finalName = nextName.length ? nextName : selectedProfile.name;
    const finalBirth = nextBirth.length ? nextBirth : selectedProfile.birth;

    const changed =
      finalName !== selectedProfile.name || finalBirth !== selectedProfile.birth;

    try {
      if (changed) {
        await modifyProfile(selectedProfile.profileId, {
          profileImage: selectedProfile.profileImage,
          name: finalName,
          birth: finalBirth,
        });

        const updated = { ...selectedProfile, name: finalName, birth: finalBirth };
        setSelectedProfile(updated);

        setProfiles((prev) =>
          prev.map((p) =>
            p.profileId === selectedProfile.profileId
              ? { ...p, name: finalName, birth: finalBirth }
              : p
          )
        );
      }
    } catch (e) {
      console.log("Modify Profile Fail", e);
      Alert.alert("오류", e?.message || "프로필 수정에 실패했습니다.");

      setDraftName(selectedProfile.name);
      setDraftBirth(selectedProfile.birth);
    } finally {
      setEditingField(null);
      Keyboard.dismiss();
      setEditEnabled(false);
    }
  }, [
    editEnabled,
    editingField,
    draftName,
    draftBirth,
    selectedProfile,
    setSelectedProfile,
    setProfiles,
  ]);

  const handleDateConfirm = async (date) => {
    if (!selectedProfile) return;

    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

    setDraftBirth(formatted);

    try {
      await modifyProfile(selectedProfile.profileId, {
        profileImage: selectedProfile.profileImage,
        name: (draftName ?? "").trim() || selectedProfile.name,
        birth: formatted,
      });

      const updated = { ...selectedProfile, birth: formatted };
      setSelectedProfile(updated);

      setProfiles((prev) =>
        prev.map((p) =>
          p.profileId === selectedProfile.profileId ? { ...p, birth: formatted } : p
        )
      );
    } catch (e) {
      console.log("Modify Birth Fail:", e);
      Alert.alert("오류", e?.message || "생년월일 수정에 실패했습니다.");
      setDraftBirth(selectedProfile.birth);
    } finally {
      setDatePickerVisibility(false);
      setEditingField(null);
      setEditEnabled(false);
    }
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setEditingField(null);
  };

  const handleDeleteProfile = async () => {
    try {
      const deletingId = selectedProfile?.profileId;
      if (!deletingId) return;

      await deleteProfile(deletingId);

      setDeleteModalVisible(false);
      setStep("profile");
      setSelectedProfile(null);

      // 3) 목록 갱신
      const listRes = await searchProfileList();
      const list = listRes?.result?.profileLists ?? [];
      const mapped = list.map((p) => ({
        profileId: p.profileId,
        name: p.name,
        birth: p.birth,
        profileImage: p.profileImage,
        image: toImageSource(p.profileImage),
      }));
      setProfiles(mapped);
    } catch (e) {
      console.log("Delete Profile Fail:", e);
      Alert.alert("오류", e?.message || "프로필 삭제에 실패했습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("Logout Fail:", e);
    } finally {
      await clearAuth();
      setLogoutModalVisible(false);
      setStep("auth");
    }
  };

  if (!selectedProfile) {
    return <View style={styles.root} />;
  }

  return (
    <TouchableWithoutFeedback onPress={() => finishEdit()}>
      <View style={styles.root}>
        <View style={styles.topBackground}>
          <View style={styles.titleWrap}>
            <BackButton navigation={navigation} top={H * 0.001} left={W * 0.05} />
            <Text style={styles.title}>설정</Text>
          </View>

          <View style={styles.profileWrap}>
            <View style={styles.profile}>
              <View style={styles.imageWrap}>
                {profileImageSource ? (
                  <Image style={styles.image} source={profileImageSource} />
                ) : null}

                <TouchableOpacity
                  style={styles.editIconTouch}
                  onPress={() =>
                    // navigation.navigate("ProfileImageSelectFromSettings", {
                    navigation.navigate("ProfileImageSelect", {
                      onSelectImage: async ({ selectedIndex, isUploaded, uploadedAsset }) => {
                        try {
                          if (!selectedProfile) return;

                          let profileImage = null;
                          if (isUploaded) {
                            if (!uploadedAsset?.uri) {
                              Alert.alert("오류", "업로드 이미지 정보를 가져올 수 없습니다.");
                              return;
                            }
                            profileImage = await uploadProfileAsset(uploadedAsset);
                          } else {
                            profileImage = fileByIndex(selectedIndex);
                          }
                          if (!profileImage) {
                            Alert.alert("오류", "프로필 이미지를 다시 선택해 주세요.");
                            return;
                          }

                          await modifyProfile(selectedProfile.profileId, {
                            profileImage,
                            name: (draftName ?? "").trim() || selectedProfile.name,
                            birth: (draftBirth ?? "").trim() || selectedProfile.birth,
                          });

                          const updated = {
                            ...selectedProfile,
                            profileImage,
                            image: toImageSource(profileImage),
                          };
                          setSelectedProfile(updated);

                          setProfiles((prev) =>
                            prev.map((p) =>
                              p.profileId === selectedProfile.profileId
                                ? { ...p, profileImage, image: toImageSource(profileImage) }
                                : p
                            )
                          );
                        } catch (e) {
                          console.log("Modify Profile Image Fail:", e);
                          Alert.alert("오류", e?.message || "프로필 이미지 수정에 실패했습니다.");
                        }
                      },
                    })
                  }
                >
                  <Image
                    style={styles.editIcon}
                    source={require("../assets/images/edit_icon.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.profileInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이름</Text>
                <View style={styles.infoRight}>
                  {editingField === "name" ? (
                    <TextInput
                      style={[
                        styles.input,
                        {
                          fontFamily: "Maplestory_Light",
                          color: colors.brown,
                          fontSize: 16,
                          padding: 0,
                        },
                      ]}
                      value={draftName}
                      onChangeText={setDraftName}
                      autoFocus
                    />
                  ) : (
                    <TouchableOpacity
                      activeOpacity={editEnabled ? 0.6 : 1}
                      onPress={() => startEditField("name")}
                    >
                      <Text
                        style={[
                          styles.infoValue,
                          editEnabled && styles.editableValue,
                          editEnabled && styles.editableUnderline,
                        ]}
                      >
                        {profileName}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>생년월일</Text>
                <View style={styles.infoRight}>
                  <TouchableOpacity
                    activeOpacity={editEnabled ? 0.6 : 1}
                    onPress={() => startEditField("birthday")}
                  >
                    <Text
                      style={[
                        styles.infoValue,
                        editEnabled && styles.editableValue,
                        editEnabled && styles.editableUnderline,
                      ]}
                    >
                      {shownBirth}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={styles.bottomEditIconTouch}
                onPress={toggleEditEnabled}
                activeOpacity={0.7}
              >
                <Image
                  style={[styles.bottomEditIcon, editEnabled && { opacity: 1 }]}
                  source={require("../assets/images/edit_icon.png")}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.optionWrap}>
            <Button
              title="프로필 전환"
              backgroundColor={colors.ivory}
              borderRadius={10}
              borderWidth={2}
              borderColor={colors.pinkDark}
              width={345}
              height={51}
              style={{ marginBottom: 12 }}
              onPress={() => setStep("profile")}
            />
            <Button
              title="프로필 삭제"
              backgroundColor={colors.ivory}
              borderRadius={10}
              borderWidth={2}
              borderColor={colors.pinkDark}
              width={345}
              height={51}
              style={{ marginBottom: 12 }}
              onPress={() => setDeleteModalVisible(true)}
            />
            <Button
              title="로그아웃"
              backgroundColor={colors.ivory}
              borderRadius={10}
              borderWidth={2}
              borderColor={colors.pinkDark}
              width={345}
              height={51}
              style={{ marginBottom: 12 }}
              onPress={() => setLogoutModalVisible(true)}
            />
          </View>
        </View>

        <DateTimePicker
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
          locale="ko-KR"
          display="spinner"
        />

        <Modal
          transparent
          visible={isDeleteModalVisible}
          onRequestClose={() => setDeleteModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalBackground}
            activeOpacity={1}
            onPressOut={() => setDeleteModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              <View style={styles.modalWrap}>
                <Text style={styles.modalText}>
                  정말 프로필을 삭제하시겠습니까?{"\n"}한 번 삭제하면 되돌릴 수 없습니다.
                </Text>
                <View style={styles.modalButtonWrap}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.leftButton]}
                    onPress={handleDeleteProfile}
                  >
                    <Text style={styles.modalButtonText}>예</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.rightButton]}
                    onPress={() => setDeleteModalVisible(false)}
                  >
                    <Text style={[styles.modalButtonText, { color: colors.brown }]}>
                      아니오
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>

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
                    <Text style={[styles.modalButtonText, { color: colors.brown }]}>
                      아니오
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
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
    marginBottom: 45,
    width: W,
  },
  title: {
    fontSize: 28,
    fontFamily: "Maplestory_Bold",
    color: colors.brown,
  },

  profileWrap: {
    alignItems: "center",
    marginBottom: 45,
  },
  profile: {
    width: 104,
    height: 104,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 45,
  },
  imageWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
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
    position: "absolute",
    bottom: 2,
    right: -4,
  },
  editIconTouch: {
    position: "absolute",
    bottom: 2,
    right: -4,
  },

  profileInfo: {
    width: 345,
    height: 135,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  infoRow: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  infoLabel: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },
  infoRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoValue: {
    color: colors.brown,
    fontSize: 16,
    fontFamily: "Maplestory_Light",
  },

  editableValue: {
    opacity: 0.9,
  },

  editableUnderline: {
    borderBottomColor: colors.pinkDark,
    borderBottomWidth: 1,
  },

  input: {
    minWidth: 90,
    textAlign: "right",
  },

  bottomEditIconTouch: {
    position: "absolute",
    right: 8,
    bottom: 3,
    padding: 6,
  },
  bottomEditIcon: {
    width: 18,
    height: 18,
  },

  optionWrap: {
    alignItems: "center",
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

