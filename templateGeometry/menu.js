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

function resetElement(idObjectSelection) {
    options.scale = 1;
    options.x = 0;
    options.y = 0;
    options.z = 0;
    setScale(idObjectSelection, options.scale)
    setPosition(idObjectSelection, options.x, options.y, options.z)
    setColor(idObjectSelection, 0xffff00);
}

function selectObject(id) {
    console.log(id);
    var object = sac3DObject.getObjectById(id);

    if (SELECTED !== object) {
        if (SELECTED) SELECTED.material.color.set(0xff0000);
        SELECTED = object;
        idObjectSelection = id;
        options.ids = idObjectSelection;
        SELECTED.material.color.set(0xffffff);
    }

    menuOnSelectGeometry(idObjectSelection);
}

//Ouvre un menu base sur l'objet selectionné
var sc, x, y, z, detruire,rst, idm;

function menuOnSelectGeometry(idObjectSelection) {

    if (menuP.__controllers.length == 0) {
        idm = menuP.add(options, 'ids').listen().onChange(function(value) {
            options.ids = idObjectSelection
        });
        sc = menuP.add(options, 'scale').min(0.1).max(4).listen().onChange(function(value) {
            console.log(idObjectSelection);
            setScale(idObjectSelection, options.scale);
        });
        x = menuP.add(options, 'x').min(-900).max(900).listen().onChange(function(value) {
            setPosition(idObjectSelection, options.x, options.y, options.z);
        });
        y = menuP.add(options, 'y').min(-900).max(900).listen().onChange(function(value) {
            setPosition(idObjectSelection, options.x, options.y, options.z);
        });
        z = menuP.add(options, 'z').min(-900).max(900).listen().onChange(function(value) {
            setPosition(idObjectSelection, options.x, options.y, options.z);
        });
        rst = menuP.add(options, 'reset').name("Reset Element").listen().onChange(function(value) {
            resetElement(idObjectSelection);
        });
        detruire = menuP.add(options, 'detruire').name("detruire").listen().onChange(function(value) {
            deleteElement(idObjectSelection);
        });
        menuP.open();
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
