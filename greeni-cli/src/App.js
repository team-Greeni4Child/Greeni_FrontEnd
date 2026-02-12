import "react-native-gesture-handler";
import React, { useState, createContext } from "react";
import { Text, TextInput } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "./context/ProfileContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    <Stack.Navigator screenOptions={{ headerShown: false, animation: "none"}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="DiaryDraw" component={DiaryDrawScreen} />
      <Stack.Screen name="FiveQuestions" component={FiveQuestionsScreen} />
      <Stack.Screen name="AnimalQuiz" component={AnimalQuizScreen} />
      <Stack.Screen name="RolePlaying" component={RolePlayingScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen}/>
      <Stack.Screen name="DiaryRecord" component={DiaryRecordScreen}/>
      <Stack.Screen name="MyPage" component={MyPageScreen}/>
      <Stack.Screen name="SettingsPassword" component={SettingsPasswordScreen}/>
      <Stack.Screen name="Settings" component={SettingsScreen}/>
      <Stack.Screen name="ParentsPage" component={ParentsPageScreen}/>
      <Stack.Screen name="ProfileSelectFromSettings" component={ProfileSelectScreen}/>
      <Stack.Screen name="ProfileImageSelectFromSettings" component={ProfileImageSelectScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen}/>
      <Stack.Screen name="Statistics" component={StatisticsScreen}/>
      {/* 나중에 다른 페이지 추가 */}
    </Stack.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState("auth"); 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ProfileProvider>
        <AuthContext.Provider value={{ step, setStep }}>
          <NavigationContainer>
            {showSplash ? (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Splash">
                  {(props) => (
                    <SplashScreen
                      {...props}
                      onDone={() => setShowSplash(false)}
                    />
                  )}
                </Stack.Screen>
              </Stack.Navigator>
            ) : step === "auth" ? (
              <AuthStack  />
            ) : step === "profile" ? (
              <ProfileStack />
            ) : (
              <MainStack />
            )}
          </NavigationContainer>
        </AuthContext.Provider>
      </ProfileProvider>
    </GestureHandlerRootView>
  );
}