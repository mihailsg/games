/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class SpaceAsteroids extends Game {
  constructor(canvas, w, h, rocket_lives=10) {
    super(canvas, w, h)

    this.rocket_lives = rocket_lives

    this.rocket = new Rocket(this.ctx, w, h, 50, 50, "blue", (5, 30), 10, 200, 20)
    this.rocket_lives_bar = new VolumeBar(this.ctx, [200, 20], this.rocket_lives, "LIVE", "green")

    this.asteroids_removed = 0
    this.asteroids = []
    this.init_asteroids()
    this.asteroids_bar = new VolumeBar(this.ctx, [200, 40], this.asteroids.length * 2, "ASTEROIDS", "yellow")

    this.vrotate = 0

    document.addEventListener('keydown', this.on_keydown.bind(this))
  }

  init_asteroids() {
    let dv = 1.1
    while(this.asteroids.length < 30) {
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
            r0, "black", 10
          )
        )
      }
    }
  }

  run() {
    this.clear();

    this.rocket_lives_bar.draw(this.rocket_lives)
    this.asteroids_bar.draw(this.asteroids.length)

    this.rocket.rotate(this.vrotate)
    this.rocket.move()

    for (let i = 0; i < this.asteroids.length; i++) {
      this.asteroids[i].move()
    }

    // Collisions between asteroids as pure elastic collision
    for (let i = 0; i < this.asteroids.length; i++) {
      for (let j = i + 1; j < this.asteroids.length; j++) {
        let d = Math.sqrt((this.asteroids[i].x - this.asteroids[j].x) ** 2 + (this.asteroids[i].y - this.asteroids[j].y) ** 2)
        if (d < this.asteroids[i].r + this.asteroids[j].r) {
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
    let laser_asteroid_collisions = this.rocket.laser_collisions(this.asteroids)
    let list_movable_collisions = laser_asteroid_collisions[0]
    let list_laser_collisions = laser_asteroid_collisions[1]

    for (let i = list_movable_collisions.length - 1; i >= 0; i--) {
      let asteroid = this.asteroids[list_movable_collisions[i]]
      let laser = this.rocket.lasers[list_laser_collisions[i]]
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
            "black", 10
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
            "black", 10
          )
        )
      }

      this.asteroids.splice(list_movable_collisions[i], 1)
      this.rocket.remove_laser(list_laser_collisions[i])
      this.asteroids_removed += 1
    }


    requestAnimationFrame(this.run.bind(this));
  }

  on_keydown(e) {
    if (e.key == 'u') { this.rocket.accelerate(0.1) }
    if (e.key == 'i') { this.rocket.accelerate(0.2) }
    if (e.key == 'o') { this.rocket.accelerate(0.3) }

    if (e.key == 'm') { this.rocket.fire() }

    if (e.key == 'j') { this.vrotate = -2 }
    if (e.key == 'k') { this.vrotate = 0 }
    if (e.key == 'l') { this.vrotate = 2 }
  }
}