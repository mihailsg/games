class Game {
  constructor(canvas, w, h) {
    this.W = w;
    this.H = h;
    canvas.width = w;
    canvas.height = h;
    this.ctx = canvas.getContext('2d');
  }

  run() {
    this.clear();
    requestAnimationFrame(this.run.bind(this));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.W, this.H);
  }
}
