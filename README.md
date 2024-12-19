# Crossword Layout Generator - Open Source

## Our Forked Version
We include a couple of additions in our forked version of CrossWord Layout Generator.

To use our repo, you can follow these steps. 
- clone our repo
- npm init inside of the repo
- install our dependencies
  - npm install body-parser
  - npm install express
  - npm install thesaurus: ```npm i powerthesaurus-api```
- run the server
  - node index.js

Then, you'll be able to access the Crossword Layout Generator in your broswer at localhost:5001/home. 

## Additional Features (Forked Version) 

- Users can download layouts in PDF format
- Multiple layouts offered
- Beautified clue list (in HTML and PDF outputs)
- Offer synonyms for isolated words instead of removing

## Synonym Feature Demos

- Demo 1: 
![Demonstration One](https://raw.githubusercontent.com/MarcusW03/Crossword-Layout-Generator/master/example_images/CrosswordSynonymFeature.png)

- Demo 2:
  
## Introduction
A crossword consists of clues, answers, and a layout:
- The answers are the hidden words that the player is trying to guess.
- Each answer has a clue which is a sentence or phrase that helps the player to guess the associated answer.
- The **crossword layout** describes where the answers are located in a two-dimensional grid.

This crossword layout generator takes in a list of answers and outputs a crossword layout.  Our program **does not** generate the answers or the clues.

## Input and Output Format

An input is a list of answers in a JSON format.  The clues can optionally be included with the input.

Here is an example input:

`[{"clue":"that which is established as a rule or model by authority, custom, or general consent","answer":"standard"},{"clue":"a machine that computes","answer":"computer"},{"clue":"the collective designation of items for a particular purpose","answer":"equipment"},{"clue":"an opening or entrance to an inclosed place","answer":"port"},{"clue":"a point where two things can connect and interact","answer":"interface"}]`

The output is a crossword layout.  That is, we associate a position, startx, starty, and orientation with each answer.

Here is an example output:

`[{"clue":"the collective designation of items for a particular purpose","answer":"equipment","startx":1,"starty":4,"position":1,"orientation":"across"},{"clue":"an opening or entrance to an inclosed place","answer":"port","startx":5,"starty":4,"position":2,"orientation":"down"},{"clue":"that which is established as a rule or model by authority, custom, or general consent","answer":"standard","startx":8,"starty":1,"position":3,"orientation":"down"},{"clue":"a machine that computes","answer":"computer","startx":3,"starty":2,"position":4,"orientation":"across"},{"clue":"a point where two things can connect and interact","answer":"interface","startx":1,"starty":1,"position":5,"orientation":"down"}]`

One can visualize the output as follows:

![Example Output](https://github.com/MichaelWehar/Crossword-Layout-Generator/blob/master/example_images/crossword1_filled.png)

Alternate output format: 

Generate your crossword layout in PDF format for easy use and distribution.

![Image 11-14-24 at 11 41 AM](https://github.com/user-attachments/assets/0988c248-c502-466e-8af4-ab2cf9d673dd)

## Getting Started

**Step 1:** Add the following line to the head of your html document:

`<script src="layout_generator.js"></script>`

**Step 2:** In the body of your html document, you can add the following JavaScript:

```
<script>
...
var layout = generateLayout(input_json);
var rows = layout.rows;
var cols = layout.cols;
var table = layout.table; // table as two-dimensional array
var output_html = layout.table_string; // table as plain text (with HTML line breaks)
var output_json = layout.result; // words along with orientation, position, startx, and starty
...
</script>
```

**Update:** Our crossword layout generator is now available as a package for Node.js applications.  For more information, see the Node.js version of our README here: https://github.com/MichaelWehar/Crossword-Layout-Generator/blob/npm/README.md

Also, see our package's npm listing here: https://www.npmjs.com/package/crossword-layout-generator

## Demo Website

The demo website's source code can be found in `index.html`.

The demo website shows:

- how to generate the crossword layout in a JSON format

- how to generate the crossword layout in a plain text grid format (using HTML line breaks).

- how to turn your crossword layout into a **word search puzzle** with horizontal and vertical answers.

**Demo:** http://michaelwehar.com/crosswords

**Short Article:** https://makeprojects.com/project/crossword-layout-generator---open-source

## Information for Advanced Users

- The generated layouts don't always contain all of the input words.  If a word does not appear in the layout, then its orientation attribute will be set to "none".

- The generated crossword layouts are not always connected.  Occasionally, there will be islands of disconnected words.

- The program is efficient on small word lists, but it runs noticably slower when the list contains more than 100 words.

- We are still exploring potential ways to evaluate the quality of the generated crossword layouts.  See [Issue #2](https://github.com/MichaelWehar/Crossword-Layout-Generator/issues/2).

## License
- MIT

## Credits
- Michael Wehar
- Itay Livni
- Michael Blättler

## External Projects That Use Our Library

- [WoordSchaap](https://github.com/erasche/woordschaap)

- [Collaboration with TapNotion at PyCon 2018](https://pycon-archive.python.org/2018/schedule/presentation/179/)
