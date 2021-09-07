export const FilterInput = [
  {
    label: "Tiêu đề",
    field: "title",
    type: "text",
    grid: { xs: 12, sm: 12, md: 12 },
  },
  {
    label: "Hiệu lực",
    field: "is_valid",
    type: "radio",
    radioGroupProps: {
      row: true,
    },
    options: [
      { label: "Tất cả", value: null },
      { label: "Còn", value: 1 },
      { label: "Hết", value: 2 },
    ],
    grid: { xs: 12, sm: 12, md: 12 },
  }
];
