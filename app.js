import Grid from "./grid.js";
import NumbersBox from "./numbersBox.js";
import generateSudoku from "./generateSudoku.js";
import sudokuChecker from "./sudokuChecker.js";

const container = document.querySelector(".container");
const settings = document.querySelector(".settings");
const level = document.getElementById("levels");
const difficulty = document.getElementById("difficulty");
const playBtn = document.querySelector(".selectBtn");
const mistakesSection = document.querySelector(".mistakes");
const settingsBtn = document.querySelector(".set-settings");
const advSettingsMenu = document.querySelector(".adv-settings-menu");
const closeBtn = document.querySelector(".close-btn");
const timer = document.querySelector(".timer");

//ALL CODE FOR ADVANCED SETTINGS IS COMMENTED PRIOR WITH "Game Advanced Settings"
const mistakesSetting = document.getElementById("mistakes-settings");
const eraseFalseSetting = document.getElementById("erase-false-settings");
const timerSetting = document.getElementById("timer-settings");
const numberBoxSetting = document.getElementById("numberbox-settings");
const timerInput = document.getElementById("timer-input");


let gridSize;
let diffLevel;
let hiddenNumbers = [[], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0], [9, 0]];
//Selected Number links between the numbers boxes and the functions of cells and the game
let boxes = [];
let selectedNumber = 0;
let mistakes = 0;


settingsBtn.addEventListener("click", () => {
    advSettingsMenu.style.display = "flex";
})

closeBtn.addEventListener("click", () => {
    advSettingsMenu.style.display = "none";
})

//Game Advanced Settings
timerSetting.addEventListener("click", () => {
    if (timerSetting.checked) {
        timerInput.style.visibility = "visible";
        timerInput.focus();
    } else {
        timerInput.style.visibility = "hidden";
    }
})


playBtn.addEventListener("click", () => {

    //Game Advanced Settings
    if (timerSetting.checked) {
        setTimer();
    }

    diffLevel = difficulty.value;
    gridSize = level.value;
    settings.style.display = "none";

    //Game Advanced Setting
    if (mistakesSetting.checked) {
        mistakesSection.innerHTML = `Mistakes: ${mistakes} / 3`

    } else {
        mistakesSection.innerHTML = `No Mistake Count`
    }

    container.style.display = "grid";
    // container.style.setProperty("--grid-size", gridSize)
    // container.style.setProperty("--cell-size", `7vmin`)

    const gameBoard = new Grid(container, gridSize, diffLevel, eraseFalseSetting.checked);

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
                cell.cell.style.setProperty("--cellBackground", 'rgb(142, 149, 155)')

                checkWin(gameBoard, gridSize);

                let selectedBox = document.getElementById(cell.number_);
                let remaining = selectedBox.lastChild;

                //Game Advanced Setting
                if (!numberBoxSetting.checked) {
                    selectedNumber = 0;
                    boxes.forEach((box) => {
                        box.toggle = false;
                        box.box.style.transform = "scale(1)";
                    })
                }

                if (Number(remaining.innerHTML) > 1) {
                    remaining.innerHTML = Number(remaining.innerHTML) - 1;
                } else {
                    selectedBox.remove();
                    selectedNumber = 0;
                }

            } else if (cell.hidden && selectedNumber !== cell.number_) {
                cell.cell.innerHTML = selectedNumber;
                selectedNumber = 0;
                cell.false = true;

                boxes.forEach((box) => {
                    box.toggle = false;
                    box.box.style.transform = "scale(1)";
                })

                cell.cell.style.setProperty("--cellBackground", 'rgb(238, 74, 74)')

                //Game Advanced Setting
                if (mistakesSetting.checked) {
                    mistakes++;
                    mistakesSection.innerHTML = `Mistakes: ${mistakes} / 3`;

                    if (mistakes > 2) {
                        alert("You lost");
                        window.location.reload();
                    }
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
            gameBoard.rows[i][k].number_ = sudokuMap[i][k];

            if (gameBoard.rows[i][k].hidden) {
                hiddenNumbers[gameBoard.rows[i][k].number_][1]++;
            }
        }
    }

}

function createNumbersBox(gameBoard) {
    let numbersBox = document.createElement("div");
    numbersBox.className = "numbers-box";

    for (let i = 1; i < hiddenNumbers.length; i++) {
        if (hiddenNumbers[i][1] == 0) {

        } else {
            let box = new NumbersBox(hiddenNumbers, numbersBox, i);
            let boxElement = box.box;
            let numberElement = box.numberElement;
            let remainElement = box.remainElement;

            boxes.push(box);
        }
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

function checkWin(gameBoard, gridSize) {
    let count = 0;
    gameBoard.cells.forEach((cell) => {
        if (cell.hidden) {
            return false;
        } else {
            count++;
        }
    })

    if (count == Number(gridSize) * Number(gridSize)) {
        alert("You Win")
    }
}

function setTimer() {
    //Game Advanced Settings
    let currentTime = new Date().getTime();
    let stopTime = currentTime + (timerInput.value * 60000);

    let myInterval = setInterval(function () {

        currentTime = new Date().getTime();

        let distance = stopTime - currentTime + 2000;

        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        console.log(minutes, seconds);

        timer.textContent = minutes > 10 ? minutes : "0" + minutes + ":" + seconds;

        if (distance < 0) {
            clearInterval(myInterval)
            alert("You lost");
            window.location.reload();
        }
    }, 1000)




}


