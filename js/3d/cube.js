/*
 * Misho Georgiev game project
 *
 * 2023 Softel Labs
 *
*/


class Cube {
  constructor(ctx, l=100) {
    this.ctx = ctx
    this.L = l

    this.x = 400
    this.y = 200
    this.z = 0

    this.A = 0
    this.vA = 1.0

    this.random_points = []
    for (let i = 0; i < 20; i++) {
      this.random_points.push([randuniform(-2.0, 2.0), randuniform(-2.0, 2.0), randuniform(-2.0, 2.0)])
    }
  }

  rotate() {
    this.rotateZ = new Matrix([
      [Math.cos(to_radians(this.A)), -Math.sin(to_radians(this.A)), 0],
      [Math.sin(to_radians(this.A)),  Math.cos(to_radians(this.A)), 0],
      [0, 0, 1]
    ])

    this.rotateX = new Matrix([
      [1, 0, 0],
      [0, Math.cos(to_radians(this.A)), -Math.sin(to_radians(this.A))],
      [0, Math.sin(to_radians(this.A)),  Math.cos(to_radians(this.A))],
    ])

    this.rotateY = new Matrix([
      [Math.cos(to_radians(this.A)), 0, -Math.sin(to_radians(this.A))],
      [0, 1, 0],
      [Math.sin(to_radians(this.A)),  0, Math.cos(to_radians(this.A))],
    ])

    this.projection = new Matrix([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ])
    // this.projection = new Matrix([[0.5, 0.2, 0.2], [0.2, 0.5, 0.2], [0.2, 0.2, 0.5]])
    // this.projection = new Matrix([
    //   [1, 0, 0.5],
    //   [0, 1, 0.5],
    //   [0, 0, 1]
    // ])
  }

  rotate_point(P) {
    let p = new Matrix([P]).transpose()
    p = this.rotateX.mult(p)
    p = this.rotateY.mult(p)
    p = this.rotateZ.mult(p)
    p = this.projection.mult(p)
    p.mult_by(this.L)
    p = p.sum(new Matrix([[this.x, this.y, this.z]]).transpose())
    return p
  }

  draw() {
    this.rotate()

    // console.log("rotateZ", this.rotateZ.print())

    let points = [
      [-0.5, -0.5, -0.5],
      [0.5, -0.5, -0.5],
      [0.5, 0.5, -0.5],
      [-0.5, 0.5, -0.5],
      [-0.5, -0.5, 0.5],
      [0.5, -0.5, 0.5],
      [0.5, 0.5, 0.5],
      [-0.5, 0.5, 0.5],
    ]

    points = points.concat(this.random_points)

    let rotated = []
    for (let i = 0; i < points.length; i++) {
      rotated.push(this.rotate_point(points[i]))
    }

    this.draw_cube(rotated)
    this.draw_coordinates()

    this.A += this.vA
    this.A = this.A % 360

    draw_text(this.ctx, "A " + Math.round(this.A), 5, 60, 10, "white")
  }

  draw_cube(points) {
    for (let i = 0; i < 4; i++) {
      draw_line(this.ctx, points[i].data, points[(i + 1) % 4].data, "green", 2)
      draw_line(this.ctx, points[i + 4].data, points[((i + 1) % 4) + 4].data, "green", 2)
      draw_line(this.ctx, points[i].data, points[i + 4].data, "green", 2)
    }

    for (let i = 0; i < points.length; i++) {
      draw_circle(this.ctx, points[i].data[0], points[i].data[1], 5, "red", true)
    }
  }

  draw_coordinates() {
    let points_coord = [
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1]
    ]
    let projection_coord = []
    for (let i = 0; i < points_coord.length; i++) {
      let p = new Matrix([points_coord[i]]).transpose()
      p = this.projection.mult(p)
      p.mult_by(300)
      p = p.sum(new Matrix([[this.x, this.y, 0]]).transpose())
      projection_coord.push(p)
    }
    for (let i = 1; i < projection_coord.length; i++) {
      draw_line(this.ctx, projection_coord[0].data, projection_coord[i].data, "red", 1)
    }
  }
}


class CubeView extends Game {
  constructor(canvas, w, h) {
    super(canvas, w, h)


    this.cube = new Cube(this.ctx, 100)

    this.L = 50

    this.A = 45
    this.vA = 0.1
    this.avA = 0.001

    this.x = 400
    this.y = 200

    this.vx = 1.0
    this.vy = 0.0
    this.vloss = 1.0

    this.G = 0.01
    this.GA = 90
  }

  draw() {
    draw_text(this.ctx, "FPS " + Math.round(this.fps_counter.fps), 5, 40, 10, "white")
    // draw_text(this.ctx, "A " + Math.round(this.A), 5, 60, 10, "white")
    draw_text(this.ctx, "X,Y " + Math.round(this.x) + "," + Math.round(this.y), 5, 80, 10, "white")
    draw_text(this.ctx, "V " + this.vx.toFixed(2) + "," + this.vy.toFixed(2), 5, 100, 10, "white")

    let GA_radians = to_radians(this.GA)
    let gx = this.G * Math.cos(GA_radians)
    let gy = this.G * Math.sin(GA_radians)

    this.vx += gx
    this.vy += gy

    this.x += this.vx
    this.y += this.vy

    if (this.x > this.W || this.x < 0) { this.vx = - this.vloss * this.vx }
    if (this.y > this.H || this.y < 0) { this.vy = - this.vloss * this.vy }
    let xy = frame_bounds(this.W, this.H, this.x, this.y)
    this.x = xy[0]
    this.y = xy[1]

    // let x2 = this.x + this.L * Math.cos(to_radians(this.A))
    // let y2 = this.y + this.L * Math.sin(to_radians(this.A))
    // draw_line(this.ctx, [this.x, this.y], [x2, y2], "green", 2)

    this.cube.x = this.x
    this.cube.y = this.y
    this.cube.draw()

    this.A += this.vA
    this.vA += this.avA
    this.A = this.A % 360
  }
}

