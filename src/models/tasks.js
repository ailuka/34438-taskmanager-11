export default class Tasks {
  constructor() {
    this._tasks = [];
    // Для реализации паттерна Observer. Здесь копятся handlerы, которые будут реагировать
    // на изменение данных. Модель будет вызывать эти коллбэки и говорить, что она обновилась.
    this._dataChangeHandlers = [];
  }

  // Метод для получения задач.
  getTasks() {
    return this._tasks;
  }

  // Метод для записи задач.
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  // Метод для обновления конкретной задачи. Принимает id обновляемой задачи
  // и обновленную задачу. Реализация метода переносится из BoardController.
  updateTask(id, task) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  // Метод для установки коллбэка, который будет добавлен в массив коллбэков.
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  // Метод для вызова коллбэков, если модель изменилась.
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

}
