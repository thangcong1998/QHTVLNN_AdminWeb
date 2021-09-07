import React, { useMemo, useContext } from "react";
import {
  makeStyles,
  Toolbar,
  Button,
  Dialog,
  IconButton,
} from "@material-ui/core";
import { useDialog } from "../../../../components/Dialog";
import Filter from "../../../../components/table/Filter";
import { FilterInput } from "./FilterInput";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { useHistory } from "react-router-dom";
import { color } from "../../../../common/constants";
import RestoreFromTrashIcon from "@material-ui/icons/RestoreFromTrash";
import KeyboardReturnIcon from "@material-ui/icons/KeyboardReturn";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import FieldCheck from "../../../../components/Admin/SelectColumns";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import Poppover from "../../../../components/popover";
import { AuthContext } from "../../../../common/AuthProvider";

const DocumentSupportRequestToolbar = React.memo((props) => {
  const { setParams, checked, refetch, trashed, columns, ...others } = props;
  const classes = useStyles();
  const {admin, perm} = useContext(AuthContext);
  const { dialog, handleClose } = useDialog();
  const deleteChecked = async () => {
    await dialog({
      title: "Xoá các hàng đã chọn ?",
      type: "confirm ?",
    });
  };
  
  const handleTrashed = () => {
    if (trashed == 1) {
      setParams((pre) => ({ ...pre, page: 1, trashed: undefined }));
    } else {
      setParams((pre) => ({ ...pre, trashed: 1 }));
    }
  };
  const inputs = useMemo(() => {
    if (admin?.user_type !== 1) {
      return FilterInput.filter((e) => e.field != "unit");
    }
    return FilterInput;
  }, []);
  const OtherFeature = () => (
    <div>
      <div>
        <Button
          title="Thùng rác"
          onClick={() => handleTrashed()}
          startIcon={<DeleteIcon />}
        >
          Thùng rác
        </Button>
      </div>
    </div>
  );
  const TrashMode = () => {
    return checked?.length > 0 ? (
      <>
        <div>
          <h4>
            <span>Đã chọn {checked?.length} hàng</span>
          </h4>
        </div>
        <div>
          <div>
            <IconButton title="Xóa" onClick={() => deleteChecked()}>
              <DeleteForeverIcon />
            </IconButton>
            <IconButton
              title="Khôi phục"
              onClick={() => {}}
              style={{ color: color.SUCCESS }}
            >
              <RestoreFromTrashIcon />
            </IconButton>
          </div>
        </div>
      </>
    ) : (
      <>
        <div>
          <Button
            title="Trở lại"
            startIcon={<KeyboardReturnIcon />}
            onClick={() => handleTrashed()}
          >
            Trở lại
          </Button>
        </div>
        <div className={classes.leftBar}>
          <Filter setParams={setParams} inputs={FilterInput} />
        </div>
      </>
    );
  };
  const NormalMode = () => {
    return checked?.length > 0 ? (
      <>
        <div>
          <h4>
            <span>Đã chọn{checked?.length} hàng</span>
          </h4>
        </div>
        <div>
          <IconButton title="xoá" onClick={() => deleteChecked}>
            <DeleteIcon />
          </IconButton>
        </div>
      </>
    ) : (
      <>
        <div className={classes.leftBar}>
          <Filter setParams={setParams} inputs={inputs} />
          <FieldCheck columns={columns} />
          <Poppover
            content={OtherFeature()}
            children={
              <IconButton>
                <ArrowDropDownIcon />
              </IconButton>
            }
          />
        </div>
      </>
    );
  };

  return (
    <Toolbar
      className={checked?.length > 0 ? classes.checked : classes.toolbar}
      {...others}
    >
      {trashed ? TrashMode() : NormalMode()}
    </Toolbar>
  );
});
const useStyles = makeStyles((theme) => ({
  toolbar: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    paddingRight: 10,
    paddingLeft: 10,
  },
  leftBar: {
    display: "flex",
  },
  filter: {
    width: 350,
    maxHeight: 400,
    padding: "15px 18px",
  },
  checked: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingRight: 10,
    paddingLeft: 10,
    height: 64,
    backgroundColor: color.WARNING,
    "& h4": {
      fontSize: "1.5rem",
      fontWeight: "400",
      color: "#fff",
    },
    "& button": {
      color: "#fff",
    },
  },
}));
export default DocumentSupportRequestToolbar;
