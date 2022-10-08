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