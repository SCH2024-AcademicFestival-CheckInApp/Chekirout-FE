"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Clock } from 'lucide-react';
import { messaging, getToken, onMessage } from '@/firebase';

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

export default function NotificationPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    // localStorage에서 알림 설정 상태를 가져옴
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('notificationsEnabled');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);

  useEffect(() => {
    fetchNotifications();
    if (notificationsEnabled) {
      requestFCMToken();
    }

    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      setNotifications((prev) => [...prev, {
        id: String(Date.now()),
        message: payload.notification?.body || '',
        timestamp: new Date().toISOString()
      }]);
    });

    return () => unsubscribe();
  }, [notificationsEnabled]);

  const requestFCMToken = async () => {
    try {
      const token = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotifications = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem('notificationsEnabled', 'false');
      setNotificationPermission('denied');
    } else {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notificationsEnabled', 'true');
        setNotificationPermission('granted');
        requestFCMToken();
      } else {
        alert('알림 권한이 필요합니다.');
      }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <main className="w-full min-h-screen bg-gray-100 pt-[76px] pb-20">
      <div className="px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">실시간 알림</h1>
        <p className="text-sm text-gray-500 mb-4">프로그램 시작 알림을 확인하세요</p>
      </div>

      <div className="p-6 bg-gray-100">
        <h2 className="text-lg font-bold mb-4">알림 설정</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">알림 받기</p>
            <p className="text-sm text-gray-500">
              {notificationsEnabled ? "알림이 켜져 있습니다" : "알림이 꺼져 있습니다"}
            </p>
          </div>
          <button
            onClick={handleToggleNotifications}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out ${
              notificationsEnabled ? 'bg-[#235698]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          현재 알림 권한: {notificationPermission === 'granted' ? "허용됨" : notificationPermission === 'denied' ? "거부됨" : "대기 중"}
        </p>
      </div>

      <div className="px-6">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#235698]"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-gray-600">알림을 불러오는 중 오류가 발생했습니다.</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <CalendarCheck className="w-10 h-10 text-[#235698]" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">등록된 알림이 없습니다</h3>
            <p className="text-sm text-gray-500 text-center">곧 새로운 알림이 등록될 예정입니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDate(notification.timestamp)}
                </div>
                <div className="font-bold text-gray-900">{notification.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
