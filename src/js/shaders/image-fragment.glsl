uniform float time;
uniform sampler2D image;
uniform vec3 hoverState;

varying vec2 vUv;
varying vec2 distortion;

#define HOVERAMOUNT 0.4;

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

    // vec2 distortion = vec2(0.0);

    vec2 rUv = vUv;
    rUv *= 1.0 - hoverState.r * HOVERAMOUNT;
    rUv += hoverState.r / 2.0 * HOVERAMOUNT;

    vec4 redChannel = SampleColor((rUv + distortion * rotation2d(1.0)));
    redChannel.g = 0.0;
    redChannel.b = 0.0;
    redChannel.a = redChannel.r;

    vec2 gUv = vUv;
    gUv *= 1.0 - hoverState.g * HOVERAMOUNT;
    gUv += hoverState.g / 2.0 * HOVERAMOUNT;

    vec4 greenChannel = SampleColor(gUv + distortion * rotation2d(2.0));
    greenChannel.r = 0.0;
    greenChannel.b = 0.0;
    greenChannel.a = greenChannel.g;

    vec2 bUv = vUv;
    bUv *= 1.0 - hoverState.b * HOVERAMOUNT;
    bUv += hoverState.b / 2.0 * HOVERAMOUNT;

    vec4 blueChannel = SampleColor(bUv + distortion * rotation2d(3.0));
    blueChannel.r = 0.0;
    blueChannel.g = 0.0;
    blueChannel.a = blueChannel.b;

    vec4 blackChannel = SampleColor(uv);
    blackChannel.r = 0.0;
    blackChannel.g = 0.0;
    blackChannel.b = 0.0;

    vec4 color = redChannel + greenChannel + blueChannel + blackChannel;

    gl_FragColor = color;
}
