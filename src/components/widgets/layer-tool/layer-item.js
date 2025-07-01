/**
 * Класс LayerItem — элемент панели слоёв (слой или фигура).
 */
export default class LayerItem {
  template = null;
  /**
   * @type {ILayer | IShape}
   */
  #item = null;
  /**
   * @type {IEditor}
   */
  editor = null;
  #widget = null;

  #bindedDragstart = this.#dragstartHandler.bind(this);
  #bindedDragleave = this.#dragleaveHandler.bind(this);
  #bindedDragover = this.#dragoverHandler.bind(this);
  #bindedDrop = this.#dropHandler.bind(this);
  #bindedDblClick = this.dblClick.bind(this);

  draw = null;
  template = null;

  /**
   * Конструктор LayerItem.
   * @param {ILayer|IShape} item Слой или фигура
   * @param {LayerTool} widget Родительский виджет
   */
  constructor(item, widget) {
    this.#item = item;
    this.#widget = widget;
    this.#init();
  }

  /**
   * Удаляет все обработчики событий и очищает элемент.
   */
  kill() {
    this.template.removeEventListener('dragstart', this.#bindedDragstart);
    this.template.removeEventListener('dragover', this.#bindedDragover);
    this.template.removeEventListener('drop', this.#bindedDrop);
    this.template.removeEventListener('dblclick', this.#bindedDblClick);
  }

  /**
   * Инициализация шаблона элемента.
   * @private
   */
  #init() {
    this.template = document.createElement('button');
    this.template.classList.add('layer-tool-item');

    this.template.setAttribute('draggable', 'true');
    this.template.setAttribute('type', this.#item.__type);
    this.template.setAttribute('order', this.#item.fullOrder);

    this.template.addEventListener('dragstart', this.#bindedDragstart);
    this.template.addEventListener('dragover', this.#bindedDragover);
    this.template.addEventListener('dragleave', this.#bindedDragleave);
    this.template.addEventListener('drop', this.#bindedDrop);
    this.template.addEventListener('dblclick', this.#bindedDblClick);

    this.#item.isLayer ? this.#setLayer() : this.#setShape();
    this.template.appendChild(this.#createWrapButton());
    this.template.appendChild(this.#createCopyButton());
    this.template.appendChild(this.#createKillButton());

    return this.template;
  }

  /**
   * Устанавливает отображение для слоя.
   * @private
   */
  #setLayer() {
    this.template.appendChild(
      this.#createTextElement(
        '↳ ' + (this.#item.name ?? 'Layer') + '\norder:' + this.#item.fullOrder + '\nid: ' + this.#item.uniqueId
      )
    );
  }

  /**
   * Устанавливает отображение для фигуры.
   * @private
   */
  #setShape() {
    this.template.appendChild(
      this.#createTextElement(
        (this.#item.name ?? 'Shape') + ' \norder: ' + this.#item.fullOrder + '\nid: ' + this.#item.uniqueId
      )
    );
  }

  /**
   * Создаёт текстовый элемент для отображения информации.
   * @private
   * @param {string} text Текст
   * @returns {HTMLElement} Элемент p
   */
  #createTextElement(text) {
    const textEl = document.createElement('p');
    textEl.style.flex = '1';
    textEl.style.margin = '0';
    textEl.innerText = text;
    return textEl;
  }

  /**
   * Создаёт кнопку удаления.
   * @private
   * @returns {HTMLElement} Кнопка
   */
  #createKillButton() {
    const killButton = document.createElement('button');
    killButton.classList.add('layer-tool-kill-button');
    killButton.innerText = '🗑';
    killButton.addEventListener('click', () => {
      this.#item.isShape ? this.#item.kill() : this.#item.killAll();
      this.#widget.draw();
    });
    return killButton;
  }

  /**
   * Создаёт кнопку-обёртку.
   * @private
   * @returns {HTMLElement} Кнопка
   */
  #createWrapButton() {
    const wrapButton = document.createElement('button');
    wrapButton.classList.add('layer-tool-kill-button');
    wrapButton.innerText = '❒';
    wrapButton.addEventListener('click', () => {
      const parent = this.#item.parent;
      const orders = this.#item.orders;
      parent.load([{ order: this.#item.parent.items.length, items: [{ type: '__wrap' }] }]);
      const layer = this.#item.parent.last;

      this.#replaceItems(this.#item.orders, layer.last.orders);
      parent.reorder();
      this.#replaceItems(layer.orders, orders);
      layer.items[0].kill();

      parent.items.sort((a, b) => a.order - b.order);
      this.#widget.draw();
    });
    return wrapButton;
  }

  /**
   * Создаёт кнопку копирования.
   * @private
   * @returns {HTMLElement} Кнопка
   */
  #createCopyButton() {
    const copyButton = document.createElement('button');
    copyButton.classList.add('layer-tool-copy-button');
    copyButton.innerText = '©';
    copyButton.addEventListener('click', () => {
      let newItem;
      const links = [];
      const config = structuredClone(this.#item.getConfiguration());
      const duplicate = this.#duplicateConfiguration(config, links);
      this.#item.parent.load([duplicate]);
      this.#item.parent.reorder();
      this.#widget.draw();

      if (this.#item.orders.length === 1) newItem = this.#item.parent.last;
      else
        this.#item.orders.forEach((order, i, arr) => {
          newItem = i === arr.length - 1 ? newItem.last : (newItem ?? this.#item.getEditor()).get(order, 'order');
        });

      links.length && this.#item.isLayer ? this.#linkNewLayer(newItem, links) : this.#linkNewShape(newItem, links);

      this.#item.parent.reorder();
      this.#widget.draw();
    });
    return copyButton;
  }

  /**
   * Линкует новые фигуры после копирования.
   * @private
   * @param {IShape} shape Новая фигура
   * @param {Array} links Ссылки
   */
  #linkNewShape(shape, links) {
    links.forEach(link => {
      const donorShape = this.#item.orders.every((o, i) => o === link.fromShape.orders[i])
        ? link.fromShape
        : link.toShape;
      const fromShape = link.fromShape.uniqueId === donorShape.uniqueId ? shape : link.fromShape;
      const toShape = link.fromShape.uniqueId === donorShape.uniqueId ? link.toShape : shape;

      globalThis.LINK.set.next([link.fromType, fromShape]);
      globalThis.LINK.set.next([link.toType, toShape]);
    });
  }

  /**
   * Линкует новые слои после копирования.
   * @private
   * @param {ILayer} layer Новый слой
   * @param {Array} links Ссылки
   */
  #linkNewLayer(layer, links) {
    links.forEach(link => {
      const lf = this.#item.orders.every((o, i) => o === link.fromShape.orders[i]) && layer;
      const lt = this.#item.orders.every((o, i) => o === link.toShape.orders[i]) && layer;

      const fromShape = lf ? lf.get(link.fromShape.orders.slice(lf.orders.length), 'order') : link.fromShape;
      const toShape = lt ? lt.get(link.toShape.orders.slice(lt.orders.length), 'order') : link.toShape;

      globalThis.LINK.set.next([link.fromType, fromShape]);
      globalThis.LINK.set.next([link.toType, toShape]);
    });
  }

  /**
   * Дублирует конфигурацию элемента.
   * @private
   * @param {Object} configuration Конфигурация
   * @param {Array} links Ссылки
   * @returns {Object} Новая конфигурация
   */
  #duplicateConfiguration(configuration, links) {
    if (configuration.items) {
      const items = configuration.items.reduce((acc, x) => [...acc, this.#duplicateConfiguration(x, links)], []);
      return { ...configuration, items };
    }
    links.push(...globalThis.LINK_STORE.getByShapeId(configuration.uniqueId));
    configuration.uniqueId = null;
    configuration.config.x += 10;
    configuration.config.y += 10;
    return configuration;
  }

  /**
   * Обработчик начала drag&drop.
   * @private
   * @param {DragEvent} ev Событие
   */
  #dragstartHandler(ev) {
    ev.dataTransfer.dropEffect = 'copy';
    const orders = this.#splitOrderFromTemplate(ev.target);
    ev.dataTransfer.setData(
      'text/plain',
      JSON.stringify({
        type: this.#getType(ev.target),
        orders
      })
    );
  }

  /**
   * Обработчик dragover.
   * @private
   * @param {DragEvent} ev Событие
   */
  #dragoverHandler(ev) {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    ev.target.style.border = '1px solid tomato';
  }

  /**
   * Обработчик dragleave.
   * @private
   * @param {DragEvent} ev Событие
   */
  #dragleaveHandler(ev) {
    ev.preventDefault();
    ev.target.style.border = '1px dashed rgb(0 0 0 / 30%)';
  }

  /**
   * Обработчик drop.
   * @private
   * @param {DragEvent} ev Событие
   */
  #dropHandler(ev) {
    ev.preventDefault();
    const targetOrders = this.#splitOrderFromTemplate(ev.target);
    const source = JSON.parse(ev.dataTransfer.getData('text/plain'));
    this.#replaceItems(source.orders, targetOrders);
  }

  /**
   * Обработчик двойного клика по элементу.
   * @param {Event} ev Событие
   */
  dblClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    const type = this.#getType(ev.target);
    const orders = this.#splitOrderFromTemplate(ev.target);

    switch (type) {
      case 'shape':
      case 'layer':
        globalThis.ACTIVE_ITEM_SUBJECT.getValue()?.deactivate();
        this.#widget.editor.get(orders, 'order')?.activate();
        break;
      default:
        break;
    }
  }

  /**
   * Заменяет элементы между слоями/фигурами.
   * @private
   * @param {Array} sourceOrders Путь источника
   * @param {Array} targetOrders Путь цели
   */
  #replaceItems(sourceOrders, targetOrders) {
    const SOURCE = this.#widget.editor.get(sourceOrders, 'order');
    const TARGET = this.#widget.editor.get(targetOrders, 'order');

    if (!SOURCE || !TARGET) {
      console.error('Not found source or target item', { SOURCE, TARGET });
      return;
    }

    if (this.#isInSameLayer(sourceOrders, targetOrders)) {
      TARGET.parent.replaceOrder.call(
        TARGET.parent,
        sourceOrders[sourceOrders.length - 1],
        targetOrders[targetOrders.length - 1]
      );
    } else {
      const IS_SOURCE_SHAPE_WAS_ACTIVE = SOURCE.isShape && SOURCE.active;
      const PARENT_LAYER = TARGET.parent.isEditor ? TARGET : TARGET.parent;
      const LINKS = SOURCE.isLayer
        ? SOURCE.shapes.flatMap(shape => [...shape.links.from, ...shape.links.to])
        : [SOURCE.links.from, SOURCE.links.to].flat();
      this.#changePosition(SOURCE, PARENT_LAYER, targetOrders[targetOrders.length - 1], LINKS);
      this.#reactivateShape(SOURCE, PARENT_LAYER, IS_SOURCE_SHAPE_WAS_ACTIVE, LINKS);
    }
  }

  #isInSameLayer(sourceOrders, targetOrders) {
    return (
      sourceOrders.slice(0, sourceOrders.length - 1).toString() ===
      targetOrders.slice(0, targetOrders.length - 1).toString()
    );
  }

  #changePosition(source, parentLayer, targetLastOrder, links) {
    source.isLayer && links.forEach(link => globalThis.LINK_STORE.removeLinkById(link.uniqueId));
    source.kill();
    source.order = parentLayer.items.length;

    parentLayer.load([source]);
    parentLayer.replaceOrder(parentLayer.items.length - 1, targetLastOrder);
  }

  #reactivateShape(source, parentLayer, isSourceShapeWasActive, LINKS) {
    if (source.isLayer) {
      const ACTIVE_SHAPE = parentLayer.get(source.uniqueId)?.find(true, 'active');
      if (ACTIVE_SHAPE) {
        globalThis.ACTIVE_ITEM_SUBJECT.getValue()?.deactivate();
        ACTIVE_SHAPE.activate();
      }
    }

    if (isSourceShapeWasActive) {
      parentLayer.get(source.uniqueId).activate();
    }

    if (LINKS?.length) {
      LINKS.forEach(link => {
        globalThis.EDITOR.load([
          {
            order: globalThis.EDITOR.items.length,
            items: [link]
          }
        ]);
        globalThis.LINK.set.next(['link', globalThis.EDITOR.last.last]);
      });
    }
  }

  #getType(template) {
    if (!template.getAttribute('type')) return this.#getType(template.parentElement);
    return template.getAttribute('type');
  }

  #splitOrderFromTemplate(template) {
    if (!template.getAttribute('order')) return this.#splitOrderFromTemplate(template.parentElement);
    return template.getAttribute('order').split('-').map(Number);
  }
}
