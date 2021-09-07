import React, { useMemo, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Container, Grid } from "@material-ui/core";
import logo from "../../../../assets/front/image/logo2.svg";
import mail from "../../../../assets/front/image/mail.svg";
import mark from "../../../../assets/front/image/mark.svg";
import mobilePhone from "../../../../assets/front/image/mobile-phone.svg";
import building from "../../../../assets/front/image/building.svg";
import { useFetch } from "../../../../api/api";
import { useParams } from "react-router-dom";

const Footer = React.memo((props) => {
  const classes = useStyle();
  const params = useParams();
  const { data: data } = useFetch(["get", "/front/frontSettings"]);
  const FooterTop = useMemo(() => {
    return (
      <Grid
        className={classes.footerTop}
        container
        justify="center"
        alignItems="center"
      >
        <Grid item className={classes.footerLogo}>
          <img src={process.env.REACT_APP_STORAGE_URL + data?.logo_url} />
          {/* <img src={logo} /> */}
        </Grid>
        <Grid item className={classes.detail}>
          <Grid className={classes.detailItem} container wrap="nowrap">
            <Grid className={classes.detailIcon}>
              <img src={mark} />
            </Grid>
            <Grid>{data?.address_footer}</Grid>
          </Grid>
          <Grid className={classes.detailItem} container wrap="nowrap">
            <Grid className={classes.detailIcon}>
              <img src={mobilePhone} />
            </Grid>
            <Grid>{data?.contact_hotline}</Grid>
          </Grid>
          <Grid className={classes.detailItem} container wrap="nowrap">
            <Grid className={classes.detailIcon}>
              <img src={mail} />
            </Grid>
            <Grid className={classes.mail}>{data?.contact_mail}</Grid>
          </Grid>
          <Grid className={classes.detailItem} container wrap="nowrap">
            <Grid className={classes.detailIcon}>
              <img src={building} />
            </Grid>
            <Grid>{data?.building_footer}</Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  });

  return (
    <Container
      className={classes.footer}
      component="footer"
      disableGutters
      maxWidth={false}
    >
      <Grid>
        {FooterTop}
      </Grid>
    </Container>
  );
});
const useStyle = makeStyles((theme) => ({
  footer: {
    backgroundColor: "#F7F7F7",
  },
  footerTop: {
    minHeight: 200,
    border: "1px solid #E1E1E1",
    [theme.breakpoints.only("xs")]: {
      padding: "30px 15px",
    },
  },
  footerLogo: {
    maxWidth: 346,
    width: "100%",
    "& img": {
      width: "100%",
    },
    marginRight: 45,
    [theme.breakpoints.only("xs")]: {
      margin: 0,
      paddingBottom: 30,
    },
  },
  detail: {
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.8rem",
  },
  detailItem: {
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 15,
  },
  footerBottom: {
    minHeight: 100,
    padding: "10px 0px",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: "0.75rem",
    lineHeight: "1.256rem",
    alignItems: "flex-end",
  },
  mail: {
    color: "rgb(245, 69, 75)",
  },
}));
export default Footer;
