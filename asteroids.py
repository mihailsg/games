import cv2
import numpy as np

from rocket import *
from asteroid import *


def main():

  W = 600
  H = 800

  # rockets = [
  #   SimpleRocket(x0=100, y0=100, color=(0, 0, 255)),
  #   Rocket(x0=200, y0=200, color=(0, 255, 0))
  # ]

  rocket = Rocket(x0=200, y0=200, color=(0, 255, 0))

  asteroids = [
    Asteroid(100, 100, 0.2, 0.3, 20),
    Asteroid(150, 150, 0.1, 0.2, 20),
  ]

  for i in range(10):
    asteroids.append(
      Asteroid(
        np.random.randint(0, W),
        np.random.randint(0, H),
        np.random.uniform(0, 0.7),
        np.random.uniform(0, 0.7),
        np.random.randint(5, 50),
        color=(255, 255, 255)
      )
    )


  while(True):
    k = cv2.waitKey(1)
    if k == 27:    # Esc key to stop
      break

    if k == ord('u'):
      rocket.accelerate(0.01)
    if k == ord('i'):
      rocket.accelerate(0.05)
    if k == ord('o'):
      rocket.accelerate(0.1)
    if k == ord('m'):
      rocket.fire()
    if k == ord('j'):
      rocket.rotate(-5)
    if k == ord('k'):
      rocket.rotate(5)

    frame = np.zeros(shape=[W, H, 3], dtype=np.uint8)

    rocket.move(frame)

    for asteroid in asteroids:
      asteroid.move(frame)

    cv2.imshow('asteroids', frame)



if __name__=='__main__':
        main()


