import React, { Suspense, useMemo, useContext } from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Layout from "../components/Admin/Layout";
import SignIn from "../containers/Admin/Login/Login";
import { AuthContext } from "../common/AuthProvider";
import LayoutFront from "../components/Front/Layout";

function MainRouter() {
  const { admin } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route
          path="/quanly/"
          name="Dash board"
          component={admin ? Layout : SignIn}
        />
        <Route path="/" name="Trang chủ" component={LayoutFront} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default MainRouter;
