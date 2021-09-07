import React, { Fragment } from "react";
import { Grid } from "@material-ui/core";
import { inputTypes } from "../../../common/constants";
import TextInput from "./TextInput";
import TextArea from "./TextArea";
import Number from "./Number";
import Select from "./Select";
import CheckBox from "./CheckBox";
import Radio from "./Radios";
import Switch from "./Switch";
import Date from "./Date";
import CheckboxQuery from "./CheckBoxQuery";
import Autocomplete from "./Autocomplete";
import AutocompleteFilter from "./AutocompleteFilter";
import RegionSelect from "./RegionSelect";
import DateRange from "./DateRange";
import Moment from 'moment';
import { makeStyles } from "@material-ui/styles";
import { Skeleton } from '@material-ui/lab';

const Forms = React.memo(({ inputs, loading, readOnly, variant }) => {
  return (
    <Fragment>
      {inputs?.map((row, index) => (
        <Grid container key={index}>
          {row.map((column, index) => {
            if (!column) return null;
            const {
              type,
              label,
              value,
              handleChange,
              error,
              grid,
              ...otherProps
            } = column;
            return (
              <Grid
                item
                style={{
                  padding: 10,
                }}
                {...grid}
                key={index}
              >
                {column.component ? (
                  <column.component />
                ) : (
                    <Input
                      style={{
                        width: "100%",
                      }}
                      variant={variant || "outlined"}
                      type={type}
                      label={label}
                      value={value}
                      handleChange={handleChange}
                      error={error}
                      loading={loading}
                      readOnly={readOnly}
                      {...otherProps}
                    />
                  )}
              </Grid>
            );
          })}
        </Grid>
      ))}
    </Fragment>
  );
});

export const FlatForms = React.memo(({ inputs, formik, variant, ...other }) => {
  return (
    <Grid container {...other.rowProps}>
      {inputs.map((input, index) => {
        const {
          type,
          label,
          field,
          value,
          handleChange,
          error,
          grid,
          ...otherProps
        } = input;
        return (
          <Grid item xs={12} {...input.grid} key={index}>
            <Input
              style={{ width: "100%" }}
              controlled={true}
              variant={variant || "standard"}
              type={type}
              label={label}
              value={formik.values[field]}
              handleChange={(value) =>
                formik.setFieldValue(
                  field,
                  type === "query-select" ? value?.[input.valueField] : value
                )
              }
              {...otherProps}
            />
          </Grid>
        );
      })}
    </Grid>
  );
});
export const Input = React.memo(
  ({
    type,
    label,
    value,
    handleChange,
    error,
    loading,
    readOnly,
    link,
    ...otherProps
  }) => {
    function renderReadOnly() {
      switch (type) {
        case "autocomplete":
          return value?.[otherProps?.queryField];
        // case "select":
        //   return otherProps?.options?.find((e) => (e.value = value))["label"];
        // case "switch":
        //   return (
        //     <Switch
        //       {...otherProps}
        //       label={label}
        //       value={value}
        //       disable={true}
        //       error={error}
        //     />
        //   );
        case inputTypes.RADIO:
          const render = otherProps?.options?.find(e => e.value == value);
          return render?.label;
        case "date":
          return Moment(value).format('DD/MM/YYYY');
        default:
          return value;
      }
    }

    function render() {
      switch (type) {
        case inputTypes.TEXT:
        case inputTypes.PASSWORD:
          return (
            <TextInput
              {...otherProps}
              type={type}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case inputTypes.TEXTAREA:
          return (
            <TextArea
              {...otherProps}
              type={type}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.NUMBER:
          return (
            <Number
              {...otherProps}
              type={type}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case inputTypes.SELECT:
          return (
            <Select
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case inputTypes.CHECKBOX:
          return (
            <CheckBox
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case "checkbox-query":
          return (
            <CheckboxQuery
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.RADIO:
          return (
            <Radio
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.SWITCH:
          return (
            <Switch
              {...otherProps}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
            />
          );

        case inputTypes.DATE:
          return (
            <Date
              {...otherProps}
              label={label}
              value={value}
              error={error}
              handleChange={handleChange}
              size="small"
            />
          );

        case "autocomplete":
          return (
            <Autocomplete
              {...otherProps}
              endpoint={otherProps.endpoint}
              queryField={otherProps.queryField}
              label={label}
              value={value}
              handleChange={handleChange}
              error={error}
              size="small"
            />
          );

        case "autocompleteFilter":
          return (
            <AutocompleteFilter
              {...otherProps}
              endpoint={otherProps.endpoint}
              queryField={otherProps.queryField}
              label={label}
              value={value}
              handleChange={handleChange}
              size="small"
            />
          );

        case "region-select":
          return (
            <RegionSelect
              values={value}
              setFieldValue={otherProps.setFieldValue}
              error={error}
              size={otherProps.size}
            />
          );

        case "date-range":
          return (
            <DateRange
              {...otherProps}
              value={value}
              label={label}
              handleChange={handleChange}
              size="small"
            />
          );

        default:
          return null;
      }
    }
    const classes = useStyle();
    return (
      <div style={{ marginBottom: 10 }}>
        {
          loading ?
            <Skeleton />
            :
            (readOnly ?
              <div className={classes.readonlyWrapper
              } >
                <label style={{ fontWeight: "600" }} className="readonly-label">{label}:&nbsp;</label>
                <div style={{ fontSize: "1rem" }}>
                  {renderReadOnly()}
                </div>
              </div>
              :
              render()
            )
        }
      </div >
    );
  }
);

export default Forms;

const useStyle = makeStyles((theme) => ({
  readonlyWrapper: {
    display: 'flex',
  }
}));