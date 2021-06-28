export default class ColumnChart {
  constructor(options) {
    this.data = options?.data;
    this.label = options?.label;
    this.value = options?.value;
    this.link = options?.link;
    this.element = document.createElement('div');
    this.formatHeading = options?.formatHeading || null;
    this.chartHeight = 50;

    this.render();
  }

  get chart() {
    if (!this.data) {
      return '';
    } else {
      const props = this.getColumnProps(this.data);
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
        ${this.formatHeading ? this.formatHeading(this.value) : this.value}
      </div>`;
  }

  render() {
    const body = `<div data-element="body" class="column-chart__chart">${this.chart}</div>`;

    this.element.classList.add('column-chart');
    this.element.style.setProperty('--chart-height', this.chartHeight);
    if (!this.data || !this.data.length) {
      this.element.classList.add('column-chart_loading');
    }

    this.element.innerHTML = `
      ${this.title}
      <div class="column-chart__container">
        ${this.header}
        ${body}
      </div>
    `;
  }

  destroy() {
    this.element.innerHTML = '';
  }

  remove() {
    this.element.parentElement.innerHTML = '';
  }

  update(data) {
    this.data = data;
    this.destroy();
    this.render();
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }
}
