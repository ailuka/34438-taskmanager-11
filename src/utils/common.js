import moment from "moment";

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM`);
};

export const isSameDay = (dateOne, dateTwo) => {
  const momentOne = moment(dateOne);
  const momentTwo = moment(dateTwo);
  return momentOne.diff(momentTwo, `days`) === 0 && dateOne.getDate() === dateTwo.getDate();
};

export const isOverdueDate = (dueDate, date) => {
  return dueDate < date && !isSameDay(date, dueDate);
};

export const isRepeating = (repeatingDays) => {
  return Object.values(repeatingDays).some(Boolean);
};
