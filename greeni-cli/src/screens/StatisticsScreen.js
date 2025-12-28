import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../theme/colors";
import NavigationBar from "../components/NavigationBar";

const { width: W, height: H } = Dimensions.get("window");

export default function StatisticsScreen({ navigation }) {
  const [tab, setTab] = useState(2);

  return (
    <View style={styles.root}>

      {/* 하단 네비게이션 바 */}
      <NavigationBar
        state={tab}
        onTabPress={(i) => {
          setTab(i);
          if (i === 0) navigation.navigate("Home");
          if (i === 1) navigation.navigate("Calendar");
          if (i === 2) navigation.navigate("Statistics");
          if (i === 3) navigation.navigate("MyPage");
        }}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ivory,
  },
});
