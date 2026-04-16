const grid = document.getElementById("grid");
const resetBtn = document.getElementById("resetBtn");
const svg = document.getElementById("lineLayer");

let isDragging = false;
let visited = [];
let pathPoints = [];

const rows = 5, cols = 4;
let cells = [];

// Create grid
for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");

    const r = Math.floor(i / cols);
    const c = i % cols;

    if (i === 10) {
        cell.textContent = "1";
        cell.dataset.value = "1";
    }
    if (i === 9) {
        cell.textContent = "2";
        cell.dataset.value = "2";
    }

    cell.dataset.row = r;
    cell.dataset.col = c;

    grid.appendChild(cell);
    cells.push(cell);

    cell.addEventListener("mousedown", () => start(cell));
    cell.addEventListener("mouseenter", () => move(cell));

    cell.addEventListener("touchstart", () => start(cell));
    cell.addEventListener("touchmove", (e) => {
        const touch = document.elementFromPoint(
            e.touches[0].clientX,
            e.touches[0].clientY
        );
        if (touch && touch.classList.contains("cell")) {
            move(touch);
        }
    });
}

document.addEventListener("mouseup", end);
document.addEventListener("touchend", end);

// Hide instruction after 3 sec
setTimeout(() => {
    const inst = document.getElementById("instruction");
    if (inst) inst.style.display = "none";
}, 3000);

// Get center
function getCenter(cell) {
    const rect = cell.getBoundingClientRect();
    const gridRect = grid.getBoundingClientRect();
    return {
        x: rect.left - gridRect.left + rect.width / 2,
        y: rect.top - gridRect.top + rect.height / 2
    };
}

// Draw line
function drawLine() {
    svg.innerHTML = "";
    if (pathPoints.length < 2) return;

    const pathData = pathPoints.map((p, i) =>
        (i === 0 ? "M" : "L") + p.x + "," + p.y
    ).join(" ");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", pathData);
    path.setAttribute("stroke", "red");
    path.setAttribute("stroke-width", "10");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linecap", "round");

    svg.appendChild(path);
}

// Start
function start(cell) {
    if (cell.dataset.value === "1") {
        isDragging = true;
        visited = [cell];
        pathPoints = [getCenter(cell)];
    }
}

// Move
function move(cell) {
    if (!isDragging) return;

    const last = visited[visited.length - 1];

    const r1 = parseInt(last.dataset.row);
    const c1 = parseInt(last.dataset.col);
    const r2 = parseInt(cell.dataset.row);
    const c2 = parseInt(cell.dataset.col);

    const isAdjacent =
        Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;

    if (isAdjacent && !visited.includes(cell)) {
        visited.push(cell);
        pathPoints.push(getCenter(cell));
        drawLine();
    }
}

// End
function end() {
    if (!isDragging) return;
    isDragging = false;

    const last = visited[visited.length - 1];

    if (
        visited.length === rows * cols &&
        last.dataset.value === "2"
    ) {
        completeGame();
    } else {
        resetGame();
    }
}

// Reset
function resetGame() {
    visited = [];
    pathPoints = [];
    svg.innerHTML = "";
}

resetBtn.addEventListener("click", resetGame);

// Confetti
function confetti() {
    for (let i = 0; i < 80; i++) {
        const c = document.createElement("div");
        c.style.position = "absolute";
        c.style.width = "6px";
        c.style.height = "6px";
        c.style.background = `hsl(${Math.random()*360},100%,50%)`;
        c.style.top = "0px";
        c.style.left = Math.random() * window.innerWidth + "px";
        c.style.animation = "fall 2s linear forwards";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2000);
    }
}

// Complete
function completeGame() {
    document.getElementById("gameContainer").style.display = "none";
    resetBtn.style.display = "none";

    confetti();

    const finalScreen = document.getElementById("finalScreen");
    const arrow = document.getElementById("tapArrow");
    const twentyone = document.getElementById("twentyone");

    finalScreen.style.display = "flex"; // IMPORTANT FIX

    setTimeout(() => {
        arrow.style.opacity = "1";
        arrow.style.animation = "bounce 0.6s infinite alternate";

        const link = "https://canva.link/jhxhd3jzclat3rp";

        function go() {
            window.location.href = link;
        }

        twentyone.addEventListener("click", go);
        twentyone.addEventListener("touchstart", go);

    }, 2000);
}