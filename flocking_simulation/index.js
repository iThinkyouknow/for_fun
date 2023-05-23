console.log(canvas);
const width = 1000;
const height = 1000;
canvas.width = width;
canvas.height = height;

let ctx = canvas.getContext('2d');
const flock = [];

const createVector = (x = 0, y = 0) => {
    let obj = {x, y};

    const magSq = () => Math.pow(obj.x, 2) + Math.pow(obj.y, 2);

    obj.add = (vector) => {
        obj.x += vector.x;
        obj.y += vector.y;
        return obj;
    };

    

    obj.sub = (vector) => {
        obj.x -= vector.x;
        obj.y -= vector.y;
    };

    obj.divide = (num) => {
        if (num === 0) return obj;
        obj.x /= num;
        obj.y /= num;
        return obj
    };

    obj.multiply = (num) => {
        obj.x *= num;
        obj.y *= num;
        return obj;
    };

    obj.setMag = (mag) => {
        const currentMagSq = magSq();
        if (currentMagSq > 0) {
            obj.divide(Math.sqrt(currentMagSq))
                .multiply(mag);
        }

        return obj;
    };

    obj.limit = (max) => {
        const magnitudeSq = magSq();
        if (magnitudeSq > Math.pow(max, 2)) {
            obj.setMag(max)
        }
        return obj;
    };
    
    return obj;
}

const dist = (vectorA, vectorB) => {
    return Math.sqrt(Math.pow(vectorA.x - vectorB.x, 2) + Math.pow(vectorA.y - vectorB.y, 2));
};

const subtractTwoVector = (vectorFrom, vectorBy) => {
    return createVector(vectorFrom.x - vectorBy.x, vectorFrom.y - vectorBy.y);
};

const Boid = () => {
    let obj = {
        position: createVector(width * Math.random(), height * Math.random()),
        velocity: createVector(((Math.random() - 0.5) * 2) * Math.random() * 2, (Math.random() - 0.5) * 2 * Math.random() * 2),
        acceleration: createVector(),
        maxForce: 1,
        maxSpeed: 4
    };

    obj.update = () => {
        obj.position.add(obj.velocity);
        obj.velocity.add(obj.acceleration);
        obj.velocity.limit(obj.maxSpeed);
        obj.acceleration.multiply(0);
    };

    obj.align = (boids) => {
        const perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        steering = boids.reduce((steering, boid) => {
            // console.log('s',steering, boid, 's');
            if (boid === obj || dist(obj.position, boid.position) > perceptionRadius) return steering;
            steering.add(boid.velocity);
            total++;
            return steering;
        }, steering);
        // console.log(steering);
        if (total > 0) {
            steering.divide(total);
            steering.setMag(obj.maxSpeed);
            steering.sub(obj.velocity);
            steering.limit(obj.maxForce);
        }
        
        return steering;
    };

    obj.cohesion = (boids) => {
        const perceptionRadius = 50;
        let steering = createVector();
        let total = 0;
        steering = boids.reduce((steering, boid) => {
            // console.log('s',steering, boid, 's');
            if (boid === obj || dist(obj.position, boid.position) > perceptionRadius) return steering;
            steering.add(boid.position);
            total++;
            return steering;
        }, steering);
        // console.log(steering);
        if (total > 0) {
            steering.divide(total);
            steering.sub(obj.position);
            steering.setMag(obj.maxSpeed);
            steering.sub(obj.velocity);
            steering.limit(obj.maxForce);
        }
        

        return steering;
    };

    obj.separation = (boids) => {
        const perceptionRadius = 100;
        let steering = createVector();
        let total = 0;
        steering = boids.reduce((steering, boid) => {
            // console.log('s',steering, boid, 's');
            const d = dist(obj.position, boid.position);
            if (boid === obj || d > perceptionRadius) return steering;
            let diff = subtractTwoVector(obj.position, boid.position);
            diff.divide(d * d)
        
            steering.add(diff);
            total++;
            return steering;
        }, steering);
        // console.log(steering);
        if (total > 0) {
            steering.divide(total);
            steering.setMag(obj.maxSpeed);
            steering.sub(obj.velocity);
            steering.limit(obj.maxForce);
        }

        return steering;
    };

    obj.flock = (boids) => {
        let alignment = obj.align(boids);
        let cohesion = obj.cohesion(boids);
        let separation = obj.separation(boids);
        obj.acceleration.add(separation);
        obj.acceleration.add(alignment);
        obj.acceleration.add(cohesion);
    };

    obj.edges = () => {
        if (obj.position.x > width) {
            obj.position.x = 0;
        } else if (obj.position.x < 0) {
            obj.position.x = width;
        }

        if (obj.position.y > height) {
            obj.position.y = 0;
        } else if (obj.position.y < 0) {
            obj.position.y = height;
        }
    }
    // show

    return obj;
};

const MathPI2 = 2 * Math.PI;
for (let i = 0; i < 100; i++) {
    flock.push(Boid());
}

let animationFrame = NaN;

const draw = () => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgb(255, 255, 255)'
    flock.forEach((boid) => {
        
        boid.edges();
        boid.flock(flock);
        boid.update();
        ctx.beginPath();
        ctx.arc(boid.position.x, boid.position.y, 5, 0, MathPI2, false);
        ctx.fill();

    });
    
    animationFrame = requestAnimationFrame(draw);
};



const noLoop = () => {
    cancelAnimationFrame(animationFrame);
};

const loop = () => {
    animationFrame = requestAnimationFrame(draw);
};

loop();
// 31:14
// todo: set mag
