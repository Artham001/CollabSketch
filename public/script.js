const socket = io();

// Get all HTML elements
const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messages = document.getElementById('messages');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const eraserBtn = document.getElementById('eraserBtn');
const clearBtn = document.getElementById('clearBtn');
const undoBtn = document.getElementById('undoBtn');

// ==================
// State Variables
// ==================
let drawing = false;
let lastPos = null;
let drawingHistory = [];
let currentPath = [];
let isErasing = false;

// ==================
// Socket.IO Listeners (Receiving events from server)
// ==================
socket.on('drawing', (data) => {
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.width;
    
    ctx.beginPath();
    ctx.moveTo(data.from.x, data.from.y);
    ctx.lineTo(data.to.x, data.to.y);
    ctx.stroke();
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg.text;

    if (msg.sender === socket.id) {
        item.classList.add('my-message');
    } else {
        item.classList.add('other-message');
    }
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
});

socket.on('clear canvas', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
});

// ==================
// Event Listeners (Handling user actions)
// ==================

// Tool listeners
colorPicker.addEventListener('change', (e) => {
    isErasing = false;
    ctx.strokeStyle = e.target.value;
    eraserBtn.classList.remove('active');
});

brushSize.addEventListener('change', (e) => {
    ctx.lineWidth = e.target.value;
});

eraserBtn.addEventListener('click', () => {
    isErasing = !isErasing; // Toggle the erasing state
    eraserBtn.classList.toggle('active'); // Toggle the '.active' class
});

clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory = [];
    socket.emit('clear canvas');
});

undoBtn.addEventListener('click', () => {
    if (drawingHistory.length > 0) {
        drawingHistory.pop();
        redrawCanvas();
    }
});

// Canvas listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', stopDrawing);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

// Chat listener
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (chatInput.value) {
        socket.emit('chat message', {
            text: chatInput.value,
            sender: socket.id
        });
        chatInput.value = '';
    }
});

// Window resize listener
window.addEventListener('resize', resizeCanvas);

// ==================
// Functions
// ==================

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    redrawCanvas();
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    if (evt.touches && evt.touches.length > 0) {
        return {
            x: evt.touches[0].clientX - rect.left,
            y: evt.touches[0].clientY - rect.top
        };
    }
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function startDrawing(e) {
    drawing = true;
    const pos = getMousePos(canvas, e);
    lastPos = pos;
    currentPath = [];
}

function stopDrawing() {
    if (drawing) {
        drawing = false;
        if (currentPath.length > 0) {
            drawingHistory.push(currentPath);
        }
        lastPos = null;
        ctx.beginPath();
    }
}

function draw(e) {
    e.preventDefault();
    if (!drawing || !lastPos) return;

    const pos = getMousePos(canvas, e);
    
    const colorToUse = isErasing ? '#ffffff' : colorPicker.value;

    const lineData = {
        from: lastPos,
        to: pos,
        color: colorToUse,
        width: brushSize.value
    };

    ctx.strokeStyle = lineData.color;
    ctx.lineWidth = lineData.width;

    ctx.beginPath();
    ctx.moveTo(lineData.from.x, lineData.from.y);
    ctx.lineTo(lineData.to.x, lineData.to.y);
    ctx.stroke();

    currentPath.push(lineData);

    socket.emit('drawing', lineData);
    lastPos = pos;
}

function redrawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawingHistory.forEach(path => {
        const firstSegment = path[0];
        if (!firstSegment) return;
        
        ctx.strokeStyle = firstSegment.color;
        ctx.lineWidth = firstSegment.width;
        
        ctx.beginPath();
        ctx.moveTo(firstSegment.from.x, firstSegment.from.y);
        
        path.forEach(segment => {
            ctx.lineTo(segment.to.x, segment.to.y);
        });
        ctx.stroke();
    });

    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = brushSize.value;
}

// Initial setup call
resizeCanvas();