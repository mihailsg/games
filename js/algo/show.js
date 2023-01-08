/*
 * Misho Georgiev game project
 *
 * 2023 Softel Labs
 *
*/


class AlgoShow extends Game {
  constructor(canvas, w, h, n, m) {
    super(canvas, w, h)

    this.x = 50
    this.y = 50
    this.d = 30

    this.n = n
    this.m = parseInt(m)

    this.build_matrix()
    this.fill_matrix()

    setTimeout(this.on_fps.bind(this), 1500)
  }

  on_fps() {
    let fps = this.fps_counter.fps
    this.fps_ratio = 120 / fps
  }

  build_matrix() {
    this.a = []
    var k = this.m
    for (var i = 0; i < this.n; i++) {
      this.a.push([])
      for (var j = 0; j < this.n; j++) {
        this.a[i].push(k)
        k++
      }
    }
  }

  fill_matrix() {
    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        this.a[i][j] = 3 *  this.a[i][j]
      }
    }

    console.log("A", this.a)
  }

  draw() {
    draw_text(this.ctx, "FPS " + Math.round(this.fps_counter.fps), 5, 40, 10, "white")

    for (var i = 0; i < this.n; i++) {
      for (var j = 0; j < this.n; j++) {
        var x = this.x + j * this.d
        var y = this.y + i * this.d
        draw_rect(this.ctx, x, y, this.d, this.d, "white", false, 2)
        draw_text(this.ctx, this.a[i][j], x + 10, y + 20, 8, "white")
      }
    }
  }
}


const query = window.location.search
const params = new URLSearchParams(query)

math = new AlgoShow(
    document.getElementsByTagName('canvas')[0],
    params.get("w") || 1200,
    params.get("h") || 800,
    params.get("n") || 10,
    params.get("m") || 1
)

math.run()
