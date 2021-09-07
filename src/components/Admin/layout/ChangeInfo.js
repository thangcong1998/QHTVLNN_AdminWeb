import React, { useMemo, useEffect, useContext } from "react";
import { useFetch, useAPI } from "../../../api/api";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import {Button, Dialog, makeStyles} from "@material-ui/core";
import { useDialog } from "../../Dialog";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';
import { AuthContext } from "../../../common/AuthProvider";

const ChangeInfo = React.memo((props)=>{
  const classes = useStyles();
  const { data: data,revalidate: refetch } = useFetch(["get", "admin/me"]);
  const {close} = props; 
  const { revalidate} = useContext(AuthContext);
  const api = useAPI();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try { 
        if(values?.full_name){
          let res = await api.fetcher("put", "/admin/updateInfo/" + data?.id, {
            full_name: values?.full_name,
            tel: values?.tel,
            user_type:1,
            email: values?.email,
            user_id: data?.id
          });
        }
        if(values?.company_type){
          let res = await api.fetcher("put", "/admin/updateInfo/" + data?.id, {
            name:values?.name,
            tel: values?.tel,
            email: values?.email,
            user_type:2,
            user_id: data?.id
          })
        }
        if(!values?.company_type && !values?.full_name){
          let res = await api.fetcher("put", "/admin/updateInfo/" + data?.id, {
            name:values?.name,
            tel: values?.tel,
            email: values?.email,
            user_type:3,
            user_id: data?.id,
          })
        }
        revalidate();
        close();
      } catch (e) {}
    },
  });

  useEffect(() => {
    if (data) {
      if(data.user_type == 1){
        inputs.forEach((e) => {
          e.filter((e) => e.field).forEach((e, index) => {
            formik.setFieldValue(e.field, data?.[e.field]);
          });
        });
      }
      if(data.user_type == 2){
        inputsCompanies.forEach((e)=>{
          e.filter((e) => e.field).forEach((e , index)=>{
            formik.setFieldValue(e.field, data?.company?.[e.field]);
          })
        })
      }
      if(data.user_type == 3){
        inputsCompanies.forEach((e)=>{
          e.filter((e) => e.field).forEach((e , index)=>{
            formik.setFieldValue(e.field, data?.labor_department?.[e.field]);
          })
        })
      }
    }
  }, [data]);
  const inputs = useMemo(
    () => [
      [
        {
          label: "Họ tên",
          value: formik.values?.full_name,
          field: "full_name",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("full_name", e),
          type: "text",
          error: api?.error?.full_name,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Số điện thoại",
          value: formik.values?.tel,
          field: "tel",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("tel", e),
          type: "text",
          error: api?.error?.tel,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Email",
          value: formik.values?.email,
          field: "email",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("email", e),
          type: "text",
          error: api?.error?.email,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  const inputsCompanies = useMemo(
    () => [
      [
        {
          label: "Tên công ty",
          value: formik.values?.name,
          field: "name",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          error: api?.error?.name,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Số điện thoại",
          value: formik.values?.tel,
          field: "tel",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("tel", e),
          type: "text",
          error: api?.error?.tel,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Email",
          value: formik.values?.email,
          field: "email",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("email", e),
          type: "text",
          error: api?.error?.email,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label:"Company_type",
          field:"company_type",
          value:formik.values?.company_type,
        }
      ],
    ],
    [formik]
  );
  const inputsLabor = useMemo(
    () => [
      [
        {
          label: "Tên sở",
          value: formik.values?.name,
          field: "name",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          error: api?.error?.name,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Số điện thoại",
          value: formik.values?.tel,
          field: "tel",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("tel", e),
          type: "text",
          error: api?.error?.tel,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          label: "Email",
          value: formik.values?.email,
          field: "email",
          variant: "standard",
          handleChange: (e) => formik.setFieldValue("email", e),
          type: "text",
          error: api?.error?.email,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  return (
    <div className={api.loading ? classes.loading : classes.action}>
      {data?.user_type == 1 && <Forms  inputs={inputs} />}
      {data?.user_type == 2 && <Forms  inputs={inputsCompanies} />}
      {data?.user_type == 3 && <Forms  inputs={inputsLabor} />}

      <div style={{ textAlign: "center" }}>
        <Button
          variant="contained"
          color={"primary"}
          onClick={formik.handleSubmit}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
});

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle
}));
export default ChangeInfo;
