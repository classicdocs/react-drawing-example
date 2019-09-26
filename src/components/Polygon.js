import React from "react";
import Shape from "./Shape";
import { isPointInsidePolygon } from "../util/index";
import { getResizeCentralPoint } from "../util/algebra";
import ResizePoint from "../models/ResizePoint";
import { isEqual } from "../models/Point";
import { getCentroidOfPolygon } from "../util/centroid";

class Polygon extends Shape {
  constructor(props) {
    super(props);
    this.state = {
      points: props.points,
      strokeWidth: props.strokeWidth,
      strokeColor: props.strokeColor,
      selectedColor: props.selectedColor,
      selected: false,
      resizePoints: []
    };
  }

  calculateResizePoints = points => {
    let resizePoints = [];
    for (let i = 0; i < points.length; i++) {
      let right;
      if (i + 1 === points.length) {
        right = points[0];
      } else {
        right = points[i + 1];
      }
      const left = points[i];
      const central = { x: (left.x + right.x) / 2, y: (left.y + right.y) / 2 };
      const rp = new ResizePoint(left, central, right);
      resizePoints.push(rp);
    }
    return resizePoints;
  };

  componentWillReceiveProps({
    points,
    strokeWidth,
    strokeColor,
    selectedColor,
    selected,
    resizePoints
  }) {
    if (this.state.resizePoints.length === 0) {
      this.setState({
        resizePoints: this.calculateResizePoints(this.state.points)
      });
    } else if (resizePoints !== undefined) {
      if (resizePoints.length === 0) {
        resizePoints = this.calculateResizePoints(this.state.points);
      }
      this.setState({ resizePoints });
    }

    this.setState({
      points,
      strokeWidth,
      strokeColor,
      selectedColor,
      selected
    });
  }
  renderPolygon() {
    let polygon = [];
    this.state.points.forEach((point, index) => {
      if (index !== this.state.points.length - 1) {
        polygon.push(
          <g key={index}>
            <path
              d={`M ${point.x} ${point.y} L ${this.state.points[index + 1].x} ${this.state.points[index + 1].y}`}
              stroke={
                this.state.selected
                  ? this.state.selectedColor
                  : this.state.strokeColor
              }
              strokeWidth={this.state.strokeWidth}
            />
            <circle
              visibility={this.state.selected ? "visible" : "hidden"}
              cx={this.state.points[index].x}
              cy={this.state.points[index].y}
              r="5"
              stroke="black"
              strokeWidth="1"
            />
          </g>
        );
      } else {
        polygon.push(
          <g key={index}>
            <path
              d={`M ${point.x} ${point.y} L ${this.state.points[0].x} ${this.state.points[0].y}`}
              stroke={
                this.state.selected
                  ? this.state.selectedColor
                  : this.state.strokeColor
              }
              strokeWidth={this.state.strokeWidth}
            />
            <circle
              visibility={this.state.selected ? "visible" : "hidden"}
              cx={this.state.points[index].x}
              cy={this.state.points[index].y}
              r="5"
              stroke="black"
              strokeWidth="1"
            />
            <circle
              visibility={this.state.selected ? "visible" : "hidden"}
              cx={this.state.points[0].x}
              cy={this.state.points[0].y}
              r="5"
              stroke="black"
              strokeWidth="1"
            />
          </g>
        );
      }
    });
    polygon.push(<g key="-1">{this.renderResizePoints()}</g>);
    return polygon;
  }

  renderResizePoints() {
    let resizePoints = [];
    if (!this.state.resizePoints) {
      return;
    }

    for (let i = 0; i < this.state.resizePoints.length; i++) {
      const point = this.state.resizePoints[i];
      resizePoints.push(
        <circle
          key={i}
          visibility={this.state.selected ? "visible" : "hidden"}
          cx={point.central.x}
          cy={point.central.y}
          r="5"
          stroke="black"
          strokeWidth="1"
        />
      );
    }
    return resizePoints;
  }

  render() {
    return <g>{this.renderPolygon()}</g>;
  }

  isSelected(point) {
    return isPointInsidePolygon(this.state.points, point);
  }

  isInsideLasoSelect(rectangle) {
    for (let i = 0; i < this.state.points.length; i++) {
      if (isPointInsidePolygon(rectangle, this.state.points[i])) return true;
    }
    return false;
  }

  move(offsetX, offsetY) {
    let points = [];
    this.state.points.forEach(point => {
      points.push({ x: point.x + offsetX, y: point.y + offsetY });
    });

    let resizePoints = this.calculateResizePoints(points);

    return {
      ...this.state,
      points,
      resizePoints
    };
  }

  isResizible(point) {
    const points = this.state.points;
    for (let i = 0; i < points.length; i++) {
      if (isEqual(points[i], point)) return true;
    }
    const resizePoints = this.state.resizePoints;

    for (let i = 0; i < resizePoints.length; i++) {
      if (isEqual(resizePoints[i].central, point)) return true;
    }

    return false;
  }

  resize(startPoint, endPoint) {
    // change point

    let ind = -1;
    let points = this.state.points;
    for (let i = 0; i < points.length; i++) {
      if (isEqual(points[i], startPoint)) ind = i;
    }
    points = points.map((el, index) => (index === ind ? endPoint : el));

    // change resizePoints
    let resizePoints = this.state.resizePoints;
    let newResizePoints = [];
    for (let i = 0; i < resizePoints.length; i++) {
      let resizePoint = resizePoints[i];
      if (resizePoint.isPointIn(startPoint)) {
        if (isEqual(resizePoints[i].left, startPoint)) {
          // update left
          resizePoint.left = endPoint;
          resizePoint.central = {
            x: (endPoint.x + resizePoint.right.x) / 2,
            y: (endPoint.y + resizePoint.right.y) / 2
          };
        } else if (isEqual(resizePoints[i].right, startPoint)) {
          // update right
          resizePoint.right = endPoint;
          resizePoint.central = {
            x: (endPoint.x + resizePoint.left.x) / 2,
            y: (endPoint.y + resizePoint.left.y) / 2
          };
        } else if (isEqual(resizePoints[i].central, startPoint)) {
          // update central
          // calcucalte central
          const central = getResizeCentralPoint(
            { point1: resizePoint.right, point2: resizePoint.left },
            startPoint,
            endPoint
          );

          const offsetX = central.x - resizePoint.central.x;
          const offsetY = central.y - resizePoint.central.y;

          // resizePoint.central = central;

          const oldLeft = resizePoint.left;
          const oldRight = resizePoint.right;

          const left = {
            x: resizePoint.left.x + offsetX,
            y: resizePoint.left.y + offsetY
          };
          const right = {
            x: resizePoint.right.x + offsetX,
            y: resizePoint.right.y + offsetY
          };

          // resizePoint.central = central;
          resizePoint.left = left;
          resizePoint.right = right;

          // update points and resize points
          points = points.map(point =>
            point.x === oldLeft.x && point.y === oldLeft.y ? left : point
          );
          points = points.map(point =>
            point.x === oldRight.x && point.y === oldRight.y ? right : point
          );
        }
      }
      newResizePoints.push(resizePoint);
    }

    newResizePoints = this.calculateResizePoints(points);

    return { ...this.state, points, resizePoints: newResizePoints };
  }

  rotate = (direction, angle) => {
    const center = getCentroidOfPolygon(this.state.points);

    if (direction === "left") {
      angle *= -1;
    }
    let points = [];

    this.state.points.forEach(item => {
      const x =
        Math.cos(angle) * (item.x - center.x) -
        Math.sin(angle) * (item.y - center.y) +
        center.x;
      const y =
        Math.sin(angle) * (item.x - center.x) +
        Math.cos(angle) * (item.y - center.y) +
        center.y;
      points.push({ x, y });
    });

    const resizePoints = this.calculateResizePoints(points);

    return { ...this.state, points, resizePoints };
  };
}

export default Polygon;
