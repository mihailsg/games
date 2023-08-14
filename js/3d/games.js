/*
 * Misho Georgiev game project
 *
 * 2023 Softel Labs
 *
*/


class BaseGravityBounce {
  constructor(ctx, x, y, vx=1.0, vy=0.0, g=0.01, ga=90) {
    this.ctx = ctx

    this.x = x
    this.y = y

    this.vx = vx
    this.vy = vy
    this.vloss = 1.0

    this.G = g
    this.GA = ga

    this.init()
  }

  init() {
    this.bounce = new Cube(this.ctx, 100)
  }

  draw() {
    let GA_radians = to_radians(this.GA)
    let gx = this.G * Math.cos(GA_radians)
    let gy = this.G * Math.sin(GA_radians)

    this.vx += gx
    this.vy += gy

    this.x += this.vx
    this.y += this.vy

    if (this.x > this.ctx["WH"]["W"] || this.x < 0) { this.vx = - this.vloss * this.vx }
    if (this.y > this.ctx["WH"]["H"] || this.y < 0) { this.vy = - this.vloss * this.vy }
    let xy = frame_bounds(this.ctx["WH"]["W"], this.ctx["WH"]["H"], this.x, this.y)
    this.x = xy[0]
    this.y = xy[1]

    this.bounce.x = this.x
    this.bounce.y = this.y
    this.bounce.draw()
  }
}

class BounceCube extends BaseGravityBounce {
  init() {
    this.bounce = new Cube(this.ctx, 100)
  }
}

class BounceCylinder extends BaseGravityBounce {
  init() {
    this.bounce = new Cylinder(this.ctx, 100, 50, 36)
  }
}


class BounceView extends Game {
  constructor(canvas, w, h) {
    super(canvas, w, h)

    this.bounce_list = []
    for (let i = 0; i < 2; i++) {
      this.bounce_list.push(new BounceCube(this.ctx, randint(30, w - 30), randint(0, 200), randuniform(-3.0, 3.0)))
      this.bounce_list.push(new BounceCylinder(this.ctx, randint(30, w - 30), randint(0, 200), randuniform(-3.0, 3.0)))
    }
  }

  draw() {
    draw_text(this.ctx, "FPS " + Math.round(this.fps_counter.fps), 5, 40, 10, "white")
    for (let i = 0; i < this.bounce_list.length; i++) {
      this.bounce_list[i].draw()
    }
  }
}

