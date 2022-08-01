export default class Grid {
    constructor(container, gridSize, diffLevel) {
        var cellArray = [];
        var rows = [];
        var columns = [];
        var squares = [];

        for (let i = 0; i < Number(gridSize) * Number(gridSize); i++) {
            let cell = new Cell(container, i)
            cellArray.push(cell);
        }
        this.cells = cellArray;


        //Creating rowIndex property for each individual cell to easily point to its horizontal position (index)
        let rowIndex = 0
        for (let i = 0; i < Number(gridSize) * Number(gridSize); i += Number(gridSize)) {
            let row = [];
            for (let k = i; k < Number(gridSize) + i; k++) {
                cellArray[k].rowIndex = rowIndex
                row.push(cellArray[k])
            }
            rows.push(row);
            rowIndex++;
        }
        this.rows = rows;

        //Creating columnIndex property for each individual cell to easily point to its vertical position (index)
        for (let i = 0; i < Number(gridSize); i++) {
            let column = []
            for (let k = i; k < Number(gridSize) * Number(gridSize); k += Number(gridSize)) {
                cellArray[k].columnIndex = i;
                column.push(cellArray[k])
            }
            columns.push(column);
        }
        this.columns = columns;


        //Creating 9 3x3 squares 
        for (let startRow = 0; startRow < Number(gridSize); startRow += Math.sqrt(Number(gridSize))) {

            for (let startCol = 0; startCol < Number(gridSize); startCol += Math.sqrt(Number(gridSize))) {

                let placeholder = [];
                for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {

                    for (let col = startCol; col < startCol + Math.sqrt(Number(gridSize)); col++) {
                        //Gets math.sqrt gridsize number elements in each row array then we move to next row
                        //array and do the same
                        placeholder.push(rows[row][col])
                    }
                }

                squares.push(placeholder)
            }

        }
        this.squares = squares;

        //Creating squareIndex property for each individual cell to easily point to its square index
        //Also creating another index to determine cell position in each square
        this.squares.forEach((square, index) => {
            let indexInsideSquare = 0;
            square.forEach((cell) => {
                cell.squareIndex = index;
                cell.indexInsideSquare = indexInsideSquare;
                indexInsideSquare++;
            })
        })


        //Randomly selecting hidden cells
        for (let square = 0; square < Number(gridSize) / 2; square++) {
            let oppositeSquare = Number(gridSize) - 1 - square;

            //Below we can write a code to implement different difficulty levels based on the number
            //of hidden cells
            //Current is default easy
            let range;
            let rangeStart;
            switch (diffLevel) {
                case "easy":
                    range = 1;
                    rangeStart = 3;
                    break;
                case "hard":
                    range = 3;
                    rangeStart = 4;
                    break;
                case "extreme":
                    range = 3;
                    rangeStart = 8;
                    break;
                default:
                    range = 1;
                    rangeStart = 2;
            }

            let numberOfHiddenCells = Math.floor(Math.random() * range) + rangeStart;

            for (let i = 0; i < numberOfHiddenCells; i++) {
                let randomIndex = Math.floor(Math.random() * 8) + 1;

                let oppositeIndex = Math.abs(Number(gridSize) - 1 - randomIndex);

                this.squares[square][randomIndex].hidden = true;
                this.squares[oppositeSquare][oppositeIndex].hidden = true;
            }
        }


        //Creating background color and hovering color on cells and Writing Numbers inside cells
        this.cells.forEach((el, index) => {
            setTimeout(() => {
                el.cell.classList.add("animated-cell");
                if (!el.hidden) {
                    el.cell.innerHTML = el.number_;
                }
            }, index * 20);

            let normalCellColor = "rgb(142, 194, 194)";
            let clickedCellColor = "rgb(2, 56, 66)";
            let falseCellColor = "rgb(238, 74, 74)";
            let hoverPriColor = "gray";
            let hoverSecColor = "rgb(142, 149, 155)";

            el.cell.style.setProperty("--cellBackground", normalCellColor)

            el.cell.addEventListener("mouseover", () => {
                this.rows[el.rowIndex].forEach((element) => {
                    if (element.false) {
                        element.cell.style.setProperty("--cellBackground", falseCellColor)
                    }
                    else if (element.isClicked) {
                        element.cell.style.setProperty("--cellBackground", clickedCellColor);
                    }
                    else {
                        element.cell.style.setProperty("--cellBackground", hoverSecColor)
                    }
                })

                this.columns[el.columnIndex].forEach((element) => {
                    if (element.false) {
                        element.cell.style.setProperty("--cellBackground", falseCellColor)
                    }
                    else if (element.isClicked) {
                        element.cell.style.setProperty("--cellBackground", clickedCellColor)
                    }
                    else {
                        element.cell.style.setProperty("--cellBackground", hoverSecColor)
                    }
                })

                this.squares[el.squareIndex].forEach((element) => {
                    if (element.false) {
                        element.cell.style.setProperty("--cellBackground", falseCellColor)
                    }
                    else if (element.isClicked) {
                        element.cell.style.setProperty("--cellBackground", clickedCellColor)
                    }
                    else {
                        element.cell.style.setProperty("--cellBackground", hoverPriColor)
                    }
                })

                if (el.false) {
                    el.cell.style.color = "white"
                } else {
                    el.cell.style.color = "cyan"
                }
            })

            el.cell.addEventListener("mouseleave", () => {
                this.rows[el.rowIndex].forEach((element) => {
                    if (element.false) {
                        element.cell.style.setProperty("--cellBackground", falseCellColor)
                    }
                    else if (element.isClicked) {
                        element.cell.style.setProperty("--cellBackground", clickedCellColor)
                    }
                    else {
                        element.cell.style.setProperty("--cellBackground", normalCellColor)
                    }
                })

                this.columns[el.columnIndex].forEach((element) => {
                    if (element.false) {
                        element.cell.style.setProperty("--cellBackground", falseCellColor)
                    }
                    else if (element.isClicked) {
                        element.cell.style.setProperty("--cellBackground", clickedCellColor)
                    }
                    else {
                        element.cell.style.setProperty("--cellBackground", normalCellColor)
                    }
                })

                this.squares[el.squareIndex].forEach((element) => {
                    if (element.false) {
                        element.cell.style.setProperty("--cellBackground", falseCellColor)
                    }
                    else if (element.isClicked) {
                        element.cell.style.setProperty("--cellBackground", clickedCellColor)
                    }
                    else {
                        element.cell.style.setProperty("--cellBackground", normalCellColor)
                    }
                })

                el.cell.style.color = "white"
            })

            el.cell.addEventListener("click", () => {

                this.cells.forEach((cell) => {
                    cell.isClicked = false;
                    cell.cell.style.transform = "scale(1)";
                    cell.cell.classList.remove("clicked-cell");
                    if (!cell.false) {
                        cell.cell.style.setProperty("--cellBackground", normalCellColor);
                    }
                })

                if (!el.isClicked && !el.hidden) {
                    el.isClicked = true;
                    el.cell.style.transform = "scale(1.09)";
                    el.cell.style.setProperty("--cellBackground", clickedCellColor);
                    this.cells.forEach((cell) => {
                        if (cell.number_ == el.number_ && !cell.hidden) {
                            cell.isClicked = true;
                            cell.cell.style.transform = "scale(1.1)";
                            cell.cell.classList.add("clicked-cell");
                            cell.cell.style.setProperty("--cellBackground", clickedCellColor);
                        }
                    })
                } else if (el.isClicked && !el.hidden) {
                    el.isClicked = false;
                    el.cell.style.transform = "scale(1)";
                    el.cell.style.setProperty("--cellBackground", normalCellColor);

                    this.cells.forEach((cell) => {
                        if (cell.number_ == el.number_ && !cell.hidden) {
                            cell.isClicked = false;
                            cell.cell.style.transform = "scale(1)";
                            cell.cell.classList.remove("clicked-cell")
                            cell.cell.style.setProperty("--cellBackground", normalCellColor);
                        }
                    })
                }
            })

        })
    }
}

class Cell {
    constructor(container, index) {
        this.index = index
        this.number_;
        this.hidden = false;
        this.false = false;
        this.isClicked = false;
        this.cell = document.createElement("div");
        this.cell.classList.add("cell");

        container.appendChild(this.cell);
    }
}