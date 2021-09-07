import React, { Fragment } from "react";
import { useFetch } from "../../../api/api";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { convert } from "../../../common/utils";

const Home = React.memo((props) => {
  const classes = useStyle();
  const { data: dataHome } = useFetch([
    "get",
    "front/home",
  ]);

  function renderNewMain(data, cate) {
    return (
      <Grid className={classes.newsMainContainer}>
        {data?.feature_image_url ? (
          <Grid className={classes.newsMain}>
            <div>
              <Link
                to={
                  "/" +
                  convert(cate) +
                  "." +
                  data?.article_category_id +
                  "/" +
                  convert(data?.title) +
                  "." +
                  data?.id
                }
              >
                <img
                  alt=""
                  src={
                    process.env.REACT_APP_STORAGE_URL + data?.feature_image_url
                  }
                />
              </Link>
            </div>
            <div>
              <Link
                to={
                  "/" +
                  convert(cate) +
                  "." +
                  data?.article_category_id +
                  "/" +
                  convert(data?.title) +
                  "." +
                  data?.id
                }
              >
                <div className={classes.newsMainTitle} title={data?.title}>
                  {data?.title.substring(0, 123) + "..."}
                </div>
                <div className={classes.newsMainContent}>
                  {data?.short_description.substring(0, 123) + "..."}
                </div>
              </Link>
            </div>
          </Grid>
        ) : (
            <Grid className={classes.newsMainNoImg}>
              <Link
                to={
                  "/" +
                  convert(cate) +
                  "." +
                  data?.article_category_id +
                  "/" +
                  convert(data?.title) +
                  "." +
                  data?.id
                }
              >
                <div>
                  <div className={classes.newsMainTitle} title={data?.title}>
                    {data?.title.substring(0, 123) + "..."}
                  </div>
                  <div className={classes.newsMainContent}>
                    {data?.short_description.substring(0, 123) + "..."}
                  </div>
                </div>
              </Link>
            </Grid>
          )}
      </Grid>
    );
  }

  function renderNewList(data, cate) {
    return (
      <Grid className={classes.newsList}>
        {data
          .filter((e, i) => i > 0)
          .map((e, i) => (
            <Link
              to={
                "/" +
                convert(cate) +
                "." +
                e.article_category_id +
                "/" +
                convert(e.title) +
                "." +
                e.id
              }
            >
              <Grid className={classes.news}>
                <div className={classes.newsTitle} title={e.title}>
                  {e.title}
                </div>
                <Grid container wrap="nowrap">
                  {e.feature_image_url ? (
                    <>
                      <div className={classes.newsImage}>
                        <img
                          alt=""
                          src={
                            process.env.REACT_APP_STORAGE_URL +
                            e.feature_image_url
                          }
                        />
                      </div>
                      <div className={classes.newsContent}>
                        {e.short_description.substring(-1, 176)}
                      </div>
                    </>
                  ) : (
                      <div className={classes.newsContent}>
                        {e.short_description.substring(-1, 200)}
                      </div>
                    )}
                </Grid>
              </Grid>
            </Link>
          ))}
      </Grid>
    );
  }

  function render(data) {
    if (data) {
      return (
        <Fragment>
          <Grid className={classes.category}>
            <div className={classes.categoryTitle}>
              <fieldset>
                <legend>
                  <Link to={"/" + convert(data?.name) + "." + data?.id}>
                    {data?.name}
                  </Link>
                </legend>
              </fieldset>
            </div>
            <Grid container className={classes.categoryContent}>
              {renderNewMain(data?.articles[0], data?.name)}
              {renderNewList(data?.articles, data?.name)}
            </Grid>
          </Grid>
        </Fragment>
      );
    }
    return "";
  }

  return (
    <Grid item className={classes.content}>
      {dataHome?.map((e) => render(e))}
    </Grid>
  );
});
const useStyle = makeStyles((theme) => ({
  content: {
    maxWidth: 800,
    marginRight: 40,
    boxShadow: "inset -1px 0px 0px #E4E4E4",
    paddingRight: 51.5,
    width: "100%",
    "& a": {
      color: "inherit",
      textDecoration: "none",
      "&:hover": {
        textDecoration: "underline",
      },
    },
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
  sidebar: {
    maxwidth: 297,
    textAlign: "right",
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      padding: "0px 15px",
    },
  },
  category: {
    marginBottom: 30,
  },
  categoryTitle: {
    fontFamily: "IBM Plex Serif",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "1.5rem",
    lineHeight: "1.5rem",
    color: "#E2363C",
    "& fieldset": {
      width: "100%",
      border: "none",
      borderTop: "1px solid #E4E4E4",
      padding: 0,
    },
    "& legend": {
      padding: "0px 13px 14px 0px",
      "& a": {
        textDecoration: "none",
        color: "#E2363C",
        "&:hover": {
          textDecoration: "underline",
        },
      },
    },
  },
  categoryContent: {
    marginTop: 20,
    flexWrap: "nowrap",
    [theme.breakpoints.between("sm", "md")]: {
      flexWrap: "wrap",
    },
    [theme.breakpoints.only("xs")]: {
      flexWrap: "wrap",
    },
  },
  newsMainContainer: {
    paddingRight: 16,
    boxShadow: "inset -1px 0px 0px #E4E4E4",
    marginRight: 14,
    width: "50%",
    [theme.breakpoints.between("sm", "md")]: {
      boxShadow: "inset 0px -1px 0px #E4E4E4",
      marginRight: 0,
      paddingRight: 0,
      width: "100%",
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      boxShadow: "inset 0px -1px 0px #E4E4E4",
      marginRight: 0,
      padding: "0px 0px 15px 0px",
    },
  },
  newsMainNoImg: {
    width: "100%",
    minHeight: 336,
    background: "#F7F7F7",
    padding: 20,
    [theme.breakpoints.between("sm", "md")]: {
      padding: "0px 0px 20px 0px",
      maxWidth: "100%",
      width: "100%",
      minHeight: 0,
      background: "#FFF",
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      maxWidth: "100%",
      maxHeight: 210,
      minHeight: "unset",
      background: "#FFF",
      padding: 0,
    },
  },
  newsMain: {
    maxWidth: 358,
    minHeight: 336,
    padding: "0px 0px 20px 0px",
    "& img": {
      maxWidth: 358,
    },
    [theme.breakpoints.between("sm", "md")]: {
      maxWidth: "100%",
      width: "100%",
      "& img": {
        maxWidth: "100%",
      },
    },
    [theme.breakpoints.only("xs")]: {
      width: "100%",
      maxWidth: "100%",
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
    overflowWrap: "anywhere",
    color: "#4B4B4B",
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
    textAlign: "justify",
  },
  newsList: {
    textAlign: "justify",
    maxWidth: 355.5,
    [theme.breakpoints.between("sm", "md")]: {
      maxWidth: "100%",
      width: "100%",
    },
    [theme.breakpoints.only("xs")]: {
      maxWidth: "100%",
      width: "100%",
    },
  },
  news: {
    overflowWrap: "anywhere",
    paddingBottom: 15,
    [theme.breakpoints.between("sm", "md")]: {
      padding: "15px 0px",
      boxShadow: "inset 0px -1px 0px 0px #E4E4E4",
    },
    [theme.breakpoints.only("xs")]: {
      padding: "15px 0px",
      boxShadow: "inset 0px -1px 0px 0px #E4E4E4",
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
    width: 124,
    marginRight: 10,
    "& img": {
      maxWidth: 124,
    },
  },
  newsContent: {
    overflowWrap: "anywhere",
    color: "#4B4B4B",
    fontFamily: "Roboto",
    fontSize: "0.875rem",
    lineHeight: "1.256rem",
  },
}));
export default Home;
