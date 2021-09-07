import { useState, useMemo } from "react";
import useSWR from "swr";

import request from "./request";

function useFetch(key, options) {
  const { fetcher, loading, cancel } = useAPI();
  const { data, error, revalidate } = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
    ...options,
  });

  return { data, error, revalidate, loading, cancel };
}

function useAPI(initData) {
  const [error, setError] = useState({});
  const [data, setData] = useState(initData);
  const [loading, setLoading] = useState(false);
  const [cancel, setCancel] = useState(() => () => null);

  const fetcher = useMemo(() => {
    let ignore = false;
    setCancel(() => () => (ignore = true));
    return async (method, endpoint, params, config = {}) => {
      setError({});
      setLoading(true);
      const access_token = endpoint.includes("admin")
        ? localStorage.getItem("admin_token")
        : localStorage.getItem("user_token");
      request.defaults.headers.common["Authorization"] =
        "Bearer " + access_token;
      return request({
        url: endpoint,
        method: method,
        [method.toLowerCase() === "get" ? "params" : "data"]:
          typeof params === "string" ? JSON.parse(params) : params,
        ...config,
      })
        .then((response) => {
          setData(response.data);
          return response.data;
        })
        .catch((error) =>
          ignore ? null : Promise.reject(errorResponse(error))
        )
        .finally(() => (ignore ? null : setLoading(false)));
    };
  }, []);

  function errorResponse(error) {
    if (error.response) {
      const {
        response: { data, status },
      } = error;

      // if (status === 401) {
      //   history.push('/error-401');
      // }-
      setError(data.errors);
      return { data, status };
    }
  }

  return { fetcher, data, error, loading, cancel };
}

export { useAPI, useFetch };
