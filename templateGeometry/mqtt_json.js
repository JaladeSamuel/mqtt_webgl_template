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
				console.log("Arrivé d'un ID apres création");
				console.log("ID :"+msg);
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
					}
			}else{
				switch(splitTopic[2]){
					case "create":
						var idObj=splitTopic[3];
						console.log("Create");
						console.log("Objet : "+msg);
						console.log("ID de l'objet : " +cpt);
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
						client.subscribe("templateGeo/obj/delete/"+cpt+"/");
						console.log("subscribe templateGeo/obj/delete/"+cpt+"/")
						client.subscribe("templateGeo/obj/position/"+cpt+"/");
						client.subscribe("templateGeo/obj/scale/"+cpt+"/");
						client.subscribe("templateGeo/obj/color/"+cpt+"/");
						client.subscribe("templateGeo/obj/select/"+cpt+"/");
						//Retour de l'ID
						console.log("PUSH ID on TOPIC : templateGeo/retourID/");
						msage = new Paho.MQTT.Message(''+cpt);
						msage.destinationName = "templateGeo/ID/";
						client.send(msage);
						cpt = cpt + 1;
						break;
					case "delete":
						var idObj=splitTopic[3];
						console.log("Delete");
						console.log("ID : "+idObj);
						deleteElement(idObj);
						break;
					case "position":
						var idObj=splitTopic[3];
						console.log("Position");
						console.log("ID : "+idObj);
						console.log("Positions :"+msg);
						var vpos=msg.split(",");
						console.log("pos"+vpos)
						var vx = vpos[0];
						var vy = vpos[1];
						var vz = vpos[2];
						setPosition(idObj,vx,vy,vz);
						break;
					case "scale":
					  var idObj=splitTopic[3];
						console.log("Scale");
						console.log("ID : "+idObj);
						console.log("Echelle :"+msg);
						setScale(idObj,msg);
						break;
					case "color":
						var idObj=splitTopic[3];
						console.log("Color");
						console.log("ID : "+idObj);
						console.log("Color :"+msg);
						setColor(idObj,msg);
						break;
					case "select":
						var idObj=splitTopic[3];
						console.log("Select");
						console.log("ID : "+idObj);
						selectObject(idObj,lastSelect);
						break;
				}
			}
}
