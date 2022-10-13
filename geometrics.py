import math
import cv2


def to_radians(angle):
  return angle * 3.141592653589793 / 180

def line_perpendicular(p1, p2, l):
  x1, y1 = p1
  x2, y2 = p2

  x3 = x2 - x1
  y3 = y2 - y1

  mag = math.sqrt(x3 * x3 + y3 * y3)
  x3 /= mag
  y3 /= mag

  x4 = x2 - y3 * l
  y4 = y2 + x3 * l
  x5 = x2 + y3 * l
  y5 = y2 - x3 * l
  return (int(x4), int(y4)), (int(x5), int(y5))