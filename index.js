/*
 * This is simple testing file to run locally. This file allows you to interact
 *  with the layoutgenerator, and to access it's api via browser.
 * */

// set up Express
var express = require('express');
const bodyParser = require('body-parser');

var app = express();

const { generateLayout, generateLayouts, generateCrosswordHTML } = require('./layout_generator.js')

//app.use(express.static('public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.post('/generateLayout', (req, res) => {
    const { words_json } = req.body; // Expecting an array of words with clues and answers
    if (!words_json || !Array.isArray(words_json)) {
        return res.status(400).json({ error: 'Invalid input format. Expecting an array of word objects.' });
    }

    try {
        const layout = generateLayout(words_json);
        res.json(layout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the layout.' });
    }
});

app.post('/generateLayouts', (req, res) => {
    
    //console.log("Inside index.js generateLayouts")
    
    const { words_json } = req.body; // Expecting an array of words with clues and answers
    //console.log(words_json)
    if (!words_json || !Array.isArray(words_json)) {
        return res.status(400).json({ error: 'Invalid input format. Expecting an array of word objects.' });
    }

    try {
        const layouts = generateLayouts(words_json);
        res.json({ success: true, layout: layouts});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the layout.' });
    }
});

app.post('/generateCrosswordHTML', (req, res) => {
    const {input, output_json, num , header, only_answer} = req.body; 
    if (!Array.isArray(input) || input.length === 0) {
        return res.status(400).json({ success: false, error: 'Invalid or missing "input" array' });
    }

    try {
        let layouts = generateCrosswordHTML(input, output_json, num, header, only_answer)
        res.json({ success: true, crossword: layouts[0], answerKey: layouts[1], clues: layouts[2]});
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error.message });
    }
});

// app.post('/createPDF', async (req, res) => {
//     const {crossword, answers} = req.body; 

//     try {
//         let doc = await createPDF(crossword, answers)
//         //console.log("here, ", doc)
//         res.json({ success: true, pdf: doc});
//     } catch (error) {
//         res.status(500).json({ success: false, error: error.message });
//     }
// });

app.use('/home', (req, res) => {

    res.sendFile(__dirname + '/views/index.html')

}); 

var port = 5001

app.listen(port,  () => {
	console.log('Listening on port ' + port);
    });