---
layout: post
author: Ozguc
title: Field of Lights
thumbnail: ocapunam-7.png
week-assignment: 7
---
<iframe width="100%" height="480" src="/code/ocapunam-workshop-1/"></iframe>
<div id="text">
Following last weeks renderer workshop, I wanted to implement what I’ve experimented with so far in the realm of three.js. For the past few weeks, I’ve been working with random object generation, raycaster pointing and keyboard inputs. Using the boilerplate we have built in the workshop, I wanted to create a field of lights of varying height. Unfortunately, I was not able to run keyPressed event it in the post but if you visit this <a href="../code/ocapunam-workshop-1/">link</a>, you can add random lights by pressing ‘A’. But beware, the scene gets really heavy, really quick.

In order to limit the number of elements in the scene, I’ve tried to implement a size constraint and tried to remove items after the number of elements reaches the limit using following code but I was not able to remove it successfully since the length of the array grew unpredictably.<br /><br />

    ///if (objects.length > 10){<br />
    ///  objects.pop(0);<br />
    ///  thing.remove(objects.pop(0));<br /><br />

Lastly, I tried to implement a raycaster create light poles at the pointed coordinates but this time I faced another error,<br /> “THREE.Raycaster: Unsupported camera type.”<br /> Even though I’ve tried to call camera as this.camera, thing.camera and others that I could think of, I was not able to make it work.<br /><br /> 
</div>