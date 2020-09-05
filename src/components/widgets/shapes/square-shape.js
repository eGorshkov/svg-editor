export function SquareShape(width, height) {
    const template = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    template.setAttribute('width', width ?? 80);
    template.setAttribute('height', height ?? 80);
    return template;
}