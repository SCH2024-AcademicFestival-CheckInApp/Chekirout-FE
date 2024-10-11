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
      // 스탬프 카드가 없는 경우 (404) 예외처리
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; 
      }
      throw error;
    }
  };