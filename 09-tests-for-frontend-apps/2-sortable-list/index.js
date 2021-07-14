export default class SortableList {

  dragInProgress = false;
  dragElement = null;
  dragOffset = {
    top: 0,
    left: 0
  }

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

  handleDragStart = (e) => {
    const dragHandler = e.target.closest(`[data-grab-handle]`);
    if (dragHandler) {
      this.dragElement = e.target.closest('.sortable-list__item');
      const cursorPosition = { left: e.clientX, top: e.clientY };
      const bounds = this.dragElement.getBoundingClientRect();

      this.dragOffset.top = bounds.top - cursorPosition.top;
      this.dragOffset.left = bounds.left - cursorPosition.left;

      const width = this.dragElement.scrollWidth + 'px';
      this.dragInProgress = true;
      this.dragElement.style.width = width;
      this.dragElement.style.top = bounds.top + 'px';
      this.dragElement.style.left = bounds.left + 'px';
      this.dragElement.classList.add('sortable-list__item_dragging');
      this.dragElement.after(this.placeholder);
    }
  }

  handleMove = (e) => {
    if (this.dragInProgress && this.dragElement) {
      console.log(e.clientX, e.clientY);
      this.dragElement.style.top = e.clientY + this.dragOffset.top + 'px';
      this.dragElement.style.left = e.clientX + this.dragOffset.left + 'px';
    }
  }

  handleDrop = (e) => {

  }

  handleDragCancel = (e) => {
    if (this.dragElement && this.dragInProgress) {
      this.dragInProgress = false;
      this.dragElement.style = null;
      this.dragElement.classList.remove('sortable-list__item_dragging');
      this.dragElement = null;
      this.dragOffset = {
        top: 0,
        left: 0
      };
      document.querySelector('.sortable-list__placeholder').remove();
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
    document.addEventListener('pointerdown', this.onDelete);
    document.addEventListener('pointerdown', this.handleDragStart);
    document.addEventListener('pointermove', this.handleMove);
    document.addEventListener('pointerup', this.handleDragCancel);
  }

  removeEventListeners() {
    document.removeEventListener('pointerdown', this.onDelete);
    document.removeEventListener('pointerdown', this.handleDragStart);
    document.removeEventListener('pointermove', this.handleMove);
    document.removeEventListener('pointerup', this.handleDragCancel);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  get placeholder() {
    const li = document.createElement('li');
    li.classList.add('sortable-list__placeholder');

    return li;
  }

  destroy() {
    this.removeEventListeners();
    this.remove();
    this.dragInProgress = false;
    this.dragElement = null;
    this.dragOffset = {
      top: 0,
      left: 0
    };
  }
}
