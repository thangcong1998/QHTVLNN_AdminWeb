import React, { useMemo, useState, useEffect } from "react";
import Autocomplete from "./Autocomplete";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

export default React.memo((props) => {
  const { values, setFieldValue, error, size } = props;
  const classes = useStyle();
  const provinceComponent = useMemo(() => {
    return (
      <Autocomplete
        endpoint="admin/regions?type=1"
        queryField={"name"}
        label={"Tỉnh thành"}
        value={values?.province}
        size={size}
        handleChange={(value) => {
          setFieldValue("province", value);
          setFieldValue("district", undefined);
          setFieldValue("ward", undefined);
        }}
        error={error?.province_id}
      />
    );
  }, [values, error]);

  const districtComponent = useMemo(() => {
    const id = values?.province?.id;

    return (
      <Autocomplete
        endpoint={id ? "admin/regions?type=2&parent_region_id=" + id : null}
        queryField={"name"}
        label={"Quận huyện"}
        value={values?.district}
        size={size}
        handleChange={(value) => {
          setFieldValue("district", value);
          setFieldValue("ward", undefined);
        }}
        error={error?.district_id}
      />
    );
  }, [values, error]);

  const wardComponent = useMemo(() => {
    const id = values?.district?.id;
    return (
      <Autocomplete
        endpoint={id ? "admin/regions?type=3&parent_region_id=" + id : null}
        queryField={"name"}
        label={"Phường xã"}
        value={values?.ward}
        size={size}
        handleChange={(value) => {
          setFieldValue("ward", value);
        }}
        error={error?.ward_id}
      />
    );
  }, [values, error]);

  return (
    <Grid container>
      <Grid className={classes.province} item sm="4" md="4">
        {provinceComponent}
      </Grid>
      <Grid className={classes.district} item sm="4" md="4">
        {districtComponent}
      </Grid>
      <Grid className={classes.ward} item sm="4" md="4">
        {wardComponent}
      </Grid>
    </Grid>
  );
});

const useStyle = makeStyles((theme) => ({
  province: {
    paddingRight: "10px",
  },
  district: {
    padding: "0 5px",
  },
  ward: {
    paddingLeft: "10px",
  },
}));
