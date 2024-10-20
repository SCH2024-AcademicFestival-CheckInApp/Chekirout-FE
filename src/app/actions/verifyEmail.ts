"use server";

import axios from 'axios';

export async function verifyEmail(token: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/verify-email`, {
      params: { token },
    });
    return response.data; 
  } catch (error) {
    console.error('이메일 인증 오류:', error);
    throw new Error('이메일 인증 실패');
  }
}
