import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>🌱 스무고개</Text>
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
