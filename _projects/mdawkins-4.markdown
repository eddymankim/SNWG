---
layout: post
author: Putu
title: Drawing
thumbnail: mdawkins-4.png
week-assignment: 4
---
<h2>
<span style="color:blue">
on an HTML Canvas
</span>
</h2>

<script>
var penColor;
var userColor = prompt("What color will your pen be?");
switch(userColor) {
    case "Red":
        penColor = "Red";
        break;
    case "Pink":
        penColor = "MistyRose";
        break;    
    case "Purple":
        penColor = "Thistle";
        break;
    case "Yellow":
        penColor = "Yellow";
        break;
    case "Green":
        penColor = "Green";
        break;
    case "Turquoise":
        penColor = "Teal";
        break;
    case "Blue":
        penColor = "Blue";
        break;
    case "Black":
        penColor = "Black";
        break;    
    case "White":
        penColor = "White";
        break;
    default:
        penColor = "MistyRose";
        break;
}
var canvas = document.createElement('canvas');
document.body.appendChild(canvas);
document.body.style.margin = 20;
var ctx = canvas.getContext('2d');
resize();
var pos = { x: 0, y: 0 };
window.addEventListener('resize', resize);
document.addEventListener('mousemove', draw);
document.addEventListener('mousedown', setPosition);
document.addEventListener('mouseenter', setPosition);
function setPosition(e) {
  pos.x = e.clientX;
  pos.y = e.clientY;
}
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}
function draw(e) {
  if (e.buttons !== 1) return;
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = penColor;
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}
</script>