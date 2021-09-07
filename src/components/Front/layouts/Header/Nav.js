import React, { useState, useMemo, Fragment, useEffect, useRef, useContext } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
  BottomNavigation,
  BottomNavigationAction,
  Grid,
  Button,
  Container,
  Popper,
  Paper,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
} from "@material-ui/core";
import Menu from "./Menu";
import { AuthContext } from "../../../../common/AuthProvider";
import hamberger from "../../../../assets/front/image/menu.svg";
import closeHam from "../../../../assets/front/image/closeHam.svg";
import Logo from "../../../../assets/front/image/logo-mobile.svg";
import { Link, useLocation } from "react-router-dom";
import { useFetch } from "../../../../api/api";

const Nav = React.memo((props) => {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [mobile, setMobile] = useState(false);
  const anchorEl = useRef(null);
  const { admin, clear } = useContext(AuthContext);
  const [openedCate, setOpenedCate] = useState(false);
  const {
    data: categories,
    revalidate: refetch,
    loading: userLoading,
    error: errors,
  } = useFetch(["get", "front/categories", JSON.stringify({ per_page: 100 })]);
  const categoryNav = useMemo(() => {
    let convert = categories?.data
      .map((e) => {
        return {
          href:
            "/" +
            e.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/Đ/g, "D")
              .replace(/\s/g, "-") +
            "." +
            e.id,
          text: e.name,
        };
      })
      .map((e, i) => (
        <ListItem
          button
          className={classes.navMobileItem}
          key={i}
          onClick={() => setMobile(false)}
        >
          <Link to={e.href}>
            <ListItemText primary={e.text} />
          </Link>
        </ListItem>
      ));
    return convert;
  }, [categories]);

  const NavMobile = useMemo(() => {
    return (
      <div className={classes.NavMobile}>
        <div>
          <img
            src={hamberger}
            className="hamberger"
            onClick={() => setMobile((pre) => !pre)}
          />
        </div>
        <div className="logo-mobile">
          <img src={Logo} />
        </div>
        <Drawer
          anchor="left"
          open={mobile}
          onClose={() => setMobile(false)}
          PaperProps={{
            className: classes.containerNavMobile,
          }}
        >
          <div className={classes.closeNav}>
            <img src={closeHam} onClick={() => setMobile((pre) => !pre)} />
          </div>
          <div className={classes.navMobileItems}>
            <List component="nav" aria-labelledby="nested-list-subheader">
              <ListItem
                button
                className={classes.navMobileItem}
                onClick={() => setMobile(false)}
              >
                <Link to="/">
                  <ListItemText primary="Trang chủ" />
                </Link>
              </ListItem>
              <ListItem
                button
                className={classes.navMobileItem}
                onClick={() => setMobile(false)}
              >
                <Link to="/gioi-thieu">
                  <ListItemText primary="Giới thiệu" />
                </Link>
              </ListItem>
              <ListItem
                button
                onClick={() => setOpenedCate((pre) => !pre)}
                className={classes.navMobileItemNews}
              >
                <span>
                  <ListItemText primary="Tin tức" />
                </span>
              </ListItem>
              <Collapse in={openedCate} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  className={classes.navMoblileItemChild}
                >
                  {categoryNav}
                </List>
              </Collapse>
              <ListItem
                button
                className={classes.navMobileItem}
                onClick={() => setMobile(false)}
              >
                <Link to="/van-ban">
                  <ListItemText primary="Văn bản" />
                </Link>
              </ListItem>
              <ListItem
                button
                className={classes.navMobileItem}
                onClick={() => setMobile(false)}
              >
                <Link to="/lien-he">
                  <ListItemText primary="Liên hệ" />
                </Link>
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
    );
  });

  return (
    <div>
      {NavMobile}
      <div className={classes.root}>
        <Container>
          <Grid>
            <Navbar
              value={value}
              onChange={(event, newValue) => {
                setValue(newValue);
              }}
              showLabels
            >
              <Link to="/" className={classes.link}>
                <Btn className={props?.pathname == "/" ? classes.selected : ""}>
                  <span>Trang chủ</span>
                </Btn>
              </Link>
              <Link to="/gioi-thieu" className={classes.link}>
                <Btn
                  className={
                    props?.pathname == "gioi-thieu" ? classes.selected : ""
                  }
                >
                  <span>Giới thiệu</span>
                </Btn>
              </Link>
              <Menu pathname={value} categories={categories} />
              <Link to="/van-ban" className={classes.link}>
                <Btn
                  className={
                    props?.pathname == "van-ban" ? classes.selected : ""
                  }
                >
                  <span>Văn bản</span>
                </Btn>
              </Link>
              <Link to="/lien-he" className={classes.link}>
                <Btn
                  className={
                    props?.pathname == "lien-he" ? classes.selected : ""
                  }
                >
                  <span>Liên Hệ</span>
                </Btn>
              </Link>
              <div>
                {admin?.user_name != null && (
                  <Link to={"/quanly/"} className={classes.link}>
                    <Btn
                      className={
                        props?.pathname == "quan-ly" ? classes.selected : ""
                      }
                    >
                      <span>Quản lý</span>
                    </Btn>
                  </Link>
                )}
              </div>
            </Navbar>
          </Grid>
        </Container>
      </div>
    </div>
  );
});
const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: "center",
    background: "#E2363C",
    height: "46px",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  NavMobile: {
    height: 70,
    display: "none",
    [theme.breakpoints.down("xs")]: {
      display: "flex",
      alignItems: "center",
      "& .hamberger": {
        marginLeft: 18,
      },
      "& .logo-mobile": {
        paddingLeft: 33,
        "& img": {
          width: "95%",
        },
      },
    },
  },
  containerNavMobile: {
    display: "none",
    [theme.breakpoints.only("xs")]: {
      display: "flex",
      width: "70%",
      background: "#E2363C",
    },
  },
  closeNav: {
    margin: "60px 0px 48px 35px",
  },
  navMobileItems: {
    "& a": {
      width: "100%",
      height: "100%",
      textDecoration: "none",
      color: "#fff",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      fontWeight: "bold!important",
      fontSize: "0.875rem",
      lineHeight: "1.2rem",
      padding: "10px 20px 10px 30px",
    },
    "& span": {
      width: "100%",
      height: "100%",
      color: "#fff",
      textTransform: "uppercase",
      fontFamily: "Roboto",
      fontWeight: "bold!important",
      fontSize: "0.875rem",
      lineHeight: "1.2rem",
    },
  },
  navMobileItem: {
    boxShadow: "inset 0px -1px 0px #EC494F, inset 0px 1px 0px #EC494F",
    padding: 0,
  },
  navMoblileItemChild: {
    "& a": {
      paddingLeft: 50,
    },
  },
  selected: {
    color: "#fff",
    background: "#F5454B!important",
  },
  link: {
    textDecoration: "none",
    flex: 1,
    boxShadow: "inset -1px 0px 0px #EC494F, inset 1px 0px 0px #EC494F",
    maxWidth: 168,
    minWidth: 80,
  },
  navMobileItemNews: {
    padding: "10px 20px 10px 30px",
    boxShadow: "inset 0px -1px 0px #EC494F, inset 0px 1px 0px #EC494F",
  },
}));
const Btn = withStyles({
  root: {
    color: "#fff",
    background: "#E2363C",
    padding: "6px 12px 8px",
    maxWidth: 168,
    minWidth: 80,
    height: "100%",
    width: "100%",
  },
  "& span": {
    width: "100%",
    color: "#fff",
    fontFamily: "Roboto",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
})(Button);
const NavItem = withStyles({
  root: {
    color: "#fff",
    boxShadow: "inset -1px 0px 0px #EC494F, inset 1px 0px 0px #EC494F",
  },
  selected: {
    color: "#fff",
    background: "#F5454B",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    "&$selected": {
      fontSize: "0.875rem",
    },
  },
})(BottomNavigationAction);
const Navbar = withStyles({
  root: {
    background: "#E2363C",
    height: 46,
  },
})(BottomNavigation);
export default Nav;
