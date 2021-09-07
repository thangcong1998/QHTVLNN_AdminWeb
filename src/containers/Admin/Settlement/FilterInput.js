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
    label: "Tên đơn vị",
    field: "unit",
    type: "text",
    grid: { xs: 12, sm: 12, md: 12 },
  },
  {
    label: "Quý",
    field: "settlement_period",
    type: "select",
    options: [
      {
        label: "Chọn quý",
        value: "",
      },
      {
        label: "Quý 1",
        value: 1,
      },
      {
        label: "Quý 2",
        value: 2,
      },
      {
        label: "Quý 3",
        value: 3,
      },
      {
        label: "Quý 4",
        value: 4,
      },
    ],
    grid: { xs: 12, sm: 12, md: 12 },
  },
  {
    label: "Năm",
    field: "settlement_year",
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
  {
    label: "Ngày phê duyệt",
    field: "approved_date",
    type: "date-range",
    grid: { xs: 12, sm: 12, md: 12 },
  },

];
