export function toRgbChannels(color = "#8ab4f8") {
  const value = String(color || "").trim();

  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      const [r, g, b] = hex.split("").map((char) => parseInt(`${char}${char}`, 16));
      return `${r}, ${g}, ${b}`;
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `${r}, ${g}, ${b}`;
    }
  }

  if (value.startsWith("rgb(") && value.endsWith(")")) {
    return value.slice(4, -1);
  }

  return "138, 180, 248";
}
