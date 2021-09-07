import React, { Fragment, Suspense, useMemo, useEffect, useState } from "react";
import Header from "./layouts/Header/Header";
import Footer from "./layouts/Footer/Footer";
import { Switch, Route, useLocation } from "react-router-dom";
import { useRouteContext } from "../../common/RouteProvider";
import Loading from "./loading";
import BreadCrums from "./BreadCrums";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Container } from "@material-ui/core";
import SideBar from "./SideBar";
import HotNews from "../../containers/Front/Home/HotNews";

const Layout = React.memo((props) => {
  const classes = useStyle();
  const { AllRoutes } = useRouteContext();
  const location = useLocation();
  const [path, setPath] = useState("");

  useEffect(() => {
    if (location.pathname === "/") setPath("/");
  }, [location.pathname]);

  const crumbs = useMemo(() => {
    const destructPath = [
      "/",
      ...path
        .split("/")
        .slice(1)
        .map((path) => "/" + path)
        .reduce((a, c) => [...a, a.length ? a[a.length - 1] + c : c], []),
    ];
    const crumbNames = AllRoutes.filter((route) =>
      destructPath.includes(route.path)
    ).map((route) => ({
      name: route.label,
    }));
    const crumbPaths = [
      "/",
      ...location.pathname
        .split("/")
        .slice(1)
        .map((path) => "/" + path)
        .reduce((a, c) => [...a, !a.length ? c : a[a.length - 1] + c], []),
    ];
    return crumbNames.map((crum, index) => ({
      name: crum.name,
      path: crumbPaths[index],
    }));
  }, [location.pathname, path]);

  function render(route, index) {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={true}
        render={(_) => {
          setPath(route.path);
          return <route.component />;
        }}
      />
    ) : null;
  }

  const routes = useMemo(() => {
    return AllRoutes;
  }, [AllRoutes]);

  return (
    <Fragment>
      <Header />
      {location.pathname === "/" ? <HotNews /> : ""}
      <BreadCrums crumbs={crumbs} />
      <Suspense fallback={<Loading />}>
        <Container
          maxWidth={false}
          disableGutters
          className={classes.container}
        >
          <Switch>{routes.map((route, index) => render(route, index))}</Switch>
          <Grid item className={classes.sidebar}>
            <SideBar />
          </Grid>
        </Container>
      </Suspense>
      <Footer />
    </Fragment>
  );
});
const useStyle = makeStyles((theme) => ({
  root: {},
  container: {
    marginTop: 30,
    maxWidth: 1140,
    display: "flex",
    [theme.breakpoints.between(960, "md")]: {
      padding: "0 10px",
      width: "100%",
    },
    [theme.breakpoints.between("sm", 960)]: {
      padding: "0 10px",
      width: "100%",
      flexWrap: "wrap",
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      display: "flex",
      flexWrap: "wrap",
    },
  },
  sidebar: {
    maxWidth: 297,
    textAlign: "right",
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      padding: "0px 15px",
      maxWidth: "unset",
    },
  },
}));
export default Layout;
