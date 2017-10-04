---
layout: post
author: aman
title: Aman Tiwari's JS Assignment 
thumbnail: atiwari1-4-harmonograph.png
week-assignment: 4
---
Here is a harmonograph:

<div>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.14/p5.min.js"></script>
<div id="sketch-holder"></div>

<script>
const width = 700;
const height = 700;
const maxTheta = 30;
const dT = 0.1;
const leakyA = 0.00001;
let tune = 1.0;

let f1 = 0.1;
let f2 = 0.1;
let future_f1 = 0.1;
let future_f2 = 0.1;
let d1 = 0.002;
let d2 = 0.03;

function leaky(prev, next, a) {
	return prev * (1 - a) + next * a;
}

function pend(a, f, d, t) {
	return a * sin(t * f) * exp(-d * t);
}

function setup() { 
  let cnv = createCanvas(width, height);
  cnv.parent('sketch-holder');
	frameRate(40);
} 

function draw() { 
	f1 = leaky(f1, future_f1, leakyA);
	f2 = leaky(f2, future_f2, leakyA);
	let midX = width/2;
	let midY = height/2;

  background('red');
	for(let t = 0; t < maxTheta; t += dT * tune) {
			const x0 = pend(midX, f1, d1, t) + midX;
			const y0 = pend(midY, f2, d2, t) + midY;
			const x1 = pend(midX, f1, d1, t + dT * tune) + midX;
			const y1 = pend(midY, f2, d2, t + dT * tune) + midY;
			stroke('black');
			line(midX, midY, x0, y0);
			stroke('white');
			line(x0, y0, x1, y1);
	}
	if(frameRate() < 30) {
		tune += 0.01;
	} else if (frameRate() > 35) {
		tune -= 0.01;
	}
	tune = Math.max(tune, 0.1, Math.min(tune, 2.0));
}

function mouseMoved() {
	let midX = width/2;
	let midY = height/2;
	future_f1 = (mouseX - midX) * 2.0 - 1.0;
	future_f2 = (mouseY - midY) * 2.0 - 1.0;
}
</script>
</div>