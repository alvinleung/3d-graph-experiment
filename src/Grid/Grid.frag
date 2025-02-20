precision highp float;

uniform sampler2D uTexture;
uniform float uOffset;
varying vec2 vUv;

void main() {
    vec2 uv = vUv;
    vec4 color = texture2D(uTexture, fract((uv + vec2(0, uOffset / 2.0)) * 15.0));

    // Fade effect along Y-axis
    float fadeY = smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

    // Fade effect along X-axis
    float fadeX = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x);

    // Combine fades for both axes
    float fade = fadeX * fadeY;
    color.a *= fade;

    // Make high green channel values transparent
    if (color.g >= 0.9) {
        color.a = 0.0;
    }

    gl_FragColor = color;
}

