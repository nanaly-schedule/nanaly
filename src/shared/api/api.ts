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
  baseURL: 'https://nanaly-backend-dev.up.railway.app/',
  timeout: 1000,
});

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
    const isLoginRequest = requestUrl.includes('/auth/login');

    // 401 에러이고, 아직 재시도하지 않은 경우
    if (
      error.response?.status === 401 &&
      !isLoginRequest &&
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
        await handleAuthFailure();
        return Promise.reject(refreshError);
      }
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

    // Refresh Token을 Authorization 헤더에 Bearer 형식으로 전송
    const { data } = await axios.post<{
      accessToken: string;
      refreshToken: string; // 새 Refresh Token도 함께 받아야 함
    }>(
      `${apiClient.defaults.baseURL}/auth/refresh`, // 실제 엔드포인트 확인 필요
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // Bearer 형식으로 전송
        },
      },
    );

    // 새 Access Token 저장
    await saveAccessToken(data.accessToken);

    // 새 Refresh Token도 저장 (기존 토큰 폐기되므로 필수!)
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
