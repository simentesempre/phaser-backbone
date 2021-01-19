import 'phaser'
import '@babel/polyfill'

import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

import { WIDTH, HEIGHT } from './globalConfig'

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT
  },
  scene: [PreloadScene, MainScene],
  input: {
    activePointers: 3
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      /* gravity: { y: 400 } */
    }
  },
  plugins: {
    global: [{
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true
    }]
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
