const screenWidth = window.innerWidth
const screenMultiplier = () => {
  if (screenWidth > 2400) return 0.85
  else return 1
}

// w zależności od inexu multiplier wielkości środkowego noda
export const size_modifier = [
  0.7, 0.72, 0.7, 0.69, 0.69, 0.68, 0.68, 0.67, 0.65, 0.62,
];

// jeśli jest więcej niż 10 każdy ma size_modifier 0.34
const default_size = 0.62;

// w zależności ile jest nodów taki jest multiplier
const size_multiplier = [
  { length: 0, multiplier: 1.4 },
  { length: 1, multiplier: 1.4 },
  { length: 2, multiplier: 1.4 },
  { length: 3, multiplier: 1.4 },
  { length: 4, multiplier: 1.4 },
  { length: 5, multiplier: 1.4 },
  { length: 6, multiplier: 1.4 },
  { length: 7, multiplier: 1.35 },
  { length: 8, multiplier: 1.4 },
  { length: 9, multiplier: 1.3 },
  { length: 10, multiplier: 1.15 },
  { length: 11, multiplier: 1.1 },
  { length: 12, multiplier: 1.1 },
  { length: 100, multiplier: 0.95 },
] as const;

//skalowanie bombelków
export const bubbleScale = (index = 0, length = 0) => {
  const getMultiplier = size_multiplier.find((el) => length <= el.length);
  const multiplier = getMultiplier?.multiplier * screenMultiplier() || 1;
  return +((size_modifier[index] || default_size) * multiplier).toFixed(2);
};



// // w zależności od inexu multiplier wielkości środkowego noda
// export const size_modifier = [
//   0.7, 0.7, 0.7, 0.69, 0.69, 0.68, 0.68, 0.67, 0.65, 0.62,
// ];
