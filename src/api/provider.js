const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getTasks() {
    if (isOnline) {
      return this._api.getTasks();
    }

    // TODO: Offline logic.
    return Promise.reject(`No offline logic is implemented.`);
  }

  createTask(task) {
    if (isOnline) {
      return this._api.createTask(task);
    }

    // TODO: Offline logic.
    return Promise.reject(`No offline logic is implemented.`);
  }

  deleteTask(id) {
    if (isOnline) {
      return this._api.deleteTask(id);
    }

    // TODO: Offline logic.
    return Promise.reject(`No offline logic is implemented.`);
  }

  updateTask(id, task) {
    if (isOnline) {
      return this._api.updateTask(id, task);
    }

    // TODO: Offline logic.
    return Promise.reject(`No offline logic is implemented.`);
  }
}
