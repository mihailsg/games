/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/

class Ball extends BaseMoveConstantVelocity {
  constructor(ctx, w, h, x0, y0, fps_ratio=1) {
    super(ctx, w, h, x0, y0, 0, 0, fps_ratio, "white")

    this.ratio_move = new RatioRunner(2 / this.fps_ratio, this.move_ball.bind(this), 1)

    this.r = 5
  }

  move_ball() {
    this.x += this.vx * this.fps_ratio
    this.y += this.vy * this.fps_ratio

    if (this.x < this.r || this.x > this.W - this.r) { this.vx = - this.vx }
    if (this.y < this.r || this.y > this.H - this.r) { this.vy = - this.vy }
  }

  move() {
    this.ratio_move.run()
    this.draw()
  }

  draw() {
    draw_circle(this.ctx, this.x, this.y, this.r, this.color, true)
  }
}