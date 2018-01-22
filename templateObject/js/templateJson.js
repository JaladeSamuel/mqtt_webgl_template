			var container, stats, clock, mixer;
			var camera, scene, renderer, objects;

			container = document.getElementById( 'container' );

			camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
			camera.position.set( 4, 4, 4 );

			clock = new THREE.Clock();
			scene = new THREE.Scene();
			mixer = new THREE.AnimationMixer( scene );

			var loader = new THREE.JSONLoader();
			loader.load( 'jsonObject/monster.js', function ( geometry, materials ) {

				var material = materials[ 0 ];
				material.morphTargets = true;
				var mesh = new THREE.Mesh( geometry, materials );
				mesh.scale.set( 0.001, 0.001, 0.001 );
				mesh.matrixAutoUpdate = false;
				mesh.updateMatrix();
				scene.add( mesh );
				mixer.clipAction( geometry.animations[ 0 ], mesh )
								.setDuration( 1 )			// one second
								.startAt( - Math.random() )	// random phase (already running)
								.play();					// let's go
			} );

			var ambientLight = new THREE.AmbientLight( 0xffffff );
			scene.add( ambientLight );

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );

			window.addEventListener( 'resize', onWindowResize, false );
			animate();

			function onWindowResize( event ) {

				renderer.setSize( window.innerWidth, window.innerHeight );

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

			}

			function animate() {
				requestAnimationFrame( animate );
				var timer = Date.now() * 0.0005;
				mixer.update( clock.getDelta() );
				camera.lookAt( scene.position );
				renderer.render( scene, camera );
				stats.update();

			}
