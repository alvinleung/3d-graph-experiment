precision highp float;

uniform vec3 uColor;

varying vec2 vUv;
varying float vHeight;
varying float vDistFromOrigin;

void main() {
    // gl_FragColor.rgb = uColor
    vec3 colorHigh = vec3(.3245, .5321, .1434);
    vec3 colorLow = vec3(1.0, 0.1, 0.1);
    float pct = vHeight;

    gl_FragColor.rgb = mix(colorLow, colorHigh, pct);

    gl_FragColor.rgb = mix(
            gl_FragColor.rgb,
            vec3(0.98, 0.9, 0.7),
            clamp(2.0 + vDistFromOrigin * 3.0, 0.0, 1.0)
        );

    // the fading off effect, calc from the dist from origin of line
    gl_FragColor.rgb = mix(
            gl_FragColor.rgb,
            vec3(1.0, 1.0, 1.0),
            clamp(vDistFromOrigin * 2.0, 0.0, 1.0)
        );
    // gl_FragColor.rgb = vec3(pct);
    gl_FragColor.a = vDistFromOrigin;
}
