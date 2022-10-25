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
              params.get("w") || 600,
              params.get("h") || 400,
              params.get("lives") || 5,
              params.get("asteroids") || 10
)
game.run()
