import {
  CREATE_SHAPE,
  CREATE_SHAPES,
  SELECT_SHAPE,
  UPDATE_SHAPE,
  UNSELECT_SHAPES
} from "../actions/types";

const INITIAL_STATE = {
  shapes: [],
  selectedShapes: []
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CREATE_SHAPE: {
      return { ...state, shapes: [...state.shapes, action.payload] };
    }
    case CREATE_SHAPES: {
      return { ...state, shapes: action.payload };
    }
    case UPDATE_SHAPE: {
      return {
        ...state,
        shapes: state.shapes.map(el =>
          el.ref === action.payload.oldShape.ref ? action.payload.newShape : el
        )
      };
    }
    case SELECT_SHAPE: {
      // SELECT - UNSELECT
      let newSelected = true;
      for (let i = 0; i < state.selectedShapes.length; i++) {
        if (state.selectedShapes[i].ref === action.payload.ref) {
          newSelected = false;
        }
      }

      let selectedShapes;

      if (newSelected) {
        selectedShapes = [...state.selectedShapes, action.payload];
      } else {
        selectedShapes = state.selectedShapes.filter(
          el => el.ref !== action.payload.ref
        );
      }

      return {
        ...state,
        selectedShapes: selectedShapes,
        shapes: state.shapes.map(el =>
          el === action.payload
            ? {
                ...el,
                shape: {
                  ...el.shape,
                  props: {
                    ...el.shape.props,
                    selected: el.shape.props.selected ? false : true
                  }
                }
              }
            : el
        )
      };
    }
    case UNSELECT_SHAPES: {
      return {
        ...state,
        selectedShapes: [],
        shapes: state.shapes.map(el => {
          return {
            ...el,
            shape: {
              ...el.shape,
              props: { ...el.shape.props, selected: false }
            }
          };
        })
      };
    }
    default:
      return state;
  }
};
