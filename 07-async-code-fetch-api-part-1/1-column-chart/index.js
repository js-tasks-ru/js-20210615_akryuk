import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

  subElements = {}
  chartHeight = 50

  constructor({
    label = '',
    link = '',
    formatHeading = (v) => v,
    url = '/',
    range = {}
  } = {}) {
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.url = url;
    this.range = range;
    this.element = document.createElement('div');

    this.render();
  }

  render() {
    this.element.classList.add('column-chart');
    this.element.style.setProperty('--chart-height', this.chartHeight);
    if (!this.data || !this.data.length) {
      this.element.classList.add('column-chart_loading');
    }

    this.element.innerHTML = `
      ${this.title}
      <div class="column-chart__container">
        ${this.header}
        ${this.chart}
      </div>
    `;

    this._setSubElements();

    if (this.range.from && this.range.to) {
      this.update(this.range.from, this.range.to);
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  async update(from, to) {

    const { body, header } = this.subElements;
    const requestUrl = `${BACKEND_URL}/${this.url}?from=${new Date(from).toISOString()}&to=${new Date(to).toISOString()}`;
    this.element.classList.add('column-chart_loading');

    try {
      const data = await fetchJson(requestUrl);
      this.data = Object.values(data);
      header.innerHTML = this.value;
      body.innerHTML = this.chartColumns;
      this.element.classList.remove('column-chart_loading');

      return data;
    } catch (err) {
      console.error(err);
    }
  }

  get chart() {
    return `
      <div data-element="body" class="column-chart__chart">
        ${this.chartColumns}
      </div>
    `;
  }

  get chartColumns() {
    if (this.data) {
      const props = this._getColumnProps(this.data);
      const chartReducer = (acc, current, index) => {
        const { percent, value } = props[index];
        return acc + `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      };

      return this.data.reduce(chartReducer, '');
    }
  }

  get title() {
    const label = `Total ${this.label}`;
    const link = this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';

    return `<div class="column-chart__title">${label}${link}</div>`;
  }

  get header() {
    return `
      <div data-element="header" class="column-chart__header">
        ${this.value}
      </div>
    `;
  }

  get value() {
    if (this.data && this.data.length) {
      const displayValue = this.data.reduce((acc, val) => acc + val, 0);
      return this.formatHeading(displayValue);
    }

    return null;
  }

  _setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  _getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}

