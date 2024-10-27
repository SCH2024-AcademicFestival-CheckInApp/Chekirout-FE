import { useState } from 'react';
import { ApiError, ErrorConfig } from '@/types/error';
import { getErrorConfig } from '@/constants/errorConfig';
import { isApiError } from '@/types/error';

export const useErrorHandler = () => {
  const [errorConfig, setErrorConfig] = useState<ErrorConfig | null>(null);

  const handleError = (error: unknown) => {
    if (isApiError(error)) {
      const errorResponse = error.response?.data;
      if (errorResponse) {
        const config = getErrorConfig(errorResponse.code);
        const actionsWithClose = config.actions.map(action => ({
          ...action,
          action: () => {
            setErrorConfig(null);
            action.action();
          }
        }));
        setErrorConfig({ ...config, actions: actionsWithClose });
        return;
      }
    }

    setErrorConfig({
      message: "알 수 없는 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.",
      actions: [{
        label: "확인",
        action: () => setErrorConfig(null),
        style: "primary"
      }]
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
