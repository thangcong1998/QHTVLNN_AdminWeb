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
  StepConnector,
} from "@material-ui/core";
import { AuthContext } from "../../../common/AuthProvider";
import ClearIcon from "@material-ui/icons/Clear";
import { useAPI, useFetch } from "../../../api/api";
import { useFormik } from "formik";
import PropTypes from "prop-types";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import SettlementForm2 from "./SettlementForm2";
import SendIcon from "@material-ui/icons/Send";
import SaveIcon from "@material-ui/icons/Save";
import { DatePicker } from "@material-ui/pickers";
import NumberFormat from "react-number-format";
import Moment from "moment";
import * as XLSX from "xlsx";
import DatePick from "../../../components/Admin/form/Date";
import UploadFile from "../../../components/Admin/form/UploadFile";
import { FormatIndentDecrease } from "@material-ui/icons";
import "./settlement.css";
import loading from "../../../assets/image/25.gif";
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

export default function SettlementCreate2(props) {
  const { error } = props;
  const history = useHistory();
  const classes = useStyle();
  const api = useAPI();
  const params = useParams();
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const { admin } = useContext(AuthContext);
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["Danh sách người lao động", "Thông tin quyết toán"];
  const [labors, setLabors] = useState([]);
  const { data: countries, loading: countriesLoading, data: data } = useFetch([
    "get",
    "/admin/countries?per_page=500",
  ]);
  const dataForm = useFetch([
    params.id ? "get" : null,
    "/admin/settlement/" + params.id,
  ]);
  useEffect(() => {
    formik.setFieldValue(
      "previous_debt",
      admin?.company
        ? admin?.company?.labor_settlement_debt
        : admin?.labor_department?.labor_settlement_debt
    );
    formik.setFieldValue("total_paid_amount", 0);
    formik.setFieldValue("settlement_period", "");
    formik.setFieldValue("settlement_year", Moment(new Date()).year());
    if (data) {
      setOldFiles(data.files);
    }
  }, [data]);
  const formik = useFormik({
    initialValues: {},
  });
  function addLabor() {
    setLabors((pre) => [
      ...pre,
      {
        name: "",
        certificate_code: "",
        code: "",
        country: undefined,
        country_name: "",
        expected_exit_date: undefined,
      },
    ]);
  }

  function DeleteLabor(event, i) {
    setLabors((pre) => pre.filter((e, index) => index != i));
  }

  function ChangeName(value, index) {
    let items = [...labors];
    items[index].name = value;
    setLabors(items);
  }

  function ChangeCode(value, index) {
    let items = [...labors];
    items[index].code = value;
    setLabors(items);
  }

  const handleChangeLabor = (field, value, index) => {
    let items = [...labors];
    items[index][field] = value;
    setLabors(items);
  };

  const handleChangeCountry = (value, index) => {
    let items = [...labors];
    items[index].country = value;
    if (value) {
      items[index].country_name = value?.name;
    } else {
      items[index].country_name = "";
    }
    setLabors(items);
  };

  const handleChangeCountryName = (value, index) => {
    let items = [...labors];
    items[index].country_name = value;
    setLabors(items);
  };

  const handleChangeExpectedExitDate = (value, index) => {
    let items = [...labors];
    items[index].expected_exit_date = Moment(value).format("YYYY-MM-DD");
    setLabors(items);
  };

  function handleNext() {
    if (activeStep < 2) {
      setActiveStep(1);
    }
  }

  function handleBack() {
    if (activeStep > 0) {
      setActiveStep(0);
    }
  }
  const sendSettlement = async () => {
    try {
      let formData = new FormData();
      let _labors = labors.map((e) => ({ ...e, country: e?.country?.id }));
      formData.append("labors", JSON.stringify(_labors));
      formData.append("type", 2);
      formData.append("status", 2);
      formData.append("settlement_period", formik.values?.settlement_period);
      formData.append(
        "settlement_year",
        formik.values?.settlement_year
          ? formik.values?.settlement_year
          : Moment(new Date()).format("YYYY")
      );
      formData.append(
        "registration_date",
        Moment(new Date()).format("YYYY-MM-DD")
      );
      formData.append(
        "previous_debt",
        formik.values?.previous_debt ? 0 : formik.values?.previous_debt
      );
      formData.append("total_income", labors.length * 100000);
      formData.append(
        "total_amount",
        labors.length * 100000 + formik.values?.previous_debt
      );
      formData.append("total_paid_amount", formik.values?.total_paid_amount);
      formData.append(
        "total_remain_amount",
        labors.length * 100000 +
          formik.values?.previous_debt -
          formik.values?.total_paid_amount
      );
      newFiles.forEach((e, index) => {
        formData.append("files[" + index + "]", e);
      });
      params.id && formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append("_method", "post");
      let res = await api.fetcher("post", "admin/settlement", formData);
      history.push("/quanly/settlement");
    } catch (e) {}
  };
  const saveSettlement = async () => {
    try {
      let formData = new FormData();
      let _labors = labors.map((e) => ({ ...e, country: e?.country?.id }));
      formData.append("labors", JSON.stringify(_labors));
      formData.append("type", 2);
      formData.append("status", 1);
      formData.append("settlement_period", formik.values?.settlement_period);
      formData.append(
        "settlement_year",
        formik.values?.settlement_year
          ? formik.values?.settlement_year
          : Moment(new Date()).format("YYYY")
      );
      formData.append(
        "registration_date",
        Moment(new Date()).format("YYYY-MM-DD")
      );
      newFiles.forEach((e, index) => {
        formData.append("files[" + index + "]", e);
      });
      params.id && formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append("previous_debt", formik.values?.previous_debt);
      formData.append("total_income", labors.length * 100000);
      formData.append(
        "total_amount",
        labors.length * 100000 + formik.values?.previous_debt
      );
      formData.append("total_paid_amount", formik.values?.total_paid_amount);
      formData.append(
        "total_remain_amount",
        labors.length * 100000 +
          formik.values?.previous_debt -
          formik.values?.total_paid_amount
      );
      formData.append("_method", "post");
      let res = await api.fetcher("post", "admin/settlement", formData);
      history.push("/quanly/settlement");
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
        let arr1 = data.filter((z, index) => index > 0);
        let arr2 = arr1.map((e, index) => ({
          name: e[0],
          certificate_code: e[1],
          code: e[2],
          country_name: e[3],
          country: countries?.data.find((x) => x.name == e[3]),
          expected_exit_date:
            e[4] &&
            typeof e[4] === "string" &&
            e[4]?.split("/").reverse().join("/"),
        }));
        setLabors(arr2);
      };
      reader.readAsBinaryString(f);
    }
  };
  const handleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.id != file.name));
    }
  };
  const IncomeCountry = useMemo(() => {
    let arr = [...labors];
    let arr2 = [];
    arr.forEach((e, index) => {
      if ([...arr2.keys()].indexOf(e.country_name) == -1) {
        arr2[e.country_name] = 0;
        arr.forEach((x, i) => {
          if (e.country_name == x.country_name) {
            arr2[e.country_name]++;
          }
        });
      }
    });
    const arr3 = Object.keys({ ...arr2 })
      .sort()
      .map((e, index) => ({ country_name: e, count: arr2[e] }));
    return arr3;
  }, [labors]);

  const ListYear = useMemo(() => {
    const maxYear = Moment(new Date()).year();
    const minYear = 2010;
    const years = [];
    for (let i = maxYear; i >= minYear; i--) {
      years.push(i);
    }
    return years;
  }, [formik.values.settlement_year]);
  const Step1 = useMemo(() => {
    return (
      <div>
        <a
          style={{ textDecoration: "none" }}
          href={
            process.env.REACT_APP_UPLOAD_IMAGE_URL +
            "/DanhSachNguoiLaoDongQT2.xlsx"
          }
          download={"Mau-danh-sach"}
        >
          <Button
            variant="contained"
            component="span"
            className={classes.formExcelBtn}
          >
            Tài liệu mẫu
          </Button>
        </a>
        <input
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={(e) => handleImport(e)}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span">
            Import tài liệu
          </Button>
        </label>
        <TableContainer className={classes.LaborsTable}>
          <Table aria-label={"caption table"}>
            <TableBody>
              <TableRow>
                <TableCell className={classes.headerList} style={{ width: 50 }}>
                  STT
                </TableCell>
                <TableCell className={classes.headerList}>Họ và tên</TableCell>
                <TableCell className={classes.headerList}>
                  Số GCN đóng góp Quỹ
                </TableCell>
                <TableCell className={classes.headerList}>
                  Số hộ chiếu (hoặc CMND)
                </TableCell>
                <TableCell
                  style={{ width: "20%" }}
                  className={classes.headerList}
                >
                  Thị trường
                </TableCell>
                <TableCell
                  style={{ width: "15%" }}
                  style={{ width: "15%" }}
                  className={classes.headerList}
                >
                  Ngày xuất cảnh dự kiến
                </TableCell>
                <TableCell
                  style={{ width: 50, border: " 1px solid black" }}
                  title={"Thêm người lao động"}
                >
                  <IconButton onClick={addLabor}>
                    <ControlPointIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
              {labors.map((row, index) => (
                <TableRow>
                  <TableCell className={classes.TableRow}>
                    {index + 1}
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    <TextField
                      error={
                        row.name === "" ||
                        api?.error?.["labors." + index + ".name"]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      value={row.name}
                      onChange={(e) => ChangeName(e.target.value, index)}
                      fullWidth={true}
                      placeholder={"Nguyễn Văn A"}
                      helperText={api?.error?.["labors." + index + ".name"]}
                    />
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    <TextField
                      error={
                        row.certificate_code === "" ||
                        api?.error?.["labors." + index + ".certificate_code"]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      value={row.certificate_code}
                      onChange={(e) =>
                        handleChangeLabor(
                          "certificate_code",
                          e.target.value,
                          index
                        )
                      }
                      fullWidth={true}
                      // placeholder={"013260090"}
                      helperText={
                        api?.error?.["labors." + index + ".certificate_code"]
                      }
                    />
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    <TextField
                      error={
                        row.code === "" ||
                        api?.error?.["labors." + index + ".code"]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      value={row.code}
                      onChange={(e) => ChangeCode(e.target.value, index)}
                      fullWidth={true}
                      // placeholder={"013260090"}
                      helperText={api?.error?.["labors." + index + ".code"]}
                    />
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    <Autocomplete
                      size={"medium"}
                      helperText={api?.error?.["labors." + index + ".code"]}
                      includeInputInList={true}
                      openOnFocus={true}
                      loading={countriesLoading}
                      loadingText="Đang tải..."
                      noOptionsText="Không tìm thấy"
                      value={row?.country}
                      options={countries?.data}
                      getOptionLabel={(option) => option?.name}
                      renderOption={(option, state) => {
                        return <div style={{ padding: 5 }}>{option?.name}</div>;
                      }}
                      onChange={(event, value, reason) => {
                        handleChangeCountry(value, index);
                      }}
                      inputValue={row?.country_name}
                      selectOnFocus={true}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant={"outlined"}
                          onChange={(event) =>
                            handleChangeCountryName(event.target.value, index)
                          }
                          value={row?.country_name}
                          error={
                            !row.country ||
                            api?.error?.["labors." + index + ".country"]
                              ? true
                              : false
                          }
                          helperText={
                            api?.error?.["labors." + index + ".country"]
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <React.Fragment>
                                {countriesLoading ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    <DatePick
                      value={row?.expected_exit_date || null}
                      handleChange={(e) =>
                        handleChangeExpectedExitDate(e, index)
                      }
                      inputVariant="outlined"
                      error={!row?.expected_exit_date}
                      helperText={
                        api?.error?.["labors." + index + ".expected_exit_date"]
                      }
                    />
                  </TableCell>
                  <TableCell align="center" className={classes.TableRow}>
                    <DeleteForeverIcon onClick={(e) => DeleteLabor(e, index)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }, [labors, api.error, countries]);

  const Step2 = useMemo(() => {
    return (
      <div className={api.loading ? classes.loading : null}>
        <ButtonGroup
          variant="contained"
          style={{ float: "right", marginBottom: 10 }}
        >
          <Button
            style={{ backgroundColor: "#24BA00", color: "#fff" }}
            onClick={() => sendSettlement()}
            endIcon={<SendIcon />}
          >
            Gửi quyết toán
          </Button>
          <Button
            color={"primary"}
            endIcon={<SaveIcon />}
            onClick={saveSettlement}
          >
            Lưu quyết toán
          </Button>
        </ButtonGroup>
        <TableContainer component={Card} style={{ backgroundColor: "#f3f3f3" }}>
          <Table aria-label={"caption table"}>
            <TableBody>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
                  Kỳ quyết toán
                </TableCell>
                <TableCell>
                  <FormControl style={{ width: "50%", paddingRight: 10 }}>
                    <InputLabel id="demo-controlled-open-select-label">
                      Chọn quý
                    </InputLabel>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "settlement_period",
                          e.target.value
                        )
                      }
                      value={formik.values?.settlement_period}
                    >
                      <MenuItem value={""}>Chọn quý</MenuItem>
                      <MenuItem value={1}>Quý 1</MenuItem>
                      <MenuItem value={2}>Quý 2</MenuItem>
                      <MenuItem value={3}>Quý 3</MenuItem>
                      <MenuItem value={4}>Quý 4</MenuItem>
                    </Select>
                    <FormHelperText
                      error={api.error?.settlement_period ? true : false}
                    >
                      {api.error?.settlement_period}
                    </FormHelperText>
                  </FormControl>
                  <FormControl style={{ width: "50%", paddingLeft: 10 }}>
                    <InputLabel id="demo-controlled-open-select-label">
                      Chọn năm
                    </InputLabel>
                    <Select
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      onChange={(e) =>
                        formik.setFieldValue("settlement_year", e.target.value)
                      }
                      value={formik.values?.settlement_year}
                    >
                      <MenuItem value={""}>Chọn năm</MenuItem>
                      {ListYear.map((e) => (
                        <MenuItem key={e} value={e}>
                          {e}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText
                      error={api.error?.settlement_year ? true : false}
                    >
                      {api.error?.settlement_year}
                    </FormHelperText>
                  </FormControl>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
                  Ngày quyết toán kỳ trước
                </TableCell>
                <TableCell>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    {Moment(new Date()).format("DD-MM-YYYY")}
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
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
                    {Moment(new Date()).format("DD-MM-YYYY")}
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
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
                    <span style={{ padding: 3 }}>
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
                  Doanh thu theo thị trường
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan="2" style={{ padding: 0 }}>
                  <Paper>
                    <TableContainer>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              style={{
                                fontSize: 18,
                                border: "1px solid #e0e0e0",
                                width: "40%",
                              }}
                            >
                              Thị trường
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: 18,
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              Số lao động
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: 18,
                                border: "1px solid #e0e0e0",
                              }}
                            >
                              Đóng góp quỹ
                            </TableCell>
                          </TableRow>
                          {IncomeCountry.map((e, index) => (
                            <TableRow>
                              <TableCell
                                style={{ border: "1px solid #e0e0e0" }}
                              >
                                {e?.country_name}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "right",
                                  border: "1px solid #e0e0e0",
                                }}
                              >
                                {e?.count}
                              </TableCell>
                              <TableCell className={classes.count} style={{}}>
                                <span style={{}}>
                                  <NumberFormat
                                    value={e?.count * 100000}
                                    displayType={"text"}
                                    thousandSeparator={true}
                                  />
                                </span>
                                <span style={{ float: "right", fontSize: 13 }}>
                                  đ
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
                  Số tiền phải nộp quỹ trong tháng
                </TableCell>
                <TableCell>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ padding: 3 }}>
                      <NumberFormat
                        value={labors.length * 100000}
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
                    border: "1px solid #e0e0e0",
                    width: "40%",
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
                    <span style={{ color: "red", padding: 3 }}>
                      <NumberFormat
                        value={labors.length * 100000}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </span>
                    <span
                      style={{ float: "right", color: "red", fontSize: 13 }}
                    >
                      đ
                    </span>
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
                  Số tiền đã nộp
                </TableCell>
                <TableCell>
                  {admin?.user_type === 1 ? (
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      <span style={{ textAlign: "right" }}>
                        <NumberFormat
                          style={{ textAlign: "right" }}
                          value={""}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </span>
                      <span
                        style={{
                          textAlign: "right",
                          float: "right",
                          fontSize: 13,
                        }}
                      >
                        đ
                      </span>
                    </p>
                  ) : (
                    <TextField
                      className={classes.input1}
                      Style={{ textAlign: "right" }}
                      value={formik.values?.total_paid_amount}
                      // type={"number"}
                      onChange={(e) => {
                        formik.setFieldValue(
                          "total_paid_amount",
                          e.target.value
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
                    <p
                      style={{
                        textAlign: "right",
                        fontSize: 12,
                        color: "#FF2700",
                      }}
                    >
                      {""}
                    </p>
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "red",
                    border: "1px solid #e0e0e0",
                    width: "40%",
                  }}
                >
                  Số tiền nợ chuyển tháng sau
                </TableCell>
                <TableCell>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: "red", padding: 3 }}>
                      <NumberFormat
                        value={
                          labors.length * 100000 +
                          formik.values?.previous_debt -
                          formik.values?.total_paid_amount
                        }
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </span>
                    <span
                      style={{ float: "right", color: "red", fontSize: 13 }}
                    >
                      đ
                    </span>
                  </p>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{ marginTop: 10 }}>
          <b>Tài liệu</b>
          <UploadFile
            data={dataForm}
            error={api?.error?.files}
            oldFiles={oldFiles}
            setOldFiles={setOldFiles}
            newFiles={newFiles}
            setNewFiles={setNewFiles}
            multiple={true}
            handleDelete={handleDelete}
            readOnly={dataForm.data?.status > 1 ? true : false}
          />
        </div>
      </div>
    );
  }, [labors, formik, oldFiles, newFiles]);
  return (
    <Card className="settlement-form-layout">
      <ButtonGroup
        style={{ paddingTop: 20, paddingBottom: 20, marginBottom: 10 }}
      >
        {activeStep === 1 && (
          <Button variant="contained" onClick={handleBack}>
            Quay lại
          </Button>
        )}
        {activeStep === 0 && (
          <Button variant="contained" color="primary" onClick={handleNext}>
            Tiếp theo
          </Button>
        )}
      </ButtonGroup>
      <div>
        <div>
          <Stepper
            style={{ justifyContent: "center" }}
            connector={<StepConnector style={{ maxWidth: 200 }} />}
            activeStep={activeStep}
          >
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel className={classes.steplabel} {...labelProps}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </div>
      </div>
      {activeStep === 0 && Step1}
      {activeStep === 1 && Step2}
    </Card>
  );
}

const useStyle = makeStyles((theme) => ({
  LaborsTable: {
    marginTop: 20,
    "& td": {
      verticalAlign: "top",
    },
  },
  headerList: {
    fontSize: "1rem",
    border: " 1px solid black",
    fontWeight: "bold",
  },
  count: {
    border: "1px solid #e0e0e0",
    textAlign: "right",
    "& span ": {
      padding: 1,
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
  TableRow: {
    fontSize: "1rem",
    fontWeight: 400,
    border: " 1px solid black",
  },
  steplabel: {
    "& span": {
      fontSize: "1rem",
    },
  },
  input1: {
    "& input": {
      padding: 4,
      textAlign: "right",
    },
    "& p": {
      fontSize: 13,
      marginBottom: 8,
    },
  },
  loading: loadingStyle,
}));
