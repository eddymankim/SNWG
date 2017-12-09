---
layout: post
author: Edward Shin
title: Shin Post 3
thumbnail: shin_thumbnail.png
week-assignment: 4
---


<!DOCTYPE html>
<p>
This is a minature mad-libs program that uses prompt() to ask the user for the appropriate input and then creates a
    message based on those inputs. While I have extensive knowledge on JavaScript, I decided I wanted to back track 
    a bit to reinforce the basics and see if I can advance in my programming at a different perspective. I especially
    feel this would be useful since I will be learning and using a lot of three.js. Considering I will be doing a lot
    of visual work for most of the semester, I thought I would use this chance to make something fun and humorous through 
    words. This, I hope, would give me a bit of practice in being creative.
</p>

<script type="text/javascript">
    prompt("What's up? ");
    var noun = prompt("Type a noun");
    var verb = prompt("Type a verb");
    var noun2 = prompt("Type another noun");
    var verb2 = prompt("Just one more verb please");
    var noun3 = prompt("One noun. This is the last one. I promise");
    var verb3 = prompt("Sorry, one more verb...please");
    var message = "How to make a " + noun + " :\n" +
                    "First, you " + verb + " the " + noun2 + ".\n" +
                    "Then, you " + verb2 + " a " + noun3 + ".\n" +
                    "Finally, you " + verb3 + " everything.";
    alert(message);
</script>
