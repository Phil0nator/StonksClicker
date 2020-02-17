var money = 20;
var text_size = 50;
var stocks = [];
var dps = 0; //days per second
var dpsSlider = document.getElementById("daysPerSecond");
var lastAutoDay;
var stockList =
[

  {
    name:"NASDAQ",
    start:9731.18
  },
  {
    name:"Dow Jones",
    start:29398.08
  },
  {
    name:"Apple inc.",
    start:324.95
  },
  {
    name:"Starbucks Coorperation",
    start:89.28
  },
  {
    name:"Nike Coorperation",
    start:103.54
  },
  {
    name:"Tesla",
    start:300.32
  },
  {
    name:"NVIDIA Corporation",
    start:289.79
  },
  {
    name:"Alex Coffee inc.",
    start:15.62
  },
  {
    name:"Microsoft inc.",
    start:185.35

  },
  {
    name:"Beans 'n fixins Coorperation",
    start:10.35

  },
  {
    name:"Sockets LLC",
    start:0.32
  },
  {
    name:"Jacket Juice Co.",
    start:5.73

  },
  {
    name:"Gap inc.",
    start:5.02

  }
];

function remove_linebreaks( str ) {
    return str.replace( /[\r\n]+/gm, "" );
}
class Stock{

  constructor(name, price){
    this.name=name;
    this.price = price;
    this.trend = random(-0.0005,0.0005);
    this.ogPrice = price;
    this.owned = 0;
    this.bankrupt = false;
  }

  d(x,y){
    y+=5;
    this.x=x;
    this.y=y;
    var w = width/5;
    var h = height/(12.5);
    var mover = false;
    fill(0,25,0);
    strokeWeight(2);
    stroke(10,255,10);
    if(mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h){

      textSize(15);
      rect(x+10,y+10,2*(w/3)-20,h-20);
      if(money>this.price){
        fill(10,10,255);
        stroke(50,255,50);
      }else{
        fill(255,10,10);
        stroke(255,10,10);
      }
      text("Purchase",x+width/45,y+height/(stocks.length*3));
      x+=2*(w/3);
      mover=true;
    }
    fill(0,25,0);
    strokeWeight(5);
    stroke(10,255,10);
    textSize(15);
    if(this.bankrupt){

      fill(25,0,0);

    }
    rect(x,y,w,h);
    noStroke();
    fill(10,255,10);

    var dispPrice = remove_linebreaks(this.price.toString().substring(0, this.price.toString().indexOf(".") + 3));
    var dispTrend = "";
    if(this.trend>0){
      dispTrend = "-";
    }else{
      dispTrend = "+";
    }
    dispTrend+=this.trend;
    dispTrend = remove_linebreaks(dispTrend);
    text(this.name + ": $" + dispPrice + "    >  "+dispTrend, x+width/45,y+height/(stocks.length*3));

    text("Shares Owned: "+this.owned, x+width/45, y+height/(stocks.length*3)+30);



  }

  tick(){

    this.price-=this.price*this.trend;
    this.trend+=random(-0.000001,0.000001);
    if(this.price<1&&!this.bankrupt){
      this.bankrupt=true;
      this.price = 0;
      this.trend = 0;
      this.owned = 0;
      this.name+=" - BANKRUPT";
    }
    if(this.price>this.ogPrice*2){
      this.split();
    }

  }

  split(){

    this.price/=2;
    this.owned*=2;
  }

}
function loadStocks(){
  for(var i = 0 ; i < stockList.length;i++){
    console.log("Loading: "+stockList[i].name);
    stockList[i].name = remove_linebreaks(stockList[i].name);
    stocks.push(new Stock(stockList[i].name, stockList[i].start));
  }
}


function displayMoney(){
  noStroke();
  fill(10,255,10);
  textSize(text_size);
  text("$"+money, width/2,height/(text_size/2));

}
function displayStocks(){

  for(var i = 0 ; i < stocks.length;i++){

    stocks[i].d(50,i*(height/(stocks.length)));
    console.log("displaying: "+stocks[i].name);
  }


}


function setup() {

  createCanvas(window.innerWidth-1,window.innerHeight-1);
  lastAutoDay = millis();
  loadStocks();
}



function nextDay(){

  for(var i = 0 ; i < stocks.length;i++){
    stocks[i].tick();
  }

}
function mouseReleased(){
  var r = width/4;
  if(dist(mouseX,mouseY,width/2,height/2)<r/2){
   nextDay();
  }
}

function nextDayButton(){


  fill(0,25,0);
  strokeWeight(5);
  stroke(10,255,10);
  var r = width/4;
  if(dist(mouseX,mouseY,width/2,height/2)<r/2){
    r+=25;
    fill(10,35,10);

  }
  circle(width/2,height/2,r);


}
function labels(){
  dps = dpsSlider.value;
  var x = width*.9;
  var y= height*.9;
  fill(10,255,10);
  stroke(10,255,10);
  strokeWeight(1);
  textSize(20);
  text("Days/second: "+dps, x,y);


}
function autoDays(){

  if(millis()-lastAutoDay>1000/dps){

    nextDay();

  }


}

function draw() {
  resizeCanvas(window.innerWidth-1,window.innerHeight-1);
  background(0);
  displayMoney();
  displayStocks();
  nextDayButton();
  labels();

  autoDays();
}
