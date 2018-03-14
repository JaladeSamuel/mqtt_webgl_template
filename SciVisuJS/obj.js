function setPosition(id1, valx, valy, valz) {
    //console.log(id);
    var object = sac3DObject.getObjectById(id1);
    object.position.set(valx, valy, valz);
}

function setScale(id2, val) {
    var object = sac3DObject.getObjectById(id2);
    if(object.material.type=="PointsMaterial"){
      object.material.size = val;
    }else{
      console.log(object.geometry);
      object.scale.set(val, val, val);
      console.log(object.geometry);
    }
}

function setColor(id3, val) {
    var object = sac3DObject.getObjectById(id3);
    object.material.color.setHex(val);
}

function deleteElement(id3) {
    var object = sac3DObject.getObjectById(id3);
    object.geometry.dispose();
    sac3DObject.remove(object);
    if(SELECTED != null){
       	    if (sac3DObject.children.length !== 0) {
              menuUpdate(sac3DObject.children[0].id);
        } else {
            menuP.close();
        }
      }
}

function positionScene(axe,number){
  var x = camera.position.x
  var y = camera.position.y
  var z = camera.position.z
  switch(axe){
    case "x":
      camera.position.set(number, y, z);
      break;
    case "y":
      camera.position.set(x, number, z);
      break;
    case "z":
      camera.position.set(x, y, number);
      break;
    default:
      camera.position.set(x, y, z);
      break;
  }
}

function rotateScene(mode){
  if(mode=="on"){
    animation="on";
  }else if(mode=="off"){
    animation="off;"
  }
}

function AjoutObjectGeometry(valEnvoi) {
    geometry = TrouverGeometrieCorres(valEnvoi);
    if (valEnvoi == 'PointGeometry') {
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        var material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 100
        });
        mesh = new THREE.Points(geometry, material);
        sac3DObject.add(mesh);
    }else if(valEnvoi == 'LineGeometry'){
        geometry.vertices.push(
            new THREE.Vector3( -50, 0, 0 ),
            new THREE.Vector3( 50, 0, 0 )
        );
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        mesh = new THREE.Line( geometry, material );
        sac3DObject.add(mesh);
    } else {
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            wireframe: false
        });
        mesh = new THREE.Mesh(geometry, material);
        sac3DObject.add(mesh);
        console.log(sac3DObject);
        
    }
    return mesh.id;
}

function TrouverGeometrieCorres(vEnvoi) {
    var tabGeometries = [{
            type: 'BoxGeometry',
            geometry: new THREE.BoxGeometry(200, 200, 200, 2, 2, 2)
        },
        {
            type: 'SphereGeometry',
            geometry: new THREE.SphereGeometry(200, 12, 12)
        },
        {
            type: 'PlaneGeometry',
            geometry: new THREE.PlaneGeometry(200, 200, 200)
        },
        {
            type: 'PointGeometry',
            geometry: new THREE.Geometry()
        },
        {
            type: 'LineGeometry',
            geometry: new THREE.Geometry()
        }
    ];
    var vgeometry = tabGeometries[0].geometry;
    for (var i = 0; i < tabGeometries.length; i++) {
        if (tabGeometries[i].type == vEnvoi) {
            vgeometry = tabGeometries[i].geometry;
        }
    }
    return vgeometry;
}


//MENU
function retablirMenu(id0,valSc, valx, valy, valz) {
    options.ids = id0;
    options.scale = valSc;
    options.x = valx;
    options.y = valy;
    options.z = valz;
}

function resetMenu(idObjectSelection) {
    options.ids = idObjectSelection;
    options.scale = 1;
    options.x = 0;
    options.y = 0;
    options.z = 0;
}

function resetElement(idObject) {
	console.log(idObject);
    options.scale = 1;
    options.x = 0;
    options.y = 0;
    options.z = 0;
    setScale(idObject, options.scale)
    setPosition(idObject, options.x, options.y, options.z)
    setColor(idObject, 0xffffff);
}

function selectObject(id) {
    console.log(id);
    var object = sac3DObject.getObjectById(id);
    var couleur = object.material.colors
    if (SELECTED !== object) {
        if (SELECTED) SELECTED.material.color.set(couleur);//couleur apres selection
        SELECTED = object;
        
        SELECTED.material.color.set(0x16BBDC);
    }
    idObjectSelection = id;
    options.ids = idObjectSelection;
    menuOnSelectGeometry(idObjectSelection);
}

//Ouvre un menu base sur l'objet selectionné
var sc, x, y, z, detruire,rst, idm;

function menuOnSelectGeometry(idObjectSelection) {

    if (menuP.__controllers.length == 0) {
        idm = menuP.add(options, 'ids').listen()
        sc = menuP.add(options, 'scale').min(0.1).max(4).listen()
        x = menuP.add(options, 'x').min(-900).max(900).listen()
        y = menuP.add(options, 'y').min(-900).max(900).listen()
        z = menuP.add(options, 'z').min(-900).max(900).listen()
        rst = menuP.add(options, 'reset').name("Reset Element").listen()
        detruire = menuP.add(options, 'detruire').name("detruire").listen()
        menuP.open();
        menuUpdate(idObjectSelection);
    } else {
        menuUpdate(idObjectSelection);
    }
}




function menuUpdate(idObjectSelection) {
    var object = sac3DObject.getObjectById(idObjectSelection);
    idm.onChange(function(value) {
        options.ids = idObjectSelection
    });
    sc.onChange(function(value) {
        console.log(idObjectSelection);
        setScale(idObjectSelection, options.scale);
    });
    x.onChange(function(value) {
        setPosition(idObjectSelection, options.x, options.y, options.z);
    });
    y.onChange(function(value) {
        setPosition(idObjectSelection, options.x, options.y, options.z);
    });
    z.onChange(function(value) {
        setPosition(idObjectSelection, options.x, options.y, options.z);
    });
    rst.onChange(function(value) {
            resetElement(idObjectSelection);
        });
    detruire.onChange(function(value) {
        deleteElement(idObjectSelection);
    });
    if ((object.position.x !== 0) || (object.position.y !== 0) || (object.position.z !== 0) || (object.scale.x !== 1)) {
        retablirMenu(idObjectSelection,object.scale.x, object.position.x, object.position.y, object.position.z);
        menuP.open();
    } else {
        resetMenu(idObjectSelection);
        menuP.open();
    }

}

