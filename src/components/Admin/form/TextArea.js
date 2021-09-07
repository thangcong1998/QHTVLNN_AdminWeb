import { TextField } from "@material-ui/core";
import React, { useState, useEffect } from "react";

const TextArea = React.memo((props) => {
  const { type, label, value, handleChange, error, ...otherProps } = props;

  return (
    <TextField
      type={type}
      label={label}
      value={value ? value : ""}
      onChange={(e) => handleChange(e.target.value)}
      error={!!error}
      helperText={error}
      multiline
      {...otherProps}
    />
  );
});

export default TextArea;
