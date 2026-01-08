// import React, { useState } from "react";
// import { 
//   View, 
//   Text, 
//   Image, 
//   StyleSheet, 
//   Dimensions, 
//   TextInput,
//   TouchableOpacity,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Modal
// } from "react-native";
// import DateTimePicker from "react-native-modal-datetime-picker";

// import Button from "../components/Button";
// import BackButton from "../components/BackButton";
// import colors from "../theme/colors";

// // 현재 기기의 화면 너비 W, 화면 높이 H
// const { width: W, height: H } = Dimensions.get("window");

// export default function SettingsScreen({route, navigation}) {

//     const [profile, setProfile] = useState({
//       name: '김 그리니',
//       birthday: "2002.11.28",
//       image: require("../assets/images/basic_greeni_pink.png"),
//     });

//     const [editEnabled, setEditEnabled] = useState(false);
//     const [editingField, setEditingField] = useState(null);
//     const [temp, setTemp] = useState("");
//     const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//     const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
//     const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

//     const startEdit = (field) => {
//       setEditingField(field);
//       if (field === "name") setTemp(profile.name);
//       if (field === "birthday") setDatePickerVisibility(true);
//     };

//     const finishEdit = () => {
//       if (editingField === "name") {
//         setProfile((prev) => ({
//           ...prev,
//           name: temp
//         }));
//       }
//       setEditingField(null);
//       Keyboard.dismiss();
//     }

//     const handleDateConfirm = (date) => {
//       const formatted = `${date.getFullYear()}-${String(
//             date.getMonth() + 1
//         ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

//         setProfile((prev) => ({ ...prev, birthday: formatted }));
//         setDatePickerVisibility(false);
//         setEditingField(null);
//     };

//     const hideDatePicker = () => {
//       setDatePickerVisibility(false);
//       setEditingField(null);
//     }

//     return (
//         <TouchableWithoutFeedback onPress={finishEdit}>
//         <View style={styles.root}>
//             <View style={styles.topBackground}>

//                 {/* 상단 뒤로가기 버튼 및 '설정' 제목 */}
//                 <View style={styles.titleWrap}>
//                     <BackButton navigation={navigation}
//                                 top={H * 0.001}
//                                 left={W * 0.05}/>
//                     <Text style={styles.title}>설정</Text>
//                 </View>

//                 {/* 프로필 이미지 */}
//                 <View style={styles.profileWrap}>
//                   <View style={styles.profile}>
//                     <View style={styles.imageWrap}>
//                       <Image style={styles.image} source={require("../assets/images/basic_greeni_pink.png")}/>
//                       <TouchableOpacity
//                         style={styles.editIconTouch}
//                         onPress={() => navigation.navigate("ProfileImageSelectFromSettings", {
//                           onSlectImage: (img) => {
//                             setProfile((prev) => ({ ...prev, image: img}));
//                           },
//                         })}
//                       >
//                         <Image style={styles.editIcon} source={require("../assets/images/edit_icon.png")}/>
//                       </TouchableOpacity>
//                     </View>
//                   </View>

//                   <View style={styles.profileInfo}>
//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>이름</Text>
//                       <View style={styles.infoRight}>
//                         {editingField === "name" ? (
//                           <TextInput
//                             style={[styles.input, { fontFamily: "Maplestory_Light", color: colors.brown, fontSize: 16}]}
//                             value={temp}
//                             onChangeText={setTemp}
//                             autoFocus
//                           />
//                         ) : (
//                           <Text style={styles.infoValue}>{profile.name}</Text>
//                         )}
//                         <TouchableOpacity onPress={() => startEdit("name")}>
//                           <Image style={styles.smallEditIcon} source={require("../assets/images/edit_icon.png")}/>
//                         </TouchableOpacity>
//                       </View>
//                     </View>

//                     <View style={styles.infoRow}>
//                       <Text style={styles.infoLabel}>생년월일</Text>
//                       <View style={styles.infoRight}>
//                         <Text style={styles.infoValue}>{profile.birthday}</Text>
//                         <TouchableOpacity onPress={() => startEdit("birthday")}>
//                           <Image style={styles.smallEditIcon} source={require("../assets/images/edit_icon.png")}/>
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   </View>
//                 </View>


//                 <View style={styles.optionWrap}>
//                     <Button 
//                         title='프로필 전환' 
//                         backgroundColor={colors.ivory} 
//                         borderRadius={10} 
//                         borderWidth={2} 
//                         borderColor={colors.pinkDark} 
//                         width={345} 
//                         height={51} 
//                         style={{ marginBottom: 12 }}
//                         onPress={() => navigation.navigate("ProfileSelect")}
//                     />
//                     <Button 
//                         title='프로필 삭제' 
//                         backgroundColor={colors.ivory} 
//                         borderRadius={10} 
//                         borderWidth={2} 
//                         borderColor={colors.pinkDark} 
//                         width={345} 
//                         height={51} 
//                         style={{ marginBottom: 12 }}
//                         onPress={() => setDeleteModalVisible(true)}
//                     />
//                     <Button 
//                         title='로그아웃' 
//                         backgroundColor={colors.ivory} 
//                         borderRadius={10} 
//                         borderWidth={2} 
//                         borderColor={colors.pinkDark} 
//                         width={345} 
//                         height={51} 
//                         style={{ marginBottom: 12 }}
//                         onPress={() => setLogoutModalVisible(true)}
//                     />
//                 </View>
//             </View>

//             <DateTimePicker 
//               isVisible={isDatePickerVisible}
//               mode="date"
//               onConfirm={handleDateConfirm}
//               onCancel={hideDatePicker}
//               maximumDate={new Date()}
//               locale="ko-KR"
//               display="spinner"
//             />

//             <Modal
//               transparent
//               visible={isDeleteModalVisible}
//               // animationType="fade"
//               onRequestClose={() => setDeleteModalVisible(false)}
//             >
//               <TouchableOpacity
//                 style={styles.modalBackground}
//                 activeOpacity={1}
//                 onPressOut={() => setDeleteModalVisible(false)}
//               >
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalWrap}>
//                   <Text style={styles.modalText}>
//                     정말 프로필을 삭제하시겠습니까?{"\n"}한 번 삭제하면 되돌릴 수 없습니다
//                   </Text>
//                   <View style={styles.modalButtonWrap}>
//                     <TouchableOpacity 
//                       style={[styles.modalButton, styles.leftButton]}
//                       onPress={() => setDeleteModalVisible(false)}
//                     >
//                       <Text style={styles.modalButtonText}>예</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                       style={[styles.modalButton, styles.rightButton]}
//                       onPress={() => setDeleteModalVisible(false)}
//                     >
//                       <Text style={[styles.modalButtonText, { color: colors.brown }]}>아니오</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </TouchableOpacity>
//             </Modal>

//             <Modal
//               transparent
//               visible={isLogoutModalVisible}
//               // animationType="fade"
//               onRequestClose={() => setLogoutModalVisible(false)}
//             >
//               <TouchableOpacity
//                 style={styles.modalBackground}
//                 activeOpacity={1}
//                 onPressOut={() => setLogoutModalVisible(false)}
//               >
//               <TouchableWithoutFeedback>
//                 <View style={styles.modalWrap}>
//                   <Text style={styles.modalText}>
//                     정말 로그아웃하시겠습니까?
//                   </Text>
//                   <View style={styles.modalButtonWrap}>
//                     <TouchableOpacity 
//                       style={[styles.modalButton, styles.leftButton]}
//                       onPress={() => setLogoutModalVisible(false)}
//                     >
//                       <Text style={styles.modalButtonText}>예</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity 
//                       style={[styles.modalButton, styles.rightButton]}
//                       onPress={() => setLogoutModalVisible(false)}
//                     >
//                       <Text style={[styles.modalButtonText, { color: colors.brown }]}>아니오</Text>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </TouchableWithoutFeedback>
//             </TouchableOpacity>
//             </Modal>

//         </View>
//         </TouchableWithoutFeedback>
//     )
// }


// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: colors.ivory,
//     alignItems: "center",
//   },
//   topBackground: {
//     width: W,
//     height: H * 0.82,
//     backgroundColor: colors.pink,
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     paddingTop: H * 0.08,
//   },

//   titleWrap: {
//     alignItems: "center",
//     marginBottom: 45,
//     width: W,
//   },
//   title: {
//     fontSize: 28,
//     fontFamily: "Maplestory_Bold",
//     color: colors.brown,
//   },

//   profileWrap: {
//     alignItems: "center",
//     marginBottom: 45,
//     // borderWidth: 2,
//     // borderColor: 'green'
//   },
//   profile: {
//     width: 104,
//     height: 104,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 45,
//   },
//   imageWrap: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   image: {
//     width: 104,
//     height: 104,
//     borderRadius: 52,
//     resizeMode: "cover",
//   },
//   editIcon: {
//     aspectRatio: 1,
//     width: 17.5,
//     height: 17.5,
//     position: 'absolute',
//     bottom: 2,
//     right: -4,
//   },
//   editIconTouch: {
//     position: 'absolute',
//     bottom: 2,
//     right: -4
//   },
//   profileInfo: {
//     width: 345,
//     height: 135,
//     borderRadius: 20,
//     borderWidth: 3,
//     borderColor: colors.pinkDark,
//     backgroundColor: colors.ivory,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   infoRow: {
//     width: '90%',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginVertical: 15,
//   },
//   infoLabel: {
//     color: colors.brown,
//     fontSize: 16,
//     fontFamily: "Maplestory_Light"
//   },
//   infoRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6
//   },
//   infoValue: {
//     color: colors.brown,
//     fontSize: 16,
//     fontFamily: "Maplestory_Light"
//   },
//   smallEditIcon: {
//     width: 16,
//     height: 16,
//     marginLeft: 6
//   },
//   profileText: {
//     fontFamily: "WantedSans-Regular",
//     color: colors.brown,
//   },

//   optionWrap: {
//     alignItems: "center",
//     // borderWidth: 2,
//     // borderColor: 'red'
//   },

//   modalBackground: {
//     flex: 1,
//     backgroundColor: colors.lightGray95,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalWrap: {
//     width: W * 0.8,
//     // height: 150,
//     backgroundColor: colors.ivory,
//     borderRadius: 20,
//     borderWidth: 3,
//     borderColor: colors.pinkDark,
//     paddingTop: 30,
//     paddingHorizontal: 0,
//     paddingBottom: 0,
//     alignItems: 'center',
//     justifyContent: 'flex-end'
//   },
//   modalText: {
//     fontSize: 16,
//     fontFamily: "Maplestory_Light", 
//     color: colors.brown,
//     textAlign: 'center',
//     marginBottom: 30,
//   },
//   modalButtonWrap: {
//     flexDirection: 'row',
//     height: 44,
//     width: '100%'
//   },
//   modalButton: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   leftButton: {
//     borderBottomLeftRadius: 20,
//     backgroundColor: colors.ivory,
//     width: '50%'
//   },
//   rightButton: {
//     borderBottomRightRadius: 17,
//     borderLeftWidth: 0,
//     backgroundColor: colors.pink,
//     width: '50%'
//   },
//   modalButtonText: {
//     color: colors.brown,
//     fontSize: 16,
//     fontFamily: "Maplestory_Light"
//   }
// });


import React, { useState } from "react";
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
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import Button from "../components/Button";
import BackButton from "../components/BackButton";
import colors from "../theme/colors";

const { width: W, height: H } = Dimensions.get("window");

export default function SettingsScreen({ route, navigation }) {
  const [profile, setProfile] = useState({
    name: "김 그리니",
    birthday: "2002.11.28",
    image: require("../assets/images/basic_greeni_pink.png"),
  });

  const [editEnabled, setEditEnabled] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [temp, setTemp] = useState("");

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

  const toggleEditEnabled = () => {
    if (editingField === "name") {
      setProfile((prev) => ({ ...prev, name: temp }));
      setEditingField(null);
      Keyboard.dismiss();
    }
    setEditEnabled((prev) => !prev);
  };

  const startEditField = (field) => {
    if (!editEnabled) return;

    if (field === "name") {
      setTemp(profile.name);
      setEditingField("name");
    } else if (field === "birthday") {
      setDatePickerVisibility(true);
    }
  };

  const finishEdit = () => {
    if (editingField === "name") {
      setProfile((prev) => ({ ...prev, name: temp }));
    }
    setEditingField(null);
    Keyboard.dismiss();

    if (editEnabled) setEditEnabled(false);
  };

  const handleDateConfirm = (date) => {
    const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(date.getDate()).padStart(2, "0")}`;

    setProfile((prev) => ({ ...prev, birthday: formatted }));
    setDatePickerVisibility(false);
    setEditingField(null);

    setEditEnabled(false);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setEditingField(null);
  };

  return (
    <TouchableWithoutFeedback onPress={finishEdit}>
      <View style={styles.root}>
        <View style={styles.topBackground}>
          {/* 상단 뒤로가기 버튼 및 '설정' 제목 */}
          <View style={styles.titleWrap}>
            <BackButton navigation={navigation} top={H * 0.001} left={W * 0.05} />
            <Text style={styles.title}>설정</Text>
          </View>

          {/* 프로필 이미지 */}
          <View style={styles.profileWrap}>
            <View style={styles.profile}>
              <View style={styles.imageWrap}>
                <Image
                  style={styles.image}
                  source={require("../assets/images/basic_greeni_pink.png")}
                />
                <TouchableOpacity
                  style={styles.editIconTouch}
                  onPress={() =>
                    navigation.navigate("ProfileImageSelectFromSettings", {
                      onSlectImage: (img) => {
                        setProfile((prev) => ({ ...prev, image: img }));
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
                      value={temp}
                      onChangeText={setTemp}
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
                        ]}
                      >
                        {profile.name}
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
                      ]}
                    >
                      {profile.birthday}
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
                  style={[
                    styles.bottomEditIcon,
                    editEnabled && { opacity: 1 },
                  ]}
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
              onPress={() => navigation.navigate("ProfileSelect")}
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
                  정말 프로필을 삭제하시겠습니까?{"\n"}한 번 삭제하면 되돌릴 수 없습니다
                </Text>
                <View style={styles.modalButtonWrap}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.leftButton]}
                    onPress={() => setDeleteModalVisible(false)}
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
                    onPress={() => setLogoutModalVisible(false)}
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
