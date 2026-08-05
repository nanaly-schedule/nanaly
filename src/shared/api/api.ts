import * as Sentry from '@sentry/react-native';
import axios, {
  AxiosError,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { router } from 'expo-router';

import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveAccessToken,
  saveRefreshToken,
} from '@/src/features/auth/lib/storage';

export const apiClient = axios.create({
  baseURL: 'https://staging-api.nanaly-schedule.com/',
  timeout: 10000,
});

function shouldCaptureApiError(error: AxiosError) {
  const status = error.response?.status;

  if (!status) {
    return true;
  }

  return status >= 500;
}

// 요청 인터셉터: 모든 API 요청에 Access Token 자동 추가
apiClient.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig,
  ): Promise<InternalAxiosRequestConfig> => {
    const accessToken = await getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: unknown): Promise<never> => {
    Sentry.captureException(error, {
      tags: {
        area: 'api',
        phase: 'request',
      },
    });
    return Promise.reject(error);
  },
);

// 응답 인터셉터: 401 에러 시 Refresh Token으로 재발급 시도
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError): Promise<any> => {
    interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
      _retry?: boolean;
      headers: AxiosRequestHeaders;
    }

    const originalRequest = error.config as ExtendedAxiosRequestConfig;
    const requestUrl = originalRequest?.url ?? '';
    const isPublicAuthRequest = [
      '/auth/login',
      '/auth/signup',
      '/auth/google',
      '/auth/apple',
      '/auth/send-code',
      '/auth/verify-code',
      'auth/reset-password',
    ].some((path) => requestUrl.includes(path));

    // 401 에러이고, 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      !isPublicAuthRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // Refresh Token으로 새 Access Token 발급
        const newAccessToken: string | null = await refreshAccessToken();

        if (newAccessToken) {
          // 새 토큰으로 원래 요청 재시도
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }

        await handleAuthFailure();
      } catch (refreshError: unknown) {
        // Refresh Token도 만료된 경우 로그아웃 처리
        Sentry.captureException(refreshError, {
          tags: {
            area: 'api',
            action: 'refreshAccessToken',
          },
          extra: {
            requestUrl,
          },
        });
        await handleAuthFailure();
        return Promise.reject(refreshError);
      }
    }

    if (shouldCaptureApiError(error)) {
      Sentry.captureException(error, {
        tags: {
          area: 'api',
          action: 'response',
        },
        extra: {
          requestUrl,
          method: originalRequest?.method,
          status: error.response?.status,
        },
      });
    }

    return Promise.reject(error);
  },
);

/**
 * Refresh Token을 사용하여 새로운 Access Token을 발급받습니다.
 * Refresh Token은 1회성이므로, 재발급 시 새로운 Refresh Token도 함께 저장해야 합니다.
 */
async function refreshAccessToken(): Promise<string | null> {
  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const { data } = await axios.post<{
      accessToken: string;
      refreshToken: string;
    }>(`${apiClient.defaults.baseURL}auth/refresh`, { refreshToken });

    await saveAccessToken(data.accessToken);
    await saveRefreshToken(data.refreshToken);

    return data.accessToken;
  } catch {
    return null;
  }
}

async function handleAuthFailure() {
  await clearTokens();
  router.replace('/auth');
}
