(() => {

    const dist = (x1, y1, x2, y2) => Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    const map = (n, start1, stop1, start2, stop2) => (n - start1) / (stop1 - start1) * (stop2 - start2) + start2; // p5.js

    const WIDTH = 1000;
    const HEIGHT = 1000;
    let dim = 25;
    let degree = 0;
    let xPosDefault = 0;
    const maxD = dist(0, 0, WIDTH / 2, HEIGHT / 2);
    
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    dimSizeSlider.value = dim;
    
    let renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(WIDTH, HEIGHT);

    // camera
    let camera = new THREE.PerspectiveCamera(45, 1, 0.1, 10000);
    // camera.position.set(-800, 600, 600);
    camera.position.set(-500, 600, 700);
    camera.lookAt(0, 0, 0);

    // let camera = new THREE.OrthographicCamera(-WIDTH/2, WIDTH/2, HEIGHT/2, -HEIGHT/2, 1, 1000);
    
    // camera.position.set(-WIDTH / 2, WIDTH /2, WIDTH / 2);
    // camera.lookAt(0, 0, 0);

    // light
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-500, 1000, 0);
    
    let material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    
    let scene;
    let cubes = [];
    const setup = () => {
        cubes = [];
        degree = 0;
        scene = new THREE.Scene();
        scene.add(light);
        scene.add(camera);
        xPosDefault = (-WIDTH / 4 + dim / 2);

        let geometry = new THREE.BoxGeometry(
            dim - 2, dim, dim - 2
        );

        let countPerRow = Math.round(WIDTH / dim / 2);
        for (let x = 0; x < countPerRow; x++) {
            let row = [];
            for (let z = 0; z < countPerRow; z++) {
                let cube = new THREE.Mesh(geometry, material);
                cube.scale.y = 1;
                cube.position.set(xPosDefault + x * dim, 0, xPosDefault + z * dim);
                row.push(cube);
                scene.add(cube);
            }
            cubes.push(row);
        }
        
        dimValueText.innerText = dimSizeSlider.value;
    };

    setup();
    
    let animFrame = NaN;

    const draw = () => {
        for (let x = 0; x < cubes.length; x++) {
            let row = cubes[x];
            for (let z = 0; z < row.length; z++) {
                let cube = row[z];
                let d = dist(xPosDefault + x * dim, xPosDefault + z * dim, 0, 0);
                let offset = map(d, 0, maxD, -10, 10);
                
                let angle = degree + offset;
                let y = Math.floor(map(Math.sin(angle), -1, 1, dim, Math.max(Math.min(12 * dim, 0.5 * HEIGHT), 300)));
                
                cube.scale.y = y / dim;
            }
        }

        renderer.render(scene, camera);
        degree -= 0.05;
        animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    dimSizeSlider.addEventListener('mouseup', () => {
        cancelAnimationFrame(animFrame);
        dim = parseInt(dimSizeSlider.value);
        setup();
        
        animFrame = requestAnimationFrame(draw);
    });

})()