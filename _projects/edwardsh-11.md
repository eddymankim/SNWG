---
layout: code
author: Edward Shin
title: Shin - Final Project Phase 1
thumbnail: shin_thumb_6.png
assignment: 11
code: edwardsh/week_11
---

<h2>Phase 1:</h2>

<p>
    In the first phase, my objective was to create a much larger grid of nodes for the player to traverse. The player should be able to move the bridge by moving across it and/or rotating the bridge by rotating the current node it stands on. The controls should remain consistent and not be affected by the many reorientations of the camera.
</p>

<h2>Progress: </h2>

<p>
    After deciding and implementing a number of nodes to make up the grid, I spent a majority of my time coding the rotational axis for changing the orientation of the camera and the bridge. Most of the solutions I came up with got me caught in the gimbal lock or scrambled the positions of the axes. Eventually, I was able to solve the problem in a combination of quaternion rotation and axis manipulation.
</p>

<h2>What's Next: </h2>

<p>
    Naturally, I need to program movement across the bridge while preserving the consistent axial rotations for the player. Along with that, I also plan on researching different forms and patterns for the computer to generate at random to create my world. I have already sketched out the placement of the core areas where generation would start and how they could potentially grow and immerse the users. I also want to program in the option to rotate the camera to allow players to view their surroundings however they want.

    While this may go ahead of schedule, I am also strongly considering the gameplay in this program. Initially, I thought of letting players change the environment with the press of a key. After receiving feedback about making the intentions more specific, however, I had a better idea: create a goal point for players to find that would create a new world with a new location for the goal. By doing this, I hope to give players even more incentive to explore in various directions and angles and create more excitement for the game.

    I am also putting serious consideration into how the game's mechanics and controls should be introduced in order to give players the best possible experience.
</p>

<h2>Sketches: </h2>

<img src="img/edwardsh/sketch1.jpg" alt="Sketch 1" height="400" width="600">

<img src="img/edwardsh/sketch2.jpg" alt="Sketch 2" height="400" width="600">
