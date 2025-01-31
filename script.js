// script.js

const canvas = document.getElementById("scratchCanvas");
const ctx = canvas.getContext("2d");

const hiddenMessage = document.getElementById("hiddenMessage");

let isDrawing = false;
canvas.width = hiddenMessage.offsetWidth;
canvas.height = hiddenMessage.offsetHeight;

// Fill the canvas with a gray scratch layer
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Event Listeners for Mouse & Touch
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", scratch);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", scratch);
canvas.addEventListener("touchend", stopDrawing);

function startDrawing(e) {
    isDrawing = true;
    scratch(e);
}

function scratch(e) {
    if (!isDrawing) return;
    e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.globalCompositeOperation = "destination-out"; // Erase instead of drawing
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

function stopDrawing() {
    isDrawing = false;
    checkScratchCompletion();
}

// Check if most of the area is scratched off
function checkScratchCompletion() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let clearedPixels = 0;

    for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] === 0) {
            clearedPixels++;
        }
    }

    let percentage = (clearedPixels / (pixels.length / 4)) * 100;

    if (percentage > 50) { // If more than 50% is scratched
        canvas.style.display = "none"; // Remove scratch layer
    }
}