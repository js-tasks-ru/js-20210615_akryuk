class Tooltip {

  static instance;
  static offset = 12;

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

  destroy() {
    if (this.element) {
      this.element.remove();
      this.element.innerHTML = '';
    }
  }

  handlePointerMove(event) {
    this.element.style.left = event.x + Tooltip.offset + 'px';
    this.element.style.top = event.y + Tooltip.offset + 'px';
  }

  initialize() {
    this.createElement();

    document.addEventListener('pointerover', (e) => {
      const tooltipEl = e.target.closest('[data-tooltip]');
      if (tooltipEl) {
        this.render(tooltipEl.dataset.tooltip);
        tooltipEl.addEventListener('pointermove', e => this.handlePointerMove(e));
      }
    });

    document.addEventListener('pointerout', (e) => {
      const tooltipEl = e.target.closest('[data-tooltip]');
      if (tooltipEl) {
        this.destroy();
        tooltipEl.removeEventListener('pointermove', (e) => this.handlePointerMove(e));
      }
    });
  }
}

export default Tooltip;
