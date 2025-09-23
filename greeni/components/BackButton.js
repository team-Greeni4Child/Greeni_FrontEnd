import React from "react";
import { TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";

const { height: H } = Dimensions.get("window");

export default function BackButton({ navigation, top = 80, left = 25 }) {
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={[styles.backButton, { top, left }]}
    >
      <Image
        source={require("../assets/images/back.png")}
        style={styles.backIcon}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
  },
  backIcon: {
    width: 19 * 1.5,
    height: 22 * 1.5,
  },
});
