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
      "Мишо Георгиев НПМГ училищен проект-игра",
      "Управление на ракетата при липса на гравитация и триене.",
      "Лимит на гориво и лазер.",
      "",
      "Идеи за следващи допълнения",
      "1P: (1 допълнителен играч)",
      "F: зареждане на гориво",
      "L: зареждане на лазера",
      "1WS: по-бърз лазер",
      "3W: допълнителни 2 лазера на всяко крило (общо 3 лазера)",
    ]
    this.text_scroll = new TextScroll(this.ctx, this.x + 300, this.y, this.left_side, this.size)

    this.show = false

    this.text_misho = new TextHorizontalScroll(this.ctx, 100, 400, 500, "Мишо учи javascript", 32, 0.5)
  }

  draw() {
    for (let i = 0; i < this.txt.length; i++) {
      draw_text(this.ctx, this.txt[i], this.x, this.y + i * this.size + 3, this.size, "white")
    }

    this.text_scroll.draw()
    this.text_misho.draw()
  }
}