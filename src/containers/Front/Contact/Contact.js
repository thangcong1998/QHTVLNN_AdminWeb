import React, { memo, Fragment } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { useFetch } from "../../../api/api";

const Contact = React.memo(() => {
  const classes = useStyle();
  const { data: data } = useFetch(["get", "/front/frontSettings"]);
  return (
    <Fragment>
      <Grid className={classes.root}>
        {/* <div className={classes.Contact}>THÔNG TIN LIÊN HẸ</div> */}
        <Grid container direction="row" justify="center" alignItems="center">
          <h3>BỘ LAO ĐỘNG - THƯƠNG BINH VÀ XÃ HỘI</h3>
        </Grid>
        <Grid container direction="row" justify="center" alignItems="center">
          <h2>QUỸ HỖ TRỢ LAO ĐỘNG NGOÀI NƯỚC</h2>
        </Grid>
        <p>Địa Chỉ:{data?.address_footer}</p>
        <p>Điện Thoại:{data?.contact_hotline}</p>
        <p>Fax:{data?.fax_footer}</p>
        <p>Email:{data?.contact_mail}</p>
      </Grid>
      <div className={classes.othernews}>
        <fieldset>
          <legend></legend>
        </fieldset>
      </div>
    </Fragment>
  );
});
const useStyle = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: "800px",
    paddingLeft: 10,
  },
  Contact: {
    backgroundColor: "#E2363C",
    color: "#fff",
  },
  othernews: {
    "& fieldset": {
      width: "100%",
      border: "none",
      border: "none",
      borderTop: "1px solid #E4E4E4",
      padding: "0px",
    },
    "& legend": {
      padding: "0px 0px 14px 0px",
    },
    "& h2": {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontStyle: "normal",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
}));
export default Contact;
