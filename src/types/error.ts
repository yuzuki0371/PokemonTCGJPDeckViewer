// エラー関連の型定義

export const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DUPLICATE_ERROR: 'DUPLICATE_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED'
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  details?: Record<string, unknown>;
}

// エラー作成ヘルパー関数
export const createAppError = (
  type: ErrorType,
  message: string,
  originalError?: Error,
  details?: Record<string, unknown>
): AppError => ({
  type,
  message,
  originalError,
  details
});

// エラー判定ヘルパー関数
export const isQuotaExceededError = (error: Error): boolean => {
  return error.name === 'QuotaExceededError' || 
         error.message.includes('quota') ||
         error.message.includes('storage');
};

export const isNetworkError = (error: Error): boolean => {
  return error.name === 'TypeError' && 
         (error.message.includes('fetch') || 
          error.message.includes('network'));
};