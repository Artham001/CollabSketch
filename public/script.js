const socket=io();

socket.on('drawing',data=>{
    ctx.beginPath();
    ctx.moveTo(data.from.x, data.from.y);
    ctx.lineTo(data.to.x, data.to.y);
    ctx.stroke();
})

const canvas=document.getElementById('whiteboard');

const ctx=canvas.getContext('2d');

//canvas.height=600;
//canvas.width=800;
function resizeCanvas(){
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;

    ctx.lineWidth=5;
    ctx.lineCap='round';
    ctx.strokeStyle='black';
}
window.addEventListener('resize',resizeCanvas);
resizeCanvas();


let drawing =false;
ctx.lineWidth=5;
ctx.lineCap='round';
ctx.strokeStyle = 'black';

let lastPos=null;

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
    lastPos=pos;
}

function stopDrawing() {
    drawing = false;
    lastPos=null;
    ctx.beginPath()
}

function draw(e) {
    e.preventDefault();

    if (!drawing || !lastPos) return;

    const pos = getMousePos(canvas, e);

    // Draw the line locally
    ctx.beginPath(); // Start a new path for each segment
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke()

    // Emit the drawing data to the server
    socket.emit('drawing', {
        from: lastPos,
        to: pos
    });
    lastPos=pos;
}

// Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart',startDrawing);
canvas.addEventListener('touchend',stopDrawing);
canvas.addEventListener('touchmove',draw);

const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const messages = document.getElementById('messages');

chatForm.addEventListener('submit', (e) => {
  
    e.preventDefault();

    if (chatInput.value) {
         socket.emit('chat message', {
            text: chatInput.value,
            sender: socket.id 
        });
        chatInput.value = ''; // Clear the input box
    }
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
    // Auto-scroll to the bottom
    messages.scrollTop = messages.scrollHeight;
});