import {
	Mesh,
	PerspectiveCamera,
	Scene,
  ShaderMaterial,
  WebGLRenderer,
  RGBAFormat,
  Color,
  NearestFilter,
} from 'three';

import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

require.context('./images', true, /\.(png|bin|webm)$/)
import './css/main.css';

class App {

	init() {

    this.terrainVS = require('./shaders/terrainVS.glsl');
    this.terrainFS = require('./shaders/terrainFS.glsl');

    this.camera = new PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    this.camera.position.set( 0, 700, 0);
    this.st = 'playing';

		this.scene = new Scene();

		this.renderer = new WebGLRenderer( );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor( new Color('#32383f') )
		document.body.appendChild( this.renderer.domElement );
    const controls = new OrbitControls( this.camera, this.renderer.domElement );
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize( window.innerWidth, window.innerHeight );
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    this.labelRenderer.domElement.style.pointerEvents = 'none';
		document.body.appendChild( this.labelRenderer.domElement );

		window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );
    console.log(this.texture_at);

    window.addEventListener('keypress', (k) => {
      if ( k.key == 's' ) {
        this.st = 'stop';
      }
      else if ( k.key == 'd' ) {
        this.st = 'playing';
      }
      else if ( k.key == 'a' ) {
        this.material.uniforms.u_time.value = 0;
      }
    })

    var uniforms = {
      texture_orto: { type: 't', value: this.texture },
      texture_at: { type: 't', value: this.texture_at },
      //// TODO
      u_time: { type: 'f', value: 0 }
    }
    this.material = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.terrainVS,
      fragmentShader: this.terrainFS,
    });

    const plane = new Mesh(this.geometry, this.material);
    plane.rotation.set( Math.PI / 2, Math.PI, Math.PI );
    plane.name = 'terrain';
    this.scene.add(plane);
    this.render();

	}

  onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.labelRenderer.setSize( window.innerWidth, window.innerHeight );

    this.render();

  }

  render() {

    requestAnimationFrame( this.render.bind( this ) );
    if (this.st == 'playing') {
      this.material.uniforms.u_time.value += 0.0003;
    }
    this.renderer.render( this.scene, this.camera );
    this.labelRenderer.render( this.scene, this.camera );

  }

}

export { App };
