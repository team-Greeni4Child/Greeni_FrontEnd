import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import FindPasswordScreen from "./screens/FindPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import ProfileSelectScreen from "./screens/ProfileSelectScreen";
import ProfileCreateScreen1 from "./screens/ProfileCreateScreen1";
import ProfileCreateScreen2 from "./screens/ProfileCreateScreen2";

const Stack = createNativeStackNavigator();

export default function App() {

  const [showSplash, setShowSplash] = useState(true);

  return (
    <NavigationContainer>
      {/* 화면 이동을 스택 방식으로 관리 */}
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {/* 첫화면 SplashScreen */}
        {showSplash ? (
          <Stack.Screen name="Splash">
            {(props) => (
              <SplashScreen
                {...props}
                // 스플래시 애니메이션이 끝나면 showSplash = false 로 변경
                onDone={() => setShowSplash(false)}
              />
            )}
          </Stack.Screen>
        ) : (
          <>
            {/* 로그인 화면 LoginScreen */}
            <Stack.Screen name="Login" component={LoginScreen} />
            {/* 비밀번호 찾기 화면 FindPasswordSceen */}
            <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
            {/* 비밀번호 재설정 화면 ResetPasswordScreen */}
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />


            {/* 프로필 선택 화면 ProfileSelectScreen */}
            <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
            {/* 비밀번호 찾기 화면 ProfileCreateScreen1 */}
            <Stack.Screen name="ProfileCreate1" component={ProfileCreateScreen1} />
            {/* 비밀번호 찾기 화면 ProfileCreateScreen2 */}
            <Stack.Screen name="ProfileCreate2" component={ProfileCreateScreen2} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
