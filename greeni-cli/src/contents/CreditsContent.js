import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function CreditsContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.updatedAt}>시행일: 2026.03.16</Text>

      <Text style={styles.sectionTitle}>제1조 목적</Text>
      <Text style={styles.paragraph}>
        이 개인정보 처리방침은 그리니 서비스가 이용자의 개인정보를 어떻게 수집, 이용, 보관,
        제공하는지에 관한 기준을 안내하기 위해 마련되었습니다.
      </Text>

      <Text style={styles.sectionTitle}>제2조 수집하는 개인정보 항목</Text>
      <Text style={styles.paragraph}>
        회사는 회원가입, 서비스 이용, 고객 문의 처리 과정에서 다음과 같은 개인정보를 수집할 수
        있습니다.
      </Text>
      <Text style={styles.item}>1. 필수항목: 이메일, 비밀번호</Text>
      <Text style={styles.item}>2. 선택항목: 프로필 이미지, 자녀 프로필 정보</Text>

      <Text style={styles.sectionTitle}>제3조 개인정보의 이용 목적</Text>
      <Text style={styles.paragraph}>
        수집한 개인정보는 회원 식별, 서비스 제공, 고객 문의 대응, 서비스 개선 등의 목적으로
        이용됩니다.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 32,
  },
  updatedAt: {
    marginBottom: 20,
    fontSize: 13,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  paragraph: {
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 22,
  },
  item: {
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 22,
  },
});
