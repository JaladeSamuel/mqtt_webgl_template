client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"templateGeo");
client.connect({userName : "ptut",password : "ptut",onSuccess:onConnect});
client.onConnectionLost = function (responseObject){
	console.log("Connection perdue: "+responseObject.errorMessage);
}
function onConnect(){
	console.log("Connecte");
	client.subscribe("templateGeo/scene/");
	client.subscribe("templateGeo/obj/create/");
	client.subscribe("templateGeo/obj/delete/");
	client.subscribe("templateGeo/obj/position/");
	client.subscribe("templateGeo/obj/scale/");
	client.subscribe("templateGeo/obj/color/");
	client.subscribe("templateGeo/obj/select/");
	client.subscribe("templateGeo/ID/");
}


client.onMessageArrived = function (message) {
			var msg=message.payloadString;
			var destination=message.destinationName;
			console.log("Topic de destination : "+destination);
			console.log("Message : "+msg);
			switch(destination){
				case "templateGeo/ID/":
					console.log("Arrivé d'un ID");
					console.log("ID :"+msg);
					break;
				case "templateGeo/obj/create/":
					console.log("Create");
					console.log("Objet : "+msg);
					
					switch(msg){
						case "Cube" :
							var id =AjoutObjectGeometry("BoxGeometry");
							break;
						case "Sphere" :
							var id =AjoutObjectGeometry("SphereGeometry");
							break;
						case "Plan" :
							var id =AjoutObjectGeometry("PlaneGeometry");
							break;
						case "Point" :
							var id =AjoutObjectGeometry("PointGeometry");
							break;
						case "Line" :
							var id = AjoutObjectGeometry("LineGeometry");
							break;
						}
					}
					console.log("Compteur d'object : " +id);
					//Retour de l'ID en MQTT
					//a faire
					console.log("PUSH ID on TOPIC : templateGeo/ID/");
					msage = new Paho.MQTT.Message(''+id);
					msage.destinationName = "templateGeo/ID/";
					client.send(msage);
					break;
				case "templateGeo/obj/delete/":
					console.log("Delete");
					console.log("ID : "+msg);
					deleteElement(parseInt(msg);
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
					setPosition(parseInt(tab[0]),vx,vy,vz);
					break;
				case "templateGeo/obj/scale/":
					var tab=msg.split("/");
					console.log("Scale");
					console.log("ID : "+tab[0]);
					console.log("Echelle :"+tab[1]);
					setScale(parseInt(tab[0]),tab[1]);
					break;
				case "templateGeo/obj/color/":
					var tab=msg.split("/");
					console.log("Color");
					console.log("ID : "+tab[0]);
					console.log("Color :"+tab[1]);
					setColor(parseInt(tab[0]),tab[1]);
					break;
				case "templateGeo/obj/select/":
					console.log("Select");
					console.log("ID : "+msg);
					selectObject(parseInt(msg),lastSelect);
					break;
				case "templateGeo/scene/":
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


					}

					break;
			}
}
