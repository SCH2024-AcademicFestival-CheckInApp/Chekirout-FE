import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ParticipateRequestBody {
  latitude: number;
  longitude: number;
  timestamp: string;
  token: string; 
}

export async function POST(
  request: NextRequest,
  { params }: { params: { programId: string } }
) {
  const { programId } = params;

  let body: ParticipateRequestBody;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ error: '잘못된 요청 본문' }, { status: 400 });
  }

  if (!body.latitude || !body.longitude || !body.timestamp || !body.token) {
    return NextResponse.json({ error: '위치 정보, 타임스탬프, 그리고 액세스 토큰이 필요합니다.' }, { status: 400 });
  }

  try {
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/programs/${programId}/participate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${body.token}`,  // 클라이언트에서 받은 토큰을 사용
      },
      body: JSON.stringify({
        latitude: body.latitude,
        longitude: body.longitude,
        timestamp: body.timestamp,
      }),
    });

    const responseData = await backendResponse.json();
    // console.log('response:', JSON.stringify(responseData));

    if (!backendResponse.ok) {
      const errorMessage = responseData.error || '알 수 없는 오류가 발생했습니다.';
      return NextResponse.json({ error: errorMessage }, { status: backendResponse.status });
    }
    
    return NextResponse.json({ message: responseData.message || '프로그램 참여가 완료되었습니다.' });

  } catch (error) {
    console.error('Program participation error:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}