/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class Game {
  constructor(canvas, w, h, background_color="black") {
    this.W = w
    this.H = h
    this.background_color = background_color
    canvas.width = w
    canvas.height = h
    this.ctx = canvas.getContext('2d')
    this.ctx["BoundingClientRect"] = canvas.getBoundingClientRect()
  }

  clear() {
    this.ctx.clearRect(0, 0, this.W, this.H)
    this.ctx.rect(0, 0, this.W, this.H)
    this.ctx.fillStyle = this.background_color
    this.ctx.fill()
  }

  run() {
    this.clear()
    this.draw()
    requestAnimationFrame(this.run.bind(this))
  }

  draw() {

  }
}
