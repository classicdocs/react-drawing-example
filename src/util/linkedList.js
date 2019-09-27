export class LinkedList {
  // points - list
  constructor(points) {
    this.points = points;
  }

  getPoints(startInd, endInd) {
    let i = startInd;
    let result = [];

    if (startInd === endInd) {
      result.push(this.points[i]);
      return result;
    }
    console.log("start: ", startInd);
    console.log("end: ", endInd);

    while (i != endInd + 1) {
      result.push(this.points[i]);

      if (i === this.points.length - 1 && i !== endInd) {
        i = 0;
      } else {
        i++;
      }
    }

    return result;
  }
}
