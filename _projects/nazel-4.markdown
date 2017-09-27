---
layout: post
author: Nico
title: JS on DOM
thumbnail: Nico-W4.png
week-assignment: 3
---

<!-- cd /mnt/c/Users/nicol/GitHub/SNWG -->
<!-- jekyll serve -->

<!-- Other JS plugins can be included here -->




<div class="grid-container" >
  <div class="grid-x grid-padding-x" ><!-- this is my primary group-->


    <div class="large-12 cell row" style = "padding: 1em;">
      <div class="large-12 cell row">
          <h1 align="center" > Nico's Third Post</h1>
      </div>
      <div class="large-12 cell row">
        <div class="large-4 cell columns" align="right">
             <p>Enter a number between 5 and 25:</p>
        </div>
        <div class="large-3 cell columns">
               <input id="gridSizeInputField" type="number" min="5" max="25" required style="background:#9d9d9e;">
         </div>
         <div class="large-5 cell columns">
               <button style="outline-color: #9d9d9e;" onClick="GridSizeEnterButton()"> >Press to Enter< </button>
         </div>
     </div> <!-- end input row-->
    </div><!-- Row 1 end-->

    <div class="large-12 " align="center" id="gameSpace" style="background:pink;overflow:auto; min-height:5em; border-radius:1em; border-style:solid; border-color:#732665;"> <!-- drone stuff Group group-->
    </div><!-- Row 2 end-->

    <div class="large-12 cell row"  align="center"> <!-- notes -->
      <h3>
        ^^drawing thingy^^
      </h3>
    </div><!-- notes END-->


  </div><!-- grix x end-->

</div><!-- end container-->
<script>
    var gameDiv = document.getElementById("gameSpace");

    function GridSizeEnterButton() {
        var inPutObj = document.getElementById("gridSizeInputField");
        if (inPutObj.checkValidity() == false) {
            while (gameDiv.hasChildNodes()) {
                  gameDiv.removeChild(gameDiv.lastChild);
              }
            var ahahahGif = document.createElement("img");
                ahahahGif.setAttribute("src",'/img/nazel/nazel-3/Denis-jurasic-park-gif-ahahah.gif');
                ahahahGif.setAttribute("height", "100px");
                ahahahGif.setAttribute("width", "100px");
            var payAttention = document.createElement('p');
            payAttention.innerHTML ="follow the directions";
            document.getElementById("gameSpace").appendChild(ahahahGif);
            document.getElementById("gameSpace").appendChild(payAttention);


        } // end if
        else {
            while (gameDiv.hasChildNodes()) {
                  gameDiv.removeChild(gameDiv.lastChild);
              }//end while
            var inputGridSize = document.getElementById("gridSizeInputField").value;
            for (var i = 0; i<inputGridSize; i+=1){
              for (var j = 0; j<inputGridSize; j+=1){
                var cardDiv = document.createElement('div');
                //cardDiv.style.overflow= "auto";
                cardDiv.style.background= "black";
                cardDiv.style.width= "25px";
                cardDiv.style.height= "25px";
                var isDivClicked = document.createAttribute("data-wasclicked");
                isDivClicked.value = "off";
                cardDiv.setAttributeNode(isDivClicked)
                cardDiv.addEventListener("mouseenter",function(event){

                  let clickStatus = event.target.getAttribute('data-wasclicked');
                  console.log(">>entering "+String(clickStatus));
                    if(clickStatus== "off"){
                      event.target.style.background = "#8bc5c5";
                    }
                    else{
                      event.target.style.background="#c1b52a";
                    }
                  }, false);
                cardDiv.addEventListener("mouseleave",function(event){
                    let clickStatus = event.target.getAttribute('data-wasclicked');
                    console.log(">>leaving "+String(clickStatus));
                    if(clickStatus == "off"){
                      event.target.style.background = "black";
                    }
                    else{
                      event.target.style.background= "#70c124";
                    }
                  }, false);
                cardDiv.addEventListener("click",function(event){
                  event.target.style.background= "#70c124";
                  let clickStatus = event.target.getAttribute('data-wasclicked');
                  event.target.dataset.wasclicked = "on";
                  console.log(clickStatus);
                //  if (clickStatus == "off"){clickStatus= "on";}
                  //else{clickStatus= "off";}
                  //event.target.dataset.wasclicked = clickStatus;
                  //event.target.getAttribute('data-wasClicked')
                  //clickStatus = !clickStatus;
                  console.log(clickStatus);
                }, false);

                gameDiv.appendChild(cardDiv);
                console.log("doin-suptin");
              }

            }//end for grid
        }//end else
    }//end grid size function

</script>
