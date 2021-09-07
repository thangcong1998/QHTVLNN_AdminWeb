import React, { useState, useEffect, createContext } from "react";
import { useAPI } from "../api/api";
import Loading from "../components/Admin/layout/Loading";
import { routes } from "../routes/Admin/routes";
export const AuthContext = createContext(null);

const AuthProvider = React.memo((props) => {
  const [admin, setAdmin] = useState(null);
  const [perm, setPerm] = useState(null);
  const [authRoute, setAuthRoute] = useState();
  const api = useAPI();
  const [refetch, setRefetch] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const updateAdminToken = async (token) => {
    localStorage.setItem("admin_token", token);
    try {
      const perm = await api.fetcher("get", "admin/permissions");
      setPerm(perm);
    } catch (e) {
      setAdmin(null);
    }
  };
  const updateAdmin = (data) => {
    setAdmin(data);
  };
  const revalidate = () => {
    setRefetch((pre) => pre + 1);
  };
  const clear = async (role) => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  };

  const value = { admin, updateAdmin, updateAdminToken, perm, clear,revalidate };

  useEffect(() => {
    const getInfo = async () => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        try {
          const res = await api.fetcher("get", "admin/me");
          const perm = await api.fetcher("get", "admin/permissions");
          setAdmin(res);
          setPerm(perm);
        } catch (e) {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
      setLoaded(true);
    };
    getInfo();
  }, [refetch]);

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
      return perm.map((e) => e.name).includes(permRoute);
    }
  }

  if (!loaded) {
    return <Loading />;
  }

  return <AuthContext.Provider value={value} {...props} />;
});

export default AuthProvider;
