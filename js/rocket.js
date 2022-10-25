/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/

class RocketBase extends BaseMoveConstantVelocity {
  constructor(ctx, w, h, x0, y0) {
    super(ctx, w, h, x0, y0, 0, 0, "blue")
    this.l = 10000000000
    this.angle = 0
  }

  check_collision(x, y, r) {
    return False
  }

  rotate(angle) {
    this.angle += angle
  }

  accelerate(a) {}

  fire() {}

  alive() {
    return True
  }

  laser_positions() {
    return []
  }
}

class Rocket extends RocketBase {
  constructor(ctx, w, h, x0=0, y0=0, color="blue", txt_pos=[5, 20], l=10, laser_count=100, fuel=20) {
    super(ctx, w, h, x0, y0)
    this.color = color
    this.txt_pos = txt_pos
    this.l = l

    this.thruster_default = 30
    this.thruster = 0
    this.fuel = fuel

    this.a = 0
    this.ax = 0
    this.ay = 0

    this.vx = 0
    this.vy = 0

    this.laser_count = laser_count
    this.lasers = []

    this.fuel_bar = new VolumeBar(this.ctx, [400, 20], this.fuel, "FUEL", "blue")
    this.laser_bar = new VolumeBar(this.ctx, [400, 50], this.laser_count, "LASER", "red")
  }

  accelerate(a) {
    if (this.fuel < a) { a = this.fuel }
    this.fuel -= a

    let angle_radians = to_radians(this.angle)
    this.ax = a * Math.cos(angle_radians)
    this.ay = a * Math.sin(angle_radians)
    this.a = a

    this.vx += this.ax
    this.vy += this.ay

    this.thruster = this.thruster_default
  }

  draw() {
    let angle_radians = to_radians(this.angle)
    let p0 = [this.x, this.y]
    let p1 = [this.x + this.l * Math.cos(angle_radians), this.y + this.l * Math.sin(angle_radians)]
    let p2 = [this.x - this.l * Math.cos(angle_radians), this.y - this.l * Math.sin(angle_radians)]
    let pr = line_perpendicular(p1, p2, this.l)
    let p3 = pr[0]
    let p4 = pr[1]

    draw_line(this.ctx, p1, p2, this.color, 2)
    draw_line(this.ctx, p3, p1, "green", 3)
    draw_line(this.ctx, p4, p1, "red", 3)
    draw_line(this.ctx, p3, p0, this.color, 2)
    draw_line(this.ctx, p4, p0, this.color, 2)

    if (this.thruster > 0) {
      let l = this.a * 200
      let p1 = [this.x - this.l * Math.cos(angle_radians), this.y - this.l * Math.sin(angle_radians)]
      let da = 0.3
      let p2 = [p1[0] - l * Math.cos(angle_radians - da), p1[1] - l * Math.sin(angle_radians - da)]
      let p3 = [p1[0] - l * Math.cos(angle_radians + da), p1[1] - l * Math.sin(angle_radians + da)]
      draw_contours(this.ctx, [p1, p2, p3], "red", 1, true)
      this.thruster -= 1
    }

    // txt = "V ({},{}) A[{}]".format(round(this.vx, 3), round(this.vy, 3), this.angle)

    this.move_lasers()

    this.fuel_bar.draw(this.fuel)
    this.laser_bar.draw(this.laser_count)
  }

  move_lasers() {
    let lasers_to_remove = []
    for (let i = 0; i < this.lasers.length; i++) {
      let laser = this.lasers[i];
      if (! laser.move()) { lasers_to_remove.push(i) }
    }
    for (let i = 0; i < lasers_to_remove.length; i++) {
      this.remove_laser(i)
    }
  }

  fire() {
    if (this.laser_count > 0) {
      this.laser_count -= 1;
      this.lasers.push(new Laser(this.ctx, this.W, this.H, this.x, this.y, this.angle))
    }
  }

  laser_positions() {
    let positions = []
    for (let i = 0; i < this.lasers.length; i++) {
      positions.push([this.lasers[i].p1, this.lasers[i].p2, this.lasers[i].angle])
    }
    return positions
  }

  laser_collisions(list_movables) {
    let list_movable_collisions = []
    let list_laser_collisions = []
    for (let i = 0; i < list_movables.length; i++) {
      for (let j = 0; j < this.lasers.length; j++) {
        if (j in list_laser_collisions) { continue }

        let d1 = Math.sqrt((list_movables[i].x - this.lasers[j].p1[0]) ** 2 + (list_movables[i].y - this.lasers[j].p1[1]) ** 2)
        let d2 = Math.sqrt((list_movables[i].x - this.lasers[j].p2[0]) ** 2 + (list_movables[i].y - this.lasers[j].p2[1]) ** 2)
        if (d1 < list_movables[i].r || d2 < list_movables[i].r) {
          list_movable_collisions.push(i)
          list_laser_collisions.push(j)
          console.log("Rocket::laser_collisions", i, j, [d1, d2, list_movables[i].r])
          break
        }
      }
    }
    return [list_movable_collisions, list_laser_collisions]
  }

  remove_laser(idx) {
    if (idx < this.lasers.length) { this.lasers.splice(idx, 1) }
  }

  check_collision(x, y, r) {
    d = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2)
    return d < r + this.l
  }
}