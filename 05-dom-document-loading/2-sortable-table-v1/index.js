export default class SortableTable {

  element;
  subElements = {};
  sortingField = null;
  sortingOrder = null;

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data.data || data; // Because in test config data argument set as { data } instead of array

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'products-list__container';
    this.element.dataset.element = 'productsContainer';
    this.element.innerHTML = this.table;
    this.setSubElements();
  }

  sort(fieldValue, orderValue) {
    this.sortingField = fieldValue;
    this.sortingOrder = orderValue;
    this.subElements.header.innerHTML = this.tableHeader;
    this.subElements.body.innerHTML = this.tableBody;
  }

  renderRow(data = {}) {

    const defaultCellTemplate = (data) => `<div class="sortable-table__cell">${data}</div>`;

    const rowCells = this.headerConfig.map(cell => {
      const field = data[cell.id];
      return cell.template ? cell.template(field) : defaultCellTemplate(field);
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
      const isSorted = cell.id === this.sortingField;
      const order = isSorted ? this.sortingOrder : '';
      return `
        <div class="sortable-table__cell" data-id="${cell.id}" data-sortable="${cell.sortable}" data-order="${order}">
          <span>${cell.title}</span>
          ${isSorted ? this.sortArrow : ''}
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

  get sortedCell() {
    return this.headerConfig.find(cell => cell.id === this.sortingField);
  }

  get sortingMode() {
    const modes = {
      asc: 1,
      desc: -1
    };

    return modes[this.sortingOrder];
  }

  get sortedData() {
    const locales = ['ru', 'en'];
    const options = {caseFirst: 'upper'};
    const sortType = this.sortedCell?.sortType;
    const sortable = this.sortedCell?.sortable;
    const sorted = [...this.data];

    if (this.sortingField && this.sortingOrder && sortable) {
      sorted.sort((prev, next) => {
        const prevSorting = prev[this.sortingField];
        const nextSorting = next[this.sortingField];

        if (sortType === 'number') {
          return (prevSorting - nextSorting) * this.sortingMode;
        }

        if (sortType === 'string') {
          return prevSorting.localeCompare(nextSorting, locales, options) * this.sortingMode;
        }
      });
    }

    return sorted;
  }

  get sortArrow() {
    return `
      <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
    `;
  }
}
