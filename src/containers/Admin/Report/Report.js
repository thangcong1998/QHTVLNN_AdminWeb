import React, {useContext, useEffect, useMemo, useState} from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Pie,
    PieChart
} from "recharts";
import {
    Card,
    Grid,
    Select,
    MenuItem, InputLabel, FormHelperText, FormControl, Tab, Tabs, ButtonGroup, Button, Divider
} from "@material-ui/core";
import {useFetch} from "../../../api/api";
import Moment from "moment";
import {AuthContext} from "../../../common/AuthProvider";
import ClearIcon from '@material-ui/icons/Clear';
import {makeStyles} from "@material-ui/styles";
import DataTable from "../../../components/table/DataTable";
import NumberFormat from "react-number-format";
import { ReactComponent as Support } from "../../../assets/front/image/sidebar/face-agent.svg";
import companyActive from "../../../assets/image/companyActive.png";
import companyNotSettlement from "../../../assets/image/center.png";
import support from "../../../assets/image/support.png";

export default function Report() {
    const classes = useStyle();
    const [params, setParams] = useState({period: 0, year: 0});
    const date = new Date();
    const {admin} = useContext(AuthContext);
    const _params = useMemo(() => params, [params]);
    const {data: data} = useFetch(['get', '/admin/reportData', JSON.stringify(_params)]);
    const test = true;
    const [tab, setTab] = useState(1);
    const [country, setCountry] = useState([]);
    const [company, setCompany] = useState([]);
    const [period, setPeriod] = useState(new Date());
    const [year, setYear] = useState(new Date());
    const [buttonShow,setButtonShow] = useState({period: 1, year: 0});
    useEffect(() => {
        let month = date.getMonth();
        let year = date.getFullYear();
        let temp = {...params};
        if(month > 0 && month < 4)
        {
            setPeriod(4);
            temp.period = 4;
            temp.year = year - 1;
            setYear(year - 1);
        }
        if(month > 3 && month < 7)
        {
            setPeriod(1);
            temp.period = 1;
            temp.year = year;
            setYear(year);
        }
        if(month > 6 && month < 10)
        {
            setPeriod(2);
            temp.period = 2;
            temp.year = year;
            setYear(year);
        }
        if(month > 9 && month < 13)
        {
            setPeriod(3);
            temp.period = 3;
            temp.year = year;
            setYear(year);
        }
        setParams(temp);
    }, [test])
    useEffect(() => {
        if(data) {
            let temp = [{name: 'Không có dữ liệu', total: 0}];
            if( data.company.length === 0) {
                setCompany(temp);
            }
            else {
                setCompany(data.company.map(value => ({...value, total: parseInt(value.total)})));
            }
            if( data.country.length === 0) {
                setCountry(temp);
            }
            else {
                setCountry(data.country);
            }
        }
    }, [data])
    useEffect(() => {
        let month = date.getMonth();
        let year = date.getFullYear();
        if(tab === 2) {
            let tempYear = {year: year};
            setParams(tempYear);
        }
        if(tab === 1) {
            let temp = {...params};
            if(month > 0 && month < 4)
            {
                setPeriod(4);
                temp.period = 4;
                temp.year = year - 1;
                setYear(year - 1);
            }
            if(month > 3 && month < 7)
            {
                setPeriod(1);
                temp.period = 1;
                temp.year = year;
                setYear(year);
            }
            if(month > 6 && month < 10)
            {
                setPeriod(2);
                temp.period = 2;
                temp.year = year;
                setYear(year);
            }
            if(month > 9 && month < 13)
            {
                setPeriod(3);
                temp.period = 3;
                temp.year = year;
                setYear(year);
            }
            setParams(temp);
        }
    }, [tab])
    const changePeriod = (e) => {
        setPeriod(e.target.value);
        let temp = {...params};
        temp.period = e.target.value;
        setParams(temp);
    }
    const changeYear = (e) => {
        setYear(e.target.value);
        let temp = {...params};
        temp.year = e.target.value;
        setParams(temp);

    }
    const ListYear = useMemo(() => {
        const maxYear = Moment(new Date()).year();
        const minYear = 2010;
        const years = [];
        for (let i = maxYear; i >= minYear; i--) {
            years.push(i);
        }
        return years;
    }, [year])
    const changeTab = (value) => {
        let temp = {...buttonShow};
        if(value === 1) {
            temp.period = 1;
            temp.year = 0;
        } else {
            temp.period = 0;
            temp.year = 1;
        }
        setButtonShow(temp);
        setTab(value);
    }
    const columns = useMemo(
        () => [
            {
                field: "name",
                label: "Tên doanh nghiệp",
                header: {
                    style: {
                        fontSize: "1rem",
                        fontWeight: "bold",
                        minWidth: 160,
                        border: '1px solid #f3f3f3'
                    },
                    align: "center",
                },
                props: {
                    style: {
                        fontSize: "1rem",
                        padding: 8,
                        border: '1px solid #f3f3f3'
                    },
                    align: "center",
                },
                display: true,
                render: (row) => row.name,
            },
            {
                field: "total",
                label: "Số người xuất cảnh",
                header: {
                    style: {
                        fontSize: "1rem",
                        fontWeight: "bold",
                        minWidth: 160,
                        border: '1px solid #f3f3f3'
                    },
                    align: "center",
                },
                props: {
                    style: {
                        fontSize: "1rem",
                        padding: 8,
                        border: '1px solid #f3f3f3'
                    },
                    align: "center",
                },
                display: true,
                render: (row) => row.total
            }
        ],
        []
    );
    const dataTest = [{name: test, total: 1}];
    console.log(country)
    return admin?.user_type === 1 && (
        <div>
            <Card style={{ padding: 20}}>
                <div style={{ display: "flex", flexWrap: "wrap", padding: 20}}>
                        <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
                            <Button className={buttonShow.period === 1 ? classes.buttonActive : classes.buttonUnActive} onClick={() => changeTab(1)}>Báo cáo thống kê theo quý</Button>
                            <Button className={buttonShow.year === 1 ? classes.buttonActive : classes.buttonUnActive} onClick={() => changeTab(2)}>Báo cáo thống kê theo năm</Button>
                        </ButtonGroup>
                </div>
                {tab === 1 && (
                    <FormControl style={{ width: '50%', paddingLeft: 20 }}>
                        <InputLabel id="select-period" style={{ paddingLeft: 20}}>Chọn quý</InputLabel>
                        <Select value={period} label={"Quý"} onChange={changePeriod}>
                            <MenuItem value={1}>Quý 1</MenuItem>
                            <MenuItem value={2}>Quý 2</MenuItem>
                            <MenuItem value={3}>Quý 3</MenuItem>
                            <MenuItem value={4}>Quý 4</MenuItem>
                        </Select>
                    </FormControl>
                )}
                <FormControl style={{ width: '50%', paddingLeft: 20 }}>
                    <InputLabel id="demo-controlled-open-select-label" style={{ paddingLeft: 20}}>Chọn năm</InputLabel>
                    <Select
                        labelId="demo-controlled-open-select-label"
                        id="demo-controlled-open-select"
                        onChange={(e) => changeYear(e)}
                        value={year}
                    >
                        <MenuItem value={''}>Chọn năm</MenuItem>
                        {
                            ListYear.map((e) => (
                                <MenuItem key={e} value={e}>{e}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </Card>
            <br />
            <Card>
                <h2 style={{ padding: 20}}>Top 10 thị trường lao động trong {tab === 1 ? ' quý '+period+' năm '+year : ' năm '+year} (đơn vị: người)</h2>
                <Grid spacing={2} container>
                    <Grid item={true} md={5} xs={12}>
                        <PieChart width={400} height={400}>
                            {country[0]?.name !== 'Không có dữ liệu' ?
                                <Pie dataKey="người" isAnimationActive={false} data={country} cx={200} cy={200} outerRadius={80} fill="#8884d8" label /> :
                                <Pie dataKey="total" isAnimationActive={false} data={dataTest} cx={200} cy={200} outerRadius={80} fill="#8884d8" />
                            }
                            {country[0]?.name !== 'Không có dữ liệu' ? <Tooltip /> : null }
                        </PieChart>
                        {country[0]?.name !== 'Không có dữ liệu' ? null : <p style={{ textAlign: "center", paddingBottom: 20}}>Không có dữ liệu</p> }
                    </Grid>
                    <Grid item={true} md={7} xs={12}>
                        <ResponsiveContainer width={'100%'} height={400}>
                            <BarChart data={country} onClick={(row) => console.log(row)}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="người" barSize={30} fill="#8884d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            </Card>
            <br />
            <Card>
                <h2 style={{ padding: 20}}>Top 10 doanh nghiệp {tab === 1 ? ' quý '+period+' năm '+year : ' năm '+year} (đơn vị: VNĐ)</h2>
                <Grid spacing={2} container>
                    <Grid item={true} md={5} xs={12}>
                        <PieChart width={400} height={400}>
                            {company[0]?.name !== 'Không có dữ liệu' ?
                                <Pie dataKey="total" isAnimationActive={false} data={company} cx={200} cy={200} outerRadius={80} fill="#8884d8" label /> :
                                <Pie dataKey="total" isAnimationActive={false} data={dataTest} cx={200} cy={200} outerRadius={80} fill="#8884d8" />
                            }
                            {company[0]?.name !== 'Không có dữ liệu' ? <Tooltip /> : null }
                        </PieChart>
                        {company[0]?.name !== 'Không có dữ liệu' ? null : <p style={{ textAlign: "center", paddingBottom: 20}}>Không có dữ liệu</p> }
                    </Grid>
                    <Grid item={true} md={7} xs={12}>
                        <ResponsiveContainer width={'100%'} height={400}>
                            <BarChart data={company} onClick={(row) => console.log(row)}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" barSize={30} fill="#8884d8" />
                                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Grid>
                </Grid>
            </Card>
            <br />
            <Card style={{ minHeight: 600}}>
                <Grid spacing={2} container>
                    <Grid item={true} md={8} xs={12}>
                        <h2 style={{ padding: 20}}>Top 10 doanh nghiệp có số lượng người xuất cảnh lớn nhất quý trước</h2>
                        <Card style={{ margin: 20, padding: 20}}>
                            <DataTable
                                data={data?.topCompany}
                                columns={columns}
                                className={classes.TableContainer}
                                actionColumn={{hide: true}}
                            />
                        </Card>
                    </Grid>
                    <Grid item={true} md={4} xs={12} style={{ paddingRight: 50}}>
                        <div className={classes.smallCard}>
                            <Grid container spacing={2}>
                                <Grid item md={3} style={{ fontSize: 20, textAlign: "center"}}>
                                    <p style={{ display: "inline-block", paddingTop: 10}}>
                                        <img src={companyActive} width={50} height={50} />
                                    </p>
                                </Grid>
                                <Grid item md={1}>
                                    <Divider orientation="vertical" style={{ backgroundColor: "white", height: 120}} />
                                </Grid>
                                <Grid item md={8} style={{ fontSize: 20, textAlign: "center"}}>
                                    <p style={{ display: "inline-block"}}>
                                        <NumberFormat value={data?.activeCompany[0]?.total || 0} displayType={'text'} thousandSeparator={true} />
                                        <br />
                                        Doanh nghiệp đang hoạt động
                                    </p>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.smallCard}>
                            <Grid container spacing={2}>
                                <Grid item md={3} style={{ fontSize: 20, textAlign: "center"}}>
                                    <p style={{ display: "inline-block", paddingTop: 10}}>
                                        <img src={companyNotSettlement} width={50} height={50} />
                                    </p>
                                </Grid>
                                <Grid item md={1}>
                                    <Divider orientation="vertical" style={{ backgroundColor: "white", height: 120}} />
                                </Grid>
                                <Grid item md={8} style={{ fontSize: 20, textAlign: "center"}}>
                                    <p style={{ display: "inline-block"}}>
                                        <NumberFormat value={(data?.totalActiveCompany[0]?.total - data?.companyDoneSettlement[0]?.total) || 0} displayType={'text'} thousandSeparator={true} />
                                        <br />
                                        Doanh nghiệp chưa nộp báo cáo
                                    </p>
                                </Grid>
                            </Grid>
                        </div>
                        <div className={classes.smallCard}>
                            <Grid container spacing={2}>
                                <Grid item md={3} style={{ fontSize: 20, textAlign: "center"}}>
                                    <p style={{ display: "inline-block", paddingTop: 10}}>
                                        <img src={support} width={50} height={50} />
                                    </p>
                                </Grid>
                                <Grid item md={1}>
                                    <Divider orientation="vertical" style={{ backgroundColor: "white", height: 120}} />
                                </Grid>
                                <Grid item md={8} style={{ fontSize: 20, textAlign: "center"}}>
                                    <p style={{ display: "inline-block"}}>
                                        <NumberFormat value={data?.supportDone[0]?.total || 0} displayType={'text'} thousandSeparator={true} />
                                        <br />
                                        Yêu cầu hỗ trợ đã xử lý trong quý trước
                                    </p>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Card>
        </div>
    )
}
const useStyle = makeStyles((theme) => ({
    buttonActive: {
        backgroundColor: '#30CDFF',
        color: '#000',
    },
    buttonUnActive: {
        backgroundColor: '#f3f3f3',
        color: 'black'
    },
    smallCard: {
        margin: 20,
        width: '100%',
        height: 150,
        backgroundColor: '#12B3E6',
        borderRadius: 10,
        color: '#fff'
    },
    TableContainer: {
        "& .MuiTableCell-root": {
            padding: 10,
        },
    },
}));
