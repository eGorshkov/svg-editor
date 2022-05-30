import PrototypeSettings from './prototype.settings.js';

export default class ShapeSettings extends PrototypeSettings {
  constructor(item, config) {
    super(item, config);
  }

  createInformationBlock() {
    return [...super.createInformationBlock(), this.#createLinksList()];
  }

  getLabelElement() {
    const { type, order } = this.item;
    return super.getLabelElement(`Type: ${type.toCapitalizeCase()} | Order: ${order}`);
  }

  #createLinksList() {
    const list = document.createElement('div');

    const setSubItem = (link, type) => {
      const { linkShape, toType, toShape, fromType, fromShape } = link;
      const linkWith = type === 'from' ? toShape : fromShape;

      const el = document.createElement('div');
      const removeBtn = document.createElement('button');
      const linkShapeLink = this.linkBtn(linkShape.uniqueId);
      const linkWithLink = this.linkBtn(linkWith.uniqueId);

      removeBtn.innerText = 'Remove';
      removeBtn.addEventListener('click', () => globalThis.LINK_STORE.removeLinkById(linkShape.uniqueId));

      el.append('Link ');
      el.appendChild(linkShapeLink);
      el.append(type === 'from' ? ': To ' : ': From ');
      el.append(` ${fromType}-${toType} link`);
      el.appendChild(removeBtn);

      return el;
    };

    globalThis.LINK_STORE.getByShapeId(this.item.uniqueId, 'from').forEach(x =>
      list.appendChild(setSubItem(x, 'from'))
    );

    globalThis.LINK_STORE.getByShapeId(this.item.uniqueId, 'to').forEach(x => list.appendChild(setSubItem(x, 'to')));

    return list;
  }
}