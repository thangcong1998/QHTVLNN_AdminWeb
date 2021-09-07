import React, { useEffect, useMemo, useState } from "react";
import { makeStyles, Input, Paper, CircularProgress } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Forms from "../../../components/Admin/form/Form";
import { Button } from "@material-ui/core";
import { useFetch, useAPI } from "../../../api/api";
import { useFormik, Formik } from "formik";
import AccountLabor from "./AccountLaborDepartMents";
import ContactLabor from "./ContactLaborDepartMent";
import SettlementInformation from "./SettlementInformation";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

const laborDepartMentForm = React.memo((props) => {
  const classes = useStyles();
  const params = useParams();
  const history = useHistory();
  const [contactList, setContactList] = useState([]);
  const [user, setUser] = useState();
  const [liaison, setLiaison] = useState({});
  const [laborSettlementDebt, setLaborSettlementDebt] = useState();
  const [user_name, setUserName] = useState();
  const [password, setPassWord] = useState();
  const api = useAPI();
  const { data: data } = useFetch([
    params.id ? "get" : null,
    "admin/laborDepart/" + params.id,
  ]);
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          params.id ? "put" : "post",
          params.id ? "/admin/laborDepart/" + params.id : "/admin/laborDepart",
          {
            liaison_id: liaison?.id,
            labor_settlement_debt: laborSettlementDebt,
            contactList: contactList,
            user_id: user?.id ? user.id : null,
            user_name: user_name,
            password: password,
            user_type: 3,
            role_id: 2,
            name: values?.name,
            address: values?.address,
            tel: values?.tel,
            email: values?.email,
            province_id: values?.province?.id,
            district_id: values?.district?.id,
            ward_id: values?.ward?.id,
            laborDepartment_id: params?.id,
          }
        );
        if (res) {
          history.push("/quanly/laborDepartment");
        }
      } catch (e) {}
    },
  });
  useEffect(() => {
    if (data) {
      inputs[0]
        .filter((e) => e.field)
        .forEach((e, index) => {
          formik.setFieldValue(e.field, data?.[e.field]);
        });
      setContactList(
        data?.contact.map((e) => {
          return {
            ...e,
            readOnly: true,
          };
        })
      );
      setUser(data?.user);
      setUserName(data?.user?.user_name);
      setLiaison(data?.liaison);
      setLaborSettlementDebt(data?.labor_settlement_debt);
      formik.setFieldValue("province", data?.province);
      formik.setFieldValue("district", data?.district);
      formik.setFieldValue("ward", data?.ward);
    }
  }, [data]);
  const inputs = useMemo(() => [
    [
      {
        field: "name",
        label: "Tên",
        required: true,
        value: formik.values?.name,
        error: api.error?.name,
        handleChange: (e) => formik.setFieldValue("name", e),
        type: "text",
        variant: "outlined",
        grid: { xs: 12, sm: 12, md: 12 },
      },
      {
        field: "tel",
        label: " Số Điện Thoại",
        required: true,
        value: formik.values?.tel || "",
        error: api.error?.tel,
        handleChange: (e) => formik.setFieldValue("tel", e),
        type: "number",
        variant: "outlined",
        grid: { xs: 12, sm: 12, md: 6 },
      },
      {
        field: "email",
        label: "Email",
        required: true,
        value: formik.values?.email,
        error: api.error?.email,
        handleChange: (e) => formik.setFieldValue("email", e),
        type: "text",
        variant: "outlined",
        grid: { xs: 12, sm: 12, md: 6 },
      },
      {
        type: "region-select",
        value: formik.values,
        error: api?.error,
        setFieldValue: formik.setFieldValue,
        grid: { xs: 12, sm: 12, md: 12 },
      },
      {
        field: "address",
        label: "Địa Chỉ",
        required: true,
        value: formik.values?.address,
        error: api.error?.address,
        handleChange: (e) => formik.setFieldValue("address", e),
        type: "text",
        variant: "outlined",
        grid: { xs: 12, sm: 12, md: 12 },
      },
    ],
    [formik],
  ]);

  return (
    <div elevation={5} className={api.loading ? classes.loading : classes.root}>
      <Paper>
        <h2 style={{ padding: 10, fontSize: 16 }} className={api.loading ? classes.loadingNonImage : null}>
          {params?.id ? "Thông tin Chi Tiết" : "Thông Tin"}{" "}
        </h2>
        <Forms inputs={inputs} />
        <div className={classes.action}></div>
      </Paper>
      <Paper style={{ height: 166 }} className={api.loading ? classes.loadingNonImage : null}>
        <h2 style={{ padding: 10, fontSize: 16 }}>Tài Khoản</h2>
        <AccountLabor
          user_name={user_name}
          error={api.error}
          setUserName={setUserName}
          password={password}
          setPassWord={setPassWord}
          api={api}
          user={data?.user ? true : false}
        />
      </Paper>
      <Paper className={api.loading ? classes.loadingNonImage : null}>
        <h2 style={{ padding: 10, fontSize: 16 }}>Người Liên Hệ</h2>
        <ContactLabor
          error={api.error}
          contactList={contactList}
          setContactList={setContactList}
        />
      </Paper>
      <Paper className={api.loading ? classes.loadingNonImage : null}>
        <h2 style={{ padding: 10, fontSize: 16 }}>Thông Tin Quyết Toán</h2>
        <SettlementInformation
          liaison={liaison}
          setLiaison={setLiaison}
          error={api.error}
          laborSettlementDebt={laborSettlementDebt}
          setLaborSettlementDebt={setLaborSettlementDebt}
        />
      </Paper>
      <Button
        style={{ marginTop: 30, width: "10%" }}
        variant="contained"
        color="primary"
        onClick={formik.handleSubmit}
        className={classes.submitBtn}
        disabled={api.loading}
        startIcon={api.loading ? <CircularProgress /> : ""}
      >
        {params.id ? "Cập nhật" : "Thêm "}
      </Button>
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
  loadingNonImage: {
    backgroundColor: "transparent",
  },
  loading: loadingStyle
}));
export default laborDepartMentForm;
