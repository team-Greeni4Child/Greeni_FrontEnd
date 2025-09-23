import React, { useState, createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import FindPasswordScreen from "./screens/FindPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import SignupScreen from "./screens/SignupScreen";
import ProfileSelectScreen from "./screens/ProfileSelectScreen";
import ProfileCreateScreen1 from "./screens/ProfileCreateScreen1";
import ProfileCreateScreen2 from "./screens/ProfileCreateScreen2";
import HomeScreen from "./screens/HomeScreen";
import DiaryScreen from "./screens/DiaryScreen";
import TwentyQuestionsScreen from "./screens/TwentyQuestionsScreen";
import AnimalQuizScreen from "./screens/AnimalQuizScreen";
import RolePlayingScreen from "./screens/RolePlayingScreen";

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
      <Stack.Screen name="ProfileCreate1" component={ProfileCreateScreen1} />
      <Stack.Screen name="ProfileCreate2" component={ProfileCreateScreen2} />
    </Stack.Navigator>
  );
}

/* 3. 메인 앱 스택 */
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Diary" component={DiaryScreen} />
      <Stack.Screen name="TwentyQuestions" component={TwentyQuestionsScreen} />
      <Stack.Screen name="AnimalQuiz" component={AnimalQuizScreen} />
      <Stack.Screen name="RolePlaying" component={RolePlayingScreen} />
      {/* 나중에 다른 페이지 추가 */}
    </Stack.Navigator>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [step, setStep] = useState("auth"); 

  return (
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
          <AuthStack />
        ) : step === "profile" ? (
          <ProfileStack />
        ) : (
          <MainStack />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
