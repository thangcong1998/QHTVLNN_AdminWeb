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
    Select,
    MenuItem,
    FormHelperText,
} from "@material-ui/core";
import { AuthContext } from "../../../common/AuthProvider";
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
import PropTypes from "prop-types";
import FindInPageIcon from '@material-ui/icons/FindInPage';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ClearIcon from '@material-ui/icons/Clear';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { useAPI, useFetch } from "../../../api/api";
import { useFormik } from "formik";
import {
    DatePicker
} from "@material-ui/pickers";
import NumberFormat from "react-number-format";
import Moment from 'moment';
import UploadFile from "../Document/UploadFile";
import { makeStyles } from "@material-ui/styles";
import loading from "../../../assets/image/25.gif";
import './settlement.css';
import {loadingStyle} from '../../../common/constants';

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
export default function SettlementsForm(props) {
    let formData = new FormData;
    const classes = useStyles();
    const newDate = new Date();
    const api = useAPI();
    const history = useHistory();
    const params = useParams();
    const { admin } = useContext(AuthContext);
    const [readOnly, setReadOnly] = useState(true);
    const [companyId, setCompanyId] = useState(null);
    const [firstTime, setFirstTime] = useState(true);
    const [numberPercent, setNumberPercent] = useState(0);
    const [oldFiles, setOldFiles] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const formik = useFormik({
        initialValues: {
            company_id: 1,
            labor_department_id: null,
            type: 1,
            registration_date: Moment(new Date()).format('YYYY-MM-DD'),
            settlement_year: Moment(new Date).year(),
        },
        onSubmit: async (values) => {
        }
    });

    const dataForm = useFetch([params.id ? 'get' : null, '/admin/settlement/' + params.id,]);
    const { data: data } = useFetch(['get', '/admin/settlementInfo']);
    useEffect(() => {
        if (data) {
            if (data.user?.user_type === 1) {
                if (params.id === undefined) {
                    history.push('/quanly');
                }
                else {
                    setReadOnly(true);
                }
            }
            if (data.user?.user_type === 2) {
                data.company?.income_settlement_debt === undefined ?
                    formik.setFieldValue('previous_debt', 0) :
                    formik.setFieldValue('previous_debt', data.company?.income_settlement_debt);
                setCompanyId(data.company?.id);
                setReadOnly(false);
                formik.setFieldValue('company_id', data?.company_id);
                if (newDate.getMonth() > 0 && newDate.getMonth() < 4) {
                    formik.setFieldValue('settlement_period', '4');
                }
                if (newDate.getMonth() > 3 && newDate.getMonth() < 7) {
                    formik.setFieldValue('settlement_period', '1');
                }
                if (newDate.getMonth() > 6 && newDate.getMonth() < 10) {
                    formik.setFieldValue('settlement_period', '2');
                }
                if (newDate.getMonth() > 9 && newDate.getMonth() < 13) {
                    formik.setFieldValue('settlement_period', '3');
                }
            }
            if (data.user?.user_type === 3) {
                data.labor_department?.income_settlement_debt === undefined ?
                    formik.setFieldValue('previous_debt', 0) :
                    formik.setFieldValue('previous_debt', data.labor_department?.income_settlement_debt);
                setCompanyId(data.company?.id);
                setReadOnly(false);
                formik.setFieldValue('labor_department_id', data?.labor_department_id);
                if (newDate.getMonth() > 0 && newDate.getMonth() < 4) {
                    formik.setFieldValue('settlement_period', '4');
                }
                if (newDate.getMonth() > 3 && newDate.getMonth() < 7) {
                    formik.setFieldValue('settlement_period', '1');
                }
                if (newDate.getMonth() > 6 && newDate.getMonth() < 10) {
                    formik.setFieldValue('settlement_period', '2');
                }
                if (newDate.getMonth() > 9 && newDate.getMonth() < 13) {
                    formik.setFieldValue('settlement_period', '3');
                }
            }
        }
    }, [data]);

    const sendSettlement = async () => {
        try {
            formData.append('previous_debt', formik.values?.previous_debt ? formik.values?.previous_debt : 0);
            formData.append('registration_date', formik.values?.registration_date ? formik.values?.registration_date : '');
            formData.append('settlement_period', formik.values?.settlement_period ? formik.values?.settlement_period : '');
            formData.append('settlement_year', formik.values?.settlement_year ? formik.values?.settlement_year : '');
            formData.append('status', 2);
            formData.append('total_amount', formik.values?.total_amount ? formik.values?.total_amount : '');
            formData.append('total_income', formik.values?.total_income ? formik.values?.total_income : '');
            formData.append('total_paid_amount', formik.values?.total_paid_amount ? formik.values?.total_paid_amount : '');
            formData.append('total_remain_amount', formik.values?.total_remain_amount ? formik.values?.total_remain_amount : '');
            formData.append('type', formik.values?.type ? formik.values?.type : '');
            formData.append('settlement_month', 0);
            newFiles.forEach((e, index) => {
                formData.append("files[" + index + "]", e);
            });
            formData.append('_method', params.id ? 'PUT' : 'POST')
            let res = await api.fetcher(
                "POST",
                "/admin/settlement", formData
            );
            if (res) {
                history.push("/quanly/settlement");
            }
        } catch (e) {
        }
    };
    const saveSettlement = async () => {
        try {
            formData.append('previous_debt', formik.values?.previous_debt ? formik.values?.previous_debt : '');
            formData.append('registration_date', formik.values?.registration_date ? formik.values?.registration_date : '');
            formData.append('settlement_period', formik.values?.settlement_period ? formik.values?.settlement_period : '');
            formData.append('settlement_year', formik.values?.settlement_year ? formik.values?.settlement_year : '');
            formData.append('status', 1);
            formData.append('total_amount', formik.values?.total_amount == null ? '' : formik.values?.total_amount);
            formData.append('total_income', formik.values?.total_income == null ? '' : formik.values?.total_income);
            formData.append('total_paid_amount', formik.values?.total_paid_amount == null ? '' : formik.values?.total_paid_amount);
            formData.append('total_remain_amount', formik.values?.total_remain_amount == null ? '' : formik.values?.total_remain_amount);
            formData.append('type', 1);
            formData.append('settlement_month', 0);
            newFiles.forEach((e, index) => {
                formData.append("files[" + index + "]", e);
            });
            formData.append('_method', params.id ? 'PUT' : 'POST')
            let res = await api.fetcher(
                "POST",
                "/admin/settlement", formData
            );
            if (res) {
                history.push("/quanly/settlement");
            }
        } catch (e) {
        }
    };

    const sendSettlementHas = async () => {
        try {
            formData.append('previous_debt', formik.values?.previous_debt ? formik.values?.previous_debt : '');
            formData.append('registration_date', formik.values?.registration_date ? formik.values?.registration_date : '');
            formData.append('settlement_period', formik.values?.settlement_period ? formik.values?.settlement_period : '');
            formData.append('settlement_year', formik.values?.settlement_year ? formik.values?.settlement_year : '');
            formData.append('status', 2);
            formData.append('total_amount', formik.values?.total_amount == null ? '' : formik.values?.total_amount);
            formData.append('total_income', formik.values?.total_income == null ? '' : formik.values?.total_income);
            formData.append('total_paid_amount', formik.values?.total_paid_amount == null ? '' : formik.values?.total_paid_amount);
            formData.append('total_remain_amount', formik.values?.total_remain_amount == null ? '' : formik.values?.total_remain_amount);
            formData.append('type', 1);
            formData.append('settlement_month', 0);
            newFiles.forEach((e, index) => {
                formData.append("files[" + index + "]", e);
            });
            formData.append('_method', params.id ? 'PUT' : 'POST')
            let res = await api.fetcher(
                "POST",
                "/admin/settlement", formData
            );
            if (res) {
                history.push("/quanly/settlement");
            }
        } catch (e) {
        }
    };

    const hanleDelete = (file) => {
        if (file.id) {
            setOldFiles((pre) => pre.filter((e) => e.id != file.id));
        } else {
            setNewFiles((pre) => pre.filter((e) => e.name != file.name));
        }
    };

    const ExportExcel = async () => {
        try {
            let res = await api.fetcher(
                "post",
                "/admin/exportSettlement/" + params?.id,
                {},
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
        } catch (e) { }
    }

    const ListYear = useMemo(() => {
        const maxYear = Moment(new Date()).year();
        const minYear = 2010;
        const years = [];
        for (let i = maxYear; i >= minYear; i--) {
            years.push(i);
        }
        return years;
    }, [formik.values.settlement_year])

    return (
        <Card style={{ padding: 20 }} className={api.loading ? classes.loading : null}>
            <ButtonGroup variant="contained" aria-label="contained button group" style={{ float: "right" }}>
                {(dataForm.data?.status < 2 || dataForm.data?.status === undefined) && admin?.user_type !== 1 && (
                    <Button
                        style={{ backgroundColor: '#24BA00', color: '#fff' }}
                        onClick={sendSettlement}
                        endIcon={<SendIcon />}
                    >
                        Gửi quyết toán
                    </Button>
                )}
                {(dataForm.data?.status < 1 || dataForm.data?.status === undefined) && admin?.user_type !== 1 && (
                    <Button
                        color={'primary'}
                        endIcon={<SaveIcon />}
                        onClick={saveSettlement}
                    >Lưu quyết toán</Button>
                )}
                {dataForm.data?.status === 1 && admin?.user_type !== 1 && (
                    <Button
                        color={'secondary'}
                        endIcon={<DeleteIcon />}
                        onClick={() => history.push('/quanly/settlement')}
                    >Xóa quyết toán</Button>
                )}

            </ButtonGroup>
            <br />
            <br />
            <Divider />
            <p className={classes.p}>
                Quyết toán quỹ hỗ trợ VLNN - THEO DOANH THU TỪ PHÍ DỊCH VỤ
            </p>
            <TableContainer component={Card} style={api.loading ? {backgroundColor: null} : { backgroundColor: '#f3f3f3' }}>
                <Table aria-label={"caption table"}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Kỳ quyết toán</TableCell>
                            <TableCell>
                                <FormControl style={{ width: '50%', paddingRight: 10 }}>
                                    <TextField
                                        label={'Chọn quý'}
                                        fullWidth
                                        value={formik.values?.settlement_period || ''}
                                        readOnly={true}
                                    >
                                    </TextField>
                                </FormControl>
                                {admin?.user_type === 1 || dataForm.data?.status > 1 ?
                                    <FormControl style={{ width: '50%', paddingLeft: 10 }}>
                                        <InputLabel id="demo-controlled-open-select-label">Chọn năm</InputLabel>
                                        <Select
                                            labelId="demo-controlled-open-select-label"
                                            id="demo-controlled-open-select"
                                            onChange={(e) => formik.setFieldValue('settlement_year', e.target.value)}
                                            value={formik.values?.settlement_year}
                                            readOnly={true}
                                        >
                                            <MenuItem value={''}>Chọn năm</MenuItem>
                                            {
                                                ListYear.map((e) => (
                                                    <MenuItem key={e} value={e}>{e}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText error={api.error?.settlement_year ? true : false}>{api.error?.settlement_year}</FormHelperText>
                                    </FormControl> :
                                    <FormControl style={{ width: '50%', paddingLeft: 10 }}>
                                        <InputLabel id="demo-controlled-open-select-label">Chọn năm</InputLabel>
                                        <Select
                                            labelId="demo-controlled-open-select-label"
                                            id="demo-controlled-open-select"
                                            onChange={(e) => formik.setFieldValue('settlement_year', e.target.value)}
                                            value={formik.values?.settlement_year}
                                        >
                                            <MenuItem value={''}>Chọn năm</MenuItem>
                                            {
                                                ListYear.map((e) => (
                                                    <MenuItem key={e} value={e}>{e}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        <FormHelperText error={api.error?.settlement_year ? true : false}>{api.error?.settlement_year}</FormHelperText>
                                    </FormControl>
                                }
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Ngày quyết toán kỳ này</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    {Moment(formik.values?.registration_date).format('DD-MM-YYYY')}
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Dư nợ kỳ trước chuyển sang</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                    <span
                                        style={{ }}
                                    >
                                        <NumberFormat value={formik.values?.previous_debt} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right',fontSize:13, padding:3 }}>đ
                                    </span>
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Tổng doanh thu kỳ này</TableCell>
                            <TableCell>
                                {admin?.user_type === 1 || dataForm.data?.status > 1 ?
                                    <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                        <span
                                            style={{ }}
                                        >
                                            <NumberFormat value={formik.values?.total_income} displayType={'text'} thousandSeparator={true} />
                                        </span>
                                        <span
                                            style={{ float: 'right' }}>đ
                                    </span>
                                    </p> :
                                    <TextField
                                      className={classes.input}
                                        value={formik.values?.total_income}
                                        // type={'number'}
                                        onChange={e => {
                                            formik.setFieldValue('total_income', e.target.value);
                                            setNumberPercent(Math.ceil(e.target.value / 100));
                                            formik.setFieldValue('total_amount', Math.ceil(e.target.value / 100) + parseInt(formik.values?.previous_debt));
                                        }}
                                        fullWidth={true}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                            endAdornment: <InputAdornment position="start">đ</InputAdornment>,
                                        }}
                                    />
                                }
                                {api.error?.total_income && (
                                    <p style={{ fontSize: 12, color: "#FF2700" }}>{api.error?.total_income}</p>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Số tiền phải nộp quỹ trong kỳ</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                    <span
                                        style={{ }}
                                    >
                                        <NumberFormat value={numberPercent} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right',fontSize:13,  padding: 3 }}>đ
                                    </span>
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell
                                style={{
                                    fontWeight: 'bold',
                                    color: 'red',
                                    fontSize: 18
                                }}>Tổng số tiền phải nộp</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                    <span
                                        style={{ color: 'red' }}
                                    >
                                        <NumberFormat value={formik.values?.total_amount} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right', color: 'red',fontSize:13,padding: 3 }}>đ
                                    </span>
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Số tiền đã nộp</TableCell>
                            <TableCell>
                                {admin?.user_type === 1 || dataForm.data?.status > 1 ?
                                    <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                        <span
                                            style={{ }}
                                        >
                                            <NumberFormat value={formik.values?.total_paid_amount} displayType={'text'} thousandSeparator={true} />
                                        </span>
                                        <span
                                            style={{ float: 'right',fontSize:13,padding:3 }}>đ
                                    </span>
                                    </p> :
                                    <TextField
                                        className={classes.input1}
                                        value={formik.values?.total_paid_amount}
                                        // type={'number'}
                                        onChange={e => {
                                            formik.setFieldValue('total_paid_amount', e.target.value);
                                            formik.setFieldValue('total_remain_amount', formik.values?.total_amount - e.target.value)
                                        }}
                                        fullWidth={true}
                                        InputProps={{
                                            inputComponent: NumberFormatCustom,
                                            endAdornment: <InputAdornment position="start">đ</InputAdornment>,
                                        }}
                                    />
                                }
                                {api.error?.total_paid_amount && (
                                    <p style={{ fontSize: 12, color: "#FF2700" }}>{api.error?.total_paid_amount}</p>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>Số tiền nợ chuyển kỳ sau</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'right' }}>
                                    <span
                                        style={{color: 'red' }}
                                    >
                                        <NumberFormat value={formik.values?.total_remain_amount} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right', color: 'red',fontSize:13,padding:3 }}>đ
                                    </span>
                                </p>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            {(dataForm.data?.status < 2 || dataForm.data?.files?.length !== 0) && (
                <div style={{ width: '100%', margin: '20px 0px' }}>
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
                        readOnly={dataForm.data?.status > 1 ? true : false}
                    />
                </div>
            )}
        </Card>
    )
}
const useStyles= makeStyles(()=>({
    input:{
       '& input':{textAlign:"right",padding:4},
       '& p':{fontSize:13,marginBottom:8,marginRight:-3}
    },
    input1:{
        '& input':{textAlign:"right",padding:4},
        '& p':{fontSize:13,marginBottom:8,marginRight:-3}
    },
    p:{
        textAlign: 'center',
        fontSize: 22
    },
    loading: loadingStyle
}));
