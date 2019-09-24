export const getCentroidOfPolygon = points => {
  const A = getA(points);

  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    if (i === points.length - 1) {
      sum +=
        (points[i].x + points[0].x) *
        (points[i].x * points[0].y - points[0].x * points[i].y);
    } else {
      sum +=
        (points[i].x + points[i + 1].x) *
        (points[i].x * points[i + 1].y - points[i + 1].x * points[i].y);
    }
  }

  const x = (1 / (6 * A)) * sum;

  sum = 0;

  for (let i = 0; i < points.length; i++) {
    if (i === points.length - 1) {
      sum +=
        (points[i].y + points[0].y) *
        (points[i].x * points[0].y - points[0].x * points[i].y);
    } else {
      sum +=
        (points[i].y + points[i + 1].y) *
        (points[i].x * points[i + 1].y - points[i + 1].x * points[i].y);
    }
  }

  const y = (1 / (6 * A)) * sum;

  return { x, y };
};

const getA = points => {
  let sum = 0;

  for (let i = 0; i < points.length; i++) {
    if (i === points.length - 1) {
      sum += points[i].x * points[0].y - points[0].x * points[i].y;
    } else {
      sum += points[i].x * points[i + 1].y - points[i + 1].x * points[i].y;
    }
  }

  return (1 / 2) * sum;
};

export const getCentroidOfLine = (point1, point2) => {
  const x = (point1.x + point2.x) / 2;
  const y = (point1.y + point2.y) / 2;
  return { x, y };
};
