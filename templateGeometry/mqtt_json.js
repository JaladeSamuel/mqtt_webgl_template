client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"templateGeo");
client.connect({userName : "ptut",password : "ptut",onSuccess:onConnect});
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

client.onMessageArrived = function (message) {
			var msg=message.payloadString;
			var destination=message.destinationName;
			console.log("Topic de destination : "+destination);
			console.log("Message : "+msg);
			var splitTopic=destination.split("/");
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
						console.log("Create");
						console.log("Objet : "+msg);
						switch(msg){
							case "Cube" :
								var id = AjoutObjectGeometry("BoxGeometry");
								break;
							case "Sphere" :
								var id = AjoutObjectGeometry("SphereGeometry");
								break;
							case "Plan" :
								var id = AjoutObjectGeometry("PlaneGeometry");
								break;
							case "Point" :
								var id = AjoutObjectGeometry("PointGeometry");
								break;
							case "Line" :
								var id = AjoutObjectGeometry("LineGeometry");
								break;
						}
						console.log("ID de l'objet : " +id);
						client.subscribe("templateGeo/obj/delete/"+id+"/");
						client.subscribe("templateGeo/obj/position/"+id+"/");
						client.subscribe("templateGeo/obj/scale/"+id+"/");
						client.subscribe("templateGeo/obj/color/"+id+"/");
						client.subscribe("templateGeo/obj/select/"+id+"/");
						client.subscribe("templateGeo/obj/json/"+id+"/");
						//Retour de l'ID
						console.log("PUSH ID on TOPIC : templateGeo/retourID/");
						msage = new Paho.MQTT.Message(''+id);
						msage.destinationName = "templateGeo/retourID/";
						client.send(msage);
						cpt = cpt + 1;
						break;
					case "delete":
						var idObj=parseInt(splitTopic[3]);
						console.log("Delete");
						console.log("ID : "+idObj);
						deleteElement(idObj);
						break;
					case "json":
						var idObj=splitTopic[3];
						console.log("JSON PARSE");
						console.log("ID : "+idObj);
						console.log("MSSAGE :"+msg);
						obj = JSON.parse(msg);
						if(obj.delete=="1"){
							m = new Paho.MQTT.Message('');
							var topic = "templateGeo/obj/delete/"+idObj+"/";
							m.destinationName = topic;
							client.send(m);
						}else{
							mPos = new Paho.MQTT.Message(obj.position);
							mClr = new Paho.MQTT.Message(obj.color);
							mScl = new Paho.MQTT.Message(obj.scale);
							var topicPosition = "templateGeo/obj/position/"+idObj+"/";
							var topicColor = "templateGeo/obj/color/"+idObj+"/";
							var topicScale = "templateGeo/obj/scale/"+idObj+"/";
							mPos.destinationName = topicPosition;
							mClr.destinationName = topicColor;
							mScl.destinationName = topicScale;
							client.send(mPos);
							client.send(mClr);
							client.send(mScl);
							if(obj.select=="1"){
								mSlc = new Paho.MQTT.Message('');
								var topicSelect = "templateGeo/obj/select/"+idObj+"/";
								mSlc.destinationName = topicSelect;
								client.send(mSlc);
							}
						}

						break;
					case "position":
						var idObj=parseInt(splitTopic[3]);
						console.log("Position");
						console.log("ID : "+idObj);
						console.log("Positions :"+msg);
						var vpos=msg.split(",");
						var vx = vpos[0];
						var vy = vpos[1];
						var vz = vpos[2];
						setPosition(idObj,vx,vy,vz);
						break;
					case "scale":
					  var idObj=parseInt(splitTopic[3]);
						console.log("Scale");
						console.log("ID : "+idObj);
						console.log("Echelle :"+msg);
						setScale(idObj,msg);
						break;
					case "color":
						var idObj=parseInt(splitTopic[3]);
						console.log("Color");
						console.log("ID : "+idObj);
						console.log("Color :"+msg);
						setColor(idObj,msg);
						break;
					case "select":
						var idObj=parseInt(splitTopic[3]);
						console.log("Select");
						console.log("ID : "+idObj);
						selectObject(idObj,lastSelect);
						break;
				}

			}
			console.log("________________________________");
			console.log("________________________________");

}
