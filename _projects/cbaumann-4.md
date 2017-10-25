---
layout: post
author: "Camille Baumann-Jaeger"
title: "Javascript Trials"
thumbnail: cbaumann-thumbnail4.png
week-assignment: 4
---

My first introduction into creating interactive elements with javascript was an arduous one. I have not had a lot of experience coing with Javascript and am enthusiastic about learning what I can do. My goal for this journal entry was to make a single, interactive feature using Javascript. For the purposes of this entry, I will make a

To begin, the challenge in this assignment, for me, was to understand how the different languages interact with one another. I turned towards outside sources for instruction on how to do so and found a [pop up tutorial](https://www.w3schools.com/howto/howto_js_popup.asp) and a general [tutorial on creating windows with javascript](https://www.w3schools.com/js/js_popup.asp). Both of these helped me include a very simple, pop up feature that includes a text interaction.

I also was interested in creating a more visually appealing version of the feature, but that will be for future iterations. After this assignment, I am very  excited to learn more on how I can create amazing, interactive web pages.


<html>
<body>

<p> Click on the button below to try out my text box! </p>

<button onclick="myFunction()"> Give it a try! </button>

<p id="demo"></p>

<script>
function myFunction() {
    var color = prompt("Enter your favorite color", "color");
    if (color != null){
        document.getElementById("demo").innerHTML = "Your favorite color is " + color;
    }
}
</script>

</body>
</html>
