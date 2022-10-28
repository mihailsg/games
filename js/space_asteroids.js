/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class SpaceAsteroids extends Game {
  constructor(canvas, w, h, rocket_lives=10, asteroids_count=30) {
    super(canvas, w, h)

    this.rocket_lives = rocket_lives
    this.asteroids_count = asteroids_count

    this.rocket_controls={
      "fire": 'm',
      "accelerate": {
        'u': 0.01, 'i': 0.02, 'o': 0.03
      },
      "rotate": {
        'j': -2, 'k': 0, 'l': 2
      }
    }

    this.rockets = [
      new Rocket(this.ctx, w, h, 50, 50, "#CCCC00", 10, 200, 20, this.rocket_controls),
      new Rocket(
        this.ctx, w, h, 150, 150, "#00DDDD", 10, 200, 20,
        {
          "fire": 'x',
          "accelerate": {'w': 0.01},
          "rotate": {'a': -1, 's': 0, 'd': 1}
        },
        "2", [450, 20]
      )
    ]
    this.rocket_lives_bar = new VolumeBar(this.ctx, [100, 20], this.rocket_lives, "MISHO lives", "green")

    this.asteroids_removed = 0
    this.asteroids = []
    this.init_asteroids()
    this.asteroids_bar = new VolumeBar(this.ctx, [100, 40], this.asteroids.length * 2, "ASTEROIDS", "yellow")

    this.help_text = ["HELP", ""]
    for (let i = 0; i < this.rockets.length; i++) {
      this.help_text.push("Rocket " + i)
      for (const [action, action_controls] of Object.entries(this.rockets[i].controls)) {
        if (action_controls.constructor == Object) {
          for (const [key, value] of Object.entries(action_controls)) {
            this.help_text.push("[" + key + "] " + action + " with " + value)
          }
        } else {
          this.help_text.push("[" + action_controls + "] " + action)
        }
      }
      this.help_text.push("")
    }
    this.help = new Help(this.ctx, this.W, this.H, 30, 30, this.help_text, 20)
    this.game_over = new GameOver(this.ctx, this.W, this.H, 14)

    document.addEventListener('keydown', this.on_keydown.bind(this))
  }

  on_keydown(e) {
    if (e.key === "Escape") {
      this.help.show = ! this.help.show
    }
  }

  init_asteroids() {
    let dv = 1.1
    while(this.asteroids.length < this.asteroids_count) {
      let x0 = randint(200, this.W)
      let y0 = randint(200, this.H)
      let r0 = randint(5, 100)
      let is_usable = true
      for (let i = 0; i < this.asteroids.length; i++) {
        let asteroid = this.asteroids[i]
        let d = Math.sqrt((asteroid.x - x0) ** 2 + (asteroid.y - y0) ** 2)
        if (d < (asteroid.r + r0) * 1.2) {
          is_usable = false
          break
        }
      }

      if (is_usable) {
        this.asteroids.push(
          new Asteroid(
            this.ctx, this.W, this.H,
            x0, y0,
            randuniform(-dv, dv),
            randuniform(-dv, dv),
            r0, "white", 10
          )
        )
      }
    }
  }

  clear() {
    super.clear()
    this.ctx.rect(0, 0, this.W, this.H);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
  }

  run() {
    this.clear()

    if (this.game_over.show) {
      this.game_over.draw()
    } else if (this.help.show) {
      this.help.draw()
    } else {
      this.draw()
    }

    requestAnimationFrame(this.run.bind(this));
  }

  draw() {
    this.rocket_lives_bar.draw(this.rocket_lives)
    this.asteroids_bar.draw(this.asteroids.length)

    for (let i = 0; i < this.rockets.length; i++) {
      this.rockets[i].move()
    }

    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].move()
    }

    // Collisions between asteroids as pure elastic collision
    for (let i = 0; i < this.asteroids.length; i++) {
      for (let j = i + 1; j < this.asteroids.length; j++) {
        let d = Math.sqrt((this.asteroids[i].x - this.asteroids[j].x) ** 2 + (this.asteroids[i].y - this.asteroids[j].y) ** 2)
        if (d <= this.asteroids[i].r + this.asteroids[j].r) {
          let vx1 = ((this.asteroids[i].r - this.asteroids[j].r) * this.asteroids[i].vx + 2 * this.asteroids[j].r * this.asteroids[j].vx) / (this.asteroids[i].r + this.asteroids[j].r)
          let vy1 = ((this.asteroids[i].r - this.asteroids[j].r) * this.asteroids[i].vy + 2 * this.asteroids[j].r * this.asteroids[j].vy) / (this.asteroids[i].r + this.asteroids[j].r)
          let vx2 = ((this.asteroids[j].r - this.asteroids[i].r) * this.asteroids[j].vx + 2 * this.asteroids[i].r * this.asteroids[i].vx) / (this.asteroids[i].r + this.asteroids[j].r)
          let vy2 = ((this.asteroids[j].r - this.asteroids[i].r) * this.asteroids[j].vy + 2 * this.asteroids[i].r * this.asteroids[i].vy) / (this.asteroids[i].r + this.asteroids[j].r)
          this.asteroids[i].vx = vx1
          this.asteroids[i].vy = vy1
          this.asteroids[j].vx = vx2
          this.asteroids[j].vy = vy2
        }
      }
    }

    let asteroids_to_remove = []
    let laser_asteroid_collisions = this.rockets[0].laser_collisions(this.asteroids)
    let list_movable_collisions = laser_asteroid_collisions[0]
    let list_laser_collisions = laser_asteroid_collisions[1]

    for (let i = list_movable_collisions.length - 1; i >= 0; i--) {
      let asteroid = this.asteroids[list_movable_collisions[i]]
      let laser = this.rockets[0].lasers[list_laser_collisions[i]]
      if (asteroid.r > 10) {
        let angle1 = to_radians(laser.angle + 90)
        let angle2 = to_radians(laser.angle - 90)
        this.asteroids.push(
          new Asteroid(
            this.ctx, this.W, this.H,
            asteroid.x + Math.cos(angle1) * (asteroid.r / 1.9),
            asteroid.y + Math.sin(angle1) * (asteroid.r / 1.9),
            Math.cos(angle1) * asteroid.vx,
            Math.sin(angle1) * asteroid.vy,
            asteroid.r / 2,
            "white", 10
          )
        )
        this.asteroids.push(
          new Asteroid(
            this.ctx, this.W, this.H,
            asteroid.x + Math.cos(angle2) * (asteroid.r / 1.9),
            asteroid.y + Math.sin(angle2) * (asteroid.r / 1.9),
            Math.cos(angle2) * asteroid.vx,
            Math.sin(angle2) * asteroid.vy,
            asteroid.r / 2,
            "white", 10
          )
        )
      }

      this.asteroids.splice(list_movable_collisions[i], 1)
      this.rockets[0].remove_laser(list_laser_collisions[i])
      this.asteroids_removed += 1
    }

    for (let i = 0; i < this.asteroids.length; i++) {
      let asteroid = this.asteroids[i]
      if (this.rockets[0].check_collision(asteroid.x, asteroid.y, asteroid.r)) {
        this.asteroids.splice(i, 1)
        this.rockets[0] = new RocketExplosion(this.ctx, this.W, this.H, this.rockets[0].x, this.rockets[0].y)
        this.rocket_lives -= 1
        break
      }
    }

    if (!this.rockets[0].alive()) {
      if (this.rocket_lives > 0) {
        this.rockets[0] = new Rocket(this.ctx, this.W, this.H, this.rockets[0].x, this.rockets[0].y, "#CCCC00", 10, this.asteroids.length * 10, 20, this.rocket_controls)
      } else {
        this.game_over.show = true
      }
    }

    let txt = "Asteroids " + this.asteroids_removed + " / " +  this.asteroids.length
    if (this.asteroids.length == 0 && this.rocket_lives > 0) {
      this.rockets[0] = new Rocket(this.ctx, this.W, this.H, this.rockets[0].x, this.rockets[0].y, "#CCCC00", 50, 200, 50, this.rocket_controls)
      txt = "Winner"
      this.rocket_lives = -1
    }
    draw_text(this.ctx, "ESC for HELP", 5, 20, 10, "white")
    draw_text(this.ctx, txt, 5, 40, 10, "white")
  }
}