import API from "./api.js";
import BoardComponent from "./components/board.js";
import BoardController from "./controllers/board.js";
import FilterController from "./controllers/filter.js";
import SiteMenuComponent, {MenuItem} from "./components/menu.js";
import StatisticsComponent from "./components/statistics.js";
import TasksModel from "./models/tasks.js";
import {render, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic cM7D101fhDLJHjlulckBw10YXNzd29y0987hkQFo=`;
const END_POINT = `https://11.ecmascript.pages.academy/task-manager/`;

const dateTo = new Date();
const dateFrom = (() => {
  const d = new Date(dateTo);
  d.setDate(d.getDate() - 7);
  return d;
})();

const api = new API(END_POINT, AUTHORIZATION);
const tasksModel = new TasksModel();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);
const siteMenuComponent = new SiteMenuComponent();
const statisticsComponent = new StatisticsComponent(tasksModel, dateFrom, dateTo);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent, tasksModel, api);
const filterController = new FilterController(siteMainElement, tasksModel);

render(siteHeaderElement, siteMenuComponent, RenderPosition.BEFOREEND);
filterController.render();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render();
render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.NEW_TASK:
      siteMenuComponent.setActiveItem(MenuItem.TASKS);
      statisticsComponent.hide();
      filterController.reset();
      boardController.show();
      boardController.createTask();
      break;
    case MenuItem.STATISTICS:
      boardController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TASKS:
      statisticsComponent.hide();
      boardController.resetSorting();
      boardController.show();
      break;
  }
});

api.getTasks()
  .then((tasks) => {
    tasksModel.setTasks(tasks);
    filterController.setNoLoading();
    boardController.setNoLoading();
  })
  .catch(() => {
    boardController.setNoLoading();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`sw.js`)
    .then(() => {})
    .catch(() => {});
});
