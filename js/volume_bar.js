class VolumeBar {
  constructor(ctx, p1, max_vol, name, color) {
    this.ctx = ctx
    this.w = 100
    this.h = 10
    this.p1 = p1
    this.max_vol = max_vol
    this.name = name
    this.color = color

    this.p2 = [p1[0] + this.w, p1[1] + this.h]
  }

  draw(vol) {
    vol = Math.min(this.max_vol, vol)

    draw_text(this.ctx, this.name, this.p2[0] + 3, this.p2[1], 8, "black")
    draw_rect(this.ctx, this.p1[0], this.p1[1], this.w * vol / this.max_vol, this.h, this.color, true)
    draw_rect(this.ctx, this.p1[0], this.p1[1], this.w * vol / this.max_vol, this.h, "black")
  }
}