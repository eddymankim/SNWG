---
layout: full
title: Project Proposal
permalink: /code/acassel-9/
author: adrienne
---

For this project I want to explore how you can use audiovisual techniques to represent a replicated feeling of weight, dimension & tangibility in a 3D space. I propose to create a kind of audiovisual switchboard that takes either real time looped audio or pre-set multi tracks and represents the different sounds and textures with corresponding 3D models. The 3D models will be separate to each track, or a singular mesh that tweens into different shapes based on the given audio components. The parts could be either modular components that make a puzzle type game or primitives that have simple corresponding transformations to the sound. There will be keyboard controls that would modify the audio loops according to different parameters like amplitude, phase, and cutoff. For example, j,k,l,;  could trigger on/off each audio track and w,a,s,d, would modify the waveform with these different parameters. The corresponding visual transformations of the meshes will mimic and exaggerate properties of the physical world. Ultimately it will be a sort of noise deformation. A low rumbling sound from a low-pass filter would have a round granular-type visual effect on the lower parts of the model, a high-pass filter would show multiple vibrating sharp points all over. The colors will be how I see different notes in whatever key the audio is in. 

The way I plan to go about this is by using a Fourier transform function to get the frequency spectrum and synthesize that data to control the mesh. My original idea was to somehow use Max MSP with WebGL because it has an easy node-based approach and creates & stores bins that you can route to different operations. Instead, I'm going to try and code this function through javascript and incorporate it into THREE.js since there doesn't seem to be a viable way to combine the two. I'm going to create the models in Blender and export them into obj. I'm going to figure out if there is a way to store vertex coordinate transformations in exported files from 3D software to make it easier to code the mesh. Another possible way to modify the mesh is extruding the normals of the mesh, which would result in just an overall distortion. In this case, I would use the lower bin values of the Fourier transform which would end up looking like a beat visualizer.  

![img1](../../img/acassel/proposal.png){: width="50%"}
![img2](../../img/acassel/sketch.png){: width="100%"}

Some inspiration for this project is Patatap, which was made entirely in p5.js and noise deformations made in Max MSP.


<a href="http://www.patatap.com" target="_blank">Patatap</a>

<a href="https://www.youtube.com/watch?v=qf1OGUeIs1s" target="_blank">MaxMSP video</a>



