import React, { Fragment, useState, useEffect, useRef, useMemo } from "react";
import {
  Button,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  MenuList,
  MenuItem,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
const Menu = React.memo((props) => {
  const classes = useStyle();
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);
  const categories = props?.categories ? props.categories : { data: [] };

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
          onClick={() => setOpen(false)}
        >
          <Link to={e.href}>
            <ListItemText primary={e.text} />
          </Link>
        </ListItem>
      ));
    return convert;
  }, [props?.categories]);
  return (
    <Fragment>
      <Btn
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        className={props?.pathname == "tin-tuc" ? classes.selected : ""}
      >
        <span>Tin tức</span>
      </Btn>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List
                  component="div"
                  disablePadding
                  className={classes.navMoblileItemChild}
                >
                  {categoryNav}
                </List>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Fragment>
  );
});
const useStyle = makeStyles((theme) => ({
  selected: {
    color: "#fff",
    background: "#F5454B!important",
  },
  navMoblileItemChild: {
    backgroundColor: "#E2363C",
    "& a": {
      textDecoration: "none",
      width: "100%",
      height: "100%",
      padding: 10,
      color: "#FFF",
    },
  },
}));
const Btn = withStyles({
  root: {
    color: "#fff",
    background: "#E2363C",
    padding: "6px 12px 8px",
    boxShadow: "inset -1px 0px 0px #EC494F, inset 1px 0px 0px #EC494F",
    maxWidth: 168,
    minWidth: 80,
    height: "100%",
    flex: "1",
    "& span": {
      width: "100%",
      color: "#fff",
      fontFamily: "Roboto",
    },
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
})(Button);
const MItem = withStyles({
  root: {
    minWidth: 168,
  },
})(MenuItem);
export default Menu;
