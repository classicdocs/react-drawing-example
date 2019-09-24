import { isEqual } from "./Point";

export default class ResizePoint {
  constructor(left, central, right) {
    this.left = left;
    this.central = central;
    this.right = right;
  }

  isPointIn(point) {
    return (
      isEqual(this.left, point) ||
      isEqual(this.right, point) ||
      isEqual(this.central, point)
    );
  }
}
