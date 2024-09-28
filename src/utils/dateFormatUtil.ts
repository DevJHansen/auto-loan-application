export const showDateAndTime = (date: number) => {
  const time =
    new Date(date).toLocaleTimeString().split(':')[0] +
    ':' +
    new Date(date).toLocaleTimeString().split(':')[1];
  const getDate = new Date(date).toLocaleDateString();
  return time + ' - ' + getDate;
};
