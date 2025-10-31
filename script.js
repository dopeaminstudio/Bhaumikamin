// THREE.js Setup
const container = document.getElementById("container");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Ground plane
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x111122 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

// Ball
const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
const ballMat = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  emissive: 0x004488,
  metalness: 0.6,
  roughness: 0.4,
});
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.y = 0.4;
scene.add(ball);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const pointLight = new THREE.PointLight(0x00aaff, 1.5);
pointLight.position.set(2, 3, 3);
scene.add(pointLight);

// Physics variables
let velocity = 0;
let gravity = -0.005;
let isBouncing = false;
let startTime = 0;
let timerElem = document.getElementById("timer");

// Click interaction
window.addEventListener("click", (e) => {
  // Raycast to check if the ball was clicked
  const mouse = new THREE.Vector2(
    (e.clientX / window.innerWidth) * 2 - 1,
    -(e.clientY / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(ball);

  if (intersects.length > 0) {
    velocity = 0.15 + Math.random() * 0.05; // bounce power
    isBouncing = true;
    startTime = performance.now();
  }
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Apply gravity
  if (isBouncing) {
    ball.position.y += velocity;
    velocity += gravity;

    if (ball.position.y <= 0.4) {
      ball.position.y = 0.4;
      velocity = 0;
      isBouncing = false;
      timerElem.textContent = `Hold Time: 0.00s`;
    } else {
      const elapsed = (performance.now() - startTime) / 1000;
      timerElem.textContent = `Hold Time: ${elapsed.toFixed(2)}s`;
    }
  }

  ball.rotation.y += 0.01;
  ball.rotation.x += 0.005;

  renderer.render(scene, camera);
}

animate();

// Handle resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
