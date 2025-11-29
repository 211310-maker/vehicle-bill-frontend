export const randomNumber = (length) => {
  return `${Math.floor(
    Math.pow(10, length - 1) +
      Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
  )}`;
};

export const formatDateOrder = (date) => {
  return `${new Date(date).getDate()}-${
    new Date(date).getMonth() + 1
  }-${new Date(date).getFullYear()}`;
};

export const formatDate = (date, showTime) => {
  let a = new Date(date)
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
    .split(' ')
    .join('-')
    .toUpperCase();
  let b = new Date(date)
    .toLocaleString('en-GB', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    })
    .toUpperCase();
  if (showTime) {
    return `${a} ${b}`;
  } else {
    return `${a}`;
  }
};
