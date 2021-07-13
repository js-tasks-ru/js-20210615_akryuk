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

  constructor({ from = new Date(), to = new Date()}) {
    this.from = from;
    this.to = to;
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
        <span data-element="from">11/26/19</span> -
        <span data-element="to">12/26/19</span>
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
    const {input} = this.subElements;
    input.addEventListener('click', this.toggle);
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

  renderSelector() {
    return `
      <div class="rangepicker__selector" data-element="selector">
        <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left"></div>
        <div class="rangepicker__selector-control-right"></div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="November">November</time>
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
            <button type="button" class="rangepicker__cell" data-value="2019-11-01T17:53:50.338Z" style="--start-from: 5">1</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-02T17:53:50.338Z">2</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-03T17:53:50.338Z">3</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-04T17:53:50.338Z">4</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-05T17:53:50.338Z">5</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-06T17:53:50.338Z">6</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-07T17:53:50.338Z">7</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-08T17:53:50.338Z">8</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-09T17:53:50.338Z">9</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-10T17:53:50.338Z">10</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-11T17:53:50.338Z">11</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-12T17:53:50.338Z">12</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-13T17:53:50.338Z">13</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-14T17:53:50.338Z">14</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-15T17:53:50.338Z">15</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-16T17:53:50.338Z">16</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-17T17:53:50.338Z">17</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-18T17:53:50.338Z">18</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-19T17:53:50.338Z">19</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-20T17:53:50.338Z">20</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-21T17:53:50.338Z">21</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-22T17:53:50.338Z">22</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-23T17:53:50.338Z">23</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-24T17:53:50.338Z">24</button>
            <button type="button" class="rangepicker__cell" data-value="2019-11-25T17:53:50.338Z">25</button>
            <button type="button" class="rangepicker__cell rangepicker__selected-from"
                    data-value="2019-11-26T17:53:50.338Z">26
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-11-27T17:53:50.338Z">27
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-11-28T17:53:50.338Z">28
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-11-29T17:53:50.338Z">29
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-11-30T17:53:50.338Z">30
            </button>
          </div>
        </div>
        <div class="rangepicker__calendar">
          <div class="rangepicker__month-indicator">
            <time datetime="December">December</time>
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
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-01T17:53:50.338Z" style="--start-from: 7">1
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-02T17:53:50.338Z">2
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-03T17:53:50.338Z">3
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-04T17:53:50.338Z">4
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-05T17:53:50.338Z">5
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-06T17:53:50.338Z">6
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-07T17:53:50.338Z">7
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-08T17:53:50.338Z">8
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-09T17:53:50.338Z">9
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-10T17:53:50.338Z">10
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-11T17:53:50.338Z">11
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-12T17:53:50.338Z">12
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-13T17:53:50.338Z">13
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-14T17:53:50.338Z">14
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-15T17:53:50.338Z">15
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-16T17:53:50.338Z">16
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-17T17:53:50.338Z">17
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-18T17:53:50.338Z">18
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-19T17:53:50.338Z">19
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-20T17:53:50.338Z">20
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-21T17:53:50.338Z">21
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-22T17:53:50.338Z">22
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-23T17:53:50.338Z">23
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-24T17:53:50.338Z">24
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-between"
                    data-value="2019-12-25T17:53:50.338Z">25
            </button>
            <button type="button" class="rangepicker__cell rangepicker__selected-to" data-value="2019-12-26T17:53:50.338Z">
              26
            </button>
            <button type="button" class="rangepicker__cell" data-value="2019-12-27T17:53:50.338Z">27</button>
            <button type="button" class="rangepicker__cell" data-value="2019-12-28T17:53:50.338Z">28</button>
            <button type="button" class="rangepicker__cell" data-value="2019-12-29T17:53:50.338Z">29</button>
            <button type="button" class="rangepicker__cell" data-value="2019-12-30T17:53:50.338Z">30</button>
            <button type="button" class="rangepicker__cell" data-value="2019-12-31T17:53:50.338Z">31</button>
          </div>
        </div>
      </div>
    `;
  }

}
