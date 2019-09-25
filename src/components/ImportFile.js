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
    if (file !== "" && file !== undefined) {
      if (file.name.split(".")[1] === "json") {
        this.upload(file);
      } else {
        alert("Wrong file type. Choose .json");
      }
    }
  };

  upload = async file => {
    const importedShapes = JSON.parse(await file.text());
    let shapes = [];

    importedShapes.forEach(item => {
      const ref = React.createRef();
      let data = {};
      if (item.type === "Polygon") {
        // Polygon
        data = {
          ref: ref,
          shape: (
            <Polygon
              ref={ref}
              points={item.data.points}
              strokeWidth={item.data.strokeWidth}
              strokeColor={item.data.strokeColor}
              selectedColor={item.data.selectedColor}
            />
          )
        };
      } else if (item.type === "Circle") {
        // circle
        data = {
          ref: ref,
          shape: (
            <Circle
              r={item.data.r}
              ref={ref}
              cx={item.data.cx}
              cy={item.data.cy}
              fill={item.data.fill}
              strokeWidth={item.data.strokeWidth}
              strokeColor={item.data.strokeColor}
              selectedColor={item.data.selectedColor}
            />
          )
        };
      } else if (item.type === "Line") {
        // line
        data = {
          ref: ref,
          shape: (
            <Line
              ref={ref}
              point1={item.data.point1}
              point2={item.data.point2}
              strokeWidth={item.data.strokeWidth}
              strokeColor={item.data.strokeColor}
              selectedColor={item.data.selectedColor}
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
