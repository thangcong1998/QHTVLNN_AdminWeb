import React, { useMemo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useAPI, useFetch } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import Pagination from "../../../components/table/Pagination";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useDialog } from "../../../components/Dialog";
import UserToolbar from "./UserToolbar";
import t from "../../../common/admin-text.json";
const initParams = {
  per_page: 10,
  page: 1,
};
const UserList = React.memo((props) => {
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const _params = useMemo(() => params, [params]);
  const history = useHistory();
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "admin/user?user_type=1",
    JSON.stringify(_params),
  ]);
  console.log(data)
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

  const columns = useMemo(
    () => [
      {
        field: "full_name",
        label: t.user_screen.full_name,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
          },
          align: "left",
        },
        props: {
          align: "left",
        },
        display: true,
        render: (row) => row?.full_name,
      },
      {
        field: "user_name",
        label: t.user_screen.user_name,
        display: true,
      },
      // {
      //   field: "user_type",
      //   label: t.user_screen.user_type,
      //   display: true,
      //   render: (row) => {
      //     if (row.user_type == 1) return "Cán bộ quỹ";
      //     if (row.user_type == 2) return "Doanh nghiệp";
      //     if (row.user_type == 3) return "Cán bộ sở LĐ-TB-XH";
      //   },
      // },
      {
        field: "job_title",
        label: t.common.job_title,
        display: true,
        render: (row) => row?.job_title?.name,
      },
      {
        field: "department",
        label: t.user_screen.department,
        display: true,
        render: (row) => row?.department?.name,
      },
      {
        field: "role",
        label: t.user_screen.role,
        display: true,
        render: (row) => row?.role?.display_name,
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
      title: "Xác nhận xoá dòng này?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/user/" + row.id,{
        action: params?.trashed ? 'force':'delete',
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };
  const restoreUser = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/user/" + row.id, {
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
      <UserToolbar
        setParams={setParams}
        checked={checked}
        trashed={_params?.trashed}
        columns={columnCheck}
        refetch={refetch}
      />
      <DataTable
        data={data?.data}
        columns={columnCheck.columnChecked}
        loading={loading}
        sort={sort}
        onSort={(column) => handleSort(column)}
        onEdit={(row) => {
          history.push("/quanly/user/" + row.id);
        }}
        onDelete={(row, action) => {
          deleteConfirm(row, action);
        }}
        trashed={params?.trashed}
        onRestore={(row) => restoreUser(row)}
        checked={checked}
        onCheck={(row, type) => handleCheck(row, type)}
        onClickRow={(row) => history.push("/quanly/user/" + row.id)}
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
export default UserList;
