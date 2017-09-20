---
layout: post
author: Ozguc
title: Exploration on Web Based AR
thumbnail: ocapunam-2.png
week-assignment: 3
---

Following first two week's discussion, I wanted to explore web based augmented reality capabilities through various examples. One of the first examples I came across was <a href="https://www.justareflektor.com">Just A Reflektor</a>. Developed using Three.js and WebGL libraries as well as many others, this example utilizes a webcam and a smartphone screen to “virtually project” the music video on your computer screen. What was interesting to me about this example was that how it is using both visual ques such as geometric shapes generated on smartphone screen and digital data from gyroscopic sensors of the phone to cast “projections” on the computer screen. Though it is complicated in a way that it utilizes multiple libraries to manage data, it gives hints to how similar approach can be used for web based AR.

<iframe width="100%" height="480" src="https://www.justareflektor.com"></iframe>

Following that, I did a quick research on readily available tools and libraries developed for web based AR and came across <a href="https://augmented.reality.news/news/free-open-source-javascript-solution-for-augmented-reality-comes-life-mobile-0176311/">news</a>. regarding open-source <a href="https://github.com/jeromeetienne/AR.js/blob/master/README.md">AR.js</a> library. According to the article this library, which is released at the beginning of 2017, is capable of efficiently AR rendering of 3D objects and/or animations.

<iframe width="100%" height="480" src="https://www.youtube.com/embed/0MtvjFg7tik?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>

One of the examples that was shared in the article caught was particularly interesting in that it was calculating real time distance in between AR stickers. I believe that rather than using AR stickers as base to 3D objects, defining them as points in real world would be another approach to how AR can be utilized. Building upon this idea, parametric surfaces can be generated over the set of points that are defined in real world and can be updated in real time.

<iframe width="100%" height="480" src="https://www.youtube.com/embed/dIEZwmjuaUA?rel=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>
