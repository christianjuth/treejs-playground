const MIN_Z = 100;
const ORIGIN_Z = 50;
const CAMERA_Z = 100;
const NUMBER_OF_OBJECTS = 50;

function clamp(min, val, max) {
  return Math.min(max, Math.max(val, min));
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000 
);
scene.background = new THREE.Color( 0x000214 );

// Add object
const objects = [];

for (let i = 0; i < NUMBER_OF_OBJECTS; i++) {
  const geometry = new THREE.BoxBufferGeometry( 2, 2, 2 );
  const edges = new THREE.EdgesGeometry( geometry );
  const line = new THREE.LineSegments( edges, new MeshLineMaterial({ 
    color: 0x00f2ff,
  }));

  line.position.z = (((CAMERA_Z + MIN_Z) / NUMBER_OF_OBJECTS) * i) + ORIGIN_Z;

  scene.add( line );
  objects.push(line);
}

camera.position.z = CAMERA_Z;


// Create renderer

const renderer = new THREE.WebGLRenderer({ antialias: true });
document.body.appendChild( renderer.domElement );

// Viewport

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

window.addEventListener('resize', handleResize);
handleResize();

// Mouse
let mouse = {
  x: 0,
  y: 0
}
let handleMousemove = (event) => {
  mouse.x = (event.x / window.innerWidth) - 0.5;
  mouse.y = (event.y / window.innerHeight) - 0.5;
};
document.addEventListener('mousemove', handleMousemove);

// Start
let prev = 0;
const animate = function (timestamp) {
  requestAnimationFrame( animate );

  const elapsed = (timestamp - prev) || 0;

  objects.forEach(line => {
    line.rotation.z += 0.001;
    line.position.z = (((line.position.z - ORIGIN_Z) + (elapsed / 500)) % (CAMERA_Z - ORIGIN_Z)) + ORIGIN_Z;
    const color = line.material.color.getHSL(line);
    
    const hue = (line.position.z - ORIGIN_Z) / (CAMERA_Z - ORIGIN_Z);
    
    line.material.color.setHSL(hue, color.s, color.l);

    line.position.x = mouse.x * 2;
    line.position.y = mouse.y * -2;
  });

  renderer.render( scene, camera );

  prev = timestamp;
};

animate();