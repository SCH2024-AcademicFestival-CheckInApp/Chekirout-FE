export const handleQRScan = (result: string): string => {
    const url = new URL(result);
    const programId = url.searchParams.get('programId');
  
    if (!url.pathname.includes('/check-in') || !programId) {
      throw new Error('유효하지 않은 QR 코드입니다.');
    }
  
    return programId;
  };