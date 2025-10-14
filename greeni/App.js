import React, { useState, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProfileProvider } from "./context/ProfileContext";
import { useFonts } from "expo-font";

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
import TwentyQuestionsScreen from "./screens/TwentyQuestionsScreen";
import AnimalQuizScreen from "./screens/AnimalQuizScreen";
import RolePlayingScreen from "./screens/RolePlayingScreen";
import CalendarScreen from "./screens/CalendarScreen";
import MyPageScreen from "./screens/MyPageScreen";

export const AuthContext = createContext();

const Stack = createNativeStackNavigator();

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
      <Stack.Screen name="TwentyQuestions" component={TwentyQuestionsScreen} />
      <Stack.Screen name="AnimalQuiz" component={AnimalQuizScreen} />
      <Stack.Screen name="RolePlaying" component={RolePlayingScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen}/>
      <Stack.Screen name="MyPage" component={MyPageScreen}/>
      {/* 나중에 다른 페이지 추가 */}
    </Stack.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState("auth"); 

  //폰트
  const [fontsLoaded] = useFonts({
    "KCC-Murukmuruk": require("./assets/fonts/KCC-Murukmuruk.ttf"),
    "WantedSans": require("./assets/fonts/WantedSansStdVariable.ttf"),
    "WantedSans-Regular": require("./assets/fonts/WantedSansStd-Regular.ttf"),
    "WantedSans-Medium": require("./assets/fonts/WantedSansStd-Medium.ttf"),
    "WantedSans-SemiBold": require("./assets/fonts/WantedSansStd-SemiBold.ttf"),
    "WantedSans-Bold": require("./assets/fonts/WantedSansStd-Bold.ttf"),
    "WantedSans-ExtraBold": require("./assets/fonts/WantedSansStd-ExtraBold.ttf"),
    "WantedSans-Black": require("./assets/fonts/WantedSansStd-Black.ttf"),
    "WantedSans-ExtraBlack": require("./assets/fonts/WantedSansStd-ExtraBlack.ttf"),
  });  
  if (!fontsLoaded) {
    return null; 
  }

  return (
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
  );
}
