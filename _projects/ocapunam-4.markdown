---
layout: post
author: Ozguc
title: prompt(?)
thumbnail: ocapunam-4.png
week-assignment: 4
---
<script type="text/javascript">
    var name = "";
    var counter = 0;
    var color;
    var r = confirm("Do you want to share your name? This is for a good cause.");
    if (r == true) {
        name = prompt("Excellent! What is your name?");
        txt = ("You did the right thing " + name +"!");
    }
    else {
        txt = "You little rebel! I like you."
    }
    
    function setColor() {
    counter = counter + 1
    if (counter%4 == 0) {
    document.getElementById("text").style.color = '#000000';
    document.body.style.backgroundColor = "#ffffff";
    }
    else if (counter % 4 == 1) {
    document.getElementById("text").style.color = '#ffffff';
    document.body.style.backgroundColor = "#587498";
    }
    else if (counter%4 == 2) {
    document.getElementById("text").style.color = '#ffffff';
    document.body.style.backgroundColor = "#FFD800";
    }
    else {
    document.getElementById("text").style.color = '#ffffff';
    document.body.style.backgroundColor = "#E86850";
    }
}
</script>
<div id="text">

<script type="text/javascript">
     document.write(txt);
</script><br />

This is my first take on popups and let me go ahead and say that I enjoyed playing around with popups that I usually hate as a user. For those who did not understand what I did there, I recommend that you refresh the page and try to change your inputs.<br />
I think what makes this interesting to me is that, this opens up a whole new world. Until now, the communication with the users was more one sided. The user often is given a passive role, only consuming the media in the page. But the introduction of javaScript, in my opinion, enables the user to be more active, and even take part of content creation process.<br /><br />

<button type="button" onclick="setColor()">Just try it!</button><br /><br />
I then went ahead and looked for some other types of basic interaction tools that are native to javaScript. One of them was obviously the button. I wrote a basic function that cylces through 3 pre-defined colors as background color and changes the color of the text accordingly. In order to properly edit the color of the text, I defined a HTML division and applied the changes on that div.
</div>