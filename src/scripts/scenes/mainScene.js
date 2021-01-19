import { WIDTH, HEIGHT, SPEED_ADJUSTER, BG_SPEED, FONT_STYLE, relativeWidth, relativeHeight, randomIntBetween } from '../globalConfig'

export default class MainScene extends Phaser.Scene {
  
  constructor() {
    super({ key: 'MainScene' })
    this.movePlayer = 'stand'
    this.shoot = false
    this.bulletTime = 0
    this.score = 0
    this.scoreText
    this.bulletIntervals = []
  }

  create() {
    this.background = this.add.tileSprite(0, 0, WIDTH*2, HEIGHT*2, 'sky')
    this.joyStick = this.plugins.get('rexVirtualJoystick').add(this, {
        x: relativeWidth(28), 
        y: relativeHeight(82),
        radius: 60
        // dir: '8dir',
        // forceMin: 16,
        // fixed: true,
        // enable: true
    })

    this.scoreText = this.add.text(relativeWidth(60), relativeHeight(3), 'Score: 0', FONT_STYLE);
    this.gameOverText = this.add.text(relativeWidth(50), relativeHeight(48), 'Game Over', FONT_STYLE)
    this.gameOverText.setOrigin(0.5)
    this.gameOverText.alpha = 0

    this.restartButton = this.add.text(relativeWidth(50), relativeHeight(52), 'Restart!', FONT_STYLE).setInteractive().setOrigin(0.5)
    this.restartButton.alpha = 0
    this.restartButton.on('pointerdown', () => {
      this.scene.restart()
      this.bulletIntervals.forEach(bulletInterval => clearInterval(bulletInterval))
      this.bulletIntervals = []
    })
    
    this.player = this.physics.add.sprite(relativeWidth(50), relativeHeight(70), 'ship')
    this.player.setCollideWorldBounds(true)
    this.player.scale = 0.16

    this.bullets = this.physics.add.group()
    this.enemyBullets = this.physics.add.group()
    this.ships = this.physics.add.group()

    this.physics.add.collider(this.ships, this.bullets, this.hitShip, null, this)
    this.physics.add.collider(this.player, this.enemyBullets, this.hitPlayer, null, this)
    this.physics.add.collider(this.player, this.ships, this.hitPlayer, null, this)

    /* this.createMovementButton(25, 79, 0.4, 'u') 
    this.createMovementButton(34.5, 80, 0.4, 'ur')
    this.createMovementButton(25, 91, 0.4, 'd')
    this.createMovementButton(34.5, 90, 0.4, 'dr')
    this.createMovementButton(12, 85, 0.4, 'l')
    this.createMovementButton(15.5, 90, 0.4, 'dl')
    this.createMovementButton(38, 85, 0.4, 'r') 
    this.createMovementButton(15.5, 80, 0.4, 'ul') */

    this.fireButton = this.physics.add.sprite(relativeWidth(80), relativeHeight(85), 'button')  
    this.fireButton.setInteractive()
    this.fireButton.scale = 0.8
    this.fireButton.alpha = 0.5
    this.fireButton.on('pointerover', f => {
      this.shoot = true
      this.fireButton.alpha = 1
    })  
    this.fireButton.on('pointerout', f => {
      this.shoot = false
      this.fireButton.alpha = 0.5
    })     
  }

  update() {
    this.background.tilePositionY -= BG_SPEED
    const {forceX, forceY} = this.joyStick
    this.setPlayerVelocity(forceX*SPEED_ADJUSTER, forceY*SPEED_ADJUSTER)
    if(randomIntBetween(1, 80) === 1) this.createShip()
    /* switch(this.movePlayer) {
      case 'u':
        this.setPlayerVelocity(0, -SPEED)
        break
      case 'd':
        this.setPlayerVelocity(0, SPEED)
        break
      case 'l':
        this.setPlayerVelocity(-SPEED, 0)
        break
      case 'r':
        this.setPlayerVelocity(SPEED, 0)
        break
      case 'ur':
        this.setPlayerVelocity(SPEED, -SPEED)
        break
      case 'dr':
        this.setPlayerVelocity(SPEED, SPEED)
        break
      case 'dl':
        this.setPlayerVelocity(-SPEED, SPEED)
        break
      case 'ul':
        this.setPlayerVelocity(-SPEED, -SPEED)
        break
      default: 
        this.setPlayerVelocity(0, 0)
    } */
    if(this.shoot) { 
      if(this.bulletTime + 200 < this.time.now) {
        this.bulletTime = this.time.now
        this.createBullet()
      }
    }
    this.bullets.children.entries.forEach(bullet => {
      if(bullet.y < 0) {
        this.destroyBullet(bullet)
      }
    })
    this.enemyBullets.children.entries.forEach(bullet => {
      if(bullet.y > relativeHeight(70)) {
        this.destroyBullet(bullet)
      }
    })
    this.ships.children.entries.forEach(ship => {
      if(ship.y > relativeHeight(70)) {
        this.destroyShip(ship)
      }
    })
  }

  createMovementButton(posX, posY, scale, direction) {
    const button = this.physics.add.sprite(relativeWidth(posX), relativeHeight(posY), 'button').setInteractive()  
    button.scale = scale
    button.alpha = 0.5
    this.rightButton
    button.on('pointerover', e => {
      this.movePlayer = direction
      button.alpha = 1
    })
    button.on('pointerout', f => {
      this.movePlayer = 'stand'
      button.alpha = 0.5
    })
  }

  setPlayerVelocity(xSpeed, ySpeed) {
    this.player.setVelocityX(xSpeed)
    if(this.player.y <= relativeHeight(70) || (this.player.y > relativeHeight(70) && ySpeed < 0)) {
      this.player.setVelocityY(ySpeed)
    } else {
      this.player.setVelocityY(0)
    }
  }

  createBullet() {
    let bullet = this.bullets.create(this.player.x, this.player.y-20, 'bullet')
    bullet.setVelocityY(-200)
  }

  createShip() {
    let ship = this.ships.create(randomIntBetween(relativeWidth(5), relativeWidth(95)), -50, 'ship')
    ship.angle = 180
    ship.setVelocityY(randomIntBetween(100, 150))
    ship.scale = 0.16
    const bulletInterval = setInterval(()=>{
      this.createEnemyBullet(ship.x, ship.y)
    }, 1500)
    ship.bulletInterval = bulletInterval
    this.bulletIntervals.push(bulletInterval)
  }

  createEnemyBullet(x, y) {
    let bullet = this.enemyBullets.create(x, y+20, 'bullet')
    bullet.setVelocityY(180)
  }
  
  hitShip (ship, bullet) {
    this.destroyBullet(bullet)
    this.destroyShip(ship)
    this.score += 10
    this.scoreText.setText('Score: ' + this.score)
  }

  hitPlayer (player, bullet) {
    player.disableBody(true, true)
    this.destroyBullet(bullet)
    this.gameOverText.alpha = 1
    this.restartButton.alpha = 1
  }

  destroyShip(ship) {
    this.bulletIntervals.splice(this.bulletIntervals.findIndex(bulletInterval => bulletInterval === ship.bulletInterval), 1)
    clearInterval(ship.bulletInterval)
    ship.disableBody(true, true)
    ship.destroy()
  }

  destroyBullet(bullet) {
    bullet.disableBody(true, true)
    bullet.destroy()
  }
}
  