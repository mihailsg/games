/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class GameOver {
  constructor(ctx, w, h, size=10) {
    this.ctx = ctx
    this.W = w
    this.H = h
    this.size = size

    this.top = [
      "GAME OVER"
    ]

    this.txt = [
      "Misho Georgiev 5th grade NPMG school project game",
      "with the help of Stan Georgiev", "", "",
      "Math: angle sin/cos, square root, circles, 2 points euclidean distance",
      "Physics: space flying, elastic collision",
      "Programming: variables, loops, conditions, classes",
      "CS: improve collision detection using algorythms with lower time complexity",
      "", "",
      "Add 1P (1 extra player)",
      "Weapon upgrade: Faster laser and 3 lasers at same time (2 additional from the wings).",
      "Other extras with limited lifespan during the game.",
      "Introduce gravity",
    ]

    this.x = this.W / 6
    this.y = this.H / 8

    this.text_scroll = new TextScroll(ctx, this.x, this.y + 50, this.txt, this.size)

    this.show = false
  }

  draw() {
    let size = 40
    for (let i = 0; i < this.top.length; i++) {
      draw_text(this.ctx, this.top[i], this.x, this.y + i * size + 3, size, "#EE0000")
    }

    this.text_scroll.draw()
  }
}