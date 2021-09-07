import React, { useState } from "react";
import { Popover } from "@material-ui/core";

export default React.memo((props) => {
  const { content, children, ...otherProps } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const anchor = {
    ...children,
    props: {
      ...children.props,
      onClick: handleClick,
    },
  };

  return (
    <React.Fragment>
      <div>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          {content}
        </Popover>
      </div>
      {anchor}
    </React.Fragment>
  );
});
