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
    this.startTime = 0;
    this.times = [];

    this.speed = 0;
  }

  create() {
    const { width, height } = this.scale
    this.bg = this.add.tileSprite(0, 0, width, height, 'background2').setOrigin(0.0, 0.0)
    this.add.sprite(width / 2, height / 2, 'user').setScale(0.3)
    this.player2 = this.add.sprite(width / 4, height / 2, 'user2').setScale(0.3)
    // this.parseGpx();
    // console.log('this.distance', this.distance);

    this.parseGpx(gpxFile).then((gpx) => {
        console.log('this.distance', gpx)
      this.distance = gpx.tracks[0].distance.cumul;
      this.times = gpx.tracks[0].points.map((x) => x.time);
      console.log('this.distance', this.distance)
      console.log('this.distance', this.times)
    })
    this.parseGpx(otherGpx).then((distance, times) => {
      this.user2Distance = distance
    })

    // const event = this.time.addEvent({
    //   delay: 1000,
    //   callback: this.startTimer,
    //   callbackScope: this,
    //   loop: true
    // })
    const timer = this.time.addEvent({
        delay: 1000,
        callback: this.startTimer,
        callbackScope: this,
      loop: true
    })
  }

  moveBg() {
    console.log('1초 지남')
    if (this.index == 0) {
      const moveValue = this.distance[this.index]
      // this.bg.tilePositionY -= moveValue*5;
      const targetPositionY = this.bg.tilePositionY - moveValue * 10
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
      const targetPositionY = this.bg.tilePositionY - moveValue * 10
      this.tweens.add({
        targets: this.bg,
        tilePositionY: targetPositionY,
        duration: 2000,
        ease: 'easeInOut'
      })
    }
    this.player2.y =
      this.scale.height / 2 + (this.distance[this.index] - this.user2Distance[this.index]) * 10
    this.tweens.add({
      targets: this.player2,
      y: this.scale.height / 2 + (this.distance[this.index] - this.user2Distance[this.index]) * 10,
      duration: 1000,
      ease: 'easeInOut'
    })
    console.log('each value', this.distance[this.index], this.user2Distance[this.index])
    console.log('gap', this.distance[this.index] - this.user2Distance[this.index])
    this.index++
  }

  startTimer() {
    this.startTime += 1000;
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
        console.log('times', gpx.tracks[0].points);
        return gpx;
        // console.log('gpx', gpx.tracks[0].distance.cumul);
        // this.distance =  gpx.tracks[0].distance.cumul;
      })
      .catch((error) => {
        console.error('Error fetching or parsing GPX file:', error)
      })
  }

  setSpeed() {
      console.log('this.index', this.index);
        this.speed = (this.distance[this.index] - this.distance[this.index-1] / this.times[this.index] - this.times[this.index-1]);
        console.log('speed', this.speed);
        const moveValue = this.distance[this.index] - this.distance[this.index-1];
        const targetPositionY = this.bg.tilePositionY - moveValue*10;
        this.tweens.add({
          targets: this.bg,
          duration: this.times[this.index] - this.times[this.index-1],
          tilePositionY: targetPositionY, 
          ease: 'easeInout'
        })
      // this.bg.tilePositionY -= moveValue*5;
  }

  update(time, delta) {
    
    
    // 데이터가 새로 들어왔을 때 speed 갱신 해야함.
    // 테스트 조건 : 현재와 다음 시간 차이만큼 timer가 흘렀으면 데이터가 새로 들어왔다고 가정.
    // 실제 : 현재 시간이 가장 최근 데이터 값의 시간보다 크면 데이터가 새로 들어왔다고 가정.
    if(this.times[this.index+1] - this.times[this.index] <= this.startTime) {
        
        console.log('start!', this.times[this.index+1] - this.times[this.index]);
        if(this.index > 0) { // this.distance[0]이 0이 아님
            if(this.index == 1) {
              const beforeDistance = this.distance[this.index];
              const beforeTime = (this.times[this.index] - this.times[this.index - 1])/1000;
              const nowSpeed = ((this.distance[this.index] - this.distance[this.index - 1]) / ((this.times[this.index+1] - this.times[this.index])/1000))
              this.speed = this.speed + (beforeDistance/beforeTime - nowSpeed);
            } else {
              const beforeDistance = this.distance[this.index - 1] - this.distance[this.index -2];
              const beforeTime = (this.times[this.index] - this.times[this.index - 1])/1000;
              const nowSpeed = ((this.distance[this.index] - this.distance[this.index - 1]) / ((this.times[this.index+1] - this.times[this.index])/1000))
              this.speed = this.speed + (beforeDistance/beforeTime - nowSpeed);
            }
            console.log('this.speed', this.speed);
        } else {
          console.log('index == 0');
          this.speed = this.distance[this.index] / ((this.times[this.index+1] - this.times[this.index])/1000);
        }
        this.startTime = 0;
        this.index++;
    }
    // 별도 speed 갱신 조건.
    // if(현재거리 - 직전거리 === 0) => this.speed = 0으로

    // this.bg.tilePositionY -= this.speed/5;
    this.bg.tilePositionY -= this.speed/5;

  }

  changeScene() {
    this.scene.start('GameOver')
  }
}

