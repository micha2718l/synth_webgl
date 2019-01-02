

<script type="x-shader/x-fragment" id="fragmentShader">

void main() {
    gl_FragColor = vec4(1.0, sin(gl_FragCoord.x), sin(gl_FragCoord.y), 0.0);
}
</script>


<script type="x-shader/x-fragment" id="fragmentShader2">
uniform float delta;
varying float vOpacity;
varying vec3 vUv;
uniform float mX;
uniform float mY;
uniform float xMax;
uniform float yMax;
uniform float dragX;
uniform float dragY;
uniform float scale;
uniform float theta_degree;

void main() {
    float theta = radians(theta_degree);
    float pi = 3.14159;
    //float d = sqrt(pow(vUv.x / 1000.0 - mX, 2.0) + pow(vUv.y / 1000.0 - mY, 2.0));
    //float d = distance(vec2(gl_FragCoord.x, gl_FragCoord.y), vec2(mX, mY));

    //float scale = 4.0;
    vec2 offset = vec2(0.5,0.5);
    vec2 z = scale * (vec2(gl_FragCoord.x / xMax, gl_FragCoord.y / yMax) - offset);
    z = vec2(-z.y * sin(theta) + z.x * cos(theta), z.x * sin(theta) + z.y * cos(theta));
    z = vec2(z.x + scale * (dragX / xMax), z.y + scale * (dragY / yMax));
    vec2 m = scale * (vec2(mX / xMax, mY / yMax) - offset);
    float d = distance(z,m);

    z = z;// - vec2(dragX / xMax, -dragY / yMax);
    vec2 c = z * pow(2.0, 0.1 + sin(delta/10.0));
    for (int i=0;i<300;i++) {
        z = vec2(z.x * z.x - z.y * z.y, z.y * z.x + z.x * z.y) + c;
    }
    //z = vec2(z.x + delta, z.y + delta);
    float r = 2.0 * (sin(z.x) + 0.5);
    float g = 2.0 * (sin(z.y) + 0.5);
    float b = 2.0 * ((sin(z.x) + sin(z.y))/2.0 + 0.5);
    vec3 rgb = vec3(r, g, b);
    //vec3 rgb = vec3(gl_PointCoord.x, gl_PointCoord.x, 0.0);
    gl_FragColor = vec4(rgb, 1.0);
	//gl_FragColor = vec4(rgb, vOpacity);
}
</script>
<script type="x-shader/x-fragment" id="fragmentShader3">
    uniform float delta;
    varying float vOpacity;
    varying vec3 vUv;
    
    void main() {
    
        float r = 1.0 + cos(vUv.x * delta);
        float g = 0.5 + sin(delta) * 0.5;
        float b = 0.0;
        vec3 rgb = vec3(r, g, b);
    
        gl_FragColor = vec4(rgb, vOpacity);
    }
</script>
