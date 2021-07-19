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
    customers: {
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
  });

  orders = new ColumnChart(this.charts.orders)
  sales = new ColumnChart(this.charts.orders)
  customers = new ColumnChart(this.charts.customers);
  rangePicker = new RangePicker(this.range);

  handleDateSelect = (e) => {
    console.log(e.detail);
    this.range = e.detail;
    const {from, to} = this.range;
    this.orders.update(from, to);
    this.customers.update(from, to);
    this.sales.update(from, to);
  }

  async render() {
    this.element = document.createElement('div');
    this.element.className = `dashboard full-height flex-column`;
    this.element.innerHTML = `
      <div class="content__top-panel">
        <h2 class="page-title">Панель управления</h2>
        <div data-element="rangePicker"></div>
      </div>
      <div class="dashboard__charts"></div>
      <h3 class="block-title">Лидеры продаж</h3>
      <div data-element="sortableTable"></div>
    `;

    this.renderPicker();
    this.renderCharts();
    this.renderTable();

    this.initEventListeners();

    return this.element;
  }

  renderPicker() {
    this.element.querySelector('[data-element=rangePicker]').append(this.rangePicker.element);
  }

  renderCharts() {
    this.orders.element.classList.add('dashboard__chart_orders');
    this.sales.element.classList.add('dashboard__chart_sales');
    this.customers.element.classList.add('dashboard__chart_customers');
    this.element.querySelector('.dashboard__charts').append(this.orders.element);
    this.element.querySelector('.dashboard__charts').append(this.sales.element);
    this.element.querySelector('.dashboard__charts').append(this.customers.element);
  }

  renderTable() {
    this.element.querySelector('[data-element=sortableTable]').append(this.table.element);
  }

  initEventListeners() {
    window.addEventListener('date-select', this.handleDateSelect);
  }

  removeEventListeners() {
    window.removeEventListener('date-select', this.handleDateSelect);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
    this.element = null;
    this.table.destroy();
    this.rangePicker.destroy();
    this.sales.destroy();
    this.customers.destroy();
    this.orders.destroy();
  }
}
