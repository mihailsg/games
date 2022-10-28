class Help {
  constructor(ctx, w, h, x0, y0, txt, size=12) {
    this.ctx = ctx
    this.W = w
    this.H = h
    this.x = x0
    this.y = y0
    this.txt = txt
    this.size = size

    this.left_side = [
      "Misho Georgiev NPMG school project game",
      "Next ideas:"
    ]

    this.show = false
  }

  draw() {
    for (let i = 0; i < this.txt.length; i++) {
      draw_text(this.ctx, this.txt[i], this.x, this.y + i * this.size + 3, this.size, "white")
    }

    for (let i = 0; i < this.left_side.length; i++) {
      draw_text(this.ctx, this.left_side[i], this.x + 300, this.y + i * this.size + 3, this.size, "white")
    }
  }
}