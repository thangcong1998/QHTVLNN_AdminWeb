import React from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";

const useStyle = makeStyles((theme) => ({
  pathname: {
    fontSize: "1.142rem",
    color: "#115293",
  },
}));
const Breadcrumb = React.memo((props) => {
  const { crumbs } = props;
  const classes = useStyle();
  const history = useHistory();
  const handleClick = (path) => {
    history.push(path);
  };
  return (
    <Breadcrumbs
      aria-label="breadcrumb"
      style={{
        color: "#115293",
        marginBottom: 20
      }}
    >
      {crumbs.map((e, i) =>
        i + 1 !== crumbs.length ? (
          <Link
            key={e.name}
            className={classes.pathname}
            style={{
              cursor: "pointer",
            }}
            color="inherit"
            onClick={() => handleClick(e.path)}
          >
            {e.name}
          </Link>
        ) : (
            <Typography
              key={e.name}
              className={classes.pathname}
              color="textPrimary"
            >
              {e.name}
            </Typography>
          )
      )}
    </Breadcrumbs>
  );
});

export default Breadcrumb;
