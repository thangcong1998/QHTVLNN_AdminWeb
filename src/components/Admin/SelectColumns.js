import React, { useMemo } from "react";
import Popover from "../popover";
import ViewColumnIcon from "@material-ui/icons/ViewColumn";
import {
  Grid,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const FieldCheck = ({ columns }) => {
  const classes = useStyle();
  const FieldCheckCols = useMemo(() => {
    return (
      <div className={classes.root}>
        <Grid container>
          {columns?.columnChecked.map((column, index) => (
            <Grid item xs={4}>
              <FormControlLabel
                key={index}
                value={column.display}
                control={<Checkbox color="primary" checked={column.display} />}
                label={column.label}
                onChange={(event) => columns.handleChange(column)}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }, [columns?.columnChecked]);

  return (
    <Popover
      content={FieldCheckCols}
      children={
        <IconButton title="">
          <ViewColumnIcon />
        </IconButton>
      }
    ></Popover>
  );
};
const useStyle = makeStyles((themem) => ({
  root: {
    width: 500,
    padding: 10,
  },
}));
export default FieldCheck;
