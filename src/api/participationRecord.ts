import axios from 'axios';
import { ApiResponse } from '@/types/participationRecord';

export const fetchParticipationRecords = async (): Promise<ApiResponse> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("액세스 토큰이 없습니다.");
  }
  
  const response = await axios.get<ApiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/participation-records`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  
  return response.data;
};