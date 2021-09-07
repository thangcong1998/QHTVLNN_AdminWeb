import React, { useMemo, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useFetch, useAPI } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import CategoryToolbar from "./CategoryToolbar";
import Pagination from "../../../components/table/Pagination";
import { useDialog } from "../../../components/Dialog";
import CategoryForm from "./CategoryForm";
import useCheckedColumns from "../../../common/CheckedColumns";
const initParams = {
  per_page: 10,
  page: 1,
};

const CategoryList = React.memo((props) => {
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
  const _params = useMemo(() => params, [params]);
  //sort
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
  //
  const { dialog, handleClose } = useDialog();
  const { data: data, revalidate: refetch, loading: loading } = useFetch([
    "get",
    "admin/category",
    JSON.stringify(_params),
  ]);
  const api = useAPI();

  const columns = useMemo(
    () => [
      {
        field: "name",
        label: "Tên danh mục",
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
          },
          align: "center",
        },
        sort: true,
        props: {
          style: {

            fontSize: "1rem",
            padding: 8,
            overflowWrap:"anyWhere"
          },
          align: "center",
        },
        display: true,
        render: (row) => row.name,
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

  const editCategory = async (row) => {
    await dialog({
      title: "Sửa tên danh mục",
      content: <CategoryForm row={row} close={handleClose} refetch={refetch} />,
    });
  };

  const deleteConfirm = async (row, action) => {
    await dialog({
      title: "Xác nhận xóa hàng này ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/category/" + row.id, {
        action: "delete",
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) { }
  };

  const restoreCategory = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/category/" + row.id, {
        action: "restore",
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) { }
  };
  console.log(checked)

  return (
    <Paper elevation={5}>
      <CategoryToolbar
        setParams={setParams}
        checked={checked}
        refetch={refetch}
        trashed={_params?.trashed}
        columns={columnCheck}
      />
      <DataTable
        data={data?.data}
        columns={columnCheck.columnChecked}
        onEdit={(row) => {
          editCategory(row);
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
              width: 170,
            },
          },
        }}
        trashed={params?.trashed}
        onRestore={(row) => restoreCategory(row)}
        checked={checked}
        onCheck={(row, type) => handleCheck(row, type)}
        loading={loading}
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
export default CategoryList;
