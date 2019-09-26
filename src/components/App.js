import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Line from "./Line";
import Rectangle from "./Rectangle";
import Polygon from "./Polygon";
import {
  createShape,
  selectShape,
  updateShape,
  unselectShapes,
  deleteShape
} from "../actions/index";
import Toolbar from "./Toolbar";
import ToolTypes from "../reducers/toolTypes";
import Circle from "./Circle";
import { CENTRALIZED_MODE } from "../reducers/switchTypes";
import { isEqualCentralized } from "../models/Point";
import Delete from "./Delete";
import { splitPolygon } from "../util/splitPolygon";

class App extends Component {
  state = {
    line: {
      lastPoint: null,
      newPoint: null
    },
    lines: [],
    select: {
      firstPoint: null,
      lastPoint: null,
      isSelected: false
    },
    move: {
      firstPoint: null,
      offsetX: 0,
      offsetY: 0
    },
    resize: {
      firstPoint: null,
      resize: false
    },
    client: null
  };

  registerClick = e => {
    switch (this.props.tool) {
      case ToolTypes.RECTANGLE: {
        this.createRectangle(e);
        break;
      }
      case ToolTypes.CIRCLE: {
        this.createCircle(e);
        break;
      }
      case ToolTypes.LINE: {
        this.createLine(e);
        break;
      }
      case ToolTypes.ROTATE_LEFT: {
        this.rotate("left");
        break;
      }
      case ToolTypes.ROTATE_RIGHT: {
        this.rotate("right");
        break;
      }
      default:
        return;
    }
  };

  registerMove = e => {
    const point = this.getCoordinates(e);

    switch (this.props.tool) {
      case ToolTypes.LINE: {
        if (this.state.line.lastPoint !== null) {
          this.setState({
            line: { ...this.state.line, newPoint: point }
          });
        }
        break;
      }
      case ToolTypes.SELECT: {
        let resizeOverPoint = false;
        const shapes = this.props.selectedShapes;
        for (let i = 0; i < shapes.length; i++) {
          if (shapes[i].ref.current.isResizible(point)) {
            document.body.style.cursor = "ne-resize";
            resizeOverPoint = true;
          } else {
          }
        }
        if (!resizeOverPoint) {
          if (!this.state.resize.resize) {
            document.body.style.cursor = "default";
          } else {
            document.body.style.cursor = "ne-resize";
          }
        }

        if (
          this.state.select.firstPoint !== null &&
          !this.state.resize.resize
        ) {
          this.setState({
            select: { ...this.state.select, lastPoint: point }
          });
        }

        break;
      }
      default:
        return;
    }
  };

  getCoordinates(evt) {
    var e = this.state.client ? this.state.client : evt.target;
    this.setState({ client: e });
    var dim = e.getBoundingClientRect();
    var x, y;
    if (this.props.mode === CENTRALIZED_MODE) {
      x = Math.round(evt.clientX / 10) * 10 - Math.round(dim.left / 10) * 10;
      y = Math.round(evt.clientY / 10) * 10 - Math.round(dim.top / 10) * 10;
    } else {
      x = evt.clientX - dim.left;
      y = evt.clientY - dim.top;
    }

    return { x, y };
  }

  checkForSplitPolygon(point2) {
    let shapeToDelete = null;
    this.props.shapes.forEach(item => {
      if (item.shape.type.name === "Polygon") {
        // const line = {
        //   point1: this.state.line.lastPoint,
        //   point2: this.state.line.newPoint
        // };
        const line = {
          point1: this.state.line.lastPoint,
          point2
        };

        const result = splitPolygon(item.shape.props, line);

        if (result === null) {
          return;
        }

        const data1 = this.createPolygon(result.leftPolygonPoints);
        const data2 = this.createPolygon(result.rightPolygonPoints);
        this.props.createShape(data1);
        this.props.createShape(data2);

        shapeToDelete = item;
      }
    });

    if (shapeToDelete) {
      this.props.deleteShape(shapeToDelete);
      this.resetState();
      return true;
    }
    return false;
  }

  createLine(e) {
    const point1 = this.getCoordinates(e);

    if (this.state.line.lastPoint === null) {
      this.setState({ line: { ...this.state.line, lastPoint: point1 } });
      return;
    }

    const point2 = this.state.line.lastPoint;

    if (this.checkForSplitPolygon(point1)) {
      return;
    }

    this.setState({ line: { ...this.state.line, lastPoint: point1 } });

    let ref = React.createRef();

    let data = {
      ref: ref,
      shape: (
        <Line
          ref={ref}
          point1={point1}
          point2={point2}
          strokeWidth="5"
          strokeColor="grey"
          selectedColor="red"
        />
      )
    };

    this.setState(
      {
        lines: [...this.state.lines, data]
      },
      () => {
        const length = this.state.lines.length;

        if (length >= 3) {
          const firstPoint = this.state.lines[0].shape.props.point2;

          if (isEqualCentralized(point1, firstPoint)) {
            let points = [];
            this.state.lines.forEach(line => {
              points.push(line.shape.props.point2);
            });
            let data = this.createPolygon(points);

            this.props.createShape(data);

            this.setState({ lines: [] }, () => this.resetState());
          }
        }
      }
    );
  }

  createPolygon(points) {
    let ref = React.createRef();

    let data = {
      ref: ref,
      shape: (
        <Polygon
          ref={ref}
          points={points}
          strokeWidth="5"
          strokeColor="grey"
          selectedColor="red"
          resizePoints={[]}
        />
      )
    };

    return data;
  }

  createRectangle(e) {
    const point1 = this.getCoordinates(e);
    const points = [
      point1,
      { ...point1, x: point1.x + 100 },
      { ...point1, x: point1.x + 100, y: point1.y + 100 },
      { ...point1, y: point1.y + 100 }
    ];

    const data = this.createPolygon(points);

    this.props.createShape(data);
  }

  createCircle(e) {
    const center = this.getCoordinates(e);
    const r = 50;

    let ref = React.createRef();

    let data = {
      ref: ref,
      shape: (
        <Circle
          r={r}
          ref={ref}
          cx={center.x}
          cy={center.y}
          fill="none"
          strokeColor="grey"
          selectedColor="red"
          strokeWidth="5"
        />
      )
    };
    this.props.createShape(data);
  }

  renderShapes() {
    return this.props.shapes.map((item, index) => {
      item = item.shape;
      return { ...item, key: index };
    });
  }

  renderLines() {
    return this.state.lines.map((item, index) => {
      item = item.shape;
      return { ...item, key: index };
    });
  }

  renderDrawingLine() {
    switch (this.props.tool) {
      case ToolTypes.LINE: {
        if (this.state.line.newPoint !== null) {
          return (
            <Line
              point1={this.state.line.lastPoint}
              point2={this.state.line.newPoint}
              strokeColor="grey"
              strokeWidth="5"
            />
          );
        }
        break;
      }
      case ToolTypes.SELECT: {
        if (
          this.state.select.isSelected &&
          this.state.select.lastPoint !== null
        ) {
          const point1 = this.state.select.firstPoint;
          const point3 = this.state.select.lastPoint;
          const offsetX = point3.x - point1.x;
          const offsetY = point3.y - point1.y;
          const point2 = { ...point1, x: point1.x + offsetX };
          const point4 = {
            ...point1,
            y: point1.y + offsetY
          };
          const strokeColor = "blue";
          const strokeWidth = "1";
          return (
            <Rectangle
              points={[point1, point2, point3, point4]}
              strokeColor={strokeColor}
              strokeWidth={strokeWidth}
            />
          );
        }
        break;
      }
      default:
        return;
    }
  }

  registerRightClick = e => {
    e.preventDefault();
    switch (this.props.tool) {
      case ToolTypes.LINE: {
        this.resetState();
        break;
      }
      case ToolTypes.SELECT: {
        this.props.unselectShapes();
        break;
      }
      case ToolTypes.MOVE: {
        this.props.unselectShapes();
        break;
      }
      default:
        return;
    }
  };

  onKeyDown = e => {
    console.log("EEEE");
  };

  resetState() {
    switch (this.props.tool) {
      case ToolTypes.LINE: {
        this.state.lines.forEach(line => {
          this.props.createShape(line);
        });

        this.setState({
          line: { lastPoint: null, newPoint: null },
          lines: []
        });

        break;
      }
      default:
        return;
    }
  }

  onToolChange = () => {
    this.resetState();
  };

  selectShape = point => {
    let shapes = this.props.shapes;

    if (
      this.state.select.firstPoint.x === this.state.select.lastPoint.x &&
      this.state.select.firstPoint.y === this.state.select.lastPoint.y
    ) {
      // normal select

      for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].ref.current.isSelected(point)) {
          this.props.selectShape(shapes[i]);
          return;
        }
      }
    } else {
      // laso select

      const point1 = this.state.select.firstPoint;
      const point3 = this.state.select.lastPoint;
      const offsetX = point3.x - point1.x;
      const offsetY = point3.y - point1.y;
      const point2 = { ...point1, x: point1.x + offsetX };
      const point4 = { ...point1, y: point1.y + offsetY };

      const points = [point1, point2, point3, point4];

      for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].ref.current.isInsideLasoSelect(points)) {
          this.props.selectShape(shapes[i]);
        }
      }
    }
  };

  onMouseDown = e => {
    if (window.event.which === 3) {
      return;
    }
    const point = this.getCoordinates(e);

    switch (this.props.tool) {
      case ToolTypes.SELECT: {
        if (document.body.style.cursor === "ne-resize") {
          this.setState({ resize: { firstPoint: point, resize: true } });
          break;
        }
        this.setState({
          select: {
            ...this.state.select,
            firstPoint: point,
            isSelected: true
          }
        });
        break;
      }
      case ToolTypes.MOVE: {
        this.setState({
          move: {
            ...this.state.move,
            firstPoint: point
          }
        });
        document.body.style.cursor = "move";
        break;
      }
      default:
        return;
    }
  };

  onMouseUp = e => {
    if (window.event.which === 3) {
      return;
    }
    const point = this.getCoordinates(e);

    switch (this.props.tool) {
      case ToolTypes.SELECT: {
        if (this.state.resize.resize) {
          this.setState(
            {
              resize: { ...this.state.resize, resize: false, lastPoint: point }
            },
            () => this.resize()
          );
          return;
        }
        this.setState(
          {
            select: {
              ...this.state.select,
              lastPoint: point,
              isSelected: false
            }
          },
          () => this.selectShape(point)
        );

        break;
      }
      case ToolTypes.MOVE: {
        document.body.style.cursor = "default";

        let shapes = this.props.selectedShapes;

        const offsetX = point.x - this.state.move.firstPoint.x;
        const offsetY = point.y - this.state.move.firstPoint.y;

        shapes.forEach(item => {
          let updatedShape = {
            ...item,
            shape: {
              ...item.shape,
              props: item.shape.ref.current.move(offsetX, offsetY)
            }
          };

          this.props.updateShape(item, updatedShape);
        });

        break;
      }
      default:
        return;
    }
  };

  resize = () => {
    document.body.style.cursor = "default";

    let shapes = this.props.selectedShapes;

    shapes.forEach(item => {
      if (item.ref.current.isResizible(this.state.resize.firstPoint)) {
        let updatedShape = {
          ...item,
          shape: {
            ...item.shape,
            props: item.shape.ref.current.resize(
              this.state.resize.firstPoint,
              this.state.resize.lastPoint
            )
          }
        };
        this.props.updateShape(item, updatedShape);
      }
    });
  };

  rotate = direction => {
    const shapes = this.props.selectedShapes;

    shapes.forEach(item => {
      if (item.shape.type === Circle) {
        return;
      }

      let updatedShape = {
        ...item,
        shape: {
          ...item.shape,
          props: item.shape.ref.current.rotate(direction, Math.PI / 6)
        }
      };
      this.props.updateShape(item, updatedShape);
    });
  };

  render() {
    return (
      <div>
        <Delete />
        <Grid container onKeyDown={this.onKeyDown}>
          <Grid item lg={1} md={1} sm={1} xs={12}>
            <Toolbar onToolChange={this.onToolChange} />
          </Grid>
          <Grid item lg={11} md={11} sm={11} xs={12}>
            <svg
              id="svg"
              onClick={this.registerClick}
              onMouseMove={this.registerMove}
              onContextMenu={this.registerRightClick}
              onMouseDown={this.onMouseDown}
              onMouseUp={this.onMouseUp}
            >
              <defs>
                <pattern
                  id="smallGrid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="gray"
                    strokeWidth="0.5"
                  />
                </pattern>
                <pattern
                  id="grid"
                  width="100"
                  height="100"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path
                    d="M 100 0 L 0 0 0 100"
                    fill="none"
                    stroke="gray"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              {this.renderDrawingLine()}
              {this.renderShapes()}
              {this.renderLines()}
            </svg>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    shapes: state.data.shapes,
    selectedShapes: state.data.selectedShapes,
    tool: state.tool,
    mode: state.mode
  };
};

export default connect(
  mapStateToProps,
  { createShape, selectShape, updateShape, unselectShapes, deleteShape }
)(App);
