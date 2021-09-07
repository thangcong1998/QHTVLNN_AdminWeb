import React, { useMemo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useAPI, useFetch } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import Pagination from "../../../components/table/Pagination";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useDialog } from "../../../components/Dialog";
import RoleToolbar from "./RoleToolbar";
import moment from "moment";
import t from "../../../common/admin-text.json";

const initParams = {
  per_page: 10,
  page: 1,
};
const RoleList = React.memo((props) => {
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const _params = useMemo(() => params, [params]);

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

  const history = useHistory();
  const { data: data, revalidate: refetch, loading: loading } = useFetch([
    "get",
    "admin/role",
    JSON.stringify(_params),
  ]);

  const columns = useMemo(
    () => [
      {
        field: "display_name",
        label: t.role_screen.name,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: "50%",
          },
          align: "left",
        },
        props: {
          align: "left",
        },
        display: true,
        render: (row) => row.display_name,
      },
      {
        field: "created_at",
        label: t.common.created_at,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
          },
          align: "left",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "left",
        },
        display: true,
        render: (row) =>
          row.created_at ? moment(row?.created_at).format("DD-MM-YYYY") : "",
      },
      {
        field: "updated_at",
        label: t.common.updated_at,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
          },
          align: "left",
        },
        props: {
          style: {
            fontSize: "1rem",
            padding: 8,
          },
          align: "left",
        },
        display: true,
        render: (row) =>
          row.updated_at ? moment(row?.updated_at).format("DD-MM-YYYY") : "",
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
  const deleteConfirm = async (row) => {
    await dialog({
      title: "Xác nhận xóa hàng này ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/role/" + row.id, {
        action: params?.trashed ? 'force' : 'delete'
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) { }
  };
  const restoreRole = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/role/" + row.id, {
        action: "restore",
      });
      if (res) {
        history.go(0);
      }
    } catch (e) { }
  };
  return (
    <Paper elevation={5}>
      <RoleToolbar
        setParams={setParams}
        checked={checked}
        trashed={_params?.trashed}
        columns={columnCheck}
      />
      <DataTable
        data={data?.data}
        columns={columnCheck.columnChecked}
        loading={loading}
        sort={sort}
        onSort={(column) => handleSort(column)}
        onEdit={(row) => {
          history.push("/quanly/role/" + row.id);
        }}
        onClickRow={(row) => history.push("/quanly/role/" + row.id)}
        onDelete={(row) => {
          deleteConfirm(row);
        }}
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 100,
            },
          },
        }}
        trashed={params?.trashed}
        onRestore={(row) => restoreRole(row)}
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
export default RoleList;
