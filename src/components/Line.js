import React from "react";
import Polygon from "./Polygon";
import { isPointInsidePolygon } from "../util/index";
import { getPointsNormalToLine } from "../util/algebra";
import { getCentroidOfLine } from "../util/centroid";

class Line extends Polygon {
  constructor(props) {
    super(props);
    this.state = {
      point1: props.point1,
      point2: props.point2,
      strokeWidth: props.strokeWidth,
      strokeColor: props.strokeColor,
      selectedColor: props.selectedColor,
      selected: false
    };
  }

  componentWillReceiveProps({
    point1,
    point2,
    strokeWidth,
    strokeColor,
    selectedColor,
    selected
  }) {
    this.setState({
      point1,
      point2,
      strokeWidth,
      strokeColor,
      selectedColor,
      selected
    });
  }

  render() {
    return (
      <g>
        <path
          d={`M ${this.state.point1.x} ${this.state.point1.y} L ${this.state.point2.x} ${this.state.point2.y}`}
          stroke={
            this.state.selected
              ? this.state.selectedColor
              : this.state.strokeColor
          }
          strokeWidth={this.state.strokeWidth}
        />
        <circle
          visibility={this.state.selected ? "visible" : "hidden"}
          cx={this.state.point1.x}
          cy={this.state.point1.y}
          r="5"
          stroke="black"
          strokeWidth="1"
        />
        <circle
          visibility={this.state.selected ? "visible" : "hidden"}
          cx={this.state.point2.x}
          cy={this.state.point2.y}
          r="5"
          stroke="black"
          strokeWidth="1"
        />
      </g>

      // <path
      //   d={`M ${this.state.point1.x} ${this.state.point1.y} L ${this.state.point2.x} ${this.state.point2.y}`}
      //   stroke={
      //     this.state.selected
      //       ? this.state.selectedColor
      //       : this.state.strokeColor
      //   }
      //   strokeWidth={this.state.strokeWidth}
      // />
    );
  }

  isSelected(point) {
    const points = getPointsNormalToLine({
      point1: this.state.point1,
      point2: this.state.point2
    });
    return isPointInsidePolygon(points, point);
  }

  isInsideLasoSelect(rectangle) {
    if (isPointInsidePolygon(rectangle, this.state.point1)) return true;
    else if (isPointInsidePolygon(rectangle, this.state.point2)) return true;

    return false;
  }

  move(offsetX, offsetY) {
    // ova metoda move treba da mi vrati updatovanu liniju za pomeranje
    // da li treba ovako da setujem state pa vratim this ili drugi nacin
    // this.setState({
    //   point1: {
    //     x: this.state.point1.x + offsetX,
    //     y: this.state.point1.y + offsetY
    //   },
    //   point2: {
    //     x: this.state.point2.x + offsetX,
    //     y: this.state.point2.y + offsetY
    //   }
    // });
    // return this;

    // ovaj drugi nacin nista ne menja state nego samo vrati sta mi treba
    return {
      ...this.state,
      point1: {
        x: this.state.point1.x + offsetX,
        y: this.state.point1.y + offsetY
      },
      point2: {
        x: this.state.point2.x + offsetX,
        y: this.state.point2.y + offsetY
      }
    };
  }

  isResizible(point) {
    return (
      (point.x === this.state.point1.x && point.y === this.state.point1.y) ||
      (point.x === this.state.point2.x && point.y === this.state.point2.y)
    );
  }

  resize(startPoint, endPoint) {
    let point1 = this.state.point1;
    let point2 = this.state.point2;

    if (
      startPoint.x === this.state.point1.x &&
      startPoint.y === this.state.point1.y
    ) {
      point1 = endPoint;
    } else if (
      startPoint.x === this.state.point2.x &&
      startPoint.y === this.state.point2.y
    ) {
      point2 = endPoint;
    }

    return { ...this.state, point1, point2 };
  }

  rotate = (direction, angle) => {
    const center = getCentroidOfLine(this.state.point1, this.state.point2);

    if (direction === "left") {
      angle *= -1;
    }

    let point1 = this.state.point1;
    let point2 = this.state.point2;

    const x1 =
      Math.cos(angle) * (point1.x - center.x) -
      Math.sin(angle) * (point1.y - center.y) +
      center.x;
    const y1 =
      Math.sin(angle) * (point1.x - center.x) +
      Math.cos(angle) * (point1.y - center.y) +
      center.y;

    const x2 =
      Math.cos(angle) * (point2.x - center.x) -
      Math.sin(angle) * (point2.y - center.y) +
      center.x;
    const y2 =
      Math.sin(angle) * (point2.x - center.x) +
      Math.cos(angle) * (point2.y - center.y) +
      center.y;

    point1 = { x: x1, y: y1 };
    point2 = { x: x2, y: y2 };

    return { ...this.state, point1, point2 };
  };
}

export default Line;
