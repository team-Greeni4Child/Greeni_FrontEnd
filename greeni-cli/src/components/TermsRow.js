import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import colors from "../theme/colors";

const checkedIcon = require("../assets/images/checked.png");
const uncheckedIcon = require("../assets/images/unchecked.png");

export default function TermsRow({
  checked = false,
  required = false, // 동의 필수면 true, 선택이면 false
  title = "",
  onToggle,
  onPressDetail,
}) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.leftArea}
        activeOpacity={0.8}
        onPress={onToggle}
      >
        <Image
          source={checked ? checkedIcon : uncheckedIcon}
          style={styles.checkIcon}
          resizeMode="contain"
        />

        <Text style={styles.label} numberOfLines={1}>
          <Text style={styles.requiredText}>
            {required ? "[ 필수 ]  " : "[ 선택 ]  "}
          </Text>
          <Text style={styles.titleText}>{title}</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.detailButton}
        activeOpacity={0.8}
        onPress={onPressDetail}
      >
        <Text style={styles.arrow}>{">"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    minHeight: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftArea: {
    flex: 1,
    minHeight: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    marginRight: 7,
  },
  label: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Maplestory_Light",
    color: colors.brown,
  },
  requiredText: {
    color: colors.brown,
    fontFamily: "Maplestory_Light",
  },
  titleText: {
    color: colors.brown,
    fontFamily: "Maplestory_Light",
  },
  detailButton: {
    width: 25,
    height: 20,
    alignItems: "flex-end",
    justifyContent: "center",
    marginLeft: 6,
  },
  arrow: {
    fontSize: 12,
    color: colors.brown,
    fontFamily: "Maplestory_Light",
  },
});