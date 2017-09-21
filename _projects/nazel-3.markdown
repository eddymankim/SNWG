---
layout: post
author: Nico
title: Checking out Design Explorer
thumbnail: Nico-W3.png
week-assignment: 3
---
<div class="grid-container" >
  <div class="grid-x grid-padding-x" ><!-- this is my primary group-->


    <div class="large-12 cell row">
      <h1 align="center">
             Nico's Second Post</h1>
    </div><!-- Row 1 end-->

  <div class="large-12 cell row"> <!-- drone stuff Group group-->

    <div class="large-4 medium-4 cell columns">
        <img
        alt-"image of d3"
        src="/img/nazel/nazel-2/d3-icon-data-dynamic-documentation-svg"
        style="
        min-width: 100px
        max-width: 600px;
        min-height:100px
        max-height 600px:">
    </div>

      <div class="large-4 medium-4 cell columns">
          <img
          alt-"image of svg"
          src="/img/nazel/nazel-2/SVG-logo-graphic-vector-icon.svg"
          style="
          min-width: 100px
          max-width: 600px;
          min-height:100px
          max-height 600px:">
      </div>

      <div class="large-4 medium-4 cell columns">
          <img
          alt-"image of Three-js"
          src="/img/nazel/nazel-2/three-js-3d-web-graphics-icon.jpg"
          style="
          min-width: 100px
          max-width: 600px;
          min-height:100px
          max-height 600px:">
      </div>
    </div><!-- Row 2 end-->
    <div class="large-12 cell row"> <!-- design explorer -->

        https://goo.gl/Zf85Po>
    </div><!-- design explorer end -->

    <div class="large-12 cell row"> <!-- notes -->
      <h3 align="center">
        This is open source and can upload whatever models images and data you want to google drive
      </h3>
      <ul>
        <li>
          <h5>Link to the base Grasshopper plugin :<a href="https://github.com/va3c/GHva3c">https://github.com/va3c/GHva3c</a>   [this exports 3d models to three.js]</h5>
        </li>
        <li>
          <h5>Link to the base website / navigator: <a href="http://tt-acm.github.io/DesignExplorer/">http://tt-acm.github.io/DesignExplorer/ </a> </h5>
        </li>
        <li>
          <h5>this is to the github of design explorer:<a href="https://github.com/tt-acm/DesignExplorer">https://github.com/tt-acm/DesignExplorer</a> </h5>
        </li>
        <li>
          <h5> this is the embeded 3d viewer built for Arch platforms based on three.js <a href="http://va3c.github.io/">http://va3c.github.io/</a> </h5>
        </li>
    </ul>
    </div><!-- notes END-->


  </div><!-- grix x end-->

</div><!-- end container-->


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
