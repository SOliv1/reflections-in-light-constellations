export const defaultSpecialDates = [
  { id: "summer-threshold", label: "Summer Threshold", month: 6, day: 21 },
  { id: "autumn-gathering", label: "Autumn Gathering", month: 9, day: 22 },
  { id: "winter-lantern", label: "Winter Lantern", month: 12, day: 21 },
];

export function buildSpecialDateLinks(year, dates) {
  return (Array.isArray(dates) ? dates : []).map((date, index) => {
    const month = Number(date?.month);
    const day = Number(date?.day);
    if (!Number.isInteger(month) || !Number.isInteger(day) || month < 1 || month > 12 || day < 1 || day > 31) return null;
    return {
      id: date?.id || `${year}-${month}-${day}-${index}`,
      label: typeof date?.label === "string" && date.label.trim() ? date.label.trim() : `Special Date ${index + 1}`,
      isoDate: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  }).filter(Boolean);
}
