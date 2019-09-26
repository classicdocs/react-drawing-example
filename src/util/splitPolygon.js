import algebra, { Expression, Equation } from "algebra.js";
import {
  getLineEquationFromTwoPointsEqualsX,
  getLineEquationFromTwoPoints,
  parseFraction
} from "../util/algebra";
import { isEqual } from "../models/Point";

export const splitPolygon = (polygon, line) => {
  const points = getPoints(polygon, line);

  if (!points.yEqPoint1 || !points.yEqPoint2) {
    return null;
  }

  const { leftPolygonPoints, rightPolygonPoints } = createLeftAndRightSide(
    polygon,
    line,
    points
  );

  console.log(leftPolygonPoints);
  console.log(rightPolygonPoints);

  return { leftPolygonPoints, rightPolygonPoints };

  // need to delete polygon from store
  // need to add new poligones to
};

const createLeftAndRightSide = (polygon, line, points) => {
  let leftPolygonPoints = [];
  let rightPolygonPoints = [];

  let startIndLeft, endIndLeft;
  let startIndRight, endIndRight;

  for (let i = 0; i < polygon.points.length; i++) {
    if (isEqual(polygon.points[i], points.leftPoint1)) {
      startIndLeft = i;
    } else if (isEqual(polygon.points[i], points.leftPoint2)) {
      endIndLeft = i;
    }
    if (isEqual(polygon.points[i], points.rightPoint1)) {
      startIndRight = i;
    } else if (isEqual(polygon.points[i], points.rightPoint2)) {
      endIndRight = i;
    }
  }

  // FIXME
  if (startIndLeft > endIndLeft) {
    const tempStart = startIndLeft;
    const tempEnd = endIndLeft;
    startIndLeft = endIndRight;
    endIndLeft = startIndRight;
    endIndRight = tempStart;
    startIndRight = tempEnd;

    const p1 = line.point1;
    line.point1 = line.point2;
    line.point2 = p1;
  }

  console.log(startIndLeft, endIndLeft);
  console.log(startIndRight, endIndRight);

  for (let i = 0; i < polygon.points.length; i++) {
    leftPolygonPoints.push(polygon.points[i]);
    if (i === startIndLeft) {
      leftPolygonPoints.push(line.point1);
      leftPolygonPoints.push(line.point2);
      break;
    }
  }

  for (let i = endIndLeft; i < polygon.points.length; i++) {
    leftPolygonPoints.push(polygon.points[i]);
  }

  rightPolygonPoints.push(line.point1);
  for (let i = startIndRight; i <= endIndRight; i++) {
    rightPolygonPoints.push(polygon.points[i]);
  }
  rightPolygonPoints.push(line.point2);

  return { leftPolygonPoints, rightPolygonPoints };
};

const getPoints = (polygon, line) => {
  let yEqPoint1;
  let yEqPoint2;

  let leftPoint1, leftPoint2, rightPoint1, rightPoint2;

  const points = polygon.points;
  for (let i = 0; i < points.length; i++) {
    const point1 = points[i];
    let point2;
    if (i === points.length - 1) {
      point2 = points[0];
    } else {
      point2 = points[i + 1];
    }

    let lineEquationPoint1 = getLineEquation(point1, point2, line.point1);
    let lineEquationPoint2 = getLineEquation(point1, point2, line.point2);

    if (
      lineEquationPoint1 &&
      checkIfPointBetweenPoints(point1, point2, line.point1)
    ) {
      yEqPoint1 = lineEquationPoint1;
      leftPoint1 = point1;
      rightPoint1 = point2;
    }
    if (
      lineEquationPoint2 &&
      checkIfPointBetweenPoints(point1, point2, line.point2)
    ) {
      yEqPoint2 = lineEquationPoint2;
      leftPoint2 = point2;
      rightPoint2 = point1;
    }
  }

  return {
    yEqPoint1,
    yEqPoint2,
    leftPoint1,
    leftPoint2,
    rightPoint1,
    rightPoint2
  };
};

const getLineEquation = (point1, point2, linePoint) => {
  let lineEquation;

  if (point1.x === point2.x) {
    // special x1 == x2
    lineEquation = getLineEquationFromTwoPointsEqualsX(point1.x); // 0 = -x + n
  } else {
    // normal
    lineEquation = getLineEquationFromTwoPoints(point1, point2); // y-y1 = ((y2-y1)/(x2-x1)) * (x-x1)
  }

  if (point1.x === point2.x) {
    // special x1 == x2
    if (point1.x === linePoint.x) {
      return lineEquation;
    }
  } else {
    //special y1 == y2
    if (point1.y === point2.y) {
      return new Equation(
        new Expression(0),
        algebra.parse(`-y + ${lineEquation.solveFor("y")}`)
      );
    }
    // normal
    const eq = new Equation(
      new Expression(linePoint.y),
      lineEquation.solveFor("y")
    );
    const res = eq.solveFor("x");
    if (Math.abs(parseFraction(res) - linePoint.x) <= 10) {
      return lineEquation;
    }
  }

  return null;
};

const checkIfPointBetweenPoints = (A, B, C) => {
  const d0 = distance(A, B);
  const d1 = distance(A, C);
  const d2 = distance(B, C);
  const d = d1 + d2;
  return Math.abs(d - d0) < 1;
  // return distance(A, C) + distance(B, C) === distance(A, B);
};

const distance = (A, B) => {
  return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
};
