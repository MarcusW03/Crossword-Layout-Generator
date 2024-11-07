// Input format for the crossword
const crosswordInput = [
    "----w--",
    "----o--",
    "--words",
    "----d--",
    "words--"
];

// Function to generate HTML for the crossword grid
function generateCrosswordHTML(input) {
    const rows = input.length;
    const cols = input[0].length;

    let html = `
    <style>
        .crossword-container {
            display: grid;
            grid-template-columns: repeat(${cols}, 30px);
            gap: 2px;
            margin-bottom: 20px;
            padding: 20px;
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
        }
        .empty-cell {
            background-color: black;
        }
    </style>

    <div class="crossword-container">
    `;

    // Create the grid based on input
    input.forEach(row => {
        row.split('').forEach(char => {
            const cellClass = char === '-' ? 'empty-cell' : 'cell';
            html += `<div class="${cellClass}">${char === '-' ? '' : char}</div>`;
        });
    });

    html += '</div>';

    return html;
}

// Generate the crossword HTML and log it
const crosswordHTML = generateCrosswordHTML(crosswordInput);
console.log(crosswordHTML);
