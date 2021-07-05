class Tooltip {

  static instance

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
    this.element.style.left = event.x + 12 + 'px';
    this.element.style.top = event.y + 12 + 'px';
  }

  initialize() {
    this.createElement();
    const tooltipElements = document.querySelectorAll(`[data-tooltip]`);

    [...tooltipElements].forEach(element => {
      const tooltipText = element.dataset.tooltip;

      element.addEventListener('pointerover', (e) => {
        this.render(tooltipText);
        document.body.addEventListener('pointermove', e => this.handlePointerMove(e));
      }, true);

      element.addEventListener('pointerout', () => {
        this.destroy();
        document.body.removeEventListener('pointermove', (e) => this.handlePointerMove(e));
      });
    });
  }
}

export default Tooltip;
