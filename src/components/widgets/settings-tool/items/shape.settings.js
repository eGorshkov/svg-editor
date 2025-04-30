import PrototypeSettings from './prototype.settings.js';

export default class ShapeSettings extends PrototypeSettings {
  constructor(item, config) {
    super(item, config);
  }

  createInformationBlock() {
    return [...super.createInformationBlock(), this.#createLinksList()].filter(Boolean);
  }

  getLabelElement() {
    const { type, order } = this.item;
    return super.getLabelElement(`Type: ${type.toCapitalizeCase()} | Order: ${order}`);
  }

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
