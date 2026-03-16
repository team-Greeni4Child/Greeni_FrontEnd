import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function PrivacyPolicyContent() {
  return (
    <View style={styles.container}>
      <Text style={styles.updatedAt}>시행일: 2026.03.16</Text>

      <Text style={styles.sectionTitle}>가. 수집 및 이용 목적</Text>
      <Text style={styles.paragraph}>
        '그리니'는 서비스 제공 및 운영을 위하여 필요한 최소한의 범위 내에서 개인정보를 수집ㆍ이용합니다.{"\n"}
        귀하는 아래 내용을 충분히 숙지한 후 동의 여부를 결정할 권리가 있습니다.{"\n"}
        o 필수 항목에 대한 동의를 거부하실 경우 서비스 이용이 제한될 수 있으며, 선택 항목에 동의하지 않더라도 별도의 불이익은 없습니다.{"\n"}
        o 개인정보 처리자 : 그리니{"\n"}
        o 개인정보 보호 문의 : [greeni4child@gmail.com]{"\n"}(mailto:greeni4child@gmail.com){"\n"}
      </Text>

      <Text style={styles.sectionTitle}>나. 수집 및 이용 항목</Text>
      <Text style={styles.paragraph}>
        회사는 회원가입, 서비스 이용, 고객 문의 처리 과정에서 다음과 같은
        개인정보를 수집할 수 있습니다.
      </Text>
      <Text style={styles.item}>o 필수항목 : 성명(한글), 생년월일, 아이디, 로그인 인증번호{"\n"}</Text>

      <Text style={styles.sectionTitle}>다. 개인정보의 보유 및 이용 기간</Text>
      <Text style={styles.paragraph}>
        o 사용자의 개인정보 수집ㆍ이용에 관한 동의일로부터 탈퇴시까지 위 이용목적을 위하여 보유 및 이용하게 됩니다.{"\n"}
        o 회원 탈퇴 시, 수집된 개인정보는 지체 없이 파기됩니다.{"\n"}
      </Text>

      <Text style={styles.sectionTitle}>라. 동의를 거부할 권리 및 동의를 거부할 경우의 불이익</Text>
      <Text style={styles.paragraph}>
        위 개인정보 중 필수정보의 수집ㆍ이용에 관한 동의는 '그리니' 활동의 진행을 위해 필수적이므로, 위 사항에 동의하셔야만 활동에 참여가 가능합니다.
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