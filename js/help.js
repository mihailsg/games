/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


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
      "",
      "Add 1P (1 extra player)",
      "Weapon upgrade: Faster laser and 3 lasers at same time (2 additional from the wings).",
      "Other extras with limited lifespan during the game.",
      "Introduce gravity",
    ]
    this.text_scroll = new TextScroll(this.ctx, this.x + 300, this.y, this.left_side, this.size)

    this.show = false

    this.text_misho = new TextHorizontalScroll(this.ctx, 100, 400, 500, "Misho learn javascript", 14, 0.5)
  }

  draw() {
    for (let i = 0; i < this.txt.length; i++) {
      draw_text(this.ctx, this.txt[i], this.x, this.y + i * this.size + 3, this.size, "white")
    }

    this.text_scroll.draw()
    this.text_misho.draw()
  }
}