import CharacterObject from './scripts/character';
import Obstacle from "./scripts/obstacles.js";
import BackgroundObject from "./scripts/background.js";
import Menu from "./scripts/menu.js";
import JobPoints from "./scripts/jobPoints.js";
import HighScoreForm from "./scripts/highScoreForm.js";
import { EnemyObject, EnemyObject2 } from "./scripts/enemies.js";
import Collectable from "./scripts/collectables.js";
import Tutorial from "./scripts/tutorial.js";
import PauseScreen from "./scripts/paused_screen";
import firebase from 'firebase/app';
import firebaseDatabase from 'firebase/database';


var config = {
	apiKey: "AIzaSyD2VlDf6mu3KuOHSUWOi-ij6X3JObcd-CM",
	authDomain: "getajobinspace.firebaseapp.com",
	databaseURL: "https://getajobinspace.firebaseio.com",
	projectId: "getajobinspace",
	storageBucket: "getajobinspace.appspot.com",
	messagingSenderId: "473757881805"
};
firebase.initializeApp(config);

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let now, delta;
let then = Date.now();
let fps = 60;
let interval = 1000/fps;
let gameStart = 0;
let database = firebase.database();
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.font = "30px Sans MS";
ctx.fillStyle = "white";

let paused = false;
let muted = false;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let gameRunning = false;
let tutorial = false;

const shuffle = function (array) {
	let currentIndex = array.length;
  let temporaryValue, randomIndex;
	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}
	return array;
};

const heights = shuffle([50,160,265,370,475,580]);

const bg = new BackgroundObject(0,0, ctx);
const tc = new CharacterObject(150, 200, ctx);
const e1 = new EnemyObject(1250, 0, ctx);
const e2 = new EnemyObject(1500, 0, ctx);
const o1 = new Obstacle(1000, heights[0], ctx, tc);
const o2 = new Obstacle(1000, heights[1], ctx, tc);
const o3 = new Obstacle(1000, heights[2], ctx, tc);
const o4 = new Obstacle(1000, heights[3], ctx, tc);
const o5 = new Obstacle(1000, heights[4], ctx, tc);
const o6 = new Obstacle(1000, heights[5], ctx, tc);
const o7 = new Obstacle(1000, heights[6], ctx, tc);
const hsf = new HighScoreForm(ctx, database);
const jp = new JobPoints(tc, ctx, hsf);
const ps = new PauseScreen(ctx);
const menu = new Menu(ctx);
const tte = new EnemyObject(1250, 0, ctx);
const tto = new Obstacle(1000, 250, ctx);
const ttclctb = new Collectable(tc, jp, 1000, 500, ctx);
const tt = new Tutorial(ctx, tc, tte, tto, ttclctb);
const clctb = new Collectable(tc, jp,1000,300,ctx);


const muteButton = document.getElementById("volume-up-down");
const pauseButton = document.getElementById("pause-play");

const mutePlay = () => {
	$("#volume-up-down").toggleClass('fa-volume-up fa-volume-off');
	if (muted) {
		tc.unMute();
		clctb.unMute();
		muted = false;
	} else {
		tc.mute();
		clctb.mute();
		muted = true;
	}
};

const pausePlay = () => {
	$("#pause-play").toggleClass('fa-play fa-pause');
	if (paused) {
		paused = false;
	} else {
		paused = true;
	}
};

muteButton.onclick = mutePlay;
pauseButton.onclick = pausePlay;

const resetGame = () => {
  gameStart = 0;
  jp.reset();
  tc.reset();
  e1.reset();
	e2.reset();
  o1.reset();
  o2.reset();
  o3.reset();
  o4.reset();
  o5.reset();
  o6.reset();
  o7.reset();
  clctb.reset();
	hsf.reset();
	menu.reset();
};


const keyDownHandler = (e) => {
	if (gameStart > 0 && tc.dead && !jp.nameEntered) {
		let key = e.key;
		hsf.addLetter(key);
	}
  if (e.keyCode === 40) {
    tc.upPressed = true;
		if (tutorial) {
			tt.upPressed = true;
		}
  } else if (e.keyCode === 38) {
    tc.downPressed = true;
		if (tutorial) {
			tt.downPressed = true;
		}
  } else if (e.keyCode === 32) {
    spacePressed = true;
    if (gameStart < 1 && menu.selector == 1) {
      gameStart = 1;
			tc.startMusic();
    } else if (gameStart < 1 && menu.selector == 0) {
			tutorial = true;
		} else if (gameStart > 0 && tc.dead) {
        if (jp.nameEntered || !hsf.didGetAJob(jp.jobPoints)) {
					resetGame();
				}
    }
  } else if (e.keyCode === 39) {
    tc.rightPressed = true;
		if (tutorial) {
			tt.rightPressed = true;
		}
  } else if (e.keyCode === 37) {
    tc.leftPressed = true;
		if (tutorial) {
			tt.leftPressed = true;
		}
  } else if (e.keyCode === 13) {
		if (gameStart > 0 && tc.dead && !jp.nameEntered) {
			hsf.update(jp.jobPoints);
			jp.nameEntered = true;
		}
	} else if (e.keyCode === 8) {
		if (gameStart > 0 && tc.dead && !jp.nameEntered) {
			hsf.backSpace();
		}
	}
};

const keyUpHandler = (e) => {
  if (e.keyCode === 40) {
    tc.upPressed = false;
		if (tutorial) {
			tt.upPressed = false;
		}
		menu.up();
  } else if (e.keyCode === 38) {
    tc.downPressed = false;
		if (tutorial) {
			tt.downPressed = false;
		}
		menu.down();
  } else if (e.keyCode === 39) {
    tc.rightPressed = false;
		if (tutorial) {
			tt.rightPressed = false;
		}
  } else if (e.keyCode === 37) {
    tc.leftPressed = false;
		if (tutorial) {
			tt.leftPressed = false;
		}
  } else if (e.keyCode === 32) {
    spacePressed = false;
  }
};

canvas.onmousemove = (e) => {

	let bound = canvas.getBoundingClientRect();
	var x = e.clientX - bound.left;
  var y = e.clientY - bound.top;
	if (gameStart < 1) {
		if (menu.isPlay(x,y) && menu.selector != 1) {
			menu.up();
		} else if (menu.isTutorial(x,y) && menu.selector === 1) {
			menu.up();
		}
	}
};
canvas.addEventListener("click", (e) => {
	let bound = canvas.getBoundingClientRect();
	var x = e.clientX - bound.left;
	var y = e.clientY - bound.top;
	if (gameStart < 1) {
		if (menu.isPlay(x,y) && menu.selector === 1) {
			gameStart = 1;
		} else if (menu.isTutorial(x,y) && menu.selector != 1) {
			tutorial = true;
		}
	}
});
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

const draw = () => {
  requestAnimationFrame(draw);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
    then = now - (delta % interval);
    if (gameStart < 1 && !tutorial) {
			ctx.fillStyle = "black";
			ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
			ctx.fillStyle = "white";
      menu.draw();
    } else if (tutorial) {
			if (tt.done) {
				tutorial = false;
				tt.done = false;
			}
			bg.draw();
			tt.draw();
			tc.draw();
		} else if (paused  && gameStart == 1) {
			ps.draw();
		} else {
			jp.draw();
      bg.draw();
      tc.draw();
      clctb.draw();
      tc.checkCollision(clctb);
      if (tc.collected < 3 && !tc.dead) {
        o1.draw();
        o2.draw();
        tc.checkCollision(o1);
        tc.checkCollision(o2);
      } else if (tc.collected < 6 && !tc.dead) {
        o1.draw();
        o2.draw();
        o3.draw();
        o4.draw();
        tc.checkCollision(o1);
        tc.checkCollision(o2);
        tc.checkCollision(o3);
        tc.checkCollision(o4);
      } else if (tc.collected < 9 && !tc.dead) {
        o1.draw();
        o2.draw();
        o3.draw();
        o4.draw();
        o5.draw();
        o6.draw();
        tc.checkCollision(o1);
        tc.checkCollision(o2);
        tc.checkCollision(o3);
        tc.checkCollision(o4);
        tc.checkCollision(o5);
        tc.checkCollision(o6);
      } else if (tc.collected < 12 && !tc.dead) {
        o1.draw();
        o2.draw();
        o3.draw();
        o4.draw();
        o5.draw();
        o6.draw();
        e1.draw();
        tc.checkCollision(o1);
        tc.checkCollision(o2);
        tc.checkCollision(o3);
        tc.checkCollision(o4);
        tc.checkCollision(o5);
        tc.checkCollision(o6);
        tc.checkCollision(e1);
      } else if (tc.collected < 15 && !tc.dead) {
				o1.draw();
        o2.draw();
        o3.draw();
        o4.draw();
        o5.draw();
        o6.draw();
        e1.draw();
        e2.draw();
        tc.checkCollision(o1);
        tc.checkCollision(o2);
        tc.checkCollision(o3);
        tc.checkCollision(o4);
        tc.checkCollision(o5);
        tc.checkCollision(o6);
        tc.checkCollision(e1);
        tc.checkCollision(e2);
			}else if (!tc.dead){
        o1.draw();
        o2.draw();
        o3.draw();
        o4.draw();
        o5.draw();
        o6.draw();
        e1.draw();
        e2.draw();
        tc.checkCollision(o1);
        tc.checkCollision(o2);
        tc.checkCollision(o3);
        tc.checkCollision(o4);
        tc.checkCollision(o5);
        tc.checkCollision(o6);
        tc.checkCollision(e1);
        tc.checkCollision(e2);
      }
      jp.draw();
    }
  }
};

draw();
