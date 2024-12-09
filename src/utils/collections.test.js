import { randomDate } from "./collections";

describe("randomDate", () => {
  it("should return a date within the specified range", () => {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date(2020, 11, 31).getTime();
    const result = randomDate(start, end, 0, 23);

    expect(result).toBeInstanceOf(Date);
    expect(result.getTime()).toBeGreaterThanOrEqual(start);
    expect(result.getTime()).toBeLessThanOrEqual(end);
  });

  it("should return a date with the correct hour range", () => {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date(2020, 0, 2).getTime();
    const startHour = 8;
    const endHour = 18;

    const result = randomDate(start, end, startHour, endHour);

    const hour = result.getHours();
    expect(hour).toBeGreaterThanOrEqual(startHour);
    expect(hour).toBeLessThanOrEqual(endHour);
  });

  it("should return a valid date when hour range is minimal (same start and end hours)", () => {
    const start = new Date(2020, 0, 1).getTime();
    const end = new Date(2020, 0, 2).getTime();
    const startHour = 5;
    const endHour = 5;

    const result = randomDate(start, end, startHour, endHour);

    const hour = result.getHours();
    expect(hour).toBe(startHour);
  });
});
