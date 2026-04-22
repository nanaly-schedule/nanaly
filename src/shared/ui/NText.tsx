import { StyleSheet, Text, TextProps } from 'react-native';

// export const stylesTextH1 = "700 20px/24 Pretendard"; // 앱타이틀, 온보딩타이틀, 바텀모달타이틀
// export const stylesTextH2 = "700 18px/24 Pretendard"; // 매장명, 공지 상페 타이틀, 피커숫자
// export const stylesTextB16 = "700 16px/22 Pretendard"; // 근무카드시간, 페이지 헤더타이틀, 스케줄 시간표시
// export const stylesTextM16 = "500 16px/20 Pretendard"; // CTA 버튼, 모달 본문, 로그인 서브 문구, 피커 단위
// // 메인 섹션 헤딩 "근무 일정", "공지사항", "근무자 리스트"
// // 공지 리스트(14px) 타이틀 "[필독] 이번 주말..."
// // 공지 작성 헤더 텍스트 버튼 "등록"
// export const stylesTextB14 = "700 14px/18 Pretendard";
// // 마이페이지 텍스트 카드 "프로필 정보", "알림 설정", "로그아웃"
// // 앱정보 항목 "개인정보 처리방침", "버전"
// // 알림 설정 항목 "공지 등록", "스케줄 변경", "근무 하루전"
// // 매장 가입 "나날이 관리자"
// export const stylesTextSb14 = "600 14px/16 Pretendard";
// // 텍스트필드 플레이스홀더
// // 회원가입 필드 라벨
// // 공지 상세 본문 텍스트
// // 직급 표시 "알바" / 시간 정보 "(총 18시간)"
// // 인증 버튼
// export const stylesTextM14 = "500 14px/16 Pretendard";
// export const stylesTextR14 = "400 14px/16 Pretendard"; // 필드라벨, 세그먼트, 탭(일간/주간)
// // 공지작성 본문 영역
// // 메모 작성 영역
// // 약관 전문 표시 영역
// export const stylesTextR14L = "400 14px/24 Pretendard";
// export const stylesTextB12 = "700 12px/14 Pretendard"; // 메인 홈 공지카드 타이틀
// // 근무카드 총시간
// // 로그인 페이지 링크문구 "회원가입", "간편로그인", "비밀번호찾기"
// // 인증타이머
// // 인증오류
// // 마이페이지 섹션 라벨
// export const stylesTextM12 = "500 12px/14 Pretendard";
// // 메인 공지카드 서브텍스트
// // 드롭다운 리스트
// export const stylesTextR12 = "400 12px/14 Pretendard";
// // 하단 내비라벨
// // 근무상태뱃지
// // 근무카드 날짜
// export const stylesTextMicro = "500 10px/12 Pretendard";
interface NTextProps extends TextProps {
  variant:
    | 'h1'
    | 'h2'
    | 'b16'
    | 'm16'
    | 'b14'
    | 'sb14'
    | 'm14'
    | 'r14'
    | 'r14l'
    | 'b12'
    | 'm12'
    | 'r12'
    | 'micro';
}

export default function NText({ variant, children, style, ...props }: NTextProps) {
  return (
    <Text style={[styles[variant], style]} {...props}>
      {children}
    </Text>
  );
}
const styles = StyleSheet.create({
  h1: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 24,
  },
  h2: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
  },
  b16: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
  },
  m16: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
  },
  b14: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  sb14: {
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16,
  },
  m14: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
  },
  r14: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 16,
  },
  r14l: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 24,
  },
  b12: {
    fontFamily: 'Pretendard',
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 14,
  },
  m12: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 12,
    lineHeight: 14,
  },
  r12: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 14,
  },
  micro: {
    fontFamily: 'Pretendard',
    fontWeight: '500',
    fontSize: 10,
    lineHeight: 12,
  },
});
