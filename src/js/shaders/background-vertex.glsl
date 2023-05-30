#define NUM_OCTAVES 5

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
}

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for(int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

mat2 rotation2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
}

uniform float time;
uniform vec2 mouse;

varying vec2 vUv;
varying vec2 movement;

void main() {
    vUv = uv;

        //find distance between mouse and points
    float distance = distance(uv, mouse);
    float strength = smoothstep(0.2, 0.0, distance);

    movement = vec2(time * 0.001, time * -0.001);
    //movement *= rotation2d(time * 0.01) * 0.09;

    // f += smoothstep(0.0, 0.9, strength);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}