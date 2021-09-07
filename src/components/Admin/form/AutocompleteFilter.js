import React, { useEffect, useState, useMemo } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useFetch } from "../../../api/api";
import CircularProgress from "@material-ui/core/CircularProgress";

export default React.memo((props) => {
  const {
    endpoint,
    queryField,
    valueField,
    value,
    handleChange,
    label,
    ...otherProps
  } = props;
  const [query, setQuery] = useState();
  const { data: data, loading: loading } = useFetch([
    "get",
    endpoint,
    JSON.stringify(query),
  ]);
  const options = data?.data || [];

  return (
    <Autocomplete
      size={"small"}
      includeInputInList={true}
      openOnFocus={true}
      loading={loading}
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
          variant="outlined"
          label={label}
          onChange={(event) => setQuery({ [queryField]: event.target.value })}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
});
