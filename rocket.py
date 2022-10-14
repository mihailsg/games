import math
import cv2
import numpy as np

from geometrics import *
from laser import *


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

    self.x, self.y = frame_bounds_rewind(w, h, self.x, self.y)

    cv2.circle(frame, (int(self.x), int(self.y)), self.r, self.color, thickness=-1)
    cv2.putText(frame, "V ({},{})".format(round(self.vx, 2), round(self.vy, 2)), (5, 20), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=(255, 255, 255), thickness=1)


class Rocket:
  def __init__(self, x0=0, y0=0, color=(255, 0, 0), txt_pos=(5, 20)):
    self.color = color
    self.txt_pos = txt_pos
    self.l = 10

    self.thruster_default = 30
    self.thruster = 0

    self.x = x0
    self.y = y0

    self.angle = 0

    self.a = 0
    self.ax = 0
    self.ay = 0

    self.vx = 0
    self.vy = 0

    self.lasers = []

  def rotate(self, angle):
    self.angle += angle

  def accelerate(self, a):
    angle = to_radians(self.angle)
    self.ax = a * math.cos(angle)
    self.ay = a * math.sin(angle)
    self.a = a

    self.vx += self.ax
    self.vy += self.ay

    self.thruster = self.thruster_default

  def move(self, frame):
    w = frame.shape[1]
    h = frame.shape[0]

    self.x += self.vx
    self.y += self.vy

    self.x, self.y = frame_bounds_rewind(w, h, self.x, self.y)

    angle = to_radians(self.angle)
    p1 = (int(self.x + self.l * math.cos(angle)), int(self.y + self.l * math.sin(angle)))
    p2 = (int(self.x - self.l * math.cos(angle)), int(self.y - self.l * math.sin(angle)))
    p3, p4 = line_perpendicular(p1, p2, self.l)

    cv2.line(frame, p1, p2, self.color, 2)
    cv2.line(frame, p3, p4, self.color, 4)
    cv2.line(frame, p3, p1, (0, 0, 255), 3)
    cv2.line(frame, p4, p1, (255, 0, 0), 3)

    if self.thruster > 0:
      l = self.a * 300
      p1 = p2
      da = 0.3
      p2 = [int(p1[0] - l * math.cos(angle - da)), int(p1[1] - l * math.sin(angle - da))]
      p3 = [int(p1[0] - l * math.cos(angle + da)), int(p1[1] - l * math.sin(angle + da))]
      cv2.drawContours(frame, [np.array([p1, p2, p3])], 0, (0, 0, 255), -1)
      self.thruster -= 1

    txt = "V ({},{}) A[{}] L[{}]".format(round(self.vx, 3), round(self.vy, 3), self.angle, len(self.lasers))
    cv2.putText(frame, txt, self.txt_pos, fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=(255, 255, 255), thickness=1)

    self.move_lasers(frame)

  def move_lasers(self, frame):
    for laser in self.lasers:
      if not laser.move(frame):
        self.lasers.remove(laser)

  def fire(self):
    self.lasers.append(Laser(self.x, self.y, self.angle))
