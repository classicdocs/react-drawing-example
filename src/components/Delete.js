import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteSelectedShapes } from "../actions/index";

class Delete extends Component {
  constructor() {
    super();
    this.addEventListener();
  }
  addEventListener = () => {
    document.addEventListener("keydown", e => {
      const keyCode = e.keyCode;
      if (keyCode === 46) {
        this.props.deleteSelectedShapes();
      }
    });
  };

  render() {
    return null;
  }
}

export default connect(
  null,
  { deleteSelectedShapes }
)(Delete);
