function AjoutObjectGeometry(valEnvoi) {
    geometry = TrouverGeometrieCorres(valEnvoi);
    if (valEnvoi == 'PointGeometry') {
        geometry.vertices.push(new THREE.Vector3(0, 0, 0));
        var material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 5
        });
        mesh = new THREE.Points(geometry, material);
        sac3DObject.add(mesh);
    }else if(valEnvoi == 'LineGeometry'){
        geometry.vertices.push(
            new THREE.Vector3( -500, 0, 0 ),
            new THREE.Vector3( 500, 0, 0 )
        );
        var material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        mesh = new THREE.Line( geometry, material );
        sac3DObject.add(mesh);
    } else {
        var material = new THREE.MeshBasicMaterial({
            color: 0xffffFF,
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
            geometry: new THREE.SphereGeometry(100, 12, 12)
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
