varying vec2 vUv;
varying vec3 v_position;
uniform vec3 color1;
uniform vec3 color2;
uniform sampler2D uTexture;

void main(void) {
    vec2 st = v_position.xy;

    float koef = clamp(v_position.z / 60., 0., 1.);

    vec3 color3 = mix(color1, color2, koef);

    vec2 grid = abs(fract(st / 2. - 0.5) - 0.5) / fwidth(st / 2.);
    float color = min(grid.x, grid.y);

    // gl_FragColor = vec4(koef, 1., 1., 1. - color);
    gl_FragColor = vec4(color3, 1. - color);
    // gl_FragColor = texture2D(uTexture, vUv);
}