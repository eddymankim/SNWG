/* Boid prototype */

import * as THREE from '../ocapunam/module.js'


export function Boid(swarm) {
    this.x = Math.random() * swarm.width;
    this.y = Math.random() * swarm.height;
    this.heading = Math.random() * 2 * Math.PI - Math.PI;
    this.radius = 3
    // this.mesh = new THREE.Mesh(
    //     new THREE.SphereGeometry(this.radius, 6, 6),
    //     new THREE.MeshBasicMaterial({ transparent: true, color: 0xFFFFFF, opacity:.1}))
    // this.mesh.position.set(this.x, this.y)
}

Boid.prototype.speed = .5;
Boid.prototype.radialSpeed = Math.PI / 100;
Boid.prototype.vision = 50;

Boid.prototype.distance = function(boid, width, height) {
    var x0 = Math.min(this.x, boid.x), x1 = Math.max(this.x, boid.x);
    var y0 = Math.min(this.y, boid.y), y1 = Math.max(this.y, boid.y);
    var dx = Math.min(x1 - x0, x0 + width - x1);
    var dy = Math.min(y1 - y0, y0 + height - y1);
    return Math.sqrt(dx * dx + dy * dy);
};

Boid.prototype.getNeighbors = function(swarm) {
    var w = swarm.width, h = swarm.height;
    var neighbors = [];
    for (var i = 0; i < swarm.boids.length; i++) {
        var boid = swarm.boids[i];
        if (this !== boid && this.distance(boid, w, h) < this.vision) {
            neighbors.push(boid);
        }
    }
    return neighbors;
};

Boid.wrap = function(value) {
    var min, max;
    if (arguments.length === 2) {
        min = 0;
        max = arguments[1];
    } else if (arguments.length === 3) {
        min = arguments[1];
        max = arguments[2];
    } else throw new Error('wrong number of arguments');
    while (value >= max) value -= (max - min);
    while (value < min) value += (max - min);
    return value;
};

Boid.clamp = function(value, limit) {
    return Math.min(limit, Math.max(-limit, value));
};

Boid.meanAngle = function() {
    var sumx = 0, sumy = 0, len = arguments.length;
    for (var i = 0; i < len; i++) {
        sumx += Math.cos(arguments[i]);
        sumy += Math.sin(arguments[i]);
    }
    return Math.atan2(sumy / len, sumx / len);
};

Boid.prototype.step = function(swarm) {
    var w = swarm.width, h = swarm.height;
    var neighbors = this.getNeighbors(swarm);
    if (neighbors.length > 0) {
        var meanhx = 0, meanhy = 0;
        var meanx = 0, meany = 0;

        // mindist between boids
        var mindist = this.radius * 3, min = null;
        for (var i = 0; i < neighbors.length; i++) {
            var boid = neighbors[i];
            meanhx += Math.cos(boid.heading);
            meanhy += Math.sin(boid.heading);
            meanx += boid.x;
            meany += boid.y;
            var dist = this.distance(boid, w, h);
            if (dist < mindist) {
                mindist = dist;
                min = boid;
            }
        }
        meanhx /= neighbors.length;
        meanhy /= neighbors.length;
        meanx /= neighbors.length;
        meany /= neighbors.length;

        var target;
        if (min) target = Math.atan2(this.y - min.y, this.x - min.x);
        else {
            // Match heading and move towards center
            var meanh = Math.atan2(meanhy, meanhx);
            var center = Math.atan2(meany - this.y, meanx - this.x);
            target = Boid.meanAngle(meanh, meanh, meanh, center);
        }

        // Move in this direction
        var delta = Boid.wrap(target - this.heading, -Math.PI, Math.PI);
        delta = Boid.clamp(delta, this.radialSpeed);
        this.heading = Boid.wrap(this.heading + delta, -Math.PI, Math.PI);
    }

    this.move(swarm);
};

Boid.prototype.move = function(swarm) {
    var padding = swarm.padding;
    var width = swarm.width, height = swarm.height;
    this.x = Boid.wrap(this.x + Math.cos(this.heading) * this.speed,
                       -padding, width + padding * 2);
    this.y = Boid.wrap(this.y + Math.sin(this.heading) * this.speed,
                       -padding, height + padding * 2);

    // this.mesh.position.set(this.x, this.y, 0)

}

/* Swam prototype. */

export function Swarm(w,h) {
    this.w = w
    this.h = h
    this.boids = [];
    var swarm = this;
    this.animate = function() { Swarm.step(swarm) }

// wrap padding

    this.padding = -2;
}

Swarm.prototype.createBoids = function(scene, n=1) {
    for (var i=0; i<n; ++i) {   
        var curBoid = new Boid(this)
        this.boids.push(curBoid)
        // scene.add(curBoid.mesh)
    }
}

Swarm.prototype.clear = function() { this.boids = [] }

Object.defineProperty(Swarm.prototype, 'width', {get: function() { return this.w }});
Object.defineProperty(Swarm.prototype, 'height', {get: function() { return this.h }});

Swarm.step = function (swarm) {
    for (var i = 0; i < swarm.boids.length; i++) swarm.boids[i].step(swarm)
}



