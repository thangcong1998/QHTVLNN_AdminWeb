import React, { useMemo, useEffect, useState } from "react";
import { Paper, Button } from "@material-ui/core";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { useFetch, useAPI } from "../../../api/api";
import { useParams, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import LoadingCallApi from "../../../components/Admin/LoadingCallApi";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

const UserForm = React.memo((props) => {
  const classes = useStyle();
  const params = useParams();
  const history = useHistory();
  const { data: data } = useFetch([
    params.id ? "get" : null,
    "admin/user/" + params.id,
  ]);
  const api = useAPI();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        if(values?.password !== undefined)
        {
          let checkPass = formik.values?.password?.split('');
          let lengthPass = formik.values?.password?.split('').length;
          if( checkPass[0] === ' ' || checkPass[lengthPass - 1] === ' ')
          {
            formik.setFieldError('password', 'Bắt đầu hoặc kết thúc của mật khẩu không được là khoảng trống');
          }
        }
          let res = await api.fetcher(
              params.id ? "put" : "post",
              params.id ? "/admin/user/" + params?.id : "/admin/user",
              {
                user_id: params.id ? params.id : '',
                full_name: values?.full_name,
                user_name: values?.user_name,
                password: values?.password,
                user_type: params?.id ? values?.user_type : 1,
                job_title_id: values?.job_title?.id ? values?.job_title?.id : null,
                department_id: values?.department?.id ? values?.department?.id : null,
                role_id: values?.role?.id,
                role_name: values?.role?.name,
                email: values?.email ? values?.email : "",
                tel: values?.tel,
              }
          );
          if (res) {
            history.push("/quanly/user");
          }
      } catch (e) {}
    },
  });

  useEffect(() => {
    if (data) {
      inputs.forEach((e) => {
        e.filter((e) => e.field).forEach((e, index) => {
          formik.setFieldValue(e.field, data?.[e.field]);
        });
      });
    }
  }, [data]);
  const inputs = useMemo(
    () => [
      [
        {
          field: "user_name",
          id: 'user_name',
          label: "Tài khoản",
          value: formik.values?.user_name,
          error: api.error?.user_name,
          handleChange: (e) => formik.setFieldValue("user_name", e),
          type: "text",
          variant: "outlined",
          readOnly: params?.id ? true : false,
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "password",
          label: "Mật khẩu",
          id: 'user_pasword',
          value: formik.values?.password,
          error: formik.errors?.password ? formik?.errors?.password : api.error?.password,
          handleChange: (e) => formik.setFieldValue("password", e),
          type: "password",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
      ],
      [
        {
          field: "full_name",
          label: "Tên đầy đủ",
          id: 'user_full_name',
          value: formik.values?.full_name,
          error: api.error?.full_name,
          handleChange: (e) => formik.setFieldValue("full_name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "tel",
          label: "Số điện thoại",
          id: 'user_phone',
          value: formik.values?.tel,
          error: api.error?.tel,
          handleChange: (e) => formik.setFieldValue("tel", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "email",
          label: "Email",
          id: 'user_email',
          value: formik.values?.email,
          error: api.error?.email,
          handleChange: (e) => formik.setFieldValue("email", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "job_title",
          label: "Chức vụ",
          id: 'user_job_title',
          value: formik.values?.job_title,
          endpoint: "admin/jobTitles",
          queryField: "name",
          valueField: "id",
          handleChange: (e) => {
            formik.setFieldValue("job_title", e);
          },
          type: "autocomplete",
          size: "medium",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "department",
          label: "Phòng ban",
          id: 'user_department',
          value: formik.values?.department,
          endpoint: "admin/departments",
          queryField: "name",
          valueField: "id",
          handleChange: (e) => {
            formik.setFieldValue("department", e);
          },
          type: "autocomplete",
          size: "medium",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "role",
          label: "Nhóm người dùng",
          id: 'user_role',
          error: api.error?.role_id,
          value: formik.values?.role,
          endpoint: "admin/role",
          queryField: "display_name",
          valueField: "id",
          handleChange: (e) => {
            formik.setFieldValue("role", e);
          },
          type: "autocomplete",
          size: "medium",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
      ],
    ],
    [formik]
  );

  return (
    <Paper elevation={5} className={api.loading ? classes.loading : classes.action}>
      <h2>Thông tin tài khoản</h2>
      <Forms inputs={inputs} />
      <div className={classes.action}>
        <Button
          variant="contained"
          color="primary"
          id="create_new_user"
          onClick={formik.handleSubmit}
          className={classes.submitBtn}
          disabled={api.loading}
          startIcon={api.loading ? <CircularProgress /> : ""}
        >
          {params.id ? "Cập nhật" : "Thêm tài khoản"}
        </Button>
      </div>
    </Paper>
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
export default UserForm;
