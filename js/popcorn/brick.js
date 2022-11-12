/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/

class Brick {
  constructor(ctx, W, H, x0, y0, w, h, color="green", count_strikes=1) {
    this.ctx = ctx
    this.W = W
    this.H = H
    this.color = color

    this.x = x0
    this.y = y0
    this.w = w
    this.h = h

    this.count_strikes = count_strikes
  }

  draw() {
    draw_rect(this.ctx, this.x, this.y, this.w, this.h, this.color, false)
    draw_text(this.ctx, this.count_strikes, this.x + 5, this.y + this.h - 2, 10, "white")
  }
}
