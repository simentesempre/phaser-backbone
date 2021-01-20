import { WIDTH, HEIGHT, IS_TOUCH, relativeWidth, relativeHeight, randomIntBetween } from '../config/global'

import { SPEED_ADJUSTER, FONT_STYLE, BG_SPEED, DESKTOP_SPEED } from '../config/game'

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' })
    this.movePlayer = 'stand'
    this.shoot = false
    this.bulletTime = 0
    this.score = 0
    this.bulletIntervals = []
    this.gameOver = false
  }

  create() {
    this.background = this.add.tileSprite(relativeWidth(50), relativeHeight(50), WIDTH, HEIGHT, 'sky')
    this.scoreText = this.add.text(relativeWidth(95), relativeHeight(5), 'SCORE: 0', FONT_STYLE).setOrigin(1)
    this.gameOverText = this.add.text(relativeWidth(50), relativeHeight(48), 'GAME OVER', FONT_STYLE).setOrigin(0.5)
    this.gameOverText.alpha = 0
    this.restartButton = this.add
      .text(relativeWidth(50), relativeHeight(52), '> RESTART <', FONT_STYLE)
      .setInteractive()
      .setOrigin(0.5)
    this.restartButton.alpha = 0
    this.restartButton.on('pointerdown', () => {
      this.scene.restart()
      this.bulletIntervals.forEach((bulletInterval) => clearInterval(bulletInterval))
      this.bulletIntervals = []
    })

    this.player = this.physics.add.sprite(relativeWidth(50), relativeHeight(70), 'ship').setCollideWorldBounds(true)
    this.player.scale = 0.16

    this.bullets = this.physics.add.group()
    this.enemyBullets = this.physics.add.group()
    this.ships = this.physics.add.group()

    this.physics.add.collider(this.ships, this.bullets, this.hitShip, null, this)
    this.physics.add.collider(this.player, this.enemyBullets, this.hitPlayer, null, this)
    this.physics.add.collider(this.player, this.ships, this.hitPlayer, null, this)

    if (IS_TOUCH) {
      this.joyStick = this.plugins.get('rexVirtualJoystick').add(this, {
        x: relativeWidth(28),
        y: relativeHeight(82),
        radius: 60,
      })
      this.fireButton = this.physics.add.sprite(relativeWidth(80), relativeHeight(85), 'button')
      this.fireButton.setInteractive()
      this.fireButton.scale = 0.8
      this.fireButton.alpha = 0.5
      this.fireButton.on('pointerover', (f) => {
        this.shoot = true
        this.fireButton.alpha = 1
      })
      this.fireButton.on('pointerout', (f) => {
        this.shoot = false
        this.fireButton.alpha = 0.5
      })
    } else {
      this.keys = this.input.keyboard.createCursorKeys()
    }
  }

  update() {
    console.log(this.gameOver)
    this.background.tilePositionY -= BG_SPEED
    if (IS_TOUCH) {
      const { forceX, forceY } = this.joyStick
      this.setPlayerVelocity(forceX * SPEED_ADJUSTER, forceY * SPEED_ADJUSTER)
    } else {
      if (this.keys.left.isDown) {
        this.setXPlayerVelocity(-DESKTOP_SPEED)
      } else if (this.keys.right.isDown) {
        this.setXPlayerVelocity(DESKTOP_SPEED)
      } else {
        this.setXPlayerVelocity(0)
      }
      if (this.keys.up.isDown) {
        this.setYPlayerVelocity(-DESKTOP_SPEED)
      } else if (this.keys.down.isDown) {
        this.setYPlayerVelocity(DESKTOP_SPEED)
      } else {
        this.setYPlayerVelocity(0)
      }
      if (this.keys.space.isDown) {
        this.shoot = true
      } else {
        this.shoot = false
      }
    }

    if (randomIntBetween(1, 80) === 1) {
      this.createShip()
    }
    if (this.shoot) {
      if (this.bulletTime + 200 < this.time.now) {
        this.bulletTime = this.time.now
        this.createBullet()
      }
    }
    this.bullets.children.entries.forEach((bullet) => {
      if (bullet.y < 0) {
        this.destroyBullet(bullet)
      }
    })
    this.enemyBullets.children.entries.forEach((bullet) => {
      if (bullet.y > relativeHeight(IS_TOUCH ? 70 : 100)) {
        this.destroyBullet(bullet)
      }
    })
    this.ships.children.entries.forEach((ship) => {
      if (ship.y > relativeHeight(IS_TOUCH ? 70 : 100)) {
        this.destroyShip(ship)
      }
    })
  }

  setPlayerVelocity(xSpeed, ySpeed) {
    this.setXPlayerVelocity(xSpeed)
    this.setYPlayerVelocity(ySpeed)
  }

  setXPlayerVelocity(speed) {
    this.player.setVelocityX(speed)
  }

  setYPlayerVelocity(speed) {
    if (!IS_TOUCH || this.player.y <= relativeHeight(70) || (this.player.y > relativeHeight(70) && speed < 0)) {
      this.player.setVelocityY(speed)
    } else {
      this.player.setVelocityY(0)
    }
  }

  createBullet() {
    console.log(this.gameOver)
    if (!this.gameOver) {
      let bullet = this.bullets.create(this.player.x, this.player.y - 20, 'bullet')
      bullet.setVelocityY(-200)
    }
  }

  createShip() {
    let ship = this.ships.create(randomIntBetween(relativeWidth(5), relativeWidth(95)), -50, 'ship')
    ship.angle = 180
    ship.setVelocityY(randomIntBetween(100, 150))
    ship.scale = 0.16
    const bulletInterval = setInterval(() => {
      this.createEnemyBullet(ship.x, ship.y)
    }, 1500)
    ship.bulletInterval = bulletInterval
    this.bulletIntervals.push(bulletInterval)
  }

  createEnemyBullet(x, y) {
    let bullet = this.enemyBullets.create(x, y + 20, 'bullet')
    bullet.setVelocityY(180)
  }

  hitShip(ship, bullet) {
    this.destroyBullet(bullet)
    this.destroyShip(ship)
    this.score += 10
    this.scoreText.setText('SCORE: ' + this.score)
  }

  hitPlayer(player, bullet) {
    player.disableBody(true, true)
    this.destroyBullet(bullet)
    this.gameOverText.alpha = 1
    this.restartButton.alpha = 1
    this.gameOver = true
  }

  destroyShip(ship) {
    this.bulletIntervals.splice(
      this.bulletIntervals.findIndex((bulletInterval) => bulletInterval === ship.bulletInterval),
      1
    )
    clearInterval(ship.bulletInterval)
    ship.disableBody(true, true)
    ship.destroy()
  }

  destroyBullet(bullet) {
    bullet.disableBody(true, true)
    bullet.destroy()
  }
}
