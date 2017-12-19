var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light;
var crate, crateTexture, crateNormalMap, crateBumpMap;
var tabObject = new Array();
var keyboard = {};
var player = { height: 1.4, speed: 0.5, turnSpeed: Math.PI*0.02 };
var USE_WIREFRAME = false;

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);
window.onload = init;

function init(){
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/900, 1, 1000);

	createSphere(1,'#FFFFFF',0,1,0,true,true);
  createCube(1,'#FFFFFF',3,3,3,true,true);
	createFloor(50,50,'#FFFFFF',true);
	createAmbientLight('#404040',0.5);
	createPointLight('#FFFFFF',1,18,1,-2,6,-2, true);
	setCameraPos(1,player.height,-5,0,player.height,0);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth,900);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	document.body.appendChild(renderer.domElement);

	animate();
}

/* Crée un point lumineux */
function setCameraPos(x,y,z,vecteurX,vecteurY,vecteurZ){
	camera.position.set(x, y, z);
	camera.lookAt(new THREE.Vector3(vecteurX,vecteurY,vecteurZ));
}

/* Crée un point lumineux */
function createPointLight(color, intensity, distance, decay, x, y, z, castOmbre){
	light = new THREE.PointLight(color, intensity, distance, decay);
	light.position.set(x,y,z);
	light.castShadow = castOmbre;
	scene.add(light);
}

/* Crée une lumiere ambiante */
function createAmbientLight(color,intensity){
	ambientLight = new THREE.AmbientLight(color,intensity);
	scene.add(ambientLight);
}

/* Crée un sol */
function createFloor(x,y,color,ombreReceive){
	meshFloor = new THREE.Mesh(
		new THREE.PlaneGeometry(x,y, 10,10),
		new THREE.MeshPhongMaterial({color:color, wireframe:USE_WIREFRAME})
	);
	meshFloor.rotation.x -= Math.PI / 2;
	meshFloor.receiveShadow = ombreReceive;
	scene.add(meshFloor);


}
function inverserWireframe(){
  for(i=0;i<tabObject.length;i++){
     tabObject[i].material.wireframe=!tabObject[i].material.wireframe;
  }

}
/* animation + touches */
function animate(){

  requestAnimationFrame(animate);

  for(i=0;i<tabObject.length;i++){
     tabObject[i].rotation.x += 0.01;
     tabObject[i].rotation.y += 0.02;

  }

  if(keyboard[90]){ // Z -> avant
		camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
		camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[83]){ // S -> arriere
		camera.position.x += Math.sin(camera.rotation.y) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
	}
	if(keyboard[81]){ // Q -> gauche
		camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
	}
	if(keyboard[68]){ // D -> droite
		camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
		camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
	}

	if(keyboard[37]){ // left arrow key
		camera.rotation.y -= player.turnSpeed;
	}
	if(keyboard[39]){ // right arrow key
		camera.rotation.y += player.turnSpeed;
	}
	if(keyboard[38]){ // right arrow key
		camera.rotation.x -= player.turnSpeed;
	}
	if(keyboard[40]){ // right arrow key
		camera.rotation.x += player.turnSpeed;
	}
  renderer.render(scene, camera);
}

/* Créé un cube */
function createCube(size,colors,posX, posY, posZ, ombreCast, ombreReceive){
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshPhongMaterial({ color: colors })
  );
  mesh.position.set(posX, posY, posZ);
  mesh.receiveShadow = ombreReceive;
  mesh.castShadow = ombreCast;
  tabObject.push(mesh);
  scene.add(mesh);
}

/* Créé une sphere */
function createSphere(size,colors,posX, posY, posZ, ombreCast, ombreReceive){
  mesh = new THREE.Mesh(
    new THREE.SphereGeometry(size, 50, 20),
    new THREE.MeshPhongMaterial({ color: colors })
  );
  mesh.position.set(posX, posY, posZ);
  mesh.receiveShadow = ombreReceive;
  mesh.castShadow = ombreCast;
  tabObject.push(mesh);
  scene.add(mesh);
}

/* fonction appuie touche */
function keyDown(event){
	keyboard[event.keyCode] = true;
}

/* fonction releve touche */
function keyUp(event){
	keyboard[event.keyCode] = false;
}
