import React, { useEffect, useState } from "react";
import {
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TableBody,
  Paper,
  TextField,
} from "@material-ui/core";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import CancelIcon from "@material-ui/icons/Cancel";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import Autocomplete from "../../../components/Admin/form/Autocomplete";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

const useStyles = makeStyles({
  heightNormal: {
    width: "25%",
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});

export default function ListContact({ contactList, setContactList, error }) {
  const classes = useStyles();
  const [tempRow, setTempRow] = useState({
    name: "",
    email: "",
    phone_number: "",
    job_title_id: "",
    readOnly: true,
  });
  const [show, setShow] = useState([]);
  const addNewRow = () => {
    let temp = [...contactList];
    temp.push(tempRow);
    setContactList(temp);
  };
  const ChangeName = (value, row) => {
    let temp = [...contactList];
    temp[row] = { ...contactList[row] };
    temp[row].name = value;
    setContactList(temp);
  };
  const ChangeJob = (value, row) => {
    let temp = [...contactList];
    temp[row] = { ...contactList[row] };
    temp[row].job_title_id = value;
    setContactList(temp);
  };
  const ChangeEmail = (value, row) => {
    let temp = [...contactList];
    temp[row] = { ...contactList[row] };
    temp[row].email = value;
    setContactList(temp);
  };
  const ChangePhone = (value, row) => {
    let temp = [...contactList];
    temp[row] = { ...contactList[row] };
    temp[row].phone_number = value;
    setContactList(temp);
  };
  const EditRow = (e, row) => {
    let temp = [...contactList];
    temp[row] = { ...contactList[row] };
    temp[row].readOnly = false;
    setContactList(temp);
  };
  const ReadOnlyRow = (e, row) => {
    let temp = [...contactList];
    temp[row] = { ...contactList[row] };
    temp[row].readOnly = true;
    setContactList(temp);
  };
  const DeleteRow = (e, row) => {
    let temp = [...contactList];
    temp.splice(row, 1);
    setContactList(temp);
  };
  return (
    <TableContainer component={Paper} style={{ marginTop: 20 }}>
      <Table aria-label="customized table" style={{ overflow: "auto" }}>
        <TableHead>
          <TableRow style={{ backgroundColor: "#1976d2", width: 2500 }}>
            <TableCell className={classes.heightNormal}>
              Họ và tên (*)
            </TableCell>
            <TableCell className={classes.heightNormal}>Chức vụ</TableCell>
            <TableCell className={classes.heightNormal}>Email</TableCell>
            <TableCell className={classes.heightNormal}>
              Số điện thoại
            </TableCell>
            <TableCell
              style={{ maxWidth: "10%", textAlign: "center", color: "#fff" }}
            >
              <ControlPointIcon onClick={addNewRow} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {contactList.map((row, index) => (
            <TableRow style={{ width: 2500 }}>
              <TableCell className={classes.heightNormal}>
                <span>
                  {row.readOnly === false ? (
                    <TextField
                      error={row.name === "" ? true : false}
                      variant={"outlined"}
                      display="true"
                      value={row.name}
                      onChange={(e) => ChangeName(e.target.value, index)}
                      fullWidth={true}
                      disabled={row.readOnly}
                      placeholder={"Nguyễn Văn A"}
                      FormHelperTextProps={{ style: { marginBottom: "-21px" } }}
                      helperText={
                        row.name === ""
                          ? error?.["contactList." + index + ".name"]
                          : null
                      }
                    />
                  ) : (
                    <p
                      style={
                        row.name === ""
                          ? { color: "red", fontSize: 12 }
                          : { color: "#000" }
                      }
                    >
                      {row.name}
                      <br />
                      <span style={{ color: "red", fontSize: 12 }}>
                        {error?.["contactList." + index + ".name"]}
                      </span>
                    </p>
                  )}
                </span>
              </TableCell>
              <TableCell className={classes.heightNormal}>
                {row.readOnly === false ? (
                  <Autocomplete
                    endpoint={"admin/jobTitles"}
                    queryField={"name"}
                    size={"medium"}
                    value={row.job_title_id}
                    handleChange={(e) => ChangeJob(e, index)}
                  />
                ) : (
                  <p style={{ color: "#000" }}>{row.job_title_id?.name}</p>
                )}
              </TableCell>
              <TableCell className={classes.heightNormal}>
                {row.readOnly === false ? (
                  <TextField
                    variant="outlined"
                    value={row.email}
                    onChange={(e) => ChangeEmail(e.target.value, index)}
                    fullWidth={true}
                    placeholder={"aaa@gmail.com"}
                  />
                ) : (
                  <p style={{ color: "#000" }}>{row.email}</p>
                )}
              </TableCell>
              <TableCell className={classes.heightNormal}>
                {row.readOnly === false ? (
                  <TextField
                    error={row.phone_number === "" ? true : false}
                    variant="outlined"
                    value={row.phone_number}
                    onChange={(e) => ChangePhone(e.target.value, index)}
                    fullWidth={true}
                    type="number"
                    placeholder={"09xx xxx xxx"}
                    FormHelperTextProps={{ style: { marginBottom: "-21px" } }}
                    helperText={
                      row.phone_number === ""
                        ? error?.["contactList." + index + ".phone_number"]
                        : null
                    }
                  />
                ) : (
                  <p
                    style={
                      row.phone_number === ""
                        ? { color: "red", fontSize: 12 }
                        : { color: "#000" }
                    }
                  >
                    {row.phone_number}
                    <br />
                    <span style={{ color: "red", fontSize: 12 }}>
                      {" "}
                      {error?.["contactList." + index + ".phone_number"]}
                    </span>
                  </p>
                )}
              </TableCell>
              <TableCell style={{ maxWidth: "5%", textAlign: "center" }}>
                {row.readOnly === true && (
                  <div
                    style={{
                      display: "flex",
                      msFlexWrap: "wrap",
                      flexWrap: "wrap",
                      marginRight: "-15px",
                      marginLeft: "-15px",
                    }}
                  >
                    <EditIcon onClick={(e) => EditRow(e, index)} />
                    <DeleteForeverIcon onClick={(e) => DeleteRow(e, index)} />
                  </div>
                )}
                {row.readOnly === false && (
                  <div
                    style={{
                      display: "flex",
                      msFlexWrap: "wrap",
                      flexWrap: "wrap",
                      marginRight: "-15px",
                      marginLeft: "-15px",
                    }}
                  >
                    <CheckIcon onClick={(e) => ReadOnlyRow(e, index)} />
                    <DeleteForeverIcon onClick={(e) => DeleteRow(e, index)} />
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
