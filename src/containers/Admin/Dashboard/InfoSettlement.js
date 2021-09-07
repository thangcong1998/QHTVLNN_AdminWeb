import React, {useEffect, useState} from "react";
import {
    Card,
    Grid,
    Divider,
    Button,
    Menu,
    MenuItem,
    Fab
} from "@material-ui/core";
import {useAPI, useFetch} from "../../../api/api";
import {
    useHistory
} from 'react-router-dom';
import NumberFormat from "react-number-format";
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import DescriptionIcon from "@material-ui/icons/Description";
import {makeStyles} from "@material-ui/core/styles";
import laborDepartMentForm from "../LaborDepartments/laborDepartMentsForm";
import agreement from "../../../assets/image/agrement.png";
import approval from "../../../assets/image/approval.png";
import companyNotSettlement from "../../../assets/image/center.png";
import support from "../../../assets/image/support.png";

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: theme.spacing(1),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    totalCard: {
        height: '80px',
        color: 'black',
        background: '#CFCFCF',
        border: '0px'
    },
}));

export default function InfoSettlement() {
    const classes = useStyles();
    const api = useAPI();
    const [settlementExpertise, setSettlementExpertise] = useState(0);
    const [settlementApproved, setSettlementApproved] = useState(0);
    const [newSupport, setNewSupport] = useState(0);
    const [documentSupportExpertise, setDocumentSupportExpertise] = useState(0);
    const [schoolFeeSupportExpertise, setSchoolFeeSupportExpertise] = useState(0);
    const [laborSupportExpertise, setLaborSupportExpertise] = useState(0);
    const [totalSupportRequest, setTotalSupportRequest] = useState(0);
    const [totalLaborSettlement, setTotalLaborSettlement] = useState(0);
    const [documentSupportApproved, setDocumentSupportApproved] = useState(0);
    const [schoolFeeSupportApproved, setSchoolFeeSupportApproved] = useState(0);
    const [laborSupportApproved, setLaborSupportApproved] = useState(0);
    const [open, setOpen] = useState(null);
    const {data: data} = useFetch(['get', '/admin/dashBroadInfo']);
    const history = useHistory();
    const [moneySupport, setMoneySupport] = useState(false);
    const [laborSettlement, setLaborSettlement] = useState(false);
    useEffect(() => {
        if(data) {
            let temp = 0;
            let tempSettlementExpertise = 0;
            let tempSettlementApproved = 0;
            let tempDocumentSupportExpertise = 0;
            let tempDocumentSupportApproved = 0;
            let tempSchoolFeeSupportExpertise = 0;
            let tempSchoolFeeSupportApproved = 0;
            let tempLaborSupportExpertise = 0;
            let tempLaborSupportApproved = 0;
            let totalSupport = 0;
            let totalLabor = 0;
            data.settlement.forEach(value => {
                if (value.status == 2) {
                    tempSettlementExpertise = tempSettlementExpertise + 1;
                }
                if (value.status == 3) {
                    tempSettlementApproved = tempSettlementApproved + 1;
                }
            })
            data.documentSupport.forEach(value => {
                if(value?.support_request.status == 2) {
                    tempDocumentSupportExpertise = tempDocumentSupportExpertise + 1;
                   temp = temp + 1;
                }
                if(value?.support_request.status == 3) {
                    tempDocumentSupportApproved = tempDocumentSupportApproved + 1;
                    temp = temp + 1;
                }
            })
            data.schoolFeeSupport.forEach(value => {
                if(value?.support_request.status == 2) {
                    tempSchoolFeeSupportExpertise = tempSchoolFeeSupportExpertise + 1;
                    temp = temp + 1;
                }
                if(value?.support_request.status == 3) {
                    tempSchoolFeeSupportApproved = tempSchoolFeeSupportApproved + 1;
                    temp = temp + 1;
                }
            })
            data.laborSupport.forEach(value => {
                if(value?.support_request.status == 2) {
                    tempLaborSupportExpertise = tempLaborSupportExpertise + 1;
                    temp = temp + 1;
                }
                if(value?.support_request.status == 3) {
                    tempLaborSupportApproved = tempLaborSupportApproved + 1;
                    temp = temp + 1;
                }
            })
            setSettlementApproved(tempSettlementApproved);
            setSettlementExpertise(tempSettlementExpertise);
            setDocumentSupportApproved(tempDocumentSupportApproved);
            setDocumentSupportExpertise(tempDocumentSupportExpertise);
            setSchoolFeeSupportApproved(tempSchoolFeeSupportApproved);
            setSchoolFeeSupportExpertise(tempSchoolFeeSupportExpertise);
            setLaborSupportApproved(tempLaborSupportApproved);
            setLaborSupportExpertise(tempLaborSupportExpertise);
            data.totalMoneySchoolFeeSupport.forEach(value => totalSupport = totalSupport + value.total)
            data.totalMoneyLaborSupport.forEach(value => totalSupport = totalSupport + value.total)
            data.totalLaborSettlement.forEach(value => totalLabor = totalLabor + value.total);
            setTotalLaborSettlement(totalLabor);
            setTotalSupportRequest(totalSupport);
            setNewSupport(temp);
        }
    }, [data])
    const HandelOpen = (event) => {
        setOpen(event.currentTarget);
    }
    const HandleClose = () => {
        setOpen(null);
    };
    const showMoneySupport = () => {
        setMoneySupport(true);
    }
    const hiddenMoneySupport = () => {
        setMoneySupport(false);
    }
    const showPeopleSettlement = () => {
        setLaborSettlement(true);
    }
    const hiddenPeopleSettlement = () => {
        setLaborSettlement(false);
    }
    return (
        <Grid spacing={2} container>
            <Grid item={true} md={4} xs={12} onClick={() => history.push('/quanly/settlement', {status: 2})}>
                <Card variant={'outlined'} style={{
                    height: '120px',
                    padding: '0px 20px',
                    color: 'white',
                    background: '#B187FA',
                    border: '0px'
                }}
                >
                    <Grid container spacing={2}>
                        <Grid item md={3} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block", padding: 10}}>
                                <img src={agreement} width={50} height={50} />
                            </p>
                        </Grid>
                        <Grid item md={1} style={{ padding: '30px 0px'}}>
                            <Divider orientation="vertical" style={{ backgroundColor: "white", height: 70}} />
                        </Grid>
                        <Grid item md={8} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block"}}>
                                <NumberFormat value={settlementExpertise} displayType={'text'} thousandSeparator={true} />
                                <br />
                                Quyết toán đang chờ thẩm định
                            </p>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item={true} md={4} xs={12} onClick={() => history.push('/quanly/settlement', {status: 3})}>
                <Card variant={'outlined'} style={{
                    height: '120px',
                    padding: '0px 20px',
                    color: 'white',
                    background: '#A403D0',
                    border: '0px'
                }}>
                    <Grid container spacing={2}>
                        <Grid item md={3} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block", padding: 10}}>
                                <img src={approval} width={50} height={50} />
                            </p>
                        </Grid>
                        <Grid item md={1} style={{ padding: '30px 0px'}}>
                            <Divider orientation="vertical" style={{ backgroundColor: "white", height: 70}} />
                        </Grid>
                        <Grid item md={8} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block"}}>
                                <NumberFormat value={settlementApproved} displayType={'text'} thousandSeparator={true} />
                                <br />
                                Quyết toán đang chờ phê duyệt
                            </p>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item={true} md={4} xs={12} onClick={(e) => HandelOpen(e)}>
                <Card variant={'outlined'} style={{
                    height: '120px',
                    padding: '0px 20px',
                    color: 'white',
                    background: '#128CE6',
                    border: '0px'
                }}
                >
                    <Grid container spacing={2}>
                        <Grid item md={3} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block", padding: 10}}>
                                <img src={support} width={50} height={50} />
                            </p>
                        </Grid>
                        <Grid item md={1} style={{ padding: '30px 0px'}}>
                            <Divider orientation="vertical" style={{ backgroundColor: "white", height: 70}} />
                        </Grid>
                        <Grid item md={8} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block"}}>
                                <NumberFormat value={newSupport} displayType={'text'} thousandSeparator={true} />
                                <br />
                                Yêu cầu hỗ trợ
                            </p>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Menu
                style={{ backgroundColor: null, position: "fixed", right: '15px', top: '100px'}}
                open={Boolean(open)}
                onClose={HandleClose}
                anchorEl={open}
            >
                <MenuItem style={{backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/documentSupport', {status: 2})}
                    >
                        <div style={{ height: '28px', width: '28px', margin: 2, borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2'}}>
                            <NumberFormat value={documentSupportExpertise} displayType={'text'} thousandSeparator={true} />
                        </div>
                        Hỗ trợ tài liệu đang chờ thẩm định
                    </Fab>
                </MenuItem>
                <MenuItem style={{backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/schoolFeeSupport', {status: 2})}
                    >
                        <div style={{ height: '28px', width: '28px', margin: 2, borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2'}}>
                            <NumberFormat value={schoolFeeSupportExpertise} displayType={'text'} thousandSeparator={true} />
                        </div>
                        Hỗ trợ học phí đang chờ thẩm định
                    </Fab>
                </MenuItem>
                <MenuItem style={{backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/laborSupport', {status: 2})}
                    >
                        <div style={{ height: '28px', width: '28px', margin: 2, borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2'}}>
                            <NumberFormat value={laborSupportExpertise} displayType={'text'} thousandSeparator={true} />
                        </div>
                        Hỗ trợ rủi ro đang chờ thẩm định
                    </Fab>
                </MenuItem>
                <MenuItem style={{backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/documentSupport', {status: 3})}
                    >
                        <div style={{ height: '28px', width: '28px', margin: 2, borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2'}}>
                            <NumberFormat value={documentSupportApproved} displayType={'text'} thousandSeparator={true} />
                        </div>
                        Hỗ trợ tài liệu đang chờ phê duyệt
                    </Fab>
                </MenuItem>
                <MenuItem style={{backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/schoolFeeSupport', {status: 3})}
                    >
                        <div style={{ height: '28px', width: '28px', margin: 2, borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2'}}>
                            <NumberFormat value={schoolFeeSupportApproved} displayType={'text'} thousandSeparator={true} />
                        </div>
                        Hỗ trợ học phí đang chờ phê duyệt
                    </Fab>
                </MenuItem>
                <MenuItem style={{backgroundColor: "revert"}}>
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        aria-label="add"
                        className={classes.margin}
                        disableRipple={true}
                        disableFocusRipple={true}
                        onClick={() => history.push('/quanly/laborSupport', {status: 3})}
                    >
                        <div style={{ height: '28px', width: '28px', margin: 2, borderRadius: '50%', backgroundColor: '#fff', color: '#1976d2'}}>
                            <NumberFormat value={laborSupportApproved} displayType={'text'} thousandSeparator={true} />
                        </div>
                        Hỗ trợ rủi ro đang chờ phê duyệt
                    </Fab>
                </MenuItem>
            </Menu>


            <Grid item={true} md={6} xs={12} onMouseEnter={() => showPeopleSettlement()} onMouseLeave={() => hiddenPeopleSettlement()}>
                <Card variant={'outlined'} style={ laborSettlement === false ? {
                    height: '80px',
                    color: 'white',
                    background: '#FC5151',
                    border: '0px',
                } : {
                    height: '80px',
                    color: 'white',
                    background: '#FC5151',
                    border: '0px',
                    boxShadow: '0 0 20px #1d1d1d'
                }}
                >
                    <Grid container spacing={2}>
                        <Grid item md={4} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block"}}>
                                <NumberFormat value={totalLaborSettlement} displayType={'text'} thousandSeparator={true} />
                            </p>
                        </Grid>
                        <Grid item md={1} style={{ padding: '10px 0px'}}>
                            <Divider orientation="vertical" variant={"fullWidth"}/>
                        </Grid>
                        <Grid item md={7} style={{ fontSize: 20}}>
                            <p style={{ display: "inline-block"}}>
                                Số lao động xuất cảnh quý trước
                            </p>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
            <Grid item={true} md={6} xs={12} onMouseEnter={() => showMoneySupport()} onMouseLeave={() => hiddenMoneySupport()}>
                <Card variant={'outlined'} style={ moneySupport === false ? {
                    height: '80px',
                    color: 'white',
                    background: '#FC5151',
                    border: '0px',
                } : {
                    height: '80px',
                    color: 'white',
                    background: '#FC5151',
                    border: '0px',
                    boxShadow: '0 0 20px #1d1d1d'
                }}
                >
                    <Grid container spacing={2}>
                        <Grid item md={5} style={{ fontSize: 20, textAlign: "center"}}>
                            <p style={{ display: "inline-block"}}>
                                <NumberFormat value={totalSupportRequest} displayType={'text'} thousandSeparator={true} />{' '}₫
                            </p>
                        </Grid>
                        <Grid item md={1} style={{ padding: '10px 0px'}}>
                            <Divider orientation="vertical" variant={"fullWidth"} />
                        </Grid>
                        <Grid item md={6} style={{ fontSize: 20}}>
                            <p style={{ display: "inline-block"}}>
                                Số tiền hỗ trợ quý trước
                            </p>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}
