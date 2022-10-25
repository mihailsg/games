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
    this.asteroids = [1,2,3,4,5]
    // this.init_asteroids()
    this.asteroids_bar = new VolumeBar(this.ctx, [200, 40], this.asteroids.length * 2, "ASTEROIDS", "yellow")

    this.vrotate = 0

    document.addEventListener('keydown', this.on_keydown.bind(this))
  }

  run() {
    this.clear();

    this.rocket_lives_bar.draw(this.rocket_lives)
    this.asteroids_bar.draw(this.asteroids.length)

    this.rocket.rotate(this.vrotate)
    this.rocket.move()

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