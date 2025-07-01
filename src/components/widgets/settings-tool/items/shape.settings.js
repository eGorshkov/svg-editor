import PrototypeSettings from './prototype.settings.js';

/**
 * Класс ShapeSettings — настройки для фигуры.
 * @extends PrototypeSettings
 */
export default class ShapeSettings extends PrototypeSettings {
  /**
   * Конструктор ShapeSettings.
   * @param {IShape} item Фигура
   * @param {ISetting[]} config Массив настроек
   */
  constructor(item, config) {
    super(item, config);
  }

  /**
   * Создаёт информационный блок для фигуры, включая список связей.
   * @returns {Array} Массив элементов
   */
  createInformationBlock() {
    return [...super.createInformationBlock(), this.#createLinksList()].filter(Boolean);
  }

  /**
   * Получает элемент с подписью для фигуры.
   * @returns {HTMLElement} Элемент label
   */
  getLabelElement() {
    const { type, order } = this.item;
    return super.getLabelElement(`Type: ${type.toCapitalizeCase()} | Order: ${order}`);
  }

  /**
   * Приватный метод: создаёт элемент связи.
   * @private
   * @param {Object} link Связь
   * @param {string} type Тип связи ('from' или 'to')
   * @returns {HTMLElement} Элемент связи
   */
  #setSubItem(link, type) {
    const { linkShape, toType, toShape, fromType, fromShape } = link;
    const linkWith = type === 'from' ? toShape : fromShape;

    const el = document.createElement('div');
    const removeBtn = document.createElement('button');
    const linkShapeLink = this.linkBtn(linkShape.uniqueId);
    const linkWithLink = this.linkBtn(linkWith.uniqueId);

    removeBtn.innerText = 'Remove';
    const remove = () => {
      globalThis.LINK_STORE.removeLinkById(linkShape.uniqueId);
      removeBtn.removeEventListener('click', remove);
      el.parentElement.removeChild(el);
    };
    removeBtn.addEventListener('click', remove);
    removeBtn.style.marginLeft = 'auto';

    el.style.display = 'flex';
    el.append(`${fromType}-${toType} link (`);
    el.appendChild(linkShapeLink);
    el.append(') ' + (type === 'from' ? 'to' : 'from') + ' shape (');
    el.appendChild(linkWithLink);
    el.append(')');
    el.appendChild(removeBtn);

    return el;
  }

  /**
   * Приватный метод: создаёт список связей фигуры.
   * @private
   * @returns {HTMLElement|null} Список связей или null
   */
  #createLinksList() {
    if (this.item.links.from.length + this.item.links.to.length === 0) return null;

    const list = document.createElement('div'),
      title = document.createElement('div');
    list.style.padding = '10px';
    list.style.margin = '10px 0';
    list.style.border = '1px solid';
    list.style.borderRadius = '8px';

    title.innerText = 'Links';

    list.appendChild(title);
    ['from', 'to'].forEach(type =>
      globalThis.LINK_STORE.getByShapeId(this.item.uniqueId, type).forEach(x =>
        list.appendChild(this.#setSubItem(x, type))
      )
    );

    return list;
  }
}
