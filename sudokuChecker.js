export default function sudokuChecker(mockSudoku) {
    for (let i = 0; i < mockSudoku.length; i++) {
        let array = mockSudoku[i];
        for (let j = 0; j < array.length; j++) {
            if (mockSudoku[i][j] == 0) {
                console.log("Error found");
                return false;
            }
        }
    }
    return true;
}