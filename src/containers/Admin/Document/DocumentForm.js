import React, { useMemo, useEffect, useState } from "react";
import { Paper, Button } from "@material-ui/core";
import Forms from "../../../components/Admin/form/Form";
import { useFormik } from "formik";
import { makeStyles } from "@material-ui/styles";
import { useFetch, useAPI } from "../../../api/api";
import { useParams, useHistory } from "react-router-dom";
import Moment from "moment";
import UploadFile from "./UploadFile";
import CircularProgress from "@material-ui/core/CircularProgress";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

const DocumentForm = React.memo((props) => {
  const classes = useStyle();
  const params = useParams();
  const history = useHistory();
  const { data: data } = useFetch([
    params.id ? "get" : null,
    "admin/document/" + params.id,
  ]);
  const [oldFiles, setOldFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const api = useAPI();
  const formik = useFormik({
    initialValues: {
      title: null,
      issue_date: null,
      is_valid: 1,
      files: [],
    },
    onSubmit: async (values) => {
      const formData = new FormData();
      newFiles.forEach((e, index) => {
        formData.append("files[" + index + "]", e);
      });
      (params.id && newFiles.length == 0) && formData.append("oldFiles", JSON.stringify(oldFiles));
      formData.append(
        "title",
        formik.values?.title ? formik.values?.title : ""
      );
      formData.append("is_valid", formik.values?.is_valid);
      formData.append(
        "issue_date",
        formik.values?.issue_date ? formik.values?.issue_date : ""
      );
      formData.append("_method", params?.id ? "put" : "post");

      try {
        let res = await api.fetcher(
          "post",
          params.id ? "/admin/document/" + params?.id : "/admin/document",
          formData
        );
        if (res) {
          history.push("/quanly/document");
        }
      } catch (e) {
        formik.setErrors(e?.data?.errors);
      }
    },
  });
  useEffect(() => {
    if (data) {
      setOldFiles(data.files);
      inputs[0]
        .filter((e) => e.field)
        .forEach((e, index) => {
          formik.setFieldValue(e.field, data?.[e.field]);
        });
    }
  }, [data]);
  useEffect(() => {
    formik.setFieldValue("files", newFiles);
  }, [newFiles]);
  const inputs = useMemo(
    () => [
      [
        {
          field: "title",
          label: "Tiêu đề ",
          value: formik.values?.title,
          error: api.error?.title,
          handleChange: (e) => formik.setFieldValue("title", e),
          type: "text",
          variant: "outlined",
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "issue_date",
          label: "Ngày ban hành",
          value: formik.values.issue_date,
          handleChange: (e) => {
            formik.setFieldValue("issue_date", Moment(e).format("YYYY-MM-DD"));
          },
          error: api.error?.issue_date,
          inputVariant: "outlined",
          type: "date",
          grid: { xs: 12, sm: 6, md: 6 },
        },
        {
          component: () => (
            <UploadFile
              data={data?.files}
              errors={api.error?.files}
              oldFiles={oldFiles}
              setOldFiles={setOldFiles}
              newFiles={newFiles}
              setNewFiles={setNewFiles}
              multiple={false}
              handleDelete={hanleDelete}
            />
          ),
          grid: { xs: 12, sm: 12, md: 12 },
        },
        {
          field: "is_valid",
          label: "Hiệu lực",
          value: formik.values?.is_valid == 1,
          handleChange: (e) => {
            formik.setFieldValue("is_valid", e == true ? 1 : 2);
          },
          inputVariant: "outlined",
          type: "switch",
          grid: { xs: 12, sm: 12, md: 12 },
        }
      ],
    ],
    [formik]
  );

  const hanleDelete = (file) => {
    if (file.id) {
      setOldFiles((pre) => pre.filter((e) => e.id != file.id));
    } else {
      setNewFiles((pre) => pre.filter((e) => e.name != file.name));
    }
  };

  return (
    <Paper elevation={5} className={api.loading ? classes.loading : classes.root}>
      <h2>Thông tin tài liệu</h2>
      <Forms inputs={inputs} />
      <div className={classes.action}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => formik.handleSubmit()}
          className={classes.submitBtn}
          disabled={api.loading}
          startIcon={api.loading ? <CircularProgress /> : ""}
        >
          {params.id ? "Cập nhật" : "Thêm văn bản"}
        </Button>
      </div>
    </Paper>
  );
});
const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loading: loadingStyle
}));
export default DocumentForm;
