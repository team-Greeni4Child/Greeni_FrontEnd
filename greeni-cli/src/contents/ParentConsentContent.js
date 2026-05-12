import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function ChildPrivacyPolicyContent() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.updatedAt}>최종 업데이트일: 2026.05.12</Text>

      <Paragraph>
        그리니(이하 “그리니”)는 만 14세 미만 아동의 개인정보를 보호하기 위하여 관련 법령을
        준수합니다.
      </Paragraph>

      <SectionTitle>제1조 (법정대리인의 동의)</SectionTitle>
      <Paragraph>
        개인정보보호법 제22조2 제1항에 의거 만 14세 미만 미성년자의 개인정보를 수집하기 위해서는
        법정대리인의 동의가 필요합니다. 그리니는 만 14세 미만 아동의 개인정보를 처리할 경우에는
        법정대리인의 동의를 모두 받은 경우에만 정보를 수집합니다. 법정대리인은 아동의 개인정보에
        대한 조회, 수정, 삭제 등 동의를 철회할 수 있는 권리를 보장합니다.
      </Paragraph>

      <SectionTitle>제2조 (처리하는 개인정보의 항목)</SectionTitle>
      <Paragraph>그리니는 서비스 제공을 위해 다음과 같은 개인정보를 수집할 수 있습니다.</Paragraph>

      <SubTitle>1. 회원가입 및 이용 시 수집 항목</SubTitle>
      <SmallTitle>필수 항목</SmallTitle>
      <Bullet>이메일 주소</Bullet>
      <Bullet>비밀번호</Bullet>
      <Bullet>생년월일</Bullet>
      <Bullet>닉네임 또는 이름</Bullet>

      <SmallTitle>서비스 이용 과정에서 수집될 수 있는 항목</SmallTitle>
      <Bullet>서비스 이용 기록</Bullet>
      <Bullet>접속 로그</Bullet>
      <Bullet>기기 정보(OS, 기기 식별 정보, 앱 버전 등)</Bullet>
      <Bullet>IP 주소</Bullet>
      <Bullet>접속 일시</Bullet>
      <Bullet>오류 기록</Bullet>

      <SubTitle>2. AI 기능 이용 시 수집 항목</SubTitle>
      <Paragraph>그리니는 AI 기반 기능 제공을 위하여 다음 정보를 처리할 수 있습니다.</Paragraph>
      <Bullet>텍스트 데이터</Bullet>
      <SubBullet>이용자가 입력한 이미지 내 포함된 정보</SubBullet>
      <SubBullet>감정 기록 및 일기 내용</SubBullet>

      <Bullet>음성 데이터</Bullet>
      <SubBullet>음성 인식(STT) 기능 사용 시 업로드되는 음성 입력 데이터</SubBullet>

      <Bullet>이미지 데이터</Bullet>
      <SubBullet>이용자가 업로드한 사진 및 이미지 파일</SubBullet>

      <SectionTitle>제3조 (개인정보의 처리 목적)</SectionTitle>
      <Paragraph>
        그리니는 서비스 제공 및 운영을 위하여 필요한 최소한의 범위 내에서 개인정보를
        수집·이용합니다. 귀하는 아래 내용을 충분히 숙지한 후 동의 여부를 결정할 권리가 있습니다.
      </Paragraph>
      <Paragraph>
        서비스 제공을 위해 반드시 필요한 최소한의 정보를 필수항목으로, 그 외 특화된 서비스를
        제공하기 위해 추가 수집하는 정보는 선택항목으로 동의를 받고 있으며, 선택항목에 동의하지 않은
        경우에도 서비스 이용 제한은 없습니다.
      </Paragraph>
      <Paragraph>회원관리, 서비스 제공·개선 등을 위해 개인정보를 이용합니다.</Paragraph>

      <Bullet>회원 식별/가입의사 확인, 본인 확인</Bullet>
      <Bullet>
        14세 미만 아동의 개인정보 수집 시 법정대리인 동의여부 확인, 법정대리인 권리행사 시 본인 확인
      </Bullet>
      <Bullet>음성·텍스트·이미지 기반 기능 제공</Bullet>
      <Bullet>인공지능 기반 콘텐츠 생성 및 처리</Bullet>
      <SubBullet>이용자가 발화한 음성의 텍스트 변환(STT)</SubBullet>
      <SubBullet>이용자 식별 데이터가 포함된 이미지 파일</SubBullet>
      <SubBullet>이용자가 발화한 음성의 문서 요약</SubBullet>
      <Bullet>서비스 이용 기록 분석 및 품질 개선</Bullet>
      <Bullet>고객 문의 응대 및 공지사항 전달</Bullet>
      <Bullet>서비스 안정성 및 보안 유지</Bullet>
      <Bullet>부정 이용 방지 및 운영 정책 관리</Bullet>

      <SectionTitle>제4조 (법정대리인의 권리와 행사 방법)</SectionTitle>
      <Paragraph>
        법정대리인은 아동의 개인정보 처리에 관하여 아래와 같은 권리를 가질 수 있습니다.
      </Paragraph>
      <Bullet>개인정보 열람(조회)을 요구할 권리</Bullet>
      <Bullet>개인정보 정정을 요구할 권리</Bullet>
      <Bullet>개인정보 삭제 요구 및 동의철회/탈퇴를 요구할 권리</Bullet>

      <Paragraph>
        법정대리인 동의를 받기 위하여 아동에게 법정대리인의 성명, 연락처와 같이 최소한의 정보를
        요구할 수 있으며, 아래 방법으로 법정대리인의 동의를 확인합니다.
      </Paragraph>
      <Bullet>법정대리인의 휴대전화 본인인증을 통해 본인여부를 확인하는 방법</Bullet>
      <Bullet>법정대리인에게 동의내용이 적힌 서면을 제공하여 서명날인 후 제출하게 하는 방법</Bullet>
      <Bullet>
        그 밖에 위와 준하는 방법으로 법정대리인에게 동의내용을 알리고 동의의 의사표시를 확인하는
        방법
      </Bullet>

      <SectionTitle>제5조 (개인정보 보호책임자에 관한 사항)</SectionTitle>
      <Paragraph>
        그리니는 이용자의 개인정보 관련 문의사항 및 불만 처리 등을 위하여 아래의 방법으로 문의를
        받고 있습니다.
      </Paragraph>
      <Bullet>책임자: 배재진</Bullet>
      <Bullet>문의</Bullet>
      <SubBullet>이메일: greeni4child@gmail.com</SubBullet>
    </ScrollView>
  );
}

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function SubTitle({ children }) {
  return <Text style={styles.subTitle}>{children}</Text>;
}

function SmallTitle({ children }) {
  return <Text style={styles.smallTitle}>{children}</Text>;
}

function Paragraph({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }) {
  return <Text style={styles.item}>• {children}</Text>;
}

function SubBullet({ children }) {
  return <Text style={styles.subItem}>◦ {children}</Text>;
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    paddingBottom: 32,
  },
  updatedAt: {
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginTop: 28,
    marginBottom: 8,
    lineHeight: 30,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 26,
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginTop: 14,
    marginBottom: 8,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
    marginBottom: 12,
  },
  item: {
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
    marginLeft: 6,
    marginBottom: 6,
  },
  subItem: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
    marginLeft: 22,
    marginBottom: 4,
  },
});
