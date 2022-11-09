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

    this.ox = 0
    this.oy = 0
  }

  move() {
    this.x += this.vx
    this.y += this.vy

    let xy = frame_bounds_rewind(this.W, this.H, this.x, this.y, this.ox, this.oy)
    this.x = xy[0]
    this.y = xy[1]

    this.draw()
  }

  draw() {

  }
}


class RatioRunner {
  constructor(ratio, fn, count_inc=0) {
    this.ratio = ratio
    this.fn = fn
    this.count = 0
    this.count_inc = count_inc
  }

  set(count_inc) { this.count_inc = count_inc }

  run() {
    this.count += this.count_inc
    if (this.count >= this.ratio) {
      this.count = 0
      this.fn()
    }
  }
}