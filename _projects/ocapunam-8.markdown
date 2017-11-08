---
layout: post
author: Ozguc
title: terraSwarm
thumbnail: ocapunam-8.gif
week-assignment: 8
---

As we transition from weekly challenges where we explored different aspects of javaScript and three.js, I started to think how I can reflect my experience with web graphics. So far in my previous posts, I tried to utilize a generative approach to each challange. By doing so, I was aiming to explore how this platform can become an interface, a tool for generative modeling. Though I was only scratching the surface, I am hoping to take this further and explore one idea in depth.

<img class="point_images" src="/img/ocapunam/ocapunam_8_1.jpg">

The image above, is a product of a week long exploration I did in Inquiry into Computation, Architecture and Design course here in CMU. Our inquiry was to explore artifacts of agent-based algorithms. In this particular example I mapped a swarm agents over a spherical mesh, where they are walking along the vertices of the mesh. By recording their movements, I was able to generate a height data that later modified the mesh and created the artifact above. Below you can see how agents are controlled through parameters to result in different behaviour as well as a diagramatic explanation of how it is mapped on the sphere.

<iframe src="https://player.vimeo.com/video/241810263?title=0&byline=0&portrait=0" width="100%" height="640" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

Since it was a very short project, spaninning only a week, I believe that the results can be improved. And as my final project in this course, I would like to build upon this previous exploration and create plaform that would allow users to create their own 'tinny low poly world'. In this web applet, users would be able to create individual agents with parameters such as cohesion and seperation. Users would let these agents run on their tiny planet for a specified amount of 'lifespan'. By changing how the agent modifies the world, depositing on or eating away from the planet, the users would be indirectly shape their own planet.

After my brief discussion last week with Ben, I started looking into how agents can modify the bump map and texture map in realtime. One other way would be to modify mesh vertexes in real time and use height data to create the texture map. I am not entirely sure which way would better suit my needs but to add another dimension to this project, allowing users to download their 3D worlds would also be an interesting output which can be materialized using rapid prototyping.