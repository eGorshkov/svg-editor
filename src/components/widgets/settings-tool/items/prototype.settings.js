import { SETTINGS_TOOLS } from '../tools/base.js';

/**
 * Класс PrototypeSettings — базовые настройки для фигур и слоёв.
 * Предоставляет методы для генерации UI-блоков настроек, навигации и управления порядком.
 */
export default class PrototypeSettings {
  /**
   * Текущий элемент (фигура или слой).
   * @type {IPrototype}
   * @private
   */
  #item = null;
  /**
   * Геттер для текущего элемента.
   * @returns {IPrototype}
   */
  get item() {
    return this.#item;
  }

  /**
   * Массив настроек.
   * @type {ISetting[]}
   * @private
   */
  #config = null;
  /**
   * Геттер для массива настроек.
   * @returns {ISetting[]}
   */
  get config() {
    return this.#config;
  }

  /**
   * Конструктор PrototypeSettings.
   * @param {IPrototype} item Элемент (фигура или слой)
   * @param {ISetting[]} config Массив настроек
   */
  constructor(item, config) {
    this.#item = item;
    this.#config = config || [];
  }

  /**
   * Приватный метод: создаёт кнопку.
   * @private
   * @param {string} title Текст
   * @param {boolean} disabled Отключена ли кнопка
   * @param {Function} cb Колбэк
   * @returns {HTMLElement} Кнопка
   */
  #createBtn(title, disabled, cb) {
    const btn = document.createElement('button');
    btn.innerText = title;
    btn.disabled = disabled;
    btn.addEventListener('click', cb);
    return btn;
  }

  /**
   * Приватный метод: создаёт разделительную линию.
   * @private
   * @returns {HTMLElement} Элемент hr
   */
  #getBorderLine() {
    const hr = document.createElement('hr');
    hr.style.width = '100%';
    return hr;
  }

  /**
   * Приватный метод: создаёт кнопки для изменения порядка и активного элемента.
   * @private
   * @param {Function} updateFn Функция обновления
   * @returns {Array} Массив кнопок
   */
  #getButtons(updateFn) {
    const orderTemplate = document.createElement('div'),
      changingTemplate = document.createElement('div');

    orderTemplate.style.display = changingTemplate.style.display = 'flex';
    orderTemplate.style.alignItems = changingTemplate.style.alignItems = 'center';

    this.#getChangingButtons().forEach(t => changingTemplate.appendChild(t));
    this.#getOrderButtons(updateFn).forEach(t => orderTemplate.appendChild(t));

    return [orderTemplate, this.#getBorderLine(), changingTemplate];
  }

  /**
   * Приватный метод: создаёт кнопки для изменения порядка элемента.
   * @private
   * @param {Function} updateFn Функция обновления
   * @returns {Array} Массив кнопок
   */
  #getOrderButtons(updateFn) {
    const addOrderTemplate = this.#createBtn(
        '+',
        this.item.parent.items.length - 1 === this.item.order,
        this.#changeOrder('next', updateFn, () => this.item.parent.items.length - 1 === this.item.order)
      ),
      removeOrderTemplate = this.#createBtn(
        '-',
        this.item.parent.get(0, 'order')?.uniqueId === this.item.uniqueId,
        this.#changeOrder('prev', updateFn, () => this.item.parent.get(0, 'order')?.uniqueId === this.item.uniqueId)
      ),
      frontOrderTemplate = this.#createBtn(
        'To front',
        addOrderTemplate.disabled && removeOrderTemplate.disabled,
        this.#changeOrder('front', updateFn, () => addOrderTemplate.disabled && removeOrderTemplate.disabled)
      ),
      backOrderTemplate = this.#createBtn(
        'To back',
        addOrderTemplate.disabled && removeOrderTemplate.disabled,
        this.#changeOrder('back', updateFn, () => addOrderTemplate.disabled && removeOrderTemplate.disabled)
      );

    return [addOrderTemplate, removeOrderTemplate, frontOrderTemplate, backOrderTemplate];
  }


  /**
   * Приватный метод: изменяет активный элемент.
   * @private
   * @param {string} by Направление
   * @param {Function} disableCheck Функция проверки
   * @returns {Function} Колбэк
   */
  #changeActiveItem(by, disableCheck) {
    return e => {
      this.item.deactivate();
      switch (by) {
        case 'parent':
          this.item.parent.activate();
          break;
        case 'next':
          this.item.parent.get(this.item.order + 1, 'order')?.activate();
          break;
        case 'prev':
          this.item.parent.get(this.item.order - 1, 'order')?.activate();
          break;
        case 'child':
          this.item.get(0, 'order')?.activate();
          break;
        default:
          break;
      }
      e.target.disabled = disableCheck();
    };
  }

    /**
   * Приватный метод: возвращает массив кнопок навигации.
   * @private
   * @returns {Array} Кнопки
   */
  #getChangingButtons() {
    const toParentTemplate = this.#createBtn(
        'To parent',
        this.item.parent.isEditor,
        this.#changeActiveItem('parent', () => this.item.parent.isEditor).bind(this)
      ),
      toNextNeighborTemplate = this.#createBtn(
        'To next neighbor',
        this.item.parent.last?.uniqueId === this.item.uniqueId,
        this.#changeActiveItem('next', () => this.item.parent.last?.uniqueId === this.item.uniqueId).bind(this)
      ),
      toPrevNeighborTemplate = this.#createBtn(
        'To prev neighbor',
        this.item.parent.items[0]?.uniqueId === this.item.uniqueId,
        this.#changeActiveItem('prev', () => this.item.parent.items[0]?.uniqueId === this.item.uniqueId).bind(this)
      ),
      toChildTemplate = this.#createBtn(
        'To first child',
        this.item.isShape,
        this.#changeActiveItem('child', () => this.item.isShape).bind(this)
      );

    return [toParentTemplate, toNextNeighborTemplate, toPrevNeighborTemplate, toChildTemplate];
  }

  /**
   * Приватный метод: изменяет порядок элемента.
   * @private
   * @param {string} by Направление
   * @param {Function} updateFn Функция обновления
   * @param {Function} disableCheck Функция проверки
   * @returns {Function} Колбэк
   */
  #changeOrder(by, updateFn, disableCheck) {
    return e => {
      switch (by) {
        case 'next':
          this.item.parent.replaceOrder(this.item.order, this.item.order + 1);
          break;
        case 'prev':
          this.item.parent.replaceOrder(this.item.order, this.item.order - 1);
          break;
        case 'front':
          this.item.parent.replaceOrder(this.item.order, this.item.parent.items.length - 1);
          break;
        case 'back':
          this.item.parent.replaceOrder(this.item.order, 0);
          break;
        default:
          break;
      }
      updateFn();
      e.target.disabled = disableCheck();
    };
  }

  /**
   * Приватный метод: создаёт экземпляр инструмента настройки.
   * @private
   * @param {ISetting} config Конфиг настройки
   * @returns {Object} Экземпляр инструмента
   */
  #create(config) {
    return new SETTINGS_TOOLS[config.type](config);
  }

  /**
   * Создаёт информационный блок (название, путь, кнопки).
   * @returns {Array} Массив элементов
   */
  createInformationBlock() {
    const containerTemplate = document.createElement('div');
    let label;
    const inputEl = document.createElement('input');

    label = document.createElement('label');
    label.style.display = 'flex';
    inputEl.addEventListener('change', e => (this.item.name = e.target.value));
    inputEl.value = this.item.name ?? this.item.__type.toUpperCase();
    label.appendChild(inputEl);
    label.append(' SETTINGS');

    containerTemplate.appendChild(label);

    let infoTemplate = this.getLabelElement();
    containerTemplate.appendChild(infoTemplate);

    const pathTemplate = document.createElement('p');

    this.item.getFullPath('uniqueId').forEach((id, i, arr) => {
      const isNotLast = i < arr.length - 1,
        btnEl = this.linkBtn(id);
      pathTemplate.append(`${isNotLast ? 'Layer' : 'Current'} (`);
      pathTemplate.appendChild(btnEl);
      pathTemplate.append(')');
      isNotLast && pathTemplate.append(' > ');
    });
    containerTemplate.appendChild(pathTemplate);

    return [containerTemplate, ...this.#getButtons(() => (infoTemplate = this.getLabelElement()))];
  }

  /**
   * Создаёт блок параметров (настройки).
   * @returns {HTMLElement} Контейнер с настройками
   */
  createParametersBlock() {
    const container = document.createElement('div');
    container.style.margin = '10px 0';
    this.config.map(tool => {
      const settingsTool = this.#create(tool);
      settingsTool.template.classList.add('tool__item');
      container.appendChild(settingsTool.template);
    });
    return container;
  }

  /**
   * Получает элемент с подписью.
   * @param {string} [text] Текст подписи
   * @returns {HTMLElement} Элемент p
   */
  getLabelElement(text) {
    const el = document.createElement('p');
    el.innerText = text;
    return el;
  }

  /**
   * Создаёт кнопку-ссылку для перехода к другому элементу.
   * @param {string} uniqueId Уникальный id
   * @returns {HTMLElement} Кнопка-ссылка
   */
  linkBtn(uniqueId) {
    const change = () => {
      if (this.item.uniqueId !== uniqueId) {
        this.item.deactivate();
        const el = this.item.getEditor().find(uniqueId, 'uniqueId');
        el?.activate();
      }
      btn.removeEventListener('click', change);
    };

    const btn = this.#createBtn(uniqueId, false, change);

    btn.style.background = btn.style.border = 'none';
    btn.style.padding = 0;
    btn.style.textDecoration = 'underline';
    btn.style.cursor = 'pointer';
    btn.style.color = 'royalblue';

    return btn;
  }
}
