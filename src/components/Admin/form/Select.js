import React, { useEffect, useMemo, useState } from "react";
import { TextField, MenuItem } from "@material-ui/core";
import { inputTypes } from "../../../common/constants";

export default React.memo((props) => {
  const { label, value, handleChange, error, readOnly, ...otherProps } = props;

  const TextFieldDefaultProps = useMemo(
    () => ({
      fullWidth: true,
      variant: "outlined",
      //   size: "small",
    }),
    []
  );

  const SelectProps = useMemo(
    () => ({
      select: true,
      children: otherProps.options?.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      )),
    }),
    [props]
  );

  return (
    <TextField
      {...TextFieldDefaultProps}
      {...otherProps}
      {...SelectProps}
      label={label}
      value={value || ""}
      onChange={({ target: { value } }) => handleChange(value)}
      error={!!error}
      helperText={error}
      InputLabelProps={{ shrink: !!value }}
      readOnly={readOnly}
    />
  );
});
