import React, { useMemo, useEffect, useState } from "react";
import { Paper, Button } from "@material-ui/core";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { useFetch, useAPI } from "../../../api/api";
import Moment from "moment";
import CircularProgress from "@material-ui/core/CircularProgress";
import autocomplete from "../../../components/Admin/form/Autocomplete";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

const RegionForm = React.memo((props) => {
  const classes = useStyle();
  const { close, refetch } = props;
  const row = props?.row;
  const api = useAPI();

  const formik = useFormik({
    initialValues: row ? {
      type: row?.type,
      name: row?.name,
      parent: row?.parent,
    } : {
        name: '',
        type: '',
        parent: ''
      },
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          row ? "put" : "post",
          row ? "/admin/regions/" + row.id : "/admin/regions",
          {
            type: values?.type,
            name: values?.name,
            parent_region_id: values?.parent.id,
            region_id: row?.id ? row?.id : ''
          }
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
          field: "type",
          label: "Cấp",
          inputVariant: "outlined",
          type: "select",
          options: [
            {
              label: "Chọn cấp",
              value: "",
            },
            {
              label: "Tỉnh Thành",
              value: "1",
            },
            {
              label: "Quận Huyện",
              value: "2",
            },
            {
              label: "Xã Phường",
              value: "3",
            },
          ],
          display: true,
          value: formik.values?.type,
          error: api.error?.type,
          handleChange: (value) => formik.setFieldValue("type", value),
          grid: { xs: 12, sm: 12, md: 12 },
        },
        formik.values?.type == 2 ? {
          field: "parent",
          label: "Tỉnh",
          value: formik.values?.parent,
          endpoint: "admin/regions" + "?" + "type=1" + "&&per_page=100",
          queryField: "name",
          valueField: "id",
          handleChange: (e) => {
            formik.setFieldValue("parent", e);
          },
          type: "autocomplete",
          grid: { xs: 12, sm: 12, md: 12 },
        } : null,
        (formik.values?.type == 3 && row?.id === undefined) ? {
          field: "parentTop",
          label: "Tỉnh",
          value: formik.values?.parentTop,
          endpoint: "admin/regions" + "?" + "type=1" + "&&per_page=100",
          queryField: "name",
          valueField: "id",
          handleChange: (e) => {
            formik.setFieldValue("parentTop", e);
          },
          type: "autocomplete",
          grid: { xs: 12, sm: 12, md: 12 },
        } : null,
        formik.values?.type == 3 ? {
          field: "parent",
          label: "Huyện",
          value: formik.values?.parent,
          endpoint: "admin/regions" + "?" + "type=2&&parent_region_id=" + formik.values?.parentTop?.id + "&&per_page=100",
          queryField: "name",
          valueField: "id",
          handleChange: (e) => {
            formik.setFieldValue("parent", e);
          },
          type: "autocomplete",
          grid: { xs: 12, sm: 12, md: 12 },
        } : null,
        formik.values?.type ? {
          field: "name",
          label: "Tên",
          value: formik.values?.name,
          error: api.error?.name,
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        }: null,
      ],
    ],
    [formik]
  );

  return (
    <div elevation={5} className={api.loading ? classes.loading : classes.root}>
      {/* <h2>Thêm Đơn Vị Hành Chính</h2> */}
      <Forms inputs={inputs} />
      <div className={classes.action}>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          className={classes.submitBtn}
          disabled={api.loading}
          startIcon={api.loading ? <CircularProgress /> : ""}
        >
          {row ? "Cập nhật" : " Thêm"}
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
export default RegionForm;
