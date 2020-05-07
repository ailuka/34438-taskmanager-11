import FilterComponent from "../components/filter.js";
import {FilterType} from "../const.js";
import {render, RenderPosition} from "../utils/render.js";
import {getTasksByFilter} from "../utils/filter.js";

export default class FilterController {
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;
  }

  render() {
    const container = this._container;
    const allTasks = this._tasksModel.getUnfilteredTasks();
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        title: filterType,
        count: getTasksByFilter(allTasks, filterType).length,
        checked: filterType === this._activeFilterType
      };
    });

    this._filterComponent = new FilterComponent(filters);
    render(container, this._filterComponent, RenderPosition.BEFOREEND);
  }
}
