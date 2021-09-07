import React from "react";
import MainRouter from "./routes/MainRouter";
import AuthProvider from "./common/AuthProvider";
import RouteProvider from "./common/RouteProvider";
import { ThemeProvider } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import DialogProvider from "./components/Dialog";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/vi";
import moment from "moment";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f44336",
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <RouteProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <MuiPickersUtilsProvider
            libInstance={moment}
            utils={MomentUtils}
            locale={"vi"}
          >
            <DialogProvider>
              <SnackbarProvider>
                <MainRouter />
              </SnackbarProvider>
            </DialogProvider>
          </MuiPickersUtilsProvider>
        </ThemeProvider>
      </RouteProvider>
    </AuthProvider>
  );
}

export default App;
