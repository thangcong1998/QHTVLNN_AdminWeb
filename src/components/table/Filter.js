import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { FlatForms } from "../Admin/form/Form";
import { makeStyles } from "@material-ui/core/styles";
import { IconButton, Button, CircularProgress } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import Popover from "../popover";
import FilterListIcon from "@material-ui/icons/FilterList";
import RefreshIcon from "@material-ui/icons/Refresh";
import { color } from "../../common/constants";

const Filter = React.memo((props) => {
  const classes = useStyles();
  const { inputs, loading, setParams } = props;
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) =>
      setParams((params) => ({ ...params, ...values, page: 1 })),
  });
  useEffect(() => {
    const formikKeys = Object.keys(formik.values);
    const inputKeys = inputs.map((input) => input.field);
    for (let key of formikKeys) {
      if (!inputKeys.includes(key)) formik.setFieldValue(key, null);
    }
  }, [inputs]);

  const handleReset = () => {
    formik.setValues({});
    setParams((params) => ({ per_page: params.per_page, page: 1 }));
  };

  const content = () => {
    return (
      <div className={classes.filter}>
        <div className={classes.buttons}>
          <Button
            variant="contained"
            className={classes.buttonFilter}
            startIcon={
              loading ? <CircularProgress size={20} /> : <FilterListIcon />
            }
            onClick={formik.handleSubmit}
            disabled={loading}
            id={"search"}
          >
            Tìm kiếm
          </Button>
          <Button
            className={classes.buttonReset}
            startIcon={<RefreshIcon />}
            onClick={handleReset}
          >
            Thiết lập lại
          </Button>
        </div>

        <FlatForms formik={formik} inputs={inputs} />
      </div>
    );
  };

  return (
    <React.Fragment>
      <Popover
        content={content()}
        children={
          <IconButton title="Tìm kiếm">
            <SearchIcon />
          </IconButton>
        }
      ></Popover>
    </React.Fragment>
  );
});
const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  filter: {
    width: 380,
    padding: "15px 18px",
  },
  buttons: {
    display: "flex",
    marginBottom: 20,
  },
  buttonFilter: {
    background: color.PRIMARY,
    color: "#fff",
  },
  buttonReset: {
    padding: "6px 16px",
    marginLeft: 10,
  },
}));
export default Filter;
