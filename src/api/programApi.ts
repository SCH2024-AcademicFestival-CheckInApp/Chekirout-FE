import axios from 'axios';

export const participateInProgram = async (
  programId: string,
  position: GeolocationPosition,
  token: string | null
): Promise<string> => {
  const locationData = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: new Date().toISOString(),
    token: token,
  };

  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs/${programId}/participate`;

  try {
    const response = await axios.post(backendUrl, locationData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    // console.log('Response status:', response.status);
    // console.log('Response headers:', JSON.stringify(response.headers));
    // console.log('Response data:', response.data);

    return response.data.message || '프로그램 참여가 완료되었습니다.';

  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.error('Axios error details:');
      // console.error('Status:', error.response?.status);
      // console.error('Status Text:', error.response?.statusText);
      // console.error('Headers:', JSON.stringify(error.response?.headers));
      // console.error('Data:', JSON.stringify(error.response?.data));
      // console.error('Config:', JSON.stringify(error.config));

      const errorMessage = error.response?.data?.error || `서버 오류: ${error.response?.status} - ${error.response?.statusText}`;
      console.error('Error message:', errorMessage);
      throw new Error(errorMessage);
    } else {
      console.error('Non-Axios error:', error);
      throw new Error('서버 요청 중 오류가 발생했습니다.');
    }
  }
};