import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

export default class Page {
  element;
  subElements = {};

  constructor() {

    this.range = this.currentRange;

    this.rangePicker = new RangePicker(this.range);

    this.orders = new ColumnChart({
      label: 'Заказы',
      url: '/api/dashboard/orders',
      range: this.range
    });

    this.sales = new ColumnChart({
      label: 'Продажи',
      formatHeading: data => `$${data}`,
      url: '/api/dashboard/sales',
      range: this.range
    });

    this.customers = new ColumnChart({
      label: 'Клиенты',
      url: '/api/dashboard/customers',
      range: this.range
    });

    this.table = new SortableTable(header, {
      url: `api/dashboard/bestsellers?from=${this.range.from.toISOString()}&to=${this.range.to.toISOString()}`,
      isSortLocally: true,
      start: 0,
      end: 30
    });

  }

  handleDateSelect = (e) => {
    this.range = e.detail;
    const {from, to} = this.range;
    this.updateCharts(from, to);
    this.updateTable(from, to);
  }

  async render() {
    this.element = document.createElement('div');
    this.element.className = `dashboard full-height flex-column`;
    this.element.innerHTML = `
      <div class="content__top-panel">
        <h2 class="page-title">Панель управления</h2>
        <div data-element="rangePicker"></div>
      </div>
      <div class="dashboard__charts">
          <div class="dashboard__chart_orders" data-element="ordersChart"></div>
          <div class="dashboard__chart_sales" data-element="salesChart"></div>
          <div class="dashboard__chart_customers" data-element="customersChart"></div>
      </div>
      <h3 class="block-title">Лидеры продаж</h3>
      <div data-element="sortableTable"></div>
    `;

    this.setSubElements();

    this.renderPicker();
    this.renderCharts();
    this.renderTable();

    this.initEventListeners();

    return this.element;
  }

  renderPicker() {
    this.subElements.rangePicker.append(this.rangePicker.element);
  }

  renderCharts() {
    const { ordersChart, salesChart, customersChart } = this.subElements;
    ordersChart.append(this.orders.element);
    salesChart.append(this.sales.element);
    customersChart.append(this.customers.element);
  }

  renderTable() {
    this.subElements.sortableTable.append(this.table.element);
  }

  updateCharts(from, to) {
    this.orders.update(from, to);
    this.customers.update(from, to);
    this.sales.update(from, to);

  }

  async updateTable(from, to) {
    this.table.url.searchParams.set('from', from.toISOString());
    this.table.url.searchParams.set('to', to.toISOString());
    const newData = await this.table.loadData();
    this.table.addRows(newData);
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

  setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  get currentRange() {
    const to = new Date();
    const from = new Date(to);
    from.setMonth(to.getMonth() - 1);

    return { from, to };
  }
}
