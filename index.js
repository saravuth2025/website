document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const keys = document.getElementById('keys');

    let displayValue = '0';
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false; // To check if we need to clear the display for a new number

    function updateDisplay() {
        display.textContent = displayValue;
    }

    // Initialize display
    updateDisplay();

    keys.addEventListener('click', (event) => {
        const { target } = event; // Get the clicked button

        // If the clicked element is not a button, do nothing
        if (!target.matches('button')) {
            return;
        }

        // Get the value of the button (e.g., '7', '+', 'AC', '=')
        const buttonValue = target.textContent;

        // Check button type based on its class
        if (target.classList.contains('number-btn')) {
            inputDigit(buttonValue);
            updateDisplay();
        } else if (target.classList.contains('operator-btn')) {
            handleOperator(buttonValue);
            updateDisplay();
        } else if (target.classList.contains('clear-btn')) {
            if (buttonValue === 'AC') {
                resetCalculator();
            } else if (buttonValue === '±') { // Handle plus/minus
                displayValue = (parseFloat(displayValue) * -1).toString();
            } else if (buttonValue === '%') { // Handle percentage
                displayValue = (parseFloat(displayValue) / 100).toString();
            }
            updateDisplay();
        } else if (buttonValue === '=') {
            performCalculation();
            updateDisplay();
        }
    });

    function inputDigit(digit) {
        if (waitingForSecondOperand === true) {
            displayValue = digit;
            waitingForSecondOperand = false;
        } else {
            // Prevent multiple decimals
            if (digit === '.' && displayValue.includes('.')) {
                return;
            }
            // If display is '0', replace it; otherwise, append
            displayValue = displayValue === '0' ? digit : displayValue + digit;
        }
    }

    function handleOperator(nextOperator) {
        const inputValue = parseFloat(displayValue);

        if (operator && waitingForSecondOperand) {
            operator = nextOperator; // Allow changing operator before second operand
            return;
        }

        // If firstOperand is null, set the current display value as firstOperand
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            // If an operator exists and we have a first operand, calculate the result
            const result = calculate(firstOperand, inputValue, operator);
            displayValue = String(result);
            firstOperand = result; // Set result as new firstOperand for chaining
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
    }

    function calculate(firstNum, secondNum, op) {
        switch (op) {
            case '+':
                return firstNum + secondNum;
            case '-':
                return firstNum - secondNum;
            case '×': // Using the HTML entity for multiplication
            case 'x': // For manual input if you use 'x'
                return firstNum * secondNum;
            case '÷': // Using the HTML entity for division
            case '/': // For manual input if you use '/'
                if (secondNum === 0) {
                    alert("Error: Division by zero!");
                    return 0; // Or handle as desired, e.g., NaN
                }
                return firstNum / secondNum;
            default:
                return secondNum; // Should not happen with valid operators
        }
    }

    function performCalculation() {
        if (firstOperand === null || operator === null || waitingForSecondOperand) {
            return; // Not enough operands or waiting for new input
        }

        const secondOperand = parseFloat(displayValue);
        const result = calculate(firstOperand, secondOperand, operator);

        displayValue = String(result);
        firstOperand = null; // Reset for next calculation
        operator = null;
        waitingForSecondOperand = false;
    }

    function resetCalculator() {
        displayValue = '0';
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
    }
});



