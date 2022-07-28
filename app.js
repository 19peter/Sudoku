import Grid from "./grid.js";
import NumbersBox from "./numbersBox.js";
import generateSudoku from "./generateSudoku.js";
import sudokuChecker from "./sudokuChecker.js";

const container = document.querySelector(".container");
const settings = document.querySelector(".settings");
const level = document.getElementById("levels");
const playBtn = document.querySelector(".selectBtn");
const mistakesSection = document.querySelector(".mistakes");

let gridSize;
let hiddenNumbers = [[], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]];
//Selected Number links between the numbers boxes and the functions of cells and the game
let selectedNumber = 0;
let mistakes = 0;


playBtn.addEventListener("click", () => {
    gridSize = level.value;
    settings.style.display = "none";

    mistakesSection.style.display = "grid";
    mistakesSection.innerHTML = `Mistakes: ${mistakes} / 3`
    container.style.display = "grid";
    container.style.setProperty("--grid-size", gridSize)
    container.style.setProperty("--cell-size", `7vmin`)

    const gameBoard = new Grid(container, gridSize);
    // console.log(gameBoard.cells)

    let sudokuMap = generateSudoku(gridSize);

    let sudokuCheck = sudokuChecker(sudokuMap);

    while (!sudokuCheck) {
        sudokuMap = generateSudoku(gridSize);
        sudokuCheck = sudokuChecker(sudokuMap)
    }

    createBorder(gameBoard)

    assignNumbersToCells(gameBoard, sudokuMap);

    //Numbers box
    createNumbersBox(gameBoard);

    //Game functions 
    gameBoard.cells.forEach((cell) => {
        cell.cell.addEventListener("click", () => {
            if (selectedNumber == 0) {

            } else if (cell.hidden && selectedNumber == cell.number_) {
                cell.hidden = false;
                cell.false = false;

                cell.cell.innerHTML = cell.number_;
                cell.cell.style.backgroundColor = "rgb(142, 149, 155)";

                checkWin();

                let selectedBox = document.getElementById(cell.number_);
                let remaining = selectedBox.lastChild;

                if (Number(remaining.innerHTML) > 1) {
                    remaining.innerHTML = Number(remaining.innerHTML) - 1;
                } else {
                    selectedBox.remove();
                }

            } else if (cell.hidden && selectedNumber !== cell.number_) {
                cell.cell.innerHTML = selectedNumber;
                cell.false = true;

                cell.cell.style.backgroundColor = "rgb(238, 74, 74)";

                mistakes++;
                mistakesSection.innerHTML = `Mistakes: ${mistakes} / 3`;

                if (mistakes > 2) {
                    alert("You lost");
                    window.location.reload();
                }

            }
        })
    })
})

function createBorder(gameBoard) {
    for (let i = -1; i < Number(gridSize); i += Math.sqrt(Number(gridSize))) {


        for (let j = 0; j < Number(gridSize); j++) {
            if (i == -1) {
                gameBoard.columns[0][j].cell.classList.add("left-column-border");
                gameBoard.rows[0][j].cell.classList.add("top-row-border");
            }
            else if (i > 0) {
                gameBoard.columns[i][j].cell.classList.add("column-border");
                gameBoard.rows[i][j].cell.classList.add("row-border");
            }
        }

    }
}

function assignNumbersToCells(gameBoard, sudokuMap) {


    for (let i = 0; i < Number(gridSize); i++) {
        for (let k = 0; k < Number(gridSize); k++) {
            gameBoard.rows[i][k].number_ = sudokuMap[i][k]

            if (gameBoard.rows[i][k].hidden) {
                hiddenNumbers[gameBoard.rows[i][k].number_][1]++;
            }
        }
    }

}

function createNumbersBox(gameBoard) {
    let numbersBox = document.createElement("div");
    numbersBox.className = "numbers-box";

    let boxes = [];

    for (let i = 1; i < hiddenNumbers.length; i++) {
        let box = new NumbersBox(hiddenNumbers, numbersBox, i);
        let boxElement = box.box;
        let numberElement = box.numberElement;
        let remainElement = box.remainElement;

        boxes.push(box);
    }

    boxes.forEach((box) => {
        let boxElement = box.box;

        boxElement.addEventListener("click", () => {

            if (!box.toggle) {

                boxes.forEach((box2) => {
                    box2.box.style.transform = "scale(1)";
                    box2.toggle = false;
                })

                boxElement.style.transform = "scale(1.3)"
                box.toggle = true;
                selectedNumber = box.number;


            } else {
                boxElement.style.transform = "scale(1)";
                box.toggle = false;
                selectedNumber = 0;
            }

        })
    })



    document.body.appendChild(numbersBox);
}

function checkWin() {

    gameBoard.cells.forEach((cell) => {
        if (cell.hidden) {
            return false;
        }
        alert("You Win");
        return true;
    })
}


