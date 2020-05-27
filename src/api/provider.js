import Task from "../models/task";
import {nanoid} from "nanoid";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.task);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSyncRequired = false;
  }

  getTasks() {
    if (isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          const items = createStoreStructure(tasks.map((task) => task.toRAW()));

          this._store.setItems(items);

          return tasks;
        });
    }

    const storeTasks = Object.values(this._store.getItems());

    return Promise.resolve(Task.parseTasks(storeTasks));
  }

  createTask(task) {
    if (isOnline()) {
      return this._api.createTask(task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    const localNewTaskId = nanoid();
    task.setId(localNewTaskId);
    const localNewTask = Task.clone(task);

    this._store.setItem(localNewTask.id, localNewTask.toRAW());
    this._isSyncRequired = true;

    return Promise.resolve(localNewTask);
  }

  deleteTask(id) {
    if (isOnline()) {
      return this._api.deleteTask(id)
        .then(() => this._store.removeItem(id));
    }

    this._store.removeItem(id);
    this._isSyncRequired = true;

    return Promise.resolve();
  }

  sync() {
    if (isOnline() && this._isSyncRequired) {
      const storeTasks = Object.values(this._store.getItems());
      this._isSyncRequired = false;

      return this._api.sync(storeTasks)
        .then((response) => {
          const createdTasks = getSyncedTasks(response.created);
          const updatedTasks = getSyncedTasks(response.updated);

          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.resolve();
  }

  updateTask(id, task) {
    if (isOnline()) {
      return this._api.updateTask(id, task)
        .then((newTask) => {
          this._store.setItem(newTask.id, newTask.toRAW());

          return newTask;
        });
    }

    task.setId(id);
    const localTask = Task.clone(task);
    this._store.setItem(id, localTask.toRAW());
    this._isSyncRequired = true;

    return Promise.resolve(localTask);
  }
}
