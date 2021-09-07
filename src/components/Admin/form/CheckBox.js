import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { FormHelperText } from "@material-ui/core";

const CheckBox = React.memo((props) => {
  const { label, value, error, handleChange, options, ...otherProps } = props;
  const checked = (val) => (value ? value?.includes(String(val)) : false);

  return (
    <FormControl
      component="fieldset"
      error={!!error}
      {...otherProps.formControlProps}
    >
      <FormLabel component="legend" {...otherProps.formLabelProps}>
        {label}
      </FormLabel>
      <FormGroup aria-label="position" {...otherProps.formGroupProps}>
        {options?.map((e, index) => (
          <FormControlLabel
            {...otherProps.formControlLabelProps}
            key={index}
            value={e.value}
            control={
              <Checkbox
                {...otherProps.checkboxProps}
                color="primary"
                checked={checked(e.value)}
              />
            }
            label={e.label}
            onChange={(event) => {
              value
                ? value.includes(event.target.value)
                  ? handleChange(value.filter((c) => c != event.target.value))
                  : handleChange([...value, event.target.value])
                : handleChange([event.target.value]);
            }}
          />
        ))}
      </FormGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
});
export default CheckBox;
