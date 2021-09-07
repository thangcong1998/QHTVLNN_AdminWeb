import React, {useEffect, useState} from "react";
import {
    Button,
    ButtonGroup,
    TextField,
    Card, FormControl
} from "@material-ui/core";
import {useFormik} from "formik";
import Moment from "moment";
import {useAPI, useFetch} from "../../../api/api";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import { DatePicker } from "@material-ui/pickers";
export default function LaborSupportForm() {
    const api = useAPI();
    const {data: data} = useFetch(['get', '/admin/settlementInfo']);
    const [getDataUser, setGetDataUser] = useState();
    const [timeContract, setTimeContract] = useState();
    const [timeWork, setTimeWork] = useState();
    useEffect(() => {
        if(data?.company === null ) {
            setGetDataUser(data?.labor);
        }
        else
        {
            setGetDataUser(data?.company);
        }
    },[data]);
    useEffect(() => {
        let monthContract;
        let monthWork;
        let yearContract;
        let yearWork;
        yearContract = Moment(formik.values?.contract_end_date).format('YYYY') - Moment(formik.values?.contract_start_date).format('YYYY');
        yearWork = Moment(formik.values?.end_working_date).format('YYYY') - Moment(formik.values?.start_working_date).format('YYYY');
        monthContract = Moment(formik.values?.contract_end_date).format('MM') - Moment(formik.values?.contract_start_date).format('MM');
        monthWork = Moment(formik.values?.end_working_date).format('MM') - Moment(formik.values?.start_working_date).format('MM');
        setTimeContract(yearContract*12+monthContract);
        setTimeWork(yearWork*12+monthWork);
    });
    const date = new Date();
    const formik = useFormik({
        initialValues: {
        },
        onSubmit: async(values) => {
        }
    });
    const getCountryToForm = (e) => {
        if ( e !== null ) {
            formik.setFieldValue('country_id', e.id);
            formik.setFieldValue('country_name', e.name);
        }
        else {
            formik.setFieldValue('country_id', null);
            formik.setFieldValue('country_name', null);
        }
    };
    const ChangeDataToForm = (value, filed) => {
        formik.setFieldValue(filed, value);
    }
    return (
        <div style={{ display: "flex", flexWrap: "wrap"}}>
            <div style={{ width: '70%', padding: '0px 20px',borderRight: '#878787 solid 1px'}} >
                <Card style={{ padding: 20}}>
                    <div style={{ fontSize: 22, textAlign: 'center'}}>
                        <b>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br />
                        <b>Độc lập - Tự do - Hạnh phúc</b><br />
                        <b>------</b><br />
                        <b style={{ fontSize: 25}}>GIẤY ĐỀ NGHỊ</b><br />
                        <i style={{ fontSize: 20}}>Về việc hỗ trợ rủi ro trong thời gian làm việc ở nước ngoài</i><br />
                        <p style={{ fontSize: 20}}>Kính gửi: <span style={{ paddingLeft: 10, fontWeight: 'bold'}}>Quỹ Hỗ trợ việc làm ngoài nước</span></p>
                    </div>
                    <br />
                    <br />
                    <p style={{ fontSize: 20}}>Họ tên người lao động:
                        <span style={{ paddingLeft: 20, fontSize: 20, fontWeight: "bold"}}>
                            {formik.values?.name}
                        </span>
                    </p>
                    <p style={{ fontSize: 20, display: 'flex', flexWrap: 'wrap'}}>
                        <div style={{ width: '40%'}}>
                            <span>Số hộ chiếu: </span>
                            <span style={{ minWidth: 200}}>
                                <span style={{ paddingLeft: 20, fontSize: 20, fontWeight: "bold"}}>
                                    {formik.values?.passport_code}
                                </span>
                            </span>
                        </div>
                        <div style={{ width: '30%'}}>
                            <span>Nơi cấp:  </span>
                            <span style={{ minWidth: 200}}>
                                <span style={{ paddingLeft: 20, fontSize: 20, fontWeight: "bold"}}>
                                    {formik.values?.id_issue_region}
                                </span>
                            </span>
                        </div>
                        <div style={{ width: '30%'}}>
                            <span>Ngày cấp:</span>
                            <span style={{ minWidth: 200}}>
                                <span style={{ paddingLeft: 20, fontSize: 20, fontWeight: "bold"}}>
                                    {Moment(formik.values?.id_issue_date).format('DD/MM/YYYY')}
                                </span>
                            </span>
                        </div>
                    </p>
                    <p style={{ fontSize: 20}}>Tổ chức đưa đi: <span style={{ fontWeight: "bold"}}>{getDataUser?.name}</span></p>
                    <p style={{ fontSize: 20}}>Nước đến làm việc: <span style={{ fontWeight: "bold"}}>{formik.values?.country_name}</span></p>

                    <div style={{ display: "flex", flexWrap: 'wrap', width: '100%'}}>
                        <p style={{ width: '50%', fontSize: 20}}>
                            Thời hạn hợp đồng:
                            <span style={{ fontWeight: "bold", fontSize: 20}}>{timeContract} Tháng</span>
                        </p>
                        <p style={{ width: '25%', fontSize: 20}}>
                            Từ ngày:
                            <span style={{ fontSize: 20, fontWeight: "bold"}}>
                                {Moment(formik.values?.contract_start_date).format('DD/MM/YYYY')}
                            </span>
                        </p>
                        <p style={{ width: '25%', fontSize: 20}}>
                            Đến ngày:
                            <span style={{ fontSize: 20, fontWeight: "bold"}}>
                                {Moment(formik.values?.contract_end_date).format('DD/MM/YYYY')}
                            </span>
                        </p>
                    </div>
                    <div style={{ display: "flex", flexWrap: 'wrap', width: '100%'}}>
                        <p style={{ width: '50%', fontSize: 20}}>
                            Thời gian làm việc ở nước ngoài:
                            <span style={{ fontWeight: "bold", fontSize: 20}}>{timeWork} Tháng</span>
                        </p>
                        <p style={{ width: '25%', fontSize: 20}}>
                            Từ ngày:
                            <span style={{ fontSize: 20, fontWeight: "bold"}}>
                                {Moment(formik.values?.start_working_date).format('DD/MM/YYYY')}
                            </span>
                        </p>
                        <p style={{ width: '25%', fontSize: 20}}>
                            Đến ngày:
                            <span style={{ fontSize: 20, fontWeight: "bold"}}>
                                {Moment(formik.values?.end_working_date).format('DD/MM/YYYY')}
                            </span>
                        </p>
                    </div>
                    <p style={{ fontSize: 20}}>Lý do hỗ trợ:
                        <span>
                            <i>(người lao động bị chết, tai nạn lao động, tai nạn rủi ro, ốm đau, bệnh tật,...)</i>
                        </span>
                        <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.reason}
                        </span>
                    </p>
                    <p style={{ fontSize: 20}}>Họ tên, địa chỉ người nhận:
                        <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.account_holder_name}
                        </span>
                    </p>
                    <div style={{ borderBottom: '#000 solid 1px'}}>
                        <p style={{ fontSize: 20}}>Tại Ngân hàng:
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.bank_name}
                            </span>
                        </p>
                    </div>
                    <p style={{ fontSize: 20, marginTop: 10}}>
                        Họ tên người được uỷ quyền:
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.authorized_person}
                            </span>
                    </p>
                    <p style={{ fontSize: 20}}>
                        Quan hệ với người lao động (vợ, chồng, con, bố, mẹ…):
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.relationship_with_user}
                            </span>
                    </p>
                    <p style={{ fontSize: 20}}>
                        Hộ khẩu thường trú :
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.authorized_person_address}
                            </span>
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap"}}>
                        <p style={{ width: '40%', fontSize: 20}}>
                            Số CMND:
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.authorized_person_id_code}
                            </span>
                        </p>
                        <p style={{ width: '30%', fontSize: 20}}>
                            Nơi cấp:
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {formik.values?.authorized_person_id_issue_region}
                            </span>
                        </p>
                        <p style={{ width: '30%', fontSize: 20}}>
                            Ngày cấp:
                            <span style={{ fontSize: 20, fontWeight: "bold", paddingLeft: 20}}>
                            {Moment(formik.values?.authorized_person_id_issue_date).format('DD/MM/YYYY')}
                            </span>
                        </p>
                    </div>
                    <div style={{ textAlign: "center", fontSize: 20}}>
                        <i>(Chỉ khai phần này nếu người đề nghị không phải là người lao động)</i>
                    </div>
                    <br />
                    <br />

                    <div style={{ fontSize: 20, display: 'flex', flexWrap: 'wrap', float: 'right'}}>
                        <p style={{ width: 80}}>Ngày {date.getDay()},</p>
                        <p style={{ width: 90}}> Tháng {date.getMonth()},</p>
                        <p style={{ width: 150}}>Năm {date.getFullYear()}</p>
                    </div>
                    <br />
                    <div style={{ fontSize: 20, display: 'flex', flexWrap: 'wrap', width: '100%', minHeight: 200}}>
                        <div style={{ width: '50%',textAlign: "center"}}>
                            <b>Xác nhận của chính quyền cấp xã</b><br />
                            <i>(Ký, đóng dấu, ghi rõ họ tên)</i>
                        </div>
                        <div style={{ width: '50%', textAlign: "center"}}>
                            <b>Người đề nghị</b><br />
                            <i>(Ký, ghi rõ họ tên)</i>
                        </div>
                    </div>
                </Card>
            </div>
            <div style={{ width: '30%', padding: '0px 20px'}}>
                <div>
                    <ButtonGroup variant="contained" fullWidth aria-label="contained primary button group">
                        <Button color={'primary'} fullWidth>Gửi</Button>
                        <Button color={'secondary'} fullWidth>Hủy</Button>
                    </ButtonGroup>
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'name')}
                        fullWidth
                        variant={'outlined'}
                        label={'Người lao động'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'passport_code')}
                        fullWidth
                        variant={'outlined'}
                        label={'Số hộ chiếu'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <DatePicker
                        label={'Ngày cấp'}
                        variant={'outlined'}
                        inputVariant={'outlined'}
                        onChange={(e) => ChangeDataToForm(e, 'id_issue_date')}
                        value={formik.values?.id_issue_date}
                        fullWidth
                        format="DD/MM/YYYY"
                        views={["date", "month", "year"]}
                    />
                </div>
                <div style={{ paddingTop: 20}}>
                    <Autocomplete
                        label={"Nước đến làm việc *"}
                        endpoint={'admin/countries'}
                        queryField={'name'}
                        value={formik.values?.country}
                        handleChange={e => {
                            formik.setFieldValue("country", e);
                            getCountryToForm(e);
                        }}
                        size={"medium"}
                    />
                </div>
                <div style={{ paddingTop: 20, display: "flex", flexWrap: "wrap", width: '100%'}} >
                    <p style={{ fontSize: 20}}>
                        Thời hạn hợp đồng
                    </p><br />
                    <p style={{ width: '50%'}}>
                        <DatePicker
                            label={'Từ ngày'}
                            variant={'outlined'}
                            inputVariant={'outlined'}
                            onChange={(e) => ChangeDataToForm(e, 'contract_start_date')}
                            value={formik.values?.contract_start_date}
                            format="DD/MM/YYYY"
                            views={["date", "month", "year"]}
                        />
                    </p>
                    <p style={{ width: '50%'}}>
                        <DatePicker
                            label={'Đến ngày'}
                            variant={'outlined'}
                            inputVariant={'outlined'}
                            onChange={(e) => ChangeDataToForm(e, 'contract_end_date')}
                            value={formik.values?.contract_end_date}
                            format="DD/MM/YYYY"
                            views={["date", "month", "year"]}
                        />
                    </p>
                </div>
                <div style={{ paddingTop: 20, display: "flex", flexWrap: "wrap", width: '100%'}} >
                    <p style={{ fontSize: 20}}>
                        Thời gian làn việc ở nước ngoài
                    </p><br />
                    <p style={{ width: '50%'}}>
                        <DatePicker
                            label={'Từ ngày'}
                            variant={'outlined'}
                            inputVariant={'outlined'}
                            onChange={(e) => ChangeDataToForm(e, 'start_working_date')}
                            value={formik.values?.start_working_date}
                            format="DD/MM/YYYY"
                            views={["date", "month", "year"]}
                        />
                    </p>
                    <p style={{ width: '50%'}}>
                        <DatePicker
                            label={'Đến ngày'}
                            variant={'outlined'}
                            inputVariant={'outlined'}
                            onChange={(e) => ChangeDataToForm(e, 'end_working_date')}
                            value={formik.values?.end_working_date}
                            format="DD/MM/YYYY"
                            views={["date", "month", "year"]}
                        />
                    </p>
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'reason')}
                        fullWidth
                        variant={'outlined'}
                        label={'Lý do hỗ trợ'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'account_holder_name')}
                        fullWidth
                        variant={'outlined'}
                        label={'Họ tên địa chỉ người nhận'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'bank_name')}
                        fullWidth
                        variant={'outlined'}
                        label={'Tại ngân hàng'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'authorized_person')}
                        fullWidth
                        variant={'outlined'}
                        label={'Họ tên người được ủy quyền'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'relationship_with_user')}
                        fullWidth
                        variant={'outlined'}
                        label={'Quan hệ với người lao động'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'authorized_person_address')}
                        fullWidth
                        variant={'outlined'}
                        label={'Hộ khẩu thường chú người ủy quyền'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'authorized_person_id_code')}
                        fullWidth
                        variant={'outlined'}
                        label={'Số CMND người ủy quyền'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <TextField
                        onChange={e => ChangeDataToForm(e.target.value, 'authorized_person_id_issue_region')}
                        fullWidth
                        variant={'outlined'}
                        label={'Nơi cấp CMND người ủy quyền'}
                    />
                </div>
                <div style={{ paddingTop: 20}} >
                    <DatePicker
                        label={'Ngày cấp CMND người ủy quyền'}
                        variant={'outlined'}
                        inputVariant={'outlined'}
                        value={formik.values?.authorized_person_id_issue_date}
                        onChange={(e) => ChangeDataToForm(e, 'authorized_person_id_issue_date')}
                        format="DD/MM/YYYY"
                        views={["date", "month", "year"]}
                        fullWidth
                    />
                </div>
            </div>
        </div>
    )
}
