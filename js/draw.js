/*
 * Misho Georgiev game project
 *
 * 2022 Softel Labs
 *
*/


function draw_filled(ctx, color, filled) {
  if (filled) {
    ctx.fillStyle = color;
    ctx.fill();
  } else {
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}

function draw_text(ctx, txt, x, y, size, color="black") {
  ctx.beginPath();
  ctx.font = size + 'px serif';
  ctx.fillStyle = color;
  ctx.fillText(txt, x, y);
}

function draw_line(ctx, p1, p2, color, w) {
  ctx.beginPath();
  ctx.lineWidth = w;
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.strokeStyle = color;
  ctx.stroke();
}

function draw_contours(ctx, points, color, w, filled=false) {
  // console.log("draw_contours", points, color, w, filled)
  ctx.beginPath();
  ctx.lineWidth = w;
  ctx.moveTo(points[0][0], points[0][1]);
  for (i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();

  draw_filled(ctx, color, filled)
}

function draw_rect(ctx, x, y, w, h, color="black", filled=false) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);

  draw_filled(ctx, color, filled)
}

function draw_circle(ctx, x, y, r, color="black", filled=false) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);

  draw_filled(ctx, color, filled)
}