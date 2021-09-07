import React, { useEffect, useState } from "react";
import {
  Grid,
  Card,
  TextField,
  ButtonGroup,
  Button,
  Select,
  MenuItem,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Container,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import logo from "./logo.svg";
import anh1 from "./anh1.svg";
import anh2 from "./anh2.svg";
import anh3 from "./anh3.svg";
import anh4 from "./anh4.svg";
import anh5 from "./anh5.svg";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import Chip from "@material-ui/core/Chip";
import onTop from "./icon-scroll-top.png";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import PhoneIcon from "@material-ui/icons/Phone";
import MailIcon from "@material-ui/icons/Mail";
import EmojiTransportationIcon from "@material-ui/icons/EmojiTransportation";
import { useFetch } from "../../../../api/api";

function Preview() {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState();
  const classes = useStyle();
  const history = useHistory();
  const params = useParams();
  const [tagList, setTagList] = useState([]);
  const [firstTime, setFirstTime] = useState(true);

  const getData = useFetch(
    ["get", params.id ? "/admin/article/" + params.id : null],
    {
      onSuccess: (res) => {
        setData(res);
      },
    }
  );

  useEffect(() => {
    if (data !== undefined && firstTime === true) {
      let temp = (data.tags + "").split(",");
      let tempTagList = [...tagList];
      temp.map((value, index) => {
        let temp_tag = { key: "", label: "" };
        temp_tag.key = index;
        temp_tag.label = value;
        tempTagList.push(temp_tag);
      });
      setTagList(tempTagList);
      setFirstTime(false);
    }
  });
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth={true}
      fullScreen={true}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div id={"top"}>
            <div style={{ textAlign: "center", paddingBottom: 20 }}>
              <img src={logo} width={"30%"} height={"auto"} />
            </div>
            <div
              style={{
                width: "100% !important",
                height: "50px",
                backgroundColor: "#E2363C",
                textAlign: "center",
                color: "#fff",
                padding: "6px 12px 8px",
                minWidth: "80px",
                fontWeight: "bold",
              }}
            >
              <ButtonGroup variant="text" aria-label="text button group">
                <Button className={classes.buttonView}>TRANG CHỦ</Button>
                <Button className={classes.buttonView}>TIN TỨC</Button>
                <Button className={classes.buttonView}>VĂN BẢN </Button>
                <Button className={classes.buttonView}>QUYẾT TOÁN QUỸ</Button>
              </ButtonGroup>
            </div>
            <div style={{ width: "100%", display: "flex" }}>
              <div
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                  align: "center",
                }}
              >
                <div style={{ padding: 30 }}>
                  <span className={classes.titleBar}>Trang chủ</span>
                  <span style={{ marginRight: "20px" }}> </span>
                  <span className={classes.titleBar}>Lao động</span>
                  <span style={{ marginRight: "20px" }}> </span>
                  <span className={classes.titleBar}>{data?.title}</span>
                </div>
                <Grid container spacing={3} style={{ padiing: "0px 30px" }}>
                  <Grid item xs={8} style={{ maxWidth: "1000px" }}>
                    <div style={{ padding: 30 }}>
                      <div style={{ fontSize: 25 }}>
                        <b>{data?.title}</b>
                      </div>
                      <br />
                      <div style={{ width: "100%" }}>
                        <span
                          dangerouslySetInnerHTML={{ __html: data?.html }}
                        />
                      </div>
                      <div className={classes.tag}>
                        {tagList.map((value, key) => {
                          return (
                            <li key={value.key}>
                              <Chip
                                icon={<LocalOfferIcon />}
                                className={classes.chip}
                                label={value.label}
                                variant={"outlined"}
                                color={"primary"}
                              />
                            </li>
                          );
                        })}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4} style={{ padding: 30, maxWidth: "500px" }}>
                    <p className={classes.titleFontText}>
                      CỔNG THÔNG TIN ĐIỆN TỬ
                    </p>
                    <img
                      src={anh1}
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    <img
                      src={anh2}
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    <img
                      src={anh3}
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    <img
                      src={anh4}
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    <img
                      src={anh5}
                      width={"100%"}
                      style={{ marginBottom: 20 }}
                    />
                    <p className={classes.titleFontText}>BÀI VIẾT MỚI NHẤT</p>
                  </Grid>
                </Grid>
                <Container
                  className={classes.footer}
                  component="footer"
                  disableGutters
                  maxWidth={false}
                >
                  <Grid>
                    <Grid
                      className={classes.footerTop}
                      container
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item className={classes.footerLogo}>
                        <img src={logo} />
                      </Grid>
                      <Grid item className={classes.detail}>
                        <Grid
                          className={classes.detailItem}
                          container
                          wrap="nowrap"
                        >
                          <Grid className={classes.detailIcon}>
                            <LocationOnIcon />
                          </Grid>
                          <Grid>12 Ngô Quyền, Hoàn Kiếm, Hà Nội</Grid>
                        </Grid>
                        <Grid
                          className={classes.detailItem}
                          container
                          wrap="nowrap"
                        >
                          <Grid className={classes.detailIcon}>
                            <PhoneIcon />
                          </Grid>
                          <Grid>(024) 62703645 Fax:(024) 62703609</Grid>
                        </Grid>
                        <Grid
                          className={classes.detailItem}
                          container
                          wrap="nowrap"
                        >
                          <Grid className={classes.detailIcon}>
                            <MailIcon />
                          </Grid>
                          <Grid className={classes.mail}>
                            banbientap@domain.gov.vn
                          </Grid>
                        </Grid>
                        <Grid
                          className={classes.detailItem}
                          container
                          wrap="nowrap"
                        >
                          <Grid className={classes.detailIcon}>
                            <EmojiTransportationIcon />
                          </Grid>
                          <Grid>
                            Đơn vị quản lý & vận hành: Trung tâm Thông tin
                            (LASIC)
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Container>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "fixed",
              padding: 50,
              right: 0,
              bottom: 0,
              visibility: "visible",
            }}
          >
            <a href={"#top"}>
              <img src={onTop} height={50} width={50} />
            </a>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <ButtonGroup
          variant="text"
          aria-label="text button group"
          style={{ paddingRight: 30 }}
        >
          <Button
            onClick={() => history.push("/quanly/article")}
            color="secondary"
            variant={"contained"}
          >
            Quay lại
          </Button>
        </ButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
const useStyle = makeStyles((theme) => ({
  buttonView: {
    color: "#fff",
    width: "100%",
    height: "100%",
    padding: "6px 12px 8px",
    minWidth: "200px",
    background: "#E2363C",
    fontSize: "0.875rem",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  titleBar: {
    color: "rgb(245, 69, 75)",
    marginRight: "20px",
  },
  titleFontText: {
    fontSize: "1.125rem",
    fontStyle: "normal",
    textAlign: "left",
    fontFamily: "Roboto",
    fontWeight: "bold",
    lineHeight: "1.125rem",
    marginBottom: "20px",
    textTransform: "uppercase",
  },
  tag: {
    display: "flex",
    flexWrap: "wrap",
    listStyle: "none",
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
  footer: {
    backgroundColor: "#F7F7F7",
  },
  footerTop: {
    minHeight: 200,
    border: "1px solid #E1E1E1",
    [theme.breakpoints.only("xs")]: {
      padding: "30px 15px",
    },
  },
  footerLogo: {
    maxWidth: 346,
    width: "100%",
    "& img": {
      width: "100%",
    },
    marginRight: 45,
    [theme.breakpoints.only("xs")]: {
      margin: 0,
      paddingBottom: 30,
    },
  },
  detail: {
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.8rem",
  },
  detailItem: {
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 15,
  },
  footerBottom: {
    minHeight: 100,
    padding: "10px 0px",
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: "0.75rem",
    lineHeight: "1.256rem",
  },
  mail: {
    color: "rgb(245, 69, 75)",
  },
}));
export default Preview;
