import React, { useMemo, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useFetch, useAPI } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import DocumentToolbar from "./DocumentToolbar";
import Pagination from "../../../components/table/Pagination";
import Moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useDialog } from "../../../components/Dialog";
import { useHistory } from "react-router-dom";
import useCheckedColumns from "../../../common/CheckedColumns";
import t from "../../../common/admin-text.json";

const initParams = {
  per_page: 10,
  page: 1,
};
const DocumentList = React.memo((props) => {
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
  const { dialog, handleClose } = useDialog();
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
  const history = useHistory();
  const { data: data, revalidate: refetch, loading: loading } = useFetch([
    "get",
    "admin/document",
    JSON.stringify(_params),
  ]);
  const api = useAPI();
  const columns = useMemo(
    () => [
      {
        field: "title",
        label: t.document_screen.title,
        header: {
          width: "50%",
        },
        props: {
          width: "50%",
        },
        display: true,
        sort: true,
      },
      {
        field: "issue_date",
        label: t.document_screen.issue_date,
        render: (row) => Moment(row.issue_date).format("DD/MM/YYYY"),
        display: true,
        sort: true,
      },
      {
        field: "is_valid",
        label: t.document_screen.is_valid,
        render: (row) => (row.is_valid === 1 ? "Còn" : "hết"),
        display: true,
      },
    ],
    []
  );

  const columnCheck = useCheckedColumns(columns);
  const downloadFile = async (row) => {
    try {
      let res = await api.fetcher(
        "post",
        "/admin/downloadDocument/" + row.id,
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
  };

  const Download = (row) => (
    <IconButton style={{ padding: 3 }} onClick={() => downloadFile(row)}>
      <CloudDownloadIcon />
    </IconButton>
  );
  const deleteConfirm = async (row, action) => {
    await dialog({
      title: "Xác nhận xóa hàng này ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/document/" + row.id,{
        action: 'delete',
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) { }
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
  useEffect(() => {
    setChecked([]);
  }, [data]);

  return (
    <Paper elevation={5}>
      <DocumentToolbar
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
          history.push("/quanly/document/" + row.id);
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
              width: 150,
            },
          },
          render: (row) => {
            return Download(row);
          },
        }}
        onClickRow={(row) => history.push("/quanly/document/" + row.id)}
        checked={checked}
        loading={loading | api.loading}
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
export default DocumentList;
