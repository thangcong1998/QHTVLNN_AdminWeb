import React, { useMemo, useEffect, useState } from "react";
import {
  Paper,
  Button,
  Divider,
  Card,
  Tab,
  AppBar,
  TextField,
  InputAdornment,
  formatMs,
} from "@material-ui/core";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { useFetch, useAPI } from "../../../api/api";
import { useParams, useHistory } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import Moment from "moment";
import ListContact from "./ListContact";
import AccountCompany from "./AccountCompany";
import { toast } from "react-toastify";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import loading from "../../../assets/image/25.gif";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { loadingStyle } from "../../../common/constants";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
const CompaniesForm = React.memo((props) => {
  const classes = useStyle();
  const [user, setUser] = useState({
    user_name: "",
    password: "",
    role_id: 3,
    user_type: 2,
    hasUsername: false,
  });
  const [contactList, setContactList] = useState([]);
  const params = useParams();
  const history = useHistory();
  const { data: data } = useFetch([
    params.id ? "get" : null,
    "admin/companies/" + params.id,
  ]);
  const formData = new FormData();
  const api = useAPI();
  const formik = useFormik({
    initialValues: {
      certificate_registration_date: null,
      certificate_issue_date: null,
      is_active: 1,
    },
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher(
          params.id ? "put" : "post",
          params.id ? "/admin/companies/" + params?.id : "/admin/companies",
          {
            name: formik.values?.name,
            trading_name: formik.values?.trading_name,
            company_type: formik.values?.company_type?.id,
            is_active: formik.values?.is_active,
            province_id: formik.values?.province?.id,
            district_id: formik.values?.district?.id,
            ward_id: formik.values?.ward?.id,
            liaison_id: formik.values?.liaison_id?.id,
            income_settlement_debt: formik.values?.income_settlement_debt,
            labor_settlement_debt: formik.values?.labor_settlement_debt,
            address: formik.values?.address,
            tel: formik.values?.tel,
            email: formik.values?.email,
            certificate_registration_date:
              formik.values?.certificate_registration_date,
            certificate_issue_date: formik.values?.certificate_issue_date,
            certificate_no: formik.values?.certificate_no,
            user_name: user.user_name,
            password: user.password,
            role_id: user.role_id,
            user_type: user.user_type,
            listContact: JSON.stringify(
              contactList.map((e) => ({
                ...e,
                job_title_id: e.job_title_id.id,
              }))
            ),
            company_id: params.id,
            account_id: user.id,
          }
        );
        if (res) {
          history.push("/quanly/companies");
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
      formik.setFieldValue("liaison_id", data.user);
      formik.setFieldValue(
        "income_settlement_debt",
        data.income_settlement_debt
      );
      formik.setFieldValue("labor_settlement_debt", data.labor_settlement_debt);
      setUser({
        ...data.account,
        hasUsername: data?.account?.user_name ? true : false,
      });
      if (data.contact?.length !== 0) {
        data.contact.map((value) => {
          value.readOnly = true;
        });
      }
      formik.setFieldValue("district", data?.district);
      formik.setFieldValue("province", data?.province);
      formik.setFieldValue("ward", data?.ward);
      setContactList(data.contact);
    }
  }, [data]);
  const inputs = useMemo(
    () => [
      [
        {
          field: "name",
          label: "Tên doanh nghiệp",
          value: formik.values?.name,
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          required: true,
          error: api.error?.name,
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "trading_name",
          label: "Tên giao dịch",
          value: formik.values?.trading_name,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("trading_name", e);
          },
          error: api.error?.trading_name,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "company_type",
          label: "Loại doanh nghiệp *",
          endpoint: "admin/companyTypes",
          queryField: "name",
          valueField: "id",
          value: formik.values?.company_type,
          error: api.error?.company_type,
          handleChange: (value) => {
            formik.setFieldValue("company_type", value);
          },
          type: "autocomplete",
          grid: { xs: 10, sm: 10, md: 10 },
          size: "medium",
        },
        {
          field: "is_active",
          label: "Còn hoạt động",
          value: formik.values?.is_active == 1,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("is_active", e == true ? 1 : 2);
          },
          inputVariant: "outlined",
          type: "switch",
          grid: { xs: 2, sm: 2, md: 2 },
        },
        {
          field: "tel",
          label: "Số điện thoại",
          value: formik.values?.tel || "",
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("tel", e);
          },
          error: api.error?.tel,
          inputVariant: "outlined",
          type: "number",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "email",
          label: "Địa chỉ email",
          value: formik.values?.email,
          required: true,
          error: api.error?.email,
          handleChange: (e) => {
            formik.setFieldValue("email", e);
          },
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          type: "region-select",
          value: formik.values,
          setFieldValue: formik.setFieldValue,
          size: "medium",
          error: api.error,
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "address",
          label: "Địa chỉ cụ thể",
          value: formik.values?.address,
          required: true,
          error: api.error?.address,
          handleChange: (e) => {
            formik.setFieldValue("address", e);
          },
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "certificate_registration_date",
          label: "Ngày đăng ký chứng chỉ *",
          value: formik.values?.certificate_registration_date,
          error: api.error?.certificate_registration_date,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue(
              "certificate_registration_date",
              Moment(e).format("YYYY-MM-DD")
            );
          },
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 6, md: 4 },
        },
        {
          field: "certificate_issue_date",
          label: "Ngày cấp chứng chỉ *",
          value: formik.values?.certificate_issue_date,
          error: api.error?.certificate_issue_date,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue(
              "certificate_issue_date",
              Moment(e).format("YYYY-MM-DD")
            );
          },
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 6, md: 4 },
        },
        {
          field: "certificate_no",
          label: "Số chứng chỉ",
          value: formik.values?.certificate_no,
          error: api.error?.certificate_no,
          required: true,
          handleChange: (e) => {
            formik.setFieldValue("certificate_no", e);
          },
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 6, md: 4 },
        },
      ],
    ],
    [formik]
  );

  return (
    <div className={api.loading ? classes.loading : classes.root}>
      <Card style={{ marginBottom: 20, padding: 20 }}>
        <b>THÔNG TIN DOANH NGHIỆP</b>
        <Forms inputs={inputs} />
      </Card>
      <Card
        style={{ marginBottom: 20, padding: 20 }}
        className={api.loading ? classes.loading : classes.root}
      >
        <b>CÁN BỘ PHỤ TRÁCH</b>
        <div>
          <div
            style={{
              width: "100%",
              padding: 20,
            }}
          >
            <Autocomplete
              label={"Cán bộ phụ trách *"}
              endpoint={"admin/user?user_type=1"}
              queryField={"full_name"}
              error={api.error?.liaison_id}
              helperText={api.error?.liaison_id}
              value={formik?.values?.liaison_id}
              handleChange={(e) => formik.setFieldValue("liaison_id", e)}
              size={"medium"}
            />
          </div>
          <div
            style={{
              padding: 20,
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: "50%", paddingRight: 10 }}>
              <TextField
                className={classes.input1}
                value={formik.values?.income_settlement_debt || ""}
                label={"Dư nợ quyết toán theo thu nhập"}
                error={api.error?.income_settlement_debt}
                helperText={api.error?.income_settlement_debt}
                onChange={(e) =>
                  formik.setFieldValue("income_settlement_debt", e.target.value)
                }
                variant={"outlined"}
                fullWidth={true}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  endAdornment: (
                    <InputAdornment position="start">đ</InputAdornment>
                  ),
                }}
                error={api?.error?.income_settlement_debt}
                helperText={api?.error?.income_settlement_debt}
              />
            </div>
            <div style={{ width: "50%", paddingLeft: 10 }}>
              <TextField
                className={classes.input1}
                value={formik.values?.labor_settlement_debt || ""}
                error={api.error?.labor_settlement_debt}
                helperText={api.error?.labor_settlement_debt}
                label={"Dư nợ quyết toán theo người lao động"}
                onChange={(e) =>
                  formik.setFieldValue("labor_settlement_debt", e.target.value)
                }
                variant={"outlined"}
                fullWidth={true}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                  endAdornment: (
                    <InputAdornment position="start">đ</InputAdornment>
                  ),
                }}
                error={api?.error?.labor_settlement_debt}
                helperText={api?.error?.labor_settlement_debt}
              />
            </div>
          </div>
        </div>
      </Card>
      <Card style={{ marginBottom: 20, padding: 20 }}>
        <b>TÀI KHOẢN ĐĂNG NHẬP</b>
        <AccountCompany
          user={user}
          setUser={setUser}
          api={api}
          update={params.id ? true : false}
        />
      </Card>
      <Card style={{ marginBottom: 20, padding: 20 }}>
        <b style={{ marginBottom: 20 }}>NGƯỜI LIÊN LẠC</b>
        <ListContact
          contactList={contactList}
          setContactList={setContactList}
          error={api.error}
        />
      </Card>
      <div className={classes.action}>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          className={classes.submitBtn}
          disabled={api.loading}
          startIcon={api.loading ? <CircularProgress /> : ""}
        >
          {params.id ? "Cập nhật" : " thêm mới"}
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
    paddingTop: 20,
  },
  input1: {
    "& input": {
      textAlign: "right",
    },
    "& p": {
      padding: 2,
      fontSize: 13,
      marginBottom: 8,
    },
  },
  loading: loadingStyle,
}));
export default CompaniesForm;
