export interface ApiErrorResponse {
    code: number;
    error: string;
    errorCode: string;
  }
  
export interface ApiError {
    response?: {
      data: ApiErrorResponse;
      status: number;
      statusText: string;
      headers: Record<string, string>;
    };
    request?: any;
    message: string;
    status?: number;
    code?: string;
}
  
export interface ErrorAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}
  

  export interface ErrorConfig {
    message: string;
    actions: ErrorAction[];
  }
  
  export interface ErrorModalProps {
    message: string | null;
    actions: ErrorAction[];
    isLoading?: boolean;
  }
  
  export function isApiError(error: unknown): error is ApiError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as ApiError).response?.data === 'object'
    );
  }
  
  export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
    return (
      typeof data === 'object' &&
      data !== null &&
      'code' in data &&
      'error' in data &&
      'errorCode' in data
    );
  }