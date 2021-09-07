import Moment from 'moment';

export const convert = (e) => {
  if (e) {
    return e
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/\s/g, "-");
  }
  return "";
};