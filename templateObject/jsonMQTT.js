var bool, cpt, str;

//Création du client MQTT
client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"receiveJSON");
client.connect({
    userName: "ptut",
    password: "ptut",
    onSuccess: onConnect
});

//Initisalition des variables utiles
bool=true;
cpt=0;
str="";

//Fonction de la connection perdue
client.onConnectionLost = function (responseObject){
	//On affiche la raison
	console.log("Connection perdue: "+responseObject.errorMessage);
}

//Fonction de la connection établie
function onConnect(){
	console.log("Connecte");
	client.subscribe("JSONtemplate");
}


//Fonction de l'arrivée d'un message
client.onMessageArrived = function (message) {
	//Si c'est le premier message, on affiche la "taille" du JSON et on intilise la taille
	if(bool==true){
		console.log("taille : " + message.payloadString);
		taille=parseInt(message.payloadString,10);
		bool=false;
	}else{
	//Sinon, tant que tout le json n'est pas arrivé, on stock les messages dans un string
			str+=message.payloadString;
			cpt++;
			console.log("compteur " + cpt);
			if(cpt==taille){
				//Une fois le string rempli, on appel la fonction de création de l'objet
				createJsonObject();
			}

	}
}

//Fonction de création du JSON
function createJsonObject(){
	//On crée l'objet a partir du string
	obj=JSON.parse(str);
	//On utilise un Loader pour modeliser l'objet
	var loader = new THREE.JSONLoader();
	var model = loader.parse( obj );
	var material = model.materials[ 0 ];
	material.morphTargets = true;
	//On créer l'objet Mesh
	mesh = new THREE.Mesh( model.geometry, material );
	mesh.scale.set( 0.01, 0.01, 0.01 );
	mesh.matrixAutoUpdate = false;
	mesh.updateMatrix();
	//On l'ajoute a la scène
	scene.add( mesh );
}
client.connect({onSuccess: onConnect});
