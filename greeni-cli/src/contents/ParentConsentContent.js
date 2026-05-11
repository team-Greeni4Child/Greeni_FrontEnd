import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ParentConsentContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.updatedAt}>시행일: 2026.03.16</Text>

      <Text style={styles.title}>만 14세 미만 미성년자 법정대리인 개인정보 약관 동의</Text>

      <Text style={styles.paragraph}>
        개인정보보호법 제22조2 제1항에 의거 만 14세 미만 미성년자의 개인정보를 수집하기 위해서는
        법정대리인의 동의가 필요합니다.
      </Text>

      <Text style={styles.sectionTitle}>[개인정보 수집 및 이용에 대한 동의]</Text>
      <Text style={styles.paragraph}>
        그리니(이하 '그리니')는 회원정보 관리, 놀이 활동 제공 및 통계 서비스 제공을 위하여 아래와
        같이 개인정보를 수집·이용합니다.
      </Text>

      <Text style={styles.sectionTitle}>1. 개인정보 수집 항목</Text>
      <Text style={styles.item}>
        a. 필수 수집 항목 : 성명, 생년월일, 서비스 이용기록(접속 일시, 이용한 서비스 및 기능 등)
      </Text>

      <Text style={styles.sectionTitle}>2. 수집 및 이용 목적</Text>
      <Text style={styles.paragraph}>
        회원정보 관리, 놀이 활동 제공 및 관리, 서비스 이용 통계 분석
      </Text>

      <Text style={styles.sectionTitle}>3. 보유 및 이용 기간</Text>
      <Text style={styles.paragraph}>
        원칙적으로, 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이 파기합니다. 단,
        관계법령의 규정에 의하여 보존할 필요가 있는 경우 그리니는 관계 법령에서 정한 일정기간 동안
        개인정보를 보관합니다.
      </Text>

      <Text style={styles.paragraph}>
        본인은 위 아동의 법정대리인으로서, 위와 같은 개인정보 수집·이용에 동의합니다.
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
  title: {
    marginBottom: 20,
    fontSize: 17,
    lineHeight: 24,
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
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 22,
  },
});
