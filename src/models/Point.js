export const isEqual = (point1, point2) => {
  return (
    Math.abs(point1.x - point2.x) <= 5 && Math.abs(point1.y - point2.y) <= 5
  );
};

export const isEqualCentralized = (point1, point2) => {
  return (
    Math.abs(point1.x - point2.x) <= 2 && Math.abs(point1.y - point2.y) <= 2
  );
};

export const isXEqual = (x1, x2) => {
  return Math.abs(x1 - x2) <= 10;
};

export const isYEqual = (y1, y2) => {
  return Math.abs(y1 - y2) <= 10;
};
