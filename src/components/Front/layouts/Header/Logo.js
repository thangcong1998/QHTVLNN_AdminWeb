import React from "react";
import LogoDesktop from "../../../../assets/front/image/logo.svg";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import banner from "../../../../assets/front/image/Whrmcr_1mjk.png";
import LogoText from "../../../../assets/front/image/text.svg";
import abb from "../../../../assets/front/image/abb.svg";

const Logo = React.memo((props) => {
  const classes = useStyle();
  return (
    <Grid container className={classes.Logo}>
      <div className={classes.backlogo}>
        <div className={classes.img}>
          <img src={LogoDesktop} />
          <Grid
            className={classes.logoText}
            container
            direction="column"
            alignItems="flex-start"
          >
            <img src={abb} />
            <img src={LogoText} />
          </Grid>
        </div>
      </div>
    </Grid>
  );
});
const useStyle = makeStyles((theme) => ({
  Logo: {
    background:
      "linear-gradient(270deg, rgba(255, 255, 255, 0) 41.94%, #FFFFFF 68.58%)",
    // padding: "11px 0px",
    alignSelf: "flex-end",
    display: "flex",
    justifyContent: "center",
    backgroundImage: `url(${banner})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "#fff",
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  backlogo: {
    background:
      "linear-gradient(270deg, rgba(255, 255, 255, 0) 41.94%, #FFFFFF 68.58%)",
    display: "flex",
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  logoText: {
    margin: 10,
  },
  img: {
    display: "flex",
    background:
      "linear-gradient(270deg, rgba(255, 255, 255, 0) 41.94%, #FFFFFF 68.58%)",
    maxWidth: 1132,
    padding: "11px 0px",
    width: "100%",
  },
}));
export default Logo;
