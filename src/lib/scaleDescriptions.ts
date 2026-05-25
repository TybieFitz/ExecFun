const descriptions = (labels: string[]): Record<number, string> =>
  Object.fromEntries(labels.map((label, i) => [i + 1, label]));

export const PAIN_DESCRIPTIONS = descriptions([
  "No noticeable pain",
  "Very mild",
  "Mild",
  "Light",
  "Moderate",
  "Noticeable",
  "Strong",
  "Very strong",
  "Intense",
  "Severe",
]);

export const MOOD_DESCRIPTIONS = descriptions([
  "Very low",
  "Low",
  "Somewhat low",
  "Below neutral",
  "Neutral",
  "Slightly positive",
  "Positive",
  "Good",
  "Very good",
  "Very high",
]);

export const ENERGY_DESCRIPTIONS = descriptions([
  "Very low",
  "Low",
  "Somewhat low",
  "Below average",
  "Moderate",
  "Fair",
  "Good",
  "High",
  "Very high",
  "Peak",
]);
