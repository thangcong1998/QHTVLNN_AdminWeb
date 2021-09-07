import React, { useMemo, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useFetch, useAPI } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import AuditToolbar from "./AuditToolbar";
import Pagination from "../../../components/table/Pagination";
import { useDialog } from "../../../components/Dialog";
import useCheckedColumns from "../../../common/CheckedColumns";
import Moment from "moment";
import t from "../../../common/admin-text.json";

const initParams = {
  per_page: 10,
  page: 1,
};

const Audit = React.memo((props) => {
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
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

  const { dialog, handleClose } = useDialog();
  const { data: data, revalidate: refetch, loading: loading } = useFetch([
    "get",
    "admin/audit",
    JSON.stringify(_params),
  ]);
  const api = useAPI();
  console.log(data);

  const columns = useMemo(
    () => [
      {
        field: "auditable_type",
        label: t.audit_screen.auditable_type,
        display: true,
      },
      {
        field: "event",
        label: t.audit_screen.event,
        display: true,
        render: (row) => {
          if (row.event == "created") {
            return "Tạo mới";
          } else {
            if (row.event == "updated") {
              return "Chỉnh sửa";
            } else {
              if (row.event == "deleted") {
                return "Xóa";
              } else {
                return "Khôi phục";
              }
            }
          }
        },
        header: {
          align: "center",
        },
        props: {
          align: "center",
        },
      },
      {
        field: "user_id",
        label: t.audit_screen.user,
        display: true,
        render: (row) => row.user?.full_name,
        header: {
          align: "center",
        },
        props: {
          align: "center",
        },
      },
      {
        field: "created_at",
        label: t.audit_screen.created_at,
        render: (row) => Moment(row.created_at).format("DD/MM/YYYY"),
        display: true,
        header: {
          align: "center",
        },
        props: {
          align: "center",
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

  return (
    <Paper elevation={5}>
      <AuditToolbar
        setParams={setParams}
        refetch={refetch}
        columns={columnCheck}
      />
      <DataTable
        data={data?.data}
        columns={columnCheck.columnChecked}
        loading={loading}
        actionColumn={{
          hide: true,
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
const useStyle = makeStyles((theme) => ({
  TableContainer: {
    "& .MuiTableCell-root": {
      padding: 10,
    },
  },
}));
export default Audit;
