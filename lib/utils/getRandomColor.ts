const COLORS = [
  "#e6194B",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#42d4f4",
  "#f032e6",
  "#bfef45",
  "#fabed4",
  "#469990",
  "#dcbeff",
  "#9A6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#a9a9a9",
  "#ffffff",
  "#000000",
  "#e6beff",
  "#57606f",
  "#ffa502",
  "#ff4757",
  "#1e90ff",
  "#2ed573",
  "#747d8c",
  "#ff6348",
  "#2f3542",
  "#7bed9f",
];

export const getRandomColor = () => {
  return COLORS[getRandomInt(0, COLORS.length)];
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // Maximum is exclusive, minimum is inclusive
};
