/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


class Button {
  constructor(ctx, w, h, x0, y0, name, url_link, color) {
    this.ctx = ctx
    this.W = w
    this.H = h

    this.name = name
    this.url_link = url_link

    this.color = color
    this.color_text = "white"

    this.x0 = x0
    this.y0 = y0
    this.x = x0
    this.y = y0
    this.w = 400 * this.W / 1200
    this.h = 100 * this.H / 800
    this.l0 = 20 * this.H / 800
    this.l = this.l0
    this.alpha = to_radians(30)

    this.mouse_listeners = {
      'mousemove': this.on_mouse_move.bind(this),
      'mouseup': this.on_mouse_up.bind(this),
      'mousedown': this.on_mouse_down.bind(this),
      'dblclick': this.on_dbl_click.bind(this),
    }

    for (const [key, value] of Object.entries(this.mouse_listeners)) {
      document.addEventListener(key, value)
    }
  }

  on_mouse_move(e) {
    let rect = this.ctx["BoundingClientRect"]
    this.mx = e.clientX - rect.left
    this.my = e.clientY - rect.top

    this.color_text = this.mouse_hover() ? "green" : "white"
  }
  on_mouse_down(e) {
    if (this.mouse_hover()) {
      this.l /= 2
      this.x += this.l * Math.cos(this.alpha)
      this.y -= this.l * Math.cos(this.alpha)
    }
  }
  on_mouse_up(e) {
    if (this.mouse_hover()) {
      console.log("clicked button", this.name, this.url_link)
      window.open(this.url_link, '_blank');
      this.l = this.l0
      this.x = this.x0
      this.y = this.y0
    }
  }
  on_dbl_click(e) {

  }

  mouse_hover() {
    return this.mx >= this.x && this.mx <= this.x + this.w && this.my >= this.y && this.my <= this.y + this.h
  }

  draw() {
    draw_rect(this.ctx, this.x, this.y, this.w, this.h, this.color, false, 5)

    let p1 = [this.x + this.l * Math.cos(this.alpha), this.y - this.l * Math.sin(this.alpha)]
    let p2 = [this.x + this.w + this.l * Math.cos(this.alpha), this.y - this.l * Math.sin(this.alpha)]
    let p3 = [this.x + this.w + this.l * Math.cos(this.alpha), this.y + this.h - this.l * Math.sin(this.alpha)]

    draw_line(this.ctx, [this.x, this.y], p1, this.color, 3)
    draw_line(this.ctx, [this.x + this.w, this.y], p2, this.color, 3)
    draw_line(this.ctx, [this.x + this.w, this.y + this.h], p3, this.color, 3)

    draw_line(this.ctx, p1, p2, this.color, 3)
    draw_line(this.ctx, p2, p3, this.color, 3)

    draw_text(this.ctx, this.name, this.x + this.w / 6, this.y + this.h / 2, 32, this.color_text)
  }
}