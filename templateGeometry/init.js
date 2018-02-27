var renderer, scene, camera, mesh;
var sac3DObject; // contient tous les objects 3d de la scene
var lastSelect;
var options;
var SELECTED;
var idObjectSelection = 0;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

init();
animate();

function init() {
    //render
    renderer = new THREE.WebGLRenderer(); //moteur de rendu
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);
    //scene
    scene = new THREE.Scene(); //scene
    scene.background = new THREE.Color(0x000000);
    //camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1000);
    scene.add(camera);
    //creation du sac
    sac3DObject = new THREE.Group();
    scene.add(sac3DObject);

    //Creation d'un objet à ajouter dans le sac

    ////////////////
    //menu de base//
    ////////////////
    gui = new dat.GUI({
        width: 350
    });
    menuP = gui.addFolder('Parametre de l element');
    options = {
        element: 0,
        ids: idObjectSelection,
        scale: 0.1,
        x: 0,
        y: 0,
        z: 0,
        color: "#ff0000",
        reset: function() {},
        detruire: function() {}
    };
    //action de la souris
    window.addEventListener('mousedown', onMouseDown, false);
    //premier rendu
    render();
}

function render() {
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate); //fonction recuresive a chaque frame
    if (mesh == undefined) { //si aucun mesh alors on fait rien
        render();
    } else {
        var i = 0;
        var nbChildren = sac3DObject.children.length;
        for (i = 0; i < nbChildren; i++) {
            sac3DObject.children[i].rotation.x += 0.01; //tourne le dernier mesh crée
            sac3DObject.children[i].rotation.y += 0.02;
        }
        render();
    }
}

function onMouseDown(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera) //position du raycaster avec la camera et la position de la souris
    var intersects = raycaster.intersectObjects(sac3DObject.children);
    if (intersects.length > 0) {
        var intersect = intersects[0];
        var id = intersect.object.id;
        var idSac = 0;
        for (var i = 0; i < sac3DObject.children.length; i++) {
            if (sac3DObject.children[i].id == id) {
                idSac = i;
            }
        }
        selectObject(idSac);
    }

}
