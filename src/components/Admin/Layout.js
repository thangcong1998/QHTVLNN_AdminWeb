import React, {
  useState,
  Suspense,
  useEffect,
  useMemo,
  useContext,
} from "react";
import Header from "./layout/Header";
import SideBar from "./layout/SideBar";
import { Switch, Route, useLocation } from "react-router-dom";
import Toolbar from "@material-ui/core/Toolbar";
import { makeStyles } from "@material-ui/styles";
import { routes } from "../../routes/Admin/routes";
import AppLoading from "./layout/AppLoading";
import Breadcrumb from "./layout/Breadcrumb";
import { AuthContext } from "../../common/AuthProvider";

const Layout = React.memo((props) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [path, setPath] = useState("");
  const classes = useStyle();
  useEffect(() => {
    if (location.pathname === "/") setPath("/");
  }, [location.pathname, path]);
  const { perm } = useContext(AuthContext);
  const crumbs = useMemo(() => {
    const destructPath = [
      "/",
      ...path
        .split("/")
        .slice(1)
        .map((path) => "/" + path)
        .reduce((a, c) => [...a, a.length ? a[a.length - 1] + c : c], []),
    ];
    const crumbNames = routes
      .filter((route) => destructPath.includes(route.path))
      .map((route) => ({
        name: route.name,
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
      path: crumbPaths[index + 1],
    }));
  }, [location.pathname, path]);

  function CheckPerm(permRoute) {
    if (!permRoute) return true;
    if (Array.isArray(permRoute)) {
      for (let e in permRoute) {
        if (!perm.map((c) => c.name).includes(e)) {
          return false;
        }
      }
      return true;
    } else {
      return perm?.map((e) => e.name).includes(permRoute);
    }
  }

  function render(route) {
    const permRoute = route?.perm;
    if (CheckPerm(permRoute)) {
      return (
        <Route
          path={"/quanly" + route.path}
          exact
          key={route.name}
          render={() => {
            setPath(route.path);
            return <route.component />;
          }}
        />
      );
    }
  }

  return (
    <div className={classes.root}>
      <Header
        open={open}
        setOpen={setOpen}
        crumbs={() => <Breadcrumb crumbs={crumbs} />}
      />
      <SideBar setOpen={setOpen} open={open} />
      <main className={classes.content}>
        <Toolbar className={classes.toolbar}></Toolbar>
        <Breadcrumb crumbs={crumbs} />
        <Suspense fallback={<AppLoading />}>
          <Switch>{routes.map((e) => render(e))}</Switch>
        </Suspense>
      </main>
    </div>
  );
});
const useStyle = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: {
    height: 64,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
export default Layout;
