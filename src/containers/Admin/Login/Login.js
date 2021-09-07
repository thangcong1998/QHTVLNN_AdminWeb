import React, { useState, useContext } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Logo from "../../../assets/image/logo.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAPI } from "../../../api/api";
import { AuthContext } from "../../../common/AuthProvider";
import loading from "../../../assets/image/25.gif";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href={process.env.REACT_APP_FRONT}>
        Quỹ hỗ trợ việc làm ngoài nước2020.
      </Link>
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 60,
  },
  paper: {
    display: "flex",
    justifyContent: "center",
  },
  paperForm: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    width: 500,
    padding: "0px 86px 54px 86px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.07)",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    // margin: theme.spacing(3, 0, 2),
  },
  Button: {
    height: "26px",
  },
  Forgotpassword: {
    color: "#E2363C",
  },
  buttonlogin: {
    fontSize: "18px",
    color: "#E2363C",
  },
  tab: {
    color: "#E2363C",
    indicatorColor: "indicatorColor",
    backgroundColor: "#E2363C",
  },
  active: {
    color: "#1976d2",
  },
  unactive: {
    color: "#000000",
  },
  logo: {
    textAlign: "center",
  },
  loading: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: 500,
    padding: "0px 86px 54px 86px",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.07)",
    backgroundImage: "url(" + loading + ")",
    backgroundRepeat: "no-repeat",
    backgroundColor: '#f3f3f3',
    backgroundPosition: "center",
    opacity: 0.5,
  }
}));

export default function SignIn() {
  const classes = useStyles();
  const [value, setValue] = useState(1);
  const [username, setUsername] = useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [errors, setErrors] = useState("");
  const api = useAPI();
  const { admin, updateAdmin, updateAdminToken } = useContext(AuthContext);
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape(value === 1 ? {
      // Validate form field
      username: Yup.string()
        .required("Tên đăng nhập là trường bắt buộc"),
      password: Yup.string()
        .required("Mật khẩu là trường bắt buộc")
    } : null),
    onSubmit: async (values) => {
      try {
        let res = await api.fetcher("post", value === 1 ? "admin/login" : "admin/forgotPassword",
          value === 1 ? { username: values?.username, password: values?.password } : { username: username });
        await updateAdminToken(res.token);
        await updateAdmin(res.user);
      } catch (e) {
        setErrors(e?.data?.error);
      }
    },
  });

  return (
    <Container component="main" className={classes.container}>
      <CssBaseline />
      <div className={classes.logo}>
        <img src={Logo} />
      </div>
      <div className={classes.paper}>
        <div className={api.loading ? classes.loading : classes.paperForm}>
          <form className={classes.form} noValidate>
            <Tabs
              value={value}
              onChange={handleChange}
              className={classes.Tab}
              centered
            >
              <Tab label="Đăng nhập" className={value === 1 ? classes.active : classes.unactive} value={1} />
              <Tab label={"Quên mật khẩu"} className={value === 2 ? classes.active : classes.unactive} value={2} />
            </Tabs>
          </form>
          <form className={classes.form} noValidate>
            {value === 1 && (
              <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={formik.handleChange}
                  error={formik.touched.username && formik.errors.username}
                  helperText={formik.touched.username && formik.errors.username}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Mật Khẩu"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <Grid
                  style={{
                    color: "#f44336",
                    textAlign: "left",
                  }}
                >
                  <span>{errors ? "*" + errors : ""}</span>
                </Grid>
                <Grid
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-start"
                  className={classes.Button}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.submit}
                    onClick={formik.handleSubmit}
                    id={"loginButton"}
                  >
                    Đăng Nhập
                    </Button>
                </Grid>
              </div>
            )}
            {value === 2 && (
              <div>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Tên đăng nhập"
                  name="usernameForget"
                  autoComplete="username"
                  autoFocus
                  onChange={e => setUsername(e.target.value)}
                  error={formik.errors.username}
                  helperText={api.errors?.username}
                />
                <Grid
                  style={{
                    color: "#f44336",
                    textAlign: "left",
                  }}
                >
                  <span>{errors ? "*" + errors : ""}</span>
                </Grid>
                <Grid
                  item
                  container
                  direction="row"
                  justify="flex-end"
                  alignItems="flex-start"
                >
                  <Button className={classes.Forgotpassword} id={'forgotPasswordButton'} onClick={formik.handleSubmit} disabled={api.loading}>Lấy lại mật khẩu</Button>
                </Grid>
              </div>
            )}
          </form>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
