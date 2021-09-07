import React, { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { object } from "yup";

const useCheckedColumns = (columns) => {
  const [columnChecked, setCloumnChecked] = useState([]);
  const location = useLocation();
  const [newCache, setNewCache] = useState();
  useEffect(() => {
    const cache = JSON.parse(localStorage.getItem([location.pathname]));

    if (cache) {
      setCloumnChecked(
        columns.map((e, index) => ({ ...e, display: cache[index]?.display }))
      );
    } else {
      setCloumnChecked(columns);
    }
  }, []);

  useEffect(() => {
    setNewCache(
      JSON.stringify(
        Object.assign(
          columnChecked.map((e) => ({ field: e.field, display: e.display }))
        )
      )
    );
  }, [columnChecked]);

  useEffect(() => {
    localStorage.setItem([location.pathname], newCache);
  }, [newCache]);

  const handleChange = (column, index) => {
    setCloumnChecked((pre) =>
      pre.map((e) =>
        e.field == column.field ? { ...e, display: !e.display } : e
      )
    );
  };

  return { columnChecked, handleChange };
};

export default useCheckedColumns;
