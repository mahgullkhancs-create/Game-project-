/*
Final game project 8
- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/

*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var isLeft;
var isRight;
var isPlummeting;
var isFalling;
var collectables;
var canyons;
var treePos_x;
var treePos_y;
var clouds;
var mountains;
var cameraPosx;
var platforms;
var enemies;
var game_score =0;
var flagpole;
var lives;
var jumpSound;
var backgroundSound;
var stars = [];

class Star {
    constructor() {
        this.x = random(width); // Random x position
        this.y = random(height); // Random y position
        this.size = random(1, 3); // Random size for the star
        this.speed = random(1, 3); // Random speed for the star
    }
    update() {
        // Move the star horizontally
        this.x += this.speed;
        // Reset star's position if it goes off-screen
        if (this.x > width) {
            this.x = 0; // Start from the left side of the canvas
            this.y = random(height); // Randomize y position within the canvas
        }
    }
    display() {
        // Draw star as a small white ellipse
        fill(255, 255, 255);
        noStroke();
        this.size = random(1, 3) * 2;
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function preload() {
    soundFormats('mp3','wav');
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    backgroundSound = loadSound('assets/backgroundsound.wav')
    backgroundSound.setVolume(0.1);
}

function setup() {
	createCanvas(1024, 576);
    floorPos_y = height * 3/4;
    lives = 3;
    for(let i = 0; i< 50; i++){
        stars.push(new Star());
    }
    startGame()
    BackgroundSound();
}

function startGame() {
    gameChar_x = width/2;
    gameChar_y = floorPos_y;
    isLeft = false;
    isRight = false;
    isPlummeting = false;
    isFalling = false;
    clouds = [
        {Pos_x: -100, Pos_y: 110, size:60},
        {Pos_x: 150, Pos_y: 80, size:60},
        {Pos_x: 400, Pos_y: 110, size:60},
        {Pos_x: 650, Pos_y: 70, size:60},
        {Pos_x: 900, Pos_y: 130, size:60},
        {Pos_x: 1150, Pos_y: 80, size:60},
        {Pos_x: 1400, Pos_y: 110, size:60},
        {Pos_x:1650, Pos_y: 70, size:60},
    ]
    mountains = [
        {Pos_x: -154, Pos_y: 400},
        {Pos_x: 444, Pos_y: 400},
        {Pos_x: 894, Pos_y: 400},
        {Pos_x: 1374, Pos_y: 400},
    ]
    collectables = [
        { x_pos: 150, y_pos: 260, size: 40, isFound: false },
        { x_pos: 400, y_pos: 350, size: 40, isFound: false },
        { x_pos: 600, y_pos: 350, size: 40, isFound: false },
        { x_pos: 870, y_pos: 260, size: 40, isFound: false },
        { x_pos: 1400, y_pos: 350, size: 40, isFound: false },
    ];
    canyons = [
        { x_pos: 300, width: 100 },
        { x_pos: 600, width: 100 },
        { x_pos: 900, width: 100 },
        { x_pos: 1200, width: 100 },
    ];
    treePos_x = [-90,210,720,1155,1555]
    treePos_y = floorPos_y;
    cameraPosx = 0;
    platforms = [];
    platforms.push(createPlatforms(100, floorPos_y - 100, 100));
    platforms.push(createPlatforms(720, floorPos_y - 100, 200));
    enemies = [];
    enemies.push(new Enemy(100, floorPos_y - 10, 100));
    enemies.push(new Enemy(1000, floorPos_y - 10, 100));
    game_score = 0;
    flagpole = {Pos_x: 1500, isReached: false}
}

function draw() {
    background(0);
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].display();
    }
    ///////////DRAWING CODE//////////
    //code for moving camera
    cameraPosx = gameChar_x - width/2
    // Draw the moon
    fill(238,232,170);
    ellipse(100, 100, 80, 80);
    //draw some green ground
    noStroke();
    fill(0, 165, 0);
    rect(0, floorPos_y, width, height - floorPos_y);
    //push and translate function (camera)
    push();
    translate(-cameraPosx, 0);
    //for loop for drawing clouds
    drawClouds();
    //for loop for drawing mountains
    drawMountains();
    //for loop for drawing trees
    drawTrees();
    for(var i = 0; i < platforms.length; i++) {
        platforms[i].draw();
    }
    //draw collectable item
    for (var i = 0; i < collectables.length; i++) {
        if (collectables[i].isFound == false) {
            checkCollectable(collectables[i]);
            drawCollectable(collectables[i]);
        }
    }
    //draw the canyon
    for (var i = 0; i < canyons.length; i++) {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }
    //the game character
    stroke(0);
    if(isLeft && isFalling) {
        // add your jumping-left code
        //jumping left
        //draw face
        fill(255, 222, 173);
        ellipse(gameChar_x - 3, gameChar_y - 67, 13, 13);
        // Draw body (adjusting position for walking left)
        fill(139, 0, 139);
        rect(gameChar_x - 8, gameChar_y - 60, 10, 30);
        // Draw legs (adjusting position for walking left)
        fill(0,0,128);
        rect(gameChar_x - 7, gameChar_y - 20, 8, 13);
        // Draw arms
        fill(255, 222, 173);
        rect(gameChar_x -18, gameChar_y - 58, 16, 5);
    }
    else if(isRight && isFalling) {
        // add your jumping-right code
        //jumping right
        //draw face
        fill(255, 222, 173);
        ellipse(gameChar_x - 3, gameChar_y - 66, 13, 13);
        // Draw body (adjusting position for walking left)
        fill(139, 0, 139);
        rect(gameChar_x - 8, gameChar_y - 60, 10, 30);
        // Draw legs (adjusting position for walking left)
        fill(0,0,128);
        rect(gameChar_x - 7, gameChar_y - 20, 8, 13);
        // Draw arms
        fill(255, 222, 173);
        rect(gameChar_x -4, gameChar_y - 58, 16, 5);
    }
    else if(isLeft) {
        // add your walking left code
        //walking left
        //draw face
        fill(255, 222, 173);
        ellipse(gameChar_x - 3, gameChar_y - 56, 13, 13);
        // Draw body (adjusting position for walking left)
        fill(139, 0, 139);
        rect(gameChar_x - 11, gameChar_y - 50, 15, 30);
        rect(gameChar_x - 11, gameChar_y - 50, 15, 30);
        // Draw legs (adjusting position for walking left)
        fill(0,0,128);
        rect(gameChar_x - 11, gameChar_y - 20, 5, 19);
        rect(gameChar_x - 11, gameChar_y - 20, 18, 5);
        // Draw arms
        fill(255, 222, 173);
        rect(gameChar_x -2, gameChar_y - 47, 6, 20);
    }
    else if(isRight) {
        // add your walking right code
        //walking right
        //draw face
        fill(255, 222, 173);
        ellipse(gameChar_x - 3, gameChar_y - 56, 13, 13);
        // Draw body (adjusting position for walking left)
        fill(139, 0, 139);
        rect(gameChar_x - 11, gameChar_y - 50, 15, 30);
        // Draw legs (adjusting position for walking left)
        fill(0,0,128);
        rect(gameChar_x - 1, gameChar_y - 20, 5, 19);
        rect(gameChar_x - 18, gameChar_y - 20, 18, 5);
        // Draw arms
        fill(255, 222, 173);
        rect(gameChar_x -11, gameChar_y - 47, 6, 20);
    }
    else if(isFalling || isPlummeting) {
        // add your jumping facing forwards code
        //jumping facing forwards
        //draw face
        fill(255, 222, 173);
        ellipse(gameChar_x - 1, gameChar_y - 66, 13, 13);
        // Draw body (adjusting position for jumping)
        fill(139, 0, 139);
        rect(gameChar_x - 10, gameChar_y - 60, 18, 30);
        // Draw legs (adjusting position for jumping)
        fill(0,0,128);
        rect(gameChar_x - 14, gameChar_y - 20, 26, 9);
        // Draw arms
        fill(255, 222, 173);
        rect(gameChar_x - 20, gameChar_y - 60, 10, 5);
        rect(gameChar_x + 8, gameChar_y - 60, 10, 5);
    }
    else {
        // add your standing front facing code
        //draw face
        fill(255,222,173);
        ellipse(gameChar_x - 1, gameChar_y - 56, 13, 13);
        //draw body
        fill(139,0,139)
        rect(gameChar_x - 10, gameChar_y - 50, 18, 30);
        //draw legs
        fill(0,0,128);
        rect(gameChar_x - 7, gameChar_y - 20, 12, 19);
        //draw arms
        fill(255,222,173);
        rect(gameChar_x - 15, gameChar_y - 50, 5, 20);
        rect(gameChar_x + 8, gameChar_y - 50, 5, 20);
    }
    renderFlagpole();
    checkFlagpole();
    checkPlayerDie();
    fill(220,20,60);
    noStroke();
    textSize(20);
    text("score " + game_score, gameChar_x-490, 30);
    fill(220,20,60);
    noStroke();
    textSize(20);
    text("lives:", gameChar_x - 490, 60);
    for(let i=1; i<=lives; i++) {
        fill(255,0,0);
        ellipse(gameChar_x -440 + i * 30 , 52, 25, 25);
    }
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
        var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
        if (isContact){
            if (lives > 0){
                lives -= 1;
                startGame();
                break;
            }
        }
    }
    //pop function
    pop()
    if (lives < 1){
        text("game over. Press space to continue.", width/4, height/2);
        return;
    }
    if (flagpole.isReached){
        text("level complete. Press space to continue.", width/4, height/2);
        return;
    }
    ///////////INTERACTION CODE//////////
    //Put conditional statements to move the game character below here
    if(isLeft == true) {
        gameChar_x -= 5;
    }
    if(isRight == true) {
        gameChar_x += 5;
    }
    if (gameChar_y < floorPos_y) {
        var isContact = false;
        for(var i = 0; i < platforms.length; i++) {
            if(platforms[i].checkContact(gameChar_x, gameChar_y) == true) {
                isContact = true;
                break;
            }
        }
        if(isContact == false) {
            gameChar_y += 2;
            isFalling = true;
        }
    }
    else {
        isFalling = false;
    }
}

function keyPressed() {
    // if statements to control the animation of the character when
    // keys are pressed.
    //open up the console to see how these work
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);
    if (isPlummeting == false) {
        if (keyCode == 37) {
            console.log("left arrow");
            isLeft = true;
        }
        else if (keyCode == 39) {
            console.log("right arrow");
            isRight = true;
        }
        if (keyCode == 38 && isFalling == false) {
            gameChar_y -= 140;
            jumpSound.play();
        }
    }
}

function keyReleased() {
    console.log("keyReleased: " + key);
    console.log("keyReleased: " + keyCode);
    if(keyCode == 37) {
        console.log("left arrow");
        isLeft = false;
    }
    else if (keyCode == 39) {
        console.log("right arrow")
        isRight = false;
    }
}

function drawClouds() {
    for(var i=0; i<clouds.length;i++) {
        fill(255,255,255);
        fill(255);
        ellipse(clouds[i].Pos_x,clouds[i].Pos_y,clouds[i].size + 10,clouds[i].size);
        ellipse(clouds[i].Pos_x,clouds[i].Pos_y,clouds[i].size + 10,clouds[i].size);
        ellipse(clouds[i].Pos_x + 50,clouds[i].Pos_y,clouds[i].size + 10,clouds[i].size + 20);
        ellipse(clouds[i].Pos_x + 90,clouds[i].Pos_y,clouds[i].size + 10,clouds[i].size);
    }
}

function  drawMountains() {
    for(var i=0; i<mountains.length;i++) {
        fill(112,128,144);
        triangle(mountains[i].Pos_x + 50,mountains[i].Pos_y + 32,
            mountains[i].Pos_x + 280,mountains[i].Pos_y + 32,
            mountains[i].Pos_x + 170,mountains[i].Pos_y - 180);
        fill(176,196,222);
        triangle(mountains[i].Pos_x - 50,mountains[i].Pos_y + 32,
            mountains[i].Pos_x + 150,mountains[i].Pos_y + 32,
            mountains[i].Pos_x + 60,mountains[i].Pos_y - 130);
        fill(230,230,250);
        triangle(mountains[i].Pos_x + 20,mountains[i].Pos_y - 70,
            mountains[i].Pos_x + 93,mountains[i].Pos_y - 70,
            mountains[i].Pos_x + 60,mountains[i].Pos_y - 130);
        fill(119,136,153);
        triangle(mountains[i].Pos_x + 130,mountains[i].Pos_y - 110,
            mountains[i].Pos_x + 206,mountains[i].Pos_y - 112,
            mountains[i].Pos_x + 170,mountains[i].Pos_y - 180);
    }
}

function drawTrees() {
    for(var i=0; i<treePos_x.length ; i++) {
        console.log("trees loop" + i);
        // draw tree bark
        fill(160,82,45);
        rect(treePos_x[i],treePos_y - 110,40,111);
        //branches
        fill(50,205,50);
        ellipse(treePos_x[i] + 20,treePos_y - 157,140,135);
        fill(255, 255, 0);
        ellipse(treePos_x[i] + 55, treePos_y - 170, 17, 17 )//middle apple
        ellipse(treePos_x[i] + 33, treePos_y - 110, 17, 17 )//last apple
        ellipse(treePos_x[i] + 10, treePos_y - 190, 17, 17 ) //top apple
        ellipse(treePos_x[i] - 10, treePos_y - 150, 17, 17 )
        ellipse(treePos_x[i] + 20, treePos_y - 140, 17, 17 )
    }
}

function drawCollectable(t_collectable) {
    if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos + 50) < 50){
        t_collectable.isFound = true;
        game_score += 1;
    }
    else if(t_collectable.isFound == false){
        fill(255,215,0);
         ellipse(t_collectable.x_pos, t_collectable.y_pos + 50, t_collectable.size);
         fill(255,0,255)
         ellipse(t_collectable.x_pos, t_collectable.y_pos + 50, t_collectable.size - 5);
         fill(255,255,0)
        rect(t_collectable.x_pos - 10, t_collectable.y_pos + 50, 20, 2)
        rect(t_collectable.x_pos -1 , t_collectable.y_pos + 42, 2, 20)

    }
}
function drawCanyon(t_canyon) {

    fill(184,134,11) //dark shade
    rect(t_canyon.x_pos, 432, t_canyon.width, 200);
    fill(218,165,32);//lighter
    rect(t_canyon.x_pos, 432, t_canyon.width, 100);
    fill(255,215,0)//lightest
    rect(t_canyon.x_pos, 432, t_canyon.width, 40);
    fill(184,134,11)
    triangle(t_canyon.x_pos + t_canyon.width / 2, 450 - 10, // Top point
        t_canyon.x_pos, 536 + 40, // Bottom-left point
        t_canyon.x_pos + t_canyon.width, 536 + 40); // Bottom-right point
}

function checkCollectable(t_collectable) {
    if (dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 30) {
        console.log("Collectable Found");
        t_collectable.isFound = true;
        game_score += 1;
    }
}

function checkCanyon(t_canyon) {
    if (gameChar_x > t_canyon.x_pos && gameChar_x < (t_canyon.x_pos + t_canyon.width) && gameChar_y >= floorPos_y) {
        console.log("isPlummeting");
        isPlummeting = true;
    } else {
        isPlummeting = false;
    }
    if (isPlummeting == true) {
        gameChar_y = gameChar_y + 10;
        gameChar_x = t_canyon.x_pos + 50;
    }
}

function renderFlagpole() {
    push();
    strokeWeight(4);
    stroke(0);
    line(flagpole.Pos_x, floorPos_y, flagpole.Pos_x, floorPos_y - 250);
    fill(255, 0, 0);
    noStroke();
    if (flagpole.isReached) {
        rect(flagpole.Pos_x,floorPos_y-250,50,50);
    }
    else {
        rect(flagpole.Pos_x,floorPos_y-50,50,50);
    }
    pop();
}

function checkFlagpole() {
    var d = abs(gameChar_x - flagpole.Pos_x)
    if (d < 15) {
        flagpole.isReached = true;
    }
}

function checkPlayerDie() {
    if (gameChar_y > height) {
        lives -= 1
        if (lives != 0) {
            startGame();
        }
    }
}

function createPlatforms(x, y, length) {
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function(){
            fill(255,20,147);
            rect(this.x, this.y, this.length, 20);
            },
        checkContact: function(gc_x, gc_y) {
            if(gc_x > this.x  && gc_x < this.x + this.length) {
                var d = this.y - gc_y;
                if(d >= 0 && d < 5) {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range){
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x;
    this.inc = 1;
    this.update = function (){
        this.currentX += this.inc;
        if(this.currentX >= this.x + this.range ) {
            this.inc = -1;
        }
        else if(this.currentX < this.x) {
            this.inc = 1;
        }
    }
    this.draw = function(){
        this.update();{
            fill(255, 0, 0)
            ellipse(this.currentX, this.y, 35, 35);
            fill(0, 0, 0)
            triangle(this.currentX - 10, this.y - 15 + 3, this.currentX, this.y - 19 + 3, this.currentX - 5, this.y - 30 + 3);
            triangle(this.currentX + 10, this.y - 15 + 3, this.currentX, this.y - 19 + 3, this.currentX + 5, this.y - 30 + 3);
            arc(this.currentX, this.y, 20, 20, 0, PI);
            rect(this.currentX - 8, this.y - 7, 7, 5)
            rect(this.currentX + 3, this.y - 7, 7, 5)
            rect(this.currentX - 2, this.y - 5, 19, 1) //stem for glasses
            rect(this.currentX - 17, this.y - 5, 20, 1)
            fill(255, 255, 255)
            triangle(this.currentX + 7, this.y - 0, this.currentX + 3, this.y - 0, this.currentX + 5, this.y + 10);
            triangle(this.currentX + 2, this.y, this.currentX - 3, this.y, this.currentX - 1, this.y + 10);
        }
    }
    this.checkContact = function(gc_x, gc_y){
        var d = dist(gc_x, gc_y, this.currentX, this.y)
        if(d < 20) {
            return true;
        }
        return false;
    }
}

function BackgroundSound() {
    backgroundSound.play()
    backgroundSound.loop()
}

