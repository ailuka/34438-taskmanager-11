import LoadMoreButtonComponent from "../components/load-more-button.js";
import NoTasksComponent from "../components/no-tasks.js";
import SortComponent from "../components/sort.js";
import TaskComponent from "../components/task.js";
import TaskEditComponent from "../components/task-edit.js";
import TasksComponent from "../components/tasks.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setFormSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchived);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
  } else {
    render(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREEND);
    render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

    const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    tasks.slice(0, showingTasksCount)
      .forEach((task) => {
        renderTask(taskListElement, task);
      });

    const loadMoreButtonComponent = new LoadMoreButtonComponent();
    render(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

    loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      tasks.slice(prevTasksCount, showingTasksCount)
        .forEach((task) => renderTask(taskListElement, task));

      if (showingTasksCount >= tasks.length) {
        remove(loadMoreButtonComponent);
      }
    });
  }
};

export default class BoardController {
  constructor(container) {
    this._container = container;
  }

  render(tasks) {
    renderBoard(this._container, tasks);
  }
}
