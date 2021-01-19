import { HEIGHT, WIDTH, FONT_STYLE, relativeWidth, relativeHeight } from '../globalConfig'

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }
  preload() {
    this.load.image('clown', '../../assets/img/clown.png')
    this.load.image('button', '../../assets/img/button.png')
    this.load.image('bullet', '../../assets/img/bullet.png')
    this.load.image('ship', '../../assets/img/ship.png')
    this.load.image('sky', '../../assets/img/bg.jpg')
  }
  create() {
    this.background = this.add.tileSprite(0, 0, WIDTH*2, HEIGHT*2, 'sky')
    this.startButton = this.add.text(relativeWidth(50), relativeHeight(50), 'Start!', FONT_STYLE).setInteractive().setOrigin(0.5)
    this.startButton.on('pointerdown', () => {
      this.scene.start('MainScene')
    })
  }
}
