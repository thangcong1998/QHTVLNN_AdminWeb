import loading from "../assets/image/25.gif";

export const inputTypes = {
  TEXT: "text",
  PASSWORD: "password",
  NUMBER: "number",
  TEXTAREA: "textarea",
  SWITCH: "switch",
  SELECT: "select",
  RADIO: "radio",
  CHECKBOX: "checkbox",
  DATE: "date",
  QUERY_SELECT: "query-select",
};

export const color = {
  PRIMARY: "#1976d2",
  SECONDARY: "#dc004e",
  SUCCESS: "#4caf50",
  ERROR: "#f44336",
  WARNING: "#ff9800",
  INFO: "#2196f3",
};

export const loadingStyle = {
    backgroundImage: "url(" + loading + ")",
    backgroundRepeat: "no-repeat",
    backgroundColor: '#f3f3f3',
    backgroundPosition: "center",
    opacity: 0.5,
}
