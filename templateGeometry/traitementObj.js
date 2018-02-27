function setPosition(id1, valx, valy, valz) {
    //console.log(id);
    var object = sac3DObject.getObjectById(sac3DObject.children[id1].id);
    console.log(object);
    object.position.set(valx, valy, valz);
}

function setScale(id2, val) {
    var object = sac3DObject.getObjectById(sac3DObject.children[id2].id);
    object.scale.set(val, val, val);
}

function setColor(id3, val) {
    var object = sac3DObject.getObjectById(sac3DObject.children[id3].id);
    object.material.color.setHex(val.replace("#", "0x"));
}

function deleteElement(id3) {
    var object = sac3DObject.getObjectById(sac3DObject.children[id3].id);
    object.geometry.dispose();
    sac3DObject.remove(object);
    console.log(sac3DObject.children.length);
    if ((id3 == 0) && (sac3DObject.children.length !== 0)) {
        menuUpdate(id3);
    } else if (id3 > 0) {
        menuUpdate(id3 - 1);
    } else {
        menuP.close();
    }
}
