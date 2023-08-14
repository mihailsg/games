/*
 * Misho Georgiev game project
 *
 * 2023 Softel Labs
 *
*/


class Base3D {
  constructor(ctx, l=100) {
    this.ctx = ctx

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

    this.rotateZ = new Matrix([
      [Math.cos(to_radians(this.A)), -Math.sin(to_radians(this.A)), 0],
      [Math.sin(to_radians(this.A)),  Math.cos(to_radians(this.A)), 0],
      [0, 0, 1]
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
    this.draw_rotation()
    this.draw_coordinates()

    this.A += this.vA
    this.A = this.A % 360

    // draw_text(this.ctx, "A " + Math.round(this.A), 5, 60, 10, "white")
  }

  draw_rotation() {
    let points = []

    points = points.concat(this.random_points)

    let rotated = []
    for (let i = 0; i < points.length; i++) {
      rotated.push(this.rotate_point(points[i]))
    }
    for (let i = 0; i < rotated.length; i++) {
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


class Cube extends Base3D {
  constructor(ctx, l=100) {
    super(ctx)
    this.L = l
  }

  draw_rotation() {
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

    for (let i = 0; i < 4; i++) {
      draw_line(this.ctx, rotated[i].data, rotated[(i + 1) % 4].data, "green", 2)
      draw_line(this.ctx, rotated[i + 4].data, rotated[((i + 1) % 4) + 4].data, "green", 2)
      draw_line(this.ctx, rotated[i].data, rotated[i + 4].data, "green", 2)
    }

    for (let i = 0; i < rotated.length; i++) {
      draw_circle(this.ctx, rotated[i].data[0], rotated[i].data[1], 5, "red", true)
    }
  }
}


class Cylinder extends Base3D {
  constructor(ctx, l=100, r=50, s=12) {
    super(ctx)
    this.L = l
    this.R = r
    this.S = s
    this.step = 360 / this.S
  }

  draw_rotation() {
    let points = []
    for (let a = 0; a < 360; a += this.step) {
      points.push([Math.sin(to_radians(a)), Math.cos(to_radians(a)), 1.0])
    }
    for (let a = 0; a < 360; a += this.step) {
      points.push([Math.sin(to_radians(a)), Math.cos(to_radians(a)), -1.0])
    }

    let rotated = []
    for (let i = 0; i < points.length; i++) {
      rotated.push(this.rotate_point(points[i]))
    }

    for (let i = 0; i < points.length / 2; i++) {
      draw_line(this.ctx, rotated[i].data, rotated[i + points.length / 2].data, "green", 2)
    }
    for (let i = 0; i < points.length / 2 - 1; i++) {
      draw_line(this.ctx, rotated[i].data, rotated[i + 1].data, "green", 2)
      draw_line(this.ctx, rotated[i + points.length / 2].data, rotated[i + points.length / 2 + 1].data, "green", 2)
    }
    draw_line(this.ctx, rotated[0].data, rotated[points.length / 2 - 1].data, "green", 2)
    draw_line(this.ctx, rotated[points.length / 2].data, rotated[points.length - 1].data, "green", 2)

    for (let i = 0; i < rotated.length; i++) {
      draw_circle(this.ctx, rotated[i].data[0], rotated[i].data[1], 5, "red", true)
    }
  }
}
