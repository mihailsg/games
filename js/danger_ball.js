/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class DangerBall {
  constructor(ctx, W, H) {
    this.ctx = ctx
    this.W = W
    this.H = H

    this.x = 70
    this.y = 60
    this.r = 80

    this.vx = 0.5
    this.vy = 0.5
  }

  draw() {
    if (randint(0, 100) == 1) {
      this.vx += randuniform(-0.3, 0.3)
      this.vy += randuniform(-0.3, 0.3)
    }

    this.x = this.x + this.vx
    this.y = this.y + this.vy

    if (this.x <= 0) { this.x = this.W }
    if (this.x >= this.W) { this.x = 0 }
    if (this.y <= 0) { this.y = this.H }
    if (this.y >= this.H) { this.y = 0 }


    draw_circle(this.ctx, this.x, this.y, this.r, "red", true)
  }
}