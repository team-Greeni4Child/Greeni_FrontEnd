import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CreditsContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        그리니는 “아이들이 자신의 감정을 조금 더 편하게 이야기할 수 있으면 좋겠다”는 마음에서 시작된
        프로젝트입니다.
      </Text>

      <Text style={styles.paragraph}>
        우리는 AI 기술이 아이들의 하루와 감정을 이해하는 데 도움이 될 수 있다고 믿고 있으며, 아이와
        보호자가 함께 사용할 수 있는 따뜻한 서비스를 만들기 위해 노력하고 있습니다.
      </Text>

      <Text style={styles.paragraph}>
        그리니 팀(Forest)은 기획, 디자인, 프론트엔드, 백엔드, AI 분야의 학생 개발자들이 함께
        만들어가고 있습니다.
      </Text>

      <Text style={styles.paragraph}>문의: greeni4child@gmail.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  paragraph: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 22,
  },
});
