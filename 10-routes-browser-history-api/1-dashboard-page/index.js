import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {
  element;
  range = {
    from: new Date(2021, 5, 19),
    to: new Date(2021, 6, 19)
  }

  charts = {
    orders: {
      label: 'Заказы',
      url: '/api/dashboard/orders',
      range: this.range
    },
    sales: {
      label: 'Продажи',
      formatHeading: data => `$${data}`,
      url: '/api/dashboard/sales',
      range: this.range
    },
    clients: {
      label: 'Клиенты',
      url: '/api/dashboard/customers',
      range: this.range
    }
  }

  table = new SortableTable(header, {
    url: 'api/dashboard/bestsellers',
    isSortLocally: true,
    start: 0,
    step: 30,
    end: 30
  })

  orders = new ColumnChart(this.charts.orders)
  sales = new ColumnChart(this.charts.orders)
  clients = new ColumnChart(this.charts.clients)

  constructor() {
    this.rangePicker = new RangePicker(this.range);
  }

  async render() {
    this.element = document.createElement('div');
    this.element.className = `dashboard full-height flex-column`;
    this.element.innerHTML = `
      <div class="content__top-panel">
        <h2 class="page-title">Панель управления</h2>
        <div data-element="rangePickerContainer"></div>
      </div>
      <div class="dashboard__charts"></div>
      <h3 class="block-title">Лидеры продаж</h3>
      <div data-element="dashboardTableContainer"></div>
    `;

    this.renderPicker();
    this.renderCharts();
    this.renderTable();

    return this.element;
  }

  renderPicker() {
    this.element.querySelector('[data-element=rangePickerContainer]').append(this.rangePicker.element);
  }

  renderCharts() {
    this.orders.element.classList.add('dashboard__chart_orders');
    this.sales.element.classList.add('dashboard__chart_sales');
    this.clients.element.classList.add('dashboard__chart_customers');
    this.element.querySelector('.dashboard__charts').append(this.orders.element);
    this.element.querySelector('.dashboard__charts').append(this.sales.element);
    this.element.querySelector('.dashboard__charts').append(this.clients.element);
  }

  renderTable() {
    this.element.querySelector('[data-element=dashboardTableContainer]').append(this.table.element);
  }
}
