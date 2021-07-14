export default class SortableList {
  constructor({items}) {
    this.items = items;
    this.render();
  }

  onDelete = (e) => {
    const deleteBtn = e.target.closest(`[data-delete-handle]`);
    if (deleteBtn) {
      deleteBtn.closest('.sortable-list__item').remove();
    }
  }

  render() {
    this.element = document.createElement('ul');
    this.element.className = 'sortable-list';
    this.items.forEach(item => {
      item.classList.add('sortable-list__item');
      this.element.append(item);
    });

    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('click', this.onDelete);
  }

  removeEventListeners() {
    document.removeEventListener('click', this.onDelete);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
  }
}
