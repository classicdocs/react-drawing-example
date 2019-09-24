export const isPointInsidePolygon = (polygon, point) => {
  // devide polygon into triangles
  for (let i = 0; i < polygon.length - 2; i++) {
    if (isPointInTriangle(polygon[0], polygon[i + 1], polygon[i + 2], point))
      return true;
  }
  return false;
};

const isPointInTriangle = (A, B, C, point) => {
  // area of big triangle
  let abc = getTriangleArea(A, B, C);

  // areas for small triangles

  let abPoint = getTriangleArea(A, B, point);
  let acPoint = getTriangleArea(A, C, point);
  let bcPoint = getTriangleArea(B, C, point);

  return Math.abs(abc - abPoint - acPoint - bcPoint) < 0.05;
};
const getTriangleArea = (A, B, C) => {
  // get lines for triangle

  let a = getLine(B, C);
  let b = getLine(A, C);
  let c = getLine(A, B);

  let s = (a + b + c) / 2.0;

  return Math.sqrt(s * (s - a) * (s - b) * (s - c));
};

const getLine = (A, B) => {
  return Math.sqrt(Math.pow(B["x"] - A["x"], 2) + Math.pow(B["y"] - A["y"], 2));
};
