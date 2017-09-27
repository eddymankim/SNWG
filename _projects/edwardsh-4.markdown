---
layout: post
author: Edward Shin
title: Shin Post 3
thumbnail: edwardsh_thumbnail.png
week-assignment: 4
---

A simple JavaScript program.

<!DOCTYPE html>

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
