import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {

  subElements = {}

  constructor (productId) {
    this.productId = productId;
    this.render();
  }

  async render() {
    this.element = document.createElement('div');
    this.element.className = 'product-form';

    const productRequest = fetchJson(`${BACKEND_URL}/api/rest/products?id=${this.productId}`);
    const categoriesRequest = fetchJson(`${BACKEND_URL}/api/rest/categories?_sort=weight&_refs=subcategory`);

    Promise.all([productRequest, categoriesRequest])
      .then(([productData, categories]) => {
        this.renderElementContent(productData[0], categories);
        this.setSubElements();
        const { productForm } = this.subElements;
        productForm.addEventListener('submit', (event) => {
          event.preventDefault();
          this.save();
        });
        this.setFormValues(productData[0]);
      })
      .catch(console.error);
  }

  renderCategorySelect(categoriesList = []) {

    // Extracting subcategories from each category to flat array
    const list = categoriesList.flatMap(
      category => category.subcategories.map(
        subcategory => ({id: subcategory.id, title: subcategory.title, rootTitle: category.title})
      )
    );

    const options = list.map(
      item => `<option value="${item.id}">${item.rootTitle} &gt; ${item.title}</option>`
    ).join('');

    return `
      <select class="form-control" name="subcategory">
        ${options}
      </select>
    `;
  }

  renderElementContent(product, categories) {
    this.element.innerHTML = `
      <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
          </fieldset>
        </div>
        <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <div data-element="imageListContainer">
            ${this.renderImagesList(product.images)}
          </div>
          <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
          ${this.renderCategorySelect(categories)}
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required="" type="number" name="price" class="form-control" placeholder="100">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required="" type="number" name="discount" class="form-control" placeholder="0">
          </fieldset>
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input required="" type="number" class="form-control" name="quantity" placeholder="1">
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select class="form-control" name="status">
            <option value="1">Активен</option>
            <option value="0">Неактивен</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" name="save" class="button-primary-outline">
            Сохранить товар
          </button>
        </div>
      </form>
    `;
  }

  setFormValues(product) {
    const {productForm} = this.subElements;
    const {elements} = productForm;
    const {title, description, subcategory, price, discount, quantity, status} = product;
    elements.title.value = title;
    elements.description.value = description;
    elements.subcategory.value = subcategory;
    elements.price.value = price;
    elements.discount.value = discount;
    elements.quantity.value = quantity;
    elements.status.value = status;
  }

  renderImage(data) {
    return `
      <li class="products-edit__imagelist-item sortable-list__item" style="">
        <input type="hidden" name="url" value="${data.url}">
        <input type="hidden" name="source" value="${data.source}">
        <span>
          <img src="icon-grab.svg" data-grab-handle="" alt="grab">
          <img class="sortable-table__cell-img" alt="Image" src="${data.url}">
          <span>${data.source}</span>
        </span>
        <button type="button">
          <img src="icon-trash.svg" data-delete-handle="" alt="delete">
        </button>
      </li>`;
  }

  renderImagesList(images = []) {
    return `
      <ul class="sortable-list">
        ${images.map(img => this.renderImage(img)).join('')}
      </ul>
    `;
  }

  setSubElements() {
    const subs = this.element.querySelectorAll('[data-element]');
    [...subs].forEach(sub => {
      const key = sub.dataset.element;
      this.subElements[key] = sub;
    });
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }

  get formValues() {
    const { productForm } = this.subElements;

    const formData = [...new FormData(productForm)];

    const images = [...formData].filter(item => item[0] === 'url').map((item) => {
      return ({url: item[1], source: item[1].split('/').pop()});
    });

    const rest = [...formData].filter(item => item[0] !== 'url' && item[0] !== 'source');
    const restObj = {...Object.fromEntries(rest), images};

    restObj.price = parseFloat(restObj.price);
    restObj.status = parseFloat(restObj.status);
    restObj.discount = parseFloat(restObj.discount);
    restObj.quantity = parseFloat(restObj.quantity);

    return restObj;
  }

  async save() {
    const body = {id: this.productId, ...this.formValues};
    fetch(`${BACKEND_URL}/api/rest/products`, {method: 'PATCH', body: JSON.stringify(body), headers: {"Content-Type": "application/json"}})
      .then(() => {
        this.element.dispatchEvent(new CustomEvent('product-updated', {bubbles: true}));
      })
      .catch(console.error);
  }
}
