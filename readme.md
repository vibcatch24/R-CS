# "Rubik's Cube Signature" (R'CS)

## Introduction

* This program (hereinafter referred to as R'CS) is designed for entering the state (scramble, net layout) of a 3x3x3 Rubik's Cube and defining its unique code, regardless of the number of moves leading to that state.
* It uses a "smart" input method that helps the user correctly fill in the sticker colors, reducing the input by an average of 1/3 of the total number of colors entered.
* R'CS takes into account the conventions necessary for encoding a position in Catch-24 code and generates it if the position is legitimate.

## Terms and Notations Used
### Cube Faces:

Standard face notations:
* `U` - Up
* `L` - Left
* `F` - Front
* `R` - Right
* `B` - Back
* `D` - Down

### Face Colors (Center Sticker Colors):

* The center colors are **constant** and define the color of the entire face in the solved state:
* `U`: `snow` (white)
* `L`: `orange`
* `F`: `lime` (green)
* `R`: `red`
* `B`: `dodgerblue` (blue)
* `D`: `yellow`

### Face Properties:

* The position of each face on the net relative to other faces is rigidly defined by the cube's mechanics.
* The face pairs `U`-`D`, `F`-`B`, `L`-`R` are mutually **opposite**.
* Each face is adjacent to 4 other faces that are **not opposite** to it.

### Centers and Stickers:

* On the cube net used, there are six centers that do not change their color and 48 stickers, numbered from `0` to `47` (see `image 1`), whose colors can be painted by the user.

![Cube net with sticker notations](image/image%201.jpeg)

### Cube Slots (Elements):

* **Corner Slots:** There are 8 in total. Each has 3 stickers. In the program, they are denoted by the prefix `<c>` (from `c0` to `c7`).
* **Edge Slots:** There are 12 in total. Each has 2 stickers. In the program, they are denoted by the prefix `<e>` (from `e0` to `e11`).
* **Visual Representation:** The numbering of corner and edge slots is shown in `image 2`.

![Net with numbering of cube elements](image/image%202.jpeg)

### Orientation Markers and Reference Stickers:

* Orientation markers `§`, which define the reference stickers of the slots, are used for encoding positions in Catch-24 code.
* **For Corners:** The orientation is 0 if the reference stickers of the slots located on the `U`/`D` faces match the U or D face (see `image 2`).
* **For Edges:**
   1. For a slot located in the horizontal U/D layers (e0-e7), the orientation is 0 if its reference stickers match the U or D face.
   2. For a slot located in the equatorial F/B layer (e8-11), the orientation is 0 if its reference stickers match the F or B face.

## Sequence and Algorithm for Filling the Net (Scramble)

1.  **Input Sequence:** Filling the stickers with colors occurs sequentially, from `0` to `47`. Corner slot sticker numbers are even, edge slot numbers are odd.
2.  **Dynamic 6-Color Palette:** The availability of colors on the palette for the current sticker is determined by the "smart" input rules, defined by the mechanics of the Rubik's Cube.
3.  **Color Input:** R'CS moves the cursor over the stickers, skipping those already colored based on the rules. The user can also click to select any sticker with a number lower than the active (current) one, which guarantees the erasure of that sticker's color and the colors of other stickers with higher numbers. The user then selects an available color from the 6-color palette, and the full logic is restored. R'CS has a restriction on erasing stickers in a fully solved position for sticker numbers no greater than 15.
4.  **Backspace Button ⌫ :** Moves the cursor back one sticker and guarantees the erasure of its color and the colors of other stickers with higher numbers. The user can then continue to erase one sticker at a time or select an available color from the palette, and the full logic is restored.

## "Smart" Input and Encoding Rules

* These rules restrict and/or automatically fill in sticker colors during input.
* **Important:** The program's logic distinguishes between the physical slots of the cube (8 corners, 12 edges, which do not move) and the definitions/assignments of these slots, which describe their colors in the solved state of the cube. "Smart input" analyzes the current colors on the stickers of a physical slot to determine which definition it corresponds to.

### General Principles:

* **Exclusion of Opposite Colors:** Stickers of the same slot cannot have colors of opposite faces.
* Each corner slot belongs to three faces (defined by three centers).
* Each edge slot belongs to two faces (defined by two centers).
* The same color belongs to four corner slots and four edge slots.
* **Parity of Position:** The parity of permutations must be even - the sum of the parities of the corner and edge slots must be even.

### Rule for Faces:

* If any 2 **non-opposite** faces are completely colored with their center colors, the other 4 faces are automatically completed to the solved state of the cube.

### Rules for Corner Slots:

* **Calculating the Third Color:** If two of the three colors for a corner slot are entered, R'CS automatically determines the missing third color (see `image 3`: auto-detection of sticker 16 of corner slot c1).
* **Sum of Orientations:** The sum of the orientations of all corner slots modulo 3 must be equal to 0. Taking this into account, when encoding in Catch-24, one symbol (the first, for corner slot c0) is not included in the Catch-24 code.

    ![Cube net with "smart" input](image/image%203.jpeg)

### Rules for Edge Slots:

* **Calculating the Second Color:** If one of the two colors for an edge slot is entered, R'CS checks for the same color among the already completely colored ("solved") edge slots. If three solved slots with that color are found, R'CS determines the second color for the incomplete slot.
* **Sum of Orientations:** The sum of the orientations of all edge slots modulo 2 must be equal to 0. Taking this into account, when encoding in Catch-24, one symbol (the last, for edge slot e11) is not included in the Catch-24 code.

## Catch-24 Code:

* Catch-24 encoding is determined by the colors of the defined slots and their orientation (see `image 4`. The orientation of the cube slot is written after the hyphen).
* The code contains 18 lowercase characters (from the first 24 lowercase letters of the English alphabet - corresponding to the number of possible positions and orientations in those positions for the 8 corner and 12 edge slots).
* First, 7 corner slot code values are output to the **output string** located to the right of the Copy button, followed by the remaining 11 edge slot values in ascending order.
* The first of the 20 symbols (corner slot c0) and the last symbol (edge slot e11) are not included in the code sequence.
* A preliminary code is displayed immediately (as in `image 4`), acting as a progress bar until the entire cube is colored. Unassigned slot definition symbols are replaced with hyphens.

    ![Preliminary Catch-24 encoding](image/image%204.jpeg)
* To obtain the final code value, upon full coloring of the cube, the preliminary values are character-wise multiplied according to the multiplication table (`image 5`) by the value inverse to the initial position. The result of this multiplication is the Catch-24 code.
* Examples of character-wise multiplication from the table (`image 5`): a • x = x, m • f = e, f • i = a. Multiplication is generally not commutative (the result depends on the order of the factors).
* The Catch-24 code is displayed in blue in the **output string** to the right of the Copy button.
* The 18-character Catch-24 code is a digital fingerprint - a signature of any legitimate position of the Rubik's Cube.

## Additional Input Modes

### Catch-24 Code Input Mode

* After the full 18-character code is formed, it becomes possible to copy the Catch-24 code to the clipboard with the "Copy" button.
* Simultaneously with pressing the Copy button, the Catch-24 code is placed in the **input string** to the right of the Input button, confirming the copy.
* After entering the Catch-24 code into the input string (by any method), pressing the Input button performs the reverse operation of decoding the Catch-24 code into the colors of the cube position.
* On success, the text in the input field turns bright green (lime), and the Input button becomes fully blue.

![Catch-24 encoding](image/tests/test%201.jpeg)
* If the position does not correspond to the mechanics of the Rubik's Cube, a corresponding warning is issued.

### Supported Notation for the Input String

* Standard WCA: Uppercase letters F, B, R, L, U, D with modifiers ' (counter-clockwise), 2 (double move), and wide moves, e.g., Fw, Rw', Uw2.
* For backward compatibility with some scramble tables, two non-standard modifier notations are supported: 1 and 3, e.g., F3 (as F') and U1 (as U).
* Rotations of the entire cube (x, y, z) are not supported - for R'CS, the starting WCA net is unchangeable.

### Input Modes: Scramble and Solution

* These modes allow entering standard move sequences into the input string and processing them as a Scramble (forward sequence) or as a Solution (inverse sequence). This provides the ability not only to get the Scramble position but also the position in Solution mode from which a known algorithm begins.
* A single "Input" button with two active zones is used to control the modes:
  1. The blue, main, and right part of the button with the text "Input": Scramble, [Copy] Catch-24 modes. Processes the forward sequence of moves starting from the identity position (solved cube).
  2. The purple zone on the left, with the turn-around icon ↩ : (Solution Mode). In Solution mode, the sequence in the input string will be the solution to the position obtained after pressing the ↩ icon on the left part of the Input button.

![WCA-encoding](image/tests/test%202.jpeg)
* Upon successful execution (in both modes), the text in the input field will turn bright green (lime).
* If a Solution sequence was processed, the "Input" button will turn fully purple, and a `↩` symbol will appear at the end of the string in the input field as an additional indicator. The purple color of the button will remain until the next action (Scramble, Reset, or Copy mode).
* In Scramble mode, the "Input" button will adopt a two-zoned purple-blue color.
* A Scramble position can simultaneously be a Solution. In that case, the Catch-24 code will not change when switching to Solution mode for the same sequence in the input string.

![Scramble/Solution](image/tests/test%203.jpeg)

![Catch-24 Encoding (multiplication table)](image/image%205.jpeg)

### The R'CS program and the Catch-24 code are unlicensed:

* [R-CS](https://github.com/vibcatch24/R-CS)

[Unlicense](UNLICENSE.txt)