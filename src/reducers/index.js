import { combineReducers } from "redux";
import toolReducer from "./toolReducer";
import switchReducer from "./switchReducer";
import dataReducer from "./dataReducer";

export default combineReducers({
  tool: toolReducer,
  mode: switchReducer,
  data: dataReducer
});
