class Help {
  constructor(ctx, w, h, x0, y0, txt, size=12) {
    this.ctx = ctx
    this.W = w
    this.H = h
    this.x = x0
    this.y = y0
    this.txt = txt
    this.size = size

    this.show = false
  }

  draw() {
    for (let i = 0; i < this.txt.length; i++) {
      draw_text(this.ctx, this.txt[i], this.x, this.y + i * this.size + 3, this.size, "white")
    }
  }
}