import axios from 'axios';

export interface Stamp {
  categoryId: number;
  programId: string;
  categoryName: string;
  programName: string;
  timestamp: string;
}

export interface StampCardResponse {
  studentName: string;
  studentId: string;
  stampCount: number;
  stamps: Stamp[];
  isCompleted: string | null;
}

export const fetchStampCard = async (): Promise<StampCardResponse | null> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }

  try {
    const response = await axios.get<StampCardResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/stamp-cards`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // 로그인되지 않은 사용자
      if (error.response?.status === 403) {
        localStorage.removeItem("accessToken"); 
        throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
      }
      if (error.response?.status === 404) {
        return null; // 스탬프 카드가 없는 경우
      }
    }
    throw new Error("스탬프 카드를 불러오는 중 오류가 발생했습니다.");
  }
};