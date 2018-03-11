client = new Paho.MQTT.Client("91.224.148.106", Number(2533), "templateGeo");
client.connect({
    userName: "ptut",
    password: "ptut",
    onSuccess: onConnect
});
client.onConnectionLost = function(responseObject) {
    console.log("Connection perdue: " + responseObject.errorMessage);
}

function onConnect() {
    console.log("Connecte");
    client.subscribe("templateGeo/obj/create/");
    client.subscribe("templateGeo/retourID/");
    client.subscribe("templateGeo/scene/");
}

client.onMessageArrived = function(message) {
    var msg = message.payloadString;
    var destination = message.destinationName;
    console.log("Topic de destination : " + destination);
    console.log("Message : " + msg);
    var splitTopic = destination.split("/");
    if (splitTopic[1] == "retourID") {
        console.log("Arrivé d'un ID apres création");
        console.log("ID :" + msg);
    } else if (splitTopic[1] == "scene") {
        obj = JSON.parse(msg);
        console.log("Scene");
        console.log("Message : " + obj);
        if (obj.x != "null") {
            positionScene("x", obj.x);
        }
        if (obj.y != "null") {
            positionScene("y", obj.y);
        }
        if (obj.z != "null") {
            positionScene("z", obj.z);
        }
        if (obj.rotate != "null") {
            rotateScene(obj.rotate);
        }
    } else {
        switch (splitTopic[2]) {
            case "create":
                obj = JSON.parse(msg);
                console.log("Create");
                console.log("Objet : " + msg);
                switch (obj.shape) {
                    case "Cube":
                        var id = AjoutObjectGeometry("BoxGeometry");
                        break;
                    case "Sphere":
                        var id = AjoutObjectGeometry("SphereGeometry");
                        break;
                    case "Plan":
                        var id = AjoutObjectGeometry("PlaneGeometry");
                        break;
                    case "Point":
                        var id = AjoutObjectGeometry("PointGeometry");
                        break;
                    case "Line":
                        var id = AjoutObjectGeometry("LineGeometry");
                        break;
                }
                client.subscribe("templateGeo/obj/delete/" + id + "/");
                client.subscribe("templateGeo/obj/position/" + id + "/");
                client.subscribe("templateGeo/obj/scale/" + id + "/");
                client.subscribe("templateGeo/obj/color/" + id + "/");
                client.subscribe("templateGeo/obj/select/" + id + "/");
                client.subscribe("templateGeo/obj/json/" + id + "/");
                if (obj.position != "null") {
                    tabpos = obj.position.split(",");
                    console.log("x  " + tabpos[0]);
                    console.log("y  " + tabpos[1]);
                    console.log("z  " + tabpos[2]);
                    stringPos = '{ "position_x":"' + tabpos[0] + '","position_y":"' + tabpos[1] + '","position_z":"' + tabpos[2] + '"}';
                    mPos = new Paho.MQTT.Message(stringPos);
                    var topicPosition = "templateGeo/obj/position/" + id + "/";
                    mPos.destinationName = topicPosition;
                    client.send(mPos);
                }
                if (obj.color != "null") {
                    stringClr = '{ "color":"' + obj.color + '"}';
                    mClr = new Paho.MQTT.Message(stringClr);
                    var topicColor = "templateGeo/obj/color/" + id + "/";
                    mClr.destinationName = topicColor;
                    client.send(mClr);
                }
                if (obj.scale != "null") {
                    stringScl = '{ "scale":"' + obj.scale + '"}';
                    mScl = new Paho.MQTT.Message(stringScl);
                    var topicScale = "templateGeo/obj/scale/" + id + "/";
                    mScl.destinationName = topicScale;
                    client.send(mScl);
                }
                if (obj.select == "1") {
                    mSlc = new Paho.MQTT.Message('');
                    var topicSelect = "templateGeo/obj/select/" + id + "/";
                    mSlc.destinationName = topicSelect;
                    client.send(mSlc);
                }

                console.log("PUSH ID on TOPIC : templateGeo/retourID/");
                msage = new Paho.MQTT.Message('' + id);
                msage.destinationName = "templateGeo/retourID/";
                client.send(msage);
                break;
            case "delete":
                var idObj = splitTopic[3];
                console.log("Delete");
                console.log("ID : " + idObj);
                deleteElement(parseInt(idObj));
                break;
            case "json":
                var idObj = splitTopic[3];
                console.log("JSON PARSE");
                console.log("ID : " + idObj);
                console.log("MSSAGE :" + msg);
                obj = JSON.parse(msg);
                if (obj.position != "null") {
                    tabpos = obj.position.split(",");
                    console.log("x  " + tabpos[0]);
                    console.log("y  " + tabpos[1]);
                    console.log("z  " + tabpos[2]);
                    stringPos = '{ "position_x":"' + tabpos[0] + '","position_y":"' + tabpos[1] + '","position_z":"' + tabpos[2] + '"}';
                    mPos = new Paho.MQTT.Message(stringPos);
                    var topicPosition = "templateGeo/obj/position/" + idObj + "/";
                    mPos.destinationName = topicPosition;
                    client.send(mPos);
                }
                if (obj.color != "null") {
                    stringClr = '{ "color":"' + obj.color + '"}';
                    mClr = new Paho.MQTT.Message(stringClr);
                    var topicColor = "templateGeo/obj/color/" + idObj + "/";
                    mClr.destinationName = topicColor;
                    client.send(mClr);
                }
                if (obj.scale != "null") {
                    stringScl = '{ "scale":"' + obj.scale + '"}';
                    mScl = new Paho.MQTT.Message(stringScl);
                    var topicScale = "templateGeo/obj/scale/" + idObj + "/";
                    mScl.destinationName = topicScale;
                    client.send(mScl);
                }
                if (obj.select == "1") {
                    mSlc = new Paho.MQTT.Message('');
                    var topicSelect = "templateGeo/obj/select/" + idObj + "/";
                    mSlc.destinationName = topicSelect;
                    client.send(mSlc);
                }
                break;
            case "position":
                var idObj = splitTopic[3];
                obj = JSON.parse(msg);
                console.log("Position");
                console.log("ID : " + idObj);
                console.log("Positions :" + obj);
                var vx = obj.position_x;
                var vy = obj.position_y;
                var vz = obj.position_z;
                setPosition(parseInt(idObj), vx, vy, vz);
                break;
            case "scale":
                var idObj = splitTopic[3];
                obj = JSON.parse(msg);
                console.log("Scale");
                console.log("ID : " + idObj);
                console.log("Echelle :" + obj);
                var scaling = obj.scale;
                setScale(parseInt(idObj), scaling);
                break;
            case "color":
                var idObj = splitTopic[3];
                obj = JSON.parse(msg);
                console.log("Color");
                console.log("ID : " + idObj);
                console.log("Color :" + obj.color);
                var couleur = obj.color;
                setColor(parseInt(idObj), couleur);
                break;
            case "select":
                var idObj = splitTopic[3];
                console.log("Select");
                console.log("ID : " + idObj);
                selectObject(parseInt(idObj), lastSelect);
                break;
        }
    }
}
