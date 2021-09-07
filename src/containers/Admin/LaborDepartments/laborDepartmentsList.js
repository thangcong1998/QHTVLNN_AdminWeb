import React, { useMemo, useState, useEffect } from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { useFetch, useAPI } from "../../../api/api";
import DataTable from "../../../components/table/DataTable";
import Pagination from "../../../components/table/Pagination";
import LaborToolBar from "./laborToolBar";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useHistory } from "react-router-dom";
import { useDialog } from "../../../components/Dialog";
import { useFormik } from "formik";

const laborDepartmentsList = React.memo((props) => {
  const classes = useStyles();
  const [params, setParams] = useState({ per_page: 10, page: 1 });
  const _params = useMemo(() => params, [params]);
  const [sort, setSort] = useState(null);
  const history = useHistory();
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "admin/laborDepart",
    JSON.stringify(_params),
  ]);
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const deleteConfirm = async (row, action) => {
    await dialog({
      title: "Xác nhận xoá dòng này?",
      type: "confirm",
      confirmationText: "Xác Nhận",
      cancellationText: "Bỏ Qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/laborDepart/" + row.id,{
        action: params?.trashed ? 'force':'delete',
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {} 
  };
  const restoreLaborDepart = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục",
      type: "confirm",
      confirmationText: "Xác Nhận",
      cancellationText: "Bỏ Qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/laborDepart/" + row.id, {
        action: "restore",
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };
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
  const columns = useMemo(() => [
    {
      field: "name",
      label: "Tên sở",
      display:true,
      header: {
        style: {
          fontSize: "1rem",
          fontWeight: "bold",
          minWidth: 160,
        },
        align: "center",
      },
      sort: true,
      required: true,
      props: {
        style: {
          fontSize: "1rem",
          padding: 8,
        },
        align: "center",
      },
      render: (row) => row.name,
    },
    {
      field: "province_id",
      label: "Tỉnh/Thành phố",
      display:true,
      render: (row) => row.province?.name,
    },
    // {
    //   field: "district_id",
    //   label: "district_id",
    //   display: false,
    //   // render: (row) => row.district_id,
    // },
    // {
    //   field: "ward_id",
    //   label: "ward_id",
    //   display: false,
    //   // render: (row) => row.ward_id,
    // },
    {
      field: "address",
      label: "Địa Chỉ",
      display: true,
      render: (row) => row.address,
    },
    {
      field: "tel",
      label: "Số điện thoại",
      display: true,
      render: (row) => row.tel,
    },
    {
      field: "email",
      label: "Email",
      display: true,
      render: (row) => row.email,
    },
  ]);
  const columnCheck = useCheckedColumns(columns);
  const tableLoading = useMemo(() => (api.loading ? api.loading : loading), [
    api.loading,
    loading,
  ]);
  return (
    <Paper elevation={5}>
      <LaborToolBar
        checked={checked}
        setParams={setParams}
        refetch={refetch}
        trashed={_params?.trashed}
        columns={columnCheck}
        setChecked={setChecked}
      />
      <DataTable
        data={data?.data}
        checked={checked}
        columns={columnCheck.columnChecked}
        loading={tableLoading}
        onClickRow={(row) => {history.push("/quanly/laborDepartment/" + row.id)}}
        onEdit={(row) => {
          history.push("/quanly/laborDepartment/" + row.id);
        }}
        sort={sort}
        onSort={(column) => handleSort(column)}
        onDelete={(row, action) => {
          deleteConfirm(row, action);
        }}
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 122,
            },
          },
        }}
        onSort={(column) => handleSort(column)}
        trashed={params?.trashed}
        onRestore={(row) => restoreLaborDepart(row)}
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
const useStyles = makeStyles(() => ({
  TableContainer: {
    "& .MuiTablecell-root": {
      padding: 10,
    },
  },
}));
export default laborDepartmentsList;
