export default class RangePicker {
  subElements = {}
  mode = 'from';

  toggle = () => {
    this.element.classList.toggle('rangepicker_open');
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
      if (this.mode === 'from') {
        this.setFromDate(new Date(dayBtn.dataset.value));
        this.mode = 'to';
        return;
      }

      if (this.mode === 'to') {
        this.setToDate(new Date(dayBtn.dataset.value));
        this.mode = 'from';
        this.close();
      }
    }
  }

  increaseMonth = () => {
    this.visibleMonth = this.nextMonth;
    this.updateMonthsMarkup();
  }

  decreaseMonth = () => {
    this.visibleMonth = this.prevMonth;
    this.updateMonthsMarkup();
  }

  constructor({ from = new Date(), to = new Date()}) {
    this.from = from;
    this.to = to;
    this.visibleMonth = {
      year: this.from.getFullYear(),
      month: this.from.getMonth()
    };

    this.render();
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = `rangepicker`;

    this.element.innerHTML = `
      ${this.renderInput()}
      ${this.renderSelector()}
    `;

    this.setSubElements();
    this.initEventListeners();
  }

  renderInput() {
    return `
      <div class="rangepicker__input" data-element="input">
        <span data-element="from">${this.formatDate(this.from)}</span> -
        <span data-element="to">${this.formatDate(this.to)}</span>
      </div>
    `;
  }

  renderSelector() {
    return `
      <div class="rangepicker__selector" data-element="selector">
        <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left" data-element="controlLeft"></div>
        <div class="rangepicker__selector-control-right" data-element="controlRight"></div>
        <div class="rangepicker__calendar" data-element="monthStart">
          ${this.renderMonth(this.visibleMonth)}
        </div>
        <div class="rangepicker__calendar" data-element="monthEnd">
          ${this.renderMonth(this.nextMonth)}
        </div>
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

    const renderDay = ({day, value, weekday, date}) => {

      const classes = ['rangepicker__cell'];

      if (date > this.from && date < this.to) {
        classes.push('rangepicker__selected-between');
      }

      if (date.valueOf() === this.from.valueOf()) {
        classes.push('rangepicker__selected-from');
      }

      if (date.valueOf() === this.to.valueOf()) {
        classes.push('rangepicker__selected-to');
      }

      return `
        <button
          type="button"
          class="${classes.join(' ')}"
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

  setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  close() {
    this.element.classList.remove('rangepicker_open');
  }

  initEventListeners() {
    document.addEventListener('click', this.clickOutside);
    document.addEventListener('click', this.handleDayClick);
    const {input, controlLeft, controlRight} = this.subElements;
    input.addEventListener('click', this.toggle);
    controlLeft.addEventListener('click', this.decreaseMonth);
    controlRight.addEventListener('click', this.increaseMonth);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.clickOutside);
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
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}.${month}.${year}`;
  }

  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
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

  updateMonthsMarkup() {
    const {monthStart, monthEnd} = this.subElements;
    monthStart.innerHTML = this.renderMonth(this.visibleMonth);
    monthEnd.innerHTML = this.renderMonth(this.nextMonth);
  }

  setFromDate(date) {
    const { from } = this.subElements;
    this.from = date;
    this.setToDate(date);
    this.updateMonthsMarkup();
    from.innerHTML = this.formatDate(this.from);
  }

  setToDate(date) {
    const { to } = this.subElements;
    this.to = date;
    this.updateMonthsMarkup();
    to.innerHTML = this.formatDate(this.to);
  }

}
