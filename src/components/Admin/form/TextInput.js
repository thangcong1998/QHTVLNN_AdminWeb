import { TextField, InputAdornment, IconButton } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const TextInput = React.memo((props) => {
  const { type, label, value, handleChange, error, ...otherProps } = props;
  const [showpassword, setShowpassword] = useState(false);
  return (
    <TextField
      type={showpassword ? "text" : type}
      label={label}
      value={value ? value : ""}
      onChange={(e) => handleChange(e.target.value)}
      error={!!error}
      helperText={error}
      InputProps={{
        endAdornment: type === "password" && (
          <InputAdornment position="start">
            <IconButton onClick={() => setShowpassword((pre) => !pre)}>
              {showpassword ? <VisibilityOff /> : <Visibility /> }
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...otherProps}
    />
  );
});

export default TextInput;
