import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";

export class ExportFile extends Component {
  download = () => {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none;";

    let shapes = [];
    this.props.shapes.forEach(item => {
      const shape = {
        data: item.shape.props,
        type: item.shape.type.name
      };
      shapes.push(shape);
    });

    if (shapes.length === 0) {
      alert("There is no shapes to export!");
      return;
    }

    const json = JSON.stringify(shapes);
    const blob = new Blob([json], { type: "octet/stream" });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.target = "_blank";
    a.download = "shapes.json";

    a.click();
  };

  render() {
    return (
      <Button
        variant="contained"
        component="span"
        color="primary"
        style={{ margin: "10px" }}
        onClick={this.download}
      >
        Export
      </Button>
    );
  }
}

const mapStateToProps = state => {
  return {
    shapes: state.data.shapes
  };
};

export default connect(mapStateToProps)(ExportFile);
