import math
import cv2


class SimpleRocket:
  def __init__(self, x0=0, y0=0, color=(255, 0, 0)):
    self.color = color
    self.r = 10

    self.x = x0
    self.y = y0

    self.vx = 0
    self.vy = 0

  def accelerate(self, gx, gy):
    self.vx += gx
    self.vy += gy

  def move(self, frame):
    w = frame.shape[1]
    h = frame.shape[0]

    self.x += self.vx
    self.y += self.vy

    if self.x > w:
      self.x = 0
    if self.x < 0:
      self.x = w
    if self.y > h:
      self.y = 0
    if self.y < 0:
      self.y = h

    cv2.circle(frame, (int(self.x), int(self.y)), self.r, self.color, thickness=-1)
    cv2.putText(frame, "V ({},{})".format(round(self.vx, 2), round(self.vy, 2)), (5, 20), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=(255, 255, 255), thickness=1)


class Rocket:
  def __init__(self, x0=0, y0=0, color=(255, 0, 0)):
    self.color = color
    self.l = 10

    self.x = x0
    self.y = y0

    # Angle in degrees
    self.angle = 0

    self.gx = 0
    self.gy = 0

    self.vx = 0
    self.vy = 0

  def rotate(self, angle):
    self.angle += angle

  def accelerate(self, a):
    angle = self.angle * 3.141592653589793 / 180
    self.gx = a * math.cos(angle)
    self.gy = a * math.sin(angle)

    self.vx += self.gx
    self.vy += self.gy

  def move(self, frame):
    w = frame.shape[1]
    h = frame.shape[0]

    self.x += self.vx
    self.y += self.vy

    if self.x > w:
      self.x = 0
    if self.x < 0:
      self.x = w
    if self.y > h:
      self.y = 0
    if self.y < 0:
      self.y = h

    angle = self.angle * 3.141592653589793 / 180
    p1 = (int(self.x + self.l * math.cos(angle)), int(self.y + self.l * math.sin(angle)))
    p2 = (int(self.x - self.l * math.cos(angle)), int(self.y - self.l * math.sin(angle)))
    p3, p4 = self.perpendicular(p1, p2, self.l)
    cv2.line(frame, p1, p2, self.color, 2)
    cv2.line(frame, p3, p4, self.color, 4)
    cv2.line(frame, p3, p1, (0, 0, 255), 3)
    cv2.line(frame, p4, p1, (255, 0, 0), 3)

    cv2.putText(frame, "V ({},{})".format(round(self.vx, 2), round(self.vy, 2)), (5, 20), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=(255, 255, 255), thickness=1)

  def perpendicular(self, p1, p2, l):
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