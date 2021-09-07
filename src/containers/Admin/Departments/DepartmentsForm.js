import React, { useMemo } from "react";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import Moment from "moment";
import { useAPI } from "../../../api/api";
import {makeStyles} from "@material-ui/styles";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

const DepartmentsForm = React.memo((props) => {
  const classes = useStyle();
  const { row, close, refetch } = props;
  const api = useAPI();
  const formik = useFormik({
    initialValues: {
      name: row?.name,
    },
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          row ? "put" : "post",
          row ? "admin/departments/" + row?.id : "admin/departments",
            {
              name: values?.name,
              department_id: row?.id ? row?.id : ''
            }
        );
        if (res) {
          refetch();
          close();
        }
      } catch (e) {}
    },
  });

  const inputs = useMemo(
    () => [
      [
        {
          label: "Tên phòng ban",
          value: formik.values?.name,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          error: api.error?.name,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );

  return (
    <div className={api.loading ? classes.loading : classes.action}>
      <Forms inputs={inputs} />
      <div style={{ textAlign: "left" }}>
        <Button
          variant="contained"
          color={"primary"}
          onClick={formik.handleSubmit}
        >
          {row ? "Sửa" : "Thêm mới"}
        </Button>
      </div>
    </div>
  );
});

const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle
}));

export default DepartmentsForm;
