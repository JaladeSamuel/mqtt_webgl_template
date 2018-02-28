client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"templateGeo");
clientP = new Paho.MQTT.Client("91.224.148.106", Number(2532),"templateGeo");
var cpt = 0;
client.onConnectionLost = function (responseObject){
	console.log("Connection perdue: "+responseObject.errorMessage);
}
function onConnect(){
	console.log("Connecte");
	client.subscribe("templateGeo");
	client.subscribe("templateGeo/obj/create/");
	client.subscribe("templateGeo/obj/delete/");
	client.subscribe("templateGeo/obj/position/");
	client.subscribe("templateGeo/obj/scale/");
	client.subscribe("templateGeo/obj/color/");
	client.subscribe("templateGeo/obj/select/");
	client.subscribe("templateGeo/ID/");
}
client.connect({onSuccess: onConnect});


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
					console.log("PUSH");
					var msage = new Paho.MQTT.Message(cpt);
					msage.destinationName = "templateGeo/ID/";
					msage.qos = 0;
					clientP.send(msage);
					cpt = cpt + 1;
					break;
				case "templateGeo/obj/delete/":
					console.log("Delete");
					console.log("ID : "+msg);
					deleteElement(msg);
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
					console.log("Color# :"+tab[1]);
					setColor(tab[0],tab[1]);
					break;
				case "templateGeo/obj/select/":
					console.log("Select");
					console.log("ID : "+msg);
					selectObject(msg,lastSelect);
					break;
				case "templateGeo":
					console.log("TemplateGeo");
					console.log(cpt);
					console.log(msg);
					break;
			}



			/*if(tab[0]=="cr"){
				var vgeo = tab[1];
				AjoutObjectGeometry(vgeo);
				cpt = cpt + 1;
			}else if(tab[0]=="pos"){
				var vdonnee = tab[1].split(" ");
				var vid = vdonnee[0];
				console.log(vdonnee[0]);
				var vpos = tab[2].split(".");
				var vx = vpos[0];
				var vy = vpos[1];
				var vz = vpos[2];
				setPosition(vid,vx,vy,vz);
			}else if(tab[0]== "select" ){
				var vid = tab[1];
				selectObject(vid,lastSelect);

			}else if(tab[0]=="delete"){
				var vid = tab[1];
				deleteElement(vid);
			}else if(tab[0]=="scl"){
				var vid = tab[1];
				var vscale = tab[2];
				setScale(vid,vscale);
			}else if(tab[0]=="col"){
				var id = tab[1];
				var color = tab[2];
				setColor(id,color);
			}*/
}
