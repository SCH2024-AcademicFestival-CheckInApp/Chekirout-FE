export function getApiUrl(endpoint: string): string {
    if (process.env.NODE_ENV === 'development') {       // 개발환경
      return `${process.env.NEXT_PUBLIC_API_URL}/api/v1${endpoint}`;
    } else if (process.env.NODE_ENV === 'test') {       // 테스트환경
        return `/api${endpoint}`;
    }
    else {      // 프로덕션 (임시)
      return `/api${endpoint}`;
    }
  }