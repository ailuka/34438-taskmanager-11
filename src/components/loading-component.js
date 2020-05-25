import AbstractComponent from "./abstract-component.js";

const createLoadingDisplayTemplate = () => {
  return (
    `<p class="board__no-tasks">
      Loading...
    </p>`
  );
};

export default class LoadingComponent extends AbstractComponent {
  getTemplate() {
    return createLoadingDisplayTemplate();
  }
}
