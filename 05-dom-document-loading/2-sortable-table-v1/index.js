export default class SortableTable {

  element;
  subElements = {};
  sortingField = null;
  sortingOrder = null;

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
    this.sortingField = fieldValue;
    this.sortingOrder = orderValue;
    this.subElements['header'].innerHTML = this.tableHeader;
    this.subElements['body'].innerHTML = this.tableBody;
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
    this.sortingField = null;
    this.sortingOrder = null;
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
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.tableHeader}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.tableBody}
        </div>
        ${this.tableLoading}
        ${this.tableEmptyPlaceholder}
      </div>
    `;
  }

  get tableHeader() {
    const cells = this.headerConfig.map((cell) => {
      const order = cell.id === this.sortingField ? this.sortingOrder : '';
      return `
        <div class="sortable-table__cell" data-id="${cell.id}" data-sortable="${cell.sortable}" data-order="${order}">
          <span>${cell.title}</span>
        </div>
      `;
    });

    return cells.join('');
  }

  get tableBody() {
    return this.sortedData.map(row => this.renderRow(row)).join('');
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

  get sortedData() {
    const modes = {
      asc: 1,
      desc: -1
    };

    const sortType = this.headerConfig.find(cell => cell.id === this.sortingField)?.sortType;
    const locales = ['ru', 'en'];
    const options = {caseFirst: 'upper'};

    if (this.sortingField && this.sortingOrder) {
      return this.data.sort((prev, next) => {
        if (sortType === 'number') {
          return (prev[this.sortingField] - next[this.sortingField]) * modes[this.sortingOrder];
        }

        if (sortType === 'string') {
          return prev[this.sortingField].localeCompare(next[this.sortingField], locales, options) * modes[this.sortingOrder];
        }
      });
    }

    return this.data;
  }

}

