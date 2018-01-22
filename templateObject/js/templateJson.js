var container, stats, clock, mixer;
var camera, scene, renderer, objects,str, bool, taille, cpt, stringInsane;

client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"receiveJSON");
bool=true;
cpt=0;

client.onConnectionLost = function (responseObject){
	console.log("Connection perdue: "+responseObject.errorMessage);
}

function onConnect(){
	console.log("Connecte");
	client.subscribe("JSONtemplate");
}

stringInsane="mmmmmmmmmmmmm";

client.onMessageArrived = function (message) {
	if(bool==true){
		console.log(""+stringInsane);
		console.log("taille : " + message.payloadString);
		taille=parseInt(message.payloadString,10);
		bool=false;
	}else{
			console.log("Message arrive: " + message.payloadString);
			str+=message.payloadString;
			cpt++;
			console.log("compteur " + cpt);
			if(cpt>=taille-2){
				messageEntier();
			}

	}
}

function messageEntier(){
	alert("bonjour");
	console.log("ON AFFICHE LE MESSAGE EN ENTIER \n"+str);
}

client.connect({onSuccess: onConnect});





container = document.getElementById( 'container' );

camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
camera.position.set( 4, 4, 4 );

scene = new THREE.Scene();
mixer = new THREE.AnimationMixer( scene );
if(cpt==26-2){
	var loader = new THREE.JSONLoader();
	loader.load( 'jsonObject/monster.js', function ( geometry, materials ) {

		var material = materials[ 0 ];
		material.morphTargets = true;
		var mesh = new THREE.Mesh( geometry, materials );
		mesh.scale.set( 0.001, 0.001, 0.001 );
		mesh.matrixAutoUpdate = false;
		mesh.updateMatrix();
		scene.add( mesh );
	} );
}


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

}
