export default class SortableTable {

  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = Array.isArray(data) ? data : data.data;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.classList.add('products-list__container');
    this.element.setAttribute('data-element', 'productsContainer');

    this.element.innerHTML = this.table;
    this.setSubElements();
  }

  sort(fieldValue, orderValue) {
    console.log(fieldValue, orderValue);
  }

  renderRow(data = {}) {

    const rowCells = this.headerConfig.map((cell) => {
      const field = data[cell.id];
      return cell.template ? cell.template(field) : `<div class="sortable-table__cell">${field}</div>`;
    });

    return `
      <a href="/products/${data.id}" class="sortable-table__row">
        ${rowCells.join('')}
      </a>
    `;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
    this.subElements = {};
    this.element = null;
  }

  setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  get table() {
    return `
      <div class="sortable-table">
        ${this.tableHeader}
        ${this.tableBody}
        ${this.tableLoading}
        ${this.tableEmptyPlaceholder}
      </div>
    `;
  }

  get tableHeader() {
    const cells = this.headerConfig.map((cell) => {
      return `
        <div class="sortable-table__cell" data-id="${cell.id}" data-sortable="${cell.sortable}" data-order="">
          <span>${cell.title}</span>
        </div>
      `;
    });

    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${cells.join('')}
      </div>
    `;
  }

  get tableBody() {
    const rows = this.data.map(row => this.renderRow(row));

    return `
      <div data-element="body" class="sortable-table__body">
          ${rows.join('')}
      </div>
    `;
  }

  get tableLoading() {
    return `
      <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
    `;
  }

  get tableEmptyPlaceholder() {
    return `
      <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
        <div>
          <p>No products satisfies your filter criteria</p>
          <button type="button" class="button-primary-outline">Reset all filters</button>
        </div>
      </div>
    `;
  }

}

