import React, { useMemo, useEffect, useState, useContext } from "react";
import {useHistory, useLocation} from "react-router-dom";
import { Paper } from "@material-ui/core";
import DataTable from "../../../components/table/DataTable";
import { useAPI, useFetch } from "../../../api/api";
import { makeStyles } from "@material-ui/styles";
import Pagination from "../../../components/table/Pagination";
import useCheckedColumns from "../../../common/CheckedColumns";
import { useDialog } from "../../../components/Dialog";
import moment from "moment";
import t from "../../../common/admin-text.json";
import LaborSupportToolbar from "./LaborSupportToolbar";
import { AuthContext } from "../../../common/AuthProvider";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const initParams = {
    per_page: 10,
    page: 1,
};
const LaborSupportList = React.memo((props) => {
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
    const location = useLocation();

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
        "admin/laborSupport",
        JSON.stringify(_params),
    ]);

    const columns = useMemo(
        () =>
            admin?.user_type == 1
                ? [
                    {
                        field: "unit",
                        label: t.labor_support_screen.unit,
                        display: true,
                        render: (row) =>
                            row?.company ? row?.company?.name : row?.labor_department?.name,
                    },
                    {
                        field: "labor",
                        label: t.labor_support_screen.labor,
                        display: true,
                        render: (row) => row.labor_support.labor.name
                    },
                    {
                        field: "reason",
                        label: t.labor_support_screen.reason,
                        display: true,
                        render: (row) => row.labor_support.reason_type.name
                    },
                    {
                        field: "registration_date",
                        label: t.labor_support_screen.registration_date,
                        display: true,
                        render: (row) =>
                            row?.registration_date
                                ? moment(row?.registration_date).format("DD/MM/YYYY")
                                : "",
                    },
                    {
                        field: "agreed_date",
                        label: t.labor_support_screen.agreed_date,
                        display: true,
                        render: (row) =>
                            row?.agreed_date
                                ? moment(row?.agreed_date).format("DD/MM/YYYY")
                                : "",
                    },
                    {
                        field: "approved_date",
                        label: t.labor_support_screen.approved_date,
                        display: true,
                        render: (row) =>
                            row?.approved_date
                                ? moment(row?.approved_date).format("DD/MM/YYYY")
                                : "",
                    },
                ]
                : [
                    {
                        field: "labor",
                        label: t.labor_support_screen.labor,
                        display: true,
                        render: (row) => row.labor_support.labor.name
                    },
                    {
                        field: "reason",
                        label: t.labor_support_screen.reason,
                        display: true,
                        render: (row) => row.labor_support.reason_type.name
                    },
                    {
                        field: "registration_date",
                        label: t.labor_support_screen.registration_date,
                        display: true,
                        render: (row) =>
                            row?.registration_date
                                ? moment(row?.registration_date).format("DD/MM/YYYY")
                                : "",
                    },
                    {
                        field: "agreed_date",
                        label: t.labor_support_screen.agreed_date,
                        display: true,
                        render: (row) =>
                            row?.agreed_date
                                ? moment(row?.agreed_date).format("DD/MM/YYYY")
                                : "",
                    },
                    {
                        field: "approved_date",
                        label: t.labor_support_screen.approved_date,
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
            const res = await api.fetcher("delete", "admin/role/" + row.id, {
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
                {admin?.user_type !== 1 && <Tab label= {t.Support_request_screen.wait} value={1} />}
                {admin?.user_type == 1 && <Tab label= {t.Support_request_screen.expertise} value={2} />}
                <Tab label= {t.Support_request_screen.approval} value={3} />
                <Tab label= {t.Support_request_screen.approved} value={4} />
                <Tab label= {t.Support_request_screen.reject} value={5} />
            </Tabs>
            <LaborSupportToolbar
                setParams={setParams}
                checked={checked}
                // trashed={_params?.trashed}
                columns={columnCheck}
            />
            <DataTable
                data={data?.data}
                columns={columnCheck.columnChecked}
                loading={loading}
                sort={sort}
                onSort={(column) => handleSort(column)}
                onEdit={(row) => {
                    history.push("/quanly/laborSupport/" + row.id);
                }}
                onClickRow={(row) => history.push('/quanly/laborSupport/' + row?.id)}
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
export default LaborSupportList;
