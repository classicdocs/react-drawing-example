import { SELECT_TOOL } from "../actions/types";
import ToolTypes from "./toolTypes";

export default (state = ToolTypes.SELECT, action) => {
  switch (action.type) {
    case SELECT_TOOL: {
      return action.payload;
    }
    default:
      return state;
  }
};
