#ifdef GL_ES
precision highp float;
#endif
uniform sampler2D video;
uniform sampler2D ghost;
uniform sampler2D webcam;
uniform sampler2D underlay;
uniform int videoNr;
uniform int ghostNr;
uniform int ghostVisible;
uniform int webcamVisible;
varying vec2 vUv;

void main(void) 
{
  if(webcamVisible == 1) {

    vec4 colourblend = texture2D(webcam, vec2(vUv.x, vUv.y));
    vec4 scaledColor = colourblend * vec4(0.3, 0.59, 0.11, 1.0);
    float luminance = scaledColor.r + scaledColor.g + scaledColor.b;
    vec4 blend = vec4(vec3(luminance, luminance, luminance), colourblend.a);

    vec4 base = texture2D(underlay, vUv);
    vec4 screen = (1.0 - ((1.0 - base) * (1.0 - blend)));
    // vec4 overlay = (length(base) < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));

    vec4 mask = texture2D(video, vec2(2.0 / 3.0 + vUv.x / 3.0, vUv.y));
    
    gl_FragColor = 1.0 - mask * (1.0 - screen);
    
  } else {

    if(ghostVisible == 0) {

      float offset = 1.0 * float(videoNr) / 3.0;
      vec4 blend = texture2D(video, vec2(offset + vUv.x / 3.0, vUv.y));
      vec4 base = texture2D(underlay, vUv);
      vec4 screen = (1.0 - ((1.0 - base) * (1.0 - blend)));
      // vec4 overlay = (length(base) < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));

      vec4 mask = texture2D(video, vec2(2.0 / 3.0 + vUv.x / 3.0, vUv.y));

      gl_FragColor = 1.0 - mask * (1.0 - screen);

    } else {

      float offset = 1.0 * float(ghostNr) / 3.0;
      vec4 blend = texture2D(ghost, vec2(offset + vUv.x / 3.0, vUv.y));
      vec4 base = texture2D(underlay, vUv);
      vec4 screen = (1.0 - ((1.0 - base) * (1.0 - blend)));
      // vec4 overlay = (length(base) < 0.5 ? (2.0 * base * blend) : (1.0 - 2.0 * (1.0 - base) * (1.0 - blend)));

      vec4 mask = texture2D(video, vec2(2.0 / 3.0 + vUv.x / 3.0, vUv.y));

      gl_FragColor = 1.0 - mask * (1.0 - screen);
      // gl_FragColor = blend;
    }
  }

}
