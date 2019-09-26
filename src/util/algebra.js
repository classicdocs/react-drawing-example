import algebra, { Expression, Equation } from "algebra.js";

export const getPointsNormalToLine = line => {
  let lineEquation;
  if (line.point1.x === line.point2.x) {
    // special x1 == x2
    lineEquation = getLineEquationFromTwoPointsEqualsX(line.point1.x); // 0 = -x + n
  } else {
    // normal
    lineEquation = getLineEquationFromTwoPoints(line.point1, line.point2); // y-y1 = ((y2-y1)/(x2-x1)) * (x-x1)
  }

  const { A, B } = getAB(lineEquation.toString());

  let point1, point2, point3, point4;
  let normalLine1, normalLine2;
  let circle1, circle2; // 0 = (x-p)^2 + (y-q)^2 - r^2

  if (line.point1.y === line.point2.y) {
    // special y1 == y2
    normalLine1 = getEquationOfNormalLineEqualsY(line.point1.x); // 0 = -x + n
    normalLine2 = getEquationOfNormalLineEqualsY(line.point2.x); // 0 = -x + n

    circle1 = getCircleFromX(
      line.point1.x,
      line.point1.y,
      10,
      normalLine1.solveFor("x")
    );
    circle2 = getCircleFromX(
      line.point2.x,
      line.point2.y,
      10,
      normalLine2.solveFor("x")
    );

    [point1, point2] = getIntersectionEqualsY(circle1, normalLine1);
    [point3, point4] = getIntersectionEqualsY(circle2, normalLine2);
  } else {
    normalLine1 = getEquationOfNormalLine(A, B, line.point1); // y - y0 = B/A (x-x0)
    normalLine2 = getEquationOfNormalLine(A, B, line.point2); // y - y0 = B/A (x-x0)

    circle1 = getCircleFromY(
      line.point1.x,
      line.point1.y,
      10,
      normalLine1.solveFor("y")
    );
    circle2 = getCircleFromY(
      line.point2.x,
      line.point2.y,
      10,
      normalLine2.solveFor("y")
    );

    if (line.point1.x === line.point2.x) {
      [point1, point2] = getIntersectionEqualsX(circle1, normalLine1);
      [point3, point4] = getIntersectionEqualsX(circle2, normalLine2);
    } else {
      [point1, point2] = getIntersection(circle1, normalLine1);
      [point3, point4] = getIntersection(circle2, normalLine2);
    }
  }

  return [point1, point2, point3, point4];
};

export const getResizeCentralPoint = (line, centralPoint, newPoint) => {
  let lineEquation;
  if (line.point1.x === line.point2.x) {
    // special x1 == x2
    lineEquation = getLineEquationFromTwoPointsEqualsX(line.point1.x); // 0 = -x + n
  } else {
    // normal
    lineEquation = getLineEquationFromTwoPoints(line.point1, line.point2); // y-y1 = ((y2-y1)/(x2-x1)) * (x-x1)
  }

  let params = getAB(lineEquation.toString());

  let normalLine;
  if (line.point1.y === line.point2.y) {
    // special y1 == y2
    normalLine = getEquationOfNormalLineEqualsY(centralPoint.x); // 0 = -x + n
  } else {
    normalLine = getEquationOfNormalLine(params.A, params.B, centralPoint); // y - y0 = B/A (x-x0)
  }

  params = getAB(normalLine.toString());

  let normalLine2;
  if (line.point1.x === line.point2.x) {
    // special y1 == y2
    normalLine2 = getEquationOfNormalLineEqualsY(newPoint.x); // 0 = -x + n
  } else {
    normalLine2 = getEquationOfNormalLine(params.A, params.B, newPoint); // y - y0 = B/A (x-x0)
  }

  if (line.point1.x === line.point2.x) {
    return getResizePointIntersectionEqualsX(normalLine, normalLine2);
  } else {
    if (line.point1.y === line.point2.y) {
      return getResizePointIntersectionEqualsY(normalLine, normalLine2);
    }
    return getResizePointIntersection(normalLine, normalLine2);
  }
};

const getResizePointIntersection = (normalLine, normalLine2) => {
  const xOfNormalLine = normalLine.solveFor("x");
  const xOfNormalLine2 = normalLine2.solveFor("x");

  const eq = new Equation(xOfNormalLine, xOfNormalLine2);
  const y = eq.solveFor("y");

  const yOfNormalLine = normalLine.solveFor("y");
  const yOfNormalLine2 = normalLine2.solveFor("y");

  const eq2 = new Equation(yOfNormalLine, yOfNormalLine2);
  const x = eq2.solveFor("x");

  return { x, y };
};

const getResizePointIntersectionEqualsY = (normalLine, normalLine2) => {
  return { x: normalLine.solveFor("x"), y: normalLine2.solveFor("y") };
};

const getResizePointIntersectionEqualsX = (normalLine, normalLine2) => {
  return { x: normalLine2.solveFor("x"), y: normalLine.solveFor("y") };
};

export const getLineEquationFromTwoPoints = (point1, point2) => {
  // Equation of a Line from 2 Points
  // return y-y1 = ((y2-y1)/(x2-x1)) * (x-x1)

  // round to 2 decimals
  const [x1, y1] = [
    Math.round(point1.x * 100) / 100,
    Math.round(point1.y * 100) / 100
  ];
  const [x2, y2] = [
    Math.round(point2.x * 100) / 100,
    Math.round(point2.y * 100) / 100
  ];

  const k = Math.round(((y2 - y1) / (x2 - x1)) * 100) / 100; // k = (y2-y1)/(x2-x1)

  const expr1 = algebra.parse(`y - ${y1}`);
  let expr2 = algebra.parse(`${k} * (x - ${x1})`);
  const eq = new Equation(expr1, expr2);

  return eq;
};

export const getLineEquationFromTwoPointsEqualsX = x => {
  // return 0 = -x + n
  return new Equation(new Expression(0), algebra.parse(`-x + ${x}`));
};

const getAB = line => {
  let A, B;

  const equals = line.split("=");
  if (equals[0].includes("y")) {
    B = "-1";
  } else {
    B = "0";
  }

  const right = equals[1];

  if (right.includes("x")) {
    const tokens = right.split("x");
    if (tokens[0] === "") {
      A = "1";
    } else if (tokens[0] === " -") {
      A = "-1";
    } else {
      A = tokens[0];
    }
  } else {
    // y1 == y2
    A = "0";
  }

  return { A, B };
};

const getEquationOfNormalLine = (A, B, point) => {
  // return y - y0 = B/A (x-x0)

  const expr1 = algebra.parse(`y - ${point.y}`); // y - y0
  const expr2 = algebra.parse(`${B}/(${A}) * (x - ${point.x})`); // B/A (x-x0)
  const eq = new Equation(expr1, expr2);
  return eq;
};

const getEquationOfNormalLineEqualsY = x => {
  // return 0 = -x + n
  return new Equation(new Expression(0), algebra.parse(`-x + ${x}`));
};

const getCircleFromY = (cx, cy, r, y) => {
  // return 0 = (x-p)^2 + (y-q)^2 - r^2

  const expr1 = algebra.parse(`(x - ${cx})^2 + (${y} - ${cy})^2`);
  const expr2 = algebra.parse(`-${r}^2`);
  const eq = new Equation(expr1.add(expr2), new Expression(0));
  return eq;
};

const getCircleFromX = (cx, cy, r, x) => {
  // return 0 = (x-p)^2 + (y-q)^2 - r^2

  const expr1 = algebra.parse(`(${x} - ${cx})^2 + (y - ${cy})^2`);
  const expr2 = algebra.parse(`-${r}^2`);
  const eq = new Equation(expr1.add(expr2), new Expression(0));
  return eq;
};

export const parseFraction = fraction => {
  if (typeof fraction != "object") {
    return fraction;
  }
  if (!fraction.toString().includes("/")) return fraction.numer;
  const tokens = fraction.toString().split("/");
  return parseInt(tokens[0], 10) / parseInt(tokens[1], 10);
};

const getIntersectionEqualsX = (circle, line) => {
  // line -> y = n

  const [x1, x2] = circle.solveFor("x");
  const [y1, y2] = [line.solveFor("y"), line.solveFor("y")];

  return [
    { x: parseFraction(x1), y: parseFraction(y1) },
    { x: parseFraction(x2), y: parseFraction(y2) }
  ];
};

const getIntersectionEqualsY = (circle, line) => {
  // line -> 0 = -x + n

  const [y1, y2] = circle.solveFor("y");
  const [x1, x2] = [line.solveFor("x"), line.solveFor("x")];

  return [
    { x: parseFraction(x1), y: parseFraction(y1) },
    { x: parseFraction(x2), y: parseFraction(y2) }
  ];
};

const getIntersection = (circle, line) => {
  // line -> y = kx + n

  const [x1, x2] = circle.solveFor("x");

  const leftSide = line.solveFor("x");

  const eq = new Equation(leftSide, parseInt(x1));
  const eq2 = new Equation(leftSide, parseInt(x2));

  const [y1, y2] = [eq.solveFor("y"), eq2.solveFor("y")];

  return [
    { x: parseFraction(x1), y: parseFraction(y1) },
    { x: parseFraction(x2), y: parseFraction(y2) }
  ];
};
