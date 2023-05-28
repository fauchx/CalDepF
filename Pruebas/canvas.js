let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let circles = [];
let movingCircleIndex = -1;

canvas.addEventListener('mousemove', function (e) {
    let mousePos = getMousePos(canvas, e);
    let circleUnderCursor = circleUnderMouse(mousePos);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllCircles();

    if (circleUnderCursor !== -1) {
        canvas.style.cursor = 'move';
    } else {
        canvas.style.cursor = 'auto';
        drawCircle(mousePos, 'rgba(0, 0, 255, 0.5)'); // Dibujar círculo en el movimiento del puntero del mouse
        for (let circle of circles) {
            drawLine(mousePos, circle); // Dibujar línea a todos los círculos existentes
        }
    }
});

canvas.addEventListener('mouseout', function (e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllCircles();
});

canvas.addEventListener('mousedown', function (e) {
    let mousePos = getMousePos(canvas, e);
    let circleUnderCursor = circleUnderMouse(mousePos);

    if (circleUnderCursor !== -1) {
        movingCircleIndex = circleUnderCursor;
    } else {
        circles.push({ x: mousePos.x, y: mousePos.y, color: randomColor() });
        drawAllCircles();
    }
});

canvas.addEventListener('mousemove', function (e) {
    if (movingCircleIndex !== -1) {
        let mousePos = getMousePos(canvas, e);
        circles[movingCircleIndex] = { x: mousePos.x, y: mousePos.y, color: circles[movingCircleIndex].color };
        drawAllCircles();
    }
});

canvas.addEventListener('mouseup', function (e) {
    movingCircleIndex = -1;
});

canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    let mousePos = getMousePos(canvas, e);
    let circleUnderCursor = circleUnderMouse(mousePos);
    if (circleUnderCursor !== -1) {
        circles.splice(circleUnderCursor, 1);
        drawAllCircles();
    }
});

function circleUnderMouse(mousePos) {
    for (let i = 0; i < circles.length; i++) {
        let dx = mousePos.x - circles[i].x;
        let dy = mousePos.y - circles[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < 8) { // radio cambiado a 8px
            return i;
        }
    }
    return -1;
}

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function drawCircle(position, color) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, 8, 0, 2 * Math.PI, false); // radio cambiado a 8px
    ctx.fillStyle = color;
    ctx.fill();
}

function drawLine(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function drawAllCircles() {
    for (let circle of circles) {
        drawCircle({ x: circle.x, y: circle.y }, circle.color);
    }
}

function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

document.getElementById("matrixButton").addEventListener("click", function () {
    if (circles.length > 0 && circles.length % 2 === 0) {
        let matrix = [];
        for (let i = 0; i < circles.length; i++) {
            matrix[i] = [];
            for (let j = 0; j < circles.length; j++) {
                let dx = circles[i].x - circles[j].x;
                let dy = circles[i].y - circles[j].y;
                matrix[i][j] = Math.sqrt(dx * dx + dy * dy);
            }
        }
        console.log(matrix);
    } else {
        alert("El numero de circulos debe ser par y mayor que 0.");
    }
});
