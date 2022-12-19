export const nFormat = (x) => {
  let decimal = (Math.round(x * 100) / 100).toFixed(2);
  return decimal.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
