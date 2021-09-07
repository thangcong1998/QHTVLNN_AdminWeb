import React, { useState, useContext, useEffect } from "react";
import {
  Drawer,
  IconButton,
  List,
  Divider,
  Collapse,
  SvgIcon,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useLocation, useHistory } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import DashboardIcon from '@material-ui/icons/Dashboard';
import CategoryIcon from "@material-ui/icons/Category";
import DescriptionIcon from "@material-ui/icons/Description";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
import SettingsIcon from "@material-ui/icons/Settings";
import PeopleIcon from "@material-ui/icons/People";
import HistoryIcon from "@material-ui/icons/History";
import GroupWorkIcon from "@material-ui/icons/GroupWork";
import clsx from "clsx";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import ApartmentIcon from "@material-ui/icons/Apartment";
import WorkIcon from "@material-ui/icons/Work";
import { ReactComponent as System } from "../../../assets/image/system.svg";
import ComputerIcon from "@material-ui/icons/Computer";
import { ReactComponent as Category } from "../../../assets/image/category.svg";
import { ReactComponent as Domain } from "../../../assets/image/domain.svg";
import { ReactComponent as Support } from "../../../assets/front/image/sidebar/face-agent.svg";
import { AuthContext } from "../../../common/AuthProvider";
import './ScrollBarCss.css';
import company from '../../../../src/assets/image/work.png';
import department from '../../../../src/assets/image/department.png';
import jobTitle from '../../../../src/assets/image/jobTitle.png';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccessibleIcon from '@material-ui/icons/Accessible';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';

const sidebarList = [
  {
    path: "/quanly",
    label: "Dashboard",
    perm: "",
    icon: <DashboardIcon />,
  },
  {
    label: "Quản trị hệ thống",
    icon: (
      <SvgIcon>
        <System />
      </SvgIcon>
    ),
    perm: ["user_view", "role_view", "audit_view"],
    children: [
      {
        path: "/quanly/user",
        label: "Người dùng",
        perm: "user_view",
        icon: <PeopleIcon />,
      },
      {
        path: "/quanly/role",
        label: "Nhóm người dùng",
        perm: "role_view",
        icon: <GroupWorkIcon />,
      },
      {
        path: "/quanly/audit",
        label: "Lịch sử thay đổi dữ liệu",
        perm: "audit_view",
        icon: <HistoryIcon />,
      },
    ],
  },
  {
    label: "Quản trị danh mục",
    icon: <Category />,
    perm: "category_manage",
    children: [
      {
        path: "/quanly/regions",
        label: "Đơn vị hành chính",
        perm: "",
        icon: <LocationCityIcon />,
      },
      {
        path: "/quanly/countries",
        label: "Thị trường lao động",
        perm: "",
        icon: <ApartmentIcon />,
      },
      {
        path: "/quanly/departments",
        label: "Phòng ban",
        perm: "",
        icon: <WorkIcon />,
      },
      {
        path: "/quanly/companyTypes",
        label: "Loại công ty",
        perm: "",
        icon: <EmojiTransportationIcon />,
      },
      {
        path: "/quanly/jobTitles",
        label: "Chức vụ",
        perm: "",
        icon: <img src={jobTitle} height={24} width={24} />,
      },
    ],
  },
  {
    label: "Cổng thông tin điện tử",
    icon: <ComputerIcon />,
    perm: [
      "articleCategory_manage",
      "article_view",
      "article_all",
      "document_view",
      "frontSetting_manage",
    ],
    children: [
      {
        path: "/quanly/category",
        label: "Danh mục",
        perm: "articleCategory_manage",
        icon: <CategoryIcon />,
      },
      {
        path: "/quanly/article",
        label: "Bài viết",
        perm: ["article_view", "article_all"],
        icon: <DescriptionIcon />,
      },
      {
        path: "/quanly/document",
        label: "Văn bản",
        perm: "document_view",
        icon: <InsertDriveFileIcon />,
      },
      {
        path: "/quanly/setting",
        label: "Cài đặt giao diện",
        perm: "frontSetting_manage",
        icon: <SettingsIcon />,
      },
    ],
  },
  {
    label: "THÔNG TIN DN, sở LĐ-TB-XH",
    perm: ["companies_view", "labor_department_view"],
    icon: (
      <SvgIcon>
        <Domain />
      </SvgIcon>
    ),
    children: [
      {
        path: "/quanly/companies",
        label: "Thông tin doanh nghiệp",
        perm: "companies_view",
        icon: <img src={company} width={24} height={24} />,
      },
      {
        path: "/quanly/laborDepartment",
        label: "Thông tin sở LĐ-TB-XH",
        perm: "labor_department_view",
        icon: <img src={department} width={24} height={24} />,
      },
    ],
  },
  {
    label: "QUẢN LÝ QUYẾT TOÁN",
    path: "/quanly/settlement",
    perm: "settlement_view",
    icon: <DescriptionIcon />,
  },
  {
    label: "YÊU CẦU HỖ TRỢ",
    icon: (
      <SvgIcon>
        <Support />
      </SvgIcon>
    ),
    children: [
      {
        path: "/quanly/documentSupport",
        label: "Hỗ trợ tài liệu",
        perm: "",
        icon: <DescriptionIcon />,
      },
      {
        path: "/quanly/schoolFeeSupport",
        label: "Hỗ trợ học phí",
        perm: "",
        icon: <MonetizationOnIcon />,
      },
      {
        path: "/quanly/laborSupport",
        label: "Hỗ trợ rủi ro",
        perm: "",
        icon: <AccessibleIcon />,
      },
      {
        path: "/quanly/otherSupportRequest",
        label: "Hỗ trợ khác",
        perm: "",
        icon: <AssignmentLateIcon />,
      },
    ],
  },
  {
    path: "/quanly/report",
    label: "BÁO CÁO THỐNG KÊ",
    perm: "",
    icon: <InsertDriveFileIcon />,
  },
  {
    path: "/",
    label: "Cổng thông tin",
    perm: "",
    icon: <HomeIcon />
  }
];

const sidebarList2 = [
  {
    label: "Quản trị hệ thống",
    icon: (
        <SvgIcon>
          <System />
        </SvgIcon>
    ),
    perm: ["user_view", "role_view", "audit_view"],
    children: [
      {
        path: "/quanly/user",
        label: "Người dùng",
        perm: "user_view",
        icon: <PeopleIcon />,
      },
      {
        path: "/quanly/role",
        label: "Nhóm người dùng",
        perm: "role_view",
        icon: <GroupWorkIcon />,
      },
      {
        path: "/quanly/audit",
        label: "Lịch sử thay đổi dữ liệu",
        perm: "audit_view",
        icon: <HistoryIcon />,
      },
    ],
  },
  {
    label: "Quản trị danh mục",
    icon: <Category />,
    perm: "category_manage",
    children: [
      {
        path: "/quanly/regions",
        label: "Đơn vị hành chính",
        perm: "",
        icon: <LocationCityIcon />,
      },
      {
        path: "/quanly/countries",
        label: "Thị trường lao động",
        perm: "",
        icon: <ApartmentIcon />,
      },
      {
        path: "/quanly/departments",
        label: "Phòng ban",
        perm: "",
        icon: <WorkIcon />,
      },
      {
        path: "/quanly/companyTypes",
        label: "Loại công ty",
        perm: "",
        icon: <EmojiTransportationIcon />,
      },
      {
        path: "/quanly/jobTitles",
        label: "Chức vụ",
        perm: "",
        icon: <img src={jobTitle} height={24} width={24} />,
      },
    ],
  },
  {
    label: "Cổng thông tin điện tử",
    icon: <ComputerIcon />,
    perm: [
      "articleCategory_manage",
      "article_view",
      "article_all",
      "document_view",
      "frontSetting_manage",
    ],
    children: [
      {
        path: "/quanly/category",
        label: "Danh mục",
        perm: "articleCategory_manage",
        icon: <CategoryIcon />,
      },
      {
        path: "/quanly/article",
        label: "Bài viết",
        perm: ["article_view", "article_all"],
        icon: <DescriptionIcon />,
      },
      {
        path: "/quanly/document",
        label: "Văn bản",
        perm: "document_view",
        icon: <InsertDriveFileIcon />,
      },
      {
        path: "/quanly/setting",
        label: "Cài đặt giao diện",
        perm: "frontSetting_manage",
        icon: <SettingsIcon />,
      },
    ],
  },
  {
    label: "THÔNG TIN DN, sở LĐ-TB-XH",
    perm: ["companies_view", "labor_department_view"],
    icon: (
        <SvgIcon>
          <Domain />
        </SvgIcon>
    ),
    children: [
      {
        path: "/quanly/companies",
        label: "Thông tin doanh nghiệp",
        perm: "companies_view",
        icon: <img src={company} width={24} height={24} />,
      },
      {
        path: "/quanly/laborDepartment",
        label: "Thông tin sở LĐ-TB-XH",
        perm: "labor_department_view",
        icon: <img src={department} width={24} height={24} />,
      },
    ],
  },
  {
    label: "QUẢN LÝ QUYẾT TOÁN",
    path: "/quanly/settlement",
    perm: "settlement_view",
    icon: <DescriptionIcon />,
  },
  {
    label: "YÊU CẦU HỖ TRỢ",
    icon: (
        <SvgIcon>
          <Support />
        </SvgIcon>
    ),
    children: [
      {
        path: "/quanly/documentSupport",
        label: "Hỗ trợ tài liệu",
        perm: "",
        icon: <DescriptionIcon />,
      },
      {
        path: "/quanly/schoolFeeSupport",
        label: "Hỗ trợ học phí",
        perm: "",
        icon: <MonetizationOnIcon />,
      },
      {
        path: "/quanly/laborSupport",
        label: "Hỗ trợ rủi ro",
        perm: "",
        icon: <AccessibleIcon />,
      },
      {
        path: "/quanly/otherSupportRequest",
        label: "Hỗ trợ khác",
        perm: "",
        icon: <AssignmentLateIcon />,
      },
    ],
  },
  {
    path: "/",
    label: "Cổng thông tin",
    perm: "",
    icon: <HomeIcon />
  }
];
const SideBar = React.memo((props) => {
  const classes = useStyle();
  const theme = useTheme();
  const handleDrawerClose = () => { };
  const location = useLocation();
  const history = useHistory();
  const [open, setOpen] = useState();
  const {admin} = useContext(AuthContext)
  const { perm } = useContext(AuthContext);
  const sideBarInfo = admin?.user_type == 1 ? sidebarList : sidebarList2;
  function CheckPerm(permRoute) {
    if (!permRoute) return true;
    if (Array.isArray(permRoute)) {
      for (let e in permRoute) {
        if (perm?.map((c) => c.name).includes(permRoute[e])) {
          return true;
        }
      }
      return false;
    } else {
      return perm?.map((e) => e.name).includes(permRoute);
    }
  }
  const handleOpen = (e) => {
    if (open == e?.label) {
      setOpen("");
    } else {
      props.setOpen(true);
      setOpen(e?.label);
    }
  };

  useEffect(() => {
    if (!props.open) {
      setOpen("");
    }
  }, [props.open])

  const active = (path) => {
    const pathname = location.pathname.split("/");
    const p = path.split("/");
    if (pathname[2] === p[2]) {
      return true;
    }
    return false;
  };
  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: props.open,
        [classes.drawerClose]: !props.open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: props.open,
          [classes.drawerClose]: !props.open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
              <ChevronLeftIcon />
            )}
        </IconButton>
      </div>
      <Divider />

      {sideBarInfo.map((c, index) =>
        CheckPerm(c.perm) ? (
          <div key={index}>
            <List key={index}>
              <ListItem
                button={true}
                className={
                  c.path
                    ? active(c.path)
                      ? classes.active
                      : classes.unactive
                    : classes.category
                }
                onClick={() => (c.path ? history.push(c.path) : handleOpen(c))}
              >
                {c?.icon && (
                  <ListItemIcon className={classes.categoryIcon}>
                    {c.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={props.open ? c.label : ""} />
              </ListItem>
              <Collapse in={open == c.label} timeout="auto" unmountOnExit>
                {c?.children?.map((e, index) =>
                  CheckPerm(e.perm) ? (
                    <ListItem
                      button
                      key={index}
                      title={e.label}
                      className={`${classes.item} ${
                        active(e.path) ? classes.active : classes.unactive
                        }`}
                      onClick={() => history.push(e.path)}
                    >
                      <ListItemIcon>{e.icon}</ListItemIcon>
                      <ListItemText primary={e.label} />
                    </ListItem>
                  ) : (
                      ""
                    )
                )}
              </Collapse>
            </List>
            <Divider />
          </div>
        ) : (
            ""
          )
      )}
    </Drawer>
  );
});
const drawerWidth = 300;
const useStyle = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    fontSize: "1rem",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  active: {
    minHeight: 48,
    background: "#F3F5FF",
    "& svg": {
      color: "#1166e4",
    },
  },
  unactive: {
    minHeight: 48,
    background: "#fff",
  },
  category: {
    minHeight: 50,
    textTransform: "uppercase",
  },
  categoryIcon: {
    color: "#000",
    minWidth: 40,
  },
  item: {
    paddingLeft: 30,
  },
}));
export default SideBar;
