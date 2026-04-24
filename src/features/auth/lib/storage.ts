import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Access Token을 저장합니다.
 */
export async function saveAccessToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error('Access Token 저장 실패:', error);
    throw error;
  }
}

/**
 * 저장된 Access Token을 조회합니다.
 */
export async function getAccessToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Access Token 조회 실패:', error);
    return null;
  }
}

/**
 * Refresh Token을 저장합니다.
 */
export async function saveRefreshToken(token: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
  } catch (error) {
    console.error('Refresh Token 저장 실패:', error);
    throw error;
  }
}

/**
 * 저장된 Refresh Token을 조회합니다.
 */
export async function getRefreshToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Refresh Token 조회 실패:', error);
    return null;
  }
}

/**
 * 모든 토큰을 삭제합니다 (로그아웃 시 사용).
 */
export async function clearTokens(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('토큰 삭제 실패:', error);
  }
}
