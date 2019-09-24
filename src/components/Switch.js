import React from "react";
import Switcher from "@material-ui/core/Switch";

export default function Switch(props) {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true
  });

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
    props.onSwitchMode();
  };

  return (
    <div>
      <Switcher
        checked={state.checkedB}
        onChange={handleChange("checkedB")}
        value="checkedB"
        color="primary"
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    </div>
  );
}
