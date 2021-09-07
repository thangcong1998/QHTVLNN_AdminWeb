import React, { Fragment, useState } from "react";
import { FormControl, FormHelperText, TextField } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";

const Date = React.memo((props) => {
  const { value, label, handleChange, error, helperText, size, ...otherProps } = props;
  const classes = useStyle();
  return (
    <FormControl
      error={!!error}
      style={{
        width: "100%",
      }}
      {...otherProps.formControlProps}
    >
      <DatePicker
        className={error ? classes.errors : classes.normal}
        label={label}
        variant={otherProps.variant}
        inputVariant={otherProps.inputVariant}
        value={value}
        onChange={(e) => handleChange(e)}
        format="DD/MM/YYYY"
        TextFieldComponent={(TextFieldProps) => (
          <TextField {...TextFieldProps} size={size} />
        )}
        views={["date", "month", "year",]}
      />
      <FormHelperText>{helperText ? helperText : error}</FormHelperText>
    </FormControl>
  );
});

const useStyle = makeStyles((theme) => ({
  errors: {
    "& label": {
      color: "#f44336",
    },
    "& fieldset": {
      borderColor: "#f44336",
    },
  },
  normal: {},
}));
export default Date;
