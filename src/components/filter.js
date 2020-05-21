import AbstractComponent from "../components/abstract-component.js";

const createFilterMarkup = (filter, isChecked) => {
  const {title, count} = filter;
  const isDisabled = count === 0 ? `disabled` : ``;

  return (
    `<input
      type="radio"
      id="filter__${title}"
      data-filter-type="${title}"
      class="filter__input visually-hidden"
      name="filter"
      ${isDisabled}
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span>
    </label>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => createFilterMarkup(filter, filter.checked)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = evt.target.dataset.filterType;
      handler(filterName);
    });
  }
}
