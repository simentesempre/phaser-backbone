import 'phaser'
import '@babel/polyfill'

import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin'

import MainScene from './scenes/mainScene'
import IntroScene from './scenes/introScene'

import { DEBUG, WIDTH, HEIGHT } from './config/global'

export let game = {}

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: WIDTH,
    height: HEIGHT,
  },
  scene: [IntroScene, MainScene],
  input: {
    activePointers: 3,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: DEBUG,
    },
  },
  plugins: {
    global: [
      {
        key: 'rexVirtualJoystick',
        plugin: VirtualJoystickPlugin,
        start: true,
      },
    ],
  },
}

window.addEventListener('load', () => {
  game = new Phaser.Game(config)
})
