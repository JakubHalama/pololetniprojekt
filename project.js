let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

let rocketWidth = 44;
let rocketHeight = 34;
let rocketX = boardWidth/8;
let rocketY = boardHeight/2;

// Inicializace rakety
let rocket = {
    x : rocketX,
    y : rocketY,
    width : rocketWidth,
    height : rocketHeight
}

// Inicializace pole pro potrubí
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

let velocityX = -2; // Rychlost potrubí
let velocityY = 0; // Vertikální rychlost rakety
let gravity = 0.4; // Gravitace

let gameOver = false; // Indikátor konce hry
let score = 0; // Skóre

// Načtení obrazku pro raketu
let rocketImg;

window.onload = function() {
    // Inicializace herní plochy
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    // Načtení obrazku pro raketu
    rocketImg = new Image();
    rocketImg.src = "./raketa.png"; 
    rocketImg.onload = function(){
        context.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height); 
        if(detectCollision(rocket, pipe)) {
            gameOver = true;
        }
    }

    // Načtení obrazku pro horní a dolní část potrubí
    topPipeImg = new Image();
    topPipeImg.src = "./hornitrubka.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./dolnitrubka.png";

    // Spuštění herní smyčky
    requestAnimationFrame(update);
    
    // Umístění potrubí každých 1.5 sekundy
    setInterval(placePipes, 1500);
    
    // Naslouchání na stisknutí klávesy pro pohyb rakety
    document.addEventListener("keydown", moveRocket);
}

// Herní smyčka pro aktualizaci stavu hry
function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    // Vymazání herní plochy
    context.clearRect(0, 0, board.width, board.height);

    // Gravitace pro raketu
    velocityY += gravity;
    rocket.y = Math.max(rocket.y + velocityY, 0);
    context.drawImage(rocketImg, rocket.x, rocket.y, rocket.width, rocket.height);

    // Detekce, zda raketa přejela spodní hranu herní plochy
    if(rocket.y > board.height) {
        gameOver = true;
    }

    // Pohyb a vykreslení potrubí
    for(let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
       
        // Zvýšení skóre, pokud raketa přešla potrubí
        if(!pipe.passed && rocket.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        // Detekce kolize mezi raketou a potrubím
        if (detectCollision(rocket, pipe)){
            gameOver = true;
        }
    }

    // Odstranění potrubí, které už jsou mimo obrazovku
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // Vykreslení skóre na herní ploše
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);

    // Vypsání "GAME OVER!" v případě konce hry
    if (gameOver) {
        context.fillText("GAME OVER!", 5, 90);
    }
}

// Umístění nového potrubí
function placePipes(){
    if (gameOver) {
        return;
    }

    // Náhodná pozice pro horní část potrubí
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    // Inicializace horní části potrubí
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    // Přidání horní části potrubí do pole
    pipeArray.push(topPipe);

    // Inicializace dolní části potrubí
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    // Přidání dolní části potrubí do pole
    pipeArray.push(bottomPipe);
}

// Pohyb rakety při stisku klávesy
function moveRocket(e) {
    if (e.code == "Space" || e.code == "Arrowup") {
        velocityY = -6;

        // Resetování hry po stisku klávesy, pokud je hra skončena
        if (gameOver) {
            rocket.y = rocketY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

// Detekce kolize mezi dvěma obdélníky
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y; 
}
