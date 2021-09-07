import React, { useMemo, useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  IconButton,
  Checkbox,
  TableFooter,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import HeightIcon from '@material-ui/icons/Height';
import { makeStyles } from "@material-ui/styles";
import VisibilityIcon from "@material-ui/icons/Visibility";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useHistory } from "react-router-dom";

const DataTable = React.memo((props) => {
  const classes = useStyle();
  const {
    //data
    data,
    //columns
    columns,
    //trashed
    trashed,
    // callback
    onEdit,
    onDelete,
    onCheck,
    onSort,
    onRestore,
    onClickRow,
    //checkList
    checked,
    //sort
    sort,
    //empty
    empty,
    //ActionCell
    actionColumn,
    //loading
    loading,
    //style
    style,
    ...others
  } = props;
  const history = useHistory();
  const checkAll = () => {
    return (
      <Checkbox
        className={classes.checkbox}
        checked={checked?.length === data?.length}
        color="primary"
        onChange={() => {
          if (checked?.length > 0) {
            onCheck([], "all");
          } else {
            onCheck(
              data?.map((e) => e.id),
              "all"
            );
          }
        }}
        indeterminate={
          !(checked?.length === data?.length) && checked?.length > 0
        }
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    );
  };
  const check = (id) => (Array.isArray(checked) ? checked.includes(id) : null);
  const checkColumn = (row) => {
    return (
      <Checkbox
        className={classes.checkbox}
        checked={check(row.id)}
        color="primary"
        onChange={() => (onCheck ? onCheck(row, "row") : null)}
        inputProps={{ "aria-label": "primary checkbox" }}
      />
    );
  };
  const TabHead = () => {
    return (
      <TableHead>
        <TableRow {...others.header}>
          {/* Check clolumn */}
          {checked ? (
            <TableCell
              style={{
                width: 45,
              }}
            >
              {checkAll()}
            </TableCell>
          ) : (
              ""
            )}
          {/* Columns */}
          {columns.map((column) =>
            column.display ? (
              <TableCell
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
                align="left"
                {...column.header}
                key={column.label}
                sortDirection={sort?.type ? sort.type : false}
              >
                {
                  //sort
                  column.sort == true ? (
                    <TableSortLabel
                      onClick={() => onSort(column)}
                      active={column.field === sort?.field}
                      direction={sort?.type}
                    >
                      {typeof column.label === "function"
                        ? column.label()
                        : sort === null ? column.label + '↕' : column.label}
                    </TableSortLabel>
                  ) : typeof column.label === "function" ? (
                    column.label()
                  ) : (
                        column.label
                      )
                }
              </TableCell>
            ) : (
                ""
              )
          )}
          {/* Action column */}
          {actionColumn?.hide ? null : (
            <TableCell {...actionColumn?.props}></TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  };
  const _onEdit = (row) => {
    if (onEdit) {
      return (
        <IconButton
          color="primary"
          title="Xem"
          style={{
            padding: 3,
          }}
          onClick={() => (onEdit ? onEdit(row) : null)}
        >
          <VisibilityIcon />
        </IconButton>
      );
    } else {
      return null;
    }
  };
  const _onDelete = (row) => {
    if (onDelete) {
      return (
        <IconButton
          title={"Xóa"}
          style={{
            color: "#c90303c7",
            padding: 3,
          }}
          onClick={() =>
            onDelete ? onDelete(row, trashed ? "force" : "") : null
          }
        >
          {trashed ? <DeleteForeverIcon /> : <DeleteIcon />}
        </IconButton>
      );
    } else {
      return null;
    }
  };
  const _onRestore = (row) => {
    if (trashed) {
      return (
        <IconButton
          title={"Khôi phục"}
          style={{
            padding: 3,
          }}
          onClick={() => (onRestore ? onRestore(row) : null)}
        >
          <RestoreFromTrashIcon />
        </IconButton>
      );
    } else {
      return null;
    }
  };
  const _onClickRow = (row) => {
    if (onClickRow) {
      typeof onClickRow === "function"
        ? onClickRow(row)
        : history.push(onClickRow);
    }
  };
  const ActionCell = (row) => {
    return (
      <TableCell
        style={{
          textAlign: "right",
          minWidth: 150,
        }}
        {...actionColumn?.props}
      >
        {actionColumn?.render ? actionColumn?.render(row) : ""}
        {_onEdit(row)}
        {_onDelete(row)}
        {_onRestore(row)}
      </TableCell>
    );
  };

  const _empty = () => {
    if (empty) {
      return typeof empty === "function" ? empty() : empty;
    }
    return "Không có dữ liệu";
  };

  const TabBody = () => {
    return (
      <TableBody {...others.body}>
        {data?.length > 0 && !loading ? (
          data?.map((row, index) => (
            <TableRow
              key={index}
              className={classes.row}
            >
              {/* checked */}
              {checked ? <TableCell>{checkColumn(row)}</TableCell> : ""}
              {/* columns */}
              {columns.map((column, i) =>
                column.display ? (
                  <TableCell
                    style={{
                      fontSize: "1rem",
                      padding: 8,
                    }}
                    align="left"
                    {...column.props}
                    component="td"
                    scope="row"
                    key={i}
                    onClick={() => _onClickRow(row)}
                  >
                    {column.render ? column.render(row) : row[column.field]}
                  </TableCell>
                ) : (
                    ""
                  )
              )}
              {actionColumn?.hide ? null : ActionCell(row)}
            </TableRow>
          ))
        ) : (
            <TableRow>
              <TableCell className={classes.empty} colSpan={columns?.length + 2}>
                {loading ? (
                  <CircularProgress size={24} className={classes.loading} />
                ) : (
                    _empty()
                  )}
              </TableCell>
            </TableRow>
          )}
      </TableBody>
    );
  };

  const TabFooter = () => {
    return (
      <TableFooter {...others.footer}>
        <TableRow></TableRow>
      </TableFooter>
    );
  };

  const CoreTable = () => {
    return (
      <TableContainer component={Paper} elevation={0} {...others}>
        <Table className={classes.table} aria-label="simple table">
          {TabHead()}
          {TabBody()}
          {TabFooter()}
        </Table>
      </TableContainer>
    );
  };

  return CoreTable();
});

export default DataTable;

const useStyle = makeStyles((theme) => ({
  checkbox: {
    padding: 0,
  },
  empty: {
    width: "100%",
    textAlign: "center",
    fontSize: "1rem",
  },
  row: {
    "&:hover": {
      background: "#f0f8ff",
    },
  },
}));
