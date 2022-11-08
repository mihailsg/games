/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class Game {
  constructor(canvas, w, h) {
    this.W = w;
    this.H = h;
    canvas.width = w;
    canvas.height = h;
    this.ctx = canvas.getContext('2d');
    this.ctx["BoundingClientRect"] = canvas.getBoundingClientRect()
  }

  run() {
    this.clear();
    requestAnimationFrame(this.run.bind(this));
  }

  clear() {
    this.ctx.clearRect(0, 0, this.W, this.H);
  }
}
