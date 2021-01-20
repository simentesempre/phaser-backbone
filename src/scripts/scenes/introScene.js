import { HEIGHT, WIDTH, relativeWidth, relativeHeight } from '../config/global'

import { FONT_STYLE, ASSETS } from '../config/game'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }
  preload() {
    this.load.image('button', '../../assets/img/button.png')
    this.load.image('bullet', '../../assets/img/bullet.png')
    this.load.image('ship', '../../assets/img/ship.png')
    this.load.image('sky', '../../assets/img/bg.jpg')
  }
  create() {
    this.background = this.add.tileSprite(relativeWidth(50), relativeHeight(50), WIDTH, HEIGHT, 'sky')
    this.startButton = this.add
      .text(relativeWidth(50), relativeHeight(50), '> START <', FONT_STYLE)
      .setInteractive()
      .setOrigin(0.5)
    this.startButton.on('pointerdown', () => {
      this.scene.start('MainScene')
    })
  }
}
