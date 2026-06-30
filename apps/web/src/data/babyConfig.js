// Baby keepsake configuration
// Update BABY_DUE_DATE and BABY_NAME once known.

export const BABY_DUE_DATE = "2024-12-18"; // YYYY-MM-DD — adjust to your due date
export const BABY_BIRTH_DATE = null;        // set after birth: "2024-12-18"
export const BABY_NAME = "Little Star";     // update when ready

// The Sagittarius window: Nov 22 – Dec 21
export const SAGITTARIUS_START_MONTH = 11; // November (0-indexed)
export const SAGITTARIUS_START_DAY = 22;
export const SAGITTARIUS_END_MONTH = 11;   // December (0-indexed)
export const SAGITTARIUS_END_DAY = 21;

/**
 * Returns true if the given Date falls within the Sagittarius window
 * (22 Nov – 21 Dec) or on the due / birth date.
 */
export function isSagittariusWindow(date = new Date()) {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();

  const inNov = month === 10 && day >= 22; // 10 = November
  const inDec = month === 11 && day <= 21; // 11 = December
  return inNov || inDec;
}

/**
 * Returns a human-readable baby age string, e.g. "4 months and 12 days".
 * Returns null if no birth date is set.
 */
export function getBabyAge(birthDateStr = BABY_BIRTH_DATE) {
  if (!birthDateStr) return null;

  const birth = new Date(birthDateStr);
  const now = new Date();
  const diffMs = now - birth;

  if (diffMs < 0) return null; // not born yet

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months === 0) return `${days} day${days !== 1 ? "s" : ""} old`;
  if (days === 0) return `${months} month${months !== 1 ? "s" : ""} old`;
  return `${months} month${months !== 1 ? "s" : ""} and ${days} day${days !== 1 ? "s" : ""} old`;
}
