import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function PrivacyPolicyContent() {
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.updatedAt}>최종 업데이트일: 2026.05.12</Text>

      <Text style={styles.paragraph}>
        그리니(이하 “그리니”)는 「개인정보 보호법」 등 관련 법령에 따라 이용자의 개인정보를
        보호하고, 관련 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같은 개인정보처리방침을
        수립·공개합니다.
      </Text>

      <SectionTitle>제1조 (개인정보의 처리 목적)</SectionTitle>
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

      <SectionTitle>제3조 (개인정보의 수집 방법)</SectionTitle>
      <Paragraph>그리니는 다음과 같은 방법으로 개인정보를 수집합니다.</Paragraph>
      <Bullet>회원가입 및 로그인 과정</Bullet>
      <Bullet>서비스 이용 과정에서 이용자가 직접 입력</Bullet>
      <Bullet>음성·이미지 업로드 기능 이용</Bullet>
      <Bullet>고객 문의 과정</Bullet>
      <Bullet>서비스 이용 과정에서 자동 생성되는 정보 수집</Bullet>

      <SectionTitle>제4조 (개인정보의 제3자 제공에 대한 사항)</SectionTitle>
      <Paragraph>
        그리니는 고객의 개인정보를 개인정보의 처리 목적에서 명시한 범위 내에서만 처리하며, 고객의
        동의, 개인정보 보호법 제17조 및 제18조 등 법령에 특별한 규정이 있는 경우에만 개인정보를
        제3자에게 제공하고 그 이외에는 고객의 개인정보를 제3자에게 제공하지 않습니다.
      </Paragraph>

      <SectionTitle>제5조 (개인정보의 처리 및 보유 기간)</SectionTitle>
      <Paragraph>
        그리니는 개인정보 수집 및 처리 목적이 달성된 후 지체 없이 해당 정보를 파기합니다. 다만
        다음의 경우에는 관련 법령에 따라 일정 기간 보관할 수 있습니다.
      </Paragraph>
      <Bullet>회원 탈퇴 후 서비스 분쟁 및 부정 이용 방지를 위한 정보: 최대 24개월</Bullet>
      <Bullet>서비스 이용 기록 및 접속 로그: 최대 24개월</Bullet>
      <Bullet>관계 법령에 따라 보존이 필요한 경우: 해당 법령에서 정한 기간</Bullet>

      <SectionTitle>제6조 (개인정보 처리의 위탁 및 국외 이전)</SectionTitle>
      <Paragraph>
        그리니는 서비스 제공에 있어 반드시 필요한 업무 중 일부를 외부 업체에서 수행할 수 있도록 국내
        및 국외 소재의 업체에 위탁하고 있습니다.
      </Paragraph>

      <SubTitle>1. Amazon Web Services</SubTitle>
      <Bullet>수탁업체: Amazon Web Services, Inc.</Bullet>
      <Bullet>이전 국가: 미국</Bullet>
      <Bullet>이전 항목:</Bullet>
      <SubBullet>이메일</SubBullet>
      <SubBullet>프로필 이미지</SubBullet>
      <SubBullet>이미지, 텍스트, 음성 데이터를 포함한 이용자 활동 정보</SubBullet>
      <Bullet>이전 목적:</Bullet>
      <SubBullet>정보 저장을 통한 사용자 데이터 기록</SubBullet>
      <Bullet>이전 시점 및 방법:</Bullet>
      <SubBullet>서비스 이용 시 API 통신을 통한 전송</SubBullet>
      <Bullet>보유 및 이용 기간:</Bullet>
      <SubBullet>동의 철회 및 서비스 종료 후 즉시 파기</SubBullet>
      <Paragraph>문의: aws-korea-privacy@amazon.com</Paragraph>

      <SubTitle>2. OpenAI</SubTitle>
      <Bullet>수탁업체: OpenAI OpCo, LLC</Bullet>
      <Bullet>이전 국가: 미국</Bullet>
      <Bullet>이전 항목:</Bullet>
      <SubBullet>텍스트 데이터</SubBullet>
      <SubBullet>이미지 데이터</SubBullet>
      <SubBullet>음성 인식 처리 결과 텍스트</SubBullet>
      <Bullet>이전 목적:</Bullet>
      <SubBullet>AI 기반 콘텐츠 생성 및 감정 분석 기능 제공</SubBullet>
      <Bullet>이전 시점 및 방법:</Bullet>
      <SubBullet>서비스 이용 시 API 통신을 통한 전송</SubBullet>
      <Bullet>보유 및 이용 기간:</Bullet>
      <SubBullet>처리 목적 달성 시까지</SubBullet>
      <Paragraph>문의: privacy@openai.com</Paragraph>

      <SubTitle>3. NAVER CLOVA</SubTitle>
      <Bullet>수탁업체: NAVER CLOUD</Bullet>
      <Bullet>이전 국가: 대한민국</Bullet>
      <Bullet>이전 항목:</Bullet>
      <SubBullet>음성 텍스트 전사 데이터</SubBullet>
      <SubBullet>텍스트 음성 전사 데이터</SubBullet>
      <Bullet>이전 목적:</Bullet>
      <SubBullet>AI 기반 이용자 발화 해석 및 생성</SubBullet>
      <Bullet>이전 시점 및 방법:</Bullet>
      <SubBullet>서비스 이용 시 API 통신을 통한 전송</SubBullet>
      <Bullet>보유 및 이용 기간:</Bullet>
      <SubBullet>처리 목적 달성 시까지</SubBullet>

      <SectionTitle>제7조 (개인정보의 파기절차 및 파기방법)</SectionTitle>
      <Paragraph>
        수집 및 이용목적이 달성된 경우 수집한 개인정보는 지체없이 파기하며, 절차 및 방법은 아래와
        같습니다.
      </Paragraph>
      <Paragraph>
        수집 및 이용 목적의 달성 또는 회원 탈퇴 등 파기 사유가 발생한 경우 개인정보의 형태를
        고려하여 파기방법을 정합니다. 전자적 파일 형태인 경우 복구 및 재생되지 않도록 안전하게
        삭제하고, 그 밖에 기록물, 인쇄물, 서면 등의 경우 분쇄하거나 소각하여 파기합니다.
      </Paragraph>
      <Paragraph>
        외부 시스템(AWS, OpenAI, NAVER CLOVA 등)을 통해 처리되는 데이터는 각 수탁사의 보안 정책 및
        데이터 처리 절차에 따라 관리됩니다.
      </Paragraph>
      <Paragraph>다만, 다음의 경우에는 관련 법령에 따라 일정 기간 보관할 수 있습니다.</Paragraph>
      <Bullet>회원 탈퇴 후 서비스 분쟁 및 부정 이용 방지를 위한 정보: 최대 24개월</Bullet>
      <Bullet>서비스 이용 기록 및 접속 로그: 최대 24개월</Bullet>
      <Bullet>관계 법령에 따라 보존이 필요한 경우: 해당 법령에서 정한 기간</Bullet>

      <SectionTitle>제8조 (만 14세 미만 아동의 개인정보 보호)</SectionTitle>
      <Paragraph>
        그리니는 만 14세 미만 아동의 개인정보를 처리할 경우에는 법정대리인의 동의를 모두 받은
        경우에만 정보를 수집합니다. 법정대리인은 아동의 개인정보에 대한 조회, 수정, 삭제 등 동의를
        철회할 수 있는 권리를 보장합니다.
      </Paragraph>

      <SectionTitle>제9조 (이용자 및 법정대리인의 권리와 행사 방법)</SectionTitle>
      <Paragraph>
        이용자는 자신의 개인정보 처리에 관하여 아래와 같은 권리를 가질 수 있습니다.
      </Paragraph>
      <Bullet>개인정보 열람(조회)을 요구할 권리</Bullet>
      <Bullet>개인정보 정정을 요구할 권리</Bullet>
      <Bullet>개인정보 삭제 요구 및 동의철회/탈퇴를 요구할 권리</Bullet>
      <Paragraph>
        이용자는 서비스 내 다음과 같은 기능을 통해 언제든지 개인정보 열람(조회) 등의 권리를 직접
        행사하거나 또는 메일(greeni4child@gmail.com)을 통해 요청할 수 있습니다.
      </Paragraph>
      <Bullet>마이페이지 프로필 정보 수정</Bullet>
      <Bullet>마이페이지 프로필 삭제</Bullet>
      <Bullet>마이페이지 회원탈퇴</Bullet>
      <Paragraph>
        그리니는 이용자의 요청을 받은 경우 이를 지체없이 처리하며, 이용자가 개인정보의 오류에 대한
        정정을 요청한 경우 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다.
      </Paragraph>
      <Paragraph>
        14세 미만 아동의 개인정보를 처리할 경우에는 법정대리인의 동의를 받아야 합니다. 법정대리인은
        아동의 개인정보를 조회하거나 수정 및 삭제, 동의 철회 등의 권리를 행사할 수 있습니다.
      </Paragraph>
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

      <SectionTitle>제10조 (개인정보의 안전성 확보조치에 관한 사항)</SectionTitle>
      <Paragraph>그리니는 이용자의 개인정보 보호를 위해 아래의 노력을 합니다.</Paragraph>
      <Bullet>이용자의 개인정보를 암호화하고 있습니다.</Bullet>
      <SubBullet>
        이용자의 개인정보를 암호화된 통신구간을 이용하여 전송하고, 비밀번호 등 중요정보는 암호화하여
        보관하고 있습니다.
      </SubBullet>
      <Bullet>개인정보에 접근할 수 있는 사람을 최소화하고 있습니다.</Bullet>
      <SubBullet>
        개인정보를 처리하는 팀원을 최소한으로 제한하고 있습니다. 또한 개인정보처리 시스템에 대한
        비밀번호의 생성과 변경, 그리고 접근할 수 있는 권한에 대한 체계적인 기준을 마련하고 지속적인
        감사를 실시하고 있습니다.
      </SubBullet>

      <SectionTitle>제11조 (서비스 이용 시 접근 권한 안내)</SectionTitle>
      <Paragraph>
        그리니는 서비스 제공을 위하여 다음 접근 권한을 요청할 수 있습니다. 선택 권한은 동의하지
        않아도 되지만, 서비스를 사용함에 제한이 있을 수 있습니다.
      </Paragraph>
      <Bullet>필수 권한</Bullet>
      <SubBullet>인터넷 접근 권한</SubBullet>
      <Bullet>선택 권한</Bullet>
      <SubBullet>마이크: 음성 기능 이용</SubBullet>
      <SubBullet>카메라: 사진 촬영 기능 이용</SubBullet>
      <SubBullet>사진 및 저장공간: 이미지 업로드 기능 이용</SubBullet>

      <SectionTitle>제12조 (개인정보 보호책임자에 관한 사항)</SectionTitle>
      <Paragraph>
        그리니는 이용자의 개인정보 관련 문의사항 및 불만 처리 등을 위하여 아래의 방법으로 문의를
        받고 있습니다.
      </Paragraph>
      <Bullet>책임자: 배재진</Bullet>
      <Bullet>문의</Bullet>
      <SubBullet>이메일: greeni4child@gmail.com</SubBullet>

      <SectionTitle>제13조 (개인정보 처리방침 변경)</SectionTitle>
      <Paragraph>
        법령이나 서비스의 변경사항을 반영하기 위한 목적 등으로 개인정보 처리방침을 수정할 수
        있습니다. 개인정보 처리방침이 변경되는 경우 최소 7일 전 변경 사항을 사전에 안내하겠습니다.
        다만, 이용자 권리의 중대한 변경이 발생할 때에는 최소 15일 전에 미리 알려드리겠습니다.
      </Paragraph>
      <Paragraph>
        그리니는 이용자 여러분의 정보를 소중히 생각하며, 이용자가 더욱 안심하고 서비스를 이용할 수
        있도록 최선의 노력을 다할 것을 약속드립니다.
      </Paragraph>
      <Bullet>공고일자: 2026년 05월 12일</Bullet>
      <Bullet>시행일자: 2026년 05월 12일</Bullet>
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
    marginBottom: 10,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginTop: 28,
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
