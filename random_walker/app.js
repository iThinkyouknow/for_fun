const WIDTH = 1000;
const HEIGHT = 1000;

canvas.width = WIDTH;
canvas.height= HEIGHT;

let ctx = canvas.getContext('2d');

const getRandomInt = (min = 0) => (limit) => () => Math.floor(Math.random() * limit + min);

const getRandom256Min10 = getRandomInt(10)(246);

const getRandomDir4 = getRandomInt()(4);

const getRandomDist = getRandomInt(10)(30);

const getRandomColor = () => {
    const r = getRandom256Min10();
    const g = getRandom256Min10();
    const b = getRandom256Min10();
    const color = `rgb(${r}, ${g}, ${b})`;
    return color;
};

let animFrame = NaN;

const getNewPos = (x, y) => {
    const dir4 = getRandomDir4();
    let newX = x;
    let newY = y;
    const distance = getRandomDist();
    if (dir4 === 0) {
        newY -= distance;
    } else if (dir4 === 1) {
        newY += distance
    } else if (dir4 === 2) {
        newX -= distance;
    } else if (dir4 === 3) {
        newX += distance;
    }
    if (newX < 0) {
        newX = 0;
    } else if (newX > WIDTH) {
        newX = WIDTH;
    }

    if (newY < 0) {
        newY = 0;
    } else if (newY > HEIGHT) {
        newY = HEIGHT;
    }

    return [newX, newY];
}

const drawStraightLine = (x, y) => () => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    const [newX, newY] = getNewPos(x, y);
    
    const color = getRandomColor();
    ctx.strokeStyle = color;
    ctx.lineTo(newX, newY);
    ctx.stroke();
    ctx.closePath();
    animFrame = requestAnimationFrame(drawStraightLine(newX, newY));
};


const setup = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const color = getRandomColor();
    ctx.fillStyle = color;
    const currentPosX = WIDTH / 2;
    const currentPosY = HEIGHT / 2;
    ctx.fillRect(currentPosX, currentPosY, 1, 1);
    ctx.beginPath();
    ctx.lineWidth = 5;
    animFrame = requestAnimationFrame(drawStraightLine(currentPosX, currentPosY));
};

setup();





