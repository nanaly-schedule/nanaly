import { apiClient } from '@/src/shared/api/api';

export type ScheduleScope = 'mine' | 'all';

export type CreateScheduleRequest = {
  memberId: string;
  positionId?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  memo?: string | null;
};

export type UpdateScheduleRequest = CreateScheduleRequest;

export type CreateUnavailableRequest = {
  date: string;
  isAllDay: boolean;
  startTime: string;
  endTime: string;
  reason: string;
};

export async function getDailySchedules(params: {
  storeId: string;
  date: string;
  positionId?: string | null;
}) {
  const { storeId, date, positionId } = params;

  return apiClient.get(`/stores/${storeId}/schedules/daily`, {
    params: {
      date,
      ...(positionId ? { positionId } : {}),
    },
  });
}

export async function getMonthlySchedules(params: {
  storeId: string;
  year: number;
  month: number;
  positionId?: string | null;
  scope?: ScheduleScope;
}) {
  const { storeId, year, month, positionId, scope } = params;

  return apiClient.get(`/stores/${storeId}/schedules/monthly`, {
    params: {
      year,
      month,
      ...(positionId ? { positionId } : {}),
      ...(scope ? { scope } : {}),
    },
  });
}

export async function createSchedule(
  storeId: string,
  data: CreateScheduleRequest,
) {
  return apiClient.post(`/stores/${storeId}/schedules`, data);
}

export async function deleteSchedule(storeId: string, scheduleId: string) {
  return apiClient.delete(`/stores/${storeId}/schedules/${scheduleId}`);
}

export async function updateSchedule(
  storeId: string,
  scheduleId: string,
  data: UpdateScheduleRequest,
) {
  return apiClient.patch(`/stores/${storeId}/schedules/${scheduleId}`, data);
}

export async function getDailyUnavailable(params: {
  storeId: string;
  date: string;
}) {
  const { storeId, date } = params;

  return apiClient.get(`/stores/${storeId}/unavailable/daily`, {
    params: { date },
  });
}

export async function getMonthlyUnavailable(params: {
  storeId: string;
  year: number;
  month: number;
}) {
  const { storeId, year, month } = params;

  return apiClient.get(`/stores/${storeId}/unavailable/monthly`, {
    params: { year, month },
  });
}

export async function createUnavailable(
  storeId: string,
  data: CreateUnavailableRequest,
) {
  return apiClient.post(`/stores/${storeId}/unavailable`, data);
}
