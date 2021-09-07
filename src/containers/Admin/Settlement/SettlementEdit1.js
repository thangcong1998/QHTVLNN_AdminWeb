import React, { useEffect, useState, useContext, useMemo } from "react";
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
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { AuthContext } from "../../../common/AuthProvider";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";
import SaveIcon from "@material-ui/icons/Save";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/styles";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ClearIcon from "@material-ui/icons/Clear";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useAPI, useFetch } from "../../../api/api";
import { useFormik } from "formik";
import { DatePicker } from "@material-ui/pickers";
import NumberFormat from "react-number-format";
import Moment from "moment";
import UploadFile from "../Document/UploadFile";
import Select from "../../../components/Admin/form/Select";
import { useDialog } from "../../../components/Dialog";
import ChangeStatus from "./ChangeStatusDialog";
import PropTypes from "prop-types";
import { useStyles } from "@material-ui/pickers/views/Calendar/SlideTransition";

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

export default function SettlementsEdit1(props) {
  const { dataForm, data, perm, refetch } = props;
  let formData = new FormData();
  const newDate = new Date();
  const api = useAPI();
  const classes = useStyle();
  const history = useHistory();
  const params = useParams();
  const { dialog, handleClose } = useDialog();
  const { admin } = useContext(AuthContext);
  const [readOnly, setReadOnly] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [numberPercent, setNumberPercent] = useState(0);
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const formik = useFormik({
    initialValues: {
      type: 1,
      registration_date: Moment(new Date()).format("YYYY-MM-DD"),
    },
    onSubmit: async (values) => {},
  });

  useEffect(() => {
    if (data) {
      if (data.user?.user_type === 1) {
        if (params.id === undefined) {
          history.push("/quanly");
        } else {
          setReadOnly(true);
        }
      }
      if (data.user?.user_type === 2) {
        data.company?.income_settlement_debt === undefined
          ? formik.setFieldValue("previous_debt", 0)
          : formik.setFieldValue(
              "previous_debt",
              data.company?.income_settlement_debt
            );
        setReadOnly(false);
      }
      if (data?.user_type === 3) {
        data.labor_department?.income_settlement_debt === undefined
          ? formik.setFieldValue("previous_debt", 0)
          : formik.setFieldValue(
              "previous_debt",
              data.company?.income_settlement_debt
            );
        setReadOnly(false);
      }
    }
  }, [data]);
  useEffect(() => {
    if (dataForm) {
      formik.setFieldValue("agreement_date", dataForm?.agreement_date);
      formik.setFieldValue("approved_date", dataForm?.approved_date);
      formik.setFieldValue("agreed_date", dataForm?.agreed_date);
      formik.setFieldValue("company_id", dataForm?.company_id);
      formik.setFieldValue("registration_date", dataForm?.registration_date);
      formik.setFieldValue("settlement_period", dataForm?.settlement_period);
      formik.setFieldValue("settlement_year", dataForm?.settlement_year);
      formik.setFieldValue("status", dataForm?.status);
      formik.setFieldValue("total_amount", dataForm?.total_amount);
      formik.setFieldValue("total_income", dataForm?.total_income);
      formik.setFieldValue("total_paid_amount", dataForm?.total_paid_amount);
      formik.setFieldValue(
        "total_remain_amount",
        dataForm?.total_remain_amount
      );
      formik.setFieldValue("previous_debt", dataForm?.previous_debt);
      formik.setFieldValue("type", dataForm?.type);
      setNumberPercent(dataForm?.total_income / 100);
      setCompanyId(dataForm?.company_id);
      setOldFiles(dataForm?.files);
    }
  }, [dataForm]);

  const editSettlement = async () => {
    try {
      formData.append("previous_debt", formik.values?.previous_debt);
      formData.append("registration_date", formik.values?.registration_date);
      formData.append("settlement_period", formik.values?.settlement_period);
      formData.append("settlement_year", formik.values?.settlement_year);
      formData.append("status", 1);
      formData.append("total_amount", formik.values?.total_amount);
      formData.append("total_income", formik.values?.total_income);
      formData.append("total_paid_amount", formik.values?.total_paid_amount);
      formData.append(
        "total_remain_amount",
        formik.values?.total_remain_amount
      );
      formData.append("type", formik.values?.type);
      formData.append("oldFiles", JSON.stringify(oldFiles));
      newFiles.forEach((e, index) => {
        formData.append("files[" + index + "]", e);
      });
      formData.append("_method", params.id ? "PUT" : "POST");
      let res = await api.fetcher(
        "POST",
        "/admin/settlement/" + params.id,
        formData
      );
      if (res) {
        history.push("/quanly/settlement");
      }
    } catch (e) {}
  };

  const hanleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.name != file.name));
    }
  };

  const handleSettlement = async (status) => {
    try {
      let res = await api.fetcher("put", "admin/settlement/" + dataForm.id, {
        status: status,
      });
      refetch();
    } catch (e) {}
  };

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
      content: (
        <ChangeStatus
          type={admin?.user_type}
          handleClose={handleClose}
          status={status}
          id={dataForm?.id}
          refetch={refetch}
        />
      ),
    });
  };
  const deleteRequest = async () => {
    try {
      const res = await api.fetcher(
        "delete",
        "admin/settlement/" + params?.id,
        { action: "force" }
      );
      if (res) {
        history.push("/quanly/settlement");
      }
    } catch (e) {}
  };
  const ExportExcel = async () => {
    try {
      let res = await api.fetcher(
        "post",
        "/admin/exportSettlement/" + params?.id,
        {
          export_type: "settlement",
        },
        {
          responseType: "blob",
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "quyet-toan.xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };

  const ListYear = useMemo(() => {
    const maxYear = Moment(new Date()).year();
    const minYear = 2010;
    const years = [];
    for (let i = maxYear; i >= minYear; i--) {
      years.push(i);
    }
    return years.map((e) => ({ value: e, label: "Năm " + e }));
  }, [formik.values.settlement_year]);

  const TableData = useMemo(
    () => (
      <TableContainer component={Card} style={{ backgroundColor: "#f3f3f3" }}>
        <Table aria-label={"caption table"}>
          <TableBody>
            <TableRow>
              <TableCell style={{ fontSize: 18 }}>Kỳ quyết toán</TableCell>
              <TableCell>
                <FormControl style={{ width: "50%", paddingRight: 10 }}>
                  <TextField
                    label={"Chọn quý"}
                    fullWidth
                    value={formik.values?.settlement_period || ""}
                    readOnly={true}
                  ></TextField>
                </FormControl>
                {admin?.user_type == 2 && (
                  <Select
                    label="Chọn năm"
                    value={formik.values?.settlement_year}
                    handleChange={(e) =>
                      formik.setFieldValue("settlement_year", e)
                    }
                    error={api.error?.settlement_year}
                    options={ListYear}
                    style={{ width: "50%" }}
                    variant="standard"
                    readOnly={dataForm?.status > 1}
                  />
                )}
                {admin?.user_type == 1 && (
                  <TextField
                    variant="standard"
                    style={{ width: "50%", padding: 15 }}
                    value={formik.values?.settlement_year || ""}
                    readOnly={true}
                  />
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: 18 }}>
                Ngày quyết toán kỳ này
              </TableCell>
              <TableCell>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  {Moment(formik.values?.registration_date).format(
                    "DD-MM-YYYY"
                  )}
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: 18 }}>
                Dư nợ kỳ trước chuyển sang
              </TableCell>
              <TableCell>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{}}>
                    <NumberFormat
                      value={formik.values?.previous_debt}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </span>
                  <span style={{ float: "right", fontSize: 13 }}>đ</span>
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: 18 }}>
                Tổng doanh thu kỳ này
              </TableCell>
              <TableCell>
                {admin?.user_type === 1 || dataForm?.status > 1 ? (
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span>
                      <NumberFormat
                        value={formik.values?.total_income}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </span>
                    <span style={{ float: "right", fontSize: 13 }}>đ</span>
                  </p>
                ) : (
                  <TextField
                    className={classes.input1}
                    Style={{ textAlign: "right" }}
                    value={formik.values?.total_income}
                    onChange={(e) => {
                      formik.setFieldValue("total_income", e.target.value);
                      setNumberPercent(Math.ceil(e.target.value / 100));
                      formik.setFieldValue(
                        "total_amount",
                        Math.ceil(e.target.value / 100) +
                          parseInt(formik.values?.previous_debt)
                      );
                    }}
                    fullWidth={true}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      endAdornment: <InputAdornment>đ</InputAdornment>,
                    }}
                  />
                )}
                {api.error?.total_income && (
                  <p style={{ fontSize: 12, color: "#FF2700" }}>
                    {api.error?.total_income}
                  </p>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: 18 }}>
                Số tiền phải nộp quỹ trong kỳ
              </TableCell>
              <TableCell>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{}}>
                    <NumberFormat
                      value={numberPercent}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </span>
                  <span style={{ float: "right", fontSize: 13 }}>đ</span>
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "red",
                  fontSize: 18,
                }}
              >
                Tổng số tiền phải nộp
              </TableCell>
              <TableCell>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{ color: "red" }}>
                    <NumberFormat
                      value={formik.values?.total_amount}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </span>
                  <span style={{ float: "right", color: "red", fontSize: 13 }}>
                    đ
                  </span>
                </p>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ fontSize: 18 }}>Số tiền đã nộp</TableCell>
              <TableCell>
                {admin?.user_type === 1 || dataForm?.status > 1 ? (
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{}}>
                      <NumberFormat
                        value={formik.values?.total_paid_amount}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </span>
                    <span style={{ float: "right", fontSize: 13 }}>đ</span>
                  </p>
                ) : (
                  <TextField
                    className={classes.input1}
                    Style={{ textAlign: "right" }}
                    value={formik.values?.total_paid_amount}
                    onChange={(e) => {
                      formik.setFieldValue("total_paid_amount", e.target.value);
                      formik.setFieldValue(
                        "total_remain_amount",
                        formik.values?.total_amount - e.target.value
                      );
                    }}
                    fullWidth={true}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                      endAdornment: <InputAdornment>đ</InputAdornment>,
                    }}
                  />
                )}
                {api.error?.total_paid_amount && (
                  <p style={{ fontSize: 12, color: "#FF2700" }}>
                    {api.error?.total_paid_amount}
                  </p>
                )}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell
                style={{ fontSize: 18, fontWeight: "bold", color: "red" }}
              >
                Số tiền nợ chuyển kỳ sau
              </TableCell>
              <TableCell>
                <p
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  <span style={{ color: "red" }}>
                    <NumberFormat
                      value={formik.values?.total_remain_amount}
                      displayType={"text"}
                      thousandSeparator={true}
                    />
                  </span>
                  <span style={{ float: "right", color: "red", fontSize: 13 }}>
                    đ
                  </span>
                </p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    ),
    [formik.values, formData, ListYear]
  );

  return (
    <Card style={{ padding: 20 }}>
      {dataForm?.status > 0 && (
        <Button
          color={"primary"}
          endIcon={<CloudDownloadIcon />}
          onClick={() => ExportExcel()}
          variant={"contained"}
        >
          Xuất quyết toán dạng xlsx
        </Button>
      )}
      <ButtonGroup
        variant="contained"
        aria-label="contained button group"
        style={{ float: "right" }}
      >
        {(dataForm?.status < 2 || dataForm?.status === undefined) &&
          admin?.user_type !== 1 && (
            <Button
              style={{ backgroundColor: "#24BA00", color: "#fff" }}
              onClick={() => comfirmChangeStatus(2)}
              endIcon={<SendIcon />}
            >
              Gửi quyết toán
            </Button>
          )}
        {dataForm?.status === 1 && admin?.user_type !== 1 && (
          <Button
            color={"primary"}
            endIcon={<EditIcon />}
            onClick={editSettlement}
          >
            Sửa quyết toán
          </Button>
        )}
        {dataForm?.status === 2 &&
          admin?.user_type === 1 &&
          perm?.map((e) => e?.name).includes("settlement_approval") && (
            <Button
              style={{ backgroundColor: "#24BA00", color: "#fff" }}
              onClick={() => comfirmChangeStatus(3)}
              endIcon={<FindInPageIcon />}
            >
              Thẩm định quyết toán
            </Button>
          )}
        {dataForm?.status > 1 &&
          dataForm?.status < 4 &&
          admin?.user_type === 1 &&
          perm?.map((e) => e.name).includes("settlement_approval") && (
            <Button
              color="primary"
              onClick={() => comfirmChangeStatus(4)}
              endIcon={<AssignmentTurnedInIcon />}
            >
              Phê duyệt quyết toán
            </Button>
          )}
        {dataForm?.status > 1 &&
          dataForm?.status < 4 &&
          admin?.user_type === 1 && (
            <Button
              color={"secondary"}
              endIcon={<ClearIcon />}
              onClick={() => comfirmChangeStatus(5)}
            >
              Từ chối quyết toán
            </Button>
          )}
        {dataForm?.status === 1 && admin?.user_type !== 1 && (
          <Button
            color={"secondary"}
            endIcon={<DeleteIcon />}
            onClick={() => deleteRequest()}
          >
            Xóa quyết toán
          </Button>
        )}
      </ButtonGroup>
      <br />
      <br />
      <Divider />
      <p style={{ textAlign: "center", fontSize: 22 }}>
        Quyết toán quỹ hỗ trợ VLNN - THEO DOANH THU TỪ PHÍ DỊCH VỤ
      </p>
      {TableData}
      {(dataForm?.status < 2 || dataForm?.files?.length !== 0) && (
        <div style={{ width: "100%", margin: "20px 0px" }}>
          <b>Tài liệu</b>
          <UploadFile
            data={data}
            errors={api.error?.files}
            oldFiles={oldFiles}
            setOldFiles={setOldFiles}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            multiple={true}
            handleDelete={hanleDelete}
            readOnly={dataForm?.status > 1 ? true : false}
          />
        </div>
      )}
    </Card>
  );
}
const useStyle = makeStyles((theme) => ({
  input1: {
    "& input": {
      textAlign: "right",
    },
    "& p": {
      marginBottom: 7,
      fontSize: 13,
    },
  },
}));
