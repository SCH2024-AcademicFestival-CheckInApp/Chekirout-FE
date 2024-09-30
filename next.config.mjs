import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // (에러 핸들링) reactStrictMode 활성화
};

const pwaConfig = {
  dest: "public", // public 폴더에 파일 생성
  disable: process.env.NODE_ENV === "development", // 개발자 모드에서 pwa 비활성화
  register: true, // 서비스 워커 등록
  skipWaiting: true,
};

export default withPWA(pwaConfig)(nextConfig);
