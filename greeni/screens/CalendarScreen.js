import React, { useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  BackHandler,
  Platform,
} from "react-native";import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [tab, setTab] = useState(0);
    
  //뒤로가기 앱 종료
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          if (Platform.OS === "android") {
            BackHandler.exitApp();   // 앱 종료
          }
          return true; 
        };
  
        const backHandler = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => backHandler.remove();
      }, [])
    );
  
  return (
    <View style={styles.root}>
      {/* 네비게이션 바 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
        setTab(i);
        if (i === 0) navigation.navigate("Calendar");
        if (i === 1) navigation.navigate("Home");
        if (i === 2) navigation.navigate("MyPage");
      }}
      />

      <Text style={styles.title}>🌱 일기보기 화면</Text>
    </View>  
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFDEE", 
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#5A463C",
    marginBottom: 12,
  },
});
