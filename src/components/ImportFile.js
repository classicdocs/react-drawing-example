import React, { Component } from "react";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import { createShapes } from "../actions/index";
import Polygon from "./Polygon";
import Circle from "./Circle";
import Line from "./Line";

export class ImportFile extends Component {
  inputOnChange = e => {
    const file = e.target.files[0];
    if (file !== "") {
      this.upload(file);
    }
  };

  upload = async file => {
    const importedShapes = JSON.parse(await file.text());
    let shapes = [];

    importedShapes.forEach(item => {
      const ref = React.createRef();
      let data = {};
      if (item.hasOwnProperty("points")) {
        // Polygon
        data = {
          ref: ref,
          shape: (
            <Polygon
              ref={ref}
              points={item.points}
              strokeWidth={item.strokeWidth}
              strokeColor={item.strokeColor}
              selectedColor={item.selectedColor}
            />
          )
        };
      } else if (item.hasOwnProperty("r")) {
        // circle
        data = {
          ref: ref,
          shape: (
            <Circle
              r={item.r}
              ref={ref}
              cx={item.cx}
              cy={item.cy}
              fill={item.fill}
              strokeWidth={item.strokeWidth}
              strokeColor={item.strokeColor}
              selectedColor={item.selectedColor}
            />
          )
        };
      } else {
        // line
        data = {
          ref: ref,
          shape: (
            <Line
              ref={ref}
              point1={item.point1}
              point2={item.point2}
              strokeWidth={item.strokeWidth}
              strokeColor={item.strokeColor}
              selectedColor={item.selectedColor}
            />
          )
        };
      }
      shapes.push(data);
    });

    this.props.createShapes(shapes);
  };

  render() {
    return (
      <div>
        <input
          accept="text/json"
          style={{ display: "none" }}
          id="import-button"
          type="file"
          onChange={e => this.inputOnChange(e)}
        />
        <label htmlFor="import-button">
          <Button
            variant="contained"
            component="span"
            color="primary"
            style={{ margin: "10px" }}
          >
            Import
          </Button>
        </label>
      </div>
    );
  }
}

export default connect(
  null,
  { createShapes }
)(ImportFile);
