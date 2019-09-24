import { SWITCH_MODE } from "../actions/types";
import { NORMAL_MODE, CENTRALIZED_MODE } from "./switchTypes";

export default (state = CENTRALIZED_MODE, action) => {
  switch (action.type) {
    case SWITCH_MODE: {
      if (state === NORMAL_MODE) return CENTRALIZED_MODE;
      return NORMAL_MODE;
    }
    default:
      return state;
  }
};
