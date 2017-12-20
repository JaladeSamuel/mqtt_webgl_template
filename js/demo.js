var scene, camera, renderer, mesh;
var meshFloor, ambientLight, light, ratio;
var crate, crateTexture, crateNormalMap, crateBumpMap;

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;


	ratio = window.innerWidth / window.innerHeight;
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(90, ratio, 0.1, 1000);


	mesh = new THREE.Mesh(
		new THREE.BoxGeometry(1,1,1),
		new THREE.MeshPhongMaterial({color:0xff4444, wireframe:USE_WIREFRAME})
	);
	mesh.position.y += 1;
	scene.add(mesh);



	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);

	scene.add(light);

		// Model/material loading!
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load("models/Tent_Poles_01.mtl", function(materials){
	materials.preload();
	var objLoader = new THREE.OBJLoader();
	objLoader.setMaterials(materials);

	objLoader.load("models/Puss_in_Boots.obj", function(mesh){

		mesh.traverse(function(node){
			if( node instanceof THREE.Mesh ){
				node.castShadow = true;
				node.receiveShadow = true;
			}
		});

		scene.add(mesh);
		mesh.position.set(-5, 0, 4);
		mesh.rotation.y = -Math.PI/4;
		});
	});


	camera.position.set(0, player.height, -5);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;

	document.body.appendChild(renderer.domElement);

	animate();

function animate(){
	requestAnimationFrame(animate);

	mesh.rotation.x += 0.01;
	mesh.rotation.y += 0.02;

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

	renderer.render(scene, camera);
}

function keyDown(event){
	keyboard[event.keyCode] = true;
}

function keyUp(event){
	keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

window.onload = init;
