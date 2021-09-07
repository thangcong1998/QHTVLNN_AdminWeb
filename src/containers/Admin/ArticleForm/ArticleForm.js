import React, { useState } from "react";
import {
  Grid,
  Card,
  TextField,
  ButtonGroup,
  Button,
  Select,
  MenuItem,
  Switch,
} from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import AddTag from "./AddTag";
import Upload from "./Upload";
import "./ArticleForm.css";
import { useAPI, useFetch } from "../../../api/api";
import { insert, useFormik } from "formik";
import { Editor } from "@tinymce/tinymce-react";
import {makeStyles} from "@material-ui/styles";
import loading from "../../../assets/image/25.gif";
import {loadingStyle} from '../../../common/constants';

export default function ArticleForm() {
  const classes = useStyle();
  const params = useParams();
  const [data, setData] = useState({
    title: "",
    short_description: "",
    html: "",
    article_category_id: 1,
    is_public: 1,
  });
  const [files, setFiles] = useState();
  const [tags, setTags] = useState([]);
  const api = useAPI();
  const history = useHistory();
  let formData = new FormData();
  const getData = useFetch(
    ["get", params.id ? "/admin/article/" + params.id : null],
    {
      onSuccess: (res) => {
        let temp = {
          title: "",
          short_description: "",
          html: "",
          article_category_id: "",
          is_public: "",
        };
        temp.title = res.title;
        temp.article_category_id = res.article_category_id;
        temp.is_public = res.is_public;
        temp.html = res.html;
        temp.short_description = res.short_description;
        setData(temp);
        setData(res);
        setFiles(res.feature_image_url);
        setTags(res.tags);
        if (res.is_public === 1) {
          setCheckPublic(true);
        } else {
          setCheckPublic(false);
        }
      },
    }
  );
  const [checkPublic, setCheckPublic] = useState(true);
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (values) => {
      formData.append("title", data.title);
      formData.append("html", data.html);
      formData.append("short_description", data.short_description);
      formData.append("article_category_id", data.article_category_id);
      formData.append("files", files);
      formData.append("tags", tags);
      formData.append("is_public", data.is_public);
      params.id
        ? formData.append("_method", "PUT")
        : formData.append("_method", "POST");
      try {
        let res = await api.fetcher(
          "post",
          params.id ? "admin/article/" + params.id : "admin/article",
          formData
        );
        if (res) {
          history.push("/quanly/article");
        }
      } catch (e) { }
    },
  });
  const categoryData = useFetch(["get", "admin/category"]);
  const changeTitle = (value) => {
    let temp = { ...data };
    temp.title = value;
    setData(temp);
  };
  const changeHtml = (value) => {
    let temp = { ...data };
    temp.html = value;
    setData(temp);
  };
  const changeArticleCategory = (value) => {
    let temp = { ...data };
    temp.article_category_id = value;
    setData(temp);
  };
  const changeShortDescription = (value) => {
    let temp = { ...data };
    temp.short_description = value;
    setData(temp);
  };
  const changePublic = (value) => {
    let temp = { ...data };
    if (data.is_public === 2) {
      temp.is_public = 1;
      setData(temp);
      setCheckPublic(true);
    } else {
      temp.is_public = 2;
      setData(temp);
      setCheckPublic(false);
    }
  };

  return (
    <Grid container spacing={2} className={api.loading ? classes.loading : classes.action}>
      <Grid item xs={9}>
        <Card
          className={api.loading ? classes.loading : null}
          style={{ padding: 20, border: null, backgroundColor: null }}
        >
          <h2>Tiêu đề</h2>
          <TextField
            variant={"outlined"}
            style={{ width: "100%" }}
            value={data.title}
            onChange={(e) => changeTitle(e.target.value)}
          />
          <br />
          {api.error?.title && (
            <p style={{ fontSize: 12, color: "#FF2700" }}>{api.error?.title}</p>
          )}
          <br />
          <h2>Mô tả</h2>
          <TextField
            multiline={true}
            variant={"outlined"}
            fullWidth={true}
            value={data.short_description}
            onChange={(e) => changeShortDescription(e.target.value)}
            rows={5}
          />
          <br />
          {api.error?.short_description && (
            <p style={{ fontSize: 12, color: "#FF2700" }}>
              {api.error?.short_description}
            </p>
          )}
          <h2>Nội dung</h2>
          {api.error?.html && (
            <p style={{ fontSize: 12, color: "#FF2700" }}>{api.error?.html}</p>
          )}
          <div style={{ minHeight: 500 }}>
            <Editor
              value={data.html}
              init={{
                min_height: 500,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor autoresize",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | fontselect | bold italic forecolor backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | image | preview ",
                block_formats:
                  "Đoạn văn=p; Tiêu đề 1=h1; Tiêu đề 2=h2; Tiêu đề 3=h3; Tiêu đề 4=h4; Tiêu đề 5=h5",
                font_formats:
                  "Arial=arial,helvetica,sans-serif; Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n; Times New Roman=times new roman",
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                language: "vi",
                language_url: "/langs/vi.js",
                addI18n: ("vi", { Bold: "Tô đậm" }),
                images_upload_handler: function (blobInfo, success, failure) {
                  let xhr, formData;
                  xhr = new XMLHttpRequest();
                  xhr.withCredentials = false;
                  xhr.open(
                    "POST",
                    process.env.REACT_APP_API_URL + "admin/imageDocument"
                  );
                  xhr.onload = function () {
                    let json;

                    if (xhr.status != 200) {
                      failure("HTTP Error: " + xhr.status);
                      return;
                    }
                    json = JSON.parse(xhr.responseText);

                    if (!json || typeof json.location != "string") {
                      failure("Invalid JSON: " + xhr.responseText);
                      return;
                    }
                    let temp = json.location;
                    temp = process.env.REACT_APP_UPLOAD_IMAGE_URL + temp;
                    success(temp);
                  };
                  formData = new FormData();
                  formData.append(
                    "upload",
                    blobInfo.blob(),
                    blobInfo.filename()
                  );
                  xhr.send(formData);
                },
              }}
              apiKey={"qwmqc3ytmph9t44hht3z1fubvdqjrk1f2j2e6wy32k995b8l"}
              onEditorChange={(e) => changeHtml(e)}
            />
          </div>
        </Card>
      </Grid>
      <Grid
        item
        xs={3}
      // style={{
      //   position: "fixed",
      //   left: "77%",
      //   overflowY: "auto",
      //   height: "87%",
      //   right: "1%",
      // }}
      >
        <ButtonGroup
          variant={"contained"}
          aria-label="contained primary button group"
          style={{ width: "100%" }}
          disableElevation
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<SaveIcon />}
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
            startIcon={<CancelIcon />}
            style={{ width: "50%" }}
            disableElevation
            onClick={(e) => history.push("/quanly/article")}
          >
            Hủy
          </Button>
        </ButtonGroup>
        <Card className={api.loading ? classes.loadingNonImage : null} style={{ marginTop: 10 }}>
          <div style={{ padding: "0px 20px 20px 20px" }}>
            <p style={{ fontWeight: "bold" }}>Loại tài liệu</p>
            {categoryData?.data !== undefined && (
              <Select
                style={{ width: "100%" }}
                variant={"outlined"}
                defaultValue={"2"}
                value={data.article_category_id}
                onChange={(e) => changeArticleCategory(e.target.value)}
              >
                {categoryData.data.data.map((value, index) => {
                  return <MenuItem value={value.id}>{value.name}</MenuItem>;
                })}
              </Select>
            )}
            {categoryData?.data === undefined && (
              <Select style={{ width: "100%" }} variant={"outlined"} />
            )}
            <br />
            <p style={{ fontWeight: "bold" }}>Ảnh bìa</p>
            <Upload files={files} setFiles={setFiles} />
            <br />
            <p style={{ fontWeight: "bold" }}>Tag</p>
            <AddTag tags={tags} setTags={setTags} />
            <br />
            {api.error?.tags && (
              <p style={{ fontSize: 12, color: "#FF2700" }}>
                {api.error?.tags}
              </p>
            )}
            <Grid container spacing={2} direction={"row"}>
              <Grid xs={7} item style={{ paddingTop: 20 }}>
                <b>Chia sẻ bài viết</b>
              </Grid>
              <Grid xs={5} item>
                <span style={{ float: "right" }}>
                  <Switch
                    onChange={changePublic}
                    checked={checkPublic}
                    color={"primary"}
                  />
                </span>
              </Grid>
            </Grid>
          </div>
        </Card>
      </Grid>
    </Grid>
  );
}

const useStyle = makeStyles((theme) => ({
  root: {
    padding: 10,
  },
  action: {
    paddingLeft: 10,
  },
  loadingNonImage: {
    backgroundColor: '#f3f3f3',
    opacity: 0.5,
  },
  loading: loadingStyle
}));
