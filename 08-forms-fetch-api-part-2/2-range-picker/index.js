export default class RangePicker {
  subElements = {}

  toggle = () => {
    this.element.classList.toggle('rangepicker_open');
  }

  clickOutside = (e) => {
    const picker = e.target.closest('.rangepicker');
    if (!picker) {
      this.close();
    }
  }

  increaseMonth = () => {
    const {monthStart, monthEnd} = this.subElements;
    this.visibleMonth = this.nextMonth;

    monthStart.innerHTML = this.renderMonth(this.visibleMonth);
    monthEnd.innerHTML = this.renderMonth(this.nextMonth);
  }

  decreaseMonth = () => {
    const {monthStart, monthEnd} = this.subElements;
    this.visibleMonth = this.prevMonth;

    monthStart.innerHTML = this.renderMonth(this.visibleMonth);
    monthEnd.innerHTML = this.renderMonth(this.nextMonth);
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
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ];

    const daysInMonth = this.daysInMonth(month + 1, year);
    const days = [];

    for (let i = 1; i <= daysInMonth; i++) {

      const date = new Date(year, month, i);

      days.push({
        day: i,
        value: date.toISOString(),
        weekday: date.getDay(),
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
    const {input, controlLeft, controlRight} = this.subElements;
    input.addEventListener('click', this.toggle);
    controlLeft.addEventListener('click', this.decreaseMonth);
    controlRight.addEventListener('click', this.increaseMonth);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.clickOutside);
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
    const year = date.getFullYear().toString().substr(-2);
    const month = date.getMonth() + 1;
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}/${month}/${year}`;
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

}
