---
layout: code
author: Edward Shin
title: Realms & Bridges
thumbnail: shin_thumb_final.gif
week-assignment: 15
code: edwardsh_final/week_15
---

<h2>Objective:</h2>

<p>
    The objective of this project was to create and explore a world that allows a free range of movement and perspective to interpret the environment in ways not possible from normal right-side up standpoints. This will take form of a prototype game inspired by Monument Valley, as it allows players to move their character in ways that are not normally possible.
</p>


<h2>Gameplay:</h2>

<p>
    In the start of the game, the players will be instructed on the controls and will move to the goal as a small tutorial of sorts. This should indicate what the objective of the game is without too many words so that they don't get too distracted from the gameplay.<br /> <br /> 
    
    The players can move by crossing the bridge that follows their every move and rotating on the nodes they currently stand on.<br /> <br /> 
    
    Upon reaching the goal, the game will first reveal a 3D grid that will build a sense of space in the void they occupied and create a light containment to immerse them further. The goal will then be reset on a random node. From then on, every time the player reaches the goal, the computer will generate one of three worlds at random to keep the experience fresh. <br /> <br /> 
    
    Each game world has its own unique feel. The first one consists of cubes of various sizes that affect the player's experienceand perspective while walking the bridge. The second one generates a random number transparent "rooms" in  the nodes the player can move to. This is meant to create a sense of inside and outside. The third one consists of crystal like structures all around the world. The effect is similar to the first one, except it further encourages players to look around more to explore different ways of interpreting the environment around them.<br /> <br />
    
    Also, to make the exploration more enriching the game will start with just one color for each nature element. Every round the player reaches the goal, there will be a new color will be added for the computer to choose from when constructing the worlds. Players will have the freedom to endlessy explore evolving worlds and discover new ways to interpret their surroundings in new unique ways.<br /> <br /> 
</p>

<h2>Processes & Challenges: </h2>

<p>
    The first part of development mainly focused on the mechanics of the game. I constructed The player's rotation and movement controls, which involved a lot of parenting. Along the way, I discovered that I needed to to use different types of parenting methods, as the rotation and straight movement works differently with each other. The same applied when I later implemented a small figure to indicate the player's current orientation. <br /> <br /> 
    
    On the second part, I focused on creating the aesthetics and experience for the players. As I needed to instruct player's without distracting them from the game too much, I put in 3D text to make it a part of the environment until the game starts and used as few words possible. In addition, I realized how mentally taxing it gets after the player rotates so many times, so I blacked out the screen upon rotating on the x and z axis so players can continue the game for longer periods. The y axis is not blacked out as I felt that this movement is something players are familiar with, even in normal circumstances. 
</p>


<h2>Final Thoughts: </h2>

<p>
    I feel the project gave me an excellent direction to go from. While the program may need more work as a game, I feel I had learned a lot from it as an experiment. For instance, I learned how different it is to play a game like Monument Valley in first and third point of view. I had to consider and reconsider many factors like scene transitions upon rotating to ensure tha players can experience the change without getting motion sick. <br /> <br /> 
    
    If I were to continue working with this project, I may decide to program the computer to generate separate levels with set paths instead a broad world for an even more enriching gameplay. I would also like to reprogram the controls to make a more fluid progression throughout the game. With imported models, I feel I can give players a more clear reference to how they would like to interpret the angle and perspective, in which they are experiencing the world.<br /> <br /> 
    
    Overall, I think the game mechanic that I programmed is full of endless possibilites for me to explore further into.<br /> <br /> 
</p>

<h2>Images: </h2>

<img src="img/edwardsh/world1_2.png" alt="World 1" height="400" width="600">

<img src="img/edwardsh/world2_2.png" alt="World 2" height="400" width="600">

<img src="img/edwardsh/world3_2.png" alt="World 3" height="400" width="600">