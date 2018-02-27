client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"templateGeo");
var cpt = 0;
client.onConnectionLost = function (responseObject){
	console.log("Connection perdue: "+responseObject.errorMessage);
}
function onConnect(){
	console.log("Connecte");
	client.subscribe("templateGeo");
	client.subscribe("templateGeo/obj/create/");
	client.subscribe("templateGeo/obj/delete/");
}
client.connect({onSuccess: onConnect});


client.onMessageArrived = function (message) {
			console.log("Message arrive: " + message.payloadString);
			console.log("Topic:     " + message.destinationName);
			var msg=message.payloadString;
			var tab=msg.split(" ");
			var destination=message.destinationName;
			console.log(destination);
			switch(destination){
				case "templateGeo/obj/create/":
					console.log(cpt);
					console.log(msg);
					switch(msg){
						case "Cube" :
							AjoutObjectGeometry("BoxGeometry");
						case "Sphere" :
							AjoutObjectGeometry("SphereGeometry");
					}
					break;
				case "templateGeo/obj/delete/":
					console.log(cpt);
					console.log(msg);
					break;
				case "templateGeo":
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
