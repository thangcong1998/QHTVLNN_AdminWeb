import { Formik } from "formik";

export const FilterInput = [
  {
    label: "Tên Địa Điểm",
    field: "name",
    type: "text",
    grid: { xs: 12, sm: 12, md: 12 },
  },
  {
    label: "Cấp",
    field: "type",
    type: "radio",
    radioGroupProps: {
      row: true,
    },
    options: [
      { label: "Tỉnh Thành Phố", value: 1 },
      { label: "Quận Huyện", value: 2 },
      { label: "Xã Phường", value: 3 },
    ],
    display: true,
    endpoint: "admin/regions",
    grid: { xs: 12, sm: 12, md: 12 },
  },
];
