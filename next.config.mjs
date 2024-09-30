import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // (에러 핸들링) reactStrictMode 활성화
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const workboxPluginIndex = config.plugins.findIndex(
        (plugin) => plugin.constructor.name === "GenerateSW"
      );

      if (workboxPluginIndex !== -1) {
        const [workboxPlugin] = config.plugins.splice(workboxPluginIndex, 1);
        config.plugins.push(workboxPlugin);
      }
    }

    return config;
  },
};

export default withPWA({
  dest: "public", // public 폴더에 파일 생성
  disable: process.env.NODE_ENV === "development", // 개발자 모드에서 pwa 비활성화
  register: true, // 서비스 워커 등록
  skipWaiting: true,
})(nextConfig);
