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

    this.x = this.W / 5
    this.y = this.H / 8
    this.dy = 0.1
    this.x0 = this.x
    this.y0 = this.y - 50

    this.show = false
  }

  draw() {
    for (let i = 0; i < this.top.length; i++) {
      draw_text(this.ctx, this.top[i], this.x0, this.y0 + i * this.size + 3, this.size + 3, "white")
    }

    for (let i = 0; i < this.txt.length; i++) {
      draw_text(this.ctx, this.txt[i], this.x, this.y + i * this.size + 3, this.size, "white")
    }

    this.y += this.dy
    if (this.y == this.y0 + 200 || this.y == this.y0) { this.dy = - this.dy }
  }
}