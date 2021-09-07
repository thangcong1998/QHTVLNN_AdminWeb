import React, { useContext, useState } from "react";
import { Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Mail from "../../../../assets/front/image/mail.svg";
import Calendar from "../../../../assets/front/image/calendar.svg";
import MobiblePhone from "../../../../assets/front/image/mobile-phone.svg";
import { AuthContext } from "../../../../common/AuthProvider";
import { Link } from "react-router-dom";
import { useFetch } from "../../../../api/api";
import Moment from 'moment';

const HeaderInfo = React.memo((props) => {
  const classes = useStyle();
  const { data: data } = useFetch(["get", "/front/frontSettings"]);
  const { admin, clear } = useContext(AuthContext);
  const Login = () => (
    <div>
      {admin ? (
        <div>
          Xin chào: {admin.user_name} |{" "}
          <span className={classes.logout} onClick={logout}>
            Đăng xuất
          </span>
        </div>
      ) : (
          <Link className={classes.login} to="/quanly">
            Đăng nhập
          </Link>
        )}
    </div>
  );
  const logout = () => {
    clear();
  };
  return (
    <div className={classes.headerInfo}>
      <Container maxWidth={false} className={classes.container}>
        <Grid
          className={classes.parrent}
          container
          spacing={0}
          alignContent="center"
          justify="space-between"
        >
          <Grid style={{ display: 'flex' }}>
            <Grid item className={classes.date}>
              <img src={Calendar} />
              {Moment(new Date()).format('DD-MM-YYYY')}
            </Grid>
            <Grid item container className="header-hide">
              <Grid item>
                <img src={Mail} />
                <span>{data?.contact_mail}</span>
              </Grid>
              <Grid item>
                <img src={MobiblePhone} />
                <span>{data?.contact_hotline}</span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className={classes.user}>
            {Login()}
          </Grid>
        </Grid>
      </Container>
    </div>
  );
});

const useStyle = makeStyles((theme) => ({
  headerInfo: {
    fontSize: "0.875rem",
    background: "#F7F7F7",
    height: 38,
    boxShadow: "inset 0px -1px 0px #E4E4E4",
    "& img": {
      marginRight: 10,
    },
    "& .header-hide": {
      width: "auto",
      "& span": {
        [theme.breakpoints.down("xs")]: {
          display: "none",
        },
      },
      "& div": {
        marginRight: 30,
      },
    },
  },
  container: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 5
  },
  parrent: {
    maxWidth: "1132px",
    height: "100%",
  },
  date: {
    textAlign: "right",
    marginRight: 30,
  },
  login: {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  logout: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
}));

export default HeaderInfo;
