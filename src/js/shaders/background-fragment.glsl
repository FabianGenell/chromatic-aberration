uniform float time;
uniform vec2 mouse;

varying vec2 vUv;
varying vec2 movement;

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

// mat2 rotation2d(float angle) {
//     float s = sin(angle);
//     float c = cos(angle);

//     return mat2(c, -s, s, c);
// }

void main(void) {
    vec2 uv = vUv;

    // //find distance between mouse and points
    // float distance = distance(uv, mouse);
    // float strength = smoothstep(0.2, 0.0, distance);

    // vec2 movement = vec2(time * 1.1, time * -1.01);
    // movement *= rotation2d(time * 0.01) * 0.09;

    // f += smoothstep(0.0, 0.9, strength);

    float f = fbm(uv + movement);
    f *= 5.0;

    float grain = rand(100.0 * uv);

    float commonTerm = mod((uv.x + uv.y) * 150.0, 7.0 + f);

    float a = smoothstep(5.0 * grain + 1.0, 0.0, commonTerm);

    vec4 color = vec4(a);
    vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

    gl_FragColor = black + color;
}