import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export interface UserInfo {
  username: string;
  name: string;
  department: string;
  role: string;
  isNotificationEnabled: boolean | null;
  phone: string;
  email: string;
  deviceToken: string | null;
  deviceName: string;
}

export function useUserInfo() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        router.push("/login");
        return;
      }

      try {
        const response = await axios.get<UserInfo>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/profile`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserInfo(response.data);
      } catch (error) {
        console.error("사용자 정보 조회 실패:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, [router]);

  return { userInfo, isLoading };
}
