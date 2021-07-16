export default class SortableList {

  dragElement = null;
  dragOffset = {
    top: 0,
    left: 0
  }

  handleDelete = (e) => {
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
      const { top, left, width } = this.dragElement.getBoundingClientRect();
      this.dragOffset.top = top - cursorPosition.top;
      this.dragOffset.left = left - cursorPosition.left;
      this.dragElement.style.width = width + 'px';
      this.dragElement.style.top = top + 'px';
      this.dragElement.style.left = left + 'px';
      this.dragElement.classList.add('sortable-list__item_dragging');
      this.dragElement.after(this.placeholder);
    }
  }

  handleMove = (e) => {
    if (this.isDragging) {
      this.dragElement.style.top = e.clientY + this.dragOffset.top + 'px';
      this.dragElement.style.left = e.clientX + this.dragOffset.left + 'px';
      const placeholder = this.element.querySelector('.sortable-list__placeholder');
      const { clientY } = e;

      // If higher then first
      if (clientY < this.element.firstElementChild.getBoundingClientRect().top) {
        this.element.prepend(placeholder);
        return;
      }

      // If lower then last
      if (clientY > this.element.lastElementChild.getBoundingClientRect().bottom) {
        this.element.append(placeholder);
        return;
      }

      // Rest
      this.items.forEach(item => {
        if (!item.classList.contains('sortable-list__item_dragging')) {
          const { top, bottom, height } = item.getBoundingClientRect();
          if (e.clientY > top + height / 2 && e.clientY < bottom) {
            item.after(placeholder);
          }
        }
      });
    }
  }

  handlePointerUp = () => {
    if (this.isDragging) {
      const placeholder = this.element.querySelector('.sortable-list__placeholder');
      placeholder.after(this.dragElement);
      this.onDragStop();
    }
  }

  constructor({items}) {
    this.items = items;
    this.render();
  }

  onDragStop() {
    if (this.isDragging) {
      this.dragElement.style = null;
      this.dragElement.classList.remove('sortable-list__item_dragging');
      this.dragElement = null;
      this.dragOffset = {
        top: 0,
        left: 0
      };
      this.element.querySelector('.sortable-list__placeholder').remove();
    }
  }

  render() {
    this.element = document.createElement('ul');
    this.element.className = 'sortable-list';
    this.items.forEach(item => this.addItem(item));
    this.initEventListeners();
  }

  initEventListeners() {
    document.addEventListener('pointerdown', this.handleDelete);
    document.addEventListener('pointerdown', this.handleDragStart);
    document.addEventListener('pointermove', this.handleMove);
    document.addEventListener('pointerup', this.handlePointerUp);
  }

  removeEventListeners() {
    document.removeEventListener('pointerdown', this.handleDelete);
    document.removeEventListener('pointerdown', this.handleDragStart);
    document.removeEventListener('pointermove', this.handleMove);
    document.removeEventListener('pointerup', this.handlePointerUp);
  }

  addItem(item) {
    item.classList.add('sortable-list__item');
    this.element.append(item);
    const dragHandler = item.querySelector(`[data-grab-handle]`);
    dragHandler.ondragstart = () => false;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.removeEventListeners();
    this.onDragStop();
    this.remove();
  }

  get placeholder() {
    const li = document.createElement('li');
    li.style.minHeight = '60px';
    li.classList.add('sortable-list__placeholder');

    return li;
  }

  get isDragging() {
    return !!this.dragElement;
  }
}
