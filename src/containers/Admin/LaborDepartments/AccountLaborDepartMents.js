import React from "react";
import { TextField, Grid } from "@material-ui/core";
import { Form } from "formik";

export default function AccountLaborDepart({
  user_name,
  password,
  setUserName,
  setPassWord,
  api,
  user,
}) {
  const ChangeUserName = (value) => {
    setUserName(value);
  };
  const ChangePassWord = (value) => {
    setPassWord(value);
  };

  return (
    <Grid
      container
      direction="row"
      elevation={5}
      spacing={2}
      style={{ padding: 10 }}
    >
      <Grid item xs={12} sm={6} md={6}>
        {user ? (
          <p style={{ padding: 10, fontWeight: "bold" }}>
            Tên tài khoản: {user_name}
          </p>
        ) : (
          <TextField
            variant="outlined"
            value={user_name || ""}
            fullWidth={true}
            label="Tên tài khoản"
            // required={true}
            onChange={(e) => ChangeUserName(e.target.value)}
          />
        )}
        {api.error?.user_name && (
          <p
            style={{
              color: "red",
              fontSize: 12,
              width: "50%",
              paddingRight: 15,
            }}
          >
            {api.error?.user_name}
          </p>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={6}>
        {user === true ? (
          <TextField
            variant="outlined"
            value={password}
            // type="password"
            fullWidth={true}
            label={"Mật Khẩu"}
            // required={true}
            onChange={(e) => ChangePassWord(e.target.value)}
          />
        ) : (
          <TextField
            variant="outlined"
            value={password}
            // type="password"
            fullWidth={true}
            label={"Mật Khẩu"}
            // required={true}
            onChange={(e) => ChangePassWord(e.target.value)}
          />
        )}
        {api.error?.password && (
          <p
            style={{ color: "red", fontSize: 12, width: "50%", paddingLeft: 5 }}
          >
            {api.error?.password}
          </p>
        )}
      </Grid>
    </Grid>
  );
}
