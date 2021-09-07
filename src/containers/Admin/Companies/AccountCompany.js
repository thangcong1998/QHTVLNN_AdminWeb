import React from "react";
import { TextField } from "@material-ui/core";
import { TabPanel } from "@material-ui/lab";

export default function AccountCompany({ user, setUser, api, update }) {
  const ChangeUserName = (value) => {
    let temp = { ...user };
    temp.user_name = value;
    setUser(temp);
  };
  const ChangePassword = (value) => {
    let temp = { ...user };
    temp.password = value;
    setUser(temp);
  };

  return (
    <div style={{ padding: 20 }}>
      {update === true && user?.hasUsername !== false ? (
        <p style={{ padding: 10, fontWeight: "bold" }}>
          Tên tài khoản: {user?.user_name}
        </p>
      ) : (
        <TextField
            error={api?.error?.user_name}
            helperText={api?.error?.user_name}
          variant={"outlined"}
          value={user?.user_name}
          label={"Tên tài khoản *"}
          onChange={(e) => ChangeUserName(e.target.value)}
          style={{ width: "50%", paddingRight: 15 }}
        />
      )}
      {update === true && user?.hasUsername !== false ? (
        <TextField
            error={api?.error?.password}
            helperText={api?.error?.password}
          variant={"outlined"}
          value={user?.password}
          label={"Mật khẩu *"}
          onChange={(e) => ChangePassword(e.target.value)}
          fullWidth={true}
        />
      ) : (
        <TextField
            error={api?.error?.password}
            helperText={api?.error?.password}
          variant={"outlined"}
          value={user?.password}
          label={"Mật khẩu *"}
          onChange={(e) => ChangePassword(e.target.value)}
          style={{ width: "50%", paddingLeft: 5 }}
        />
      )}
    </div>
  );
}
