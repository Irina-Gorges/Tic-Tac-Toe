let fields = [null, null, null, null, null, null, null, null, null];

function init() {
    render();
}

let currentShape = "circle"; // Start mit Kreis

function render() {
    let contentDiv = document.getElementById("content");

    let tableHTML = "<table>";
    for (let i = 0; i < 3; i++) {
        tableHTML += "<tr>";
        for (let j = 0; j < 3; j++) {
            let index = i * 3 + j;
            let symbol = "";
            if (fields[index] === "circle") {
                symbol = generateCircleSVG();
            } else if (fields[index] === "cross") {
                symbol = generateCrossSVG();
            }
            tableHTML += `<td onclick="handleClick(${index}, this)">${symbol}</td>`;
        }
        tableHTML += "</tr>";
    }
    tableHTML += "</table>";

    contentDiv.innerHTML = tableHTML;
}

function restartGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    render();
}

function handleClick(index, element) {
    if (fields[index] !== null) return;

    fields[index] = currentShape;

    if (currentShape === "circle") {
        element.innerHTML = generateCircleSVG();
    } else {
        element.innerHTML = generateCrossSVG();
    }

    element.removeAttribute("onclick");

    // Spielerwechsel
    currentShape = currentShape === "circle" ? "cross" : "circle";

    checkForWinner();
}

//  Generiert einen Kreis mit Animation
function generateCircleSVG() {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;

    return `
  <svg width="70" height="70" viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="35"
      cy="35"
      r="${radius}"
      stroke="#00facc"
      stroke-width="5"
      fill="none"
      stroke-dasharray="${circumference}"
      stroke-dashoffset="${circumference}"
      transform="rotate(-90 35 35)"
    >
      <animate 
        attributeName="stroke-dashoffset" 
        from="${circumference}" 
        to="0" 
        dur="0.250s" 
        fill="freeze"
      />
    </circle>
  </svg>
    `;
}

function generateCrossSVG() {
    return `
  <svg width="70" height="70" viewBox="0 0 70 70" xmlns="https://www.w3.org/2000/svg">
    <!-- Diagonale von oben links nach unten rechts -->
    <line x1="15" y1="15" x2="55" y2="55" stroke="#fa00f6" stroke-width="5" stroke-linecap="round">
      <animate 
        attributeName="stroke-dashoffset" 
        from="56.6" 
        to="0" 
        dur="0.250s" 
        fill="freeze" 
        begin="0s"
      />
    </line>
  
    <!-- Diagonale von unten links nach oben rechts -->
    <line x1="15" y1="55" x2="55" y2="15" stroke="#fa00f6" stroke-width="5" stroke-linecap="round">
      <animate 
        attributeName="stroke-dashoffset" 
        from="56.6" 
        to="0" 
        dur="0.250s" 
        fill="freeze" 
        begin="0.250s"
      />
    </line>
  
    <!-- Strich-Animation vorbereiten -->
    <style>
      line {
        stroke-dasharray: 56.6;
        stroke-dashoffset: 56.6;
      }
    </style>
  </svg>
    `;
}

function checkForWinner() {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Reihen
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Spalten
        [0, 4, 8],
        [2, 4, 6], // Diagonalen
    ];

    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            drawWinningLine(combo);
            disableAllClicks();
            return;
        }
    }

    if (!fields.includes(null)) {
        alert("Unentschieden!");
    }
}

function drawWinningLine(combination) {
    const lineColor = "#ffffff";
    const lineWidth = 5;

    const startCell = document.querySelectorAll(`td`)[combination[0]];
    const endCell = document.querySelectorAll(`td`)[combination[2]];
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    const contentRect = document
        .getElementById("content")
        .getBoundingClientRect();

    const lineLength = Math.sqrt(
        Math.pow(endRect.left - startRect.left, 2) +
            Math.pow(endRect.top - startRect.top, 2)
    );
    const lineAngle = Math.atan2(
        endRect.top - startRect.top,
        endRect.left - startRect.left
    );

    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.width = `${lineLength}px`;
    line.style.height = `${lineWidth}px`;
    line.style.backgroundColor = lineColor;
    line.style.top = `${
        startRect.top + startRect.height / 2 - lineWidth / 2
    } px`;
    line.style.left = `${startRect.left + startRect.width / 2} px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.top = `${
        startRect.top + startRect.height / 2 - lineWidth / 2 - contentRect.top
    }px`;
    line.style.left = `${
        startRect.left + startRect.width / 2 - contentRect.left
    }px`;
    line.style.transform = `rotate(${lineAngle}rad)`;
    line.style.transformOrigin = `top left`;
    document.getElementById("content").appendChild(line);
}

function disableAllClicks() {
    const tds = document.querySelectorAll("#content td");
    tds.forEach((td) => td.removeAttribute("onclick"));
}
