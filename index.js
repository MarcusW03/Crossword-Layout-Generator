// set up Express
var express = require('express');
var app = express();

// set up BodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// set up EJS
app.set('view engine', 'ejs');

// input_json = [{"clue":"that which is established as a rule or model by authority, custom, or general consent","answer":"standard"},{"clue":"a machine that computes","answer":"computer"},{"clue":"the collective designation of items for a particular purpose","answer":"equipment"},{"clue":"an opening or entrance to an inclosed place","answer":"port"},{"clue":"a point where two things can connect and interact","answer":"interface"}]
// var clg = require("crossword-layout-generator");
// var layout = clg.generateLayout(input_json)
// var rows = layout.rows;
// var cols = layout.cols;
// var table = layout.table; // table as two-dimensional array
// var output_html = layout.table_string; // table as plain text (with HTML line breaks)
// var output_json = layout.result; // words along with orientation, position, startx, and starty

app.use('/', (req, res) => {

    //console.log(output_json)
    res.sendFile(__dirname + '/views/index.html')
    //res.render("index")

});


/*************************************************
Do not change anything below here!
*************************************************/

//app.use('/public', express.static('public'));

// this redirects any other request to the "all" endpoint
//app.use('/', (req, res) => { res.redirect('/home'); } );

// this port number has been assigned to your group
var port = 5001

app.listen(port,  () => {
	console.log('Listening on port ' + port);
    });