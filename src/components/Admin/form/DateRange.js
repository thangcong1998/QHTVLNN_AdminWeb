import React, { Fragment, useState } from "react";
import { FormControl, FormHelperText } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { makeStyles } from "@material-ui/styles";

export default React.memo((props) => {
  const { value, label, handleChange, ...otherProps } = props;
  const classes = useStyle();
  return (
    <div>
      <div style={{ width: "100%" }}>{label}</div>

      <div className={classes.root}>
        <div>
          <FormControl
            style={{
              width: "50%",
            }}
            {...otherProps.formControlProps}
          >
            <DatePicker
              className={classes.normal}
              label={"Từ ngày"}
              variant={otherProps.variant}
              inputVariant={otherProps.inputVariant}
              value={value?.start_date || null}
              onChange={(e) => handleChange({ ...value, start_date: e })}
              format="DD/MM/YYYY"
              views={["date", "month", "year"]}
            />
          </FormControl>
        </div>
        <div>
          <FormControl
            style={{
              width: "50%",
            }}
            {...otherProps.formControlProps}
          >
            <DatePicker
              className={classes.normal}
              label={"Đến ngày"}
              variant={otherProps.variant}
              inputVariant={otherProps.inputVariant}
              value={value?.end_date || null}
              onChange={(e) => handleChange({ ...value, end_date: e })}
              format="DD/MM/YYYY"
              views={["date", "month", "year"]}
            />
          </FormControl>
        </div>
      </div>
    </div>
  );
});
const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
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
