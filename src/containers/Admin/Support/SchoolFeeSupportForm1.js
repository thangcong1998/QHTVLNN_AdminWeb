import React, { useEffect, useState, useMemo, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Card,
  Divider,
  TableContainer,
  Table,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  FormControl,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  FormHelperText,
  Paper,
} from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import { AuthContext } from "../../../common/AuthProvider";
import ClearIcon from "@material-ui/icons/Clear";
import { useAPI, useFetch } from "../../../api/api";
import { useFormik } from "formik";
import { Skeleton } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import UploadFile from "../../../components/Admin/form/UploadFile";
import ReplayIcon from "@material-ui/icons/Replay";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import SendIcon from "@material-ui/icons/Send";
import SaveIcon from "@material-ui/icons/Save";
import DoneIcon from "@material-ui/icons/Done";
import Moment from "moment";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import DatePick from "../../../components/Admin/form/Date";
import ChangeStatusDialog from "./ChangeStatusDialog";
import { useDialog } from "../../../components/Dialog";

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

export default function DocumentSupportForm({}) {
  let formData = new FormData();
  const params = useParams();
  const history = useHistory();
  const classes = useStyle();
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const { admin } = useContext(AuthContext);
  const { data: user } = useFetch(["get", "admin/me"]);
  const [schoolFeeSupport, setSchoolFeeSupport] = useState([]);
  const { data: countries } = useFetch([
    "get",
    "/admin/countries?per_page=500",
  ]);
  const { data: typeObject } = useFetch([
    "get",
    "/admin/typeObject?per_page=10",
  ]);
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    params?.id ? "get" : null,
    "/admin/schoolFeeSupport/" + params.id,
  ]);
  const [readOnly, setReadOnly] = useState(true);
  const formik = useFormik({
    initialValues: {
      period: "",
      year: Moment(new Date()).year(),
    },
  });
  useEffect(() => {
    if (data) {
      if (data?.school_fee_support) {
        setSchoolFeeSupport(
          data?.school_fee_support?.map((e) => {
            return {
              name: e.labor?.name,
              dob: e.labor?.dob,
              id_code: e.labor?.id_code,
              country: e.country,
              type_object: e.type_object,
              ...e,
              readOnly: true,
            };
          })
        );
        formik.setFieldValue("period", data?.period);
        formik.setFieldValue(
          "year",
          !data?.year ? Moment(new Date()).year() : data?.year
        );
        formik.setFieldValue(
          "agreement_comment",
          schoolFeeSupport.agreement_comment
        );
        setOldFiles(data?.files);
      }
      formik.setFieldValue("status", data.status);
    }
  }, [data]);
  const [tempRow, setTempRow] = useState({
    name: "",
    dob: undefined,
    id_code: "",
    type_object: "",
    certificate_code: "",
    improve_skill_class_support_fee_base: undefined,
    request_support_amount: 0,
    country: "",
    paid_amount: 0,
    readOnly: true,
  });

  const addDocSup = () => {
    let temp = [...schoolFeeSupport];
    temp.push(tempRow);
    setSchoolFeeSupport(temp);
  };
  const ChangeName = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].name = value;
    setSchoolFeeSupport(temp);
  };
  const ChangeDob = (e, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].dob = Moment(e._d).format("YYYY-MM-DD");
    setSchoolFeeSupport(temp);
  };
  const ChangeIdCode = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].id_code = value;
    setSchoolFeeSupport(temp);
  };
  const ChangeTypeObject = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].type_object = value;
    setSchoolFeeSupport(temp);
  };
  const ChangeCertificateCode = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].certificate_code = value;
    setSchoolFeeSupport(temp);
  };
  const ChangePaidAmount = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].paid_amount = value;
    setSchoolFeeSupport(temp);
  };
  const ChangeRequestSupportAmount = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].request_support_amount = value;
    setSchoolFeeSupport(temp);
  };
  const ChangeCountries = (value, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].country = value;
    setSchoolFeeSupport(temp);
  };
  const ReadOnlyRow = (e, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].readOnly = true;
    setSchoolFeeSupport(temp);
  };
  const DeleteRow = (e, row) => {
    let temp = [...schoolFeeSupport];
    temp.splice(row, 1);
    setSchoolFeeSupport(temp);
  };
  const EditRow = (e, row) => {
    let temp = [...schoolFeeSupport];
    temp[row] = { ...schoolFeeSupport[row] };
    temp[row].readOnly = false;
    setSchoolFeeSupport(temp);
  };
  const UpdateRequest = async (status) => {
    try {
      let formData = new FormData();
      formData.append("status", status);
      formData.append("type", 2);
      formData.append("user_type", admin?.user_type);
      formData.append("type_school_fee", 1);
      formData.append(
        "company_id",
        admin?.company?.id
          ? admin?.company?.id
          : ""
      );
      formData.append(
        "labor_department_id",
        admin?.labor_department_id ? admin?.labor_department_id : ""
      );
      formData.append("period", formik.values?.period);
      formData.append(
        "year",
        formik.values?.year
          ? formik.values?.year
          : Moment(new Date()).format("YYYY")
      );
      newFiles.forEach((e, index) => {
        formData.append("files[" + index + "]", e);
      });
      params.id && formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append("schoolFeeSupport", JSON.stringify(schoolFeeSupport));
      if (schoolFeeSupport.length == 0) {
        toast.error("Danh sách hỗ trợ học phí chưa có dữ liệu", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return 0;
      }
      formData.append("_method", params?.id ? "put" : "post");
      const res = await api.fetcher(
        "post",
        params?.id
          ? "/admin/schoolFeeSupport/" + params?.id
          : "/admin/schoolFeeSupport",
        formData
      );
      if (res) {
        history.push("/quanly/schoolFeeSupport");
      }
    } catch (e) {}
    handleClose();
  };
  const sendDocumentSupport = async (status) => {
    try {
      let formData = new FormData();
      formData.append("status", status);
      formData.append("type", 2);
      formData.append("type_school_fee", 1);
      formData.append(
        "company_id",
        admin?.company?.id 
          ? admin?.company?.id
          : ""
      );
      formData.append("user_type", admin?.user_type);
      formData.append("period", formik.values?.period);
      formData.append(
        "year",
        formik.values?.year
          ? formik.values?.year
          : Moment(new Date()).format("YYYY")
      );
      formData.append(
        "country_id",
        formik.values?.country?.id === undefined
          ? ""
          : formik.values?.country?.id
      );
      formData.append(
        "type_object_id",
        formik.values?.type_object?.id === undefined
          ? ""
          : formik.values?.type_object?.id
      );
      formData.append(
        "labor_department_id",
        admin?.labor_department_id ? admin?.labor_department_id : ""
      );
      newFiles.forEach((e, index) => {
        formData.append("files[" + index + "]", e);
      });
      formData.append("improve_skill_class_support_fee_base", null);
      // params.id && formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append("schoolFeeSupport", JSON.stringify(schoolFeeSupport));
      if (schoolFeeSupport.length == 0) {
        toast.error("Danh sách hỗ trợ học phí chưa có dữ liệu", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return 0;
      }
      formData.append("_method", params.id ? "put" : "post");
      let res = await api.fetcher(
        "post",
        params.id
          ? "/admin/schoolFeeSupport/" + params.id
          : "/admin/schoolFeeSupport",
        formData
      );
      if (res) {
        history.push("/quanly/schoolFeeSupport");
      }
      handleClose();
    } catch (e) {}
  };
  const deleteRequest = async () => {
    try {
      const res = await api.fetcher(
        "delete",
        "admin/schoolFeeSupport/" + params?.id,
        { action: "delete" }
      );
      if (res) {
        history.push("/quanly/schoolFeeSupport");
      }
    } catch (e) {}
  };
  const ChangeStatusRequest = async (status) => {
    let message = "";
    if (status == 2) {
      message = "Xác nhận yêu cầu";
    }
    if (status == 3) {
      message = "Xác nhận thẩm định";
    }
    if (status == 4) {
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
            handleClose={handleClose}
            variant="contained"
            color="primary"
            onClick={() => UpdateRequest(status)}
          >
            Xác nhận
          </Button>
        ) : (
          <ChangeStatusDialog
            type={user?.user_type}
            handleClose={handleClose}
            status={status}
            id={params?.id}
            formData={formData}
            refetch={refetch}
          />
        )
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => sendDocumentSupport(status)}
        >
          Xác nhận
        </Button>
      ),
    });
  };

  const ChangeStatusRequest1 = async (status) => {
    try {
      const res = await api.fetcher(
        "put",
        "/admin/changeStatusDocSupport/" + params?.id,
        { status: status, note: formik.values?.note }
      );
      handleClose();
      refetch();
    } catch (e) {}
  };
  const resetData = () => {
    try {
      refetch();
    } catch (e) {}
  };

  const handleImport = (e) => {
    const f = e.target.files[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        // evt = on_file_select event
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        /* Update state */
        setSchoolFeeSupport(
          data
            .filter((z, index) => index > 0)
            .map((e, index) => ({
              name: e[0],
              dob:
                e[1] &&
                typeof e[1] === "string" &&
                e[1]?.split("/").reverse().join("/"),
              id_code: e[2],
              type_object: e[3],
              type_object: typeObject?.data.find((x) => x.name == e[3]),
              certificate_code: e[4],
              country: e[5],
              country: countries?.data.find((x) => x.name == e[5]),
              paid_amount: e[6],
              request_support_amount: e[7],
              readOnly: false,
            }))
        );
      };
      reader.readAsBinaryString(f);
    }
  };
  const ListYear = useMemo(() => {
    const maxYear = Moment(new Date()).year();
    const minYear = 2010;
    const years = [];
    for (let i = maxYear; i >= minYear; i--) {
      years.push(i);
    }
    return years;
  }, [formik.values.year]);
  const Step1 = (
    <Paper elevation={0}>
      <div>
        {!params?.id && (
          <ButtonGroup
            variant="contained"
            style={{ float: "right", marginBottom: 10 }}
          >
            <Button
              variant="contained"
              style={{
                float: "right",
                backgroundColor: "#24BA00",
                color: "#fff",
              }}
              color={"green"}
              endIcon={<SendIcon />}
              onClick={() => ChangeStatusRequest(2)}
            >
              Gửi danh sách hỗ trợ
            </Button>
            <Button
              variant="contained"
              style={{ float: "right" }}
              color={"primary"}
              endIcon={<SaveIcon />}
              onClick={() => sendDocumentSupport(1)}
            >
              Lưu danh sách hỗ trợ
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
                onClick={() => ChangeStatusRequest(3)}
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
                  onClick={() => ChangeStatusRequest(4)}
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
                  onClick={() => ChangeStatusRequest(5)}
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
                onClick={() => ChangeStatusRequest(2)}
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
        <input
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={(e) => handleImport(e)}
        />
        <label htmlFor="contained-button-file">
          {user?.user_type == 2 && (data?.status == 1 || !data?.status) && (
            <ButtonGroup>
              <Button variant="contained" color="primary" component="span">
                Upload
              </Button>
              <a
                style={{ textDecoration: "none" }}
                href={
                  process.env.REACT_APP_UPLOAD_IMAGE_URL +
                  "/DsHoTroHocPhi7A.xlsx"
                }
              >
                <Button
                  variant="contained"
                  component="span"
                  className={classes.formExcelBtn}
                  style={{ textDecoration: "none" }}
                  download={"Mau-danh-sach"}
                >
                  Tài liệu mẫu
                </Button>
              </a>
            </ButtonGroup>
          )}
        </label>
      </div>
    </Paper>
  );
  const handleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.name != file.name));
    }
  };
  const total = () => {
    let request_support_amount = 0;
    let paid_amount = 0;
    schoolFeeSupport.forEach((e) => {
      paid_amount = paid_amount + parseInt(e.paid_amount);
      request_support_amount =
        request_support_amount + parseInt(e.request_support_amount);
    });
    return {
      total_paid_amount: paid_amount,
      total_request_support_amount: request_support_amount,
    };
  };
  const total1 = total();
  const Step3 = (
    <div style={{ padding: 10 }}>
      <FormControl style={{ width: "15%", paddingRight: 10 }}>
        <InputLabel id="demo-controlled-open-select-label">Quý</InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          onChange={(e) => formik.setFieldValue("period", e.target.value)}
          value={parseInt(formik.values?.period)}
          readOnly={data?.status > 1}
        >
          <MenuItem value={""}>Chọn quý</MenuItem>
          <MenuItem value={1}>Quý 1</MenuItem>
          <MenuItem value={2}>Quý 2</MenuItem>
          <MenuItem value={3}>Quý 3</MenuItem>
          <MenuItem value={4}>Quý 4</MenuItem>
        </Select>
        <FormHelperText error={api.error?.period ? true : false}>
          {api.error?.period}
        </FormHelperText>
      </FormControl>
      <FormControl style={{ width: "15%", paddingLeft: 10 }}>
        <InputLabel id="demo-controlled-open-select-label">Năm</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          onChange={(e) => formik.setFieldValue("year", e.target.value)}
          value={parseInt(formik.values?.year)}
          readOnly={data?.status > 1}
        >
          <MenuItem value={""}>Chọn năm</MenuItem>
          {ListYear.map((e) => (
            <MenuItem key={e} value={e}>
              {e}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText error={api.error?.year ? true : false}>
          {api.error?.year}
        </FormHelperText>
      </FormControl>
    </div>
  );
  const Step2 = (
    <div>
      <TableContainer className={classes.LaborsTable}>
        <Table aria-label={"caption table"}>
          <TableBody>
            <TableRow>
              <TableCell className={classes.headerList} style={{ width: 50 }}>
                STT
              </TableCell>
              <TableCell className={classes.headerList}>
                Họ tên người lao động
              </TableCell>
              <TableCell className={classes.headerList}>Ngày sinh </TableCell>
              <TableCell className={classes.headerList}>Số hộ chiếu </TableCell>
              <TableCell className={classes.headerList}>
                Loại đối tượng
              </TableCell>
              <TableCell
                style={{ width: "15%" }}
                style={{ width: "15%" }}
                className={classes.headerList}
              >
                Số GCN đóng góp quỹ{" "}
              </TableCell>
              <TableCell className={classes.headerList}>
                Nước đến làm việc
              </TableCell>
              <TableCell className={classes.headerList}>
                Mức học phí người lao động đã nộp{" "}
              </TableCell>
              <TableCell className={classes.headerList}>
                Mức hỗ trợ cho người lao động{" "}
              </TableCell>
              {(data?.status == 1 || !data?.status) && (
                <TableCell
                  style={{ width: 50 }}
                  title={"Thêm danh sách hỗ trợ"}
                  className={classes.headerList}
                >
                  <ControlPointIcon onClick={addDocSup} />
                </TableCell>
              )}
            </TableRow>
            {schoolFeeSupport.map((row, index) => (
              <TableRow>
                <TableCell className={classes.tableCell}>{index + 1}</TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.name === "" ||
                        api?.error?.["schoolFeeSupport." + index + ".name"]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      value={row?.name}
                      onChange={(e) => ChangeName(e.target.value, index)}
                      fullWidth={true}
                      placeholder={"Họ tên"}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>{row?.name}</p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {(row.name || !row.name) &&
                      api?.error?.["schoolFeeSupport." + index + ".name"]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <DatePick
                      error={
                        row.dob === "" ||
                        api?.error?.["schoolFeeSupport." + index + ".dob"]
                          ? true
                          : false
                      }
                      inputVariant="outlined"
                      display="true"
                      value={row.dob || null}
                      handleChange={(e) => ChangeDob(e, index)}
                      fullWidth={true}
                      helperText={
                        api?.error?.["schoolFeeSupport." + index + ".dob"]
                      }
                    />
                  ) : (
                    <p style={{ color: "#000" }}>
                      {row.dob && Moment(row?.dob).format("DD/MM/YYYY")}
                    </p>
                  )}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.id_code === "" ||
                        api?.error?.["schoolFeeSupport." + index + ".id_code"]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      value={row.id_code}
                      onChange={(e) => ChangeIdCode(e.target.value, index)}
                      fullWidth={true}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>{row?.id_code}</p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.id_code &&
                      api?.error?.["schoolFeeSupport." + index + ".id_code"]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <Autocomplete
                    error={
                      row.type_object === "" ||
                      api?.error?.["schoolFeeSupport." + index + ".type_object"]
                        ? true
                        : false
                    }
                      endpoint={"admin/typeObject?per_page=10"}
                      queryField={"name"}
                      size={"medium"}
                      value={row?.type_object}
                      inputValue={row?.type_object?.name}
                      handleChange={(e) => ChangeTypeObject(e, index)}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>{row.type_object?.name}</p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.type_object &&
                      api?.error?.[
                        "schoolFeeSupport." + index + ".type_object"
                      ]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        // row.certificate_code === "" ||
                        api?.error?.[
                          "schoolFeeSupport." + index + ".certificate_code"
                        ]
                          // ? true
                          // : false
                      }
                      variant={"outlined"}
                      display="true"
                      type={"number"}
                      value={row?.certificate_code}
                      onChange={(e) =>
                        ChangeCertificateCode(e.target.value, index)
                      }
                      fullWidth={true}
                      helperText={
                        api?.error?.[
                          "schoolFeeSupport." + index + ".certificate_code"
                        ]
                      }
                    />
                  ) : (
                    <p style={{ color: "#000", textAlign: "right" }}>
                      {row?.certificate_code}
                    </p>
                  )}
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <Autocomplete
                    error={
                      row.country === "" ||
                      api?.error?.["schoolFeeSupport." + index + ".country"]
                        ? true
                        : false
                    }
                      endpoint={"admin/countries?per_page=500"}
                      queryField={"name"}
                      size={"medium"}
                      inputValue={row?.country?.name}
                      value={row?.country}
                      handleChange={(e) => ChangeCountries(e, index)}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>{row.country?.name}</p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.country &&
                      api?.error?.["schoolFeeSupport." + index + ".country"]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      className={classes.input1}
                      error={
                        row.paid_amount === "" ||
                        api?.error?.[
                          "schoolFeeSupport." + index + ".paid_amount"
                        ]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        endAdornment: <InputAdornment>đ</InputAdornment>,
                      }}
                      value={row.paid_amount}
                      onChange={(e) => ChangePaidAmount(e.target.value, index)}
                      fullWidth={true}
                      helperText={
                        api?.error?.[
                          "schoolFeeSupport." + index + ".paid_amount"
                        ]
                      }
                    />
                  ) : (
                    <p style={{ color: "#000", textAlign: "right" }}>
                      <span className={classes.span}>
                        <NumberFormat
                          style={{ textAlign: "right" }}
                          displayType={"text"}
                          value={row?.paid_amount}
                          thousandSeparator={true}
                        />
                      </span>
                      <span style={{ float: "right", fontSize: 13 }}>đ</span>
                    </p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {api?.error?.["schoolFeeSupport." + index + ".paid_amount"]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      className={classes.input1}
                      error={
                        row.request_support_amount === "" ||
                        api?.error?.[
                          "schoolFeeSupport." +
                            index +
                            ".request_support_amount"
                        ]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      InputProps={{
                        inputComponent: NumberFormatCustom,
                        endAdornment: <InputAdornment>đ</InputAdornment>,
                      }}
                      value={row.request_support_amount}
                      onChange={(e) =>
                        ChangeRequestSupportAmount(e.target.value, index)
                      }
                      fullWidth={true}
                    />
                  ) : (
                    <p style={{ color: "#000", textAlign: "right" }}>
                      <span className={classes.span}>
                        <NumberFormat
                          style={{ textAlign: "right" }}
                          displayType={"text"}
                          value={row?.request_support_amount}
                          thousandSeparator={true}
                        />
                      </span>
                      <span style={{ float: "right", fontSize: 13 }}>đ</span>
                    </p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {
                      api?.error?.[
                        "schoolFeeSupport." + index + ".request_support_amount"
                      ]
                    }
                  </p>
                </TableCell>
                {(data?.status == 1 || !data?.status) && (
                  <TableCell align="center" className={classes.tableCell}>
                    {row?.readOnly === true && (
                      <div
                        style={{
                          display: "flex",
                          msFlexWrap: "wrap",
                          flexWrap: "wrap",
                          marginRight: "-15px",
                          marginLeft: "-15px",
                        }}
                      >
                        <EditIcon onClick={(e) => EditRow(e, index)} />
                        <DeleteForeverIcon
                          onClick={(e) => DeleteRow(e, index)}
                        />
                      </div>
                    )}
                    {row.readOnly === false && (
                      <div
                        style={{
                          display: "flex",
                          msFlexWrap: "wrap",
                          flexWrap: "wrap",
                          marginRight: "-15px",
                          marginLeft: "-15px",
                        }}
                      >
                        <CheckIcon onClick={(e) => ReadOnlyRow(e, index)} />
                        <DeleteForeverIcon
                          onClick={(e) => DeleteRow(e, index)}
                        />
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            <TableRow className={classes.headerList}>
              <TableCell className={classes.headerList}>Cộng</TableCell>
              <TableCell className={classes.headerList}></TableCell>
              <TableCell className={classes.headerList}></TableCell>
              <TableCell className={classes.headerList}></TableCell>
              <TableCell className={classes.headerList}></TableCell>
              <TableCell className={classes.headerList}></TableCell>
              <TableCell className={classes.headerList}></TableCell>
              <TableCell
                className={classes.headerList}
                style={{ textAlign: "right" }}
              >
                <span className={classes.span}>
                  <NumberFormat
                    style={{ textAlign: "right" }}
                    displayType={"text"}
                    value={total1.total_paid_amount}
                    thousandSeparator={true}
                  />
                </span>
                <span style={{ float: "right", fontSize: 13 }}>đ</span>
              </TableCell>
              <TableCell
                className={classes.headerList}
                style={{ textAlign: "right" }}
              >
                <span className={classes.span}>
                  <NumberFormat
                    style={{ textAlign: "right" }}
                    displayType={"text"}
                    value={total1.total_request_support_amount}
                    thousandSeparator={true}
                  />
                </span>
                <span style={{ float: "right", fontSize: 13 }}>đ</span>
              </TableCell>
              {(data?.status == 1 || !data?.status) && (
                <TableCell className={classes.headerList}></TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div>
        <div>
          {data?.agreement_comment &&
            data?.status > 2 &&
            data?.status <= 6 && (
              <span style={{ display: "flex", padding: 10 }}>
                Ý kiến của cán bộ thẩm đinh:{" "}
                <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                  {data?.agreement_comment}
                </span>
              </span>
            )}{" "}
        </div>
        <div>
          {data?.approval_comment && data?.status >= 4 && (
            <span style={{ display: "flex", padding: 10 }}>
              Ý kiến của cán bộ thẩm định:
              <span style={{ fontSize: "1rem", fontWeight: "600" }}>
                {data?.approval_comment}
              </span>
            </span>
          )}
        </div>
      </div>
      <div style={{ marginTop: 20, width: "100%" }}>
        <b>Tài liệu</b>
        <UploadFile
          data={data}
          errors={api.error?.files}
          oldFiles={oldFiles}
          setOldFiles={setOldFiles}
          newFiles={newFiles}
          setNewFiles={setNewFiles}
          multiple={true}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );

  return (
    <Card className="settlement-form-layout">
      {Step1} {Step3} {Step2}
    </Card>
  );
}
const useStyle = makeStyles((theme) => ({
  LaborsTable: {
    "& td": {
      verticalAlign: "top",
    },
  },
  span: {
    "& span": {
      padding: 2,
    },
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
  headerList: {
    fontSize: "1rem",
    fontWeight: "bold",
    border: " 1px solid black",
    "& div": {
      maxHeight: 56,
    },
  },
  tableCell: {
    fontSize: "1rem",
    fontWeight: 400,
    border: " 1px solid black",
    "& div": {
      maxHeight: 56,
    },
  },
  input: {
    display: "none",
  },
  formExcelBtn: {
    backgroundColor: "#24ba00",
    color: "#FFF",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#219106",
    },
  },
}));
