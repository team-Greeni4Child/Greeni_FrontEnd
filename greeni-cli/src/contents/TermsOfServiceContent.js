import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function TermsOfServiceContent() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.updatedAt}>최종 업데이트일: 2026.05.12</Text>

      <ChapterTitle>제1장 총칙</ChapterTitle>

      <SectionTitle>제1조 (목적)</SectionTitle>
      <Paragraph>
        그리니(이하 “그리니”)가 제공하는 서비스를 이용해 주셔서 감사합니다. 그리니는 이용자 여러분이
        서비스를 좀 더 편리하게 이용할 수 있도록 ‘그리니 서비스 이용약관’(이하 ‘본 약관’)을
        마련하였습니다. 본 약관은 여러분이 서비스를 이용하는 데 필요한 권리, 의무 및 책임사항,
        이용조건 및 절차 등 기본적인 사항을 규정하고 있으므로 조금만 시간을 내서 주의 깊게
        읽어주시기 바랍니다.
      </Paragraph>

      <SectionTitle>제2조 (약관의 효력 및 변경)</SectionTitle>
      <Bullet>
        본 약관의 내용은 그리니 서비스 화면에 게시하거나 기타의 방법으로 공지하고, 본 약관에 동의한
        여러분 모두에게 그 효력이 발생합니다.
      </Bullet>
      <Bullet>
        그리니는 필요한 경우 관련법령을 위배하지 않는 범위 내에서 본 약관을 변경할 수 있습니다. 본
        약관이 변경되는 경우, 변경사항을 시행일자 7일 전부터 적용일자 및 개정사유를 명시하여 서비스
        화면에 공지하는 것을 원칙으로 합니다.
      </Bullet>
      <Bullet>
        그리니의 이용자는 변경된 약관에 동의하지 않을 경우 이용계약을 해지할 수 있습니다.
      </Bullet>

      <SectionTitle>제3조 (용어의 정의)</SectionTitle>
      <Paragraph>본 약관에서 사용하는 용어의 정의는 다음과 같습니다.</Paragraph>
      <Numbered number="1">
        계정: 그리니가 제공하는 서비스를 이메일계정과 비밀번호로 회원 인증, 회원정보 변경, 회원가입
        및 탈퇴 등을 관리할 수 있도록 그리니가 정한 로그인계정 정책을 말합니다.
      </Numbered>
      <Numbered number="2">
        이용자: 그리니 서비스에서 본 약관에 동의하고, 이용하는 자를 말합니다.
      </Numbered>
      <Numbered number="3">
        이용계약: 그리니가 제공하는 신청서 양식에 정보를 기입하고, 본 약관에 동의하여 서비스
        이용계약을 완료시키는 행위를 말합니다.
      </Numbered>

      <ChapterTitle>제2장 이용계약</ChapterTitle>

      <SectionTitle>제4조 (계약의 성립)</SectionTitle>
      <Numbered number="1">
        이용신청은 서비스 회원가입 화면에서 여러분이 이메일 정보 및 비밀번호를 입력하는 방식으로
        이루어집니다.
      </Numbered>
      <Numbered number="2">
        이용계약은 여러분이 본 약관의 내용에 동의한 후 본 조 제1항에서 정한 이용신청을 하면 그리니가
        입력된 일정 정보를 인증한 후 가입을 승낙함으로써 체결됩니다.
      </Numbered>
      <Numbered number="3">
        본 이용약관에 대한 동의는 이용신청 당시 그리니의 ‘동의함’ 버튼을 누름으로써 의사표시를
        합니다.
      </Numbered>

      <SectionTitle>제5조 (이용의 제한)</SectionTitle>
      <Numbered number="1">
        제4조에 따른 가입 신청자에게 그리니는 원칙적으로 이용을 승낙합니다. 다만, 그리니는 아래 각
        호의 경우에는 그 사유가 해소될 때까지 승낙을 유보하거나 승낙하지 않을 수 있습니다. 특히,
        여러분이 만 14세 미만인 경우에는 부모님 등 법정대리인의 동의가 있는 경우에만 계정을 생성할
        수 있습니다.
      </Numbered>
      <SubBullet>
        여러분이 다른 사람의 이메일 주소 등 개인정보를 이용하여 계정을 생성하려 한 경우
      </SubBullet>
      <SubBullet>계정 생성 시 필요한 정보를 입력하지 않거나 허위의 정보를 입력한 경우</SubBullet>
      <SubBullet>제공 서비스 설비 용량에 현실적인 여유가 없는 경우</SubBullet>
      <SubBullet>서비스 제공을 위한 기술적인 부분에 문제가 있다고 판단되는 경우</SubBullet>
      <SubBullet>기타 서비스가 재정적, 기술적으로 필요하다고 인정하는 경우</SubBullet>
      <SubBullet>기타 관련법령에 위배되거나 세부지침 등 그리니가 정한 기준에 반하는 경우</SubBullet>
      <Numbered number="2">
        만약, 여러분이 위 조건에 위반하여 계정을 생성한 것으로 판명된 때에는 그리니는 즉시 여러분의
        계정 이용을 정지시키거나 삭제하는 등 적절한 제한을 할 수 있습니다.
      </Numbered>

      <ChapterTitle>제3장 서비스 이용</ChapterTitle>

      <SectionTitle>제6조 (서비스 이용시간)</SectionTitle>
      <Numbered number="1">
        서비스 이용시간은 그리니의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간을
        원칙으로 합니다.
      </Numbered>
      <Numbered number="2">
        제1항의 이용시간 중 정기점검 등의 필요로 인하여 그리니가 정한 날 또는 시간은 예외로 합니다.
      </Numbered>

      <SectionTitle>제7조 (서비스의 변경 및 중단)</SectionTitle>
      <Numbered number="1">
        그리니는 운영상, 기술상 필요에 따라 서비스의 전부 또는 일부를 변경, 수정 또는 중단할 수
        있습니다.
      </Numbered>
      <Numbered number="2">
        서비스 점검, 시스템 장애, 통신 장애, 천재지변 기타 불가항력적 사유가 발생한 경우 서비스
        제공이 일시적으로 제한되거나 중단될 수 있습니다.
      </Numbered>
      <Numbered number="3">
        그리니는 서비스의 변경 또는 중단이 예정된 경우 사전에 공지합니다. 다만 긴급한 장애 또는
        불가피한 사유가 있는 경우 사후에 공지할 수 있습니다.
      </Numbered>
      <Numbered number="4">
        그리니는 이용자의 약관 위반, 서비스 운영 방해 또는 관련 법령 위반 행위가 확인되는 경우
        서비스 이용을 제한하거나 회원 자격을 제한할 수 있습니다.
      </Numbered>
      <Numbered number="5">
        그리니는 관련 법령에 특별한 규정이 없는 한 무료로 제공되는 서비스와 관련하여 이용자에게
        발생한 손해에 대하여 책임을 지지 않습니다. 다만, 회사의 고의 또는 중대한 과실이 있는 경우는
        예외로 합니다.
      </Numbered>

      <ChapterTitle>제4장 의무 및 책임</ChapterTitle>

      <SectionTitle>제8조 (그리니의 의무)</SectionTitle>
      <Numbered number="1">
        그리니는 법령과 본 약관이 금지하거나 미풍양속에 반하는 행위를 하지 않으며, 지속적이고
        안정적으로 서비스를 제공하기 위해 노력할 의무가 있습니다.
      </Numbered>
      <Numbered number="2">
        그리니는 회원의 개인 신상 정보를 본인의 승낙 없이 타인에게 누설, 배포하지 않습니다. 다만,
        전기통신관련법령 등 관계법령에 의하여 관계 국가기관 등의 요구가 있는 경우에는 그러하지
        아니합니다.
      </Numbered>
      <Numbered number="3">
        그리니는 이용자가 안전하게 그리니 서비스를 이용할 수 있도록 이용자의 개인정보 보호를 위한
        보안시스템을 갖추어야 합니다.
      </Numbered>
      <Numbered number="4">
        그리니는 이용자의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.
      </Numbered>

      <SectionTitle>제9조 (이용자의 의무)</SectionTitle>
      <Numbered number="1">
        회원가입 시에 요구되는 정보는 정확하게 기입하여야 합니다. 또한 이미 제공된 이용자에 대한
        정보가 정확한 정보가 되도록 유지 및 갱신하여야 하며, 이용자는 자신의 이메일 및 비밀번호를
        제3자가 이용하게 해서는 안 됩니다.
      </Numbered>
      <Numbered number="2">
        이용자는 그리니의 사전 승낙 없이 서비스를 이용하여 어떠한 영리행위도 할 수 없습니다.
      </Numbered>
      <Numbered number="3">
        이용자는 그리니 서비스를 이용하여 얻은 정보를 그리니의 사전승낙 없이 복사, 복제, 변경, 번역,
        출판, 방송 기타의 방법으로 사용하거나 이를 타인에게 제공할 수 없습니다.
      </Numbered>

      <ChapterTitle>제5장 AI 서비스 및 콘텐츠</ChapterTitle>

      <SectionTitle>제10조 (AI 서비스 이용)</SectionTitle>
      <Numbered number="1">
        그리니는 생성형 AI 기술을 활용하여 대화, 감정 분석, 콘텐츠 생성 및 기타 기능을 제공할 수
        있습니다.
      </Numbered>
      <Numbered number="2">
        이용자는 서비스 이용 과정에서 입력한 텍스트, 음성, 이미지 등의 데이터가 AI 기능 제공 및
        서비스 품질 개선을 위하여 처리될 수 있음에 동의합니다.
      </Numbered>
      <Numbered number="3">
        그리니의 AI 서비스는 참고용으로 제공되며, 생성된 응답 및 결과의 완전한 정확성, 신뢰성 또는
        적합성을 보장하지 않습니다.
      </Numbered>
      <Numbered number="4">
        그리니가 제공하는 AI 기반 분석 및 응답은 의료적, 심리적, 정신건강적 진단 또는 전문적 상담을
        대체하지 않습니다.
      </Numbered>
      <Numbered number="5">
        이용자는 불법적이거나 타인의 권리를 침해하는 내용, 유해하거나 부적절한 내용을 입력하거나
        업로드하여서는 안 됩니다.
      </Numbered>

      <ChapterTitle>제6장 지적재산권 및 기타</ChapterTitle>

      <SectionTitle>제11조 (지적재산권)</SectionTitle>
      <Numbered number="1">
        그리니가 제공하는 서비스, 그에 필요한 소프트웨어, 이미지, 마크, 로고, 디자인, 서비스명칭,
        정보 및 상표 등과 관련된 지적재산권 및 기타 권리는 그리니에 소유권이 있습니다.
      </Numbered>
      <Numbered number="2">
        모든 이용자는 그리니가 명시적으로 승인한 경우를 제외하고는 전항의 각 재산에 대한 전부 또는
        일부의 수정, 대여, 대출, 판매, 배포, 제작, 양도, 재라이센스, 담보권 설정 행위, 상업적 이용
        행위를 할 수 없으며, 제3자로 하여금 이와 같은 행위를 하도록 허락할 수 없습니다.
      </Numbered>

      <SectionTitle>제12조 (손해배상)</SectionTitle>
      <Paragraph>
        그리니는 무료로 제공되는 서비스와 관련하여, 그리니의 고의 또는 중대한 과실로 인하여 발생한
        손해를 제외하고는 책임을 부담하지 않습니다.
      </Paragraph>

      <SectionTitle>제13조 (면책조항)</SectionTitle>
      <Numbered number="1">
        그리니는 천재지변, 정전, 통신 장애, 시스템 장애 및 기타 불가항력적인 사유로 인하여 서비스를
        제공할 수 없는 경우 이에 대한 책임을 지지 않습니다.
      </Numbered>
      <Numbered number="2">
        그리니는 이용자의 귀책사유로 인한 서비스 이용 장애 또는 손해에 대하여 책임을 지지 않습니다.
      </Numbered>
      <Numbered number="3">
        그리니는 서비스의 안정적인 제공을 위하여 정기점검, 서버 증설, 시스템 교체 등의 작업을 진행할
        수 있으며, 이 과정에서 서비스 이용이 일시적으로 제한될 수 있습니다.
      </Numbered>
      <Numbered number="4">
        그리니는 이용자가 서비스에 게시하거나 업로드한 정보, 자료 및 콘텐츠의 정확성, 신뢰성 또는
        적법성을 보장하지 않습니다.
      </Numbered>
      <Numbered number="5">
        그리니는 생성형 AI 기술 기반으로 서비스를 제공하며, AI가 생성한 응답, 분석 결과 및 콘텐츠의
        완전한 정확성이나 신뢰성을 보장하지 않습니다.
      </Numbered>
      <Numbered number="6">
        그리니의 AI 서비스는 참고용으로 제공되며, 의료적·심리적·정신건강적 진단 또는 전문적인 상담을
        대체하지 않습니다.
      </Numbered>
      <Numbered number="7">
        그리니는 이용자 간 또는 이용자와 제3자 간 발생한 분쟁에 개입하지 않으며, 이로 인하여 발생한
        손해에 대하여 책임을 지지 않습니다.
      </Numbered>
      <Numbered number="8">
        그리니는 무료로 제공되는 서비스와 관련하여 관련 법령에 특별한 규정이 없는 한 책임을 부담하지
        않습니다. 다만, 회사의 고의 또는 중대한 과실로 인한 경우는 예외로 합니다.
      </Numbered>

      <ChapterTitle>제7장 기타</ChapterTitle>

      <SectionTitle>제14조 (준거법 및 관할법원)</SectionTitle>
      <Paragraph>
        본 약관은 대한민국 법률에 따라 해석됩니다. 서비스와 관련한 분쟁은 대한민국 법원을 관할로
        합니다.
      </Paragraph>
    </ScrollView>
  );
}

function ChapterTitle({ children }) {
  return <Text style={styles.chapterTitle}>{children}</Text>;
}

function SectionTitle({ children }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function Paragraph({ children }) {
  return <Text style={styles.paragraph}>{children}</Text>;
}

function Bullet({ children }) {
  return <Text style={styles.bullet}>• {children}</Text>;
}

function SubBullet({ children }) {
  return <Text style={styles.subBullet}>• {children}</Text>;
}

function Numbered({ number, children }) {
  return (
    <View style={styles.numberedRow}>
      <Text style={styles.number}>{number}.</Text>
      <Text style={styles.numberedText}>{children}</Text>
    </View>
  );
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
    marginBottom: 10,
    lineHeight: 20,
  },
  chapterTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#222",
    marginTop: 28,
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginTop: 28,
    marginBottom: 8,
    lineHeight: 30,
  },
  paragraph: {
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
    marginBottom: 12,
  },
  bullet: {
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
    marginLeft: 8,
    marginBottom: 8,
  },
  subBullet: {
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
    marginLeft: 24,
    marginBottom: 6,
  },
  numberedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  number: {
    width: 26,
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
  },
  numberedText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    lineHeight: 25,
  },
});
