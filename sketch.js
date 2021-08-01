//Create variables here
var dog,dog1,dog2;
var database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var garden,bedroom,washroom;
var gameState,readState;


function preload()
{
	//load images here
  dog1 = loadImage("Images/dogImg.png");
  dog2 = loadImage("Images/dogImg1.png");
  garden = loadImage("Images/Garden.png");
  bedroom = loadImage("Images/Bed Room.png");
  washroom = loadImage("Images/Wash Room.png");
}

function setup() {
  database = firebase.database();
	createCanvas(1000, 500);

  dog = createSprite(250,300,150,150);
  dog.addImage(dog1);
  dog.scale = 0.2;

  foodStock = database.ref("food");
  foodStock.on("value",readStock);

  foodObj = new Food();

  feed = createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  fedTime = database.ref("feedtime");
 fedTime.on("value",function(data){
   lastFed = data.val();
 })

 readState = database.ref("gameState");
 readState.on("value",function(data){
   gameState = data.val();
 })
}


function draw() { 

  currentTime = hour();
  if(currentTime == (lastFed+1)){
    update("playing");
    foodObj.garden();
  }
  else if(currentTime == (lastFed+2)){
    update("sleeping");
    foodObj.bedroom();
  }
  else if(currentTime > (lastFed+2) && currentTime<=(lastFed+4)){
    update("bathing");
    foodObj.washroom();
  }
  else{
    update("Hungry");
    foodObj.display();
  }
  if(gameState!="Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }else{
   feed.show();
   addFood.show();
   dog.addImage(dog1);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(dog2);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref("/").update({
    food:foodObj.getFoodStock(),
    feedtime:hour(),
    gameState:"Hungry"
  })
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    food:foodS
  })
}

function update(state){
  database.ref("/").update({
    gameState:state
  })
}
