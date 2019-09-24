import {
  SELECT_TOOL,
  SWITCH_MODE,
  CREATE_SHAPE,
  SELECT_SHAPE,
  UPDATE_SHAPE,
  UNSELECT_SHAPES
} from "./types";

export const createShape = shape => {
  return {
    type: CREATE_SHAPE,
    payload: shape
  };
};

export const updateShape = (oldShape, newShape) => {
  return {
    type: UPDATE_SHAPE,
    payload: { oldShape, newShape }
  };
};

export const selectShape = shape => {
  return {
    type: SELECT_SHAPE,
    payload: shape
  };
};

export const unselectShapes = () => {
  return {
    type: UNSELECT_SHAPES
  };
};

export const selectTool = tool => {
  return {
    type: SELECT_TOOL,
    payload: tool
  };
};

export const switchMode = () => {
  return {
    type: SWITCH_MODE
  };
};