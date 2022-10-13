import cv2
import math

from geometrics import to_radians


class RocketLaser:
  def __init__(self, x0, y0, angle):
    self.path = 0
    self.x0 = x0
    self.y0 = y0

    self.x = x0
    self.y = y0
    self.l = 10
    self.angle = angle

    self.v = 0.7
    self.vx = self.v * math.cos(to_radians(self.angle))
    self.vy = self.v * math.sin(to_radians(self.angle))

  def move(self, frame):
    w = frame.shape[1]
    h = frame.shape[0]

    self.x += self.vx
    self.y += self.vy

    self.path = math.sqrt((self.x - self.x0) ** 2 + (self.y - self.y0) ** 2)

    angle = to_radians(self.angle)
    p1 = (int(self.x), int(self.y))
    p2 = (int(self.x + self.l * math.cos(angle)), int(self.y + self.l * math.sin(angle)))

    cv2.line(frame, p1, p2, (0, 0, 255), 2)

    return self.path < 1000 and self.x >= 0 and self.x <= w and self.y >= 0 and self.y <= h