/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class PopCornGame extends Game {
  constructor(canvas, w, h, lives) {
    super(canvas, w, h)

    this.lives = lives
    this.lives_bar = new VolumeBar(this.ctx, [100, 20], this.lives, "Мишо животи", "green")

    this.paddle = 0
    this.balls = 0

    this.help = new Help(this.ctx, this.W, this.H, 30, 30, 20)
    this.game_over = new GameOver(this.ctx, this.W, this.H, 14)

    this.help.show = true
    setTimeout(this.on_fps.bind(this), 1500)
  }

  on_fps() {
    let fps = this.fps_counter.fps
    this.fps_ratio = 120 / fps

    this.generate_balls()
    this.generate_bricks()

    this.paddle = new Paddle(
      this.ctx, this.W, this.H,
      this.W / 2, this.H - 20,
      this.fps_ratio,
      {
        "наляво": 'j',
        "надясно": 'k',
        "старт":  ' '
      }
    )

    this.help.controls([this.paddle], "Мишо")
    this.help.show = false

    document.addEventListener('keydown', this.on_keydown.bind(this))
  }

  generate_balls() {
    this.balls = [
      new Ball(
        this.ctx, this.W, this.H,
        this.W / 2 - 20, this.H - 40,
        this.fps_ratio
      ),
      new Ball(
        this.ctx, this.W, this.H,
        this.W / 2, this.H - 40,
        this.fps_ratio
      ),
      new Ball(
        this.ctx, this.W, this.H,
        this.W / 2 + 20, this.H - 40,
        this.fps_ratio
      )
    ]
  }

  generate_bricks() {
    this.bricks = []

    let bw = 80
    let bh = 40
    let o = 5

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < parseInt(this.W / bw); j++) {
        this.bricks.push(
          new Brick(this.ctx, this.W, this.H, (bw + o) * j + 2, 100 + (bh + o) * i, bw, bh, "green", Math.max(1, randint(1, 10) - 7))
        )
      }
    }

    // TODO: Consider index build here
  }

  on_keydown(e) {
    if (e.key === "Escape") {
      this.help.show = ! this.help.show
    }

    if (e.key === " ") {
      for (let i = 0; i < this.balls.length; i++) {
        if (this.balls[i].vx == 0 && this.balls[i].vy == 0) {
          this.balls[i].vx = randint(1, 3)
          this.balls[i].vy = - randint(3, 5)
        }
      }
      this.paddle.vx = 0
    }
  }

  draw() {
    if (this.game_over.show) {
      this.game_over.draw()
    } else if (this.help.show) {
      this.help.draw()
    } else {
      this.draw_game()
    }
  }

  draw_game() {
    for (let i = 0; i < this.bricks.length; i++) {
      this.bricks[i].draw()
    }

    this.paddle.move()

    let list_balls_remove = []

    for (let i = 0; i < this.balls.length; i++) {
      let flag_paddle_hit = false
      if (this.paddle.y - this.balls[i].y <= 1.5 * this.balls[i].r + this.balls[i].vy / this.balls[i].r) {
        if (Math.abs(this.balls[i].x - this.paddle.x) <= this.paddle.w / 2 + this.balls[i].r) {
          this.balls[i].vy = - this.balls[i].vy + 0.05 * this.paddle.vx
          this.balls[i].vx += 0.5 * (this.balls[i].x - this.paddle.x) / this.paddle.w + 0.1 * this.paddle.vx
          flag_paddle_hit = true
        }
      }

      if (this.balls[i].y > this.paddle.y && flag_paddle_hit == false) {
        list_balls_remove.push(i)
      }

      let h = false
      for (let j = 0; j < this.bricks.length; j++) {
        for (let k = 0; k < 2; k++) {
          if (this.balls[i].x >= this.bricks[j].sides[k][0][0] && this.balls[i].x <= this.bricks[j].sides[k][1][0]) {
            if (Math.abs(this.balls[i].y - this.bricks[j].sides[k][0][1]) <= this.balls[i].r) {
              if (this.balls[i].hit()) {
                this.balls[i].vy = - this.balls[i].vy
                this.bricks[j].hit()
                h = true
                break
              }
            }
          }
        }
        for (let k = 2; k < this.bricks[j].sides.length; k++) {
          if (this.balls[i].y >= this.bricks[j].sides[k][0][1] && this.balls[i].y <= this.bricks[j].sides[k][1][1]) {
            if (Math.abs(this.balls[i].x - this.bricks[j].sides[k][0][0]) <= this.balls[i].r) {
              if (this.balls[i].hit()) {
                this.balls[i].vx = - this.balls[i].vx
                this.bricks[j].hit()
                h = true
                break
              }
            }
          }
        }
        if (h) { break }
      }

      this.balls[i].move()
    }

    list_balls_remove = Array.from(new Set(list_balls_remove))
    for (let i = list_balls_remove.length - 1; i >= 0; i--) {
      this.balls.splice(list_balls_remove[i], 1)
    }

    for (let i = this.bricks.length - 1; i >= 0; i--) {
      if (! this.bricks[i].alive()) {
        this.bricks.splice(i, 1)
      }
    }

    if (this.balls.length == 0) {
      this.lives -= 1
      this.generate_balls()
    }
    if (this.lives == 0) {
      this.game_over.show = true
    }

    this.lives_bar.draw(this.lives)

    draw_text(this.ctx, "ESC за Помощ", 5, 20, 10, "white")
    draw_text(this.ctx, "FPS " + Math.round(this.fps_counter.fps), 5, 40, 10, "white")
  }
}


const query = window.location.search
const params = new URLSearchParams(query)

game = new PopCornGame(
              document.getElementsByTagName('canvas')[0],
              params.get("w") || 1200,
              params.get("h") || 800,
              params.get("lives") || 10
)
game.run()
