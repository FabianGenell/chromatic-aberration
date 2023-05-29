#ifdef GL_ES
precision highp float;
#endif

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 mouse;
uniform vec3 spectrum;
uniform float strength;
uniform sampler2D image;

varying vec3 v_normal;
varying vec2 v_texcoord;

mat2 rotation2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
}

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

vec4 SampleColor(vec2 uv) {

    vec4 color = texture2D(image, uv);

    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        color = vec4(0.0);
    }

    return color;
}

void main(void) {
    //cropping the picture
    vec2 uv = (gl_FragCoord.xy - 100.0) / (u_resolution.xy - 200.0);

    vec2 distortion = 0.04 * strength * vec2(sin(u_time + uv.x * 8.0 + uv.y * 2.0), sin(u_time + uv.x * 8.0 + uv.y * 2.0));

    distortion *= mix(0.9, 1.2, rand(uv));

    vec4 redChannel = SampleColor(uv + distortion * rotation2d(1.0));
    redChannel.g = 0.0;
    redChannel.b = 0.0;
    redChannel.a = redChannel.r;

    vec4 greenChannel = SampleColor(uv + distortion * rotation2d(2.0));
    greenChannel.r = 0.0;
    greenChannel.b = 0.0;
    greenChannel.a = greenChannel.g;

    vec4 blueChannel = SampleColor(uv + distortion * rotation2d(3.0));
    blueChannel.r = 0.0;
    blueChannel.g = 0.0;
    blueChannel.a = blueChannel.b;

    vec4 blackChannel = SampleColor(uv + distortion * rotation2d(4.5));
    blackChannel.r = 0.0;
    blackChannel.g = 0.0;
    blackChannel.b = 0.0;

    vec4 color = redChannel + greenChannel + blueChannel + blackChannel;

    gl_FragColor = color;
}