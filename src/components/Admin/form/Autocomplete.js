import React, { useEffect, useState, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFetch, useAPI } from "../../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";

export default React.memo((props) => {
  const {
    endpoint,
    queryField,
    valueField,
    value,
    handleChange,
    label,
    error,
    ...otherProps
  } = props;
  const [query, setQuery] = useState();
  const [res, setRes] = useState();
  const api = useAPI();

  const [timeout, setTime] = useState(null);

  useEffect(() => {
    clearTimeout(timeout);
    setTime(
      setTimeout(() => {
        setRes(
          endpoint ? api.fetcher("get", endpoint, JSON.stringify(query)) : null
        );
      }, 200)
    );
  }, [query, endpoint]);

  const options = endpoint ? api?.data?.data || [] : [];

  return (
    <Autocomplete
      size={"small"}
      includeInputInList={true}
      openOnFocus={true}
      loading={api?.loading}
      loadingText="Đang tải..."
      noOptionsText="Không tìm thấy"
      value={value || null}
      options={options}
      getOptionLabel={(option) => option?.[queryField]}
      renderOption={(option, state) => {
        return <div style={{ padding: 5 }}>{option?.[queryField]}</div>;
      }}
      onChange={(event, value, reason) => {
        handleChange(value);
      }}
      onClose={() => {
        setQuery();
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant={otherProps.variant ? otherProps.variant : "outlined"}
          label={label}
          onChange={(event) => setQuery({ [queryField]: event.target.value })}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {api?.loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      {...otherProps}
    />
  );
});
