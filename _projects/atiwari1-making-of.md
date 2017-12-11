---
layout: post
author: Aman Tiwari
title: Making of Thermal
thumbnail: atiwari1-final-making-of.png
assignment: 98
---

Thermal

I split the process of creating Thermal into two parallel efforts, of developing the procedural generation system to create the environment and the control system.  I wanted the control system to move away from traditional 3D controls which generally fall into the categories of being aeroplane-like or being CAD like. Instead, I wanted bird-like controls, where you plan a path for the agent to follow, pointing to the next region you'd like to explore. 

### Control System

To create the control system, the first system I explored was using Catmull-Rom splines. The viewer would use the mouse to place a series of waypoints in space between which a smooth curve would be drawn, with the bird following this path. 
There were a number of problems with using this system, chiefly being that each segment of the spline is defined by 4 points, however the spline itself is only meaningfully defined between the middle two of the points (as seen in the following diagram). 
![diagram of catmul-rom spline](img/atiwari1-final-making-of/spline-diagram.png)
[source](https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline#/media/File:Catmull-Rom_Spline.png)

This means that the path between the most recently placed point and the current path of the bird is undefined, and so the viewer needs to place *another* point somewhere before being able to see the path they have planned. 

![screenshot of early control system](img/atiwari1-final-making-of/early-control-system-2.png)

![screenshot of early control system](img/atiwari1-final-making-of/early-control-system.png)

In the above image you can see that there is no path drawn between the left end of line (representing the current path of the bird) and the light blue dot, representing the most recently placed waypoint. This is a fundamental problem with this way of defining curves — intuitively, any curve needs more information than just the two endpoints (otherwise it would just be a line).

To bring in this "extra information", I thought of using the velocity of bird to distort a line into a curve. Thinking further, I realised that this is just physics, and found that by interpreting the waypoints as point sources of gravity I would get smooth movement and orbits around them. This is the system I used in the final — the user places down a waypoint, to which the bird is attracted following the laws of gravity. 
In this short video you can see how the velocity vector of the bird, drawn as the white line, moves in response to the forces applied by the waypoint.

<video src="img/atiwari1-final-making-of/ThermalProcessTrim2x.mp4" width="100%">

The other problem with this system is that it requires the user to be able to select an arbitrary point in space. In my early explorations, I used a system where there would be a 2D grid (covering the X and Z horizontal axes) upon which the user would be able to pick points to add onto the path. This grid could be moved vertically to then allow the user to pick points in 3D space. However, the grid action is not very intuitive, yet I haven't come across any other system for letting users pick arbitrary points in 3D space using just a 2D screen (and a mouse + keyboard). 

### Procedural Generation

A major motivation behind creating Thermal was my interest in exploring the procedural generation algorithm [Wave Function Collapse](https://github.com/mxgmn/WaveFunctionCollapse), developed by Maxim Gumin. My initial explorations first required me to port their 3D implementation into Unity. Following this, I started experimenting with tilesets and connection rules.

![early wfc exploration](img/atiwari1-final-making-of/wfc3.gif)

The wave function collapse (WFC) algorithm is given as input tile adjacency rules, which specify whether a certain rotation of a tile can be placed to the left of a certain rotation of another tile another tile. Using these constraints, it initialises a region of space into a "soup", where each location contains the possibilities for all tiles to exist. Then, it begins an iterative procedure of choosing the location with minimum entropy (for the first step, it chooses any location at random since they all have equal entropy), selecting a tile from the tiles that are possible for this region and collapsing that location to hold that tile. Since a tile is now placed at that location, its neighbours are now subject to the adjacency constraints of this tile. These constraints are then propagated to the locations in the neighbourhood of this tile (reducing the possible tile placements for them), and the iterative procedure is repeated till every location has a tile, or the algorithm runs into a situation where it cannot place a tile. 
In the above GIF, the size of the translucent cube represents the number of possible tile placements at that point. As tiles are selected, the number of possibilities for their neighbours decreases. The algorithm has to restart relatively often with this tileset, however it is still performant enough to give us a solution in a few seconds. 

However, after getting WFC working, I felt that I didn't fully understand how to make it work with other constraints (e.g, how to generate a system where each tile is reachable by walking from any other tile? or how to ensure that there is a certain density of tiles at each level?). In my initial conception of the project, I had wanted to also allow the user to walk as a person (i.e, have a bird mode and a person mode), so the connectivity constraint was especially important. Although it would have been possible to implement these constraints as "guess and check" (i.e after the tilemap is generated, throw it out if any of those constraints are broken), it would not have been feasible to quickly generate maps and iterate without also implementing backtracking. 

I instead decided to build on [Isaac Karth and Adam Smith's reformulation of WFC in Answer Set Programming (ASP)](https://adamsmith.as/papers/wfc_is_constraint_solving_in_the_wild.pdf). With some help from the authors of the paper, I was able to quickly get a [simple 2D implementation working](https://gist.github.com/aman-tiwari/8a7b874cb1fd1270adc203b2af293f4c). Building upon this, I was able to start generating 3D tilemaps:

![asp generation 1](img/atiwari1-final-making-of/asp1.png)
![asp generation 2](img/atiwari1-final-making-of/asp2.png)
![asp generation 3](img/atiwari1-final-making-of/asp3.png)
![asp generation 4](img/atiwari1-final-making-of/asp4.png)

The ASP procedural generation is given as input edge-labels for tiles, as well as information about what types of edges can connect to each other. For instance, the definition of the tile defining the pillar's base is

```
	pdef((pillar_4_bottom, 0), grass, grass, grass, grass, ground, pillar4).
```
This means that the tile `pillar_4_bottom` can be horizontally adjacent to tiles with edges that can connect to `grass` edges, below tiles with edges that can connect to `pillar4` edges and atop tiles with edges that can connect to `ground` edges. Given a series of tile definitions, and the generation problem formulation, the clingo (the ASP solver) gives us a configuration that satisfies these constraints. [The full source code for the ASP work is available here](https://github.com/aman-tiwari/asp-vox/blob/master/birdwfc.lp). 

Concretely, the ASP-based system let me generate buildings that satisfy different constraints, e.g, "at least 80% of the tiles on floors above 4 must be air" or "every 4 floors place down 5 building corners whilst maintaining the invariant that 50% of the other tiles are pillars". This directly lead to the diversity the in the form of the "islands" the player can explore. 

### Aesthetics

The languid feeling of the control system is reflected in the aesthetic choices. I wanted the bright, airy feeling to evoke a hot, lazy summer day, with cotton candy ground and a big blue sky. The butter-buildings were also inspired by the Butter Building level in Kirby's Adventure for the SNES, a small section of which can be seen below:
![small section of butter building](img/atiwari1-final-making-of/butter-building.jpg)
[source](https://www.youtube.com/watch?v=ObuuqcG2Mgo)

### Reflection

I am happy with how the final creation turned out. The sliding-grid control system seems to be OK to use, but definitely has a lot of room for improvement and research. Visually, I enjoy the way the buildings seem to melt away as you explore through them (due to the orthographic clipping), however I am sure there are more interesting aesthetic moves that could be made (e.g, by positing more challenging, darker environments, or introducing other more dynamic elements). I also wish that I could have extended the tileset more to have a greater diversity of generated buildings, however I am happy with the level of variation the procedural generation let me explore. I feel that the languid feeling is captured well, and interestingly obfuscates the form of the buildings in the player's distracted exploration of the space. 

![beauty shots of the final thing](img/atiwari1-final-making-of/beauty-shot1.png)
![beauty shots of the final thing](img/atiwari1-final-making-of/beauty-shot2.png)
![beauty shots of the final thing](img/atiwari1-final-making-of/beauty-shot3.png)

