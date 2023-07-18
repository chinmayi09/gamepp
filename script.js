import Ball from './Ball.js'
import Paddle from './Paddle.js'

const ball = new Ball(document.getElementById("ball"))
const playerPaddle = new Paddle(document.getElementById("player-paddle"))
const computerPaddle = new Paddle(document.getElementById("computer-paddle"))
const playerScoreElem = document.getElementById("player-score")
const computerScoreElem = document.getElementById("computer-score")
let lastTime
function update(time){

    if (lastTime!=null) {
        const delta = time - lastTime
        //Update lopp
        ball.update(delta, [playerPaddle.rect(), computerPaddle.rect()])
        // movement in game is known
        computerPaddle.update(delta, ball.y)

        const hue = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hue"))
      
        document.documentElement.style.setProperty("--hue", hue + delta * 0.01)

        if(isLose()) handleLose()
    }
    
    lastTime = time
    window.requestAnimationFrame(update)
    //loop
}
function isLose() {
    const rect = ball.rect()
    return rect.right >= window.innerWidth || rect.left <= 0
}
  
function handleLose() {
    const rect = ball.rect()
    //ball meets right screen player wins
    if (rect.right >= window.innerWidth) {
        playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1
    } 
    else {
        //ball meets left screen computer wins  
        computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1
    }
    ball.reset()
    computerPaddle.reset()
}

document.addEventListener("mousemove", e=>{
    playerPaddle.position= (e.y /window.innerHeight) * 100
})

const touchPoints = {}; // Object to keep track of touch points

document.addEventListener("touchmove", e => {
    // Prevent the default behavior of touch events to avoid scrolling or other unwanted behaviors.
    e.preventDefault();
    
    // Loop through all touch points and update their positions
    for (const touch of e.touches) {
        const touchId = touch.identifier; // Each touch is identified by a unique identifier
        touchPoints[touchId] = (touch.clientY / window.innerHeight) * 100;
    }
});

document.addEventListener("touchend", e => {
    // When a touch ends, remove the corresponding touch point from the object
    for (const touch of e.changedTouches) {
        const touchId = touch.identifier;
        delete touchPoints[touchId];
    }
});

// Update the playerPaddle position based on the last touch point's position
function updatePaddlePosition() {
    const touchIds = Object.keys(touchPoints);
    if (touchIds.length > 0) {
        const lastTouchId = touchIds[touchIds.length - 1];
        playerPaddle.position = touchPoints[lastTouchId];
    }
    requestAnimationFrame(updatePaddlePosition);
}

// Call the function to start updating the playerPaddle position
updatePaddlePosition();


window.requestAnimationFrame(update)