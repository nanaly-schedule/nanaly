import { formatBirthDate } from './date';

describe('formatBirthDate', () => {
  it('연월일을 YYYY-MM-DD 형식으로 변환한다', () => {
    expect(
      formatBirthDate({
        year: 2000,
        month: 1,
        day: 9,
      }),
    ).toBe('2000-01-09');
  });
});
