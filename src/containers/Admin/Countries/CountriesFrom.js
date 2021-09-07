import React, { useMemo } from "react";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { Button } from "@material-ui/core";
import Moment from "moment";
import { useAPI } from "../../../api/api";

const CountriesForm = React.memo((props) => {
  const { row, close, refetch } = props;
  const api = useAPI();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          "post",
          "admin/countries",
          JSON.stringify(values)
        );
        if (res) {
          refetch();
          close();
        }
      } catch (e) { }
    },
  });

  const inputs = useMemo(
    () => [
      [
        {
          label: "Tên quốc gia",
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
    <div>
      <Forms inputs={inputs} />
      <div style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color={"primary"}
          onClick={formik.handleSubmit}
        >
          {"Thêm mới"}
        </Button>
      </div>
    </div>
  );
});

export default CountriesForm;
