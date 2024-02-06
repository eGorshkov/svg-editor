/**
 * @implements {ILinkStore}
 */
export default class LinkStore {
  links = [];
  initFrom = {
    type: null,
    shape: null
  };
  from = null;

  #editor = null;

  constructor(editor) {
    this.#editor = editor;
  }

  init() {
    globalThis.LINK.set.subscribe(([currType, currShape]) => this.set(currType, currShape));
    globalThis.LINK.update.subscribe(shape => this.update(shape));
    globalThis.LINK.remove.subscribe(shape => this.remove(shape));
  }

  set(type, shape) {
    if (type === 'link') {
      debugger;
      const fromShape = this.#editor.find(shape.config.from.shapeId, 'uniqueId')
      const toShape = this.#editor.find(shape.config.to.shapeId, 'uniqueId')
      this.addLink({type: from.type, shape: fromShape}, {type: to.type, shape: toShape})
    }


    const curr = { type, shape };

    if (this.from?.type) {
      this.#editor.add('link', { from: {type: this.from.type, shapeId: this.from.shape.uniqueId}, to: {type: curr.type, shapeId: curr.shape.uniqueId} });
      const shape = this.#editor.last.last;
      this.addLink(curr, shape);
      this.from = { ...this.initFrom };
    } else {
      this.from = curr;
    }
  }

  update(shape) {
    ['to', 'from'].forEach(type =>
      shape.links[type].forEach(linkShape => {
        if (shape.type === 'link') return;

        linkShape.config[type].shape = shape;
        linkShape.draw(linkShape.template, linkShape.config);
      })
    );
  }

  remove(shape) {
    if (shape.type === 'link') return;

    ['to', 'from'].forEach(type =>
      shape.links[type].forEach(linkShape => {
        linkShape.kill();
        if (linkShape.parent.items.length === 0) linkShape.parent.kill();
      })
    );

    this.links = this.links.filter(
      x => x.fromShape.uniqueId !== shape.uniqueId && x.toShape.uniqueId !== shape.uniqueId
    );
  }

  addLink(curr, linkShape) {
    this.from.shape.links.from.push(linkShape);
    curr.shape.links.to.push(linkShape);

    this.links.push({
      fromType: this.from.type,
      fromShape: this.from.shape,
      toType: curr.type,
      toShape: curr.shape,
      linkShape
    });
  }

  removeLinkById(linkId) {
    const linkIndex = this.links.findIndex(x => x.linkShape.uniqueId === linkId),
      link = this.links[linkIndex];
    link.fromShape.links.from = link.fromShape.links.from.filter(x => x.uniqueId !== linkId);
    link.toShape.links.to = link.toShape.links.to.filter(x => x.uniqueId !== linkId);

    link.linkShape.kill();
    this.links.splice(linkIndex, 1);
  }

  getByShapeId(shapeId, type) {
    switch (type) {
      case 'from':
        return this.links.filter(x => x.fromShape.uniqueId === shapeId);
      case 'to':
        return this.links.filter(x => x.toShape.uniqueId === shapeId);
      default:
        return this.links.filter(x => x.fromShape.uniqueId === shapeId || x.toShape.uniqueId === shapeId);
    }
  }
}
