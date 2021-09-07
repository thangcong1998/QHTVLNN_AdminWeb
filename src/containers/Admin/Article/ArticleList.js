import React, { useMemo, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { IconButton, Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useAPI, useFetch } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import ArticleToolbar from "./ArticleToolbar";
import Pagination from "../../../components/table/Pagination";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useDialog } from "../../../components/Dialog";
import Preview from "./preview.png";
import t from "../../../common/admin-text.json";

const initParams = {
  per_page: 10,
  page: 1,
};

const CategoryList = React.memo((props) => {
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
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "admin/article",
    JSON.stringify(_params),
  ]);

  const columns = useMemo(
    () => [
      {
        field: "title",
        label: t.article_screen.title,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
          },
          align: "center",
        },
        props: {
          align: "center",
        },
        display: true,
        render: (row) => row.title,
      },
      {
        field: "category",
        label: t.article_screen.category,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
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
        render: (row) => row?.article_category?.name,
      },
      {
        field: "is_public",
        label: t.article_screen.is_public,
        header: {
          style: {
            fontSize: "1rem",
            fontWeight: "bold",
            minWidth: 160,
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
        render: (row) => (row.is_public == 1 ? "On" : "Off"),
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
      const res = await api.fetcher("delete", "admin/article/" + row.id, {
        action: action,
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) { }
  };

  const restoreArticle = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/article/" + row.id, {
        action: "restore",
      });
      if (res) {
        history.go(0);
      }
    } catch (e) { }
  };
  const tableLoading = useMemo(() => (api.loading ? api.loading : loading), [
    api.loading,
    loading,
  ]);
  return (
    <Paper elevation={5}>
      <ArticleToolbar
        setParams={setParams}
        checked={checked}
        trashed={_params?.trashed}
        columns={columnCheck}
        refetch={refetch}
      />
      <DataTable
        data={data?.data}
        columns={columnCheck.columnChecked}
        loading={tableLoading}
        sort={sort}
        onSort={(column) => handleSort(column)}
        onEdit={(row) => {
          history.push("/quanly/article/" + row.id);
        }}
        onDelete={(row, action) => {
          deleteConfirm(row, action);
        }}
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 150,
            },
          },
          render: (row) => {
            return (
              <IconButton
                color="primary"
                title="Xem trước"
                style={{
                  padding: 3,
                }}
                onClick={() => history.push("/quanly/previewArticle/" + row.id)}
              >
                <img src={Preview} height={20} width={20} />
              </IconButton>
            );
          },
        }}
        onClickRow={(row) => history.push("/quanly/article/" + row.id)}
        trashed={params?.trashed}
        onRestore={(row) => restoreArticle(row)}
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
export default CategoryList;
