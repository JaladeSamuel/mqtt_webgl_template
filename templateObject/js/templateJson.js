var camera, scene, renderer, objects, container;

//Accrocher la scene au container
container = document.getElementById( 'container' );

//Declaration de la caméra
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( 4, 4, 4 );

//Initialisation des variables pour les mouvements
var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };

//Declaration de la scene
scene = new THREE.Scene();

//Lumière ambiante
var ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( ambientLight );

//Initialisation du renderer
renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

//Resize de la fenetre + mouvements
window.addEventListener( 'resize', onWindowResize, false );
window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

//Animation + mouvement clavier via appel a la méthode animate
animate();

//Fonction de resize de la fenetre
function onWindowResize( event ) {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

//Animation + mouvement dans l'espace
function animate() {
	requestAnimationFrame( animate );
	camera.lookAt( scene.position );
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

//Appuyer sur une touche
function keyDown(event){
	keyboard[event.keyCode] = true;
}

//Relever une touche
function keyUp(event){
	keyboard[event.keyCode] = false;
}
