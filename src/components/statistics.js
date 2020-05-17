import AbstractSmartComponent from "./abstract-smart-component.js";
import {isSameDay} from "../utils/common.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";
import flatpickr from "flatpickr";

const getTasksByDateRange = (tasks, dateFrom, dateTo) => {
  return tasks.filter((task) => {
    const dueDate = task.dueDate;

    return dueDate >= dateFrom && dueDate <= dateTo;
  });
};

const createPlaceholder = (dateFrom, dateTo) => {
  const format = (date) => {
    return moment(date).format(`DD MMM`);
  };

  return `${format(dateFrom)} - ${format(dateTo)}`;
};

const calculateBetweenDates = (from, to) => {
  const result = [];
  let date = new Date(from);

  while (date <= to) {
    result.push(date);

    date = new Date(date);
    date.setDate(date.getDate() + 1);
  }

  return result;
};

const renderDaysChart = (daysCanvas, tasks, dateFrom, dateTo) => {
  const days = calculateBetweenDates(dateFrom, dateTo);

  const tasksCountOnDay = days.map((date) => {
    return tasks.filter((task) => {
      return isSameDay(task.dueDate, date);
    }).length;
  });

  const formattedDates = days.map((it) => moment(it).format(`DD MMM`));

  return new Chart(daysCanvas, {
    plugins: [ChartDataLabels],
    // The type of chart we want to create
    type: `line`,
    // The data for our dataset
    data: {
      labels: formattedDates,
      datasets: [{
        label: `Количество выполненных задач за день периода`,
        data: tasksCountOnDay,
        backgroundColor: `transparent`,
        borderColor: `#000000`,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 8,
        pointHoverRadius: 8,
        pointBackgroundColor: `#000000`
      }]
    },
    // Configuration options go here
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 8
          },
          color: `#ffffff`
        },
        legend: {
          display: false,
        },
        title: {
          display: false,
        },
        tooltips: {
          enabled: false,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              display: false
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              fontStyle: `bold`,
              fontColor: `#000000`
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        layout: {
          padding: {
            top: 20
          }
        },
      }
    }
  });
};

const createStatisticsTemplate = (tasks, dateFrom, dateTo) => {
  const placeholder = createPlaceholder(dateFrom, dateTo);
  const tasksCount = getTasksByDateRange(tasks, dateFrom, dateTo).length;
  return (
    `<section class="statistic container">
      <div class="statistic__line">
        <div class="statistic__period">
          <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

          <div class="statistic-input-wrap">
            <input
              class="statistic__period-input"
              type="text"
              placeholder="${placeholder}"
            />
          </div>

          <p class="statistic__period-result">
            In total for the specified period
            <span class="statistic__task-found">${tasksCount}</span> tasks were fulfilled.
          </p>
        </div>
        <div class="statistic__line-graphic">
          <canvas class="statistic__days" width="550" height="150"></canvas>
        </div>
      </div>

      <div class="statistic__circle">
        <div class="statistic__colors-wrap">
          <canvas class="statistic__colors" width="400" height="300"></canvas>
        </div>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(tasksModel, dateFrom, dateTo) {
    super();
    this._tasks = tasksModel.getTasks();
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    this._daysChart = null;

    this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._tasks, this._dateFrom, this._dateTo);
  }

  show() {
    super.show();

    this.rerender(this._tasks, this._dateFrom, this._dateTo);
  }

  recoveryListeners() {}

  rerender(tasks, dateFrom, dateTo) {
    this._tasks = tasks;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    this._applyFlatpickr(this.getElement().querySelector(`.statistic__period-input`));

    const daysCanvas = element.querySelector(`.statistic__days`);

    this._resetCharts();

    this._daysChart = renderDaysChart(daysCanvas, this._tasks, this._dateFrom, this._dateTo);
  }

  _resetCharts() {
    if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }
  }

  _applyFlatpickr(element) {
    if (this._flatpickr) {
      this._flatpickr.destroy();
    }

    this._flatpickr = flatpickr(element, {
      altInput: true,
      allowInput: true,
      defaultDate: [this._dateFrom, this._dateTo],
      mode: `range`,
      onChange: (dates) => {
        if (dates.length === 2) {
          this.rerender(this._tasks, dates[0], dates[1]);
        }
      }
    });
  }
}
