import React, { useContext } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import PowerSettingsNewIcon from "@material-ui/icons/PowerSettingsNew";
import { AuthContext } from "../../../common/AuthProvider";
import Popover from "../../popover";
import PersonIcon from "@material-ui/icons/Person";
import InfoIcon from "@material-ui/icons/Info";
import LockIcon from "@material-ui/icons/Lock";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import t from "../../../common/admin-text.json";
import { useDialog } from "../../Dialog";
import ChangeInfo from "./ChangeInfo";
import ChangePassword from "./ChangePassword";
import { useHistory, Link } from "react-router-dom";
import Caculator from "../../../assets/image/calculator.png";
import { ReactComponent as Note } from "../../../assets/image/note-plus.svg";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DescriptionIcon from '@material-ui/icons/Description';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccessibleIcon from '@material-ui/icons/Accessible';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import SvgIcon from "@material-ui/core/SvgIcon";
import { Button } from "@material-ui/core";

import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
import Notification from "./Notification";
import { ReactComponent as MoneyIcon } from "../../../assets/image/cash-usd.svg";
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
    '& svg': {
      fontSize: "2rem",
      width: '2rem',
      height: '2rem'
    }
  },
}));

export default function Header(props) {
  const { crumbs } = props;
  const classes = useStyles();
  const theme = useTheme();
  const handleDrawerToggle = () => {
    props.setOpen((pre) => !pre);
  };
  const { dialog, handleClose } = useDialog();
  const { admin, clear } = useContext(AuthContext);
  const history = useHistory();
  const infomation = async () => {
    await dialog({
      title: "Thông tin cá nhân",
      content: <ChangeInfo close={handleClose} />,
    });
  };

  const changePassword = async () => {
    await dialog({
      title: "Đổi mật khẩu",
      content: <ChangePassword close={handleClose} />,
    });
  };

  const logout = () => {
    clear();
    history.push("/quanly/");
  };
  const user = () => {
    return (
      <List>
        <ListItem button={true} onClick={infomation}>
          <ListItemText primary={"Thông tin cá nhân"} />
          <ListItemIcon className={classes.icon}>
            <InfoIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={changePassword}>
          <ListItemText primary={"Đổi mật khẩu"} />
          <ListItemIcon className={classes.icon}>
            <LockIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={() => logout()}>
          <ListItemText primary={"Đăng xuất"} />
          <ListItemIcon className={classes.icon}>
            <PowerSettingsNewIcon />
          </ListItemIcon>
        </ListItem>
      </List>
    );
  };
  const support = () => {
    return (
      <List>
        <ListItem button={true} onClick={() => history.push('/quanly/settlement/create')}>
          <ListItemText primary={"Thêm mới quyết toán theo thu nhập"} />
          <ListItemIcon className={classes.icon}>
            <MoneyIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={() => history.push('/quanly/settlement/create2')}>
          <ListItemText primary={"Thêm mới quyết toán theo người lao động nộp quỹ"} />
          <ListItemIcon className={classes.icon}>
            <Note />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={() => history.push('/quanly/documentSupport/create')}>
          <ListItemText primary={"Thêm mới yêu cầu hỗ trợ tài liệu"} />
          <ListItemIcon className={classes.icon}>
            <DescriptionIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={() => history.push('/quanly/schoolFeeSupport/create')}>
          <ListItemText primary={"Thêm mới yêu cầu hỗ trợ học phí"} />
          <ListItemIcon className={classes.icon}>
            <MonetizationOnIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={() => history.push('/quanly/laborSupport/create')}>
          <ListItemText primary={"Thêm mới yêu cầu hỗ trợ rủi ro"} />
          <ListItemIcon className={classes.icon}>
            <AccessibleIcon />
          </ListItemIcon>
        </ListItem>
        <ListItem button={true} onClick={() => history.push('/quanly/otherSupport/create')}>
          <ListItemText primary={"Thêm mới yêu cầu hỗ trợ khác"} />
          <ListItemIcon className={classes.icon}>
            <AssignmentLateIcon />
          </ListItemIcon>
        </ListItem>
      </List>
    )
  };
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.open,
        })}
      >
        <Toolbar className={classes.toolbar}>
          <div className={classes.leftBar}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
            >
              {props.open ? <ArrowBackIcon /> : <MenuIcon />}
            </IconButton>
            <div style={{
              fontSize: "1.142rem",
              color: "#fff",
              textTransform: 'uppercase'
            }}>
              <b>
                Phần mềm quản lý quỹ hỗ trợ việc làm nước ngoài
              </b>
            </div>
            {/* <div className={classes.breadcrumbs}>{crumbs()}</div> */}
          </div>
          <div className={classes.rightBar}>
            {admin?.user_type == 1 && (
              <Popover
                children={
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={clear}
                    edge="end"
                    style={{ marginRight: 20 }}
                  >
                    <NotificationsNoneIcon />
                  </IconButton>
                }
                content={<Notification />}
              />
            )}
            {admin?.user_type != 1 && (
              <Popover
                children={
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={clear}
                    edge="end"
                    style={{ marginRight: 20 }}
                  >
                    <img src={Caculator} style={{ width: '2rem' }} />
                  </IconButton>
                }
                content={support()}
              />
            )}
            {admin.user_type == 1 && <p style={{ fontSize: 18 }}>Xin chào: {admin.full_name}</p>}
            {admin.user_type == 2 && <p style={{ fontSize: 18 }}>Xin chào: {admin?.company?.name}</p>}
            {admin.user_type == 3 && <p style={{ fontSize: 18 }}>Xin chào: {admin?.labor_department?.name}</p>}
            <Popover
              children={
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={clear}
                  edge="end"
                >
                  <PersonIcon />
                </IconButton>
              }
              content={user()}
            />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
