/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class Bonus extends BaseMoveConstantVelocity {
  constructor(ctx, w, h, x0, y0, angle, v, fps_ratio, color) {
    super(ctx, w, h, x0, y0, 0, 0, fps_ratio, color)

    this.angle = angle

    this.v = v
    this.vx = this.fps_ratio * this.v * Math.cos(to_radians(this.angle))
    this.vy = this.fps_ratio * this.v * Math.sin(to_radians(this.angle))
  }

  draw() {
    draw_rect(this.ctx, this.x, this.y, 50, 50, this.color, false, 3)
  }
}


class BonusWeapon extends Bonus {
  constructor(ctx, w, h, x0, y0, angle, v, fps_ratio) {
    super(ctx, w, h, x0, y0, angle, v, fps_ratio, "red")

    this.l = 40
  }

  draw() {
    draw_rect(this.ctx, this.x, this.y, this.l * this.W_ratio, this.l * this.H_ratio, this.color, false, 3)
    draw_text(this.ctx, "+2", this.x + 5, this.y + 20 * this.W_ratio, 17 * this.W_ratio, this.color)
    draw_text(this.ctx, "LASER", this.x + 3, this.y + 32 * this.W_ratio, 11 * this.W_ratio, this.color)
  }

  name() {
    return "weapon"
  }

  value() {
    return 1
  }
}


class BonusFuel extends Bonus {
  constructor(ctx, w, h, x0, y0, angle, v, fps_ratio) {
    super(ctx, w, h, x0, y0, angle, v, fps_ratio, "blue")

    this.fuel = randint(2, 10)
    this.l = 35 + 10 / this.fuel
  }

  draw() {
    draw_rect(this.ctx, this.x, this.y, this.l * this.W_ratio, this.l * this.H_ratio, this.color, false, 3)
    draw_text(this.ctx, "+" + this.fuel, this.x + 5, this.y + 20 * this.W_ratio, 17 * this.W_ratio, this.color)
    draw_text(this.ctx, "FUEL", this.x + 3, this.y + 32 * this.W_ratio, 11 * this.W_ratio, this.color)
  }

  name() {
    return "fuel"
  }

  value() {
    return this.fuel
  }
}