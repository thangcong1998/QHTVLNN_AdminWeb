import React, { useMemo, useState } from "react";
import { Grid, MobileStepper } from "@material-ui/core";
import transport from "../../assets/front/image/sidebar/transport.svg";
import industyTrade from "../../assets/front/image/sidebar/industy_trade.svg";
import haiquan from "../../assets/front/image/sidebar/haiquan.svg";
import medical from "../../assets/front/image/sidebar/medical.svg";
import government from "../../assets/front/image/sidebar/government.svg";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import documentIcon from "../../assets/front/image/document.svg";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";
import { useFetch, useAPI } from "../../api/api";
import { Link } from "react-router-dom";
import { convert } from "../../common/utils";

const SideBar = React.memo((props) => {
  const classes = useStyle();
  const theme = useTheme();
  const { data: data } = useFetch(["get", "front/sidebar"]);
  const api = useAPI();
  const tutorialSteps = [
    {
      label: "Bộ giao thông vận tải",
      imgPath: transport,
    },
    {
      label: "Bộ công thương",
      imgPath: industyTrade,
    },
    {
      label: "Tổng cục hải quan",
      imgPath: haiquan,
    },
    {
      label: "Bộ y tế",
      imgPath: medical,
    },
    {
      label: "Chính phủ",
      imgPath: government,
    },
  ];
  const maxSteps = tutorialSteps.length;
  const [activeStep, setActiveStep] = useState(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  const handleDownload = async (row) => {
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
    } catch (e) { }
  }

  const portal = useMemo(() => {
    return (
      <Grid className={classes.portal}>
        <div className={classes.title}>
          <span>Cổng thông tin điện tử</span>
        </div>
        <div className={classes.portalItem}>
          <a href="https://mt.gov.vn/vn/">
            <img width="100%" src={transport} />
          </a>
        </div>
        <div className={classes.portalItem}>
          <a href="https://www.moit.gov.vn/">
            <img width="100%" src={industyTrade} />
          </a>
        </div>
        <div className={classes.portalItem}>
          <a href="https://www.customs.gov.vn/">
            <img width="100%" src={haiquan} />
          </a>
        </div>
        <div className={classes.portalItem}>
          <a href="https://moh.gov.vn/">
            <img width="100%" src={medical} />
          </a>
        </div>
        <div className={classes.portalItem}>
          <a href="http://chinhphu.vn/">
            <img width="100%" src={government} />
          </a>
        </div>
      </Grid>
    );
  });

  const news = useMemo(() => {
    return (
      <Grid className={classes.news}>
        <div className={classes.title}>
          <span>Bài viết mới nhất</span>
        </div>
        <ul>
          {data?.data?.news?.map((article, index) => (
            <li key={index}>
              <Link
                to={
                  "/" +
                  convert(article?.article_category?.name) +
                  "." +
                  article?.article_category_id +
                  "/" +
                  convert(article?.title) +
                  "." +
                  article?.id
                }
              >
                {article.title}
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    );
  });

  const documents = useMemo(() => {
    return (
      <Grid className={classes.document}>
        <div className={classes.title}>
          <span>Văn bản mới nhất</span>
        </div>
        <ul>
          {data?.data?.documents?.map((document, index) => (
            <li key={index}>
              <Link to="#" onClick={() => handleDownload(document)}>
                <Grid container wrap="nowrap" alignItems="center">
                  <Grid className={classes.documentIcon}>
                    <img src={documentIcon} />
                  </Grid>
                  <Grid className={classes.documentName}>{document.title}</Grid>
                </Grid>
              </Link>
            </li>
          ))}
        </ul>
      </Grid>
    );
  });

  const portalMoblie = useMemo(() => {
    return (
      <Grid className={classes.portalMobile}>
        <AutoPlaySwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {tutorialSteps.map((step, index) => (
            <div key={step.label}>
              {Math.abs(activeStep - index) <= 2 ? (
                <a href="#">
                  <img
                    className={classes.img}
                    src={step.imgPath}
                    alt={step.label}
                  />
                </a>
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
        <Paginate
          steps={maxSteps}
          position="static"
          variant="dots"
          activeStep={activeStep}
        />
      </Grid>
    );
  });

  return (
    <Grid className={classes.container}>
      {portal}
      {portalMoblie}
      {news}
      {documents}
    </Grid>
  );
});
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);
const Paginate = withStyles({
  root: {
    justifyContent: "center",
  },
  dot: {
    border: "3px solid #E1E1E1",
    boxSizing: "border-box",
    background: "#FFF",
    width: 15,
    height: 15,
  },
  dotActive: {
    border: "3px solid #F5454B",
    boxSizing: "border-box",
    background: "#F5454B",
  },
})(MobileStepper);
const useStyle = makeStyles((theme) => ({
  portal: {
    width: "100%",
    boxShadow: "inset 0px -1px 0px 0px #E4E4E4",
    paddingBottom: 10,
    "&:last-child": {
      marginBottom: 0,
    },
    [theme.breakpoints.only("xs")]: {
      display: "none",
    },
  },
  portalMobile: {
    width: "100%",
    display: "none",
    [theme.breakpoints.only("xs")]: {
      display: "block",
      "& img": {
        width: "100%",
      },
    },
  },
  title: {
    overflowWrap:"anywhere",
    fontSize: "1.125rem",
    fontWeight: "bold",
    textAlign: "left",
    lineHeight: "1.125rem",
    textTransform: "uppercase",
    fontStyle: "normal",
    fontFamily: "Roboto",
    marginBottom: 20,
  },
  portalItem: {
    marginBottom: 20,
  },
  news: {
    width: "100%",
    boxShadow: "inset 0px -1px 0px 0px #E4E4E4",
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
  document: {
    paddingTop: 30,
    "& ul": {
      textAlign: "left",
      paddingLeft: 10,
    },
    "& li": {
      listStyle: "none",
      color: "#9A9A9A",
      paddingBottom: 15,
      "& a": {
        color: "#2E2E2E",
        fontFamily: "Roboto",
        fontSize: "0.875rem",
        lineHeight: "1.256rem",
        textDecoration: "none",
      },
    },
  },
  documentIcon: {
    marginRight: 15,
  },
}));
export default SideBar;
