import cv2
import time
import numpy as np

from rocket import *


def main():
  
  # rockets = [
  #   SimpleRocket(x0=100, y0=100, color=(0, 0, 255)),
  #   Rocket(x0=200, y0=200, color=(0, 255, 0))
  # ]

  rocket = Rocket(x0=200, y0=200, color=(0, 255, 0))

  g = 0.1

  while(True):
    k = cv2.waitKey(1)
    if k == 27:    # Esc key to stop
      break

    if k == ord('i'):
      # rockets[0].accelerate(0, -g)
      rocket.accelerate(g)
    if k == ord('m'):l;
      # rockets[0].accelerate(0, g)
    if k == ord('j'):
      # rockets[0].accelerate(-g, 0)
      rocket.rotate(-5)
    if k == ord('k'):
      # rockets[0].accelerate(g, 0)
      rocket.rotate(5)

    frame = np.zeros(shape=[600, 800, 3], dtype=np.uint8)

    rocket.move(frame)

    cv2.imshow('asteroids', frame)
    

 
if __name__=='__main__':
        main()


