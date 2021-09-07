import React from "react";
import { Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Filter from "../../../components/table/Filter";
import { color } from "../../../common/constants";
import Button from "@material-ui/core/Button";

const AuditToolbar = React.memo((props) => {
  const { setParams, checked, refetch, trashed, columns, ...others } = props;
  const classes = useStyles();

  const NormalMode = () => {
    return (
      <>
        <div>
          <Button className={classes.button}></Button>
        </div>
        <div className={classes.leftBar}>
          <Filter setParams={setParams} inputs={FilterInput} />
        </div>
      </>
    );
  };

  return (
    <Toolbar className={classes.toolbar} {...others}>
      {NormalMode()}
    </Toolbar>
  );
});

const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingLeft: 10,
  },
  leftBar: {
    display: "flex",
  },
  filter: {
    width: 350,
    maxHeight: 400,
    padding: "15px 18px",
  },
  checked: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 10,
    paddingLeft: 10,
    height: 64,
    backgroundColor: color.WARNING,
    "& h4": {
      fontSize: "1.5rem",
      fontWeight: "400",
      color: "#fff",
    },
    "& button": {
      color: "#fff",
    },
  },
}));

export default AuditToolbar;

export const FilterInput = [
  {
    label: "Hành động",
    field: "event",
    type: "select",
    options: [
      {
        label: "Tất cả",
        value: "",
      },
      {
        label: "Tạo mới",
        value: "created",
      },
      {
        label: "Cập nhật",
        value: "updated",
      },
      {
        label: "Xóa",
        value: "deleted",
      },
      {
        label: "Khôi phục",
        value: "restored",
      },
    ],
    grid: { xs: 12, sm: 12, md: 12 },
  },
];
