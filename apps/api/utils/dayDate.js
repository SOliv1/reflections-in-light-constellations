export const DAY_DATE_MESSAGE =
  "date must use YYYY-MM-DD or the legacy DD-MM-YYYY format";

function isRealDate(year, month, day) {
  const value = new Date(Date.UTC(year, month - 1, day));
  return (
    value.getUTCFullYear() === year &&
    value.getUTCMonth() === month - 1 &&
    value.getUTCDate() === day
  );
}

export function normalizeDayDate(value) {
  if (typeof value !== "string") return null;

  const input = value.trim();
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const legacyMatch = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);

  let year;
  let month;
  let day;

  if (isoMatch) {
    [, year, month, day] = isoMatch;
  } else if (legacyMatch) {
    [, day, month, year] = legacyMatch;
  } else {
    return null;
  }

  if (!isRealDate(Number(year), Number(month), Number(day))) return null;

  // Preserve the format already used by existing records in the days collection.
  return `${day}-${month}-${year}`;
}
