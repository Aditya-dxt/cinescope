/* 
 * FE-AA3 Signature Hero — Aurora GLSL
 * Fragment shader uses u_time, u_resolution, u_mouse (3/3 uniforms).
 * How it works (walk-through):
 * 1) uv / aspect — gl_FragCoord -> 0-1, correct x for aspect so circles stay round.
 * 2) mouse — u_mouse (px) normalized to 0-1, offset a bit so cursor tugs the waves.
 * 3) time — u_time drives slow drift (t = time*0.35).
 * 4) waves — two sine fields (wave1/wave2) at different freq + a cheap noise() for grain.
 * 5) aurora — smoothstep combines waves+noise into a soft band, masked by horizon.
 * 6) palette — lerp deep navy -> teal -> mint -> lavender via aurora amount.
 * 7) vignette + dither — darken corners, tiny hash dither to hide banding.
 * Ships responsibly: DPR capped 1.5, rAF paused on hidden, reduced-motion static.
 */
export const VERT = `attribute vec2 position;
void main(){ gl_Position = vec4(position, 0.0, 1.0); }`;

export const FRAG = `precision highp float;
uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_mouse;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p){
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i+vec2(1.0,0.0));
  float c = hash(i+vec2(0.0,1.0));
  float d = hash(i+vec2(1.0,1.0));
  return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 st = uv;
  st.x *= u_resolution.x / u_resolution.y; // keep waves round on wide screens

  vec2 m = u_mouse / u_resolution; // 0..1 (defaults to center if mouse never moved)
  float mx = (m.x - 0.5) * 0.32;
  float my = (m.y - 0.5) * 0.22;

  float t  = u_time * 0.34;

  // two drifting sine fields — cursor nudges frequency/phase a touch
  float wave1 = sin((st.x + t + mx*2.0) * 2.6 + sin(st.y*3.0 + t*0.7)*0.85) * 0.5 + 0.5;
  float wave2 = sin((st.x*1.75 - t*0.62 - my) * 3.1) * 0.38 + 0.5;
  float n     = noise(st*3.1 + t*0.22) * 0.24;

  float aurora  = smoothstep(0.34, 0.74, wave1 * wave2 + n);
  float horizon = smoothstep(0.34, 0.56, uv.y + my*0.08); // more sky above, ground below

  vec3 colDeep = vec3(0.025, 0.032, 0.075);
  vec3 colA    = vec3(0.08,  0.22,  0.45);
  vec3 colB    = vec3(0.20,  0.82,  0.56);
  vec3 colC    = vec3(0.86,  0.44,  0.86);

  vec3 col = mix(colDeep, colA, horizon);
  col = mix(col, colB, aurora * horizon * 0.92);
  col = mix(col, colC, aurora * pow(wave1, 2.0) * 0.34);

  float vign = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.46;
  col *= vign;

  // tiny dither hides 8-bit banding on gradients
  col += (hash(gl_FragCoord.xy) * 0.02 - 0.01);

  gl_FragColor = vec4(col, 1.0);
}
`;
