export default function moveListener(startCb, moveCb, endCb) {
  let l = {
    start(e) {
      startCb && startCb(e);
      document.addEventListener('mousemove', l.move, true);
      document.addEventListener('mouseup', l.end, true);
    },
    move(e) {
      e.preventDefault();
      moveCb && moveCb(e);
    },
    end(e) {
      document.removeEventListener('mousemove', l.move, true);
      document.removeEventListener('mouseup', l.end, true);
      endCb && endCb(e);
    }
  };
  return l;
}