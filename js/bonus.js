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
  
      this.angle = angle
  
      this.v = v
      this.vx = this.fps_ratio * this.v * Math.cos(to_radians(this.angle))
      this.vy = this.fps_ratio * this.v * Math.sin(to_radians(this.angle))
    }
    
    draw() {
      draw_rect(this.ctx, this.x, this.y, 50, 50, this.color, false, 3)
      draw_text(this.ctx, "+2", this.x + 5, this.y + 25, 20, this.color)
      draw_text(this.ctx, "Lasers", this.x + 5, this.y + 40, 12, this.color)
    }
  }