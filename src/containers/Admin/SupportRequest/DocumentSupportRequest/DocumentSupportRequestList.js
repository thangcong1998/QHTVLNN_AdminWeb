import React, { useMemo, useState, useEffect, useContext } from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { useAPI, useFetch } from "../../../../api/api";
import Pagination from "../../../../components/table/Pagination";
import useCheckedColumns from "../../../../common/CheckedColumns";
import DataTable from "../../../../components/table/DataTable";
import { useDialog } from "../../../../components/Dialog";
import { AuthContext } from "../../../../common/AuthProvider";
import DocumentSupportRequestToolbar from "../../../../containers/Admin/SupportRequest/DocumentSupportRequest/DocumentSupportRequestToolbar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import moment from "moment";
import { useHistory, useLocation } from "react-router-dom";
import t from "../../../../common/admin-text.json";

const DocumentSupportRequestList = React.memo((props) => {
  const classes = useStyles();
  const [params, setParams] = useState({ per_page: 10, page: 1 });
  const { dialog, handleClose } = useDialog();
  const { admin, perm } = useContext(AuthContext);
  const [tab, setTab] = useState(admin?.user_type == 1 ? 2 : 1);
  const _params = useMemo(() => ({ ...params, tab: tab }), [params, tab]);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.status !== undefined) {
      setTab(location.state.status);
      location.state.status = undefined;
    }
  })

  //   useEffect(() => {
  //     if (!params.sort) {
  //       setSort(null);
  //     }
  //   }, [params]);

  useEffect(() => {
    setParams((pre) => ({ per_page: pre.per_page, page: 1 }));
  }, [tab]);
  const { data: data, loading: loading, refetch: refetch } = useFetch([
    "get",
    "admin/documentSupport",
    JSON.stringify(_params),
  ]);
  const history = useHistory();
  const api = useAPI();
  const { checked, setCheked } = useState([]);
  const columns = useMemo(() => [
    // {
    //   field: "type",
    //   label: "Loại hỗ trợ",
    //   display: true,
    //   render: (row) => {
    //     if (row?.type == 1) return "Yêu cầu hỗ trợ tài liệu";
    //     if (row?.type == 2) return "Yêu cầu hỗ trợ học phí";
    //     if (row?.type == 3) return "Yêu cầu hỗ trợ rủi ro";
    //     if (row?.type == 4) return "Yêu cầu hỗ trợ khác";
    //   },
    // },
    {
      field: "company",
      label: "Đơn vị",
      display: true,
      // header: {
      //   align: "center",
      // },
      // props: {
      //   align: "center",
      // },
      render: (row) => row?.company?.name || row?.labor_department?.name,
    },
    {
      field: "beginning_period_remain_total",
      label: "Quý",
      display: true,
      render: (row) => row?.period,
    },
    {
      field: "beginning_period_received_total",
      label: "Năm",
      display: true,
      render: (row) => row?.year,
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
  ]);
  const columnCheck = useCheckedColumns(columns);

  const deleteConfirm = async (row) => {
    await dialog({
      title: "Xác nhận xóa hàng này ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/role/" + row.id);
      if (res) {
        refetch();
        handleClose();
      }
    } catch (e) {}
  };
  const restoreRole = async (row) => {
    await dialog({
      title: "Xác nhận khôi phục ?",
      type: "confirm",
      confirmationText: "Xác nhận",
      cancellationText: "Bỏ qua",
    });
    try {
      const res = await api.fetcher("delete", "admin/role/" + row.id, {
        action: "restore",
      });
      if (res) {
        history.go(0);
      }
    } catch (e) {}
  };
  return (
    <Paper elevation={5}>
      <Tabs
        value={tab}
        indicatorColor="primary"
        textColor="primary"
        onChange={(event, value) => setTab(value)}
      >
        {admin?.user_type !== 1 && <Tab label= {t.Support_request_screen.wait} value={1} />}
        {admin?.user_type == 1 && (
          <Tab label={t.Support_request_screen.expertise} value={2} />
        )}
        <Tab label={t.Support_request_screen.approval} value={3} />
        <Tab label={t.Support_request_screen.approved} value={4} />
        <Tab label={t.Support_request_screen.reject} value={5} />
      </Tabs>
      <DocumentSupportRequestToolbar
        setParams={setParams}
        columns={columnCheck}
        trashed={_params?.trashed}
      />
      <DataTable
        data={data?.data}
        loading={loading}
        columns={columnCheck.columnChecked}
        trashed={params?.trashed}
        onClickRow={(row) => {
          history.push("/quanly/documentSupport/" + row.id);
        }}
        onEdit={(row) => {
          history.push("documentSupport/" + row.id);
        }}
        onDelete={
          admin.user_type != 1
            ? null
            : (row) => {
                deleteConfirm(row);
              }
        }
        actionColumn={{
          props: {
            style: {
              textAlign: "right",
              width: 100,
            },
          },
        }}
        onRestore={(row) => restoreRole(row)}
        className={classes.tabContainer}
        // loading={tableLoading}
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
const useStyles = makeStyles(() => ({
  tabContainer: {
    "& .MuiTableCell-root": {
      padding: 10,
    },
  },
}));
export default DocumentSupportRequestList;
