import React, {useEffect, useState} from "react";
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {useAPI, useFetch} from "../../../api/api";
import {useHistory} from "react-router-dom";
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import DescriptionIcon from '@material-ui/icons/Description';
import SchoolIcon from '@material-ui/icons/School';
import AccessibleIcon from '@material-ui/icons/Accessible';
import CachedIcon from '@material-ui/icons/Cached';

const drawerWidth = 260;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: "100%",
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    leftBar: {
        display: "flex",
        alignItems: "center",
    },
    breadcrumbs: {
        paddingLeft: 30,
    },
    menuButton: {
        marginRight: 36,
    },
    icon: {
        justifyContent: "flex-end",
    },
    rightBar: {
        display: "flex",
    },
}));

export default function Notification() {
    const api = useAPI();
    const [settlementExpertise, setSettlementExpertise] = useState([]);
    const [settlementApproved, setSettlementApproved] = useState([]);
    const [documentSupportExpertise, setDocumentSupportExpertise] = useState([]);
    const [documentSupportApproved, setDocumentSupportApproved] = useState([]);
    const [schoolFeeSupportExpertise, setSchoolFeeSupportExpertise] = useState([]);
    const [schoolFeeSupportApproved, setSchoolFeeSupportApproved] = useState([]);
    const [laborSupportExpertise, setLaborSupportExpertise] = useState([]);
    const [laborSupportApproved, setLaborSupportApproved] = useState([]);
    const {data: data} = useFetch(['get', '/admin/notification']);
    console.log(data)
    const history = useHistory();
    const classes = useStyles();
    useEffect(() => {
            if( data ) {
                let tempSettlementApproved = [...settlementApproved];
                let tempSettlementExpertise = [...settlementExpertise];
                let tempDocumentSupportExpertise = [...documentSupportExpertise];
                let tempDocumentSupportApproved = [...documentSupportApproved];
                let tempSchoolFeeSupportExpertise = [...schoolFeeSupportExpertise];
                let tempSchoolFeeSupportApproved = [...schoolFeeSupportApproved];
                let tempLaborSupportExpertise = [...laborSupportExpertise];
                let tempLaborSupportApproved = [...laborSupportApproved];
                data.settlement.forEach(value => {
                    if(value.status == 2) {
                        tempSettlementExpertise = tempSettlementExpertise.concat(value);
                    }
                    if(value.status == 3) {
                        tempSettlementApproved = tempSettlementApproved.concat(value);
                    }
                })
                data.documentSupport.forEach(value => {
                    if(value?.support_request?.status == 2 )
                    {
                        tempDocumentSupportExpertise = tempDocumentSupportExpertise.concat(value);
                    }
                    if(value?.support_request?.status == 3 )
                    {
                        tempDocumentSupportApproved = tempDocumentSupportApproved.concat(value);
                    }
                })
                data.schoolFeeSupport.forEach(value => {
                    if(value?.support_request?.status == 2 )
                    {
                        tempSchoolFeeSupportExpertise = tempSchoolFeeSupportExpertise.concat(value);
                    }
                    if(value?.support_request?.status == 3 )
                    {
                        tempSchoolFeeSupportApproved = tempSchoolFeeSupportApproved.concat(value);
                    }
                })
                data.laborSupport.forEach(value => {
                    if(value?.support_request?.status == 2 )
                    {
                        tempLaborSupportExpertise = tempLaborSupportExpertise.concat(value);
                    }
                    if(value?.support_request?.status == 3 )
                    {
                        tempLaborSupportApproved = tempLaborSupportApproved.concat(value);
                    }
                })
                setSettlementExpertise(tempSettlementExpertise);
                setSettlementApproved(tempSettlementApproved);
                setDocumentSupportExpertise(tempDocumentSupportExpertise);
                setDocumentSupportApproved(tempDocumentSupportApproved);
                setSchoolFeeSupportExpertise(tempSchoolFeeSupportExpertise);
                setSchoolFeeSupportApproved(tempSchoolFeeSupportApproved);
                setLaborSupportExpertise(tempLaborSupportExpertise);
                setLaborSupportApproved(tempLaborSupportApproved);
            }
    }, [data]);
    return data !== undefined ? (
        <List style={{ width: 700}}>
            {settlementExpertise.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/settlement/' + value.id)}>
                        <ListItemText primary={value.company?.name !== undefined ? "Quyết toán đang chờ thẩm định: " + value.company?.name : "Quyết toán đang chờ thẩm định: " + value.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <MonetizationOnIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
            {settlementApproved.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/settlement/' + value.id)}>
                        <ListItemText primary={value.company?.name !== undefined ? "Quyết toán đang chờ phê duyệt: " + value.company?.name : "Quyết toán đang chờ phê duyệt: " + value.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <MonetizationOnIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
            { documentSupportExpertise.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/documentSupport/' + value.id)}>
                        <ListItemText primary={value?.support_request?.company?.name !== undefined ? "Yêu cầu hỗ trợ tài liệu đang chờ thẩm định: " + value?.support_request.company?.name : "Yêu cầu hỗ trợ tài liệu đang chờ thẩm định: " + value?.support_request.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <DescriptionIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
            { documentSupportApproved.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/documentSupport/' + value.id)}>
                        <ListItemText primary={value?.support_request.company?.name !== undefined ? "Yêu cầu hỗ trợ tài liệu đang chờ phê duyệt: " + value?.support_request.company?.name : "Yêu cầu hỗ trợ tài liệu đang chờ phê duyệt: " + value?.support_request.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <DescriptionIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
            { schoolFeeSupportExpertise.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/schoolFeeSupport/' + value.id)}>
                        <ListItemText primary={value?.support_request?.company?.name !== undefined ? "Yêu cầu hỗ trợ học phí đang chờ thẩm định: " + value?.support_request.company?.name : "Yêu cầu hỗ trợ học phí đang chờ thẩm định: " + value?.support_request.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <SchoolIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
            { schoolFeeSupportApproved.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/schoolFeeSupport/' + value.id)}>
                        <ListItemText primary={value?.support_request.company?.name !== undefined ? "Yêu cầu hỗ trợ học phí đang chờ phê duyệt: " + value?.support_request.company?.name : "Yêu cầu hỗ trợ học phí đang chờ phê duyệt: " + value?.support_request.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <SchoolIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}

            { laborSupportExpertise.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/schoolFeeSupport/' + value.id)}>
                        <ListItemText primary={value?.support_request?.company?.name !== undefined ? "Yêu cầu hỗ trợ học phí đang chờ thẩm định: " + value?.support_request.company?.name : "Yêu cầu hỗ trợ học phí đang chờ thẩm định: " + value?.support_request.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <AccessibleIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
            { laborSupportApproved.map(value => {
                return (
                    <ListItem button={true} onClick={() => history.push('/quanly/schoolFeeSupport/' + value.id)}>
                        <ListItemText primary={value?.support_request.company?.name !== undefined ? "Yêu cầu hỗ trợ học phí đang chờ phê duyệt: " + value?.support_request.company?.name : "Yêu cầu hỗ trợ học phí đang chờ phê duyệt: " + value?.support_request.labor_department?.name} />
                        <ListItemIcon className={classes.icon}>
                            <AccessibleIcon />
                        </ListItemIcon>
                    </ListItem>
                )
            })}
        </List>
    ) : (<CachedIcon />)
}
