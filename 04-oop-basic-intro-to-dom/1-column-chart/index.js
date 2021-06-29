export default class ColumnChart {
  constructor(options = {}) {
    const { data, label, value, link, formatHeading } = options;
    this.data = data;
    this.label = label;
    this.value = value;
    this.link = link;
    this.formatHeading = formatHeading;
    this.element = document.createElement('div');
    this.chartHeight = 50;

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
  }

  destroy() {
    this.element.innerHTML = '';
  }

  remove() {
    this.element.remove();
  }

  update(data) {
    this.data = data;
    this.destroy();
    this.render();
  }

  get chart() {
    if (!this.data) {
      return '';
    } else {
      const props = this._getColumnProps(this.data);
      const chartReducer = (acc, current, index) => {
        const { percent, value } = props[index];
        return acc + `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
      };
      return `
        <div data-element="body" class="column-chart__chart">
          ${this.data.reduce(chartReducer, '')}
        </div>
      `;
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
      </div>
    `;
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
