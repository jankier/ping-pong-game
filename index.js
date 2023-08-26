const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const ctxText = dynamicText.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const stopBtn = document.querySelector("#stopBtn");
const resumeBtn = document.querySelector("#resumeBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackgroud = "forestgreen";
const paddle1Color = "lightblue";
const paddle2Color = "red";
const paddleBorder = "black";
const ballColor = "yellow";
const ballBorderColor = "black";
const ballRadius = 12.5;
const paddleSpeed = 3;

let running = false;
let intervalID;
let ballSpeed = 1;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
}
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
}
let paddleYDirection = 0;
let currentSpeed1 = 0;
let currentSpeed2 = 0;

window.addEventListener("keydown", function(e) { setSpeed(e, true)});
window.addEventListener("keyup", function(e) { setSpeed(e, false)});
resetBtn.addEventListener("click", resetGame);
stopBtn.addEventListener("click", stopGame);
resumeBtn.addEventListener("click", resumeGame);

gameStart();

function gameStart(){
    running = true;
    createBall();
    nextTick();
}
function nextTick(){
    if(running  || resumeGame){
        intervalID = setTimeout(() => {
            clearBoard();
            moveBall();
            movePaddles();
            drawPaddles();
            drawBall(ballX, ballY);
            checkCollision();
            nextTick();
        }, 10)
    }
}
function clearBoard(){
    ctx.fillStyle = boardBackgroud;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function drawPaddles(){
    ctx.strokeStyle = paddleBorder;
    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}
function createBall(){
    ballSpeed = 2;
    if(Math.round(Math.random()) == 1){
        ballXDirection = 1;
    }
    else{
        ballXDirection = -1;
    }
    if(Math.round(Math.random()) == 1){
        ballYDirection = 1;
    }
    else{
        ballYDirection = -1;
    }
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    drawBall(ballX, ballY);
}
function moveBall(){
    ballX += (ballSpeed * ballXDirection);
    ballY += (ballSpeed * ballYDirection);
}
function drawBall(ballX, ballY){
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}
function checkCollision(){
    if(ballY <= 0 + ballRadius){
        ballYDirection *= -1;
    }
    if(ballY >= gameHeight - ballRadius){
        ballYDirection *= -1;
    }
    if(ballX <= 0 + ballRadius){
        player2Score += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX >= gameWidth - ballRadius){
        player1Score += 1;
        updateScore();
        createBall();
        return;
    }
    if(ballX <= (paddle1.x + paddle1.width + ballRadius)){
        if(ballY > paddle1.y && ballY < paddle1.y + paddle1.height){
            ballX = (paddle1.x + paddle1.width + ballRadius);
            ballXDirection *= -1;
            ballSpeedMax();
        }
    }
    if(ballX >= (paddle2.x - ballRadius)){
        if(ballY > paddle2.y && ballY < paddle2.y + paddle2.height){
            ballX = (paddle2.x - ballRadius);
            ballXDirection *= -1;
            ballSpeedMax();
        }
    }
}
function ballSpeedMax(){
    if(Math.round(ballSpeed) >= 4){
        ballSpeed = 4;
        return;
    }
    else{
        ballSpeed += 0.2;
        console.log(ballSpeed);
        return;
    }
}
function setSpeed(event, isDown){
    const keyPressed = event.keyCode;
    const paddle1Up = 87;
    const paddle1Down = 83;
    const paddle2Up = 38;
    const paddle2Down = 40;
    const targetSpeed = isDown ? paddleSpeed : 0;

    switch(keyPressed){
        case(paddle1Up):
            currentSpeed1 =-targetSpeed;  
            break;
        case(paddle1Down):
            currentSpeed1 =targetSpeed;
            break;
            case(paddle2Up):
                currentSpeed2 =-targetSpeed;
            break;
        case(paddle2Down):
                currentSpeed2 =targetSpeed;
            break;   
    }
}
function movePaddles(){
    paddle1.y += currentSpeed1;
    paddle2.y += currentSpeed2;
    if(paddle1.y < 0){
        paddle1.y = 0;
    }
    else if(paddle1.y > gameHeight - paddle1.height){
        paddle1.y = gameHeight - paddle1.height;
    }
    if(paddle2.y < 0){
        paddle2.y = 0;
    }
    else if(paddle2.y > gameHeight - paddle2.height){
        paddle2.y = gameHeight - paddle2.height;
    }
}
function updateScore(){
    scoreText.textContent = `${player1Score} : ${player2Score}`
}
function stopGame(){
    ctxText.font = "50px Verdana";
    ctxText.fillStyle = "white";
    ctxText.textAlign = "center";
    ctxText.fillText("GAME STOPPED", gameWidth / 2, gameHeight / 2);
    clearInterval(intervalID);
    running = false;
}
function resumeGame(){
    if(!running){
        function countDown(){
            let waitTime = 3;
            let countDownInterval = window.setInterval(() => {
                ctxText.clearRect(0, 0, gameWidth, gameHeight);
                ctxText.fillText(`${waitTime}`, gameWidth / 2, gameHeight / 2); 
                waitTime --;
                if(waitTime < 0){
                    ctxText.clearRect(0, 0, gameWidth, gameHeight);
                    clearInterval(countDownInterval);
                    nextTick();
                }
            }, 1000);
        }
        countDown();
    }
    else{
        return;
    }
}
function resetGame(){
    player1Score = 0;
    player2Score = 0;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    }
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    }
    ballSpeed = 1;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    ctxText.clearRect(0, 0, gameWidth, gameHeight);
    updateScore();
    clearInterval(intervalID);
    gameStart();
}