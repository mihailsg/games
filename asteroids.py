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

  rocket = Rocket(x0=50, y0=50, color=(255, 255, 0), txt_pos=(300, 20), laser_count=200)

  asteroids = []

  for i in range(30):
    asteroids.append(
      Asteroid(
        np.random.randint(200, W),
        np.random.randint(200, H),
        np.random.uniform(0, 1.1),
        np.random.uniform(0, 1.1),
        np.random.randint(5, 50),
        color=(255, 255, 255),
        size_contour=10
      )
    )

  rocket_lives = 5
  asteroids_removed = 0


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

    laser_positions = rocket.laser_positions()
    for asteroid in asteroids:
      for i, laser in enumerate(laser_positions):
        d1 = math.sqrt((asteroid.x - laser[0][0]) ** 2 + (asteroid.y - laser[0][1]) ** 2)
        d2 = math.sqrt((asteroid.x - laser[1][0]) ** 2 + (asteroid.y - laser[1][1]) ** 2)
        if d1 < asteroid.r or d2 < asteroid.r:
          asteroids.remove(asteroid)
          rocket.remove_laser(i)
          asteroids_removed += 1
          break

    for asteroid in asteroids:
      if rocket.check_collision(asteroid.x, asteroid.y, asteroid.r):
        asteroids.remove(asteroid)
        rocket = RocketExplosion(rocket.x, rocket.y)
        rocket_lives -= 1
        break

    if not rocket.alive():
      if rocket_lives > 0:
        rocket = Rocket(x0=rocket.x, y0=rocket.y, color=(255, 255, 0), txt_pos=(300, 20), laser_count=len(asteroids) * 10)
      else:
        break

    if len(asteroids) == 0 and rocket_lives > 0:
      rocket = Rocket(x0=400, y0=400, color=(255, 255, 0), txt_pos=(300, 20), l=50)
      txt = "Winner"
      rocket_lives = -1
    else:
      txt = "Lives {} Asteroids {} / {}".format(rocket_lives, len(asteroids), asteroids_removed)

    cv2.putText(frame, txt, (5, 20), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=0.5, color=(255, 255, 255), thickness=1)

    cv2.imshow('asteroids', frame)



if __name__=='__main__':
        main()


