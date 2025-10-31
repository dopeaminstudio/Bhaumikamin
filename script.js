// Basic Three.js setup
const container = document.getElementById("container");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Create a glowing sphere
const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x0099ff,
  emissive: 0x0055aa,
  roughness: 0.4,
  metalness: 0.7,
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x00aaff, 2);
pointLight.position.set(2, 2, 3);
scene.add(pointLight);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.005;
  sphere.rotation.x += 0.002;
  renderer.render(scene, camera);
}
animate();

// Responsive resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
