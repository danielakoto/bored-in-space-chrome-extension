
//Start Game
const st = document.getElementById('StartButton');
const splash = document.getElementById('SplashScreen');
const canvas = document.getElementById('canvas1');
const endgame = document.getElementById('endgame');
const canvas1 = document.getElementById('canvasback');
const showHighScore = document.getElementById('showHighscore');
const finscore = document.getElementById('finscore');
const hid = document.getElementById('highestnumber');
const boredInSpace = document.getElementById('boredInSpace');
const statement = document.getElementById('statement');
const enemies = ['img/space-enemy.png', 'img/planet-1.png']
let countLives = 3


//themesong
const themeSong = document.createElement('audio'); 
themeSong.src = 'sounds/oscillating-space-waves.mp3';
themeSong.volume = 1;
themeSong.load();
themeSong.play();

//endgame song
const endgameSong = document.createElement('audio'); 
endgameSong.src = 'sounds/alien-scary-space-vibration-sound-with-ticks.mp3';
endgameSong.volume = 0.5;
endgameSong.load();

//Highscore in Local Storage
if(localStorage.getItem("high-score") == null) {
    localStorage.setItem("high-score", 0);
}


//check local storage for recent title and note
if(localStorage.getItem("title") == "") {
    localStorage.setItem("title", null);
}

st.addEventListener('click', startGame);

//Canvas 
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let enemySpeed = 1;
let score = 0;
let level = 1;
let templevel = 0;
let gameFrame = 0;
ctx.font = '18px Comic Sans MS';

//Player 
const playerRight = new Image();
const playerLeft = new Image();

//Mouse Interact
let canvasPosition = canvas.getBoundingClientRect();


const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousedown', function(e){
    mouse.click = true;
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});

canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
    mouse.click = false;
});

canvas.addEventListener('mouseup', function(){
    mouse.click = false;
});


//Random Number Go Getter
var que =  Math.floor((Math.random()*10));

const celebrationSound = document.createElement('audio');
celebrationSound.src = 'sounds/'


//Player 

playerLeft.src = 'img/space-ship.png';
playerRight.src = 'img/space-ship.png';
var gameSwitch = true;

class Player {
    constructor(){
        this.x = canvas.width;
        this.y = canvas.height/2;
        this.radius = 25;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    
    update(){
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        if(mouse.x != this.x){
            this.x -= dx/1.5;
        }
        if(mouse.y != this.y){
            this.y -= dy/1.5;
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0 , Math.PI * 2);
        ctx.closePath();
        ctx.save();
        ctx.translate(this.x, this.y);
        if(this.x >= mouse.x){
            ctx.drawImage(playerLeft, 0-45, 0-45, this.spriteWidth/4-40, this.spriteHeight/4)
        }
        else {
            ctx.drawImage(playerRight, 0-45, 0-45, this.spriteWidth/4-40, this.spriteHeight/4)
        }
        ctx.restore();
    }
}
const player = new Player();

const theimg = document.createElement('img');
theimg.src = 'img/space-man.png';


const enemyimg = document.createElement('img');
enemyimg.src = 'img/space-enemy.png';

//Bubbles
const bubblesArray = [];
class Bubble {

    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.radius = 18;
        this.speed = Math.random() * 2 + (level/5);
        this.counted = false;
        this.sound = 'sound1';
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.e = Math.floor((Math.random()*10));
    }

    update(){
        this.y += this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.drawImage(theimg, this.x-25, this.y-45, this.spriteWidth/4-40, this.spriteHeight/4+5)
        ctx.closePath();
        ctx.restore();
    }
}

//Enemy Bubbles
const enemybubblesArray = [];
class EnemyBubble {

    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 18;
        this.speed = Math.random() * 2 + level/5;
        this.counted = false;
        this.sound = 'sound1';
        this.spriteWidth = 498;
        this.spriteHeight = 327;
        this.e = Math.floor((Math.random()*10));
    }
    update(){
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.drawImage(enemyimg, this.x-25, this.y-45, this.spriteWidth/4-40, this.spriteHeight/4+5);
        ctx.closePath();
        ctx.restore();
    }
}

function handleBubbles(){

    if (gameFrame % (100) == 0){
        playerLeft.src = 'img/space-ship.png';
        playerRight.src = 'img/space-ship.png';
        bubblesArray.push(new Bubble());
    }
    for(let i = 0; i < bubblesArray.length; i++){
        bubblesArray[i].update(Player);
        bubblesArray[i].draw();

    }
    for(let i = 0; i < bubblesArray.length; i++){
        if(bubblesArray[i].x < 0 - bubblesArray[i].radius * 2){
            bubblesArray.splice(i, 1);
        }
        if(bubblesArray[i]){
            if(bubblesArray[i].distance < bubblesArray[i].radius + player.radius){
                if(!bubblesArray[i].counted){
                    const scifiGunShoot = document.createElement('audio');
                    scifiGunShoot.src = 'sounds/scifi-gun-shoot.mp3';
                    scifiGunShoot.volume = 0.6;
                    scifiGunShoot.load();
                    scifiGunShoot.play();
                    playerLeft.src = 'img/space-ship.png';
                    playerRight.src = 'img/space-ship.png';
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                    if(score % 5 == 0) {
                        level++;
                        templevel++;
                        enemySpeed += level;
                    }
                }
            }
        }
    }
}

function enemyhandleBubbles() {
    let numframe = 125-(5*level);
    if (gameFrame % (numframe) == 0){
        playerLeft.src = 'img/space-ship.png';
        playerRight.src = 'img/space-ship.png';
        enemybubblesArray.push(new EnemyBubble());
    }
    for(let j = 0; j < enemybubblesArray.length; j++){
        enemybubblesArray[j].update(Player)
        enemybubblesArray[j].draw();
        
    }
    for(let j = 0; j < enemybubblesArray.length; j++){
        if(enemybubblesArray[j].x < 0 - enemybubblesArray[j].radius * 2){
            enemybubblesArray.splice(j, 1);
        }

        if(enemybubblesArray[j]){
            if(enemybubblesArray[j].distance < enemybubblesArray[j].radius + player.radius){
                if(!enemybubblesArray[j].counted){
                    const scifiExplosion = document.createElement('audio'); 
                    scifiExplosion.src = 'sounds/sci-fi-explosion.mp3';
                    scifiExplosion.volume = 0.3;
                    scifiExplosion.load();
                    scifiExplosion.play();
                    playerLeft.src = 'img/space-ship.png';
                    playerRight.src = 'img/space-ship.png';
                    enemybubblesArray[j].counted = true;
                    enemybubblesArray.splice(j, 1);

                    if(countLives > 1) {
                        countLives--
                    } else {
                        gameOver();
                    }
                }
            }
        }
    }
}


//Animations 
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    enemyhandleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'white';
    ctx.font = '12px';
    ctx.fillText('Score: ' + score, 10, 25);
    gameFrame++;
    requestAnimationFrame(animate);
    
}

//Settle High Score
async function getX() {
    let b = [];
    var ref = db.collection("highscore").orderBy("highnum", "desc").limit(1);
    await ref.get().then(snapshot => {
            b = snapshot.docs.map(doc => doc.data().highnum);
    })
    return parseInt(b);
}

function getHighScore(hid) { 
    hid.innerHTML = `Highest Score = ${localStorage.getItem("high-score")}` 
}
getHighScore(hid);

function startGame(){
    hid.style.display = 'none';
    splash.style.display = 'none';
    endgameSong.pause();
    animate();
}

async function gameOver() {
    themeSong.pause();
    endgameSong.play();

    st.style.display = 'none';
    boredInSpace.innerHTML = "Game Over";
    statement.innerHTML = 'reloading...'
    splash.style.display = 'inline-block';
    hid.style.display = 'inline-block';
    canvas1.style.zIndex = '2';
    splash.style.zIndex = '3';

    let currentScore = score;
    finscore.innerHTML = 'Your Score: ' + currentScore;
    
    if(currentScore > localStorage.getItem("high-score")) {
        localStorage.setItem("high-score", currentScore)
    }

    setTimeout(() => {location.reload()}, 8000)
    
}