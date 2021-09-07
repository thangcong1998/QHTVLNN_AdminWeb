import React, { useEffect, useState, useContext } from "react";
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
    Select,
    MenuItem,
    InputLabel
} from "@material-ui/core";
import { AuthContext } from "../../../common/AuthProvider";
import DeleteIcon from '@material-ui/icons/Delete';
import SendIcon from '@material-ui/icons/Send';
import SaveIcon from '@material-ui/icons/Save';
import EditIcon from '@material-ui/icons/Edit';
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
import UploadFile from "../../../components/Admin/form/UploadFile";

export default function SettlementsForm2() {
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
            settlement_year: null,
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
            }
        }
    }, [data]);
    useEffect(() => {
        if (dataForm.data !== undefined && firstTime === true) {
            formik.setFieldValue('agreement_date', dataForm.data?.agreement_date);
            formik.setFieldValue('approved_date', dataForm.data?.approved_date);
            formik.setFieldValue('company_id', dataForm.data?.company_id);
            formik.setFieldValue('previous_debt', dataForm.data?.previous_debt);
            formik.setFieldValue('registration_date', dataForm.data?.registration_date);
            formik.setFieldValue('settlement_period', dataForm.data?.settlement_period);
            formik.setFieldValue('settlement_year', dataForm.data?.settlement_year);
            formik.setFieldValue('status', dataForm.data?.status);
            formik.setFieldValue('total_amount', dataForm.data?.total_amount);
            formik.setFieldValue('total_income', dataForm.data?.total_income);
            formik.setFieldValue('total_paid_amount', dataForm.data?.total_paid_amount);
            formik.setFieldValue('total_remain_amount', dataForm.data?.total_remain_amount);
            formik.setFieldValue('type', dataForm.data?.type);
            setFirstTime(false);
            setNumberPercent(dataForm.data?.total_income / 100);
            setCompanyId(dataForm.data?.company_id);
            setOldFiles(dataForm.data?.files);
        }
    }, [dataForm]);
    const sendSettlement = async () => {
    };
    const saveSettlement = async () => {
    };
    const editSettlement = async () => {
    };
    const sendSettlementHas = async () => {
    };
    const expertiseSettlement = async () => {
    };
    const cancelSettlement = async () => {
    };
    const approvedSettlement = async () => {
    };
    const hanleDelete = (file) => {
        if (file.id) {
            setOldFiles((pre) => pre.filter((e) => e.id != file.id));
        } else {
            setNewFiles((pre) => pre.filter((e) => e.name != file.name));
        }
    };
    return (
        <Card style={{ padding: 20 }}>
            {dataForm.data?.status > 1 && (
                <Button
                    color={'primary'}
                    endIcon={<CloudDownloadIcon />}
                    onClick={() => console.log('download')}
                    variant={'contained'}
                >Tải xuống văn bản</Button>
            )}
            <ButtonGroup variant="contained" aria-label="contained button group" style={{ float: "right" }}>
                {(dataForm.data?.status < 2 || dataForm.data?.status === undefined) && admin?.user_type !== 1 && (
                    <Button
                        style={{ backgroundColor: '#24BA00', color: '#fff' }}
                        onClick={params.id ? sendSettlement : sendSettlementHas}
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
                        color={'primary'}
                        endIcon={<EditIcon />}
                        onClick={editSettlement}
                    >Sửa quyết toán</Button>
                )}
                {dataForm.data?.status === 2 && admin?.user_type === 1 && (
                    <Button
                        style={{ backgroundColor: '#24BA00', color: '#fff' }}
                        onClick={expertiseSettlement}
                        endIcon={<FindInPageIcon />}
                    >
                        Thẩm định quyết toán
                    </Button>
                )}
                {dataForm.data?.status > 1 && dataForm.data?.status < 4 && admin?.user_type === 1 && (
                    <Button
                        style={{ backgroundColor: '#24BA00', color: '#fff' }}
                        onClick={approvedSettlement}
                        endIcon={<AssignmentTurnedInIcon />}
                    >
                        Phê duyệt quyết toán
                    </Button>
                )}
                {dataForm.data?.status > 1 && dataForm.data?.status < 4 && admin?.user_type === 1 && (
                    <Button
                        color={'primary'}
                        endIcon={<ClearIcon />}
                        onClick={cancelSettlement}
                    >Từ chối quyết toán</Button>
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
            <p style={{ textAlign: 'center', fontSize: 22 }}>
                Quyết toán quỹ hỗ trợ VLNN - THEO DOANH THU TỪ PHÍ DỊCH VỤ
            </p>
            <TableContainer component={Card} style={{ backgroundColor: '#f3f3f3' }}>
                <Table aria-label={"caption table"}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Kỳ quyết toán</TableCell>
                            <TableCell>
                                <FormControl style={{ width: '50%', paddingRight: 10 }}>
                                    <InputLabel id="demo-controlled-open-select-label">Chọn tháng</InputLabel>
                                    <Select
                                        labelId="demo-controlled-open-select-label"
                                        id="demo-controlled-open-select"
                                    >
                                        <MenuItem value={1}>Tháng 1</MenuItem>
                                        <MenuItem value={2}>Tháng 2</MenuItem>
                                        <MenuItem value={3}>Tháng 3</MenuItem>
                                        <MenuItem value={4}>Tháng 4</MenuItem>
                                        <MenuItem value={5}>Tháng 5</MenuItem>
                                        <MenuItem value={6}>Tháng 6</MenuItem>
                                        <MenuItem value={7}>Tháng 7</MenuItem>
                                        <MenuItem value={8}>Tháng 8</MenuItem>
                                        <MenuItem value={9}>Tháng 9</MenuItem>
                                        <MenuItem value={10}>Tháng 10</MenuItem>
                                        <MenuItem value={11}>Tháng 11</MenuItem>
                                        <MenuItem value={12}>Tháng 12</MenuItem>
                                    </Select>
                                </FormControl>
                                {admin?.user_type === 1 || dataForm.data?.status > 1 ?
                                    <DatePicker
                                        readOnly={true}
                                        views={["year"]}
                                        label="Chọn năm"
                                        value={''}
                                        onChange={''}
                                        variant={'outlined'}
                                        style={{ width: '50%', paddingLeft: 10 }}
                                    /> :
                                    <DatePicker
                                        views={["year"]}
                                        label="Chọn năm"
                                        value={''}
                                        onChange={e => ''}
                                        variant={'outlined'}
                                        style={{ width: '50%', paddingLeft: 10 }}
                                        maxDate={new Date()}
                                    />
                                }
                                {api.error?.settlement_year && (
                                    <p style={{ fontSize: 12, color: "#FF2700" }}>{''}</p>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Ngày quyết toán kỳ trước</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    {Moment(new Date()).format('DD-MM-YYYY')}
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Ngày quyết toán kỳ này</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    {Moment(new Date()).format('DD-MM-YYYY')}
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Dư nợ tháng trước chuyển sang</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    <span
                                        style={{ float: 'left' }}
                                    >
                                        <NumberFormat value={''} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right' }}>VNĐ
                                    </span>
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Số tiền phải nộp quỹ trong tháng</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    <span
                                        style={{ float: 'left' }}
                                    >
                                        <NumberFormat value={''} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right' }}>VNĐ
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
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    <span
                                        style={{ float: 'left', color: 'red' }}
                                    >
                                        <NumberFormat value={''} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right', color: 'red' }}>VNĐ
                                    </span>
                                </p>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18 }}>Số tiền đã nộp</TableCell>
                            <TableCell>
                                {admin?.user_type === 1 || dataForm.data?.status > 1 ?
                                    <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                        <span
                                            style={{ float: 'left' }}
                                        >
                                            <NumberFormat value={''} displayType={'text'} thousandSeparator={true} />
                                        </span>
                                        <span
                                            style={{ float: 'right' }}>VNĐ
                                    </span>
                                    </p> :
                                    <TextField
                                        value={''}
                                        type={'number'}
                                        onChange={e => {
                                            ''
                                        }}
                                        fullWidth={true}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="start">VNĐ</InputAdornment>,
                                        }}
                                    />
                                }
                                {api.error?.total_paid_amount && (
                                    <p style={{ fontSize: 12, color: "#FF2700" }}>{''}</p>
                                )}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>Số tiền nợ chuyển tháng sau</TableCell>
                            <TableCell>
                                <p style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                                    <span
                                        style={{ float: 'left', color: 'red' }}
                                    >
                                        <NumberFormat value={''} displayType={'text'} thousandSeparator={true} />
                                    </span>
                                    <span
                                        style={{ float: 'right', color: 'red' }}>VNĐ
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
