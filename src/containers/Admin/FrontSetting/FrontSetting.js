import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Card,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  ButtonGroup,
  Button,
  Switch,
} from "@material-ui/core";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PhoneIcon from "@material-ui/icons/Phone";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import ApartmentIcon from "@material-ui/icons/Apartment";
import PrintIcon from "@material-ui/icons/Print";
import AssistantPhotoIcon from "@material-ui/icons/AssistantPhoto";
import PublicIcon from "@material-ui/icons/Public";
import { useFormik } from "formik";
import { useAPI, useFetch } from "../../../api/api";
import Upload from "../ArticleForm/Upload";

export default function FrontSetting() {
  const [data, setData] = useState({
    address: "",
    phone_number: "",
    fax: "",
    email: "",
    building: "",
  });
  const [files, setFiles] = useState();
  const formData = new FormData();
  const params = useParams();
  const api = useAPI();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      formData.append("contact_mail", data.email);
      formData.append("contact_hotline", data.phone_number);
      formData.append("address_footer", data.address);
      formData.append("fax_footer", data.fax);
      formData.append("building_footer", data.building);
      formData.append("files", files);
      formData.append("is_default", 0);
      api
        .fetcher("POST", "/admin/frontSetting", formData)
        .then(history.push("/setting/frontSetting"));
    },
  });
  const editorData = useFetch(
    ["get", params.id ? "/admin/frontSetting/" + params.id : null],
    {
      onSuccess: (res) => {
        setFiles(res.logo_url);
        let temp = { ...data };
        temp.building = res.building_footer;
        temp.address = res.address_footer;
        temp.email = res.contact_mail;
        temp.fax = res.fax_footer;
        temp.phone_number = res.contact_hotline;
        setData(temp);
      },
    }
  );
  const changeAddress = (value) => {
    let temp = { ...data };
    temp.address = value;
    setData(temp);
  };
  const changePhoneNumber = (value) => {
    let temp = { ...data };
    temp.phone_number = value;
    setData(temp);
  };
  const changeFax = (value) => {
    let temp = { ...data };
    temp.fax = value;
    setData(temp);
  };
  const changeEmail = (value) => {
    let temp = { ...data };
    temp.email = value;
    setData(temp);
  };
  const changeBuilding = (value) => {
    let temp = { ...data };
    temp.building = value;
    setData(temp);
  };
  return (
    <div>
      <div>
        <Card style={{ textAlign: "center" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align={"center"}>
                    <b>Thông tin</b>
                  </TableCell>
                  <TableCell align={"center"}>
                    <b>Nội dung</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <AssistantPhotoIcon
                      fontSize={"large"}
                      style={{ marginLeft: 50 }}
                    />
                    <b style={{ marginLeft: 50 }}>Logo</b>
                  </TableCell>
                  <TableCell>
                    <Upload
                      files={files}
                      setFiles={setFiles}
                      limitHeight={true}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <LocationOnIcon
                      fontSize={"large"}
                      style={{ marginLeft: 50 }}
                    />
                    <b style={{ marginLeft: 50 }}>Địa chỉ</b>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant={"outlined"}
                      fullWidth={true}
                      value={data.address}
                      onChange={(e) => changeAddress(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <PhoneIcon fontSize={"large"} style={{ marginLeft: 50 }} />
                    <b style={{ marginLeft: 50 }}>Số điện thoại</b>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant={"outlined"}
                      fullWidth={true}
                      value={data.phone_number}
                      onChange={(e) => changePhoneNumber(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <PrintIcon fontSize={"large"} style={{ marginLeft: 50 }} />
                    <b style={{ marginLeft: 50 }}>Số Fax</b>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant={"outlined"}
                      fullWidth={true}
                      value={data.fax}
                      onChange={(e) => changeFax(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <MailOutlineIcon
                      fontSize={"large"}
                      style={{ marginLeft: 50 }}
                    />
                    <b style={{ marginLeft: 50 }}>Email</b>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant={"outlined"}
                      fullWidth={true}
                      value={data.email}
                      onChange={(e) => changeEmail(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <ApartmentIcon
                      fontSize={"large"}
                      style={{ marginLeft: 50 }}
                    />
                    <b style={{ marginLeft: 50 }}>Tòa nhà sở tại</b>
                  </TableCell>
                  <TableCell>
                    <TextField
                      variant={"outlined"}
                      fullWidth={true}
                      value={data.building}
                      onChange={(e) => changeBuilding(e.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <PublicIcon fontSize={"large"} style={{ marginLeft: 50 }} />
                    <b style={{ marginLeft: 50 }}>Sử dụng thông tin này</b>
                  </TableCell>
                  <TableCell>{/*<Switch value={ data.is_def}*/}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <br />
          <ButtonGroup
            variant={"contained"}
            aria-label="contained primary button group"
            style={{ width: "30%", float: "right", marginBottom: 50 }}
            disableElevation
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ width: "50%" }}
              onClick={formik.handleSubmit}
              disableElevation
            >
              Lưu
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              style={{ width: "50%" }}
              disableElevation
              onClick={() => history.push("/setting")}
            >
              Hủy
            </Button>
          </ButtonGroup>
        </Card>
      </div>
    </div>
  );
}
