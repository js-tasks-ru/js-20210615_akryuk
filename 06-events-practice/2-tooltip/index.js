class Tooltip {

  static instance;
  static offset = 12;

  listeners = {
    pointerover: this.handlePointerOver.bind(this),
    pointerout: this.handlePointerOut.bind(this),
    pointerMove: this.handlePointerMove.bind(this)
  }

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
  }

  render(text = '') {
    document.body.append(this.element);
    this.element.innerHTML = text;
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element.innerHTML = '';
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.listeners.pointerover);
    document.removeEventListener('pointerout', this.listeners.pointerout);
  }

  handlePointerMove(event) {
    this.element.style.left = event.x + Tooltip.offset + 'px';
    this.element.style.top = event.y + Tooltip.offset + 'px';
  }

  handlePointerOver(event) {
    const tooltipEl = event.target.closest('[data-tooltip]');
    if (tooltipEl) {
      this.render(tooltipEl.dataset.tooltip);
      tooltipEl.addEventListener('pointermove', this.listeners.pointerMove);
    }
  }

  handlePointerOut(event) {
    const tooltipEl = event.target.closest('[data-tooltip]');
    if (tooltipEl) {
      this.remove();
      tooltipEl.removeEventListener('pointermove', this.listeners.pointerMove);
    }
  }

  initialize() {
    this.createElement();
    document.addEventListener('pointerover', this.listeners.pointerover);
    document.addEventListener('pointerout', this.listeners.pointerout);
  }
}

export default Tooltip;
