var player;
var bullet;
var bullet, bulletGroup;
var enemy, enemyGroup;
var area;
var health = 100;
var healthbar;
var score = 0;
var gamestate = "start";
var shootingSound;
var boomSound;
var gameover_image;
var player_image;
var enemy_image;
var ground_image;
var ground2_image;
var bullet_image;
var reset, reset_image;

function preload(){
  shootingSound = loadSound("shooting.mp3");
  boomSound = loadSound("boom.mp3");
  gameover_image = loadImage("gameover.png");
  player_image = loadImage("tank.png");
  enemy_image = loadImage("enemy.png");
  ground_image = loadImage("ground.png");
  ground2_image = loadImage("ground2.png");
  bullet_image = loadImage("bullet.png");
  reset_image = loadImage("reload.png");
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  healthbar = createSprite(windowWidth/2 + 100, 40, 100, 10);
  healthbar.shapeColor = "blue";
  
  area = createSprite(windowWidth/2, windowHeight/2, 120, 120);
  area.shapeColor = "green";
  area.addImage(ground_image);
  
  player = createSprite(windowWidth/2, windowHeight/2, 16, 16);
  player.shapeColor = "blue";
  player.addImage(player_image);
  player.scale = 0.06;
  
  enemyGroup = new Group();
  bulletGroup = new Group();

  reset = createSprite(windowWidth/2, windowHeight/6, 40, 40);
  reset.addImage(reset_image);
}

function draw() {
  if(gamestate === "start"){
    background("white");
    textSize(18);
    fill("black");
    stroke("black");
    text("Press 'space' to start the game", windowWidth/2 - 200, windowHeight/2 - 200);
    textSize(40);
    text("Rules :", windowWidth/6, windowHeight/2 - 100);
    textSize(18);
    text("1. If enemy enters the green area then player's health loses.", windowWidth/7, windowHeight/2 - 50);
    text("2. Rotate player using left and right arrows.", windowWidth/7, windowHeight/2);
    text("3. Use 'SPACE' to shoot.", windowWidth/7, windowHeight/2 + 50);
    text("4. If health becomes 0, you lose.", windowWidth/7, windowHeight/2 + 100);
    text("5. If you press 'SPACE' more than once then enemy won't be destroyed", windowWidth/7, windowHeight/2 + 150);

    if(keyDown('space') || touches.length > 0){
      gamestate = "play";
      touches = []
    }
  }
  else if(gamestate === "play"){
    player.visible = true;
    area.visible = true;
    reset.visible = false;
  
    background("grey");
    image(ground2_image, 0, 0, windowWidth, windowHeight);

    if(keyDown(LEFT_ARROW)){
      player.rotation = player.rotation - 4;
      player.rotateToDirection = true;
    }

    if(keyDown(RIGHT_ARROW)){
      player.rotation = player.rotation + 4;
      player.rotateToDirection = true;
    }

    if(keyDown("space")){
      bullet = createSprite(player.x, player.y, 5, 10);
      bullet.shapeColor = "red";
      bullet.setSpeedAndDirection(8, player.rotation - 90);
      bullet.rotation = player.rotation - 90;
      bullet.lifeTime = 100;
      bullet.addImage(bullet_image);
      bullet.scale = 0.2;
      bulletGroup.add(bullet);
      shootingSound.play();
    }

    if(frameCount % 200 - score === 0){
      var select = Math.round(random(1, 4));
      switch(select){
        case 1: enemy = createSprite(Math.round(random(player.x - 250 + 0, player.x - 250 + 100)), Math.round(random(player.y -250 + 0, player.y -250 + 200)), 18, 18);
        enemy.shapeColor = "yellow";
        enemy.setVelocity(2, 1.5);
        enemy.rotation = -135;
        enemy.lifeTime = 100;
        enemy.addImage(enemy_image);
        enemy.scale = 0.04;
        enemyGroup.add(enemy);
        break;
        case 2: enemy = createSprite(Math.round(random(player.x -250 + 0, player.x -250 + 100)), Math.round(random(player.y - 250 + 300, player.y - 250 + 500)), 18, 18);
        enemy.shapeColor = "yellow";
        enemy.setVelocity(2, -1.5);
        enemy.rotation = 135;
        enemy.lifeTime = 100;
        enemy.addImage(enemy_image);
        enemy.scale = 0.04;
        enemyGroup.add(enemy);
        break;
        case 3: enemy = createSprite(Math.round(random(player.x -250 + 400, player.x - 250 + 500)), Math.round(random(player.y -250 + 0, player.y - 250 + 200)), 18, 18);
        enemy.shapeColor = "yellow";
        enemy.setVelocity(-2, 1.5);
        enemy.rotation = -45;
        enemy.lifeTime = 100;
        enemy.addImage(enemy_image);
        enemy.scale = 0.04;
        enemyGroup.add(enemy);
        break;
        case 4: enemy = createSprite(Math.round(random(player.x -250 + 400, player.x - 250 + 500)), Math.round(random(player.y -250 + 300, player.y - 250 + 500)), 18, 18);
        enemy.shapeColor = "yellow";
        enemy.setVelocity(-2, -1.5);
        enemy.rotation = 45;
        enemy.lifeTime = 100;
        enemy.addImage(enemy_image);
        enemy.scale = 0.04;
        enemyGroup.add(enemy);
        break;
      }
    }

    for(var i = 0; i <= enemyGroup.length; i++){
      if(bullet){
      if(bullet.isTouching(enemyGroup)){
        enemyGroup.destroyEach();
        bulletGroup.destroyEach();
        score = score + 1;
        boomSound.play();
      }
    }
    }

    if(enemyGroup.isTouching(area)){
      health = health - 0.4;
      healthbar.width = health;
      healthbar.x = windowWidth/2 + 50 + health/2;
    }

    if(health <= 0){
      health = 0;
      gamestate = "end";
    }
    console.log(Math.round(health));

    drawSprites();

    textSize(20);
    fill("black");
    stroke("black");
    text("Score : " + score, windowWidth/2 + 100 - 125, healthbar.y + 35);
    text("Health: ", windowWidth/2 + 100 - 125, healthbar.y + 5)
  }
  else if(gamestate === "end"){
    player.visible = false;
    enemyGroup.destroyEach();
    area.visible = false;
    background("black");
    image(gameover_image, 0, 0, windowWidth, windowHeight);
    reset.visible = true;
    drawSprites();
    if(mousePressedOver(reset)){
      gamestate = "start";
      health = 100;
      healthbar.width=health;
      healthbar.x = windowWidth/2 + 50 + health/2;
      score = 0;
    }
  }
}