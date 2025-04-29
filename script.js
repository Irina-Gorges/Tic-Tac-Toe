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
      stroke="#3ccca4"
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
    <line x1="15" y1="15" x2="55" y2="55" stroke="#de56a0" stroke-width="5" stroke-linecap="round">
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
    <line x1="15" y1="55" x2="55" y2="15" stroke="#de56a0" stroke-width="5" stroke-linecap="round">
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
