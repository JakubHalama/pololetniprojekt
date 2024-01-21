
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let rocketWidth = 44;
let rocketHeight = 34;
let rocketX = boardWidth/8;
let rocketY = boardHeight/2;

let rocket = {
    x : rocketX,
    y : rocketY,
    width : rocketWidth,
    height : rocketHeight
}

let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;


window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    rocketImg = new Image();
    rocketImg.src = "./raketa.png"; 
    rocketImg.onload = function(){
        context.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height); 
        if(detectCollision(rocket, pipe)) {
            gameOver = true;
        }
    }

    topPipeImg = new Image();
    topPipeImg.src = "./hornitrubka.png";

    bottomPipeImg = new Image();
   bottomPipeImg.src = "./dolnitrubka.png";

   requestAnimationFrame(update);
   setInterval(placePipes, 1500);
   document.addEventListener("keydown", moveRocket);
}
 function update() {
        requestAnimationFrame(update);
        if (gameOver) {
            return;
        }
        context.clearRect(0, 0, board.width, board.height);

        velocityY += gravity;
        rocket.y = Math.max(rocket.y + velocityY, 0);
        context.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);

        if(rocket.y > board.height) {
            gameOver = true;
        }

        for(let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)
           
            if(!pipe.passed && rocket.x > pipe.x + pipe.width) {
                score += 0.5;
                pipe.passed = true;
            }

            if (detectCollision(rocket, pipe)){
            gameOver = true;
       
            }

        }

        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }

        context.fillStyle = "white";
        context.font = "45px sans-serif";
        context.fillText(score, 5, 45);

        if (gameOver) {
            context.fillText("GAME OVER!", 5, 90);
        }

    }

    function placePipes(){
        if (gameOver) {
            return;
        }
        let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
        let openingSpace = board.height/4;

        let topPipe = {
            img : topPipeImg,
            x : pipeX,
            y : randomPipeY,
            width : pipeWidth,
            height : pipeHeight,
            passed : false
        }

        pipeArray.push(topPipe);

        let bottomPipe = {
            img : bottomPipeImg,
            x : pipeX,
            y : randomPipeY + pipeHeight + openingSpace,
            width : pipeWidth,
            height : pipeHeight,
            passed : false
        }
        pipeArray.push(bottomPipe);
    }

    function moveRocket(e) {
        if (e.code == "Space" || e.code == "Arrowup") {
            velocityY = -6;

            if (gameOver) {
                rocket.y = rocketY;
                pipeArray = [];
                score = 0;
                gameOver = false;
            }
        }
    }

    function detectCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y; 
    }