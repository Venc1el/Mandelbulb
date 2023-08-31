// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas').appendChild(renderer.domElement);

// Create a Mandelbulb fractal geometry
const mandelbulbGeometry = new THREE.BufferGeometry();

const positions = [];
const colors = [];

const detail = 100;
const power = 8;
const scale = 0.5;
const bailout = 8;

const vertex = new THREE.Vector3();
const color = new THREE.Color();

for (let i = 0; i <= detail; i++) {
  const phi = Math.PI * 2 * i / detail;

  for (let j = 0; j <= detail; j++) {
    const theta = Math.PI * j / detail;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);

    vertex.set(x, y, z);

    for (let k = 0; k < power; k++) {
      const r = vertex.length();

      if (r > bailout) break;

      vertex.set(
        Math.pow(r, power) * Math.sin(theta * power) * Math.cos(phi * power),
        Math.pow(r, power) * Math.sin(theta * power) * Math.sin(phi * power),
        Math.pow(r, power) * Math.cos(theta * power)
      );

      vertex.add(new THREE.Vector3(x, y, z));
    }

    positions.push(vertex.x * scale, vertex.y * scale, vertex.z * scale);
    color.setHSL((phi + Math.PI) / (Math.PI * 2), 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
  }
}

mandelbulbGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
mandelbulbGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Create a material for the Mandelbulb fractal
const mandelbulbMaterial = new THREE.PointsMaterial({
  size: 0.01,
  vertexColors: true
});

// Create a mesh with the Mandelbulb fractal geometry and material
const mandelbulbMesh = new THREE.Points(mandelbulbGeometry, mandelbulbMaterial);
scene.add(mandelbulbMesh);

// Set up zoom variables
const zoomSpeed = 0.001;
let zoomLevel = 1;

// Mouse and touch event handlers
function handleZoom(event) {
  const delta = event.deltaY || event.touches[0].deltaY || event.touches[1].deltaY;
  zoomLevel -= delta * zoomSpeed;
  zoomLevel = Math.max(zoomLevel, 0.1); // Limit zoom level to prevent extreme zooming in or out
  camera.position.z = zoomLevel;
}

document.addEventListener('wheel', handleZoom);
document.addEventListener('touchmove', handleZoom);

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  mandelbulbMesh.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

// Resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);
