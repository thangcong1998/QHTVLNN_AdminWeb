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
import { AuthContext } from "../../../../common/AuthProvider";
import ClearIcon from "@material-ui/icons/Clear";
import { useAPI, useFetch } from "../../../../api/api";
import { useFormik } from "formik";
import { Skeleton } from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import UploadFile from "../../../../components/Admin/form/UploadFile";
import ReplayIcon from "@material-ui/icons/Replay";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "../../../../components/Admin/form/Autocomplete";
import SendIcon from "@material-ui/icons/Send";
import SaveIcon from "@material-ui/icons/Save";
import DoneIcon from "@material-ui/icons/Done";
import Moment from "moment";
import * as XLSX from "xlsx";
import * as Yup from "yup";
import DatePick from "../../../../components/Admin/form/Date";
import ChangeStatusDocument from "./ChangeStatusDocumentSupport";
import { useDialog } from "../../../../components/Dialog";
import loading from "../../../../assets/image/25.gif";
import { loadingStyle } from "../../../../common/constants";

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
  const [documentSupport, setDocumentSupport] = useState([]);
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    params.id ? "get" : null,
    "/admin/documentSupport/" + params.id,
  ]);
  const [readOnly, setReadOnly] = useState(true);
  const formik = useFormik({
    initialValues: {
      period: "",
      year: Moment(new Date()).format("YYYY"),
    },
  });
  useEffect(() => {
    if (data) {
      if (data?.document_support) {
        setDocumentSupport(
          data?.document_support?.map((e) => {
            return {
              ...e,
              readOnly: true,
            };
          })
        );
        formik.setFieldValue("period", data?.period);
        formik.setFieldValue(
          "year",
          !data?.year ? Moment(new Date()).format("YYYY") : data?.year
        );
        formik.setFieldValue(
          "agreement_comment",
          documentSupport.agreement_comment
        );
        setOldFiles(data?.files);
      }
      formik.setFieldValue("status", data.status);
    }
  }, [data]);
  const [tempRow, setTempRow] = useState({
    document_name: "",
    beginning_period_remain_total: "",
    beginning_period_received_total: "",
    during_period_received_total: "",
    request_next_period_total: "",
    readOnly: true,
  });
  const addDocSup = () => {
    let temp = [...documentSupport];
    temp.push(tempRow);
    setDocumentSupport(temp);
  };
  const ChangeDocumentName = (value, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].document_name = value;
    setDocumentSupport(temp);
  };
  const ChangeBeginningPeriodRemain = (value, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].beginning_period_remain_total = value;
    setDocumentSupport(temp);
  };
  const ChangeBeginningPeriodReceived = (value, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].beginning_period_received_total = value;
    setDocumentSupport(temp);
  };
  const ChangeDuringPeriod = (value, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].during_period_received_total = value;
    setDocumentSupport(temp);
  };
  const ChangeRequestNextPeriod = (value, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].request_next_period_total = value;
    setDocumentSupport(temp);
  };
  const ReadOnlyRow = (e, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].readOnly = true;
    setDocumentSupport(temp);
  };
  const DeleteRow = (e, row) => {
    let temp = [...documentSupport];
    temp.splice(row, 1);
    setDocumentSupport(temp);
  };
  const EditRow = (e, row) => {
    let temp = [...documentSupport];
    temp[row] = { ...documentSupport[row] };
    temp[row].readOnly = false;
    setDocumentSupport(temp);
  };
  const UpdateRequest = async (status) => {
    try {
      let formData = new FormData();
      formData.append("status", status);
      formData.append(
        "company_id",
        admin?.company?.id
          ? admin?.company?.id
          : ""
      );
      formData.append("user_type", admin?.user_type);
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
      formData.append("documentSupport", JSON.stringify(documentSupport));
      if (documentSupport.length == 0) {
        toast.error("Danh sách hỗ trợ tài liệu chưa có dữ liệu", {
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
          ? "/admin/documentSupport/" + params?.id
          : "/admin/documentSupport",
        formData
      );
      if (res) {
        history.push("/quanly/documentSupport");
      }
      handleClose();
      refetch();
    } catch (e) {}
  };
  const sendDocumentSupport = async (status) => {
    try {
      let formData = new FormData();
      formData.append("status", status);
      formData.append("type", 1);
      formData.append(
        "company_id",
        admin?.company?.id  ? admin?.company?.id : ""
      );
      formData.append(
        "labor_department_id",
        admin?.labor_department_id ? admin?.labor_department_id : ""
      );
      formData.append("user_type", admin?.user_type);
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

      // params.id && formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append("documentSupport", JSON.stringify(documentSupport));
      if (documentSupport.length == 0) {
        toast.error("Danh sách hỗ trợ tài liệu chưa có dữ liệu", {
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
          ? "/admin/documentSupport/" + params.id
          : "/admin/documentSupport",
        formData
      );
      if (res) {
        history.push("/quanly/documentSupport");
      }
      handleClose();
    } catch (e) {}
  };
  const deleteRequest = async () => {
    try {
      const res = await api.fetcher(
        "delete",
        "admin/documentSupport/" + params?.id,
        { action: "delete" }
      );
      if (res) {
        history.push("/quanly/documentSupport");
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
            variant="contained"
            color="primary"
            onClick={() => UpdateRequest(status)}
          >
            Xác nhận
          </Button>
        ) : (
          <ChangeStatusDocument
            type={user?.user_type}
            handleClose={handleClose}
            status={status}
            id={params?.id}
            refetch={refetch}
          />
        )
      ) : (
        <Button
          handleClose={handleClose}
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
        setDocumentSupport(
          data
            .filter((z, index) => index > 0)
            .map((e, index) => ({
              document_name: e[0],
              beginning_period_remain_total: e[1],
              beginning_period_received_total: e[2],
              during_period_received_total: e[3],
              request_next_period_total: e[4],
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
  }, [formik.values.settlement_year]);

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
                href={process.env.REACT_APP_UPLOAD_IMAGE_URL + "/DanhSach.xlsx"}
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
  const Step3 = (
    <div style={{ padding: 10 }}>
      <FormControl style={{ width: "15%", paddingRight: 10 }}>
        <InputLabel id="demo-controlled-open-select-label">Quý</InputLabel>
        <Select
          labelId="demo-simple-select-placeholder-label-label"
          id="demo-simple-select-placeholder-label"
          onChange={(e) => formik.setFieldValue("period", e.target.value)}
          value={parseInt(formik.values?.period)}
          readOnly={data?.status > 1 ? true : false}
        >
          <MenuItem value={""}>Quý</MenuItem>
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
          readOnly={data?.status > 1 ? true : false}
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
                Loại tài liệu
              </TableCell>
              <TableCell className={classes.headerList}>
                Số tồn đầu kỳ{" "}
              </TableCell>
              <TableCell className={classes.headerList}>
                Số nhận trong kỳ{" "}
              </TableCell>
              <TableCell className={classes.headerList}>
                Số đề nghị cấp cho kỳ sau
              </TableCell>
              <TableCell
                style={{ width: "15%" }}
                style={{ width: "15%" }}
                className={classes.headerList}
              >
                Số đã cấp cho người lao động trong kỳ{" "}
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
            {documentSupport.map((row, index) => (
              <TableRow>
                <TableCell className={classes.tableCell}>{index + 1}</TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.document_name === "" ||
                        api?.error?.[
                          "documentSupport." + index + ".document_name"
                        ]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      value={row?.document_name}
                      onChange={(e) =>
                        ChangeDocumentName(e.target.value, index)
                      }
                      fullWidth={true}
                      placeholder={"Sách ngoại ngữ..."}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>{row?.document_name}</p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.name &&
                      api?.error?.[
                        "documentSupport." + index + ".document_name"
                      ]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.beginning_period_remain_total === "" ||
                        api?.error?.[
                          "documentSupport." +
                            index +
                            ".beginning_period_remain_total"
                        ]
                          ? true
                          : false
                      }
                      type={"number"}
                      variant={"outlined"}
                      display="true"
                      value={row.beginning_period_remain_total}
                      onChange={(e) =>
                        ChangeBeginningPeriodRemain(e.target.value, index)
                      }
                      fullWidth={true}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>
                      {row?.beginning_period_remain_total}
                    </p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.name &&
                      api?.error?.[
                        "documentSupport." +
                          index +
                          ".beginning_period_remain_total"
                      ]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.beginning_period_received_total === "" ||
                        api?.error?.[
                          "documentSupport." +
                            index +
                            ".beginning_period_received_total"
                        ]
                          ? true
                          : false
                      }
                      type={"number"}
                      variant={"outlined"}
                      display="true"
                      value={row.beginning_period_received_total}
                      onChange={(e) =>
                        ChangeBeginningPeriodReceived(e.target.value, index)
                      }
                      fullWidth={true}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>
                      {row?.beginning_period_received_total}
                    </p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.name &&
                      api?.error?.[
                        "documentSupport." +
                          index +
                          ".beginning_period_received_total"
                      ]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.during_period_received_total === "" ||
                        api?.error?.[
                          "documentSupport." +
                            index +
                            ".during_period_received_total"
                        ]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      type={"number"}
                      display="true"
                      value={row.during_period_received_total}
                      onChange={(e) =>
                        ChangeDuringPeriod(e.target.value, index)
                      }
                      fullWidth={true}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>
                      {row?.during_period_received_total}
                    </p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.name &&
                      api?.error?.[
                        "documentSupport." +
                          index +
                          ".during_period_received_total"
                      ]}
                  </p>
                </TableCell>
                <TableCell className={classes.tableCell}>
                  {row.readOnly === false ? (
                    <TextField
                      error={
                        row.request_next_period_total === "" ||
                        api?.error?.[
                          "documentSupport." +
                            index +
                            ".request_next_period_total"
                        ]
                          ? true
                          : false
                      }
                      variant={"outlined"}
                      display="true"
                      type={"number"}
                      value={row.request_next_period_total}
                      onChange={(e) =>
                        ChangeRequestNextPeriod(e.target.value, index)
                      }
                      fullWidth={true}
                    />
                  ) : (
                    <p style={{ color: "#000" }}>
                      {row?.request_next_period_total}
                    </p>
                  )}
                  <p style={{ color: "red", fontSize: 12 }}>
                    {!row.name &&
                      api?.error?.[
                        "documentSupport." +
                          index +
                          ".request_next_period_total"
                      ]}
                  </p>
                </TableCell>
                {(data?.status == 1 || !data?.status) && (
                  <TableCell align="center" className={classes.headerList}>
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
          readOnly={data?.status > 1 ? true : false}
        />
      </div>
    </div>
  );

  return (
    <Card className="settlement-form-layout">
      <div className={api.loading ? classes.loading : null}>
        {Step1} {Step3} {Step2}
      </div>
    </Card>
  );
}

const useStyle = makeStyles((theme) => ({
  LaborsTable: {
    "& td": {
      verticalAlign: "top",
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
  loading: loadingStyle,
}));
