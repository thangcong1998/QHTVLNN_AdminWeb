import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Container, Grid, Select, Button } from "@material-ui/core";
import SideBar from "../../../components/Front/SideBar";
import { useFetch, useAPI } from "../../../api/api";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { convert } from "../../../common/utils";

const Category = React.memo((props) => {
  const classes = useStyle();
  const location = useLocation();
  const [categoryId, setCategoryId] = useState(null);
  const [params, setParams] = useState({ page: 1, per_page: 10 });
  const [page, setPage] = useState(1);
  const _params = useMemo(() => {
    return params;
  }, [params]);
  useEffect(() => {
    let path = location.pathname.split(".");
    setCategoryId(path[path.length - 1]);
    setParams({ ...params, category: path[path.length - 1] });
  }, [location.pathname]);
  const {
    data: data,
    revalidate: refetch,
    loading: userLoading,
    error: errors,
  } = useFetch(
    categoryId
      ? ["get", "front/articles", JSON.stringify({ ..._params })]
      : null
  );

  const [articles, setArticles] = useState([]);
  const _articles = useMemo(() => {
    return articles;
  }, [articles]);
  const article = (article) => {
    return (
      <Link
        className={classes.link}
        to={
          "/" +
          convert(data?.category.name) +
          "." +
          data?.category.id +
          "/" +
          convert(article.title) +
          "." +
          article.id
        }
      >
        {article.feature_image_url ? (
          <Grid className={classes.article}>
            <Grid className={classes.main}>
              <div className={classes.mainTitle}>
                <h2>{article.title}</h2>
              </div>
              <Grid className={classes.imageXs}>
                <img
                  src={
                    process.env.REACT_APP_STORAGE_URL +
                    article.feature_image_url
                  }
                />
              </Grid>
              <div className={classes.mainShort}>
                {article.short_description}
              </div>
            </Grid>
            <Grid className={classes.image}>
              <img
                src={
                  process.env.REACT_APP_STORAGE_URL + article.feature_image_url
                }
              />
            </Grid>
          </Grid>
        ) : (
          <Grid className={classes.article}>
            <Grid className={classes.mainNoimg}>
              <div className={classes.mainTitle}>
                <h2>{article.title}</h2>
              </div>
              <Grid className={classes.imageXs}></Grid>
              <div className={classes.mainShort}>
                {article.short_description}
              </div>
            </Grid>
            <Grid className={classes.image}></Grid>
          </Grid>
        )}
      </Link>
    );
  };

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
              page={params.page}
              onChange={(event, page) => setParams({ ...params, page: page })}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </Grid>
        <Grid className={classes.loadMore}>
          {data?.articles?.last_page !== page ? (
            <Button variant="contained" onClick={() => loadmore()}>
              Xem thêm
            </Button>
          ) : (
            ""
          )}
        </Grid>
      </div>
    );
  }, [data, page]);

  const api = useAPI();
  const loadmore = async () => {
    setPage((pre) => pre + 1);
    try {
      const response = await api.fetcher("get", "articles", {
        category: categoryId,
        page: page + 1,
        per_page: 10,
      });
      setArticles((pre) => [...pre, ...response.articles.data]);
    } catch {}
  };

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
        <h1>{data?.category?.name}</h1>
      </Grid>
      {data?.articles?.data.map((e) => article(e))}
      {_articles?.map((e) => article(e))}
      {paging}
    </Grid>
  );
});
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
      padding: "0px 10px",
      width: "100%",
      flexWrap: "wrap",
      maxWidth: "100%",
    },
    [theme.breakpoints.between("sm", 960)]: {
      padding: "10px 10px 0px 10px",
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
  link: {
    color: "inherit",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  article: {
    display: "flex",
    boxShadow: "inset 0px -1px 0px #E1E1E1",
    paddingBottom: 20,
    marginBottom: 20,
  },
  main: {
    maxWidth: 486,
    marginRight: 53,
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
    [theme.breakpoints.between("sm", 960)]: {
      maxWidth: "none",
    },
    [theme.breakpoints.only("xs")]: {
      maxWidth: "100%",
      width: "100%",
      marginRight: 0,
    },
  },
  mainNoimg: {
    maxWidth: "100%",
    marginRight: 0,
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
    [theme.breakpoints.between("sm", 960)]: {
      maxWidth: "none",
    },
    [theme.breakpoints.only("xs")]: {
      maxWidth: "100%",
      width: "100%",
      marginRight: 0,
    },
  },
  mainTitle: {
    color: "#2E2E2E",
  },
  mainShort: {
    color: "#4B4B4B",
    textAlign: "justify",
  },
  image: {
    maxWidth: 205,
    "& img": {
      width: "100%",
    },
    [theme.breakpoints.between("sm", 960)]: {
      maxWidth: "25%",
    },
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  imageXs: {
    width: "100%",
    display: "none",
    "& img": {
      width: "100%",
    },
    [theme.breakpoints.only("xs")]: {
      display: "block",
    },
  },
  paging: {
    display: "flex",
    flexWrap: "nowrap",
    marginBottom: 30,
    marginTop: 5,
    justifyContent: "space-between",
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  loadMore: {
    display: "none",
    [theme.breakpoints.only("xs")]: {
      display: "block",
      width: "100%",
      textAlign: "center",
      marginBottom: 20,
      "& button": {
        backgroundColor: "#E2363C",
        fontFamily: "Roboto",
        fontSize: "0.875rem",
        color: "#fff",
        padding: "10px 15px",
      },
      "& :hover": {
        backgroundColor: "#E2363C",
      },
    },
  },
  pagination: {
    "& li>button": {
      border: "1px solid #E1E1E1",
    },
    "& .Mui-selected": {
      background: "#F7F7F7",
      color: "#E2363C",
    },
  },
}));
export default Category;
