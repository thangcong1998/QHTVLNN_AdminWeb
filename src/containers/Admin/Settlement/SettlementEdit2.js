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
  Tabs,
  Tab,
  Paper,
  FormHelperText,
} from "@material-ui/core";
import { AuthContext } from "../../../common/AuthProvider";
import ClearIcon from "@material-ui/icons/Clear";
import { useAPI, useFetch } from "../../../api/api";
import { useFormik } from "formik";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import SendIcon from "@material-ui/icons/Send";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import FindInPageIcon from "@material-ui/icons/FindInPage";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import Moment from "moment";
import * as XLSX from "xlsx";
import DatePick from "../../../components/Admin/form/Date";
import UploadFile from "../../../components/Admin/form/UploadFile";
import { useDialog } from "../../../components/Dialog";
import ChangeStatus from "./ChangeStatusDialog";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";

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
export default function SettlementEdit2(props) {
  const { dataForm, refetch } = props;
  const classes = useStyle();
  const api = useAPI();
  const history = useHistory();
  const { dialog, handleClose } = useDialog();
  const { admin } = useContext(AuthContext);
  const [tab, setTab] = useState(0);
  const [labors, setLabors] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const { data: countries, loading: countriesLoading } = useFetch([
    "get",
    "/admin/countries?per_page=500",
  ]);
  useEffect(() => {
    if (countries) {
      formik.setFieldValue("previous_debt", dataForm?.previous_debt);
      formik.setFieldValue("total_paid_amount", dataForm?.total_paid_amount);
      formik.setFieldValue("settlement_period", dataForm?.settlement_period);
      formik.setFieldValue("settlement_year", dataForm?.settlement_year);
      setLabors(
        dataForm?.settlement_labor?.map((e) => ({
          name: e.labor.name,
          certificate_code: e.certificate_code,
          code: e.labor?.id_code ? e.labor?.id_code : e.labor?.passport_code,
          country: e.country,
          country_name: e.country.name,
          expected_exit_date: e.expected_exit_date,
        }))
      );
      setOldFiles(dataForm?.files);
    }
  }, [countries]);
  const formik = useFormik({
    initialValues: {},
  });

  function handleChangeTab(event, value) {
    setTab(value);
  }

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

  const hanleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.name != file.name));
    }
  };

  const saveSettlement = async (status) => {
    try {
      let formData = new FormData();
      let _labors = labors.map((e) => ({ ...e, country: e?.country?.id }));
      formData.append("labors", JSON.stringify(_labors));
      formData.append("type", 2);
      formData.append("status", status);
      formData.append("settlement_period", formik.values?.settlement_period);
      formData.append("settlement_year", formik.values?.settlement_year);
      formData.append(
        "registration_date",
        Moment(new Date()).format("YYYY-MM-DD")
      );
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
      formData.append("_method", "put");
      let res = await api.fetcher(
        "post",
        "admin/settlement/" + dataForm.id,
        formData
      );
      refetch();
      if (res) {
        history.push("/quanly/settlement");
      }
    } catch (e) {}
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

        setLabors(
          data
            .filter((z, index) => index > 0)
            .map((e, index) => ({
              name: e[0],
              certificate_code: e[1],
              code: e[2],
              country_name: e[3],
              country: countries?.data.find((x) => x.name == e[3]),
              expected_exit_date:
                e[4] &&
                typeof e[4] === "string" &&
                e[4]?.split("/").reverse().join("/"),
            }))
        );
      };
      reader.readAsBinaryString(f);
    }
  };

  const exportLabors = async () => {
    try {
      let res = await api.fetcher(
        "post",
        "/admin/exportSettlement/" + dataForm.id,
        {
          export_type: "labors",
        },
        {
          responseType: "blob",
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "danh-sach-nguoi-lao-dong.xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };

  const exportReportLabors = async () => {
    try {
      let res = await api.fetcher(
        "post",
        "/admin/exportSettlement/" + dataForm.id,
        {
          export_type: "report_labors",
          labors: IncomeCountry,
        },
        {
          responseType: "blob",
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "danh-sach-nguoi-lao-dong.xlsx");
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };
  const deleteRequest = async () => {
    try {
      const res = await api.fetcher(
        "delete",
        "admin/settlement/" + dataForm?.id,
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
        "/admin/exportSettlement/" + dataForm.id,
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
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {dataForm?.status == 1 && (
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
            </div>
          )}
          <Button
            variant="contained"
            component="span"
            className={classes.formExcelBtn}
            endIcon={<CloudDownloadIcon />}
            onClick={() => exportLabors()}
          >
            Xuất người lao động
          </Button>
        </div>

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
                {admin?.user_type !== 1 && dataForm.status === 1 && (
                  <TableCell
                    style={{ width: 50 }}
                    className={classes.headerList}
                    title={"Thêm người lao động"}
                  >
                    <IconButton onClick={addLabor}>
                      <ControlPointIcon />
                    </IconButton>
                  </TableCell>
                )}
              </TableRow>
              {labors.map((row, index) => (
                <TableRow >
                  <TableCell className={classes.TableRow}>{index + 1}</TableCell>
                  <TableCell className={classes.TableRow}>
                    {(admin?.user_type == 1 || dataForm?.status > 1) && (
                      <span>{row.name}</span>
                    )}
                    {admin?.user_type != 1 && dataForm?.status == 1 && (
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
                    )}
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    {(admin?.user_type == 1 || dataForm?.status > 1) == 1 && (
                      <span>{row.certificate_code}</span>
                    )}
                    {admin?.user_type != 1 && dataForm?.status == 1 && (
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
                    )}
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    {(admin?.user_type == 1 || dataForm?.status > 1) && (
                      <span>{row.code}</span>
                    )}
                    {admin?.user_type != 1 && dataForm?.status == 1 && (
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
                    )}
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    {(admin?.user_type == 1 || dataForm?.status > 1) && (
                      <span>{row.country_name}</span>
                    )}
                    {admin?.user_type != 1 && dataForm?.status == 1 && (
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
                          return (
                            <div style={{ padding: 5 }}>{option?.name}</div>
                          );
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
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                          />
                        )}
                      />
                    )}
                  </TableCell>
                  <TableCell className={classes.TableRow}>
                    {(admin?.user_type == 1 || dataForm?.status > 1) && (
                      <span>
                        {Moment(row.expected_exit_date).format("DD/MM/YYYY")}
                      </span>
                    )}
                    {admin?.user_type != 1 && dataForm?.status == 1 && (
                      <DatePick
                        value={row?.expected_exit_date || null}
                        handleChange={(e) =>
                          handleChangeExpectedExitDate(e, index)
                        }
                        inputVariant="outlined"
                        error={!row?.expected_exit_date}
                        helperText={
                          api?.error?.[
                            "labors." + index + ".expected_exit_date"
                          ]
                        }
                      />
                    )}
                  </TableCell>
                  {admin?.user_type != 1 && dataForm?.status == 1 && (
                    <TableCell align="center" className={classes.TableRow}>
                      <DeleteForeverIcon
                        onClick={(e) => DeleteLabor(e, index)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }, [labors, api.error, countries, admin, dataForm]);
  const Step2 = useMemo(() => {
    return (
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <ButtonGroup variant="contained">
            <Button
              color={"primary"}
              endIcon={<CloudDownloadIcon />}
              onClick={() => ExportExcel()}
              variant={"contained"}
            >
              Xuất quyết toán
            </Button>
            <Button
              color={"primary"}
              endIcon={<CloudDownloadIcon />}
              onClick={() => exportReportLabors()}
              variant={"contained"}
            >
              Xuất báo cáo người LĐ
            </Button>
          </ButtonGroup>

          <ButtonGroup variant="contained" style={{ float: "right" }}>
            {(dataForm?.status == 1 || dataForm?.status === undefined) &&
              admin?.user_type !== 1 && (
                <Button
                  style={{ backgroundColor: "#24BA00", color: "#fff" }}
                  endIcon={<SendIcon />}
                  onClick={() => comfirmChangeStatus(2)}
                >
                  Gửi quyết toán
                </Button>
              )}
            {(dataForm?.status == 1 || dataForm?.status === undefined) &&
              admin?.user_type !== 1 && (
                <Button
                  color={"primary"}
                  endIcon={<SaveIcon />}
                  onClick={() => saveSettlement(1)}
                >
                  Lưu quyết toán
                </Button>
              )}
            {/* {dataForm?.status === 1 && admin?.user_type !== 1 && (
                        <Button
                            color={'primary'}
                            endIcon={<EditIcon />}
                        >Sửa quyết toán</Button>
                    )} */}
            {dataForm?.status === 2 && admin?.user_type === 1 && (
              <Button
                style={{ backgroundColor: "#24BA00", color: "#fff" }}
                endIcon={<FindInPageIcon />}
                onClick={() => comfirmChangeStatus(3)}
              >
                Thẩm định quyết toán
              </Button>
            )}
            {dataForm?.status > 1 &&
              dataForm?.status < 4 &&
              admin?.user_type === 1 && (
                <Button
                  color="primary"
                  endIcon={<AssignmentTurnedInIcon />}
                  onClick={() => comfirmChangeStatus(4)}
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
        </div>
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
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  <FormControl style={{ width: "50%", paddingRight: 10 }}>
                    <InputLabel id="demo-controlled-open-select-label">
                      Chọn quý
                    </InputLabel>
                    <Select
                      readOnly={dataForm?.status > 1 || admin?.user_type == 1}
                      labelId="demo-controlled-open-select-label"
                      id="demo-controlled-open-select"
                      onChange={(e) =>
                        formik.setFieldValue(
                          "settlement_period",
                          e.target.value
                        )
                      }
                      value={formik.values?.settlement_period}
                      defaultValue={formik?.values?.settlement_period}
                    >
                      <MenuItem value={""}>Chọn quý</MenuItem>
                      <MenuItem value={1}>Quý 1</MenuItem>
                      <MenuItem value={2}>Quý 2</MenuItem>
                      <MenuItem value={3}>Quý 3</MenuItem>
                      <MenuItem value={4}>Quý 4</MenuItem>
                    </Select>
                    <FormHelperText
                      error={api.error?.settlement_month ? true : false}
                    >
                      {api.error?.settlement_month}
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
                  style={{ fontSize: 18, border: "1px solid #e0e0e0" }}
                >
                  Ngày quyết toán kỳ trước
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {Moment(new Date()).format("DD-MM-YYYY")}
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ fontSize: 18, border: "1px solid #e0e0e0" }}
                >
                  Ngày quyết toán kỳ này
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {Moment(new Date()).format("DD-MM-YYYY")}
                  </p>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ fontSize: 18, border: "1px solid #e0e0e0" }}
                >
                  Dư nợ kỳ trước chuyển sang
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
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
                                textAlign: "right",
                              }}
                            >
                              Số lao động
                            </TableCell>
                            <TableCell
                              style={{
                                fontSize: 18,
                                border: "1px solid #e0e0e0",
                                textAlign: "right",
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
                                  border: "1px solid #e0e0e0",
                                  textAlign: "right",
                                }}
                              >
                                {e?.count}
                              </TableCell>
                              <TableCell
                                style={{
                                  border: "1px solid #e0e0e0",
                                  textAlign: "right",
                                }}
                              >
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
                  style={{ fontSize: 18, border: "1px solid #e0e0e0" }}
                >
                  Số tiền phải nộp quỹ trong tháng
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{}}>
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
                  }}
                >
                  Tổng số tiền phải nộp
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: "red" }}>
                      <NumberFormat
                        value={
                          labors.length * 100000 + formik?.values?.previous_debt
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
              <TableRow>
                <TableCell
                  style={{ fontSize: 18, border: "1px solid #e0e0e0" }}
                >
                  Số tiền đã nộp
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  {admin?.user_type === 1 || dataForm?.status > 1 ? (
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "right",
                      }}
                    >
                      <span style={{ float: "left" }}>
                        <NumberFormat
                          value={formik.values?.total_paid_amount}
                          displayType={"text"}
                          thousandSeparator={true}
                        />
                      </span>
                      <span style={{ float: "right" }}>đ</span>
                    </p>
                  ) : (
                    <TextField
                      className={classes.input1}
                      value={formik.values?.total_paid_amount}
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
                    <p style={{ fontSize: 12, color: "#FF2700" }}>
                      {api.error?.total_paid_amount}
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
                  }}
                >
                  Số tiền nợ chuyển tháng sau
                </TableCell>
                <TableCell style={{ border: "1px solid #e0e0e0" }}>
                  <p
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <span style={{ color: "red" }}>
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
              {dataForm?.status > 2 && dataForm?.agreement_comment && (
                <TableRow>
                  <TableCell
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    Ý kiến của cán bộ thẩm định
                  </TableCell>
                  <TableCell style={{ border: "1px solid #e0e0e0" }}>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      <span>{dataForm?.agreement_comment}</span>
                    </p>
                  </TableCell>
                </TableRow>
              )}
              {dataForm?.status > 3 && dataForm?.approval_comment && (
                <TableRow>
                  <TableCell
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      border: "1px solid #e0e0e0",
                    }}
                  >
                    Ý kiến của cán bộ phê duyệt
                  </TableCell>
                  <TableCell style={{ border: "1px solid #e0e0e0" }}>
                    <p
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      <span>{dataForm?.agreement_comment}</span>
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {(dataForm.data?.status < 2 || dataForm.data?.files?.length !== 0) && (
          <div style={{ width: "100%", margin: "20px 0px" }}>
            <b>Tài liệu</b>
            <UploadFile
              data={dataForm?.files}
              errors={api.error?.files}
              oldFiles={oldFiles}
              setOldFiles={setOldFiles}
              newFiles={newFiles}
              setNewFiles={setNewFiles}
              multiple={true}
              handleDelete={hanleDelete}
              readOnly={dataForm.data?.status > 1 ? true : false}
            />
          </div>
        )}
      </div>
    );
  }, [labors, formik, api.error, countries, oldFiles, newFiles]);
  return (
    <Card className="settlement-form-layout">
      <Tabs className={classes.tabName} value={tab} onChange={handleChangeTab}>
        <Tab label="Danh sách người lao động" value={0} />
        <Tab label="Thông tin quyết toán" value={1} />
      </Tabs>
      {tab === 0 && Step1}
      {tab === 1 && Step2}
    </Card>
  );
}

const useStyle = makeStyles((theme) => ({
  LaborsTable: {
      marginTop:20,
    "& td": {
      verticalAlign: "top",
    },
  },
  TableRow:{
    fontSize: "1rem",
    fontWeight: 400,
    border: " 1px solid black",

  },
  headerList: {
    fontSize: "1rem",
    border: " 1px solid black",
    fontWeight: "bold",
  },
  tabName: {
    marginBottom: 10,
  },
  input: {
    display: "none",
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
  formExcelBtn: {
    backgroundColor: "#24ba00",
    color: "#FFF",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#219106",
    },
  },
}));
