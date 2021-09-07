import React, { useMemo } from "react";
import { useFetch } from "../../../api/api";
import CheckBox from "./CheckBox";

const CheckboxQuery = React.memo((props) => {
  const { label, value, error, handleChange, ...otherProps } = props;
  const endpoint = otherProps.endpoint;
  const { data: data } = useFetch(["get", endpoint]);
  const options = useMemo(() => {
    if (data?.data) {
      return data?.data.map((e) => ({ label: e.name, value: e.id }));
    }
    return [];
  }, [data]);

  return (
    <CheckBox
      {...otherProps}
      label={label}
      value={value}
      handleChange={handleChange}
      options={options}
      error={error}
    />
  );
});

export default CheckboxQuery;
