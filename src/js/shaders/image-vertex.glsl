uniform float time;
uniform float strength;

varying vec2 vUv;
varying vec2 distortion;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main() {
    vUv = uv;

    vec3 newPosition = position;

    // We also need some sort of trigger in this function
    distortion = 0.04 * vec2(sin(time + uv.x * 8.0 + uv.y * 2.0), sin(time + uv.x * 8.0 + uv.y * 2.0)) * strength;
    distortion *= mix(0.9, 1.2, rand(uv));

    newPosition.xy += distortion * 0.5;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}