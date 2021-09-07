import React from "react";
import {
  Switch,
  FormControl,
  FormControlLabel,
  FormHelperText,
} from "@material-ui/core";

export default React.memo((props) => {
  const { label, handleChange, value, otherProps, error, disabled } = props;
  return (
    <FormControl
      component="fieldset"
      error={!!error}
      {...otherProps?.formControlProps}
    >
      <FormControlLabel
        control={
          <Switch
            disabled={disabled}
            onChange={(e) => handleChange(e.target.checked)}
            checked={value}
            color="primary"
          />
        }
        label={label}
        labelPlacement="end"
      />
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
});
