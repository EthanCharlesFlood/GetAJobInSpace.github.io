class Tutorial {
  constructor(context) {
    this.context = context;
    this.draw = this.draw.bind(this);
    this.counter = 0;
  }

  left() {

  }

  right() {

  }

  up() {

  }

  down() {

  }

  demoEnemy() {

  }

  demoCollect() {
    
  }

  draw() {
    this.context.beginPath();
    this.context.fillText("Get a Job", 435, 200);
    this.context.fillStyle = "#ff0000";
    this.context.closePath();
    this.context.beginPath();
    this.context.fillText("IN SPACE", 430, 300);
    this.context.fillStyle = "#ff0000";
    this.context.closePath();
    this.context.beginPath();
    this.context.fillText("Press Space to Start the Hunt", 330, 400);
    this.context.fillStyle = "#ff0000";
    this.context.closePath();
  }
}

export default Tutorial;
