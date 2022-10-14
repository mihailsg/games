import math
import cv2
import numpy as np

from geometrics import *


class Asteroid:
  def __init__(self, x0, y0, vx0, vy0, r, color=(255, 0, 0), size_contour=10):
    self.color = color
    self.r = r
    self.size_contour = size_contour

    self.x = x0
    self.y = y0

    self.vx = vx0
    self.vy = vy0

    self.generate_contour()

  def move(self, frame):
    w = frame.shape[1]
    h = frame.shape[0]

    self.x += self.vx
    self.y += self.vy

    self.x, self.y = frame_bounds_rewind(w, h, self.x, self.y)

    # self.generate_contour()
    list_points = []
    for p in self.list_points:
      list_points.append((int(self.x + p[0]), int(self.y + p[1])))
    cv2.drawContours(frame, [np.array(list_points)], 0, self.color, 1)

  def generate_contour(self):
    self.list_points = []
    for i in range(self.size_contour):
      r = self.r * np.sqrt(np.random.uniform())
      # angle = np.random.uniform() * 2 * PI
      angle = i * 2 * PI / self.size_contour
      p = (r * math.cos(angle), r * math.sin(angle))
      self.list_points.append(p)


