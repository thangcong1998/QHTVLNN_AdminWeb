import React, { useMemo, useState, useEffect } from "react";
import { makeStyles, Paper, TableContainer } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useFetch, useAPI } from "../../../api/api";
import { useDialog } from "../../../components/Dialog";
import { useParams, useHistory } from "react-router-dom";
import Pagination from "../../../components/table/Pagination";
import RegionsToolbar from "./RegionsToolbar";
import RegionForm from "./RegionForm";
import useCheckedColumns from "../../../common/CheckedColumns";
const initParams = {
  per_page: 10,
  page: 1,
};

const RegionList = React.memo((props) => {
  const classes = useStyles();
  const history = useHistory();
  const [params, setParams] = useState(initParams);
  const _params = useMemo(() => params, [params]);
  const [sort, setSort] = useState(null);
  useEffect(
    () => {
      if (!params.sort) {
        setSort(null);
      }
    },
    { params }
  );
  const api = useAPI();
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
  const { data: data, loading: loading, revalidate: refetch } = useFetch([
    "get",
    "admin/regions",
    JSON.stringify(_params),
  ]);
  const { dialog, handleClose } = useDialog();
  const deleteConfirm = async (row, action) => {
    await dialog({
      title: "Xác nhận xoá hàng này ?",
      type: "confirm",
      confirmationText: "Xác Nhận",
      cancellationText: "Bỏ Qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/regions/" + row.id, {
        action: params?.trashed ? 'force' : 'delete'
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };

  const editRegions = async (row)=>{
    await dialog ({
      title:"Sửa đơn vị hành chính",
      content:<RegionForm row={row} close={handleClose} refetch={refetch} />,
    });
  };

  const restoreRegion = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục",
      type: "confirm",
      confirmationText: "Xác Nhận",
      cancellationText: "Bỏ Qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/regions/" + row.id, {
        action: "restore",
      });
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
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
      label: "Tên Địa Điểm",
      display: true,
      render: (row) => row.name
    },
    {
      field: "type",
      label: "Cấp",
      render: (rowData) => {
        if (rowData.type == 1) return "Tỉnh/Thành";
        if (rowData.type == 2) return "Quận/Huyện";
        if (rowData.type == 3) return "Xã/Phường";
      },
      display: true,
    },
  ]);
  const columnCheck = useCheckedColumns(columns);

  return (
    <Paper elevation={5}>
      <RegionsToolbar
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
        onEdit={(row) => { editRegions(row)
        }}
        sort={sort}
        onSort={(column) => handleSort(column)}
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 110,
            },
          },
        }}
        onSort={(column) => handleSort(column)}
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
    "& .MuiTableCell-root": {
      padding: 10,
    },
  },
}));
export default RegionList;
