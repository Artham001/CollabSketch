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