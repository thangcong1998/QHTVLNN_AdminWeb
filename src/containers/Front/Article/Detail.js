import React, { useMemo, Fragment, useEffect, useState } from "react";
import { Container } from "@material-ui/core";
import { useFetch } from "../../../api/api";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";
import mb from "../../../assets/front/image/mb.jpg";
import { convert } from "../../../common/utils";
import moment from "moment";
import { Link } from "react-router-dom";

const Detail = React.memo((props) => {
  const classes = useStyle();
  const location = useLocation();
  const [articleId, setAticleId] = useState(null);
  useEffect(() => {
    let path = location.pathname.split(".");
    setAticleId(path[path.length - 1]);
  }, [location.pathname]);
  const {
    data: data,
    revalidate: refetch,
    loading: userLoading,
    error: errors,
  } = useFetch(articleId ? ["get", "front/article/" + articleId] : null);
  const Article = useMemo(() => {
    return (
      <Fragment>
        <Grid className={classes.category}>
          <div className={classes.categoryTitle}>
            <h1>{data?.data?.article.title}</h1>
            <p>
              {data?.created_at
                ? moment(data?.data?.article.created_at).format("DD/MM/YYYY")
                : ""}
            </p>
          </div>
          <div
            className={classes.contentNew}
            dangerouslySetInnerHTML={{ __html: data?.data?.article?.html }}
          />
          <div className={classes.othernews}>
            <fieldset>
              <legend></legend>
            </fieldset>
          </div>
        </Grid>
      </Fragment>
    );
  }, [data]);
  const news = useMemo(() => {
    return (
      <Grid className={classes.news}>
        <div className={classes.title}>
          <span>Các tin khác</span>
        </div>
        <ul>
          {data?.data?.moreArticles?.map((e, index) => (
            <li key={index}>
              <a
                href={
                  "/" +
                  convert(e?.article_category.name) +
                  "." +
                  e?.article_category_id +
                  "/" +
                  convert(e?.title) +
                  "." +
                  e?.id
                }
              >
                {e.title}
              </a>
            </li>
          ))}
        </ul>
      </Grid>
    );
  }, [data]);

  return (
    <Grid item className={classes.content}>
      {Article}
      {news}
    </Grid>
  );
});
const useStyle = makeStyles((theme) => ({
  content: {
    marginTop: -20,
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
    "& img": {
      maxWidth: "100%",
    },
  },

  category: {
    marginBottom: 30,
  },
  news: {
    [theme.breakpoints.only("xs")]: {
      padding: "15px 0px",
    },
  },
  title: {
    fontSize: "1.125rem",
    fontWeight: "bold",
    textAlign: "left",
    lineHeight: "1.125rem",
    textTransform: "uppercase",
    fontStyle: "normal",
    fontFamily: "Roboto",
    marginBottom: 20,
  },
  categoryTitle: {
    fontFamily: "IBM Plex Serif",
    fontStyle: "normal",
    fontWeight: "bold",
    lineHeight: "36px",
    color: "#2E2E2E",
  },
  othernews: {
    "& fieldset": {
      width: "100%",
      border: "none",
      border: "none",
      borderTop: "1px solid #E4E4E4",
      padding: 0,
    },
    "& legend": {
      padding: "0px 13px 14px 0px",
    },
    "& h2": {
      fontSize: "18px",
      fontFamily: "Roboto",
      fontStyle: "normal",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
  newsMainContainer: {
    paddingRight: 16,
    boxShadow: "inset -1px 0px 0px #E4E4E4",
    marginRight: 14,
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      boxShadow: "inset 0px -1px 0px 0px #E4E4E4",
      marginRight: 0,
      padding: "0px 0px 15px 0px",
    },
  },
  newsMainNoImg: {
    width: 318,
    minHeight: 336,
    background: "#F7F7F7",
    padding: 20,
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      maxHeight: 210,
      minHeight: "unset",
      background: "#FFF",
      padding: 0,
    },
  },
  newsMain: {
    width: 358,
    minHeight: 336,
    padding: "0px 0px 20px 0px",
    "& img": {
      maxWidth: 358,
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      minHeight: "unset",
      maxHeight: 445,
      padding: 0,
      "& img": {
        width: "100%",
        maxWidth: "100%",
      },
    },
  },

  newsMainTitle: {
    color: "#2E2E2E",
    fontFamily: "IBM Plex Serif",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "1.256rem",
    textAlign: "justify",
    marginBottom: 10,
  },
  newsMainContent: {
    color: "#4B4B4B",
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
    textAlign: "justify",
  },
  newsList: {
    textAlign: "justify",
    width: 355.5,
  },
  news: {
    width: "100%",
    paddingTop: 30,
    paddingBottom: 10,
    "& ul": {
      paddingLeft: 20,
      textAlign: "left",
    },
    "& li": {
      color: "#9A9A9A",
      paddingBottom: 15,
    },
    "& a": {
      fontFamily: "IBM Plex Serif",
      fontWeight: "bold",
      fontSize: "1rem",
      lineHeight: "1.256rem",
      color: "#2E2E2E",
      textDecoration: "none",
    },
  },
  newsTitle: {
    color: "#2E2E2E",
    fontFamily: "IBM Plex Serif",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "1.256rem",
    marginBottom: 10,
  },
  newsImage: {
    maxWidth: 124,
    marginRight: 10,
    "& img": {
      maxWidth: 124,
    },
  },
  newsContent: {
    color: "#4B4B4B",
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
  },
  breadcrumb: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
  textBread: {
    color: "#F5454B",
  },
  contentNew: {
    textAlign: "justify",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
  },
}));
export default Detail;
