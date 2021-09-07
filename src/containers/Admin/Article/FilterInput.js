import { FlashOnRounded } from "@material-ui/icons";

export const FilterInput = [
  {
    label: "Tiêu đề",
    field: "title",
    type: "text",
    grid: { xs: 12, sm: 12, md: 12 },
  },
  {
    label: "Danh mục 12121",
    field: "category",
    type: "checkbox-query",
    formGroupProps: {
      row: true,
    },
    endpoint: "admin/category",
    grid: { xs: 12, sm: 12, md: 12 },
  },
  {
    label: "Hiển thị",
    display:false,
    field: "is_public",
    type: "radio",
    radioGroupProps: {
      row: true,
    },
    options: [
      {
        label: "Tất cả",
        value: 3,
      },
      {
        value: 1,
        label: "On",
      },
      {
        value: 2,
        label: "Off",
      },
    ],
    grid: { xs: 12, sm: 12, md: 12 },
  },
];
