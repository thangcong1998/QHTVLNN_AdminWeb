import React, { useMemo, useState } from "react";
import { useAPI } from "../../../api/api";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import {Button, makeStyles} from "@material-ui/core";
import * as Yup from "yup";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

export default function (props) {
  const classes = useStyles();
  const api = useAPI();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        const res = await api.fetcher("post", "admin/changePassword", {
          old_password: values?.old_password,
          new_password: values?.new_password,
        });
        await props?.close();
      } catch (e) {
        formik.setErrors(e?.data?.errors);
      }
    },
    validationSchema: Yup.object().shape({
      // Validate form field
      old_password: Yup.string().required("Mật khẩu cũ là trường bắt buộc"),
      new_password: Yup.string()
        .required("Mật khẩu mới là trường bắt buộc"),
      renew_password: Yup.string()
        .required("Nhập lại Mật khẩu là trường bắt buộc")
        .oneOf([Yup.ref("new_password")], "Mật khẩu nhập lại không khớp"),
    }),
  });

  const inputs = useMemo(
    () => [
      [
        {
          label: "Mật khẩu cũ",
          value: formik.values?.old_password,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("old_password", e),
          type: "password",
          error: formik?.errors?.old_password,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Mật khẩu mới",
          value: formik.values?.new_password,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("new_password", e),
          type: "password",
          error: formik?.errors?.new_password,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Nhập lại mật khẩu mới",
          value: formik.values?.renew_password,
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("renew_password", e),
          error: formik?.errors?.renew_password,
          type: "password",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  return (
    <div className={api.loading ? classes.loading : classes.action}>
      <Forms inputs={inputs} />
      <Button color="primary" onClick={formik.handleSubmit} variant={'contained'}>
        Cập nhật
      </Button>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle
}));
