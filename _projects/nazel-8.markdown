---
layout: post
author: Nico
title: Object Production In Mass
thumbnail: Nico-W8.png
week-assignment: 8
---

<!--<script src= "https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.js"></script> -->
<script src="../code/nazel/nazel-snips/dat.gui.min.js"></script>
<script src="../code/nazel/nazel-snips/stats.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.js"></script>
<script src="../code/nazel/nazel-snips/loaders/MTLLoader.js"></script>
<script src="../code/nazel/nazel-snips/loaders/OBJLoader.js"></script>
<script src="../code/nazel/nazel-snips/loaders/DDSLoader.js"></script>

<!--<script src="../code/nazel/nazel-snips/OrbitControls.js"></script>-->
<div class="grid-container" >
      <div class="row" style = "padding: 1em;">
        <div class = "large-4 medium-4 small-4 colums">
        </div>
        <div class = "large-4 medium-4 small-4 colums">
        </div>
        <div class = "large-4 medium-4 small-4 colums">
        </div>
      </div>
      <div class="row" style = "padding: 1em;">
        <div align="CENTER">
          <h3> Forest Fly Over </h3>
          <p> This is a test of loading in large amounts of different objects from a little object library. I downloaded the objects from <a href = "http://superpowers-html5.com/index.en.html"> Super Powers </a> gamed development and sharing platform. </p>
        </div>
    </div>
    <div class="row" style = "padding: 1em;">
        <div class = "large-4 medium-4 small-4 colums" id = "my-gui-div">

        </div>

        <div class = "large-8 medium-8  small-8 colums" id="3dDiv" style = "float:right;">
        </div>
    </div>
</div><!-- end grid container-->
<script deferred type="module" src="../code/nazel/nazel-8/nazel-8.js">
