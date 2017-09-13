---
layout: post
author: Nico
title: Post A1
thumbnail: Nico-W2.png
week-assignment: 2
---
<div class="grid-container" >
  <div class="grid-x grid-padding-x" ><!-- this is my primary group-->
  <div class="large-12 cell row"> <!-- drone stuff Group group-->

    <div class="large-12 cell columns">
      <h1 align="center">
             Nico's First Post</h1>
    </div><!-- Row 1 end-->

    <div class="large-12 cell row">
      <div class="large-4 medium-4 cell columns">
        <img class="point_images"
        src="{{site.url}}/img/nazel/nazel-1/Survey_PointCloud_Buildings_01.png"
        style="
        min-width: 100px
        max-width: 300px;
        min-height:100px
        max-height 300px:">
      </div>

      <div class="large-4 medium-4 cell columns">
          <img class="point_images"
          src="/img/nazel/nazel-1/Survey_PointCloud_SparceCloud_01.png"
          style="
          min-width: 100px
          max-width: 300px;
          min-height:100px
          max-height 300px:">
      </div>

      <div class="large-4 medium-4 cell columns">
          <img class="point_images"
          src="/img/nazel/nazel-1/Survey_PointCloud_Classification_01.png"
          style="
          min-width: 100px
          max-width: 600px;
          min-height:100px
          max-height 600px:">
      </div>
    </div><!-- Row 2 end-->

    <div class="large-12 cell row">
      <h3 align="center">This is a model I made using a drone. It should be a little bit cool.</h3>
    </div><!-- Row 3 end-->

    <div class="large-12 cell row">

      <div class="large-3 cell columns">
        < p align="center"style = "padding-top: 4em;"> This interactive frame was made using Potree A app built on Three.js</p>
      </div> <!-- col with side caption end-->

      <div class="large-9 cell columns">
          <iframe src="http://riverroots.computingurbanism.com"
            style = "
            min-height:600px;
            min-width:800px;">
          </iframe>
        </div><!-- col with potree end-->
    </div><!-- Row 4 end-->
  </div><!-- drone stuff Group END-->

  <div class="large-12 cell row"><!-- sketchfab -->
      <div class="large-3 medium-3 cell columns">
        <h3>This is a model I made using a drone. It should be a little bit cool.</h3>
      </div>
      <div class="large-9 medium-9 cell columns">
        <div style = "min-width:800px;min-height:600px">
            <div class="sketchfab-embed-wrapper"><iframe width="800" height="600" src="https://sketchfab.com/models/96c76926e6674ca3a2bff93d7dc62277/embed"  allowvr allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true" onmousewheel=""></iframe><p style="font-size: 13px; font-weight: normal; color: #4A4A4A;"><a href="https://sketchfab.com/models/96c76926e6674ca3a2bff93d7dc62277?utm_medium=embed&utm_source=website&utm_campain=share-popup" target="_blank" style="font-weight: bold; color: #1CAAD9;">Lovell Mesh L-txt</a> by <a href="https://sketchfab.com/nazel?utm_medium=embed&utm_source=website&utm_campain=share-popup" target="_blank" style="font-weight: bold; color: #1CAAD9;">nazel</a> on <a href="https://sketchfab.com?utm_medium=embed&utm_source=website&utm_campain=share-popup" target="_blank" style="font-weight: bold; color: #1CAAD9;">Sketchfab</a></p></div>
            </div>
      </div><!-- end of sketchfab-->
      <div class="large-12 cell row"><!-- class notes-->
        <h3 align = "center">
        notes on running Jekyll on Win10:</h3><p>run ubuntu cmd shell</p><p> to get to windows directory use : cd /mnt/"path": </p><p>
        i.e. cd /mnt/d/_10_Git_/SNWG <p></p>
        <p>/mnt/ takes you to the windows partitions, and out of the virtual linux dirs</p>
        then : jekyll serve</p><p>
        </p><h3 align="center">
        Outstanding questions:</h3><p>
        Is the Layout Author ect. at the top a Jekyll thing or a Foundations thing? - after working today I think it must Jekyll, and would like to learn how to set that up</p><p>
        </p>
      </div><!-- end of class notes-->
  </div><!-- primary group END-->




<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script>
$(document).ready(function(){

    $( "#result" ).load( "/img/nazel/nazel-1/Survey_PointCloud_Site_01.png" );
    $(".point_images").each(function(){
      var thisSRC = $(this).attr("src");
      $(this).hover(
        function(){
            $(this).attr('src', function (i, src) {
              return src.replace(thisSRC, "/img/nazel/nazel-1/Survey_PointCloud_Site_01.png")
              })
          },
          function(){
            $(this).attr('src', function (i, src) {
            return src.replace("/img/nazel/nazel-1/Survey_PointCloud_Site_01.png", thisSRC)
            })
          }
      );
    });
});
</script>
