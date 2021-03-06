import GameObject from './object.js';

class Collectable extends GameObject {
  constructor(pc, jp,canvasWidth, canvasHeight, ctx) {
    super(canvasWidth, canvasHeight);
    this.context = ctx;
    this.collected = false;
    this.dx = 10;
    this.count = 0;
    this.referral = new Image();
    this.referral.src = "assets/imageedit_3_7734021827.png";
    this.collected = false;
    this.harmful = false;
    this.pc = pc;
    this.jp = jp;
    this.collectionImage = new Image();
    this.collectionImage.src = "assets/imageedit_1_3881340611.png";
    this.collectionNoise = new Audio();
    this.collectionNoise.volume = 0.5;
    this.collectionNoise.src = "assets/131660__bertrof__game-sound-correct.wav";
    this.drawCollection = this.drawCollection.bind(this);
    this.playCollectionNoise = this.playCollectionNoise.bind(this);
    this.reset = this.reset.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unMute.bind(this);
    this.heights = [70,180,285,390,495];
  }

  hitbox() {
    return {
      x1: this.x,
      x2: this.x + 50,
      y1: this.y,
      y2: this.y + 50,
    };
  }

  reset() {
    let heights = [65,165,265,365,465];
    this.collected = false;
    this.x = 1000;
    this.y = heights[Math.floor(Math.random * 5)];
  }

  mute() {
    this.collectionNoise.volume = 0;
  }

  unMute() {
    this.collectionNoise.volume = 0.5;
  }

  playCollectionNoise() {
    this.collectionNoise.currentTime = 0;
    this.collectionNoise.play();
  }

  drawCollection() {
    if (this.count === 0) {
      this.playCollectionNoise();
      this.count += 1;
    } else if (this.count < 15) {
      this.context.drawImage(this.collectionImage,40,75,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 30) {
      this.context.drawImage(this.collectionImage,297,75,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 45) {
      this.context.drawImage(this.collectionImage,554,75,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 60) {
      this.context.drawImage(this.collectionImage,811,75,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 75) {
      this.context.drawImage(this.collectionImage,40,303,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 90) {
      this.context.drawImage(this.collectionImage,297,303,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 105) {
      this.context.drawImage(this.collectionImage,554,303,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else if (this.count < 120) {
      this.context.drawImage(this.collectionImage,811,303,50,50,this.x,this.y,50,50);
      this.count += 1;
    } else {
      this.collected = false;
      this.count = 0;
      this.pc.collected++;
      this.jp.collected++;
      this.x = 1500;
      this.y = this.heights[Math.floor(Math.random() * 5)];
    }
  }

  draw() {
    if (this.x < -50) {
      this.x = 1500;
      this.y = this.heights[Math.floor(Math.random() * 5)];
    }
    if (this.collected === true && !(this.pc.dead)) {
      this.drawCollection();
    }  else if (this.collected === false) {
      this.x -= 10;
      this.context.drawImage(this.referral,200,5,62,60,this.x,this.y,60,60);
    }

  }
}

export default Collectable;
