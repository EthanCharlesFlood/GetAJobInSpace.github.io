class JobPoints {
  constructor(character, context, highScoreForm) {
    this.jobPoints = 0;
    this.collected = 0;
    this.character = character;
    this.context = context;
    this.highScoreForm = highScoreForm;
    this.jobPointDisplay = `Job Points: ${this.jobPoints}`;
    this.updateJobPoints = this.updateJobPoints.bind(this);
    this.resetJobPoints = this.reset.bind(this);
    this.draw = this.draw.bind(this);
    this.nameEntered = false;
    this.rate = 1;
  }

  updateJobPoints() {
    const dead = this.character.dead;
    if (!dead) {
      this.jobPoints += (this.rate + (this.collected));
    }
    this.jobPointDisplay = `Job Points: ${this.jobPoints}`;
  }

  reset() {
    this.jobPoints = 0;
    this.JobPointDisplay = `Job Points: ${this.jobPoints}`;
    this.nameEntered = false;
    this.rate = 1;
  }

  draw() {
    const dead = this.character.dead;
    if (!dead) {
      this.updateJobPoints();
      this.context.beginPath();
      this.context.fillText(this.jobPointDisplay, 25, 25);
      this.context.fillStyle = "#FFFFFF";
      this.context.closePath();
    } else {
      this.context.beginPath();
      this.context.fillText(this.jobPointDisplay, 25, 25);
      this.context.fillStyle = "#FFFFFF";
      this.context.closePath();
      if (!(this.highScoreForm.didGetAJob(this.jobPoints))) {
        this.context.beginPath();
        this.context.fillText("YOU DID NOT GET A JOB IN SPACE", 250, 300);
        this.context.fillStyle = "#FFFFFF";
        this.context.closePath();
        this.context.beginPath();
        this.context.fillText("PRESS SPACE TO RESET", 325, 400);
        this.context.fillStyle = "#FFFFFF";
        this.context.closePath();
      } else if (this.highScoreForm.didGetAJob(this.jobPoints) && !this.nameEntered){
        let name = this.highScoreForm.giveName();
        this.context.beginPath();
        this.context.fillText("YOU DID IT!", 430, 150);
        this.context.fillStyle = "#FFFFFF";
        this.context.closePath();
        this.context.beginPath();
        this.context.fillText("ENTER YOUR NAME THEN PRESS ENTER", 250, 250);
        this.context.fillStyle = "#FFFFFF";
        this.context.closePath();
        this.context.beginPath();
        this.context.fillText("TO RECEIVE YOUR SPACEJOB", 320, 350);
        this.context.fillStyle = "#FFFFFF";
        this.context.closePath();
        this.context.beginPath();
        this.context.fillText(name, 445, 450);
        this.context.fillStyle = "#FFFFFF";
        this.context.closePath();
      } else {
        this.highScoreForm.draw();
      }
    }
  }
}

export default JobPoints;
