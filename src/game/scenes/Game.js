import { Scene } from 'phaser'
import gpxFile from '/assets/gpx/mapo.gpx?url'
import otherGpx from '/assets/gpx/hanam.gpx?url'
import gpxParser from 'gpxparser'

export class Game extends Scene {
  constructor() {
    super('Game')

    this.index = 0
    this.distance = []
    this.user2Distance = []
  }

  create() {
    const { width, height } = this.scale
    this.bg = this.add.tileSprite(0, 0, width, height, 'background2').setOrigin(0.0, 0.0)
    this.add.sprite(width / 2, height / 2, 'user').setScale(0.3)
    this.player2 = this.add.sprite(width / 4, height / 2, 'user2').setScale(0.3)
    // this.parseGpx();
    // console.log('this.distance', this.distance);

    this.parseGpx(gpxFile).then((distance) => {
      this.distance = distance
      console.log('this.distance', this.distance)
    })
    this.parseGpx(otherGpx).then((distance) => {
      this.user2Distance = distance
      console.log('this.user2Distance', this.user2Distance)
    })

    const event = this.time.addEvent({
      delay: 1000,
      callback: this.moveBg,
      callbackScope: this,
      loop: true
    })
  }

  moveBg() {
    console.log('1초 지남')
    if (this.index == 0) {
      const moveValue = this.distance[this.index]
      // this.bg.tilePositionY -= moveValue*5;
      const targetPositionY = this.bg.tilePositionY - moveValue * 5
      this.tweens.add({
        targets: this.bg,
        tilePositionY: targetPositionY,
        duration: 2000,
        ease: 'easeInout'
      })
    } else {
      console.log('moveValue !!!!!!!!!', this.distance[this.index], this.distance[this.index - 1])
      const moveValue = this.distance[this.index] - this.distance[this.index - 1]
      // this.bg.tilePositionY -= moveValue*5;
      const targetPositionY = this.bg.tilePositionY - moveValue * 5
      this.tweens.add({
        targets: this.bg,
        tilePositionY: targetPositionY,
        duration: 2000,
        ease: 'easeInOut'
      })
    }
    this.player2.y =
      this.scale.height / 2 + (this.distance[this.index] - this.user2Distance[this.index]) * 5
    this.tweens.add({
      targets: this.player2,
      y: this.scale.height / 2 + (this.distance[this.index] - this.user2Distance[this.index]) * 5,
      duration: 1000,
      ease: 'easeInOut'
    })
    console.log('each value', this.distance[this.index], this.user2Distance[this.index])
    console.log('gap', this.distance[this.index] - this.user2Distance[this.index])
    this.index++
  }

  parseGpx(gpxData) {
    return fetch(gpxData) // GPX 파일 경로
      .then((response) => response.text())
      .then((data) => {
        // XML 문자열을 파싱하여 JavaScript 객체로 변환
        let parser = new DOMParser()
        var gpx = new gpxParser()
        let xmlDoc = parser.parseFromString(data, 'text/xml')
        console.log('xmlDoc', xmlDoc)
        gpx.parse(data)
        return gpx.tracks[0].distance.cumul
        // console.log('gpx', gpx.tracks[0].distance.cumul);
        // this.distance =  gpx.tracks[0].distance.cumul;
      })
      .catch((error) => {
        console.error('Error fetching or parsing GPX file:', error)
      })
  }

  update(time, delta) {}

  changeScene() {
    this.scene.start('GameOver')
  }
}

