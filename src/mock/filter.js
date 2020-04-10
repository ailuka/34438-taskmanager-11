const FILTER_ALL = `all`;
const FILTER_OVERDUE = `overdue`;
const FILTER_TODAY = `today`;
const FILTER_FAVORITES = `favorites`;
const FILTER_REPEATING = `repeating`;
const FILTER_ARCHIVE = `archive`;

const filterNames = [
  FILTER_ALL,
  FILTER_OVERDUE,
  FILTER_TODAY,
  FILTER_FAVORITES,
  FILTER_REPEATING,
  FILTER_ARCHIVE
];

const generateFilters = (tasks) => {
  const filters = {};

  filterNames.forEach((filterName) => {
    filters[filterName] = 0;
  });

  const today = new Date();

  for (const {dueDate, repeatingDays, isArchived, isFavorite} of tasks) {
    const isOverdue = dueDate instanceof Date && dueDate < Date.now();
    const isRepeated = Object.values(repeatingDays).some(Boolean);
    const isToday = dueDate instanceof Date && dueDate.getDate() === today.getDate();

    filters[FILTER_ALL]++;

    if (isOverdue) {
      filters[FILTER_OVERDUE]++;
    }

    if (isToday) {
      filters[FILTER_TODAY]++;
    }

    if (isFavorite) {
      filters[FILTER_FAVORITES]++;
    }

    if (isRepeated) {
      filters[FILTER_REPEATING]++;
    }

    if (isArchived) {
      filters[FILTER_ARCHIVE]++;
    }
  }

  return Object.entries(filters).map(([filterName, filterCount]) => {
    return {
      title: filterName,
      count: filterCount,
    };
  });
};

export {generateFilters};
