import {
  TextureLoader, 
  PlaneGeometry,
  NearestFilter,
  DataTexture,
  RedFormat,
  UnsignedIntType,
  FloatType,
  FileLoader,
} from 'three';

import TerrainLoader from './terrain.js';
import { App } from './app.js';
require.context('./images', true, /\.(png|bin)$/);
import asc from './images/at.asc';

class AssetsLoader {

  constructor () {
    this.app = new App();
  }

  init () {
    const loader = new TextureLoader();
    let promises = []

    promises.push( new Promise( resolve => {
      loader.load( '/images/orto.png', ( t ) => {
        this.app.texture = t;

        resolve( );
      });
    }));

    const fl = new FileLoader();

    const terrainLoader = new TerrainLoader();

    promises.push( new Promise( resolve => {
      fl.load( asc, ( data )=> {
        const d = this.loadASC(data);
        console.log( d );
        this.app.texture_at = new DataTexture( d, 1445, 1144, RedFormat, FloatType );
        this.app.texture_at.needsUpdate = true;
        this.app.texture_at.flipY = true;

        resolve();
      });
    }));

    promises.push( new Promise( resolve => {
      terrainLoader.load( '/images/mdt.bin', ( data )=> {
        this.app.geometry = new PlaneGeometry( 680, 384, 289 - 1, 227 - 1);

        for ( let i = 0; i < 289 * 227; i++ ) {
          this.app.geometry.attributes.position.array[ i * 3 + 2 ] = data[ i ] * 1.2 / ( 6 * 1000 / 680 );
        }

        resolve( );
      });
    }));


    Promise.all( promises ).then( () => {
      this.app.init();
      document.querySelector('#spinner').style.display = 'none';
    });

  }

  loadASC ( data ) {
    const d = data.split( /\r\n|\n/ );
    d.splice( 0, 6 );
    const e = d.map( elem => {
      return elem.substring( 1 );
    });
    const f = e.join( ' ' ).split( ' ' );
    f.pop();
    return new Float32Array( f );
  }


}



export { AssetsLoader }
