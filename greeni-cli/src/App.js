import "react-native-gesture-handler";
import React, { useEffect, useRef, useState, createContext, useContext } from "react";
import {
  Text,
  TextInput,
  BackHandler,
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider, ProfileContext } from "./context/ProfileContext";
import { TutorialProvider } from "./context/TutorialContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { getAccessToken, getSelectedProfile, clearSelectedProfile } from "./utils/tokenStorage";
import { addLogoutListener } from "./utils/authEvents";
import { addProfileInvalidListener } from "./utils/profileEvents";
import colors from "./theme/colors";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import FindPasswordScreen from "./screens/FindPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileSelectScreen from "./screens/ProfileSelectScreen";
import ProfileImageSelectScreen from "./screens/ProfileImageSelectScreen";
import ProfileInfoFormScreen from "./screens/ProfileInfoFormScreen";
import HomeScreen from "./screens/HomeScreen";
import DiaryScreen from "./screens/DiaryScreen";
import DiaryDrawScreen from "./screens/DiaryDrawScreen";
import FiveQuestionsScreen from "./screens/FiveQuestionsScreen";
import AnimalQuizScreen from "./screens/AnimalQuizScreen";
import RolePlayingScreen from "./screens/RolePlayingScreen";
import CalendarScreen from "./screens/CalendarScreen";
import DiaryRecordScreen from "./screens/DiaryRecordScreen";
import TutorialDiaryRecordScreen from "./screens/TutorialDiaryRecordScreen";
import MyPageScreen from "./screens/MyPageScreen";
import SettingsPasswordScreen from "./screens/SettingsPasswordScreen";
import SettingsScreen from "./screens/SettingsScreen";
import ParentsPageScreen from "./screens/ParentsPageScreen";
import SummaryScreen from "./screens/SummaryScreen";
import StatisticsScreen from "./screens/StatisticsScreen";

export const AuthContext = createContext();

const Stack = createNativeStackNavigator();

// 텍스트 스케일링 막음. 폰트 사이즈 고정
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

/* 1. 로그인 관련 스택 */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

/* 2. 프로필 관련 스택 */
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
      <Stack.Screen name="ProfileImageSelect" component={ProfileImageSelectScreen} />
      <Stack.Screen name="ProfileInfoForm" component={ProfileInfoFormScreen} />
    </Stack.Navigator>
  );
}

/* 3. 메인 앱 스택 */
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "none" }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="DiaryDraw" component={DiaryDrawScreen} />
      <Stack.Screen name="FiveQuestions" component={FiveQuestionsScreen} />
      <Stack.Screen name="AnimalQuiz" component={AnimalQuizScreen} />
      <Stack.Screen name="RolePlaying" component={RolePlayingScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="DiaryRecord" component={DiaryRecordScreen} />
      <Stack.Screen name="TutorialDiaryRecord" component={TutorialDiaryRecordScreen} />
      <Stack.Screen name="MyPage" component={MyPageScreen} />
      <Stack.Screen name="SettingsPassword" component={SettingsPasswordScreen} />
      <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ParentsPage" component={ParentsPageScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} />
      <Stack.Screen name="ProfileImageSelect" component={ProfileImageSelectScreen} />
      {/* 나중에 다른 페이지 추가 */}
    </Stack.Navigator>
  );
}

function GlobalLogoutHandler({ setStep }) {
  const { setProfiles, setSelectedProfile } = useContext(ProfileContext);
  const [showLogoutNotice, setShowLogoutNotice] = useState(false);

  useEffect(() => {
    const unsubscribe = addLogoutListener(() => {
      setShowLogoutNotice(true);
    });

    return unsubscribe;
  }, []);

  const handleConfirmLogoutNotice = async () => {
    await clearSelectedProfile();
    setSelectedProfile(null);
    setProfiles([]);
    setShowLogoutNotice(false);
    setStep("auth");
  };

  return (
    <Modal
      transparent
      visible={showLogoutNotice}
      animationType="fade"
      onRequestClose={handleConfirmLogoutNotice}
    >
      <View style={styles.globalModalBackground}>
        <View style={styles.globalModalWrap}>
          <Text style={styles.globalModalText}>
            다른 기기에서 로그아웃되어{"\n"}현재 기기에서도 로그아웃됩니다.
          </Text>

          <View style={styles.globalModalButtonWrap}>
            <TouchableOpacity
              style={styles.globalModalButton}
              onPress={handleConfirmLogoutNotice}
              activeOpacity={0.8}
            >
              <Text style={styles.globalModalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function GlobalProfileInvalidHandler({ setStep }) {
  const { setProfiles, setSelectedProfile } = useContext(ProfileContext);
  const [showProfileInvalidNotice, setShowProfileInvalidNotice] = useState(false);

  useEffect(() => {
    const unsubscribe = addProfileInvalidListener(() => {
      setShowProfileInvalidNotice(true);
    });

    return unsubscribe;
  }, []);

  const handleConfirmProfileInvalidNotice = async () => {
    await clearSelectedProfile();
    setSelectedProfile(null);
    setProfiles([]);
    setShowProfileInvalidNotice(false);
    setStep("profile");
  };

  return (
    <Modal
      transparent
      visible={showProfileInvalidNotice}
      animationType="fade"
      onRequestClose={handleConfirmProfileInvalidNotice}
    >
      <View style={styles.globalModalBackground}>
        <View style={styles.globalModalWrap}>
          <Text style={styles.globalModalText}>
            다른 기기에서 프로필이 삭제되어{"\n"}프로필 선택 화면으로 이동합니다.
          </Text>

          <View style={styles.globalModalButtonWrap}>
            <TouchableOpacity
              style={styles.globalModalButton}
              onPress={handleConfirmProfileInvalidNotice}
              activeOpacity={0.8}
            >
              <Text style={styles.globalModalButtonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function App() {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [step, setStep] = useState("auth");

  const navigationRef = useRef(null);

  const bootstrap = async () => {
    try {
      const accessToken = await getAccessToken();
      const savedProfile = await getSelectedProfile();

      if (!accessToken) {
        setStep("auth");
        return;
      }

      if (!savedProfile) {
        setStep("profile");
        return;
      }

      setStep("main");
    } catch (e) {
      console.log("APP BOOTSTRAP FAIL:", e);
      setStep("auth");
    } finally {
      setIsBootstrapping(false);
    }
  };

  // 기기의 백버튼과 커스텀 백버튼 통일
  useEffect(() => {
    const onHardwareBackPress = () => {
      const nav = navigationRef.current;

      if (nav?.canGoBack?.()) {
        nav.goBack();
        return true;
      }

      return false;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onHardwareBackPress);

    return () => sub.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
        <TutorialProvider>
          <AuthContext.Provider value={{ step, setStep }}>
            <GlobalLogoutHandler setStep={setStep} />
            <GlobalProfileInvalidHandler setStep={setStep} />

            <NavigationContainer key={isBootstrapping ? "splash" : step} ref={navigationRef}>
              {isBootstrapping ? (
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Splash">
                    {props => <SplashScreen {...props} onDone={bootstrap} />}
                  </Stack.Screen>
                </Stack.Navigator>
              ) : step === "auth" ? (
                <AuthStack />
              ) : step === "profile" ? (
                <ProfileStack />
              ) : (
                <MainStack />
              )}
            </NavigationContainer>
          </AuthContext.Provider>
        </TutorialProvider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  globalModalBackground: {
    flex: 1,
    backgroundColor: colors.lightGray95,
    justifyContent: "center",
    alignItems: "center",
  },
  globalModalWrap: {
    width: "80%",
    backgroundColor: colors.ivory,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.pinkDark,
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  globalModalText: {
    fontSize: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
  },
  globalModalButtonWrap: {
    width: "100%",
    height: 44,
  },
  globalModalButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.pink,
  },
  globalModalButtonText: {
    fontSize: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
});
