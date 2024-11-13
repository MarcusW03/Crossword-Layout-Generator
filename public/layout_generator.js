/* Original Project sourced from https://github.com/MichaelWehar/Crossword-Layout-Generator
 * Additional Features authored by:
 *  Jayson Batie, Sharvari Tatachar, Marcus Wright
 * MIT License
 */

//var thesaurus = require('powerthesaurus-api')
//var jsPDF = require('jspdf')

// Math functions
function distance(x1, y1, x2, y2){
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function weightedAverage(weights, values){
  var temp = 0;
  for(let k = 0; k < weights.length; k++){
    temp += weights[k] * values[k];
  }

  if(temp < 0 || temp > 1){
    console.log("Error: " + values);
  }

  return temp;
}


// Component scores
// 1. Number of connections
function computeScore1(connections, word){
  return (connections / (word.length / 2));
}

// 2. Distance from center
function computeScore2(rows, cols, i, j){
  return 1 - (distance(rows / 2, cols / 2, i, j) / ((rows / 2) + (cols / 2)));
}

// 3. Vertical versus horizontal orientation
function computeScore3(a, b, verticalCount, totalCount){
  if(verticalCount > totalCount / 2){
    return a;
  }
  else if(verticalCount < totalCount / 2){
    return b;
  }
  else{
    return 0.5;
  }
}

// 4. Word length
function computeScore4(val, word){
  return word.length / val;
}


// Word functions
function addWord(best, words, table){
  var bestScore = best[0];
  var word = best[1];
  var index = best[2];
  var bestI = best[3];
  var bestJ = best[4];
  var bestO = best[5];

  words[index].startx = bestJ + 1;
  words[index].starty = bestI + 1;

  if(bestO == 0){
    for(let k = 0; k < word.length; k++){
      table[bestI][bestJ + k] = word.charAt(k);
    }
    words[index].orientation = "across";
  }
  else{
    for(let k = 0; k < word.length; k++){
      table[bestI + k][bestJ] = word.charAt(k);
    }
    words[index].orientation = "down";
  }
  //console.log(word + ", " + bestScore);
}

function assignPositions(words){
  var positions = {};
  for(let index in words){
    var word = words[index];
    if(word.orientation != "none"){
      var tempStr = word.starty + "," + word.startx;
      if(tempStr in positions){
        word.position = positions[tempStr];
      }
      else{
        // Object.keys is supported in ES5-compatible environments
        positions[tempStr] = Object.keys(positions).length + 1;
        word.position = positions[tempStr];
      }
    }
  }
}

function computeDimension(words, factor){
  var temp = 0;
  for(let i = 0; i < words.length; i++){
    if(temp < words[i].answer.length){
      temp = words[i].answer.length;
    }
  }

  return temp * factor;
}


// Table functions
function initTable(rows, cols){
  var table = [];
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      if(j == 0){
        table[i] = ["-"];
      }
      else{
        table[i][j] = "-";
      }
    }
  }

  return table;
}

function isConflict(table, isVertical, character, i, j){
  if(character != table[i][j] && table[i][j] != "-"){
    return true;
  }
  else if(table[i][j] == "-" && !isVertical && (i + 1) in table && table[i + 1][j] != "-"){
    return true;
  }
  else if(table[i][j] == "-" && !isVertical && (i - 1) in table && table[i - 1][j] != "-"){
    return true;
  }
  else if(table[i][j] == "-" && isVertical && (j + 1) in table[i] && table[i][j + 1] != "-"){
    return true;
  }
  else if(table[i][j] == "-" && isVertical && (j - 1) in table[i] && table[i][j - 1] != "-"){
    return true
  }
  else{
    return false;
  }
}

function attemptToInsert(rows, cols, table, weights, verticalCount, totalCount, word, index){
  var bestI = 0;
  var bestJ = 0;
  var bestO = 0;
  var bestScore = -1;

  // Horizontal
  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols - word.length + 1; j++){
      var isValid = true;
      var atleastOne = false;
      var connections = 0;
      var prevFlag = false;

      for(let k = 0; k < word.length; k++){
        if(isConflict(table, false, word.charAt(k), i, j + k)){
          isValid = false;
          break;
        }
        else if(table[i][j + k] == "-"){
          prevFlag = false;
          atleastOne = true;
        }
        else{
          if(prevFlag){
            isValid = false;
            break;
          }
          else{
            prevFlag = true;
            connections += 1;
          }
        }
      }

      if((j - 1) in table[i] && table[i][j - 1] != "-"){
        isValid = false;
      }
      else if((j + word.length) in table[i] && table[i][j + word.length] != "-"){
        isValid = false;
      }

      if(isValid && atleastOne && word.length > 1){
        var tempScore1 = computeScore1(connections, word);
        var tempScore2 = computeScore2(rows, cols, i, j + (word.length / 2), word);
        var tempScore3 = computeScore3(1, 0, verticalCount, totalCount);
        var tempScore4 = computeScore4(rows, word);
        var tempScore = weightedAverage(weights, [tempScore1, tempScore2, tempScore3, tempScore4]);

        if(tempScore > bestScore){
          bestScore = tempScore;
          bestI = i;
          bestJ = j;
          bestO = 0;
        }
      }
    }
  }

  // Vertical
  for(let i = 0; i < rows - word.length + 1; i++){
    for(let j = 0; j < cols; j++){
      var isValid = true;
      var atleastOne = false;
      var connections = 0;
      var prevFlag = false;

      for(let k = 0; k < word.length; k++){
        if(isConflict(table, true, word.charAt(k), i + k, j)){
          isValid = false;
          break;
        }
        else if(table[i + k][j] == "-"){
          prevFlag = false;
          atleastOne = true;
        }
        else{
          if(prevFlag){
            isValid = false;
            break;
          }
          else{
            prevFlag = true;
            connections += 1;
          }
        }
      }

      if((i - 1) in table && table[i - 1][j] != "-"){
        isValid = false;
      }
      else if((i + word.length) in table && table[i + word.length][j] != "-"){
        isValid = false;
      }

      if(isValid && atleastOne && word.length > 1){
        var tempScore1 = computeScore1(connections, word);
        var tempScore2 = computeScore2(rows, cols, i + (word.length / 2), j, word);
        var tempScore3 = computeScore3(0, 1, verticalCount, totalCount);
        var tempScore4 = computeScore4(rows, word);
        var tempScore = weightedAverage(weights, [tempScore1, tempScore2, tempScore3, tempScore4]);

        if(tempScore > bestScore){
          bestScore = tempScore;
          bestI = i;
          bestJ = j;
          bestO = 1;
        }
      }
    }
  }

  if(bestScore > -1){
    return [bestScore, word, index, bestI, bestJ, bestO];
  }
  else{
    return [-1];
  }
}

function generateTable(table, rows, cols, words, weights){
  var verticalCount = 0;
  var totalCount = 0;

  for(let outerIndex in words){
    var best = [-1];
    for(let innerIndex in words){
      if("answer" in words[innerIndex] && !("startx" in words[innerIndex])){
        var temp = attemptToInsert(rows, cols, table, weights, verticalCount, totalCount, words[innerIndex].answer, innerIndex);
        if(temp[0] > best[0]){
          best = temp;
        }
      }
    }

    if(best[0] == -1){
      break;
    }
    else{
      addWord(best, words, table);
      if(best[5] == 1){
        verticalCount += 1;
      }
      totalCount += 1;
    }
  }

  for(let index in words){
    if(!("startx" in words[index])){
      words[index].orientation = "none";
    }
  }

  return {"table": table, "result": words};
}

function removeIsolatedWords(data){
  var oldTable = data.table;
  var words = data.result;
  var rows = oldTable.length;
  var cols = oldTable[0].length;
  var newTable = initTable(rows, cols);

  // Draw intersections as "X"'s
  for(let wordIndex in words){
    var word = words[wordIndex];
    if(word.orientation == "across"){
      var i = word.starty - 1;
      var j = word.startx - 1;
      for(let k = 0; k < word.answer.length; k++){
        if(newTable[i][j + k] == "-"){
          newTable[i][j + k] = "O";
        }
        else if(newTable[i][j + k] == "O"){
          newTable[i][j + k] = "X";
        }
      }
    }
    else if(word.orientation == "down"){
      var i = word.starty - 1;
      var j = word.startx - 1;
      for(let k = 0; k < word.answer.length; k++){
        if(newTable[i + k][j] == "-"){
          newTable[i + k][j] = "O";
        }
        else if(newTable[i + k][j] == "O"){
          newTable[i + k][j] = "X";
        }
      }
    }
  }

  // Set orientations to "none" if they have no intersections
  for(let wordIndex in words){
    var word = words[wordIndex];
    var isIsolated = true;
    if(word.orientation == "across"){
      var i = word.starty - 1;
      var j = word.startx - 1;
      for(let k = 0; k < word.answer.length; k++){
        if(newTable[i][j + k] == "X"){
          isIsolated = false;
          break;
        }
      }
    }
    else if(word.orientation == "down"){
      var i = word.starty - 1;
      var j = word.startx - 1;
      for(let k = 0; k < word.answer.length; k++){
        if(newTable[i + k][j] == "X"){
          isIsolated = false;
          break;
        }
      }
    }
    if(word.orientation != "none" && isIsolated){
      delete words[wordIndex].startx;
      delete words[wordIndex].starty;
      delete words[wordIndex].position;
      words[wordIndex].orientation = "none";
    }
  }

  // Draw new table
  newTable = initTable(rows, cols);
  for(let wordIndex in words){
    var word = words[wordIndex];
    if(word.orientation == "across"){
      var i = word.starty - 1;
      var j = word.startx - 1;
      for(let k = 0; k < word.answer.length; k++){
        newTable[i][j + k] = word.answer.charAt(k);
      }
    }
    else if(word.orientation == "down"){
      var i = word.starty - 1;
      var j = word.startx - 1;
      for(let k = 0; k < word.answer.length; k++){
        newTable[i + k][j] = word.answer.charAt(k);
      }
    }
  }

  return {"table": newTable, "result": words};
}

function trimTable(data){
  var table = data.table;
  var rows = table.length;
  var cols = table[0].length;

  var leftMost = cols;
  var topMost = rows;
  var rightMost = -1;
  var bottomMost = -1;

  for(let i = 0; i < rows; i++){
    for(let j = 0; j < cols; j++){
      if(table[i][j] != "-"){
        var x = j;
        var y = i;

        if(x < leftMost){
          leftMost = x;
        }
        if(x > rightMost){
          rightMost = x;
        }
        if(y < topMost){
          topMost = y;
        }
        if(y > bottomMost){
          bottomMost = y;
        }
      }
    }
  }

  var trimmedTable = initTable(bottomMost - topMost + 1, rightMost - leftMost + 1);
  for(let i = topMost; i < bottomMost + 1; i++){
    for(let j = leftMost; j < rightMost + 1; j++){
      trimmedTable[i - topMost][j - leftMost] = table[i][j];
    }
  }

  var words = data.result;
  for(let entry in words){
    if("startx" in words[entry]) {
      words[entry].startx -= leftMost;
      words[entry].starty -= topMost;
    }
  }

  return {"table": trimmedTable, "result": words, "rows": Math.max(bottomMost - topMost + 1, 0), "cols": Math.max(rightMost - leftMost + 1, 0)};
}

function tableToString(table, delim){
  var rows = table.length;
  if(rows >= 1){
    var cols = table[0].length;
    var output = "";
    for(let i = 0; i < rows; i++){
      for(let j = 0; j < cols; j++){
        output += table[i][j];
      }
      output += delim;
    }
    return output;
  }
  else{
    return "";
  }
}

function generateSimpleTable(words){
  var rows = computeDimension(words, 3);
  var cols = rows;
  var blankTable = initTable(rows, cols);
  var table = generateTable(blankTable, rows, cols, words, [0.7, 0.15, 0.1, 0.05]);
  var newTable = removeIsolatedWords(table);
  var finalTable = trimTable(newTable);
  assignPositions(finalTable.result);
  return finalTable;
}

function generateLayout(words_json){
  var layout = generateSimpleTable(words_json);
  layout.table_string = tableToString(layout.table, "<br>");
  return layout;
}

// Function to generate HTML for the crossword grid
function generateCrosswordHTML(input, output_json) {
  /*
   * This function takes in a crossword as a list of rows. Dashes '-'
   *  should be used for empty spaces, and letters used as letters.
   *    ideally used with output of generateLayout().table
   *  Example input : 
   *        [ '--w-',
   *          '--o-',
   *          'word',
   *          '--d-' ]
   *  Also, accepts crossword out in json form. 
   *    Ideally used with output of generateLayout().result
   * Returns empty crossword and answer key as html strings in a list
   *  of form [crossword, answers]
   * 
   * TODO: fix cell numbers, seems to not work for some examples
   */
  
  const rows = input.length;
  const cols = input[0].length;

  let html = `
  <style>
      .crossword-container {
          display: grid;
          grid-template-columns: repeat(${cols}, 30px);
          gap: 4px;
          margin-bottom: 20px;
          padding: 20px;
          border: 2px solid;
          width: fit-content
      }
      .cell {
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          border: 1px solid #333;
          background-color: #ffffff;
          position: relative;
      }
      .cell_number {
          width: fit-content;
          height: 5px;
          font-size: 12px;
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          position: absolute;
          top: 0;
          left: 0;
      }
      .empty-cell {
          background-color: black;
          width: 30px;
          height: 30px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          border: 1px solid #333;
      }
  </style>

  <div class="crossword-container">
  `;

  let start_positions = []

  //console.log(output_json)

  for (let i = 0; i < output_json.length; i++) {
    let starts = []
    let item = output_json[i]
    starts.push(item.startx)
    starts.push(item.starty)
    starts.push(item.position)
    start_positions.push(starts)
  }

  //console.log(start_positions)

  let answerKey = html
  // Create the grid based on input
  let x = 1
  input.forEach(row => {
      let y = 1
      row.forEach(char => {
          let isNumbered = false
          const cellClass = char === '-' ? 'empty-cell' : 'cell';
          let i = 0
          //This algorithm doesn't seem to work all the time
          //NEED TO FIX THIS

          for (i = 0; i < start_positions.length; i++) {
            // console.log("i: " + i + " x: " + x + " y: " + y)
            // console.log("position x: " + start_positions[i][0] + " position y: " + start_positions[i][1])
            if ((start_positions[i][0] == x) && (start_positions[i][1] == y)) {
              isNumbered = true;
              break;
            }
          }
          answerKey += `<div class="${cellClass}">${char === '-' ? '' : char}`
          if (isNumbered) {
            //Create number box with start_position[2], and put in html
            let position = start_positions[i][2]
            // console.log("Is Numbered: " + position)
            answerKey += `<div class="cell_number">${position}</div>`
          }
          answerKey += `</div>`;
          y += 1
      });
      x += 1
  });

  answerKey += '</div>';

  let crossword = html
  x = 1
  // Create the grid based on input
  input.forEach(row => {
      let y = 1
      row.forEach(char => {
          const cellClass = char === '-' ? 'empty-cell' : 'cell';
          let isNumbered = false

          let i = 0
          for (i = 0; i < start_positions.length; i++) {
            // console.log("i: " + i + " x: " + x + " y: " + y)
            // console.log("position x: " + start_positions[i][0] + " position y: " + start_positions[i][1])
            if ((start_positions[i][0] == x) && (start_positions[i][1] == y)) {
              isNumbered = true;
              break;
            }
          }

          crossword += `<div class="${cellClass}">${char === '-' ? '' : ''}`;
          if (isNumbered) {
            //Create number box with start_position[2], and put in html
            let position = start_positions[i][2]
            // console.log("Is Numbered: " + position)
            crossword += `<div class="cell_number">${position}</div>`
          }
          crossword += `</div>`;
          y += 1
      });
      x += 1
  });

  crossword += '</div>';

  return [crossword, answerKey];
}

function createPDF(crossword, answers="") {
  /*
  This function takes in a crossword as HTML and then returns
    it as a PDF. Takes in as one html item, or optionally as 
    a separate crossword and answer key html

  TODO: look into resizing html to better fit pdf
   */
  const options = {
    margin:       1,
    filename:     'crossword.pdf',
    //image:        { type: 'jpeg', quality: 0.98 },
    //html2canvas:  { scale: 2 },
    //jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
  };

  let element = crossword + answers

  // Generate PDF
  doc = html2pdf().set(options).from(element) //.save()
  
  return doc;
}

//The following was added to support Node.js
if(typeof module !== 'undefined'){
  module.exports = { generateLayout, generateCrosswordHTML, createPDF };
}
