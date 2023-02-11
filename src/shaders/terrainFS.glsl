precision highp float;

uniform sampler2D texture_orto;
uniform sampler2D texture_at;
uniform float u_time;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {

  vec4 tColor = texture2D( texture_orto, vUv );
  vec4 fuego = texture2D( texture_at, vUv );
  float alpha = step(-1., fuego.r);
  vec3 fColorA = vec3(0., 1., 0.);
  vec3 fColorB = vec3(1., 0., 0.);
  float fTime = smoothstep( 0., 0.01,  u_time - fuego.r / 660. );
  float fBool = step(0., u_time - fuego.r / 660.) * alpha;

  vec3 pct = vec3(0., 0., 0.);
  pct.x = smoothstep(1., 0., pow(fTime, 5.));
  pct.y = cos(fTime * 3.1415 * 2.1) / 2. + 0.5;
  
  vec3 color = mix(fColorA, fColorB, pct);

  vec3 final = mix(tColor.rgb, color, fBool * 0.6);

  gl_FragColor = vec4( final,  1.0 );
//  gl_FragColor = vec4( mix( tColor.rgb, vec3( 0., 0., 0. ), sombreado * 0.7 ), 1.0 );

}
