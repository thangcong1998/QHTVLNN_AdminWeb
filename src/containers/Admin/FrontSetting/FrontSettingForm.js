import React, { useEffect, useMemo, useState } from "react";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { useParams, useHistory } from "react-router-dom";
import { Button, Switch, Card } from "@material-ui/core";
import Moment from "moment";
import { useAPI, useFetch } from "../../../api/api";
import Upload from "../ArticleForm/Upload";
import {makeStyles} from "@material-ui/styles";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

const FrontSettingForm = React.memo((props) => {
  const classes = useStyle();
  const { row, close, refetch } = props;
  const api = useAPI();
  const params = useParams();
  const history = useHistory();
  const formData = new FormData();
  const [files, setFiles] = useState();
  const [loadingFirstTime, setLoadingFirstTime] = useState(true);
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      formData.append("contact_mail", values.contact_mail === undefined ? '' : values.contact_mail);
      formData.append("contact_hotline", values.contact_hotline === undefined ? '' : values.contact_hotline);
      formData.append("address_footer", values.address_footer === undefined ? '' : values.address_footer);
      formData.append("fax_footer", values.fax_footer === undefined ? '' : values.fax_footer);
      formData.append("building_footer", values.building_footer === undefined ? '' : values.building_footer);
      formData.append("files", files === undefined ? '' : files);
      formData.append("is_default", values.is_default);
      params.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params.id ? "admin/frontSetting/" + params.id : "admin/frontSetting",
          formData
        );
        if (res) {
          history.push("/quanly/setting");
        }
      } catch (e) {}
    },
  });
  const { data: data } = useFetch([
    params.id ? "get" : null,
    "admin/frontSetting/" + params.id,
  ]);
  useEffect(() => {
    if (data) {
      setFiles(data.logo_url);
      inputs[0]
        .filter((e) => e.field)
        .forEach((e, index) => {
          formik.setFieldValue(e.field, data?.[e.field]);
        });
      formik.setFieldValue("is_default", data.is_default);
    }
  }, [data]);
  useEffect(() => {
    if (loadingFirstTime === true) {
      formik.setFieldValue("is_default", 0);
      setLoadingFirstTime(false);
    }
  }, [loadingFirstTime]);
  const inputs = useMemo(
    () => [
      [
        {
          field: "contact_hotline",
          label: "Số điện thoại",
          value: formik.values?.contact_hotline || '',
          variant: "outlined",
          handleChange: (e) => formik.setFieldValue("contact_hotline", e),
          error: api.error?.contact_hotline,
          type: "number",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "fax_footer",
          label: "Số Fax",
          value: formik.values?.fax_footer || '',
          variant: "outlined",
          handleChange: (e) => formik.setFieldValue("fax_footer", e),
          error: api.error?.fax_footer,
          type: "number",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          field: "contact_mail",
          label: "Địa chỉ Email",
          value: formik.values?.contact_mail,
          variant: "outlined",
          handleChange: (e) => formik.setFieldValue("contact_mail", e),
          error: api.error?.contact_mail,
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "address_footer",
          label: "Địa chỉ",
          value: formik.values?.address_footer,
          variant: "outlined",
          handleChange: (e) => formik.setFieldValue("address_footer", e),
          error: api.error?.address_footer,
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "building_footer",
          label: "Tòa nhà sở tại",
          value: formik.values?.building_footer,
          variant: "outlined",
          handleChange: (e) => formik.setFieldValue("building_footer", e),
          error: api.error?.building_footer,
          type: "text",
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik]
  );
  const changeDefault = () => {
    if (formik.values?.is_default === 0) {
      formik.setFieldValue("is_default", 1);
    } else {
      formik.setFieldValue("is_default", 0);
    }
  };
  console.log(formik.values);

  return (
    <div>
      <Card style={{ padding: 20 }} className={api.loading ? classes.loading : classes.action}>
        <Forms inputs={inputs} />
        <div
          style={{
            display: "-webkit-box",
            msFlexWrap: "wrap",
            flexWrap: "wrap",
            marginRight: "-15px",
            marginLeft: "-15px",
          }}
        >
          <div style={{ width: "50%", paddingLeft: 20 }}>
            <p style={{ paddingLeft: 10, color: "rgba(0, 0, 0, 0.54)" }}>
              Tải lên logo
            </p>
            <Upload setFiles={setFiles} files={files} limitHeight={true} />
            <p style={{ fontSize: '0.75rem', color: '#f44336', paddingLeft: 20, fontWeight: 400}}>{api?.error?.files}</p>
          </div>
          <div style={{ width: "50%", paddingLeft: 20, paddingRight: 20 }}>
            <p style={{ paddingLeft: 10, color: "rgba(0, 0, 0, 0.54)" }}>
              Cài đặt mặc định
            </p>
            <Switch
              checked={formik.values?.is_default === 0 ? false : true}
              onChange={data?.is_default === 1 ? null : changeDefault}
            />
            {data?.is_default === 1 && (
              <p style={{ color: "#FF2700" }}>
                Không thể tắt thông tin đang hiển thị trên web
              </p>
            )}
          </div>
        </div>
        <div style={{ textAlign: "left", marginTop:15 }}>
          <Button
            variant="contained"
            color={"primary"}
            onClick={formik.handleSubmit}
          >
            {params.id ? "Sửa" : "Thêm mới"}
          </Button>
        </div>
      </Card>
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

export default FrontSettingForm;
