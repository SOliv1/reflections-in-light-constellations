export const CONSTELLATION_PATTERNS = {
  spring: {
    sunny: [
      { id: "sp-su-1", top: 18, left: 18, label: "Renewal arc" },
      { id: "sp-su-2", top: 24, left: 34, label: "Dawn bloom" },
      { id: "sp-su-3", top: 20, left: 52, label: "Clear ray" },
      { id: "sp-su-4", top: 28, left: 68, label: "Open sky node" },
      { id: "sp-su-5", top: 34, left: 82, label: "Sunward drift" },
    ],
    cloudy: [
      { id: "sp-cl-1", top: 16, left: 14, label: "Soft cover" },
      { id: "sp-cl-2", top: 24, left: 30, label: "Muted glint" },
      { id: "sp-cl-3", top: 31, left: 45, label: "Passing shade" },
      { id: "sp-cl-4", top: 26, left: 61, label: "Drifted veil" },
      { id: "sp-cl-5", top: 36, left: 76, label: "Cloud lane" },
    ],
    rain: [
      { id: "sp-ra-1", top: 14, left: 20, label: "Rain thread" },
      { id: "sp-ra-2", top: 22, left: 34, label: "River shimmer" },
      { id: "sp-ra-3", top: 30, left: 46, label: "Drop chorus" },
      { id: "sp-ra-4", top: 38, left: 58, label: "Quiet shower" },
      { id: "sp-ra-5", top: 46, left: 69, label: "Grounded light" },
    ],
    storm: [
      { id: "sp-st-1", top: 20, left: 22, label: "Voltage spark" },
      { id: "sp-st-2", top: 18, left: 41, label: "Charged arc" },
      { id: "sp-st-3", top: 28, left: 55, label: "Thunder seam" },
      { id: "sp-st-4", top: 24, left: 72, label: "Split horizon" },
      { id: "sp-st-5", top: 36, left: 84, label: "Storm wake" },
    ],
    snow: [
      { id: "sp-sn-1", top: 18, left: 20, label: "Frost point" },
      { id: "sp-sn-2", top: 25, left: 36, label: "Crystal drift" },
      { id: "sp-sn-3", top: 32, left: 50, label: "Snow hush" },
      { id: "sp-sn-4", top: 26, left: 64, label: "Winter halo" },
      { id: "sp-sn-5", top: 34, left: 80, label: "Quiet flake" },
    ],
    mist: [
      { id: "sp-mi-1", top: 19, left: 17, label: "Veiled edge" },
      { id: "sp-mi-2", top: 24, left: 32, label: "Soft beacon" },
      { id: "sp-mi-3", top: 30, left: 48, label: "Fogline" },
      { id: "sp-mi-4", top: 28, left: 63, label: "Dim trail" },
      { id: "sp-mi-5", top: 35, left: 77, label: "Hidden spark" },
    ],
  },
  summer: {
    sunny: [
      { id: "su-su-1", top: 15, left: 16, label: "Solstice arc" },
      { id: "su-su-2", top: 20, left: 32, label: "Heat shimmer" },
      { id: "su-su-3", top: 18, left: 49, label: "Radiant crest" },
      { id: "su-su-4", top: 22, left: 66, label: "Golden trail" },
      { id: "su-su-5", top: 28, left: 82, label: "Summer crown" },
    ],
    cloudy: [
      { id: "su-cl-1", top: 17, left: 14, label: "Shade patch" },
      { id: "su-cl-2", top: 23, left: 30, label: "Warm overcast" },
      { id: "su-cl-3", top: 28, left: 47, label: "Muted flare" },
      { id: "su-cl-4", top: 25, left: 63, label: "Cloud shelf" },
      { id: "su-cl-5", top: 31, left: 79, label: "Hazy ray" },
    ],
    rain: [
      { id: "su-ra-1", top: 14, left: 19, label: "Monsoon bead" },
      { id: "su-ra-2", top: 23, left: 34, label: "Warm rain node" },
      { id: "su-ra-3", top: 31, left: 48, label: "Flow seam" },
      { id: "su-ra-4", top: 39, left: 61, label: "Cooling line" },
      { id: "su-ra-5", top: 46, left: 75, label: "Rainfall arc" },
    ],
  },
  autumn: {
    sunny: [
      { id: "au-su-1", top: 18, left: 19, label: "Amber rise" },
      { id: "au-su-2", top: 23, left: 35, label: "Harvest glint" },
      { id: "au-su-3", top: 21, left: 52, label: "Rust horizon" },
      { id: "au-su-4", top: 27, left: 67, label: "Leaf trail" },
      { id: "au-su-5", top: 34, left: 82, label: "Dusk flame" },
    ],
    cloudy: [
      { id: "au-cl-1", top: 16, left: 14, label: "Copper haze" },
      { id: "au-cl-2", top: 24, left: 29, label: "Muted amber" },
      { id: "au-cl-3", top: 30, left: 46, label: "Drifted branch" },
      { id: "au-cl-4", top: 28, left: 62, label: "Fogged dusk" },
      { id: "au-cl-5", top: 35, left: 77, label: "Wind lane" },
    ],
    rain: [
      { id: "au-ra-1", top: 14, left: 19, label: "Autumn rain" },
      { id: "au-ra-2", top: 22, left: 34, label: "Harvest stream" },
      { id: "au-ra-3", top: 30, left: 46, label: "Bronze drop" },
      { id: "au-ra-4", top: 39, left: 58, label: "Quiet runoff" },
      { id: "au-ra-5", top: 47, left: 71, label: "Grounded ember" },
    ],
  },
  winter: {
    sunny: [
      { id: "wi-su-1", top: 15, left: 18, label: "Cold flare" },
      { id: "wi-su-2", top: 21, left: 33, label: "Ice crest" },
      { id: "wi-su-3", top: 18, left: 50, label: "Crisp horizon" },
      { id: "wi-su-4", top: 24, left: 66, label: "Frost lane" },
      { id: "wi-su-5", top: 29, left: 82, label: "Winter crown" },
    ],
    cloudy: [
      { id: "wi-cl-1", top: 17, left: 15, label: "Snow cloud" },
      { id: "wi-cl-2", top: 23, left: 31, label: "Grey shimmer" },
      { id: "wi-cl-3", top: 29, left: 48, label: "Cold drift" },
      { id: "wi-cl-4", top: 26, left: 64, label: "Pale lane" },
      { id: "wi-cl-5", top: 34, left: 78, label: "Soft dim" },
    ],
    snow: [
      { id: "wi-sn-1", top: 14, left: 18, label: "Crystal arc" },
      { id: "wi-sn-2", top: 22, left: 32, label: "Snow crest" },
      { id: "wi-sn-3", top: 30, left: 45, label: "Flurry path" },
      { id: "wi-sn-4", top: 38, left: 58, label: "Drift knot" },
      { id: "wi-sn-5", top: 45, left: 73, label: "Ice wake" },
    ],
  },
};

const FALLBACK_PATTERN = [
  { id: "fallback-1", top: 18, left: 18, label: "North spark" },
  { id: "fallback-2", top: 24, left: 34, label: "Soft line" },
  { id: "fallback-3", top: 20, left: 51, label: "Moonward node" },
  { id: "fallback-4", top: 27, left: 68, label: "Quiet rise" },
  { id: "fallback-5", top: 33, left: 82, label: "Evening glint" },
];

export function getPatternForSeasonAndMood(season = "spring", mood = "sunny") {
  const seasonPatterns = CONSTELLATION_PATTERNS[season] || CONSTELLATION_PATTERNS.spring;
  return seasonPatterns[mood] || seasonPatterns.sunny || FALLBACK_PATTERN;
}
