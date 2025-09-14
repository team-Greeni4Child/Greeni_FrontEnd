import React, { useState } from "react";
import SplashScreen from "./screens/SplashScreen";
import HomeScreen from "./screens/HomeScreen";
import ProfileSelectScreen from "./screens/ProfileSelectScreen";
import ProfileCreateScreen1 from "./screens/ProfileCreateScreen1";
import ProfileCreateScreen2 from "./screens/ProfileCreateScreen2";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onDone={() => setShowSplash(false)} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ProfileSelectScreen" component={ProfileSelectScreen} />
        <Stack.Screen name="ProfileCreateScreen1" component={ProfileCreateScreen1} />
        <Stack.Screen name="ProfileCreateScreen2" component={ProfileCreateScreen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}