const display = document.getElementById("calcDisplay");
const calculator = document.getElementById("calculator");
const dragHeader = document.getElementById("dragHeader");

let offsetX, offsetY;

dragHeader.addEventListener("mousedown", (e) => {
    offsetX = e.clientX - calculator.offsetLeft;
    offsetY = e.clientY - calculator.offsetTop;

    document.addEventListener("mousemove", dragCalculator);
    document.addEventListener("mouseup", stopDragging);
});

function dragCalculator(e) {
    calculator.style.left = `${e.clientX - offsetX}px`;
    calculator.style.top = `${e.clientY - offsetY}px`;
}

function stopDragging() {
    document.removeEventListener("mousemove", dragCalculator);
    document.removeEventListener("mouseup", stopDragging);
}

function appendValue(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch {
        display.value = "Error";
    }
}

function calculateAdvanced(operation) {
    let value = parseFloat(display.value);

    if (isNaN(value) && operation !== "derivative" && operation !== "integral") {
        display.value = "Error";
        return;
    }

    switch (operation) {
        case "sqrt":
            display.value = Math.sqrt(value);
            break;
        case "square":
            display.value = Math.pow(value, 2);
            break;
        case "cube":
            display.value = Math.pow(value, 3);
            break;
        case "cbrt":
            display.value = Math.cbrt(value);
            break;
        case "log":
            display.value = Math.log10(value);
            break;
        case "pow":
            let power = prompt("Enter the power value:");
            display.value = Math.pow(value, parseFloat(power));
            break;
        case "theta":
            // Convert value from degrees to radians for trigonometric functions
            let radians = (value * Math.PI) / 180;

            // Calculate trigonometric values
            const sin = Math.sin(radians).toFixed(4);
            const cos = Math.cos(radians).toFixed(4);
            const tan = Math.tan(radians).toFixed(4);
            const cot = tan !== "0.0000" ? (1 / tan).toFixed(4) : "Infinity";
            const sec = cos !== "0.0000" ? (1 / cos).toFixed(4) : "Infinity";
            const cosec = sin !== "0.0000" ? (1 / sin).toFixed(4) : "Infinity";

            // Display the results
            display.value = `sin(${value})=${sin}, cos(${value})=${cos}, tan(${value})=${tan}, cot(${value})=${cot}, sec(${value})=${sec}, cosec(${value})=${cosec}`;
            break;
	case "derivative":
            let derivativeInput = prompt("Enter the function f(x):", "x^2");
            let xValue = parseFloat(prompt("Enter the point x where f'(x) is calculated:", "1"));
            if (isNaN(xValue)) {
                display.value = "Error";
                return;
            }
            try {
                display.value = `f'(${xValue})=${numericalDerivative(derivativeInput, xValue)}`;
            } catch (error) {
                display.value = "Error";
            }
            break;
        case "integral":
            let integralInput = prompt("Enter the function f(x):", "x^2");
            let lowerLimit = parseFloat(prompt("Enter the lower limit of integration:", "0"));
            let upperLimit = parseFloat(prompt("Enter the upper limit of integration:", "1"));
            if (isNaN(lowerLimit) || isNaN(upperLimit)) {
                display.value = "Error";
                return;
            }
            try {
                display.value = `∫(${lowerLimit} to ${upperLimit})=${numericalIntegral(integralInput, lowerLimit, upperLimit)}`;
            } catch (error) {
                display.value = "Error";
            }
            break;
        default:
            display.value = "Error";
    }
}

// Numerical Derivative Approximation
function numericalDerivative(func, x) {
    const h = 1e-6; // Small step size
    const parser = new Function("x", `return ${func.replace(/\^/g, "**")};`);
    return ((parser(x + h) - parser(x - h)) / (2 * h)).toFixed(4);
}

// Numerical Integral Approximation
function numericalIntegral(func, a, b) {
    const n = 1000; // Number of intervals
    const h = (b - a) / n;
    const parser = new Function("x", `return ${func.replace(/\^/g, "**")};`);
    let sum = 0;

    for (let i = 0; i < n; i++) {
        let xMid = a + (i + 0.5) * h;
        sum += parser(xMid);
    }

    return (sum * h).toFixed(4);
}
