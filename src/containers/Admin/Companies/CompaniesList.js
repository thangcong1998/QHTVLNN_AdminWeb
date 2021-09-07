import React, { useMemo, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useFetch, useAPI } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import CompaniesToolbar from "./CompaniesToolbar";
import Pagination from "../../../components/table/Pagination";
import Moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { useHistory } from "react-router-dom";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useDialog } from "../../../components/Dialog";
const initParams = {
  per_page: 10,
  page: 1,
};
const CompaniesList = React.memo((props) => {
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
  const history = useHistory();
  const { dialog, handleClose } = useDialog();
  const { data: data, revalidate: refetch, loading: loading } = useFetch([
    "get",
    "admin/companies",
    JSON.stringify(_params),
  ]);
  const api = useAPI();
  const columns = useMemo(
    () => [
      {
        field: "name",
        label: "Tên doanh nghiệp",
        display: true,
        sort: true,
      },
      {
        field: "trading_name",
        label: "Tên giao dịch",
        display: true,
        sort: true,
      },
      {
        field: "company_type",
        label: "Loại doanh nghiệp",
        render: (row) => row?.company_type?.name,
        display: true,
      },
      {
        field: "is_active",
        label: "Hoạt động",
        render: (row) =>
          row?.is_active === 1 ? "Còn hoạt động" : "Dừng hoạt động",
        display: true,
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
  const deleteConfirm = async (row, action) => {
    await dialog({
      title: "Xác nhận xóa hàng này ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/companies/" + row.id, {
        action: params?.trashed ? 'force':'delete',
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };

  const restoreCategory = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/companies/" + row.id, {
        action: "restore",
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };
  useEffect(() => {
    setChecked([]);
  }, [data]);

  return (
    <Paper elevation={5}>
      <CompaniesToolbar
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
          history.push("/quanly/companies/" + row.id);
        }}
        sort={sort}
        onSort={(column) => handleSort(column)}
        onDelete={(row, action) => {
          deleteConfirm(row,action);
        }}
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 150,
            },
          },
        }}
        onClickRow={(row) => history.push("/quanly/companies/" + row.id)}
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
export default CompaniesList;
