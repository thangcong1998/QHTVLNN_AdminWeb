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
import { AuthContext } from "../../../common/AuthProvider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SchoolFeeSupportToolbar from "./SchoolFeeSupportToolbar";

const initParams = {
  per_page: 10,
  page: 1,
};
const SchoolFeeSupportRequestList = React.memo((props) => {
  const location = useLocation();
  const classes = useStyle();
  const [params, setParams] = useState(initParams);
  const api = useAPI();
  const { dialog, handleClose } = useDialog();
  const { admin, perm } = useContext(AuthContext);
  const [sort, setSort] = useState(null);
  const [tab, setTab] = useState(admin?.user_type == 1 ? 2 : 1);
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
  });

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
    "admin/schoolFeeSupport",
    JSON.stringify(_params),
  ]);
  const columns = useMemo(
    () =>
      admin?.user_type == 1
        ? [
          {
            field: "type",
            label: "Loại hỗ trợ",
            display: true,
            render: (row) => {
              if (row?.type == 1) return "Yêu cầu hỗ trợ tài liệu";
              if (row?.type == 2) return "Yêu cầu hỗ trợ học phí";
              if (row?.type == 3) return "Yêu cầu hỗ trợ rủi ro, tai nạn";
              if (row?.type == 4) return "Yêu cầu hỗ trợ khác";
            },
          },
          {
            field: "unit",
            label: "Đơn vị",
            display: true,
            render: (row) =>
              row?.company ? row?.company?.name : row?.laborDepartment?.name,
          },
          {
            field: "registration_date",
            label: "Ngày nộp",
            display: true,
            render: (row) =>
              row?.registration_date
                ? moment(row?.registration_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "agreed_date",
            label: "Ngày thẩm định",
            display: true,
            render: (row) =>
              row?.agreed_date
                ? moment(row?.agreed_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "approved_date",
            label: "Ngày phê duyệt",
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
            label: "Loại Hỗ trợ",
            display: true,
            render: (row) => {
              if (row?.type == 1) return "Yêu cầu hỗ trợ tài liệu";
              if (row?.type == 2) return "Yêu cầu hỗ trợ học phí";
              if (row?.type == 3) return "Yêu cầu hỗ trợ rủi ro, tai nạn";
              if (row?.type == 4) return "Yêu cầu hỗ trợ khác";
            },
          },
          {
            field: "registration_date",
            label: "Ngày nộp",
            display: true,
            render: (row) =>
              row?.registration_date
                ? moment(row?.registration_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "agreed_date",
            label: "Ngày thẩm định",
            display: true,
            render: (row) =>
              row?.agreed_date
                ? moment(row?.agreed_date).format("DD/MM/YYYY")
                : "",
          },
          {
            field: "approved_date",
            label: "Ngày phê duyệt",
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
  return (
    <Paper elevation={5}>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, value) => setTab(value)}
      >
        {admin?.user_type !== 1 && <Tab label= {t.Support_request_screen.wait} value={1} />}
        {admin?.user_type == 1 && <Tab label= {t.Support_request_screen.expertise} value={2} />}
        <Tab label= {t.Support_request_screen.approval} value={3} />
        <Tab label= {t.Support_request_screen.approved} value={4} />
        <Tab label= {t.Support_request_screen.reject} value={5} />
      </Tabs>
      <SchoolFeeSupportToolbar
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
        onClickRow={(row) => {
          history.push("/quanly/schoolFeeSupport/" + row.id);
        }}
        onDelete={(row) => {
          history.push("/quanly/schoolFeeSupport/" + row.id);
        }}
        onSort={(column) => handleSort(column)}
        onEdit={(row) => {
          history.push("/quanly/schoolFeeSupport/" + row.id);
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
export default SchoolFeeSupportRequestList;
