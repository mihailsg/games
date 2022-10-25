/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class BaseMoveConstantVelocity {
  constructor(ctx, w, h, x0, y0, vx0, vy0, color=[0, 0, 255]) {
    this.ctx = ctx
    this.W = w
    this.H = h
    this.x = x0
    this.y = y0
    this.vx = vx0
    this.vy = vy0
    this.color = color
  }

  move() {
    this.x += this.vx
    this.y += this.vy

    let xy = frame_bounds_rewind(this.W, this.H, this.x, this.y)
    this.x = xy[0]
    this.y = xy[1]

    this.draw()
  }

  draw() {

  }
}