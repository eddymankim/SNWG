---
layout: post
author: Ozguc
title: Making of Wanderland
thumbnail: ocapunam-Final.gif
week-assignment: 14
---

<h3>Modifying Mesh Vertices:</h3>
<p>
    One of the very first experimentations I did in the development of 'Wanderland', was to explore how I can modify mesh vertices. Most obvious and straightforward approach was to individually modify certain vertices each time the scene is rendered. Below you can see my first attempt to randomly modify mesh vertices with the described methodology. It randomly picks a vertex and modifies the z value of the mesh with another random number.
</p>
<iframe width="100%" height="600" src="/code/ocapunam-meshTerrain/"></iframe>
<p>
    This approach is somewhat successful in an attempt to modify vertices of the ground mesh, but there are some problems with the visual effect it creates. The modification of these vertices results in very pointy spikes that are a little far from what I had in mind. This presented my second challenge in development. 
</p>

<h3>Softening Modified Mesh:</h3>
<p>
    At this stage, we've discussed that applying a 'brush' like filter to the vertex modification would be a way to approach this problem. In order to achieve a smoother modification of the mesh, I've applied a rectangular array that keeps varying height values for neighbor vertices. This resulted in much smoother and even 'bumps' on the surface of the ground mesh.
</p>
<iframe width="100%" height="600" src="/code/ocapunam-brush/"></iframe>

<h3>Introducing Boids:</h3>
<p>
    Moving onwards, I focused on improving how modified vertices were selected. In order to do so, I have incoporated a boids algorithm by <a href="https://github.com/skeeto/boids-js">skeeto</a>. Using this sketch, I was able to create an array of boids which are flocking around the canvas. In my final sketch, I used these boids’s position to select mesh vertices.

</p>
<iframe width="100%" height="600" src="/code/ocapunam-boids/"></iframe>

<h3>Moving onwards:</h3>
<p>
  One of the main reasons why I created a boids canvas was also to experiment with render targets. My aim was to use the sketch above to create a texture map, that can be applied on the ground mesh as displacement map. One of the biggest problems of the final sketch is that it is very computationally heavy, meaning that it is very inefficient. Using the render target texture map to modify the mesh would be much better solution that increases the efficiency of the rendering, but after many failed attempts to incorporate render targets in my final sketch, I decided that current vertex modification would be a better solution to work on considering my lack of expertise in JS and time constraints. If I were to take this project further, incorporating render targets would definitely be an approach to consider.

</p>

