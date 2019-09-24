import React from "react";
import Shape from "./Shape";
import { isPointInsidePolygon } from "../util";

class Circle extends Shape {
  state = {
    cx: this.props.cx,
    cy: this.props.cy,
    r: this.props.r,
    strokeColor: this.props.strokeColor,
    strokeWidth: this.props.strokeWidth,
    selectedColor: this.props.selectedColor,
    fill: this.props.fill,
    selected: false
  };

  componentWillReceiveProps({
    cx,
    cy,
    r,
    strokeColor,
    strokeWidth,
    selectedColor,
    fill,
    selected
  }) {
    this.setState({
      cx,
      cy,
      r,
      strokeColor,
      strokeWidth,
      selectedColor,
      fill,
      selected
    });
  }

  render() {
    return (
      <g>
        <circle
          cx={this.state.cx}
          cy={this.state.cy}
          r={this.state.r}
          stroke={
            this.state.selected
              ? this.state.selectedColor
              : this.state.strokeColor
          }
          strokeWidth={this.state.strokeWidth}
          fill={this.state.fill}
        />
        <circle
          visibility={this.state.selected ? "visible" : "hidden"}
          cx={this.state.cx + this.state.r}
          cy={this.state.cy}
          r="5"
          stroke="black"
          strokeWidth="1"
        />
      </g>
    );
  }

  isSelected(point) {
    return (
      Math.sqrt(
        Math.pow(Math.abs(this.state.cx - point.x), 2) +
          Math.pow(Math.abs(this.state.cy - point.y), 2)
      ) <= this.state.r
    );
  }

  isInsideLasoSelect(rectangle) {
    const center = { x: this.state.cx, y: this.state.cy };
    if (isPointInsidePolygon(rectangle, center)) return true;
    return false;
  }

  move(offsetX, offsetY) {
    return {
      ...this.state,
      cx: this.state.cx + offsetX,
      cy: this.state.cy + offsetY
    };
  }

  isResizible(point) {
    return (
      point.x === this.state.cx + this.state.r && point.y === this.state.cy
    );
  }

  resize(startPoint, endPoint) {
    let offset = endPoint.x - startPoint.x;

    let newR = this.state.r + offset;
    if (newR <= 10) {
      newR = 10;
    }
    return { ...this.state, r: newR };
  }
}

export default Circle;
