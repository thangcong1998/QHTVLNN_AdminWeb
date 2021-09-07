import React, { useMemo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useAPI, useFetch } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import Pagination from "../../../components/table/Pagination";
import FrontSettingToolbar from "./FrontSettingToolbar";
import IconButton from "@material-ui/core/IconButton";
import SettingsIcon from "@material-ui/icons/Settings";
import useCheckedColumns from "../../../common/CheckedColumns";
import { toast } from "react-toastify";
import { useDialog } from "../../../components/Dialog";
import t from "../../../common/admin-text.json";

const initParams = {
  per_page: 10,
  page: 1,
};

const FrontSetting = React.memo((props) => {
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
  const _params = useMemo(() => params, [params]);
  const history = useHistory();
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const formData = new FormData();
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "admin/frontSetting",
    JSON.stringify(_params),
  ]);

  const [sort, setSort] = useState(null);
  useEffect(() => {
    if (!params.sort) {
      setSort(null);
    }
  }, [params]);
  const handleSort = (column) => {
    if (sort?.field == column.field) {
      if (sort.type === "desc") {
        setSort(null);
        setParams((pre) => ({ ...pre, sort: null }));
      } else {
        setSort((pre) => ({
          ...pre,
          type: "desc",
        }));
        setParams((pre) => ({ ...pre, sort: column.field + "|" + "desc" }));
      }
    } else {
      setSort({ field: column.field, type: "asc" });
      setParams((pre) => ({ ...pre, sort: column.field + "|" + "asc" }));
    }
  };
  const setIsDefault = async (value) => {
    try {
      let res = await api.fetcher("post", "admin/defaultLocal/" + value.id);
      if (res) {
        refetch();
      }
    } catch (e) {}
  };

  const columns = useMemo(
    () => [
      {
        field: "address_footer",
        label: t.front_setting_screen.address_footer,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 150,
          },
          align: "center",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "center",
        },
        display: true,
        render: (row) => row.address_footer,
      },
      {
        field: "contact_hotline",
        label: t.front_setting_screen.contact_hotline,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 100,
          },
          align: "center",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "center",
        },
        display: true,
        render: (row) => row.contact_hotline,
      },
      {
        field: "contact_mail",
        label: t.front_setting_screen.contact_mail,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 100,
          },
          align: "center",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "center",
        },
        display: true,
        render: (row) => row.contact_mail,
      },
      {
        field: "fax_footer",
        label: t.front_setting_screen.fax_footer,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 100,
          },
          align: "center",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "center",
        },
        display: true,
        render: (row) => row.fax_footer,
      },
      {
        field: "building_footer",
        label: t.front_setting_screen.building_footer,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 150,
          },
          align: "center",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "center",
        },
        display: true,
        render: (row) => row.building_footer,
      },
      {
        field: "is_default",
        label: t.front_setting_screen.is_default,
        header: {
          align: "center",
        },
        props: {
          align: "center",
        },
        display: true,
        render: (row) => {
          if (row.is_default === 0) {
            return (
              <IconButton
                style={{ padding: 3 }}
                onClick={() => setIsDefault(row)}
              >
                <SettingsIcon />
              </IconButton>
            );
          } else {
            return <p style={{ color: "#00F416" }}>Đang sử dụng</p>;
          }
        },
      },
    ],
    []
  );
  const columnCheck = useCheckedColumns(columns);
  const [checked, setChecked] = useState([]);
  const handleCheck = (row, type) => {
    if (type == "all") {
      setChecked(row);
    } else {
      if (checked.includes(row.id)) {
        setChecked(checked.filter((e) => e != row.id));
      } else {
        setChecked((pre) => [...pre, row.id]);
      }
    }
  };
  useEffect(() => {
    setChecked([]);
  }, [data]);

  const deleteConfirm = async (row, action) => {
    await dialog({
      title: "Xác nhận xóa hàng này ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/frontSetting/" + row.id, {
        action: params?.trashed ? 'force':'delete',
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };

  const restoreSetting = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/frontSetting/" + row.id, {
        action: "restore",
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };
  return (
    <Paper elevation={5}>
      <FrontSettingToolbar
        setParams={setParams}
        checked={checked}
        refetch={refetch}
        trashed={_params?.trashed}
        columns={columnCheck}
      />
      <DataTable
        data={data?.data}
        columns={columnCheck.columnChecked}
        loading={loading}
        onEdit={(row) => {
          history.push("/quanly/setting/" + row.id);
        }}
        onDelete={(row) => {
          if (row.is_default === 0) {
            return deleteConfirm(row);
          } else {
            toast.warning("Không thể xóa thông tin đang được sử dụng", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        }}
        sort={sort}
        onSort={(column) => handleSort(column)}
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 100,
            },
          },
        }}
        onClickRow={(row) => history.push("/quanly/setting/" + row.id)}
        trashed={params?.trashed}
        onRestore={(row) => restoreSetting(row)}
        checked={checked}
        onCheck={(row, type) => handleCheck(row, type)}
        className={classes.TableContainer}
      />
      <Pagination
        setParams={setParams}
        count={data?.last_page}
        page={params.page}
        perPage={params.per_page}
        fromTo={[data?.from, data?.to]}
        total={data?.total}
      />
    </Paper>
  );
});
const useStyle = makeStyles((theme) => ({
  TableContainer: {
    "& .MuiTableCell-root": {
      padding: 10,
    },
  },
}));
export default FrontSetting;
