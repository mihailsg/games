/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class Snake {
  constructor(ctx, w, h, x0, y0, lives, controls={}, name="", color="green", info_pos=[300, 20]) {
    this.ctx = ctx
    this.W = w
    this.H = h
    this.controls = controls

    this.name = name
    this.color = color
    this.info_pos = info_pos
    this.d = 10

    this.v = 1
    this.vx = 0
    this.vy = 0

    this.body = [[x0, y0], [x0 + this.d, y0]]

    this.ratio_move = new RatioRunner(10, this.move_body.bind(this), 1)

    this.lives = lives
    this.lives_bar = new VolumeBar(this.ctx, this.info_pos, this.lives, this.name + " животи", this.color)

    document.addEventListener('keydown', this.on_keydown.bind(this))
    // document.addEventListener('keyup', this.on_keyup.bind(this))
  }

  on_keydown(e) {
    if ('up' in this.controls && e.key == this.controls["up"]) {
      this.vx = 0
      this.vy = - this.v
      return
    }

    if ('down' in this.controls && e.key == this.controls["down"]) {
      this.vx = 0
      this.vy = this.v
      return
    }

    if ('left' in this.controls && e.key == this.controls["left"]) {
      this.vx = - this.v
      this.vy = 0
      return
    }

    if ('right' in this.controls && e.key == this.controls["right"]) {
      this.vx = this.v
      this.vy = 0
      return
    }

    if (e.key == 'o') {
      this.vx = 0
      this.vy = 0
      return
    }
  }

  on_keyup(e) {

  }

  check_next_move_collision(pn) {
    if (pn[0] < this.d / 2 || pn[0] > this.W - this.d / 2 || pn[1] < this.d || pn[1] > this.H - this.d / 2) {
      return true
    }

    for (let i = 0; i < this.body.length - 1; i++) {
      let d = Math.sqrt((pn[0] - this.body[i][0]) ** 2 + (pn[1] - this.body[i][1]) ** 2)
      if (d < this.d) { return true }
    }

    return false
  }

  move_body() {
    if (this.vx != 0 || this.vy != 0) {
      let p = this.body.slice(-1)[0]
      let pn = [p[0] + this.vx * this.d, p[1] + this.vy * this.d]

      if (this.check_next_move_collision(pn)) {
        this.lives -= 1
        this.vx = 0
        this.vy = 0
        return
      }

      this.body.push(pn)
      this.body.shift()
    }
  }

  move() {
    this.ratio_move.run()
    this.draw()
  }

  draw() {
    for (let i = 0; i < this.body.length - 1; i++) {
      draw_circle(this.ctx, this.body[i][0], this.body[i][1], this.d / 2, this.color, true)
    }

    draw_circle(this.ctx, this.body[this.body.length - 1][0], this.body[this.body.length - 1][1], this.d / 2 + 3, "#AA5511", true)

    this.lives_bar.draw(this.lives)
  }

  check_eat(apples) {
    let p = this.body.slice(-1)[0]
    let pn = [p[0] + this.vx * this.d, p[1] + this.vy * this.d]
    for (let i = 0; i < apples.length; i++) {
      let d = Math.sqrt((pn[0] - apples[i].x) ** 2 + (pn[1] - apples[i].y) ** 2)
      if (d < apples[i].r + this.d / 2) {
        this.body.push(pn)
        return i
      }
    }
    return -1
  }
}


class Apple {
  constructor(ctx, x0, y0) {
    this.ctx = ctx
    this.x = x0
    this.y = y0
    this.r = 5
  }

  draw() {
    draw_circle(this.ctx, this.x, this.y, this.r, "red", true)
  }
}
