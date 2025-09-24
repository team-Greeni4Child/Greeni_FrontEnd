import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Button from "../components/Button";  
import colors from "../theme/colors";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>🌱 Greeni 홈</Text>

      {/* 그림일기 */}
      <Button 
        title="그림일기"
        buttonColor={colors.pink}
        titleColor={colors.brown}
        width={200}
        height={50}
        borderRadius={12}
        onPress={() => navigation.navigate("Diary")}
      />

      {/* 스무고개 */}
      <Button 
        title="스무고개"
        buttonColor={colors.green}
        titleColor={colors.brown}
        width={200}
        height={50}
        borderRadius={12}
        onPress={() => navigation.navigate("TwentyQuestions")}
      />

      {/* 동물퀴즈 */}
      <Button 
        title="동물퀴즈"
        buttonColor={colors.pink}
        titleColor={colors.brown}
        width={200}
        height={50}
        borderRadius={12}
        onPress={() => navigation.navigate("AnimalQuiz")}
      />

      {/* 역할놀이 */}
      <Button 
        title="역할놀이"
        buttonColor={colors.green}
        titleColor={colors.brown}
        width={200}
        height={50}
        borderRadius={12}
        onPress={() => navigation.navigate("RolePlaying")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.ivory,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.brown,
    marginBottom: 24,
  },
});
