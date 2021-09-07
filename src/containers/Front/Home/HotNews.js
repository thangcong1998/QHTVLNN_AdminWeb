import React, { useMemo, Fragment } from "react";
import { Link } from "react-router-dom";
import { Grid, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useFetch } from "../../../api/api";
import defaultimg from "../../../assets/front/image/default.svg";
import { convert } from "../../../common/utils";

const HotNews = React.memo((props) => {
  const classes = useStyle();
  const {
    data: dataHotNews,
  } = useFetch(["get", "front/hotNews"]);
  const news = useMemo(() => {
    if (dataHotNews) {
      return dataHotNews;
    }
    return [];
  }, [dataHotNews]);
  const New = useMemo(() => {
    return (
      <Fragment>
        <Link
          to={
            "/" +
            convert(news[0]?.article_category?.name) +
            "." +
            news[0]?.article_category_id +
            "/" +
            convert(news[0]?.title) +
            "." +
            news[0]?.id
          }
        >
          <Grid item className="image-sm">
            <img
              src={
                news[0]?.feature_image_url
                  ? process.env.REACT_APP_STORAGE_URL +
                  news[0]?.feature_image_url
                  : defaultimg
              }
            />
          </Grid>
        </Link>
        <Link
          to={
            "/" +
            convert(news[0]?.article_category.name) +
            "." +
            news[0]?.article_category_id +
            "/" +
            convert(news[0]?.title) +
            "." +
            news[0]?.id
          }
        >
          <Grid item className="new">
            <div className={classes.title}>
              <strong>{news[0] && news[0]?.title.substring(0, 123) + "..."}</strong>
            </div>
            <div className={classes.preContent}>
              {news[0] && news[0]?.short_description.substring(0, 123) + "..."}
            </div>
          </Grid>
        </Link>
        <Link
          to={
            "/" +
            convert(news[0]?.article_category.name) +
            "." +
            news[0]?.article_category_id +
            "/" +
            convert(news[0]?.title) +
            "." +
            news[0]?.id
          }
        >
          <Grid item className="image">
            <img
              src={
                news[0]?.feature_image_url
                  ? process.env.REACT_APP_STORAGE_URL +
                  news[0]?.feature_image_url
                  : defaultimg
              }
            />
          </Grid>
        </Link>
      </Fragment>
    );
  });
  const NewsList = useMemo(() => {
    return (
      <Grid Container>
        {news
          .filter((e, i) => i > 0)
          .map((e, i) => (
            <Grid className="new" key={i}>
              <Link
                key={i}
                to={
                  "/" +
                  convert(e?.article_category?.name) +
                  "." +
                  e?.article_category_id +
                  "/" +
                  convert(e?.title) +
                  "." +
                  e?.id
                }
              >
                <div className={classes.title}>
                  <strong>{e.title.substring(0, 123) + "..."}</strong>
                </div>
                <div className={classes.preContent}>
                  {e.short_description.substring(0, 123) + "..."}
                </div>
              </Link>
            </Grid>
          ))}
      </Grid>
    );
  });
  return (
    <div className={classes.fullwidth}>
      <Container maxWidth={false} className={classes.container}>
        <Grid container className={classes.New} item>
          {New}
        </Grid>
        <Grid container className={classes.NewsList} item>
          {NewsList}
        </Grid>
      </Container>
    </div>
  );
});
const useStyle = makeStyles((theme) => ({
  fullwidth: {
    background: "#FDF5F5",
    fontSize: "0.875rem",
  },
  container: {
    padding: "30px 0px",
    maxWidth: 1132,
    background: "#FDF5F5",
    display: "flex",
    [theme.breakpoints.between("md", "lg")]: {
      width: "100%",
      maxHeight: 500,
    },
    [theme.breakpoints.between("sm", "md")]: {
      padding: "20px 10px 14px 10px",
      width: "100%",
    },
    [theme.breakpoints.down("xs")]: {
      padding: "20px 18px 14px 10px",
      width: "100%",
      flexWrap: "wrap",
    },
  },
  New: {
    maxWidth: 822,
    "& a": {
      color: "#000",
      textDecoration: "none",
    },
    "& .image-sm": {
      display: "none",
      "& img": {
        height: "100%",
        width: "100%",
      },
      [theme.breakpoints.between("sm", "md")]: {
        display: "block",
      },
      [theme.breakpoints.down("xs")]: {
        display: "block",
        marginBottom: 10,
      },
    },
    "& .image": {
      "& img": {
        height: "auto",
        width: 552,
        maxHeight: 368,
        [theme.breakpoints.between("sm", "md")]: {
          display: "none",
        },
        [theme.breakpoints.between("md", "lg")]: {
          maxWidth: 540,
          width: "100%",
        },
      },
      [theme.breakpoints.between("sm", "md")]: {},
      [theme.breakpoints.down("xs")]: {
        display: "none",
      },
    },
    "& .new": {
      width: 252,
      textAlign: "justify",
      margin: "0px 16px 0px 0px",
      [theme.breakpoints.between("sm", "md")]: {
        width: "100%",
        padding: "0px 10px",
      },
      [theme.breakpoints.down("xs")]: {
        width: "100%",
        maxWidth: "100%",
        margin: "0px 0px 12px 0px",
      },
    },
  },
  NewsList: {
    width: 300,
    textAlign: "justify",
    boxShadow: "inset 1px 0px 0px #E4E4E4",
    paddingLeft: 13,
    [theme.breakpoints.up("md")]: {
      marginLeft: 10,
      maxHeight: 373,
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        // width: "10px",
        display: 'none',
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#cac6c640",
      },
    },
    [theme.breakpoints.between(960, "md")]: {
      marginLeft: 10,
      maxHeight: 373,
      width: "100%",
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        width: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "#cac6c640",
      },
    },
    [theme.breakpoints.between("sm", 960)]: {
      width: "100%",
      marginLeft: 10,
    },
    [theme.breakpoints.down("xs")]: {
      boxShadow: "inset 0px 1px 0px #E4E4E4",
      maxWidth: "100%",
      width: "100%",
      padding: "20px 0px 0px 0px",
    },
    "& a": {
      color: "#000",
      textDecoration: "none",
    },
    "& .new": {
      marginBottom: 16,
      boxShadow: "inset 0px -1px 0px #E4E4E4",
      paddingBottom: 10,
    },
    "& .last": {
      marginBottom: 0,
    },
  },
  title: {
    overflowWrap: "break-word",
    marginBottom: 10,
    fontSize: "1rem",
    fontFamily: "IBM Plex Serif",
  },
  preContent: {
    overflowWrap: "anywhere",
    fontFamily: "Roboto",
    lineHeight: "21px",
    fontSize: "0.875rem",
  },
}));
export default HotNews;
