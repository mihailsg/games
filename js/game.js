/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


const query = window.location.search
const params = new URLSearchParams(query)

var lives = params.get("lives")
var asteroids = params.get("asteroids")

game = new SpaceAsteroids(
              document.getElementsByTagName('canvas')[0],
              params.get("w") || 1200,
              params.get("h") || 800,
              params.get("lives") || 10,
              params.get("asteroids") || 20,
              params.get("mouse") || false
)
game.run()
