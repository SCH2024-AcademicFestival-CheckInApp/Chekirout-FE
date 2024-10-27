import { useState } from 'react';
import { ApiError, ErrorConfig, isApiErrorResponse, isStringError } from '@/types/error';
import { isAxiosError } from 'axios';
import { getErrorConfig } from '@/constants/errorConfig';

export const useErrorHandler = () => {
  const [errorConfig, setErrorConfig] = useState<ErrorConfig | null>(null);

  const handleError = (error: unknown) => {
    if (isAxiosError(error) && error.response) {
      if (error.response.status === 400 && isStringError(error.response.data) && 
          error.response.data === "Incorrect username or password") {
        setErrorConfig({
          message: "학번 또는 비밀번호가 일치하지 않습니다.\n다시 입력해 주세요.",
          actions: [
            {
              label: "확인",
              action: () => setErrorConfig(null),
              style: "primary"
            }
          ]
        });
        return;
      }

      if (isApiErrorResponse(error.response.data)) {
        const config = getErrorConfig(error.response.data.code);
        setErrorConfig({
          ...config,
          actions: config.actions.map(action => ({
            ...action,
            action: () => {
              setErrorConfig(null);
              action.action();
            }
          }))
        });
        return;
      }
    }

    if (isAxiosError(error) && !error.response) {
      setErrorConfig({
        message: "인터넷 연결이 불안정합니다.\n네트워크 상태를 확인해 주세요.",
        actions: [{
          label: "다시 시도",
          action: () => window.location.reload(),
          style: "primary"
        }]
      });
      return;
    }

    const defaultConfig = getErrorConfig(-1);
    setErrorConfig({
      ...defaultConfig,
      actions: defaultConfig.actions.map(action => ({
        ...action,
        action: () => {
          setErrorConfig(null);
          action.action();
        }
      }))
    });
  };

  const clearError = () => {
    setErrorConfig(null);
  };

  return {
    errorConfig,
    handleError,
    clearError
  };
};