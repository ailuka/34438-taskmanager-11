import {FilterType} from "../const.js";
import {isSameDay, isOverdueDate, isRepeating} from "./common.js";

export const getArchiveTasks = (tasks) => {
  return tasks.filter((task) => task.isArchive);
};

export const getNotArchiveTasks = (tasks) => {
  return tasks.filter((task) => !task.isArchive);
};

export const getFavoriteTasks = (tasks) => {
  return tasks.filter((task) => task.isFavorite);
};

export const getOverdueTasks = (tasks, date) => {
  return tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    return isOverdueDate(task.dueDate, date);
  });
};

export const getRepeatingTasks = (tasks) => {
  return tasks.filter((task) => isRepeating(task.repeatingDays));
};

export const getThisDayTasks = (tasks, date) => {
  return tasks.filter((task) => isSameDay(task.dueDate, date));
};

export const getTasksByFilter = (tasks, filterType) => {
  const today = new Date();

  switch (filterType) {
    case FilterType.All:
      return getNotArchiveTasks(tasks);
    case FilterType.ARCHIVE:
      return getArchiveTasks(tasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(tasks);
    case FilterType.OVERDUE:
      return getOverdueTasks(tasks);
    case FilterType.REPEATING:
      return getRepeatingTasks(tasks);
    case FilterType.TODAY:
      return getThisDayTasks(getNotArchiveTasks(tasks), today);
  }

  return tasks;
};
