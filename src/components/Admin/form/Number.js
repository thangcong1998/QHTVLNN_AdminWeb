import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const Number = React.memo((props) => {
  const { type, label, value, handleChange, error, ...otherProps } = props;

  return (
    <TextField
      type={type}
      label={label}
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      error={!!error}
      helperText={error}
      {...otherProps}
    />
  );
});

export default Number;
