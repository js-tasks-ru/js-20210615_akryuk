export default class RangePicker {
  subElements = {};

  toggle = () => {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  clickOutside = (e) => {
    const picker = e.target.closest('.rangepicker');
    if (!picker) {
      this.close();
    }
  }

  handleDayClick = (e) => {
    const dayBtn = e.target.closest('.rangepicker__cell');
    if (dayBtn) {

      if (this.to) {
        this.from = new Date(dayBtn.dataset.value);
        this.to = null;
        this.highlightCells();
      } else {
        this.to = new Date(dayBtn.dataset.value);
        const { from, to } = this.subElements;
        from.innerHTML = this.formattedFrom;
        to.innerHTML = this.formattedTo;
        this.highlightCells();
        this.close();
      }
    }
  }

  handleMonthSwitcher = (e) => {
    const leftControl = e.target.closest('.rangepicker__selector-control-left');
    const rightControl = e.target.closest('.rangepicker__selector-control-right');

    if (leftControl) {
      this.decreaseMonth();
    }

    if (rightControl) {
      this.increaseMonth();
    }
  }

  constructor({ from = new Date(), to = new Date()}) {
    this.from = from;
    this.to = to;
    this.visibleMonth = {
      year: this.from.getFullYear(),
      month: this.from.getMonth()
    };

    this.defaultsFrom = from;
    this.defaultsTo = to;

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = `rangepicker`;

    this.element.innerHTML = `
      ${this.renderInput()}
      <div class="rangepicker__selector" data-element="selector"></div>
    `;

    this.setSubElements();
    this.initEventListeners();
  }

  renderInput() {
    return `
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${this.formattedFrom}</span> -
        <span data-element="to">${this.formattedTo}</span>
      </div>
    `;
  }

  renderSelector() {
    return `
      <div class="rangepicker__selector-arrow"></div>
      <div class="rangepicker__selector-control-left"></div>
      <div class="rangepicker__selector-control-right"></div>
      <div class="rangepicker__calendar" data-element="monthStart">
        ${this.renderMonth(this.visibleMonth)}
      </div>
      <div class="rangepicker__calendar" data-element="monthEnd">
        ${this.renderMonth(this.nextMonth)}
      </div>
    `;
  }

  renderMonth({month, year}) {
    const months = [
      'январь',
      'февраль',
      'март',
      'апрель',
      'май',
      'июнь',
      'июль',
      'август',
      'сентябрь',
      'октябрь',
      'ноябрь',
      'декабрь'
    ];

    const daysInMonth = this.daysInMonth(month + 1, year);
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {

      const date = new Date(year, month, i);

      days.push({
        day: i,
        value: date.toISOString(),
        weekday: date.getDay(),
        date
      });
    }

    const renderDay = ({day, value, weekday}) => {
      return `
        <button
          type="button"
          class="rangepicker__cell"
          style="--start-from: ${weekday}"
          data-value="${value}"
          >
            ${day}
          </button>
      `;
    };

    return `
      <div class="rangepicker__month-indicator">
        <time datetime="${months[month]}">${months[month]}</time>
      </div>
      <div class="rangepicker__day-of-week">
        <div>Пн</div>
        <div>Вт</div>
        <div>Ср</div>
        <div>Чт</div>
        <div>Пт</div>
        <div>Сб</div>
        <div>Вс</div>
      </div>
      <div class="rangepicker__date-grid">
        ${days.map(date => renderDay(date)).join('')}
      </div>
    `;
  }

  highlightCells() {
    const { selector } = this.subElements;
    const classes = {
      from: 'rangepicker__selected-from',
      to: 'rangepicker__selected-to',
      between: 'rangepicker__selected-between'
    };
    const cells = selector.querySelectorAll('.rangepicker__cell');

    [...cells].forEach(cell => {
      cell.className = 'rangepicker__cell';
      const date = new Date(cell.dataset.value);
      if (date.valueOf() === this.from.valueOf()) {
        cell.classList.add(classes.from);
      }

      if (this.to && date.valueOf() === this.to.valueOf()) {
        cell.classList.add(classes.to);
      }

      if (date > this.from && date < this.to && this.to) {
        cell.classList.add(classes.between);
      }
    });
  }

  setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  open() {
    const { selector } = this.subElements;
    this.element.classList.add('rangepicker_open');
    selector.innerHTML = this.renderSelector();
    this.setSubElements();
    this.highlightCells();
  }

  close() {
    const { selector } = this.subElements;
    this.element.classList.remove('rangepicker_open');
    if (!this.to) {
      this.from = this.defaultsFrom;
      this.to = this.defaultsTo;
    }
  }

  initEventListeners() {
    document.addEventListener('click', this.clickOutside);
    document.addEventListener('click', this.handleMonthSwitcher);
    document.addEventListener('click', this.handleDayClick);

    const {input} = this.subElements;
    input.addEventListener('click', this.toggle);

  }

  removeEventListeners() {
    document.removeEventListener('click', this.clickOutside);
    document.removeEventListener('click', this.handleMonthSwitcher);
    document.removeEventListener('click', this.handleDayClick);

    const {input} = this.subElements;
    input.removeEventListener('click', this.toggle);

  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.subElements = {};
    this.remove();
  }

  formatDate(date) {
    if (date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');

      return `${day}.${month}.${year}`;
    }
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }

  increaseMonth() {
    this.visibleMonth = this.nextMonth;
    this.updateMonthsMarkup();
  }

  decreaseMonth() {
    this.visibleMonth = this.prevMonth;
    this.updateMonthsMarkup();
  }

  get nextMonth() {
    const current = {...this.visibleMonth};
    const month = current.month + 1 > 11 ? 0 : current.month + 1;
    const year = current.month + 1 > 11 ? current.year + 1 : current.year;
    return { month, year };
  }

  get prevMonth() {
    const current = {...this.visibleMonth};
    const month = current.month - 1 < 0 ? 11 : current.month - 1;
    const year = current.month - 1 < 0 ? current.year - 1 : current.year;
    return { month, year };
  }

  get formattedTo() {
    return this.formatDate(this.to);
  }

  get formattedFrom() {
    return this.formatDate(this.from);
  }

  get isOpen() {
    return this.element.classList.contains('rangepicker_open');
  }

  updateMonthsMarkup() {
    const {monthStart, monthEnd} = this.subElements;
    monthStart.innerHTML = this.renderMonth(this.visibleMonth);
    monthEnd.innerHTML = this.renderMonth(this.nextMonth);
    this.highlightCells();
  }
}
