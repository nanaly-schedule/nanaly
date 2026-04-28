export interface BirthDateValue {
  year: number;
  month: number;
  day: number;
}

export const defaultBirthDate: BirthDateValue = {
  year: 2000,
  month: 1,
  day: 1,
};

export function createNumberRange(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function formatBirthDate({ year, month, day }: BirthDateValue) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;
}

export function parseBirthDate(value?: string | null): BirthDateValue | null {
  if (!value) {
    return null;
  }

  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return null;
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}
