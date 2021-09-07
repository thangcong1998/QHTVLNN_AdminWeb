import React, { useState } from "react";
import { TextField, Grid } from "@material-ui/core";
import { InputAdornment } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import { Form } from "formik";
import PropTypes from "prop-types";
import NumberFormat from "react-number-format";
import { Rowing } from "@material-ui/icons";

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function AccountLaborDepart({
  error,
  liaison,
  row,
  index,
  laborSettlementDebt,
  setLiaison,
  setLaborSettlementDebt,
}) {
  const classes = useStyle();
  // const [laborSettlementDebt, setlabor_settlement_debt]= useState([]);
  const Changeliaison = (value) => {
    setLiaison(value);
  };
  const ChangelaborSettlementDebt = (value) => {
    setLaborSettlementDebt(value);
  };
  return (
    <Grid spacing={2} container style={{ padding: 10 }}>
      <Grid item xs={12} sm={6} md={12}>
        <Autocomplete
          variant="outlined"
          endpoint={"admin/user?user_type=1"}
          queryField={"full_name"}
          value={liaison}
          fullWidth={true}
          handleChange={(e) => Changeliaison(e)}
          label="Cán bộ phụ trách"
          required={true}
          size="medium"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={12}>
        <TextField
          className={classes.input1}
          variant="outlined"
          value={laborSettlementDebt || ""}
          fullWidth={true}
          error={error?.labor_settlement_debt ? true : false}
          helperText={error?.labor_settlement_debt}
          onChange={(e) => ChangelaborSettlementDebt(e.target.value)}
          label="Dư nợ quyết toán theo người lao động"
          required={true}
          InputProps={{
            inputComponent: NumberFormatCustom,
            endAdornment: <InputAdornment position="start">đ</InputAdornment>,
          }}
        />
      </Grid>
    </Grid>
  );
}
const useStyle = makeStyles((theme) => ({
  input1: {
    "& input": {
      textAlign: "right",
    },
    "& p": {
      padding: 2,
      fontSize: 13,
      marginBottom: 8,
    },
  },
}));
