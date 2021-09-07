import React, { useMemo, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { Grid, Paper, InputBase, Button, Select } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { useFormik } from "formik";
import SearchIcon from "@material-ui/icons/Search";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "./DataTable";
import Moment from "moment";
const Document = React.memo((props) => {
  const classes = useStyle();
  const api = useAPI();
  const formik = useFormik({
    initialValues: {},
    onSubmit: async (value) => {
      {
        setParams((params)=>({...params, ...value, page:1}))
      }
    },
  });
  useEffect(() => {
    if(data){
    }
  });
  const handleChange = (e) => {
    formik.setFieldValue("title", e);
  };
  const [params, setParams] = useState({ page: 1, per_page: 10 });
  const { data: data } = useFetch([
    "get",
    "front/document",
    JSON.stringify(params),
  ]);
  const download = async (row) => {
    try {
      let res = await api.fetcher(
        "post",
        "/front/downloadDocument/" + row.id,
        { path: row?.files[0].path },
        {
          responseType: "blob",
        }
      );
      if (res) {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", row?.files[0].name);
        document.body.appendChild(link);
        link.click();
      }
    } catch (e) {}
  };
  const columns = useMemo(
    () => [
      {
        field: "issue_date",
        label: "Ngày",
        header: {
          style: {
            fontSize: "0.875rem",
            fontWeight: "bold",
            maxWidth: 200,
            minWidth: 160,
            borderLeft: "1px solid #E1E1E1",
          },
          align: "left",
        },
        render: (row) => Moment(row.issue_date).format("DD-MM-YYYY"),
        props: {
          style: {
            fontSize: "0.875rem",
            borderLeft: "1px solid #E1E1E1",
          },
        },
      },
      {
        field: "is_valid",
        label: "Hiệu lực",
        header: {
          style: {
            fontSize: "0.875rem",
            fontWeight: "bold",
            maxWidth: 200,
            minWidth: 160,
            borderLeft: "1px solid #E1E1E1",
          },
          align: "left",
        },
        render: (row) => (row.is_valid == 1 ? "Còn hiệu lực" : "Hết hiệu lực"),
        props: {
          style: {
            fontSize: "0.875rem",
            borderLeft: "1px solid #E1E1E1",
          },
        },
      },
      {
        field: "title",
        label: "Tiêu đề",
        header: {
          style: {
            fontSize: "0.875rem",
            fontWeight: "bold",
            borderLeft: "1px solid #E1E1E1",
            width: "75%",
          },
          align: "left",
        },
        props: {
          style: {
            fontSize: "0.875rem",
            borderLeft: "1px solid #E1E1E1",
            color: "#F5454B",
          },
          align: "justify",
        },
        render: (row) => {
          return (
            <span className={classes.download} onClick={() => download(row)}>
              {row.title}
            </span>
          );
        },
      },
    ],
    []
  );
  const input = useMemo(() => [
    {
      label: "Tìm kiếm văn bản",
      value: formik.values?.unit,
    },
  ]);
  const search = () => (
    <Grid className={classes.search}>
      <Paper component="form" className={classes.root}>
        <div
          style={{
            padding: 10,
          }}
        >
          <SearchIcon
            style={{
              color: "#E2363C",
            }}
          />
        </div>
        <InputBase
          className={classes.input}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tìm kiếm văn bản"
          inputProps={{ "aria-label": "Tìm kiếm văn bản" }}
        />
      </Paper>
      <Button className={classes.btnSearch} onClick={formik.handleSubmit}>
        Tìm kiếm
      </Button>
    </Grid>
  );

  const paging = useMemo(() => {
    return (
      <div>
        <Grid className={classes.paging}>
          <div className={classes.perPage}>
            <span
              style={{
                marginRight: 10,
              }}
            >
              Hiển thị
            </span>
            <Select
              native
              value={params?.per_page}
              onChange={(event) =>
                setParams({
                  ...params,
                  per_page: event.target.value,
                  page: 1,
                })
              }
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
            </Select>
          </div>
          <div className={classes.pagination}>
            <Pagination
              count={data?.articles?.last_page}
              page={params?.page}
              onChange={(event, page) => setParams({ ...params, page: page })}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </Grid>
      </div>
    );
  }, [data, classes]);

  return (
    <Grid item className={classes.content}>
      <Grid
        style={{
          width: "100%",
          fontFamily: "IBM Plex Serif",
          color: "#A70D13",
        }}
        className={classes.categoryName}
      >
        <h1>Văn bản</h1>
      </Grid>
      {search()}
      <DataTable
        data={data?.data}
        columns={columns}
        header={{
          style: {
            backgroundColor: "#F9F9F9",
          },
        }}
      />
      {paging}
    </Grid>
  );
});

export default Document;

const useStyle = makeStyles((theme) => ({
  categoryName: {
    "& h1": {
      marginTop: 0,
      boxShadow: "inset 0px -1px 0px #E1E1E1",
      paddingBottom: 15,
    },
    [theme.breakpoints.between("xs", "md")]: {
      paddingBottom: 15,
    },
  },
  content: {
    maxWidth: 800,
    marginRight: 40,
    boxShadow: "inset -1px 0px 0px #E4E4E4",
    paddingRight: 51.5,
    width: "100%",
    [theme.breakpoints.between("aa", "md")]: {
      padding: "0 10px",
      width: "100%",
      flexWrap: "wrap",
      maxWidth: "100%",
    },
    [theme.breakpoints.between("sm", 960)]: {
      padding: "0 10px",
      width: "100%",
      maxWidth: "100%",
      marginRight: 0,
      boxShadow: "none",
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      boxShadow: "none",
      margin: 0,
      padding: "0px 15px",
    },
  },
  search: {
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    height: 48,
    marginBottom: 20,
  },
  root: {
    width: "100%",
    display: "flex",
    flexWrap: "nowrap",
    border: "1px solid #E1E1E1",
    boxShadow: "none",
    borderRadius: 0,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  input: {
    width: "100%",
  },
  btnSearch: {
    maxWidth: 115,
    width: "100%",
    backgroundColor: "#E2363C",
    color: "#FFFFFF",
    borderRadius: 0,
    height: "100%",
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  paging: {
    display: "flex",
    flexWrap: "nowrap",
    marginBottom: 30,
    marginTop: 5,
    justifyContent: "space-between",
  },
  download: {
    "&:hover": {
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
}));
