import React, { useMemo } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
const DataTable = React.memo((props) => {
  const classes = useStyle();
  const {
    //data
    data,
    columns,
    // callback
    //loading
    loading,
    //style
    style,
    ...others
  } = props;

  const TabHead = () => {
    return (
      <TableHead>
        <TableRow {...others.header}>
          {columns.map((column) => (
            <TableCell {...column.header}>
              {typeof column.label == "function"
                ? column.label()
                : column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const TabBody = () => {
    return (
      <TableBody {...others.body}>
        {data?.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column, i) => (
              <TableCell {...column.props} component="th" scope="row">
                {column.render ? column.render(row) : row[column.field]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const CoreTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          {TabHead()}
          {TabBody()}
        </Table>
      </TableContainer>
    );
  };

  return CoreTable();
});

export default DataTable;

const useStyle = makeStyles((theme) => ({}));
