var main = function(){
    var renderer,
        scene,
        camera,
        myCanvas = document.getElementById('myCanvas');

    //RENDERER
    renderer = new THREE.WebGLRenderer({
        canvas: myCanvas, 
        antialias: true
    });
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);




    //CAMERA
    camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000 );

    //SCENE
    scene = new THREE.Scene();

    //LIGHTS
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light2);


    //Custom Shader Material

    var materialPlain = new THREE.ShaderMaterial({
        uniforms: [],
        vertexShader: document.getElementById('vertexShader').textContent,
        fragmentShader: document.getElementById('fragmentShader').textContent
    });



    var customUniforms = {
        delta: {value: 0},
        mX: {value: 0},
        mY: {value: 0},
        yMax: {value: 1.0},
        xMax: {value: 1.0},
        dragX: {value: 1.0},
        dragY: {value: 1.0},
        scale: {value: 1.0},
        theta_degree: {value: 0.0}
    };
    var material = new THREE.ShaderMaterial({
        uniforms: customUniforms,
        vertexShader: document.getElementById('vertexShader2').textContent,
        fragmentShader: document.getElementById('fragmentShader2').textContent
    });



    var geometry = new THREE.BoxBufferGeometry(100, 100, 100, 5, 5, 5);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.z = -1000;
    mesh.position.x = -100;
    //scene.add(mesh);


    var geometry2 = new THREE.SphereGeometry(50, 20, 20);
    var mesh2 = new THREE.Mesh(geometry2, materialPlain);
    mesh2.position.z = -1000;
    mesh2.position.x = 100;
    //scene.add(mesh2);


    var geometry3 = new THREE.PlaneGeometry(1000, 1000, 100, 100);
    var mesh3 = new THREE.Mesh(geometry3, material);
    //mesh3.rotation.x = -90 * Math.PI / 180;
    //mesh3.position.y = -100;
    mesh3.position.x = 0;
    mesh3.position.y = 0;
    mesh3.position.z = -1000;

    mesh3.rotation.x = 0;
    mesh3.rotation.y = 0;
    mesh3.rotation.z = 0;


    scene.add(mesh3);


    //attribute
    var vertexDisplacement = new Float32Array(geometry.attributes.position.count);
    console.log(geometry.attributes.position.count);
    for (var i = 0; i < vertexDisplacement.length; i ++) {
        vertexDisplacement[i] = Math.sin(i);
    }

    geometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));

    console.log('*');
    //RENDER LOOP
    render();


    var delta = 0;
    var mX = 0;
    var mY = 0;
    var dragX = 0.0;
    var dragY = 0.0;


    var mc = new Hammer(myCanvas);
    var xMax = myCanvas.width;
    var yMax = myCanvas.height;
    //var dMaxO = yMax/10.0;
    //var dMax = dMaxO;
    var scale = 2.0;
    var pinch = new Hammer.Pinch();
    var rotate = new Hammer.Rotate();

    // we want to detect both the same time
    pinch.recognizeWith(rotate);

    // add to the Manager
    mc.add([pinch, rotate]);
    mc.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    var unPressed = true;
    var dragXCurrent = 0.0;
    var dragYCurrent = 0.0;

    mc.on("panend", function (ev){
        dragXCurrent = dragX;
        dragYCurrent = dragY;
        //console.log(dragXCurrent);
    });

    mc.on("tap press panleft panright panup pandown", function(ev){
        mX = 2.0 * (ev.center.x);
        mY = yMax + 2.0 * (-ev.center.y);
        dragX = dragXCurrent - 2.0 * ev.deltaX;
        dragY = dragYCurrent + 2.0 * ev.deltaY;
        console.log(ev.deltaX);
    });

    var theta_degree = 0.0;
    var theta_degreeCurrent = 0.0;
    var theta_start = 0.0;

    mc.on("rotatestart", function(ev){
        theta_start = ev.rotation;
    });
    mc.on("rotate", function(ev){
        theta_degree = theta_degreeCurrent + (ev.rotation - theta_start);
        $("#status").text(theta_degree);
    });

    mc.on("rotateend", function(ev){
        theta_degreeCurrent = theta_degree;
        //$("#status").text(ev.rotation);
    });

    var scaleCurrent = scale;
    mc.on("pinch", function(ev){
        scale = scaleCurrent * (2.0 - ev.scale);//Math.cos(ev.scale - 1.0) * Math.sign(ev.scale);
        //console.log(ev.scale);
        //console.log(1.0 - (ev.scale - 1.0));
    });

    mc.on("pinchend", function(ev){
        scaleCurrent = scale;
    });

    var time0 = Date.now();
    var time1 = time0;
    function render() {
        time1 = Date.now()
        $("#fps").text("FPS:" + Math.round(1000.0 / (time1 - time0)));
        time0 = time1;
        delta += 0.1;

        //mX = delta;
        //uniform
        mesh.material.uniforms.delta.value = delta;//0.5 + Math.sin(delta) * 0.5;
        mesh.material.uniforms.mX.value = mX;
        mesh.material.uniforms.mY.value = mY;
        mesh.material.uniforms.xMax.value = xMax;
        mesh.material.uniforms.yMax.value = yMax;
        mesh.material.uniforms.dragX.value = dragX;
        mesh.material.uniforms.dragY.value = dragY;
        mesh.material.uniforms.scale.value = scale;
        mesh.material.uniforms.theta_degree.value = theta_degree;
        

        mesh2.position.x = mX/2.0;
        mesh2.position.y = mY/2.0;
        mesh2.position.z = -1000 + mX*10.0;

        //attribute
        for (var i = 0; i < vertexDisplacement.length; i ++) {
            vertexDisplacement[i] = 0.5 + Math.cos(delta)*Math.sin(i + delta) * 0.25;
        }
        mesh.geometry.attributes.vertexDisplacement.needsUpdate = true;

        //camera.position.z = delta;
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
};

$('#vert_div').load('shade.vert', function() {
    $('#frag_div').load('shade.frag', function() {
        main();
    });
});
