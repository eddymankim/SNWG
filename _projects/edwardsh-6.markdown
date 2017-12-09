---
layout: code
author: Edward Shin
title: Shin - Mini Sunken City
thumbnail: shin_thumb_3.png
week-assignment: 6
code: edwardsh/week_6
---

Mini Sunken City

This is a replication of a bridge feature from the renowned game, Monument Valley 2, in the Sunken City level.

The process was a more difficult than I originally thought. In addition to correctly positioning the nodes, I also needed to find a way to move the bridge from a click on the nearest node without affecting anything else. I used SceneUtils to parent the bridge to the clicked node and then unparent the bridge once the empty end came in contact with another. I've learned so much about raycasting, SceneUtils, parenting, and quite a few other skills in this project. One day, I would like to expand on this a create a level for a Monument Valley-esque game, as it offers potential for more exploration with these skills and related knowledge.

INSTRUCTIONS: Click on the nodes and watch the bridge rotate and move.
