import cv2
import time
import numpy as np

from games.rocket import SimpleRocket

def main():
  
  rocket = SimpleRocket(x0=100, y0=100, color=(0, 0, 255))

  g = 0.1

  while(True):
    k = cv2.waitKey(1)
    if k == 27:    # Esc key to stop
      break

    if k == ord('i'):
      rocket.accelerate(0, -g)
    if k == ord('m'):
      rocket.accelerate(0, g)
    if k == ord('j'):
      rocket.accelerate(-g, 0)
    if k == ord('k'):
      rocket.accelerate(g, 0)

    frame = np.zeros(shape=[600, 800, 3], dtype=np.uint8)
    rocket.move(frame)
    cv2.imshow('asteroids', frame)
    
    
    # time.sleep(0.03)

 
if __name__=='__main__':
        main()


