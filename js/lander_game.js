/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class LanderGame extends Game {
  constructor(canvas, w, h, lives) {
    super(canvas, w, h)

    this.rocket_lives = lives

    this.rockets = []
    this.rocks = []

    this.help = new Help(this.ctx, this.W, this.H, 30, 30, 20)
    this.game_over = new GameOver(this.ctx, this.W, this.H, 14)

    this.rocket_lives_bar = new VolumeBar(this.ctx, [100, 20], this.rocket_lives, "Мишо животи", "green")

    document.addEventListener('keydown', this.on_keydown.bind(this))

    this.help.show = true
    setTimeout(this.on_fps.bind(this), 1500)
  }

  on_fps() {
    let fps = this.fps_counter.fps

    this.rockets = [
      new Rocket(
        this.ctx, this.W, this.H, 50, 50, "#CCCC00", 10, 200, 20,
        this.fps_ratio,
        {
          "ускорение": {
            'u': 0.01, 'i': 0.03, 'o': 0.02
          },
          "завъртане": {
            'h': -1, 'j': -3, 'k': 3, 'l': 1
          }
        }
      ),
      new Rocket(
        this.ctx, this.W, this.H, 150, 150, "#00DDDD", 10, 200, 20,
        this.fps_ratio,
        {
          "ускорение": {
            'q': 0.01, 'w': 0.03, 'e': 0.02
          },
          "завъртане": {
            'a': -1, 's': -3, 'd': 3, 'f': 1
          }
        },
        "2", [450, 20]
      )
    ]

    for (let i = 0; i < this.rockets.length; i++) {
      this.rockets[i].set_gravity(0.0, 0.001)
    }

    this.help.controls(this.rockets, "Ракета")
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
    if (this.rocket_lives == 0) {
      this.game_over.show = true
    }

    this.rocket_lives_bar.draw(this.rocket_lives)

    for (let i = 0; i < this.rockets.length; i++) {
      this.rockets[i].move()
    }

    this.draw_landing_site()

    for (let i = 0; i < this.rockets.length; i++) {
      for (let j = 0; j < this.rocks.length; j++) {
        let d = Math.sqrt((this.rockets[i].x - this.rocks[j][0]) ** 2 + (this.rockets[i].y - this.rocks[j][1]) ** 2)
        if (d < this.rockets[i].l) {
          if (this.rockets[i].vy > 0.2) {
            console.log("Fail: ", this.rockets[i].vx, this.rockets[i].vy)
            this.rocket_lives -= 1
          }
          // else {
          //   console.log("SUCCESS: ", this.rockets[i].vx, this.rockets[i].vy)
          // }

          this.rockets[i].full_stop()
          break
        }
      }
    }

    draw_text(this.ctx, "ESC за Помощ", 5, 20, 10, "white")
    draw_text(this.ctx, "FPS " + Math.round(this.fps_counter.fps), 5, 40, 10, "white")
  }

  draw_landing_site() {
    let h = 100
    draw_rect(this.ctx, 0, this.H - h, this.W, h, "green", true)

    this.rocks
    for (let x = 0; x < this.W; x++) {
      this.rocks.push([x, this.H - h])
    }
  }
}


const query = window.location.search
const params = new URLSearchParams(query)

var lives = params.get("lives")

game = new LanderGame(
              document.getElementsByTagName('canvas')[0],
              params.get("w") || 1200,
              params.get("h") || 800,
              params.get("lives") || 10
)
game.run()
