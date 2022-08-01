export default function generateSudoku(gridSize) {

    let defaultSudoku = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    let mockSudoku;


    //Generating numbers in first square
    generateSquare(defaultSudoku, gridSize, 0, 0);


    //Generating next squares individually and backtracking
    for (let startRow = 0; startRow < Number(gridSize) - Math.sqrt(Number(gridSize)) + 1; startRow += Math.sqrt(Number(gridSize))) {

        //If startRow is == 1, we skip the first 3 columns and start from the 2nd square
        // startRow == 1 ? 3 : 0
        for (let startCol = startRow == 1 ? 3 : 0; startCol < Number(gridSize); startCol += Math.sqrt(Number(gridSize))) {
            let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

            //Accessing each sqaure below
            //Filling square randomly ==> gives error grid with undefined numbers
            mockSudoku = fillSquare(defaultSudoku, gridSize, startRow, startCol, allNumbers, false);

            let isUndefined = checkUndefinedCells(startRow, startCol, allNumbers, mockSudoku, gridSize);

            if (isUndefined.check == true) {
                let recursionCounter = 0; //Eliminates infinite loops
                backtrack(defaultSudoku, gridSize, startRow, startCol, allNumbers, mockSudoku, isUndefined, recursionCounter)
            }

            checkOnlyAvailableNumber(mockSudoku, gridSize)
            defaultSudoku = mockSudoku;

        }
    }

    defaultSudoku = mockSudoku;

    return defaultSudoku;
}

function filterArray(array, number) {
    return array.filter(a => {
        return a != number
    })
}

function filterArrayfrom2DArray(array, x) {
    return array.filter(a => {
        return a[0] != x[0]
    })
}

function generateSquare(defaultSudoku, gridSize, startRow, startCol) {
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
        for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {

            let randomNumber = Math.floor(Math.random() * numbers.length);
            let randomSeed = numbers[randomNumber];

            numbers = filterArray(numbers, randomSeed);

            defaultSudoku[row][cell] = randomSeed;
        }
    }
}



function fillSquare(defaultSudoku, gridSize, startRow, startCol, allNumbers, scanSquare) {
    let mockSudoku = defaultSudoku;

    //Only runs in the recursive part after the backtracking function
    //Filters allNumbers array from the number inserted in the backtrack
    if (scanSquare) {
        for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
            for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {
                if (mockSudoku[row][cell] != 0) {
                    allNumbers = filterArray(allNumbers, mockSudoku[row][cell])
                }
            }
        }
    }


    for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
        for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {

            //Added conditional in case the mockSudoku contains numbers resulting from the backtrack function
            if (mockSudoku[row][cell] == 0) {
                let availableNumbers = [];
                let usedNumbers = [];

                defaultSudoku[row].forEach((number) => {
                    usedNumbers.push(number)
                })


                for (let searchedCol = 0; searchedCol < Number(gridSize); searchedCol++) {
                    usedNumbers.push(defaultSudoku[searchedCol][cell]);
                }

                usedNumbers = new Set(usedNumbers);

                allNumbers.forEach((number) => {
                    if (usedNumbers.has(number)) {

                    } else {
                        availableNumbers.push(number)
                    }
                })

                let randomChoice = Math.floor(Math.random() * availableNumbers.length);
                let randomNumber = availableNumbers[randomChoice];


                if (availableNumbers.length > 0) {
                    mockSudoku[row][cell] = randomNumber;

                } else {
                    mockSudoku[row][cell] = 0;
                }

                allNumbers = filterArray(allNumbers, randomNumber)
            }
        }
    }
    return mockSudoku
}

function checkUndefinedCells(startRow, startCol, allNumbers, mockSudoku, gridSize) {

    let undefinedCounter = 0;
    let squareNumbers = [];
//     let positions = [];
//     let position = [ /* row , col */]

    for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
        for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {
            if (mockSudoku[row][cell] == 0 || mockSudoku[row][cell] == undefined) {
                undefinedCounter++;
//                 position.push(row, cell)
//                 positions.push(position);
            } else {
                squareNumbers.push(mockSudoku[row][cell]);
            }
        }
    }

    if (undefinedCounter > 0) {

        let unassignedNumbers = [];

        allNumbers.filter((number) => {
            if (squareNumbers.includes(number)) {

            } else {
                unassignedNumbers.push(number)
            }
        })


        let response = {
            check: true,
            unassignedNumbersArray: unassignedNumbers
        };

        return response;
    } else {
        return false;
    }
}

function backtrack(defaultSudoku, gridSize, startRow, startCol, allNumbers, mockSudoku, isUndefined, recursionCounter) {

    //fn Backtracking => fn filling square => fn checking undefined => if true =>  fn backtracking => ...

    if (recursionCounter < 100) {
        recursionCounter++;
        let unassignedNumbers = isUndefined.unassignedNumbersArray;
        let squareNumbers = [];

        //Collecting The square numbers and zeroing their positions
        for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
            for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {
                squareNumbers.push(mockSudoku[row][cell]);
                mockSudoku[row][cell] = 0;
            }
        }

        //Looking at unassinged Numbers and searching for valid place
        LoopOne:
        for (let i = 0; i < unassignedNumbers.length; i++) {
            let unassignedNumber = unassignedNumbers[i];
            // let [rowPosition, cellPosition] = isUndefined.positions[i]

            //Searching for a valid place for the unassigned number
            LoopTwo:
            for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
                for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {

                    let availableNumbers = [];
                    let usedNumbers = [];

                    mockSudoku[row].forEach((number) => {
                        usedNumbers.push(number)
                    })

                    for (let searchedCol = 0; searchedCol < Number(gridSize); searchedCol++) {
                        usedNumbers.push(mockSudoku[searchedCol][cell]);
                    }

                    usedNumbers = new Set(usedNumbers);

                    allNumbers.forEach((number) => {
                        if (usedNumbers.has(number)) {

                        } else {
                            availableNumbers.push(number)
                        }
                    })

                    if (availableNumbers.length > 0) {

                        if (availableNumbers.includes(unassignedNumber)) {
                            mockSudoku[row][cell] = unassignedNumber;

                            break LoopTwo;
                        }
                    } else {
                        mockSudoku[row][cell] = 0;
                    }
                }
            }
        }

        fillSquare(defaultSudoku, gridSize, startRow, startCol, allNumbers, true);

        let isUndefinedRecursive = checkUndefinedCells(startRow, startCol, allNumbers, mockSudoku, gridSize);

        if (isUndefinedRecursive.check == true) {
            backtrack(defaultSudoku, gridSize, startRow, startCol, allNumbers, mockSudoku, isUndefinedRecursive, recursionCounter)
        }
    } else {

    }
}


function refillSquares(mockSudoku, gridSize, row, cell, allNumbers) {
    if (mockSudoku[row][cell] == 0) {
        let availableNumbers = [];
        let usedNumbers = [];

        mockSudoku[row].forEach((number) => {
            usedNumbers.push(number)
        })


        for (let searchedCol = 0; searchedCol < Number(gridSize); searchedCol++) {
            usedNumbers.push(mockSudoku[searchedCol][cell]);
        }

        usedNumbers = new Set(usedNumbers);

        allNumbers.forEach((number) => {
            if (usedNumbers.has(number)) {

            } else {
                availableNumbers.push(number)
            }
        })

        let randomChoice = Math.floor(Math.random() * availableNumbers.length);
        let randomNumber = availableNumbers[randomChoice];

        // mockSudoku[row][cell] = randomNumber;

        if (availableNumbers.length > 0) {
            mockSudoku[row][cell] = randomNumber;
        } else {
            mockSudoku[row][cell] = 0;
        }

        allNumbers = filterArray(allNumbers, randomNumber)
    }
}

function checkOnlyAvailableNumber(mockSudoku, gridSize) {
    for (let startRow = 0; startRow < Number(gridSize) - Math.sqrt(Number(gridSize)) + 1; startRow += Math.sqrt(Number(gridSize))) {

        //If startRow is == 1, we skip the first 3 columns and start from the 2nd square
        // 3  ? 3 : 0;
        for (let startCol = startRow == 1 ? 3 : 0; startCol < Number(gridSize); startCol += Math.sqrt(Number(gridSize))) {


            let allNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            for (let row = startRow; row < startRow + Math.sqrt(Number(gridSize)); row++) {
                for (let cell = startCol; cell < startCol + Math.sqrt(Number(gridSize)); cell++) {


                    if (mockSudoku[row][cell] == 0) {
                        let availableNumbers = [];
                        let usedNumbers = [];

                        mockSudoku[row].forEach((number) => {
                            usedNumbers.push(number)
                        })


                        for (let searchedCol = 0; searchedCol < Number(gridSize); searchedCol++) {
                            usedNumbers.push(mockSudoku[searchedCol][cell]);
                        }

                        usedNumbers = new Set(usedNumbers);

                        allNumbers.forEach((number) => {
                            if (usedNumbers.has(number)) {

                            } else {
                                availableNumbers.push(number)
                            }
                        })

                        if (availableNumbers.length == 1) {
                            mockSudoku[row][cell] = availableNumbers[0];
                        }

                    }
                }
            }
        }
    }
}
