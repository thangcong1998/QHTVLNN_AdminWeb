import React, { useMemo } from "react";

const Home = React.lazy(() => import("../../containers/Front/Home/Home"));
const Document = React.lazy(() =>
  import("../../containers/Front/Document/Document")
);
const Introduce = React.lazy(() =>
  import("../../containers/Front/Introduce/Introduce")
);
const Contact = React.lazy(() =>
  import("../../containers/Front/Contact/Contact")
);
const ResetPassword = React.lazy(() => import("../../containers/Admin/Login/ResetPassword"));

export const routes = [
  {
    path: "/",
    component: Home,
    label: "Trang chủ",
  },
  {
    path: "/van-ban",
    component: Document,
    label: "Văn bản",
  },
  {
    path: "/gioi-thieu",
    component: Introduce,
    label: "Giới Thiệu",
  },
  {
    path: "/lien-he",
    component: Contact,
    label: "Giới Thiệu",
  },
  {
    path: "/resetPassword/:id/:name",
    component: ResetPassword
  }
];
