import React, { useMemo, useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useFormik } from "formik";
import Forms from "../../../components/Admin/form/Form";
import UploadFile from "../../../components/Admin/form/UploadFile";
import { useAPI, useFetch } from "../../../api/api";
import {
  Paper,
  Button,
  ButtonGroup,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Moment from "moment";
import SendIcon from "@material-ui/icons/Send";
import SaveIcon from "@material-ui/icons/Save";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import DeleteIcon from "@material-ui/icons/Delete";
import { Skeleton } from "@material-ui/lab";
import ReplayIcon from "@material-ui/icons/Replay";
import EditIcon from "@material-ui/icons/Edit";
import DoneIcon from "@material-ui/icons/Done";
import { useDialog } from "../../../components/Dialog";
import TextArea from "../../../components/Admin/form/TextArea";
import ChangeStatus from "./ChangeStatusDialog";

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
      // prefix="$"
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const LaborSupportCreate = React.memo((props) => {
  const classes = useStyle();
  const history = useHistory();
  const params = useParams();
  const { dialog, handleClose } = useDialog();
  const formik = useFormik({
    initialValues: {
      year: Moment(new Date()).year(),
      name: "",
      permanent_residence: "",
      reason: "",
      passport_code: "",
      contract_start_date: null,
      contract_end_date: null,
      start_working_date: null,
      end_working_date: null,
      passport_issue_date: null,
      request_support_amount: 0,
    },
  });
  const { data: user } = useFetch(["get", "/admin/me"]);
  const {
    data: laborSupport,
    revalidate: refetch,
    loading: loading,
  } = useFetch(params?.id && ["get", "/admin/laborSupport/" + params?.id]);
  const { data: reasonTypes } = useFetch(["get", "/admin/reasonType"]);
  const _reasonTypes = useMemo(() => {
    if (reasonTypes) {
      return reasonTypes.data.map((e) => ({ label: e.name, value: e.id }));
    }
    return [];
  }, [reasonTypes]);
  const api = useAPI();
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const contract_long = parseInt(
    ((formik.values?.contract_end_date - formik.values?.contract_start_date) *
      3.80265176) /
      10000000000
  );
  const working_time = parseInt(
    ((formik.values?.end_working_date - formik.values?.start_working_date) *
      3.80265176) /
      10000000000
  );
  const [readOnly, setReadOnly] = useState(true);
  const _readOnly = useMemo(() => {
    if (params?.id && laborSupport?.status >= 2) {
      return readOnly;
    }
    return false;
  }, [laborSupport, readOnly]);

  useEffect(() => {
    if (laborSupport) {
      formik.setFieldValue("year", laborSupport.year);
      formik.setFieldValue("period", laborSupport.period);
      formik.setFieldValue("name", laborSupport.labor_support.labor.name);
      formik.setFieldValue(
        "passport_code",
        laborSupport.labor_support.labor.passport_code
      );
      formik.setFieldValue(
        "passport_issue_date",
        laborSupport.labor_support.labor.passport_issue_date
      );
      formik.setFieldValue(
        "passport_issue_region",
        laborSupport.labor_support.labor.passport_issue_region
      );
      formik.setFieldValue("country", laborSupport.labor_support.country);
      formik.setFieldValue(
        "contract_start_date",
        Moment(laborSupport.labor_support.contract_start_date)
      );
      formik.setFieldValue(
        "contract_end_date",
        Moment(laborSupport.labor_support.contract_end_date)
      );
      formik.setFieldValue(
        "start_working_date",
        Moment(laborSupport.labor_support.start_working_date)
      );
      formik.setFieldValue(
        "end_working_date",
        Moment(laborSupport.labor_support.end_working_date)
      );
      formik.setFieldValue("status", laborSupport.status);
      formik.setFieldValue(
        "reason_type_id",
        laborSupport.labor_support.reason_type_id
      );
      formik.setFieldValue("reason", laborSupport.labor_support.reason);
      formik.setFieldValue(
        "account_holder_name",
        laborSupport.account_holder_name
      );
      formik.setFieldValue("account_number", laborSupport.account_number);
      formik.setFieldValue("bank_name", laborSupport.bank_name);
      formik.setFieldValue("bank_branch_name", laborSupport.bank_branch_name);
      formik.setFieldValue(
        "request_support_amount",
        laborSupport.labor_support.request_support_amount
      );
      formik.setFieldValue("approval_comment", laborSupport.approval_comment);
      formik.setFieldValue("agreement_comment", laborSupport.agreement_comment);
      setOldFiles(laborSupport.files);
    }
  }, [laborSupport]);

  const resetData = () => {
    try {
      refetch();
    } catch (e) {}
  };

  const inputs = useMemo(
    () => [
      [
        {
          component: () => <h2>Thông tin yêu cầu hỗ trợ rủi ro</h2>,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
      [
        {
          field: "name",
          label: "Họ tên người lao động",
          value: formik.values?.name,
          error: api.error?.name,
          handleChange: (e) => formik.setFieldValue("name", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 6, md: 6 },
        },
      ],
      [
        {
          field: "passport_code",
          label: "Số hộ chiếu",
          value: formik.values.passport_code,
          handleChange: (e) => {
            formik.setFieldValue("passport_code", e);
          },
          error: api.error?.passport_code,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "passport_issue_region",
          label: "Nơi cấp",
          value: formik.values.passport_issue_region,
          handleChange: (e) => {
            formik.setFieldValue("passport_issue_region", e);
          },
          error: api.error?.passport_issue_region,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "passport_issue_date",
          label: "Ngày cấp",
          value: formik.values.passport_issue_date,
          handleChange: (e) => {
            formik.setFieldValue("passport_issue_date", e);
          },
          error: api.error?.passport_issue_date,
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          component: () =>
            loading ? (
              <Skeleton />
            ) : (
              <div className={classes.text}>
                <span className={classes.title}>Tổ chức đưa đi:&nbsp;</span>
                {params?.id ? (
                  <span className={classes.value}>
                    {laborSupport?.company && laborSupport.company?.name}
                    {laborSupport?.labor_countriesdepartment &&
                      laborSupport?.labor_department?.name}
                  </span>
                ) : (
                  <span className={classes.value}>
                    {user?.company && user.company?.name}
                    {user?.labor_countriesdepartment &&
                      user?.labor_department?.name}
                  </span>
                )}
              </div>
            ),
          grid: { xs: 12, sm: 6, md: 6 },
        },
      ],
      [
        {
          field: "country",
          endpoint: "/admin/countries?per_page=500",
          queryField: "name",
          label: "Nước đến làm việc",
          value: formik.values?.country,
          size: "medium",
          handleChange: (e) => formik.setFieldValue("country", e),
          error: api.error?.country_id,
          type: "autocomplete",
          grid: { xs: 12, sm: 6, md: 6 },
        },
      ],
      [
        {
          component: () =>
            loading ? (
              <Skeleton />
            ) : (
              <div className={classes.text}>
                <span className={classes.title}>Thời hạn hợp đồng:&nbsp;</span>
                <span className={classes.value}>
                  {contract_long + " tháng"}
                </span>
              </div>
            ),
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "contract_start_date",
          label: "Từ ngày",
          value: formik.values.contract_start_date,
          handleChange: (e) => {
            formik.setFieldValue("contract_start_date", e);
          },
          error: api.error?.contract_start_date,
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "contract_end_date",
          label: "Đến ngày",
          value: formik.values.contract_end_date,
          handleChange: (e) => {
            formik.setFieldValue("contract_end_date", e);
          },
          error: api.error?.contract_end_date,
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 4, md: 4 },
        },
      ],
      [
        {
          component: () =>
            loading ? (
              <Skeleton />
            ) : (
              <div className={classes.text}>
                <span className={classes.title}>
                  Thời gian làm việc ở nước ngoài:&nbsp;
                </span>
                <span className={classes.value}>{working_time + " tháng"}</span>
              </div>
            ),
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "start_working_date",
          label: "Từ ngày",
          value: formik.values.start_working_date,
          handleChange: (e) => {
            formik.setFieldValue("start_working_date", e);
          },
          error: api.error?.start_working_date,
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 4, md: 4 },
        },
        {
          field: "end_working_date",
          label: "Đến ngày",
          value: formik.values.end_working_date,
          handleChange: (e) => {
            formik.setFieldValue("end_working_date", e);
          },
          error: api.error?.end_working_date,
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 4, md: 4 },
        },
      ],
      [
        {
          field: "reason_type_id",
          label: "Lý do hỗ trợ",
          value: formik.values.reason_type_id,
          handleChange: (e) => {
            formik.setFieldValue("reason_type_id", e);
          },
          error: api.error?.reason_type_id,
          type: "radio",
          options: _reasonTypes,
          formLabelProps: {
            style: {
              color: "#000000",
            },
          },
          grid: { xs: 12, sm: 12, md: 12 },
        },
        formik.values.reason_type_id == 5
          ? {
              field: "reason",
              label: "Lý do khác",
              value: formik.values.reason,
              handleChange: (e) => {
                formik.setFieldValue("reason", e);
              },
              error: api.error?.reason,
              inputVariant: "outlined",
              type: "textarea",
              grid: { xs: 12, sm: 12, md: 12 },
            }
          : null,
        {
          field: "request_support_amount",
          label: "Số tiền hỗ trợ",
          value: formik.values.request_support_amount,
          handleChange: (e) => {
            formik.setFieldValue("request_support_amount", e);
          },
          error: api.error?.request_support_amount,
          inputVariant: "outlined",
          type: "text",
          InputProps: {
            className: classes.input,
            inputComponent: NumberFormatCustom,
            endAdornment: <InputAdornment>đ</InputAdornment>,
            style: { textAlign: "right", height: 36 },
          },
          grid: { xs: 12, sm: 12, md: 6 },
        },
      ],
      [
        {
          component: () => <h2>Thông tin chuyển khoản</h2>,
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
      [
        {
          field: "account_holder_name",
          label: "Họ tên tài khoản",
          value: formik.values.account_holder_name,
          handleChange: (e) => {
            formik.setFieldValue("account_holder_name", e);
          },
          error: api.error?.account_holder_name,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          field: "account_number",
          label: "Số tài khoản nhận",
          value: formik.values.account_number,
          handleChange: (e) => {
            formik.setFieldValue("account_number", e);
          },
          error: api.error?.account_number,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          field: "bank_name",
          label: "Tại ngân hàng",
          value: formik.values?.bank_name,
          handleChange: (e) => {
            formik.setFieldValue("bank_name", e);
          },
          error: api.error?.bank_name,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 12, md: 6 },
        },
        {
          field: "bank_branch_name",
          label: "Chi nhánh ngân hàng",
          value: formik.values?.bank_branch_name,
          handleChange: (e) => {
            formik.setFieldValue("bank_branch_name", e);
          },
          error: api.error?.bank_branch_name,
          inputVariant: "outlined",
          type: "text",
          grid: { xs: 12, sm: 12, md: 6 },
        },
      ],
      [
        laborSupport?.agreement_comment &&
          laborSupport.status > 2 &&
          laborSupport.status <= 6 && {
            field: "agreement_comment",
            label: "Ý kiến của cán bộ thẩm định",
            value: formik.values?.agreement_comment,
            handleChange: (e) => {
              formik.setFieldValue("agreement_comment", e);
            },
            error: api.error?.agreement_comment,
            inputVariant: "outlined",
            type: "text",
            grid: { xs: 12, sm: 12, md: 12 },
          },
        laborSupport?.approval_comment &&
          laborSupport.status >= 4 && {
            field: "approval_comment",
            label: "Ý kiến của cán bộ thẩm định",
            value: formik.values?.approval_comment,
            handleChange: (e) => {
              formik.setFieldValue("approval_comment", e);
            },
            error: api.error?.agreement_comment,
            inputVariant: "outlined",
            type: "text",
            grid: { xs: 12, sm: 12, md: 12 },
          },
      ],
      [
        {
          component: () =>
            (laborSupport?.status < 2 || laborSupport?.files?.length !== 0) && (
              <div style={{ width: "100%", margin: "20px 0px" }}>
                <b>Tài liệu</b>
                {loading ? (
                  <Skeleton />
                ) : (
                  <UploadFile
                    errors={api.error?.files}
                    oldFiles={oldFiles}
                    setOldFiles={setOldFiles}
                    newFiles={newFiles}
                    setNewFiles={setNewFiles}
                    multiple={true}
                    handleDelete={hanleDelete}
                    readOnly={_readOnly}
                  />
                )}
              </div>
            ),
          grid: { xs: 12, sm: 12, md: 12 },
        },
      ],
    ],
    [formik, api.error, user]
  );

  const hanleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.name != file.name));
    }
  };

  const UpdateRequest = async (status) => {
    let formData = new FormData();
    formData.append("status", status);
    formData.append(
      "period",
      formik.values?.period ? formik.values?.period : ""
    );
    formData.append("year", formik.values?.year ? formik.values?.year : "");
    formData.append("name", formik.values?.name);
    formData.append(
      "passport_code",
      formik.values?.passport_code == null ? "" : formik.values?.passport_code
    );
    formData.append(
      "passport_issue_date",
      formik.values?.passport_issue_date == null
        ? ""
        : Moment(formik.values?.passport_issue_date).format("YYYY-MM-DD")
    );
    formData.append(
      "passport_issue_region",
      formik.values?.passport_issue_region == null
        ? ""
        : formik.values?.passport_issue_region
    );
    formData.append(
      "country_id",
      formik.values?.country?.id == null ? "" : formik.values?.country?.id
    );
    formData.append(
      "contract_start_date",
      formik.values?.contract_start_date == null
        ? ""
        : Moment(formik.values?.contract_start_date).format("YYYY-MM-DD")
    );
    formData.append(
      "contract_end_date",
      formik.values?.contract_end_date == null
        ? ""
        : Moment(formik.values?.contract_end_date).format("YYYY-MM-DD")
    );
    formData.append(
      "start_working_date",
      formik.values?.start_working_date == null
        ? ""
        : Moment(formik.values?.start_working_date).format("YYYY-MM-DD")
    );
    formData.append(
      "end_working_date",
      formik.values?.end_working_date == null
        ? ""
        : Moment(formik.values?.end_working_date).format("YYYY-MM-DD")
    );
    formData.append("reason_type_id", formik.values?.reason_type_id);
    formData.append(
      "reason",
      formik.values?.reason_type_id == 5 ? formik.values?.reason : ""
    );
    formData.append(
      "account_holder_name",
      formik.values?.account_holder_name == null
        ? ""
        : formik.values?.account_holder_name
    );
    formData.append(
      "account_number",
      formik.values?.account_number == null ? "" : formik.values?.account_number
    );
    formData.append(
      "bank_name",
      formik.values?.bank_name == null ? "" : formik.values?.bank_name
    );
    formData.append(
      "bank_branch_name",
      formik.values?.bank_branch_name == null
        ? ""
        : formik.values?.bank_branch_name
    );
    formData.append(
      "request_support_amount",
      formik.values?.request_support_amount
    );
    formData.append("oldFiles", JSON.stringify(oldFiles));
    newFiles.forEach((e, index) => {
      formData.append("files[" + index + "]", e);
    });
    formData.append("_method", params?.id ? "put" : "post");
   
    try {
      const res = await api.fetcher(
        "post",
        params?.id
          ? "/admin/laborSupport/" + params?.id
          : "/admin/laborSupport",
        formData
      );
      if (res) {
        setNewFiles([]);
      }
      handleClose();
      refetch();
    } catch (e) {}
  };
  const CreateRequest = async (status) => {
    let formData = new FormData();
    formData.append("status", status);
    formData.append(
      "period",
      formik.values?.period ? formik.values?.period : ""
    );
    formData.append("year", formik.values?.year ? formik.values?.year : "");
    formData.append("name", formik.values?.name);
    formData.append(
      "passport_code",
      formik.values?.passport_code == null ? "" : formik.values?.passport_code
    );
    formData.append(
      "passport_issue_date",
      formik.values?.passport_issue_date == null
        ? ""
        : Moment(formik.values?.passport_issue_date).format("YYYY-MM-DD")
    );
    formData.append(
      "passport_issue_region",
      formik.values?.passport_issue_region == null
        ? ""
        : formik.values?.passport_issue_region
    );
    formData.append(
      "country_id",
      formik.values?.country?.id == null ? "" : formik.values?.country?.id
    );
    formData.append(
      "contract_start_date",
      formik.values?.contract_start_date == null
        ? ""
        : Moment(formik.values?.contract_start_date).format("YYYY-MM-DD")
    );
    formData.append(
      "contract_end_date",
      formik.values?.contract_end_date == null
        ? ""
        : Moment(formik.values?.contract_end_date).format("YYYY-MM-DD")
    );
    formData.append(
      "start_working_date",
      formik.values?.start_working_date == null
        ? ""
        : Moment(formik.values?.start_working_date).format("YYYY-MM-DD")
    );
    formData.append(
      "end_working_date",
      formik.values?.end_working_date == null
        ? ""
        : Moment(formik.values?.end_working_date).format("YYYY-MM-DD")
    );
    formData.append("reason_type_id", formik.values?.reason_type_id);
    formData.append(
      "reason",
      formik.values?.reason_type_id == 5 ? formik.values?.reason : ""
    );
    formData.append(
      "account_holder_name",
      formik.values?.account_holder_name == null
        ? ""
        : formik.values?.account_holder_name
    );
    formData.append(
      "account_number",
      formik.values?.account_number == null ? "" : formik.values?.account_number
    );
    formData.append(
      "bank_name",
      formik.values?.bank_name == null ? "" : formik.values?.bank_name
    );
    formData.append(
      "bank_branch_name",
      formik.values?.bank_branch_name == null
        ? ""
        : formik.values?.bank_branch_name
    );
    formData.append(
      "request_support_amount",
      formik.values?.request_support_amount
    );
    formData.append("oldFiles", JSON.stringify(oldFiles));
    newFiles.forEach((e, index) => {
      formData.append("files[" + index + "]", e);
    });
    formData.append("_method", params?.id ? "put" : "post");
    try {
      const res = await api.fetcher(
        "post",
        params?.id
          ? "/admin/laborSupport/" + params?.id
          : "/admin/laborSupport",
        formData
      );
      if (res) {
        history.push("/quanly/laborSupport");
      }
      handleClose();
      refetch();
    } catch (e) {}
  };

  const test = useMemo(
    () => (
      <div>
        <TextArea
          label={"abc"}
          type={"textarea"}
          value={formik.values.note}
          handleChange={(e) => {
            formik.setFieldValue("note", e);
          }}
        />
      </div>
    ),
    [formik.values]
  );

  const comfirmChangeStatus = async (status) => {
    let message = "";
    if (status === 2) {
      message = "Xác nhận gửi yêu cầu";
    }
    if (status === 3) {
      message = "Xác nhận thẩm định";
    }
    if (status === 4) {
      message = "Xác nhận phê duyệt";
    }
    if (status > 4) {
      message = "Xác nhận từ chối";
    }
    await dialog({
      title: message,
      content: params?.id ? (
        status == 2 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => UpdateRequest(status)}
          >
            Xác nhận
          </Button>
        ) : (
          <ChangeStatus
            type={user?.user_type}
            handleClose={handleClose}
            status={status}
            id={params?.id}
            refetch={refetch}
          />
        )
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => CreateRequest(status)}
        >
          Xác nhận
        </Button>
      ),
    });
  };
  const deleteRequest = async () => {
    try {
      const res = await api.fetcher(
        "delete",
        "admin/laborSupport/" + params?.id,
        { action: "delete" }
      );
      if (res) {
        history.push("/quanly/laborSupport");
      }
    } catch (e) {}
  };
  const ChangeStatusRequest = async (status) => {
    try {
      const res = await api.fetcher(
        "put",
        "/admin/changeStatusLaborSupport/" + params?.id,
        { status: status, note: formik.values?.note }
      );
      handleClose();
      refetch();
    } catch (e) {}
  };
  return (
    <Paper elevation={5} className={classes.root}>
      <div>
        {!params?.id && (
          <ButtonGroup
            variant="contained"
            style={{ float: "right", marginBottom: 10 }}
          >
            <Button
              style={{ backgroundColor: "#24BA00", color: "#fff" }}
              onClick={() => comfirmChangeStatus(2)}
              endIcon={<SendIcon />}
            >
              Gửi yêu cầu
            </Button>
            <Button
              color={"primary"}
              endIcon={<SaveIcon />}
              onClick={() => CreateRequest(1)}
            >
              Lưu yêu cầu
            </Button>
          </ButtonGroup>
        )}
        {params?.id && (
          <ButtonGroup
            variant="contained"
            style={{ float: "right", marginBottom: 10 }}
          >
            {user?.user_type == 1 && formik.values.status == 2 && (
              <Button
                style={{ backgroundColor: "#24BA00", color: "#fff" }}
                onClick={() => comfirmChangeStatus(3)}
                endIcon={<SendIcon />}
                disabled={api.loading}
              >
                Thẩm định yêu cầu
              </Button>
            )}
            {user?.user_type == 1 &&
              formik.values.status > 1 &&
              formik.values.status < 4 && (
                <Button
                  color={"primary"}
                  onClick={() => comfirmChangeStatus(4)}
                  endIcon={<SendIcon />}
                  disabled={api.loading}
                >
                  Phê duyệt yêu cầu
                </Button>
              )}
            {user?.user_type == 1 &&
              formik.values.status > 1 &&
              formik.values.status < 4 && (
                <Button
                  color={"secondary"}
                  onClick={() => comfirmChangeStatus(5)}
                  endIcon={<SendIcon />}
                  disabled={api.loading}
                >
                  Từ chối yêu cầu
                </Button>
              )}
          </ButtonGroup>
        )}
        {params?.id &&
          user?.user_type != 1 &&
          formik.values.status == 1 &&
          (readOnly ? (
            <ButtonGroup
              variant="contained"
              style={{ float: "right", marginBottom: 10 }}
            >
              <Button
                style={{ backgroundColor: "#24BA00", color: "#fff" }}
                onClick={() => comfirmChangeStatus(2)}
                endIcon={<SendIcon />}
                disabled={api.loading}
              >
                Gửi yêu cầu
              </Button>
              <Button
                color={"primary"}
                endIcon={<SaveIcon />}
                onClick={() => UpdateRequest(1)}
                disabled={api.loading}
              >
                Lưu yêu cầu
              </Button>
              <Button
                color={"secondary"}
                endIcon={<DeleteIcon />}
                onClick={() => deleteRequest()}
                fullWidth
              >
                Xoá yêu cầu
              </Button>
              {/* <Button
                color={'default'}
                endIcon={<EditIcon />}
                onClick={() => setReadOnly(false)}
              >
                Sửa yêu cầu
              </Button> */}
            </ButtonGroup>
          ) : (
            <ButtonGroup
              variant="contained"
              style={{ float: "right", marginBottom: 10 }}
            >
              <Button
                color={"default"}
                endIcon={<ReplayIcon />}
                onClick={() => resetData()}
              >
                Hoàn lại
              </Button>
              <Button
                color={"primary"}
                endIcon={<DoneIcon />}
                onClick={() => setReadOnly(true)}
              >
                Hoàn tất
              </Button>
            </ButtonGroup>
          ))}
      </div>
      <Forms inputs={inputs} readOnly={_readOnly} loading={loading} />
    </Paper>
  );
});

export default LaborSupportCreate;

const useStyle = makeStyles((theme) => ({
  root: {
    padding: 20,
  },
  text: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    fontSize: "1rem",
  },
  title: {
    fontWeight: 600,
  },
  value: {
    fontWeight: 400,
    fontSize: "1rem",
  },
  input: {
    "& input": {
      padding: 4,
      textAlign: "right",
    },
    "& p": {
      marginBottom: 3,
      fontSize: 13,
    },
  },
}));
