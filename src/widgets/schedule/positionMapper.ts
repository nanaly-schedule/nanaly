import { PositionResponse } from '@/src/features/schedule/api/position';

import { SchedulePosition } from './mock';

export function mapPositionResponse(
  position: PositionResponse,
): SchedulePosition | null {
  const id = position.positionId ?? position.id;
  const name = position.positionName ?? position.name;
  const color = position.positionColor ?? position.color;

  if (!id || !name || !color) {
    return null;
  }

  return { id, name, color };
}

export function mapPositionResponses(
  positions: PositionResponse[],
): SchedulePosition[] {
  return positions
    .map(mapPositionResponse)
    .filter((position): position is SchedulePosition => !!position);
}
