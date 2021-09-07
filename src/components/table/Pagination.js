import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import { Toolbar, Select, MenuItem } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    borderTop: "1px solid #e0e0e0",
    justifyContent: "space-between",
  },
  pagiLeft: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    minWidth: "30%",
  },
  pagination: {
    "& .Mui-selected": {
      background: "#1976d2",
      color: "#fff",
    },
  },
}));

export default React.memo((props) => {
  const classes = useStyles();
  const {
    setParams,
    page,
    count,
    perPage,
    fromTo,
    total,
    ...otherProps
  } = props;
  const handleChangePage = (e) => { };
  const handleChangeRowsPerPage = (e) => { };
  return (
    <Toolbar className={classes.root}>
      <div className={classes.pagiLeft}>
        <div>
          <span
            style={{
              marginRight: 10,
            }}
          >
            Hiển thị
          </span>
          <Select
            value={perPage}
            defaultValue={10}
            onChange={(event) =>
              setParams((params) => ({
                ...params,
                per_page: event.target.value,
                page: 1,
              }))
            }
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </div>
        {fromTo ? (
          <div className={classes.fromTo}>
            <span>{fromTo[0]}</span> - <span>{fromTo[1]}</span>
          </div>
        ) : (
            ""
          )}
        {total ? <div className={classes.total}>Tổng {total}</div> : ""}
      </div>
      <div className={classes.pagiRight}>
        <Pagination
          className={classes.pagination}
          count={count}
          page={page}
          onChange={(event, page) =>
            setParams((params) => ({ ...params, page: page }))
          }
        />
      </div>
    </Toolbar>
  );
});
