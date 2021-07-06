export default class SortableTable {

  element;
  subElements = {};
  sortArrow = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
  `;

  onHeaderClick = this.handleHeaderClick.bind(this);

  constructor(headerConfig, {
    data = [],
    sorted = {id: null, order: null},
    isSortedLocally = true
  } = {}) {

    this.headerConfig = headerConfig;
    this.data = data.data || data;
    this.sortingField = sorted.id;
    this.sortingOrder = sorted.order;
    this.isSortedLocally = isSortedLocally;

    this.render(this.sortingOrder);
    this.sort(sorted.id, sorted.order);
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'products-list__container';
    this.element.dataset.element = 'productsContainer';
    this.element.innerHTML = this.table;
    this.setSubElements();
    this.subElements.header.addEventListener('pointerdown', this.onHeaderClick);
  }

  sort(fieldValue, orderValue) {
    this.sortingField = fieldValue;
    this.sortingOrder = orderValue;

    const sortedRows = this.sortData(fieldValue, orderValue);

    this.updateHeaderAfterSorting(fieldValue, orderValue);
    this.subElements.body.innerHTML = this.renderTableBody(sortedRows);
  }

  sortData(fieldValue, orderValue) {
    if (this.isSortedLocally) {
      return this.locallySortedData(fieldValue, orderValue);
    }
  }

  locallySortedData(field, order) {
    const locales = ['ru', 'en'];
    const options = {caseFirst: 'upper'};
    const sortType = this.sortedCell?.sortType;
    const sortable = this.sortedCell?.sortable;
    const sorted = [...this.data];
    const modes = {
      asc: 1,
      desc: -1
    };

    if (field && order && sortable) {
      sorted.sort((prev, next) => {
        const prevField = prev[field];
        const nextField = next[field];

        switch (sortType) {
        case 'number':
          return (prevField - nextField) * modes[order];

        case 'string':
          return prevField.localeCompare(nextField, locales, options) * modes[order];

        default:
          return (prevField - nextField) * modes[order];

        }
      });
    }

    return sorted;
  }

  destroy() {
    if (this.subElements.header) {
      this.subElements.header.removeEventListener('pointerdown', this.onHeaderClick);
    }

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

  handleHeaderClick(event) {
    const cell = event.target.closest('.sortable-table__cell');

    if (cell && cell.dataset.sortable !== 'false') {
      this.sort(cell.dataset.id, cell.dataset.order === 'desc' ? 'asc' : 'desc');
    }
  }

  updateHeaderAfterSorting(fieldValue, orderValue) {
    const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
    const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);
    allColumns.forEach(column => {
      column.dataset.order = '';
    });

    currentColumn.dataset.order = orderValue;
  }

  renderTableBody(data = []) {
    return data.map(row => this.renderRow(row)).join('');
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

  get table() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.tableHeader}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.renderTableBody(this.data)}
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
          ${this.sortArrow}
        </div>
      `;
    });

    return cells.join('');
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
}
