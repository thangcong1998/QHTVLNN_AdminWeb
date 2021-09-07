import React, { createContext, useMemo, useContext, useState } from "react";
import { routes } from "../routes/Front/routes";
import { useFetch } from "../api/api";
import { useLocation } from "react-router-dom";

const Category = React.lazy(() =>
  import("../containers/Front/Category/Categories")
);
const Detail = React.lazy(() => import("../containers/Front/Article/Detail"));

const RouteContext = createContext({});

function RouteProvider(props) {
  const {
    data: categories,
    revalidate: refetch,
    loading: userLoading,
    error: errors,
  } = useFetch(["get", "front/categories", JSON.stringify({ per_page: 1000 })]);

  const AllRoutes = useMemo(() => {
    let c = [];
    if (categories) {
      let rc = categories?.data?.map((e) => {
        return {
          path:
            "/" +
            e.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/Đ/g, "D")
              .replace(/\s/g, "-") +
            "." +
            e.id,
          label: e.name,
          component: Category,
        };
      });
      let rcd = categories?.data?.map((e) => {
        return {
          path:
            "/" +
            e.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d")
              .replace(/Đ/g, "D")
              .replace(/\s/g, "-") +
            "." +
            e.id +
            "/:id",
          component: Detail,
        };
      });
      c = routes.concat(rc, rcd);
    } else {
      c = routes;
    }
    return c;
  }, [categories]);

  const routeValue = {
    AllRoutes,
    categories: categories?.data,
  };
  return <RouteContext.Provider value={routeValue} {...props} />;
}
export const useRouteContext = () => useContext(RouteContext);

export default RouteProvider;
