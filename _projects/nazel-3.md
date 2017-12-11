---
layout: post
author: Nico
title: Checking Out Design Explorer
thumbnail: Nico-W3.png
assignment: 3
---

<!-- cd /mnt/c/Users/nicol/GitHub/SNWG -->
<!-- jekyll serve -->

<!-- Other JS plugins can be included here -->




<div class="grid-container" >
  <div class="grid-x grid-padding-x" ><!-- this is my primary group-->


    <div class="large-12 cell row" style = "padding: 1em;">
      <h1 align="center" >
             Nico's Second Post</h1>
      <p> Design explorer seems to have been developed by
        <a href="http://core.thorntontomasetti.com/">CORE Studio / Thornton Tomasetti's R&D</a>.
         It uses D3.js : a javascript libray that can control dom elements and dynamicly construct svgs.
          It's a leading data visualization library.
          Embeded in the page is also some three.js spin off called
          <a href="http://va3c.github.io/">va3c</a>
            used for architecture models.
      </p>
    </div><!-- Row 1 end-->

  <div class="large-12 cell row" align = "center"> <!-- drone stuff Group group-->

    <div class="large-4 medium-4 cell columns" >
        <img
        alt="image of d3"
        src="/img/nazel/nazel-2/d3-icon-data-dynamic-documentation-svg.png"
        style="
        position: relative;
        align = center;
        min-width: 100px;
        max-width: 250px;
        min-height:100px;
        max-height 250px;">
    </div>

      <div class="large-4 medium-4 cell columns" >
          <img
          alt="image of svg"
          src="/img/nazel/nazel-2/SVG-logo-graphic-vector-icon.jpg"
          style="
          min-width: 100px;
          max-width: 250px;
          min-height:100px;
          max-height 250px;">
      </div>

      <div class="large-4 medium-4 cell columns">
          <img
          alt="image of Three-js"
          src="/img/nazel/nazel-2/three-js-3d-web-graphics-icon.jpg"
          style="
          min-width: 100px;
          max-width: 250px;
          min-height:100px;
          max-height 250px;">
      </div>
    </div><!-- Row 2 end-->
    <div class="large-12 cell row" data-equalizer> <!-- Row 3-->
      <h2 align = "center"  style = "padding: 1em;" >  Design Explorer Example </h2>
    </div>
    <div class="large-12 cell row"> <!-- design explorer -->
      <iframe src="https://goo.gl/7sGAcb"
       title="design exploror embed" width="1200px" height="600px">
        <p>Hey! Did it not show up?</p>
      </iframe>        >
    </div><!-- design explorer end -->

    <div class="large-12 cell row"  align="center"> <!-- notes -->
      <h3>
        This is open source and can upload handle any models, images, and data you want.
        <h4> It even lets you refrance your data right out of google drive. </h4>
      </h3>
      <p align = "left" style = "margin-left:2em;"> It's all hosted on GitHub so you can hack it yourself. I would like to try and take some time to trim down the interface so that it is a little more simple and clean and then use it with students to study thier own designs in comparison to one another. I has issues though when I tried to upload my 3d models. </p>
      <ul align = "left" style = "margin-left:2em;">
        <li>
          <h5>Link test Grasshopper plugin? :<a href="https://github.com/va3c/GHva3c">https://github.com/va3c/GHva3c</a>   [this exports 3d models to three.js]</h5>
        </li>
        <li>
          <h5>Link to the base Grasshopper plugin :<a href="http://www.food4rhino.com/app/spectacles">http://www.food4rhino.com/app/spectacles</a>   [this exports 3d models to three.js]</h5>
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
