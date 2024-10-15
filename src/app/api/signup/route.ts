import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, department, name, password, role } = body

    const response = await axios.post(API_URL, {
      username,
      department,
      name,
      password,
      role
    })

    return NextResponse.json(response.data, { status: response.status })
  } catch (error) {
    console.error('Signup error:', error)
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    } else {
      return NextResponse.json({ message: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
  }
}