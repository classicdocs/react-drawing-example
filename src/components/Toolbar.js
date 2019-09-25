import React, { Component } from "react";
import { connect } from "react-redux";
import { IconButton, Grid } from "@material-ui/core";
import { selectTool, switchMode } from "../actions";
import ImportFile from "./ImportFile";
import ExportFile from "./ExportFile";
import ToolTypes from "../reducers/toolTypes";

import {
  CallMade,
  RadioButtonUnchecked,
  CropLandscape,
  ShowChart,
  OpenWith,
  RotateLeft,
  RotateRight
} from "@material-ui/icons";
import Switch from "./Switch";

class Toolbar extends Component {
  state = {
    selectedTool: ToolTypes.SELECT
  };

  onToolSelect(tool) {
    this.setState({ selectedTool: tool });
    this.props.selectTool(tool);
    this.props.onToolChange();
  }

  onSwitchMode() {
    this.props.switchMode();
  }

  render() {
    return (
      <Grid container id="toolbar">
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.SELECT
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.SELECT)}
          >
            <CallMade />
          </IconButton>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.CIRCLE
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.CIRCLE)}
          >
            <RadioButtonUnchecked />
          </IconButton>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.MOVE
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.MOVE)}
          >
            <OpenWith />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.RECTANGLE
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.RECTANGLE)}
          >
            <CropLandscape />
          </IconButton>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.LINE
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.LINE)}
          >
            <ShowChart />
          </IconButton>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.ROTATE_LEFT
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.ROTATE_LEFT)}
          >
            <RotateLeft />
          </IconButton>
          <IconButton
            className="toolbar-button"
            color={
              this.state.selectedTool === ToolTypes.ROTATE_RIGHT
                ? "secondary"
                : "default"
            }
            onClick={() => this.onToolSelect(ToolTypes.ROTATE_RIGHT)}
          >
            <RotateRight />
          </IconButton>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <ImportFile />
          <ExportFile />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div style={{ position: "absolute", bottom: "0" }}>
            <Switch onSwitchMode={() => this.onSwitchMode()} />
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default connect(
  null,
  { selectTool, switchMode }
)(Toolbar);
