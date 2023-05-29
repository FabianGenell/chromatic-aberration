uniform float time;
uniform sampler2D image;

varying vec2 vUv;
varying vec2 distortion;

mat2 rotation2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);

    return mat2(c, -s, s, c);
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
    vec2 uv = vUv;

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
