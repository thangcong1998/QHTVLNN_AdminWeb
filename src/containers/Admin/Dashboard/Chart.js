import React, {useEffect, useState} from "react";
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from "recharts";
import {
    Card
} from "@material-ui/core";
import {useAPI, useFetch} from "../../../api/api";

export default function Chart() {
    const [chartData, setChartData] = useState([]);
    const [totalMoneyCompany, setTotalMoneyCompany] = useState([]);
    const [totalMoneyLaborDepartment, setTotalMoneyLaborDepartment] = useState([]);
    const api = useAPI();
    const {data: data} = useFetch(['get', '/admin/chartData']);
    useEffect(() => {
        if(data) {
            let temp = [{total: 0, name: "Không có dữ liệu"}];
            if( data.totalLaborInCountry.length === 0 )
            {
                setChartData(temp);
            }
            else {
                setChartData(data.totalLaborInCountry);
            }
            if( data.totalMoneyCompany.length === 0 ) {
                setTotalMoneyCompany(temp);
            }
            else {
                setTotalMoneyCompany(data.totalMoneyCompany);
            }
            if( data.totalMoneyLaborDepartment.length === 0 ) {
                setTotalMoneyLaborDepartment(temp);
            }
            else {
                setTotalMoneyLaborDepartment(data.totalMoneyLaborDepartment);
            }
        }
    }, [data])
    return (
        <Card style={{ padding: 20}}>
            <div>
                <b style={{ fontSize: 20}}> Thị trường sắp xếp theo số lượng người lao động</b>
                <br />
                <br />
                <ResponsiveContainer width={'100%'} height={400}>
                    <BarChart data={chartData} onClick={(row) => console.log(row)}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="người" barSize={30} fill="#8884d8" />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20}}>
                <div style={{ width: '50%',padding: 20}}>
                    <b style={{ fontSize: 20}}>Doanh thu từ kinh doanh quý trước (đơn vị: VNĐ)</b>
                    <br />
                    <br />
                    <ResponsiveContainer width={'100%'} height={400}>
                        <BarChart data={totalMoneyCompany} onClick={(row) => console.log(row)}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" barSize={30} fill="#8884d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div style={{ width: '50%',padding: 20}}>
                    <b style={{ fontSize: 20}}>Doanh thu từ người lao động quý trước (đơn vị: VNĐ)</b>
                    <br />
                    <br />
                    <ResponsiveContainer width={'100%'} height={400}>
                        <BarChart data={totalMoneyLaborDepartment} onClick={(row) => console.log(row)}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="total" barSize={30} fill="#8884d8" />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </Card>
    )
}
