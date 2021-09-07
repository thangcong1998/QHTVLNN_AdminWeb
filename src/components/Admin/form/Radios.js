import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

const Radios = React.memo((props) => {
  const { label, value, error, handleChange, options, ...otherProps } = props;
  return (
    <FormControl
      component="fieldset"
      error={!!error}
      {...otherProps.formControlProps}
    >
      <FormLabel component="legend" {...otherProps.formLabelProps}>
        {label}
      </FormLabel>
      <RadioGroup
        name="position"
        {...otherProps.radioGroupProps}
      >
        {options.map((e, index) => (
          <FormControlLabel
            key={e.label}
            value={e.value}
            control={
              <Radio
                color="primary"
                {...otherProps.radioProps}
                checked={
                  e.value == "" || e.value == null
                    ? value == "" || value == undefined
                    : e.value == value
                }
              />
            }
            label={e.label}
            onChange={(e) => handleChange(e.target.value)}
            {...otherProps.formControlLabelProps}
          />
        ))}
      </RadioGroup>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
});

export default Radios;
