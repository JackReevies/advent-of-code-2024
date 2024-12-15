# Day 15: Warehouse Woes 
You appear back inside your own mini submarine! Each Historian drives their mini submarine in a different direction; maybe the Chief has his own submarine down here somewhere as well?

You look up to see a vast school of [lanternfish](https://adventofcode.com/2021/day/6) swimming past you. On closer inspection, they seem quite anxious, so you drive your mini submarine over to see if you can help.

Because lanternfish populations grow rapidly, they need a lot of food, and that food needs to be stored somewhere. That's why these lanternfish have built elaborate warehouse complexes operated by robots!

These lanternfish seem so anxious because they have lost control of the robot that operates one of their most important warehouses! It is currently running amok, pushing around boxes in the warehouse with no regard for lanternfish logistics **or** lanternfish inventory management strategies.

Right now, none of the lanternfish are brave enough to swim up to an unpredictable robot so they could shut it off. However, if you could anticipate the robot's movements, maybe they could find a safe option.

The lanternfish already have a map of the warehouse and a list of movements the robot will **attempt** to make (your puzzle input). The problem is that the movements will sometimes fail as boxes are shifted around, making the actual movements of the robot difficult to predict.

For example:

```
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

&lt;vv&gt;^&lt;v^&gt;v&gt;^vv^v&gt;v&lt;&gt;v^v&lt;v&lt;^vv&lt;&lt;&lt;^&gt;&lt;&lt;&gt;&lt;&gt;&gt;v&lt;vvv&lt;&gt;^v^&gt;^&lt;&lt;&lt;&gt;&lt;&lt;v&lt;&lt;&lt;v^vv^v&gt;^
vvv&lt;&lt;^&gt;^v^^&gt;&lt;&lt;&gt;&gt;&gt;&lt;&gt;^&lt;&lt;&gt;&lt;^vv^^&lt;&gt;vvv&lt;&gt;&gt;&lt;^^v&gt;^&gt;vv&lt;&gt;v&lt;&lt;&lt;&lt;v&lt;^v&gt;^&lt;^^&gt;&gt;&gt;^&lt;v&lt;v
&gt;&lt;&gt;vv&gt;v^v^&lt;&gt;&gt;&lt;&gt;&gt;&gt;&gt;&lt;^^&gt;vv&gt;v&lt;^^^&gt;&gt;v^v^&lt;^^&gt;v^^&gt;v^&lt;^v&gt;v&lt;&gt;&gt;v^v^&lt;v&gt;v^^&lt;^^vv&lt;
&lt;&lt;v&lt;^&gt;&gt;^^^^&gt;&gt;&gt;v^&lt;&gt;vvv^&gt;&lt;v&lt;&lt;&lt;&gt;^^^vv^&lt;vvv&gt;^&gt;v&lt;^^^^v&lt;&gt;^&gt;vvvv&gt;&lt;&gt;&gt;v^&lt;&lt;^^^^^
^&gt;&lt;^&gt;&lt;&gt;&gt;&gt;&lt;&gt;^^&lt;&lt;^^v&gt;&gt;&gt;&lt;^&lt;v&gt;^&lt;vv&gt;&gt;v&gt;&gt;&gt;^v&gt;&lt;&gt;^v&gt;&lt;&lt;&lt;&lt;v&gt;&gt;v&lt;v&lt;v&gt;vvv&gt;^&lt;&gt;&lt;&lt;&gt;^&gt;&lt;
^&gt;&gt;&lt;&gt;^v&lt;&gt;&lt;^vvv&lt;^^&lt;&gt;&lt;v&lt;&lt;&lt;&lt;&lt;&gt;&lt;^v&lt;&lt;&lt;&gt;&lt;&lt;&lt;^^&lt;v&lt;^^^&gt;&lt;^&gt;&gt;^&lt;v^&gt;&lt;&lt;&lt;^&gt;&gt;^v&lt;v^v&lt;v^
&gt;^&gt;&gt;^v&gt;vv&gt;^&lt;&lt;^v&lt;&gt;&gt;&lt;&lt;&gt;&lt;&lt;v&lt;&lt;v&gt;&lt;&gt;v&lt;^vv&lt;&lt;&lt;&gt;^^v^&gt;^^&gt;&gt;&gt;&lt;&lt;^v&gt;&gt;v^v&gt;&lt;^^&gt;&gt;^&lt;&gt;vv^
&lt;&gt;&lt;^^&gt;^^^&lt;&gt;&lt;vvvvv^v&lt;v&lt;&lt;&gt;^v&lt;v&gt;v&lt;&lt;^&gt;&lt;&lt;&gt;&lt;&lt;&gt;&lt;&lt;&lt;^^&lt;&lt;&lt;^&lt;&lt;&gt;&gt;&lt;&lt;&gt;&lt;^^^&gt;^^&lt;&gt;^&gt;v&lt;&gt;
^^&gt;vv&lt;^v^v&lt;vv&gt;^&lt;&gt;&lt;v&lt;^v&gt;^^^&gt;&gt;&gt;^^vvv^&gt;vvv&lt;&gt;&gt;&gt;^&lt;^&gt;&gt;&gt;&gt;&gt;^&lt;&lt;^v&gt;^vvv&lt;&gt;^&lt;&gt;&lt;&lt;v&gt;
v^^&gt;&gt;&gt;&lt;&lt;^^&lt;&gt;&gt;^v^&lt;v^vv&lt;&gt;v^&lt;&lt;&gt;^&lt;^v^v&gt;&lt;^&lt;&lt;&lt;&gt;&lt;&lt;^&lt;v&gt;&lt;v&lt;&gt;vv&gt;&gt;v&gt;&lt;v^&lt;vv&lt;&gt;v^&lt;&lt;^
```
As the robot (`@`) attempts to move, if there are any boxes (`O`) in the way, the robot will also attempt to push those boxes. However, if this action would cause the robot or a box to move into a wall (`#`), nothing moves instead, including the robot. The initial positions of these are shown on the map at the top of the document the lanternfish gave you.

The rest of the document describes the **moves** (`^` for up, `v` for down, `&lt;` for left, `&gt;` for right) that the robot will attempt to make, in order. (The moves form a single giant sequence; they are broken into multiple lines just to make copy-pasting easier. Newlines within the move sequence should be ignored.)

Here is a smaller example to get started:

```
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

&lt;^^&gt;&gt;&gt;vv&lt;v&gt;&gt;v&lt;&lt;
```
Were the robot to attempt the given sequence of moves, it would push around the boxes as follows:

```
Initial state:
########
#..O.O.#
##**@**.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move &lt;:
########
#..O.O.#
##**@**.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move ^:
########
#.**@**O.O.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move ^:
########
#.**@**O.O.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move &gt;:
########
#..**@**OO.#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move &gt;:
########
#...**@**OO#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move &gt;:
########
#...**@**OO#
##..O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

Move v:
########
#....OO#
##..**@**..#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

Move v:
########
#....OO#
##..**@**..#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

Move &lt;:
########
#....OO#
##.**@**...#
#...O..#
#.#.O..#
#...O..#
#...O..#
########

Move v:
########
#....OO#
##.....#
#..**@**O..#
#.#.O..#
#...O..#
#...O..#
########

Move &gt;:
########
#....OO#
##.....#
#...**@**O.#
#.#.O..#
#...O..#
#...O..#
########

Move &gt;:
########
#....OO#
##.....#
#....**@**O#
#.#.O..#
#...O..#
#...O..#
########

Move v:
########
#....OO#
##.....#
#.....O#
#.#.O**@**.#
#...O..#
#...O..#
########

Move &lt;:
########
#....OO#
##.....#
#.....O#
#.#O**@**..#
#...O..#
#...O..#
########

Move &lt;:
########
#....OO#
##.....#
#.....O#
#.#O**@**..#
#...O..#
#...O..#
########
```
The larger example has many more moves; after the robot has finished those moves, the warehouse would look like this:

```
##########
#.O.O.OOO#
#........#
#OO......#
#OO**@**.....#
#O#.....O#
#O.....OO#
#O.....OO#
#OO....OO#
##########
```
The lanternfish use their own custom Goods Positioning System (GPS for short) to track the locations of the boxes. The **GPS coordinate** of a box is equal to 100 times its distance from the top edge of the map plus its distance from the left edge of the map. (This process does not stop at wall tiles; measure all the way to the edges of the map.)

So, the box shown below has a distance of `1` from the top edge of the map and `4` from the left edge of the map, resulting in a GPS coordinate of `100 * 1 + 4 = 104`.

```
#######
#...O..
#......
```
The lanternfish would like to know the **sum of all boxes' GPS coordinates** after the robot finishes moving. In the larger example, the sum of all boxes' GPS coordinates is **`10092`**. In the smaller example, the sum is **`2028`**.

Predict the motion of the robot and boxes in the warehouse. After the robot is finished moving, **what is the sum of all boxes' GPS coordinates?**


## Part Two 
The lanternfish use your information to find a safe moment to swim in and turn off the malfunctioning robot! Just as they start preparing a festival in your honor, reports start coming in that a **second** warehouse's robot is **also** malfunctioning.

This warehouse's layout is surprisingly similar to the one you just helped. There is one key difference: everything except the robot is **twice as wide**! The robot's list of movements doesn't change.

To get the wider warehouse's map, start with your original map and, for each tile, make the following changes:


+ If the tile is `#`, the new map contains `##` instead.

+ If the tile is `O`, the new map contains `[]` instead.

+ If the tile is `.`, the new map contains `..` instead.

+ If the tile is `@`, the new map contains `@.` instead.


This will produce a new warehouse map which is twice as wide and with wide boxes that are represented by `[]`. (The robot does not change size.)

The larger example from before would now look like this:

```
####################
##....[]....[]..[]##
##............[]..##
##..[][]....[]..[]##
##....[]@.....[]..##
##[]##....[]......##
##[]....[]....[]..##
##..[][]..[]..[][]##
##........[]......##
####################
```
Because boxes are now twice as wide but the robot is still the same size and speed, boxes can be aligned such that they directly push two other boxes at once. For example, consider this situation:

```
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

&lt;vv&lt;&lt;^^&lt;&lt;^^
```
After appropriately resizing this map, the robot would push around these boxes as follows:

```
Initial state:
##############
##......##..##
##..........##
##....[][]**@**.##
##....[]....##
##..........##
##############

Move &lt;:
##############
##......##..##
##..........##
##...[][]**@**..##
##....[]....##
##..........##
##############

Move v:
##############
##......##..##
##..........##
##...[][]...##
##....[].**@**..##
##..........##
##############

Move v:
##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.......**@**..##
##############

Move &lt;:
##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##......**@**...##
##############

Move &lt;:
##############
##......##..##
##..........##
##...[][]...##
##....[]....##
##.....**@**....##
##############

Move ^:
##############
##......##..##
##...[][]...##
##....[]....##
##.....**@**....##
##..........##
##############

Move ^:
##############
##......##..##
##...[][]...##
##....[]....##
##.....**@**....##
##..........##
##############

Move &lt;:
##############
##......##..##
##...[][]...##
##....[]....##
##....**@**.....##
##..........##
##############

Move &lt;:
##############
##......##..##
##...[][]...##
##....[]....##
##...**@**......##
##..........##
##############

Move ^:
##############
##......##..##
##...[][]...##
##...**@**[]....##
##..........##
##..........##
##############

Move ^:
##############
##...[].##..##
##...**@**.[]...##
##....[]....##
##..........##
##..........##
##############
```
This warehouse also uses GPS to locate the boxes. For these larger boxes, distances are measured from the edge of the map to the closest edge of the box in question. So, the box shown below has a distance of `1` from the top edge of the map and `5` from the left edge of the map, resulting in a GPS coordinate of `100 * 1 + 5 = 105`.

```
##########
##...[]...
##........
```
In the scaled-up version of the larger example from above, after the robot has finished all of its moves, the warehouse would look like this:

```
####################
##[].......[].[][]##
##[]...........[].##
##[]........[][][]##
##[]......[]....[]##
##..##......[]....##
##..[]............##
##..**@**......[].[][]##
##......[][]..[]..##
####################
```
The sum of these boxes' GPS coordinates is **`9021`**.

Predict the motion of the robot and boxes in this new, scaled-up warehouse. **What is the sum of all boxes' final GPS coordinates?**

