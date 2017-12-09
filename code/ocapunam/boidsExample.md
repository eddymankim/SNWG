---
layout: full
title: Final Development
permalink: /code/ocapunam-boids/
author: Ozguc
---
<script deferred type="module">

import * as T from '../lib/module.js'
import BoidsRenderer from '../ocapunam/BoidsRenderer.js'

let time = 0

let boids = new BoidsRenderer({
	boidCount: 100,
	update: (dt) => update(dt),
})

function update(dt) {
     time += dt
     console.log(boids.boidsList)
}





boids.init()

</script>

