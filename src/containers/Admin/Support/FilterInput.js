import moment from "moment";

const years = () => {
    const year = moment(new Date()).year();
    const arr = [{ label: "Chọn năm", value: "" }];
    for (let i = year; i >= 2015; i--) {
        arr.push({ label: i, value: i });
    }
    return arr;
};

export const FilterInput = [
    {
        label: "Năm",
        field: "year",
        type: "select",
        options: years(),
        grid: { xs: 12, sm: 12, md: 12 },
    },
    {
        label: "Ngày nộp",
        field: "registration_date",
        type: "date-range",
        grid: { xs: 12, sm: 12, md: 12 },
    },
];
