const WIDTH = 1080;
const HEIGHT = 720;

canvas.width = 1080;
canvas.height = 720;

let ctx = canvas.getContext('2d');

function getPoints(max = 5.0) {
    let array = [];
    for (let x = 0; x < max; x += 0.005) {
        const y = Math.pow(Math.E, -x) * Math.cos(2 * Math.PI * x);
        array.push([x, y])
    }

    return array;
}

const max = 5;
const scale = WIDTH / max - 6;
let points = getPoints(max);
pointsText.innerText = points.length;
let epsilon = 1 / Math.pow(10, parseInt(slider.value));

let rdpPoints = [];


const normalize = (vector) => {
    let [x, y] = vector;
    let mag = Math.sqrt(x * x + y * y);
    return [x / mag, y / mag];
};

const dot = (a, b) => {
    return a[0] * b[0] + a[1] * b[1];
};

const scalarProjection = (p, a, b) => {
    let ap = [p[0] - a[0], p[1] - a[1]];
    let ab = [b[0] - a[0], b[1] - a[1]];
    ab = normalize(ab);
    let dotPdt = dot(ap, ab);
    ab[0] *= dotPdt
    ab[1] *= dotPdt

    let normalPt = [a[0] + ab[0], a[1] + ab[1]];
    return normalPt;
}

// stopped at 23:33

const getDist = (c, a, b) => {
    let norm = scalarProjection(c, a, b);
    return Math.pow(c[0] - norm[0], 2) + Math.pow(c[1] - norm[1], 2);
}

const findFurthest = (points, a, b) => {
    let recordDistance = -1;
    let start = points[a];
    let end = points[b];
    let furthestIndex = -1;
    for (let i = a + 1; i < b; i++) {
        let current = points[i];
        let distance = getDist(current, start, end);

        if (distance > recordDistance) {
            recordDistance = distance;
            furthestIndex = i;
        }
    }
    return recordDistance > epsilon
        ? furthestIndex
        : -1;
}

const rdp = (startIndex, endIndex, points, rdpPoints) => {
    let nextIndex = findFurthest(points, startIndex, endIndex);
    if (nextIndex > 0) {
        
        if (startIndex !== nextIndex) {
            rdp(startIndex, nextIndex, points, rdpPoints);
        }
        rdpPoints.push(points[nextIndex]);
        if (endIndex !== nextIndex) {
            rdp(nextIndex, endIndex, points, rdpPoints);
        }
        
    }
    
};



let currIndex = 1;
let animationFrame = null;
const reset = () => {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    const total = points.length;
    rdpPoints = [];
    let start = points[0];
    let end = points[total - 1];
    rdpPoints.push(start);
    rdp(0, total - 1, points, rdpPoints);
    rdpPoints.push(end);

    rdpPointsText.innerText = rdpPoints.length;

    ctx.beginPath();
    ctx.moveTo(0, HEIGHT / 2 - rdpPoints[0][1] * scale);
    ctx.fillStyle = 'blue';
    ctx.strokeStyle = 'orange';
    ctx.lineWidth = 2;
    currIndex = 1;
};

reset();



console.log(rdpPoints);
console.log(points);
const draw = () => {
    let currPoint = rdpPoints[currIndex];
    
    if (currPoint) {
        ctx.lineTo(currPoint[0] * scale, HEIGHT / 2 - currPoint[1] * scale);
        ctx.stroke();
    };

    const currOrgPoint = points[currIndex];
    ctx.fillRect(currOrgPoint[0] * scale, HEIGHT / 2 - currOrgPoint[1] * scale, 10, 10);

    currIndex++;
    if (currIndex < points.length) {
        animationFrame = requestAnimationFrame(draw);
    }
    
}

animationFrame = requestAnimationFrame(draw);

slider.addEventListener("mouseup", (e) => {
    epsilon = 1 / Math.pow(10, parseInt(slider.value));
    elipsonValueText.innerText = epsilon;
    reset();
    currIndex = 1;
    animationFrame = requestAnimationFrame(draw);
});

