import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import FindPasswordScreen from "./screens/FindPasswordScreen";
import ProfileSelectScreen from "./screens/ProfileSelectScreen";
import ProfileImageSelectScreen from "./screens/ProfileImageSelectScreen";
import ProfileInfoFormScreen from "./screens/ProfileInfoFormScreen";

import { ProfileProvider } from "./context/ProfileContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ProfileProvider>
      {/* 여기서 네비게이션 설정 */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />
          <Stack.Screen name="ProfileImageSelect" component={ProfileImageSelectScreen} />
          <Stack.Screen name="ProfileInfoForm" component={ProfileInfoFormScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProfileProvider>
  );
}

// export default function App() {

//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <NavigationContainer>
//       {/* 화면 이동을 스택 방식으로 관리 */}
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
        
//         {/* 첫화면 SplashScreen */}
//         {showSplash ? (
//           <Stack.Screen name="Splash">
//             {(props) => (
//               <SplashScreen
//                 {...props}
//                 // 스플래시 애니메이션이 끝나면 showSplash = false 로 변경
//                 onDone={() => setShowSplash(false)}
//               />
//             )}
//           </Stack.Screen>
//         ) : (
//           <>
//             {/* 로그인 화면 LoginScreen */}
//             {/* <Stack.Screen name="Login" component={LoginScreen} /> */}

//             {/* 비밀번호 찾기 화면 FindPasswordSceen */}
//             {/* <Stack.Screen name="FindPassword" component={FindPasswordScreen} /> */}

//             {/* 프로필 선택 화면 ProfileSelectScreen */}
//             <Stack.Screen name="ProfileSelect" component={ProfileSelectScreen} />

//             {/* 프로필 이미지 선택 화면 ProfileImageSelectScreen */}
//             <Stack.Screen name="ProfileImageSelect" component={ProfileImageSelectScreen} />

//             {/* 프로필 정보 입력 화면 ProfileInfoFormScreen */}
//             <Stack.Screen name="ProfileInfoForm" component={ProfileInfoFormScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
