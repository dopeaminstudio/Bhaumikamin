// === THREE.js SETUP ===
const container = document.getElementById("container");
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Adjust camera based on screen
if (window.innerWidth < 600) {
  camera.position.set(0, 1.2, 3.5);
} else {
  camera.position.set(0, 1.5, 5);
}

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// === LIGHTS ===
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00aaff, 2);
pointLight.position.set(2, 3, 3);
scene.add(pointLight);

// === OBJECTS ===
// Floor
const planeGeo = new THREE.PlaneGeometry(10, 10);
const planeMat = new THREE.MeshStandardMaterial({ color: 0x111122 });
const plane = new THREE.Mesh(planeGeo, planeMat);
plane.rotation.x = -Math.PI / 2;
plane.position.y = 0;
scene.add(plane);

// Ball
const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
const ballMat = new THREE.MeshStandardMaterial({
  color: 0x00aaff,
  emissive: 0x003366,
  metalness: 0.8,
  roughness: 0.3,
});
const ball = new THREE.Mesh(ballGeo, ballMat);
ball.position.y = 0.4;
scene.add(ball);

// === GAME VARIABLES ===
let velocity = 0;
let gravity = -0.005;
let isBouncing = false;
let startTime = 0;
let timerElem = document.getElementById("timer");

// === INTERACTION HANDLER ===
function handleInteraction(x, y) {
  const mouse = new THREE.Vector2(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1
  );
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(ball);
  if (intersects.length > 0) {
    velocity = 0.15 + Math.random() * 0.05;
    isBouncing = true;
    startTime = performance.now();
  }
}

// Mouse + touch support
window.addEventListener("click", (e) => handleInteraction(e.clientX, e.clientY));
window.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  handleInteraction(touch.clientX, touch.clientY);
});

// === ANIMATION LOOP ===
function animate() {
  requestAnimationFrame(animate);

  if (isBouncing) {
    ball.position.y += velocity;
    velocity += gravity;

    // Bounce stop
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

  // Spin animation
  ball.rotation.y += 0.01;
  ball.rotation.x += 0.005;

  renderer.render(scene, camera);
}
animate();

// === RESIZE ===
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
