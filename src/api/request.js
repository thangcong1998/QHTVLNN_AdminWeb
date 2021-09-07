import axios from "axios";
import { toast } from "react-toastify";
// create an axios instance
toast.configure();
const service = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // api base_url
  timeout: 30 * 1000, // request timeout
});
export default service;

// request interceptor
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
  }
);
// response interceptor
service.interceptors.response.use(
  (response) => {
    if (response.data.message) {
      toast.success(response.data.message, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    return response;
  },

  (error) => {
    // console.log(error.response); // for debug
    if (error.response.status === 500) {
      toast.error(error.response.data.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (error.response.status === 401 || error.status === 403) {
      // toast.error(error.response.data.message, {
      //   position: "top-center",
      //   autoClose: 2000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      // });
    } else if (error.response.status === 404) {
      const mess = error.response.data.message;
      if (mess) {
        toast.error(mess, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else if (error.response.status === 422) {
      const mess = error.response.data.message;
      if (mess) {
        toast.error(mess, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      const mess = error.response.data.message;
      if (mess) {
        toast.error(mess, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }

    return Promise.reject(error);
  }
);
