---
layout: post
author: Nico
title: Checking Out Design Explorer
thumbnail: Nico-W3.png
week-assignment: 3
---

<!-- cd /mnt/c/Users/nicol/GitHub/SNWG -->
<!-- jekyll serve -->

<!-- Other JS plugins can be included here -->




<div class="grid-container" >
  <div class="grid-x grid-padding-x" ><!-- this is my primary group-->


    <div class="large-12 cell row" style = "padding: 1em;">
      <h1 align="center" >
             Nico's Third Post</h1>
             <p>Enter a number between 5 and 25:</p>
             <input id="gridSizeInputField" type="number" min="5" max="25" required style="background:#9d9d9e;">
             <button style="outline-color: #9d9d9e;" onClick="GridSizeEnterButton()"> >Press to Enter< </button>
    </div><!-- Row 1 end-->

    <div class="large-12 cell row" align = "center" id="gameSpace"> <!-- drone stuff Group group-->
    </div><!-- Row 2 end-->

    <div class="large-12 cell row"  align="center"> <!-- notes -->
      <h3>
        drawing thingy
      </h3>
    </div><!-- notes END-->


  </div><!-- grix x end-->

</div><!-- end container-->
<script>
    var gameDiv = document.getElementById("gameSpace");
    var cardDiv = document.createElement('div');
    cardDiv.style.color= "black";
    cardDiv.addEventListener("mouseenter",
      function(event){
          event.target.style.color = "#8bc5c5";
        }, false);

    function GridSizeEnterButton() {
        var inPutObj = document.getElementById("gridSizeInputField");
        if (inPutObj.checkValidity() == false) {
            while (gameDiv.hasChildNodes()) {
                  gameDiv.removeChild(gameDiv.lastChild);
              }
            var ahahahGif = document.createElement("IMG");
                ahahahGif.setAttribute("src","/img/nazel/nazel-3/Denis-jurasic-park-gif-ahahah.gif");
                ahahahGif.setAttribute("height", "500");
                ahahahGif.setAttribute("width", "500");
            var payAttention = document.createElement('p').innerHTML ="follow the directions";
            document.getElementById("gameSpace").appendChild("ahahahGif");
            document.getElementById("gameSpace").appendChild("payAttention");

        } // end if
        else {
            while (gameDiv.hasChildNodes()) {
                  gameDiv.removeChild(gameDiv.lastChild);
              }//end while
            var inputGridSize = document.getElementById("gridSizeInputField").value;
            for (var i = 0; i<inputGridSize; i++){
              for (var j = 0; i<inputGridSize; j++){
                gameDiv.addChild("cardDiv");
              }
            }//end for grid
        }//end else
    }//end grid size function

</script>
