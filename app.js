const calcBody = document.querySelector(".calc_body");
const currOutput = document.querySelector(".calc_output_result");
const prevOutput = document.querySelector(".calc_putput_formul");

const calc = [
  { role: "equal", value: "=" },
  { role: "number", value: "." },
  { role: "number", value: 0 },
  { role: "negetive", value: "±", op: 'neg' },

  { role: "operation", value: "+" },
  { role: "number", value: 3 },
  { role: "number", value: 2 },
  { role: "number", value: 1 },

  { role: "operation", value: "–" },
  { role: "number", value: 6 },
  { role: "number", value: 5 },
  { role: "number", value: 4 },

  { role: "operation", value: "×" },
  { role: "number", value: 9 },
  { role: "number", value: 7 },
  { role: "number", value: 8 },

  { role: "operation", value: "÷" },
  { role: "operation", value: "√", op: 'sqrt' },
  { role: "operation", value: "X²", op: 'power' },
  { role: "operation", value: "⅟ x", op: 'divide' },

  { role: "operation", value: "del", op: 'delete' },
  { role: "operation", value: "C", op: 'clearAll' },
  { role: "operation", value: "CE", op: 'clear' },
  { role: "operation", value: "⁒" },
].reverse();

class Calculator {
  constructor() {
    this.previousCurrentNumber = "";
    this.prevNumber = "";
    this.currNumber = "";
    this.operation = "";
    this.calcStatus = false;
    this.opStatus = false;
  }

  createCalc(element) {
    for (let i = 0; i < calc.length; i++) {
      const calcButton = document.createElement("button");
      calcButton.setAttribute('data-role', calc[i].role);
      calcButton.classList.add("calc_btn");
      if (calc[i].role == "operation") calcButton.classList.add("dark");
      if (calc[i].role == "equal") calcButton.classList.add("blue_dark");
      calc[i].op && calcButton.setAttribute('data-op', calc[i].op);
      calcButton.textContent = calc[i].value;
      element.append(calcButton);
    }
  }

  getValue(btn) {
    let btnOp;
    btn.getAttribute('data-op') ? btnOp = btn.getAttribute('data-op') : undefined;
    const btnRole = btn.getAttribute('data-role');
    const btnValue = btn.textContent;

    if (this.calcStatus) {
      if (this.checkForEmpty(this.prevNumber, this.currNumber)) {
        this.prevNumber = "";
        this.operation = "";
        this.calcStatus = false;
        this.updateScreens();
      }
    }

    if (btnRole == "number") {
      if (this.currNumber[0] == "0" && btnValue == "0" && !this.currNumber.includes(".")) return;

      if (btnValue == "." && this.currNumber.includes(".")) return
      this.currNumber += btnValue;
      this.previousCurrentNumber = this.currNumber;
      this.updateScreens();
      return
    }

    if (btnRole == "operation" && !btnOp) {
      if (this.currNumber !== "") this.prevNumber = this.currNumber;
      this.operation = btnValue;
      this.currNumber = "";
      this.opStatus = true;
      this.updateScreens();
      return
    }

    if (btnOp) {
      this.handleOperation(btnOp);
      this.updateScreens();
      return
    }

    if (btnRole == "equal") {
      if (this.checkForEmpty(this.prevNumber, this.currNumber)) {
        this.calcStatus = true;
        this.calcualte();
        this.updateScreens();
        return
      }
    }
  }

  toFloatNumber(number) {
    return parseFloat(number);
  }

  handleOperation(opType) {
    if (opType === "delete") {

      this.currNumber = this.currNumber.toString().slice(0, -1);
      this.updateScreens();
      return
    }

    if (opType === "clearAll") {
      this.prevNumber = "";
      this.currNumber = "";
      this.operation = "";
      this.previousCurrentNumber = "";
      this.updateScreens();
      return
    }

    if (opType === "clear") {
      this.currNumber = "";
      this.updateScreens();
      return
    }

    if (opType === "neg") {
      this.currNumber = (-this.currNumber);
      this.updateScreens();
      return;
    }

    if (opType === "sqrt") {
      this.currNumber = Math.sqrt(this.currNumber);
      this.updateScreens();
      return;
    }

    if(opType === "power") {
      this.currNumber = Math.pow(this.toFloatNumber(this.currNumber), 2);
      this.updateScreens();
      return;
    }
  }

  calcualte() {
    switch (this.operation) {
      case "+":
        this.currNumber = this.toFloatNumber(this.prevNumber) + this.toFloatNumber(this.currNumber);
        break;
      case "–":
        this.currNumber = this.toFloatNumber(this.prevNumber) - this.toFloatNumber(this.currNumber);
        break;
      case "×":
        this.currNumber = this.toFloatNumber(this.prevNumber) * this.toFloatNumber(this.currNumber);
        break;
      case "÷":
        this.currNumber = this.toFloatNumber(this.prevNumber) / this.toFloatNumber(this.currNumber);
        break;
      case "⁒":
        this.currNumber = this.toFloatNumber(this.prevNumber) % this.toFloatNumber(this.currNumber);
        break;
      default:
        return this
    }
  }

  updateScreens() {
    currOutput.textContent = this.currNumber;
    if (this.calcStatus) prevOutput.textContent = `${this.prevNumber} ${this.operation} ${this.previousCurrentNumber} =`
    else prevOutput.textContent = `${this.prevNumber} ${this.operation}`;
  }

  checkForEmpty(curr, prev) {
    if (prev != "" && curr != "") return true;
  }
}

const calculator = new Calculator();
calculator.createCalc(calcBody);

document.addEventListener("click", e => {
  let btn;
  if (e.target.matches('.calc_btn')) btn = e.target;
  if (e.target.closest('.calc_btn')) btn = e.target;
  if (btn != null) calculator.getValue(btn);
})