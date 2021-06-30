export default class NotificationMessage {
  element;
  constructor(label = '', { duration = 2000, type = ''} = {}) {
    this.label = label;
    this.type = type;
    this.duration = duration;

    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('notification', this.type ? this.type : null);
    this.element.style.setProperty('--value', `${this.duration / 1000}s`);

    this.element.innerHTML = `
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.label}
        </div>
      </div>
    `;
  }

  show(target = document.body) {
    target.append(this.element);
    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.destroy();
    this.element = null;
  }

  destroy() {
    if (this.element) {
      this.element.remove();
    }
  }
}
