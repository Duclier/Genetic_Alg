function Obstacle(x, y, w_, h_) {

    this.position = new PVector(x,y);
    this.w = w_;
    this.h = h_;
}

function contains(spot) {
      if (spot.x > position.x && spot.x < position.x + w && spot.y > position.y && spot.y < position.y + h) {
        return true;
      } else {
        return false;
      }
}

function PVector(x,y){
  this.x  = x ;
  this.y = y;
}

PVector.prototype.mag = function(){
  return  Math.sqrt(this.x*this.x+this.y*this.y);
}

PVector.prototype.normalize = function(){
  var mag = this.mag();

  if(mag > 0){
    this.x = this.x / mag;
    this.y = this.y / mag;
  }
}

/*void display() {
    noStroke();
    fill(255,50,50);
    rectMode(CORNER);
    rect(position.x,position.y,w,h);
  }*/
