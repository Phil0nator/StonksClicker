var money = 20;
var text_size = 50;
var stocks = [];
var dps = 0; //days per second
var dpsSlider = document.getElementById("daysPerSecond");
var lastAutoDay;
var currentStock = null;
var daysPassed = 0;
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
    name:"Burger King inc.",
    start:17.35

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
var altStockList = [

  {
    name:"Facebook Inc.",
    start:214.18
  },
  {
    name:"Toyota Motor Corp.",
    start:140.15
  },
  {
    name:"Twitter inc.",
    start:36.91
  },
  {
    name:"Walmart inc.",
    start:117.89

  },
  {
    name:"S&P 500 Index",
    start:3380.16

  },
  {
    name:"Alphabet Inc Class A",
    start:1518.73

  }

]


function remove_linebreaks( str ) {
    return str.replace( /[\r\n]+/gm, "" );
}

function truncDisp(s, dgs){

  return remove_linebreaks(s.toString().substring(0, s.toString().indexOf(".") + dgs))


}

class Stock{

  constructor(name, price){
    this.name=name;
    this.price = price;
    this.trend = random(-0.0005,0.0005);
    this.ogPrice = price;
    this.owned = 0;
    this.bankrupt = false;
    this.hist = [];
    this.hist.push(this.price);
    this.x=0;
    this.y=0;
  }

  d(x,y){


    var w = width/5;
    var h = height/(12.5);
    this.w=w;
    this.h=h;
    var dx = 50;
    var dy = this.y;
    var mover = false;
    fill(0,25,0);
    strokeWeight(2);
    stroke(10,255,10);
    if(mouseX>dx&&mouseX<dx+w&&mouseY>dy&&mouseY<dy+h){
      currentStock=this;
      textSize(15);
      rect(dx+10,dy+10,2*(w/3)-20,h-20);
      if(money>this.price){
        fill(10,10,255);
        stroke(50,255,50);
      }else{
        fill(255,10,10);
        stroke(255,10,10);
      }
      text("Purchase",dx+width/45,dy+height/(stocks.length*3));
      if(x<2*(w/3)){ //slide to the right animations
        x+=15;
      }

      mover=true;
    }else{
      if(x>50){
        x-=15;
      }
    }
    this.x=x;
    this.y=y;
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
    dispTrend+=remove_linebreaks(this.trend.toString().substring(0, this.trend.toString().indexOf(".") + 5));;
    dispTrend = remove_linebreaks(dispTrend);
    text(this.name + ": $" + dispPrice + "    >  "+dispTrend, x+width/45,y+height/(stocks.length*3));

    text("Shares Owned: "+this.owned, x+width/45, y+height/(stocks.length*3)+30);



  }

  tick(){
    if(this.bankrupt){
      //swap out for quarter
      if(daysPassed%91 == 0){
        var index = stocks.indexOf(this);
        if (index !== -1) stocks[index] = swapStock();

      }

      return;
    }
    this.price-=this.price*this.trend;
    this.hist.push(this.price);

    if(this.hist.length>500){

      this.hist.splice(0,1);

    }

    this.trend+=random(-0.00005,0.00005);

    if(this.trend < -0.002){
      this.trend+=.0003;
    }else if(this.trend>0.002){
      this.trend-=.0003;
    }

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
    //yearly dividend:
    if(daysPassed%365==0){
      if(this.trend<0){
        money-=((this.price*this.trend)*this.owned);
      }
    }

    if(this.name=="NASDAQ"){
      this.trend = -.0000001; //(negative means positive)
    }


  }

  split(){

    this.price/=2;
    this.owned*=2;
  }

  sell(){

    money+=this.price;
    this.owned--;

  }

  sellOut(){

    money+=this.price*this.owned;
    this.owned=0;

  }
}

function plot(stock){

  var sx = width/2;
  var sy = height/4;
  var w = width/2;
  var h = height/2;
  stroke(10,255,10);
  fill(1,5,1);
  strokeWeight(1);

  rect(sx,sy,w,h);
  if(stock==null){
    return;
  }
  textSize(15);
  text(stock.name + " -- Price History", sx,sy-15);
  text("$"+min(stock.hist),sx-textWidth("$"+min(stock.hist))-20,sy+h);
  text("$"+max(stock.hist),sx-textWidth("$"+max(stock.hist))-20,sy);
  if(stock.trend<0){
    stroke(10,255,10);
    fill(1,5,1);
  }else{
    stroke(255,10,10);
    fill(5,1,1);

  }
  var xScale = w/stock.hist.length;
  var yScale = h/(max(stock.hist)-min(stock.hist));

  var graphArr;

  for(var i = 0 ; i < stock.hist.length;i++){
    if(i>0){
      line(sx+(i*xScale), (sy+h)-((stock.hist[i]-min(stock.hist))*yScale), sx+((i-1)*xScale), (sy+h)-((stock.hist[i-1]-min(stock.hist))*yScale));
    }else{
      point(sx+(i*xScale), (sy+h)-((stock.hist[i]-min(stock.hist))*yScale));
    }

  }


}

function swapStock(){

  var newstock = altStockList[int(random(0,altStockList.length))];
  console.log(newstock);
  var newstock = new Stock(newstock.name, newstock.start);
  return newstock;

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
  text("Balance: $"+money, width/2,height/(text_size/2));

}
function displayStocks(){

  for(var i = 0 ; i < stocks.length;i++){
    if(stocks[i].x==0&&stocks[i].y==0){
      stocks[i].d(50,i*(height/(stocks.length)));
    }else{
      stocks[i].d(stocks[i].x,stocks[i].y);
    }
  }


}

function freedomButton(){

  var x = width-width/5 - 5;
  var y = 5;
  var w = width/5;
  var h = height/5;

  extLight=0;
  if(mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h){
    extLight+=25;
  }
  if(money>=1500666.02){
    fill(extLight,extLight+10,extLight);
    stroke(extLight+10,255,extLight+10)

  }else{
    fill(extLight+10,0,extLight+10);
    stroke(255,extLight+10,extLight+10);
  }


  rect(x,y,w,h);
  text("Buy Freedom: $1,500,666.02", x+5,y+h/2);

}

function setup() {

  createCanvas(window.innerWidth-1,window.innerHeight-1);
  lastAutoDay = millis();
  loadStocks();
}

function sellButton(){
  //sell 1
  var w = width/6;
  var h = height/12;
  var sx = width/2;
  var sy = (height*(3/4))+10;

  if(currentStock == null){return;}

  var extLight = 0;
  if(mouseX>sx&&mouseX<sx+w&&mouseY>sy&&mouseY<sy+h){
    extLight=25;
  }

  if(currentStock.owned>0){
    fill(extLight,extLight+10,extLight);
    stroke(extLight+10,255,extLight+10)

  }else{
    fill(extLight+10,0,extLight+10);
    stroke(255,extLight+10,extLight+10);
  }

  rect(sx,sy,w,h);
  text("Sell Shares", sx+20,sy+h/2);

  sx += w*1.2;
  //sell all
  var extLight = 0;
  if(mouseX>sx&&mouseX<sx+w&&mouseY>sy&&mouseY<sy+h){
    extLight=25;
  }

  if(currentStock.owned>0){
    fill(extLight,extLight+10,extLight);
    stroke(extLight+10,255,extLight+10)

  }else{
    fill(extLight+10,0,extLight+10);
    stroke(255,extLight+10,extLight+10);
  }

  rect(sx,sy,w,h);
  text("Sell All Shares", sx+20,sy+h/2);
  //swap stock

}


function nextDay(){

  for(var i = 0 ; i < stocks.length;i++){
    stocks[i].tick();
  }
  daysPassed++;

}
function mouseReleased(){
  if(currentStock!=null){
    var w = width/6;
    var h = height/12;
    var sx = width/2;
    var sy = (height*(3/4))+10;
    if(mouseX>sx&&mouseX<sx+w&&mouseY>sy&&mouseY<sy+h){
      if(currentStock.owned>0){
        currentStock.sell();
      }

    }

    sx+=w*1.2;
    if(mouseX>sx&&mouseX<sx+w&&mouseY>sy&&mouseY<sy+h){
      if(currentStock.owned>0){
        currentStock.sellOut();
      }

    }
  }

  if(money>1500666.02){
    var x = width-width/5 - 5;
    var y = 5;
    var w = width/5;
    var h = height/5;
    if(mouseX>x&&mouseX<x+w&&mouseY>y&&mouseY<y+h){

      alert("You Won!");
      alert("Go away now");
      window.location.href = "https://www.rd.com/wp-content/uploads/2017/10/These-Funny-Dog-Videos-Are-the-Break-You-Need-Right-Now_493370860-Jenn_C-760x506.jpg";


    }
  }

  for(var i =0;i<stocks.length;i++){
    var x = 50;
    var y = i*(height/(stocks.length));
    if((mouseX>x&&mouseX<x+stocks[i].w&&mouseY>y&&mouseY<y+stocks[i].h)){

      if(money>stocks[i].price){
        stocks[i].owned++;
        money-=stocks[i].price;
      }

    }

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
  y+=50;
  text("Days Passed: "+daysPassed,x,y);
  text("Quarters Passed: "+int((daysPassed/360)*4), x,y+25);


}
function autoDays(){

  if(millis()-lastAutoDay>1000/dps){

    nextDay();
    lastAutoDay=millis();
  }


}

function draw() {
  resizeCanvas(window.innerWidth-1,window.innerHeight-1);
  background(0);
  displayMoney();
  displayStocks();
  //nextDayButton();
  labels();
  plot(currentStock);
  autoDays();
  sellButton();
  freedomButton();
}
