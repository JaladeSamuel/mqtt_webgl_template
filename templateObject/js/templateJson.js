var container, stats, clock, mixer;
var camera, scene, renderer, objects,str, bool, taille, cpt;

client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"receiveJSON");
bool=true;
cpt=0;
str="";
client.onConnectionLost = function (responseObject){
	console.log("Connection perdue: "+responseObject.errorMessage);
}

function onConnect(){
	console.log("Connecte");
	client.subscribe("JSONtemplate");
}



client.onMessageArrived = function (message) {
	if(bool==true){
		console.log("taille : " + message.payloadString);
		taille=parseInt(message.payloadString,10);
		bool=false;
	}else{
			str+=message.payloadString;
			cpt++;
			console.log("compteur " + cpt);
			if(cpt==taille){
				messageEntier();
			}

	}
}
function messageEntier(){
	obj=JSON.parse(str);
	var loader = new THREE.JSONLoader();
	var model = loader.parse( obj );
	var material = model.materials[ 0 ];
	material.morphTargets = true;
	mesh = new THREE.Mesh( model.geometry, material );
	mesh.scale.set( 0.01, 0.01, 0.01 );
	mesh.matrixAutoUpdate = false;
	mesh.updateMatrix();
	scene.add( mesh );
}


client.connect({onSuccess: onConnect});


container = document.getElementById( 'container' );

camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( 4, 4, 4 );

var keyboard = {};
var player = { height:1.8, speed:0.2, turnSpeed:Math.PI*0.02 };
var USE_WIREFRAME = false;
scene = new THREE.Scene();
mixer = new THREE.AnimationMixer( scene );


var ambientLight = new THREE.AmbientLight( 0xffffff );
scene.add( ambientLight );

renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

window.addEventListener( 'resize', onWindowResize, false );
animate();

function onWindowResize( event ) {

	renderer.setSize( window.innerWidth, window.innerHeight );

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

}

function animate() {
	requestAnimationFrame( animate );
	var timer = Date.now() * 0.0005;
	camera.lookAt( scene.position );
	renderer.render( scene, camera );

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
