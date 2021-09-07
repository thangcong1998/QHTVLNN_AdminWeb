import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Grid } from "@material-ui/core";
import crumsvg from "../../assets/front/image/crumbs.svg";
import { makeStyles } from "@material-ui/core/styles";

const BreadCrums = React.memo((props) => {
  const classes = useStyle();
  const crumbs = props.crumbs.slice(0, -1).map((e) => (
    <Link
      to={e.path}
      style={{
        marginRight: 20,
      }}
      className={classes.link}
    >
      <span
        style={{
          color: "#F5454B",
          marginRight: 20,
        }}
      >
        {e.name}
      </span>
      <span>
        <img src={crumsvg} />
      </span>
    </Link>
  ));
  const location = useLocation();
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {location.pathname !== "/" ? (
        <Grid className={classes.container}>{crumbs}</Grid>
      ) : (
        ""
      )}
    </div>
  );
});
const useStyle = makeStyles((theme) => ({
  container: {
    maxWidth: 1140,
    width: "100%",
    padding: "11px 0px 11px 10px",
  },
  link: {
    color: "inherit",
    textDecoration: "none",
  },
}));
export default BreadCrums;
