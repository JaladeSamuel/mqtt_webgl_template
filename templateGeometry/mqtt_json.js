client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"templateGeo");
var cpt = 0;
client.onConnectionLost = function (responseObject){
	console.log("Connection perdue: "+responseObject.errorMessage);
}
function onConnect(){
	console.log("Connecte");
	client.subscribe("templateGeo/obj/create/");
	client.subscribe("templateGeo/retourID/");
	client.subscribe("templateGeo/scene/");
}
client.connect({onSuccess: onConnect});


client.onMessageArrived = function (message) {
			var msg=message.payloadString;
			var destination=message.destinationName;
			console.log("Topic de destination : "+destination);
			console.log("Message : "+msg);
			var splitTopic=destination.split("/");
			console.log(splitTopic)
			if(splitTopic[1]=="retourID"){
				console.log("_____________________________");
				console.log("Arrivé d'un ID apres création");
				console.log("ID :"+msg);
				console.log("_____________________________");
			}else if(splitTopic[1]=="scene"){
				console.log("Scene");
				console.log("Message : "+msg);
				var tab=msg.split("/");
				switch(tab[0]){
					case "x":
					case "y":
					case "z":
						positionScene(tab[0],tab[1]);
						break;
					case"rotate":
						rotateScene(tab[1]);
						break;
				console.log("_____________________________");
			}else{
				switch(splitTopic[2]){
				case "templateGeo/retourID/":
					console.log("_____________________________");
					console.log("Arrivé d'un ID apres création");
					console.log("ID :"+msg);
					console.log("_____________________________");
					break;
				case "templateGeo/obj/create/":
					console.log("Create");
					console.log("Objet : "+msg);
					console.log("Compteur d'object : " +cpt);
					switch(msg){
						case "Cube" :
							AjoutObjectGeometry("BoxGeometry");
							break;
						case "Sphere" :
							AjoutObjectGeometry("SphereGeometry");
							break;
						case "Plan" :
							AjoutObjectGeometry("PlaneGeometry");
							break;
						case "Point" :
							AjoutObjectGeometry("PointGeometry");
							break;
					}

					client.subscribe("templateGeo/obj/delete/"+cpt);
					client.subscribe("templateGeo/obj/position/"+cpt);
					client.subscribe("templateGeo/obj/scale/"+cpt);
					client.subscribe("templateGeo/obj/color/"+cpt);
					client.subscribe("templateGeo/obj/select/"+cpt);
					//Retour de l'ID
					console.log("PUSH ID on TOPIC : templateGeo/retourID/");
					msage = new Paho.MQTT.Message(''+cpt);
					msage.destinationName = "templateGeo/ID/";
					client.send(msage);
					cpt = cpt + 1;
					console.log("_____________________________");
					break;
				case "templateGeo/obj/delete/":
					console.log("Delete");
					console.log("ID : "+msg);
					deleteElement(msg);
					console.log("_____________________________");
					break;
				case "templateGeo/obj/position/":
					var tab=msg.split("/");
					console.log("Position");
					console.log("ID : "+tab[0]);
					console.log("Positions :"+tab[1]);
					var vpos=tab[1].split(",");
					var vx = vpos[0];
					var vy = vpos[1];
					var vz = vpos[2];
					setPosition(tab[0],vx,vy,vz);
					console.log("_____________________________");
					break;
				case "templateGeo/obj/scale/":
					var tab=msg.split("/");
					console.log("Scale");
					console.log("ID : "+tab[0]);
					console.log("Echelle :"+tab[1]);
					setScale(tab[0],tab[1]);
					break;
				case "templateGeo/obj/color/":
					var tab=msg.split("/");
					console.log("Color");
					console.log("ID : "+tab[0]);
					console.log("Color :"+tab[1]);
					setColor(tab[0],tab[1]);
					break;
				case "templateGeo/obj/select/":
					console.log("Select");
					console.log("ID : "+msg);
					selectObject(msg,lastSelect);
					break;
			}
}
