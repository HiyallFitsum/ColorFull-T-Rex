
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex;
var ground;

var cloudsGroup, cloudImage;
var obstaclesGroup;

var score;

function preload(){

  trexImage = loadImage("T-Rex.png");
  
  desertImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  gameOverImage = loadImage("GameOver.png");
  
  restartImage = loadImage("restart.png");
  
  sunImage = loadImage("Sun.png");
  
  obstacleImage1 = loadImage("obstacle1.png");
  obstacleImage2 = loadImage("obstacle2.png");
  
  jumpSound = loadSound("jump.wav");
  
  collideSound = loadSound("collided.wav");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
 console.log(message)
  
  ground = createSprite(windowWidth/2, windowHeight,windowWidth, 20);
  ground.x = width/2
  //ground.velocityX = -(6 + 3*score/100);
  ground.addImage(desertImage);
  //ground.scale = 0.5;
  
   trex = createSprite(50,windowHeight - 100,80,80);
  trex.shapeColor = "red";
  trex.addImage(trexImage);
  trex.scale = 0.1;
  
  gameOver = createSprite(windowWidth/2,windowHeight - 400);
gameOver.addImage(gameOverImage);
gameOver.scale = 0.5;
  
  restart = createSprite(windowWidth/2,windowHeight - 250);
  restart.addImage( restartImage);
  restart.scale = 0.1;
  
  invisibleGround = createSprite(windowWidth/2,windowHeight - 0,windowWidth*2,160);
  invisibleGround.visible = false;
  
  sun = createSprite(windowWidth - 200, windowHeight - 500, 50, 50);
  sun.addImage(sunImage);
  sun.scale = 0.2;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  
  score = 0;
  
}

function draw() {
  
  background("orange");
  //displaying score
  text("Score: "+ score, windowWidth - 100,50);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 && trex.y >= windowHeight - 120 || keyDown("space")&& trex.y >= windowHeight - 120)) {
         jumpSound.play();
        trex.velocityY = -12;
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        collideSound.play();
        gameState = END;  
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
    
     if(touches.length > 0 || keyDown("space") || mousePressedOver(restart)) {
      reset();
    }
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);  
   }
 
  //obstaclesGroup.setImageEach(cloudImage);
 
  //stop trex from falling down
  trex.collide(invisibleGround);

  drawSprites();
}

function reset(){
gameState = PLAY;
gameOver.visible = false;
restart.visible = false;
obstaclesGroup.destroyEach();
cloudsGroup.destroyEach();
//trex.changeAnimation("running", trex_running);
score = 0;
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(windowWidth,windowHeight - 95,10,40);
   obstacle.velocityX = -(4 + score/100);
    obstacle.lifetime = 300;
   obstacle.setCollider('circle',0,0,50)
   
   var rand = Math.round(random(1,2));
   switch(rand){
       case 1: obstacle.addImage(obstacleImage1);
              break;
       case 2: obstacle.addImage(obstacleImage2);
              break;
      default: break;
       }
   
   //assign scale and lifetime to the obstacle  
   obstacle.scale = 0.3;
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    //cloud.scale = 0.15;
    cloud.y = Math.round(random(windowHeight - 220,windowHeight - 180));
    cloud.velocityX = -3;
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
 }