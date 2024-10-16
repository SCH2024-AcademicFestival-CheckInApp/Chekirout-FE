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
  
    const response = await fetch(`/api/programs/${programId}/participate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(locationData),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      return data.message || '프로그램 참여가 완료되었습니다.';
    } else {
      throw new Error(data.error || '프로그램 참여에 실패했습니다.');
    }
  };