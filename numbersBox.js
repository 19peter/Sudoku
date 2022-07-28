export default class NumbersBox {
    constructor(hiddenNumbers, numbersBox, i) {

        if (hiddenNumbers[i][1] == 0) {

        } else {
            let box = document.createElement("div");
            box.className = "box";

            let number = document.createElement("div");
            number.className = "number";

            let remain = document.createElement("div");
            remain.className = "remain";

            this.number = hiddenNumbers[i][0];
            this.remain = hiddenNumbers[i][1];

            box.id = this.number;

            number.innerHTML = this.number;
            remain.innerHTML = this.remain;

            box.appendChild(number);
            box.appendChild(remain);

            numbersBox.appendChild(box);

            this.box = box;
            this.remainElement = remain;
            this.numberElement = number;
            this.toggle = false;
        }
    }
}