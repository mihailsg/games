
PI = 3.141592653589793

function to_radians(angle) {
  return angle * PI / 180
}

function line_perpendicular(p1, p2, l) {
  x1 = p1[0]
  y1 = p1[1]
  x2 = p2[0]
  y2 = p2[1]

  x3 = x2 - x1
  y3 = y2 - y1

  mag = Math.sqrt(x3 * x3 + y3 * y3)
  x3 /= mag
  y3 /= mag

  x4 = x2 - y3 * l
  y4 = y2 + x3 * l
  x5 = x2 + y3 * l
  y5 = y2 - x3 * l
  return [[x4, y4], [x5, y5]]
}

function frame_bounds_rewind(w, h, x, y) {
  if (x > w) { x = 0 }
  if (x < 0) { x = w }
  if (y > h) { y = 0 }
  if (y < 0) { y = h }
  return [x, y]
}