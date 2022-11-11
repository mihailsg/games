/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class SnakeGame extends Game {
  constructor(canvas, w, h, lives) {
    super(canvas, w, h)

    this.lives = lives
    this.vapples = 100

    this.snakes = []
    this.apples = []

    this.help = new Help(this.ctx, this.W, this.H, 30, 30, 20)
    this.game_over = new GameOver(this.ctx, this.W, this.H, 14)

    this.help.show = true
    setTimeout(this.on_fps.bind(this), 1500)
    document.addEventListener('keydown', this.on_keydown.bind(this))
  }

  on_fps() {
    let fps = this.fps_counter.fps
    this.fps_ratio = 120 / fps

    this.vapples = fps

    this.snakes = [
      new Snake(
        this.ctx, this.W, this.H,
        50, 50,
        this.lives,
        this.fps_ratio,
        {
          "нагоре": 'i',
          "надолу": 'm',
          "наляво": 'j',
          "надясно": 'k',
          "бързо": ' ',
        },
        "змия 1", "green",
        [250, 20]
      ),
      new Snake(
        this.ctx, this.W, this.H,
        150, 150,
        this.lives,
        this.fps_ratio,
        {
          "нагоре": 'w',
          "надолу": 'z',
          "наляво": 'a',
          "надясно": 's',
          "бързо": ' ',
        },
        "змия 2", "blue",
        [450, 20]
      )
    ]

    this.help.controls(this.snakes, "Змия")
    this.help.show = false
  }

  on_keydown(e) {
    if (e.key === "Escape") {
      this.help.show = ! this.help.show
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
    for (let i = 0; i < this.snakes.length; i++) {
      this.snakes[i].move()
      if (this.snakes[i].lives == 0) {
        this.game_over.show = true
      }
    }

    for (let i = 0; i < this.apples.length; i++) {
      this.apples[i].draw()
    }

    for (let i = 0; i < this.snakes.length; i++) {
      let j = this.snakes[i].check_eat(this.apples)
      if (j >= 0) {
        this.apples.splice(j, 1)
      }
    }

    if (randint(0, this.vapples) == 1) {
      this.apples.push(
        new Apple(this.ctx, randint(10, this.W - 10), randint(10, this.H - 10))
      )
    }

    draw_text(this.ctx, "ESC за Помощ", 5, 20, 10, "white")
    draw_text(this.ctx, "FPS " + Math.round(this.fps_counter.fps), 5, 40, 10, "white")
  }
}


const query = window.location.search
const params = new URLSearchParams(query)

var lives = params.get("lives")

game = new SnakeGame(
              document.getElementsByTagName('canvas')[0],
              params.get("w") || 1200,
              params.get("h") || 800,
              params.get("lives") || 10
)
game.run()
