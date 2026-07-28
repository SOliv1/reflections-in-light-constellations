export const defaultSpecialDates = [
  { id: "summer-threshold", label: "Summer Threshold", month: 6, day: 21 },
  { id: "autumn-gathering", label: "Autumn Gathering", month: 9, day: 22 },
  { id: "winter-lantern", label: "Winter Lantern", month: 12, day: 21 },
];

function toInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) ? parsed : fallback;
}

export function buildSpecialDateLinks(year, dates) {
  const safeYear = toInt(year, new Date().getFullYear());
  const safeDates = Array.isArray(dates) ? dates : [];

  return safeDates
    .map((date, index) => {
      const month = toInt(date?.month, null);
      const day = toInt(date?.day, null);
      const label = typeof date?.label === "string" && date.label.trim()
        ? date.label.trim()
        : `Special Date ${index + 1}`;

      if (!month || !day || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }

      const isoDate = [
        safeYear,
        String(month).padStart(2, "0"),
        String(day).padStart(2, "0"),
      ].join("-");

      return {
        id: date?.id || `${safeYear}-${month}-${day}-${index}`,
        label,
        isoDate,
      };
    })
    .filter(Boolean);
}
