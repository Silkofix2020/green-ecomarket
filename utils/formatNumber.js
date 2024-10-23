export const formatNumber = (value) => {
  return new Intl.NumberFormat("ru-RU").format(value);
};
