import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  element;
  pageSize = 30;
  data = [];
  subElements = {};
  isLoading = false;
  sortArrow = `
    <span data-element="arrow" class="sortable-table__sort-arrow">
      <span class="sort-arrow"></span>
    </span>
  `;

  onHeaderClick = (event) => {
    const cell = event.target.closest('.sortable-table__cell');
    if (cell && cell.dataset.sortable !== 'false') {
      this.sort(cell.dataset.id, cell.dataset.order === 'desc' ? 'asc' : 'desc');
    }
  }

  onScroll = () => {
    const { innerHeight, scrollY } = window;
    const { offsetHeight } = document.body;
    if ((innerHeight + scrollY) >= offsetHeight) {
      this.loadMore();
    }
  }

  constructor(headerConfig, {
    url = '',
    sorted = {},
    isSortLocally = false
  } = {}) {
    this.headerConfig = headerConfig;
    this.url = url;
    this.sortingField = sorted.id;
    this.sortingOrder = sorted.order;
    this.isSortLocally = isSortLocally;

    this.render();
  }

  sortOnClient(id, order) {
    this.sortingField = id;
    this.sortingOrder = order;
    const locales = ['ru', 'en'];
    const options = {caseFirst: 'upper'};
    const sortType = this.sortedCell?.sortType;
    const sortable = this.sortedCell?.sortable;
    const sorted = [...this.data];
    const modes = {
      asc: 1,
      desc: -1
    };

    if (id && order && sortable) {
      sorted.sort((prev, next) => {
        const prevField = prev[id];
        const nextField = next[id];

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

  async sortOnServer(id, order) {
    this.sortingField = id;
    this.sortingOrder = order;
    this.data = [];
    this.onLoadStart();
    return await fetchJson(this.loadUrl);
  }

  async sort(fieldValue, orderValue) {
    try {
      this.data = this.isSortLocally ? this.sortOnClient(fieldValue, orderValue) : await this.sortOnServer(fieldValue, orderValue);
      this.updateHeaderAfterSorting(fieldValue, orderValue);
      this.subElements.body.innerHTML = this.renderTableBody(this.data);
      this.subElements.table.classList.remove('sortable-table_loading');
    } catch (error) {
      console.error(error);
    }
  }

  async render() {
    this.element = document.createElement('div');
    this.element.className = 'products-list__container';
    this.element.dataset.element = 'productsContainer';
    this.element.innerHTML = this.table;
    this.setSubElements();
    this.initEventListeners();

    try {
      this.onLoadStart();
      const data = await fetchJson(this.loadUrl);
      this.onLoadCompleted(data);
    } catch (error) {
      console
        .error(error);
    }
  }

  onLoadCompleted(data) {
    this.data = [...this.data, ...data];

    if (!this.data.length) {
      this.subElements.table.classList.remove('sortable-table_loading');
      this.subElements.table.classList.add('sortable-table_empty');
    }

    this.subElements.body.innerHTML = this.renderTableBody(this.data);
    this.subElements.table.classList.remove('sortable-table_loading');
    this.isLoading = false;
  }

  onLoadStart() {
    this.isLoading = true;
    this.subElements.table.classList.add('sortable-table_loading');
  }

  async loadMore() {
    if (!this.isLoading) {
      try {
        this.onLoadStart();
        const data = await fetchJson(this.loadUrl);
        this.onLoadCompleted(data);
      } catch (error) {
        console.error(error);
      }
    }
  }

  destroy() {
    this.clearEventListeners();

    if (this.element) {
      this.element.remove();
    }

    this.subElements = {};
    this.element = null;
    this.sortingField = null;
    this.sortingOrder = null;
    this.isLoading = false;
  }

  setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  updateHeaderAfterSorting(fieldValue, orderValue) {
    if (fieldValue && orderValue) {
      const allColumns = this.element.querySelectorAll('.sortable-table__cell[data-id]');
      const currentColumn = this.element.querySelector(`.sortable-table__cell[data-id="${fieldValue}"]`);
      allColumns.forEach(column => {
        column.dataset.order = '';
      });

      currentColumn.dataset.order = orderValue;
    }
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

  initEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onHeaderClick);
    document.addEventListener('scroll', this.onScroll);
  }

  clearEventListeners() {
    if (this.subElements.header) {
      this.subElements.header.removeEventListener('pointerdown', this.onHeaderClick);
    }
    document.removeEventListener('scroll', this.onScroll);
  }

  get table() {
    return `
      <div class="sortable-table" data-element="table">
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

  get loadUrl() {

    const params = {
      _start: this.data.length,
      _end: this.pageSize + this.data.length,
      _order: this.sortingOrder,
      _sort: this.sortingField
    };

    const entries = Object.entries(params).filter(([key, value]) => value !== undefined);
    const urlParams = entries.length ? '?' + entries.map(([key, value]) => `${key}=${value}`).join('&') : '';

    return `${BACKEND_URL}/${this.url}${urlParams}`;

  }
}
