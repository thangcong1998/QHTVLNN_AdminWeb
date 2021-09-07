import React, { useMemo, useEffect, useState, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useAPI, useFetch } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import Pagination from "../../../components/table/Pagination";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useDialog } from "../../../components/Dialog";
import moment from "moment";
import t from "../../../common/admin-text.json";
import SettlementToolbar from "./SettlementToolbar";
import { AuthContext } from "../../../common/AuthProvider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const initParams = {
  per_page: 10,
  page: 1,
};
const SettlementList = React.memo((props) => {
  const location = useLocation();
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const { admin } = useContext(AuthContext);
  const [sort, setSort] = useState(null);
  const [tab, setTab] = useState(admin?.user_type === 1 ? 2 : 1);
  const _params = useMemo(() => ({ ...params, tab: tab }), [params, tab]);

  useEffect(() => {
    if (!params.sort) {
      setSort(null);
    }
  }, [params]);
  useEffect(() => {
    if (location.state?.status !== undefined) {
      setTab(location.state.status);
      location.state.status = undefined;
    }
  })

  useEffect(() => {
    setParams((pre) => ({ per_page: pre.per_page, page: 1 }));
  }, [tab]);

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
    "admin/settlement",
    JSON.stringify(_params),
  ]);

  const columns = useMemo(
    () =>
      admin?.user_type == 1
        ? [
          {
            field: "unit",
            label: t.settlement.unit,
            display: true,
            render: (row) =>
              row?.company ? row?.company?.name : row?.laborDepartment?.name,
          },
          {
            field: "settlement_period",
            label: t.settlement.settlement_period,
            display: "true",
            render: (row) => row.settlement_period,
          },
          {
            field: "settlement_year",
            label: t.settlement.settlement_year,
            display: "true",
          },
          {
            field: "registration_date",
            label: t.settlement.registration_date,
            display: true,
            render: (row) =>
              row?.registration_date
                ? moment(row?.registration_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "agreement_date",
            label: t.settlement.agreement_date,
            display: true,
            render: (row) =>
              row?.agreement_date
                ? moment(row?.agreement_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "approved_date",
            label: t.settlement.approved_date,
            display: true,
            render: (row) =>
              row?.approved_date
                ? moment(row?.approved_date).format("DD/MM/YYYY")
                : "",
          },
        ]
        : [
          {
            field: "type",
            label: t.settlement.type,
            display: true,
            render: (row) => {
              if (row?.type == 1) return "Quyết toán theo thu nhập";
              if (row?.type == 2) return "Quyết toán theo  người lao động";
            },
          },
          {
            field: "settlement_period",
            label: t.settlement.settlement_period,
            display: "true",
            render: (row) => row.settlement_period,
          },
          {
            field: "settlement_year",
            label: t.settlement.settlement_year,
            display: "true",
          },
          {
            field: "registration_date",
            label: t.settlement.registration_date,
            display: true,
            render: (row) =>
              row?.registration_date
                ? moment(row?.registration_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "agreement_date",
            label: t.settlement.agreement_date,
            display: true,
            render: (row) =>
              row?.agreement_date
                ? moment(row?.agreement_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "approved_date",
            label: t.settlement.approved_date,
            display: true,
            render: (row) =>
              row?.approved_date
                ? moment(row?.approved_date).format("DD/MM/YYYY")
                : "",
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
      const res = await api.fetcher("delete", "admin/settlement/" + row.id,{
        action: 'delete',
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
      const res = await api.fetcher("delete", "admin/settlement/" + row.id, {
        action: "restore",
      });
      if (res) {
        history.go(0);
      }
    } catch (e) { }
  };
  return (
    <Paper elevation={5}>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, value) => setTab(value)}
      >
        {admin?.user_type !== 1 && <Tab label={t.settlement.wait} value={1} />}
        {admin?.user_type == 1 && <Tab label={t.settlement.expertise} value={2} />}
        <Tab label={t.settlement.approval} value={3} />
        <Tab label={t.settlement.approved} value={4} />
        <Tab label={t.settlement.reject} value={5} />
      </Tabs>
      <SettlementToolbar
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
          history.push("/quanly/settlement/" + row.id);
        }}
        onDelete={
          admin.user_type == 1
            ? null
            : (row,action) => {
              deleteConfirm(row,action);
            }
        }
        onClickRow={(row) => history.push('/quanly/settlement/' + row.id)}
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
        page={data?.page}
        perPage={data?.per_page}
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
export default SettlementList;
