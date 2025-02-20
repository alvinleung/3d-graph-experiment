precision highp float;

attribute vec3 position;
attribute vec3 next;
attribute vec3 prev;
attribute vec2 uv;
attribute float side;

uniform vec2 uResolution;
uniform float uDPR;
uniform float uThickness;

vec4 getPosition() {
    vec4 current = vec4(position, 1);

    vec2 aspect = vec2(uResolution.x / uResolution.y, 1);
    vec2 nextScreen = next.xy * aspect;
    vec2 prevScreen = prev.xy * aspect;

    // Calculate the tangent direction
    vec2 tangent = normalize(nextScreen - prevScreen);

    // Rotate 90 degrees to get the normal
    vec2 normal = vec2(-tangent.y, tangent.x);
    normal /= aspect;

    // Taper the line to be fatter in the middle, and skinny at the ends using the uv.y
    normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));

    // When the points are on top of each other, shrink the line to avoid artifacts.
    float dist = length(nextScreen - prevScreen);
    normal *= smoothstep(0.0, 0.02, dist);

    float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
    float pixelWidth = current.w * pixelWidthRatio;
    normal *= pixelWidth * uThickness;
    current.xy -= normal * side;

    return current;
}

void main() {
    gl_Position = getPosition();
}
