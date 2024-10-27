import { ErrorConfig } from "../types/error"
import { ErrorCode } from './errorCodes';

export const getErrorConfig = (errorCode: number): ErrorConfig => {
  switch (errorCode) {
    case ErrorCode.ADMIN_UNAUTHORIZED:
      return {
        message: "관리자 권한이 필요한 기능입니다.",
        actions: [
          {
            label: "돌아가기",
            action: () => window.history.back(),
            style: "primary"
          }
        ]
      };

    case ErrorCode.CATEGORY_NOT_FOUND:
      return {
        message: "카테고리를 찾을 수 없습니다.\n다시 확인해 주세요.",
        actions: [
          {
            label: "확인",
            action: () => {},
            style: "primary"
          }
        ]
      };

    case ErrorCode.CATEGORY_ALREADY_EXIST:
      return {
        message: "이미 존재하는 카테고리입니다.\n다른 이름을 사용해 주세요.",
        actions: [
          {
            label: "확인",
            action: () => {},
            style: "primary"
          }
        ]
      };

    case ErrorCode.PROGRAM_NOT_FOUND:
      return {
        message: "프로그램을 찾을 수 없습니다.\n삭제되었거나 존재하지 않는 프로그램입니다.",
        actions: [
          {
            label: "프로그램 목록으로",
            action: () => window.location.href = '/programs',
            style: "primary"
          },
          {
            label: "닫기",
            action: () => {},
            style: "secondary"
          }
        ]
      };

    case ErrorCode.STAMP_CARD_NOT_FOUND:
      return {
        message: "스탬프 카드를 찾을 수 없습니다.\n다시 확인해 주세요.",
        actions: [
          {
            label: "내 스탬프 카드 확인",
            action: () => window.location.href = '/user',
            style: "primary"
          }
        ]
      };

    case ErrorCode.STAMP_CARD_ALREADY_EXIST:
      return {
        message: "이미 스탬프 카드를 보유하고 있습니다.",
        actions: [
          {
            label: "내 스탬프 카드 확인",
            action: () => window.location.href = '/user',
            style: "primary"
          },
          {
            label: "닫기",
            action: () => {},
            style: "secondary"
          }
        ]
      };

    case ErrorCode.ALREADY_PARTICIPATED:
      return {
        message: "이미 참여한 프로그램입니다.\n다른 프로그램에 참여해 보세요.",
        actions: [
          {
            label: "다른 프로그램 보기",
            action: () => window.location.href = '/user/event',
            style: "primary"
          }
        ]
      };

    case ErrorCode.DISTANCE_OUT_OF_RANGE:
      return {
        message: "참여 가능 거리를 벗어났습니다.\n프로그램 장소로 이동해 주세요.",
        actions: [
          {
            label: "위치 다시 확인",
            action: () => window.location.reload(),
            style: "primary"
          }
        ]
      };

    case ErrorCode.PROGRAM_NOT_WITHIN_PARTICIPATION_TIME:
      return {
        message: "프로그램 참여 가능 시간이 아닙니다.\n참여 가능 시간을 확인해 주세요.",
        actions: [
          {
            label: "참여 시간 확인",
            action: () => {},
            style: "primary"
          }
        ]
      };

    case ErrorCode.STUDENT_ID_ALREADY_EXISTS:
      return {
        message: "이미 가입된 학번입니다.",
        actions: [
          {
            label: "로그인하기",
            action: () => window.location.href = '/login',
            style: "primary"
          },
        //   {
        //     label: "비밀번호 찾기",
        //     action: () => window.location.href = '/forgot-password',
        //     style: "secondary"
        //   }
        ]
      };

    case ErrorCode.USER_NOT_FOUND:
      return {
        message: "등록되지 않은 학번입니다.\n회원가입 후 이용해 주세요.",
        actions: [
          {
            label: "회원가입",
            action: () => window.location.href = '/register',
            style: "primary"
          },
          {
            label: "돌아가기",
            action: () => {},
            style: "secondary"
          }
        ]
      };

    case ErrorCode.PASSWORD_MISMATCH:
      return {
        message: "비밀번호가 일치하지 않습니다.\n다시 확인해 주세요.",
        actions: [
        //   {
        //     label: "비밀번호 찾기",
        //     action: () => window.location.href = '/forgot-password',
        //     style: "primary"
        //   },
          {
            label: "다시 시도",
            action: () => {},
            style: "secondary"
          }
        ]
      };

    case ErrorCode.EMAIL_ALREADY_EXISTS:
      return {
        message: "이미 가입된 이메일입니다.\n해당 계정으로 로그인해주세요.",
        actions: [
          {
            label: "로그인",
            action: () => window.location.href = '/login',
            style: "primary"
          },
        ]
      };

    case ErrorCode.TOKEN_NOT_FOUND:
      return {
        message: "인증 정보가 만료되었습니다.\n다시 로그인해 주세요.",
        actions: [
          {
            label: "로그인",
            action: () => window.location.href = '/login',
            style: "primary"
          }
        ]
      };

    case ErrorCode.TOKEN_NOT_EXPIRED:
      return {
        message: "이미 발송된 인증 메일이 있습니다.\n메일함을 확인해 주세요.",
        actions: [
          {
            label: "웹메일 확인",
            action: () => window.open('https://mail.sch.ac.kr/', '_blank'),
            style: "primary"
          },
          {
            label: "닫기",
            action: () => {},
            style: "secondary"
          }
        ]
      };

    case ErrorCode.TOKEN_EXPIRED:
      return {
        message: "인증 시간이 만료되었습니다.\n인증 메일을 다시 요청해주세요.",
        actions: [
          {
            label: "인증메일 다시받기",
            action: () => {}, 
            style: "primary"
          }
        ]
      };

    case ErrorCode.EMAIL_NOT_VERIFIED:
      return {
        message: "이메일 인증이 필요합니다.\n발송된 인증 메일을 확인해 주세요.",
        actions: [
          {
            label: "웹메일 확인",
            action: () => window.open('https://mail.sch.ac.kr/', '_blank'),
            style: "primary"
          },
          {
            label: "인증메일 다시받기",
            action: () => {}, 
            style: "secondary"
          }
        ]
      };

    case ErrorCode.DEVICE_NOT_MATCH:
      return {
        message: "다른 기기에서 로그인이 감지되었습니다.\n가입했던 기기로 로그인해주세요.",
        actions: [
          {
            label: "로그인",
            action: () => window.location.href = '/login',
            style: "primary"
          },
        ]
      };

    case ErrorCode.PRIZE_NOT_FOUND:
      return {
        message: "상품 정보를 찾을 수 없습니다.\n이미 종료되었거나 존재하지 않는 상품입니다.",
        actions: [
          {
            label: "상품 목록으로",
            action: () => window.location.href = '',
            style: "primary"
          }
        ]
      };

    case ErrorCode.PRIZE_WINNER_ALREADY_CLAIMED:
      return {
        message: "이미 수령한 상품입니다.",
        actions: [
          {
            label: "수령 내역 확인",
            action: () => window.location.href = '',
            style: "primary"
          },
          {
            label: "닫기",
            action: () => {},
            style: "secondary"
          }
        ]
      };

    case ErrorCode.NOT_ENOUGH_ELIGIBLE_PARTICIPANTS:
      return {
        message: "추첨에 필요한 최소 참가자 수에 도달하지 못했습니다.",
        actions: [
          {
            label: "확인",
            action: () => {},
            style: "primary"
          }
        ]
      };

    case ErrorCode.INTERNAL_SERVER_ERROR:
      return {
        message: "일시적인 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.",
        actions: [
          {
            label: "다시 시도",
            action: () => window.location.reload(),
            style: "primary"
          },
          {
            label: "관리자에게 문의",
            action: () => window.location.href = '',
            style: "secondary"
          }
        ]
      };

    default:
      return {
        message: "알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.",
        actions: [
          {
            label: "확인",
            action: () => {},
            style: "primary"
          }
        ]
      };
  }
};