import React, { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import HeaderInfo from "./HeaderInfo";
import Nav from "./Nav";
import Logo from "./Logo";

const Header = React.memo((props) => {
  const classes = useStyle();

  return (
    <header className={classes.header}>
      <HeaderInfo />
      <Logo />
      <Nav />
    </header>
  );
});
const useStyle = makeStyles({
  header: {},
});

export default Header;
