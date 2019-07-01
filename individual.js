class Individual {
  constructor(DNA) {
     this.pos = {x:30, y:canvas.height/2}; //posição inicial para todos os individuos
     this.vel = {x:0, y:0}; // velocidade no qual é movido
     this.acc = DNA; // o cromossomo formado a partir de dnaLength números randomicos
     this.fitness = 0; // fitness do inviduo
     this.move = true; // pode mover-se ?
     this.alfa = 1; // modificador extra do fitness
     this.allAcc = []
  }
  calcFit() {
    /* calculo do fitness feito a partir da distância do individuo na sua posição e o objetivo , sendo possivel
    modifica-lo a partir de um valor alfa que tem como valor padrão 1 mas pode assumir valores .5 e 2*/
    let par1 = (this.pos.x-goal.x)*(this.pos.x-goal.x);
    let par2 = (this.pos.y-goal.y)*(this.pos.y-goal.y);
    this.fitness = 1/Math.sqrt(par1 + par2);
    return this.fitness * this.alfa;
  }
  update() {
    // checa se o individuo ainda pode mover-se
    if(this.move){
      // framesDrawn é um contador de frames que percorre todas as posições de incremento no qual o individuo vai receber
      this.vel.x += this.acc[framesDrawn].x; // faz o incremento na velocidade do individuo, a partir dos números armazenados no dna, no eixo x
      this.vel.y += this.acc[framesDrawn].y; // faz o incremento na velocidade do individuo, a partir dos números armazenados no dna, no eixo y
      this.pos.x += this.vel.x; // aplica a movimentação no objeto, no eixo x
      this.pos.y += this.vel.y; // aplica a movimentação no objeto, no eixo y
      this.allAcc.push({x: this.pos.x, y: this.pos.y})

      // teste para saber se o individuo saiu do canvas
      if(this.pos.x < 0 || this.pos.y < 0 || this.pos.x > canvas.width || this.pos.y > canvas.height){
        this.move = false;
        this.alfa = 0.5; // modifica alfa, e assim diminui o fitness desse individuo
      }
      if(!obsticleNum == 0) { // checa a colisão com todos os obstaculos salvos
        obsticleArr.forEach( o => {
          if(isInObsticle(this.pos.x)(this.pos.y)(o.startX)(o.startX + o.w)(o.startY)(o.startY + o.h)){
            this.move = false;
            this.alfa = 0.5; // modifica alfa, e assim diminui o fitness desse individuo
          }
        });
      }
      // teste para checar a colisão com o objetivo
      if((this.pos.x > goal.x && this.pos.x < goal.x+20) && (this.pos.y > goal.y && this.pos.y < goal.y+20)) {
        time_final = performance.now();
        this.move = false;
        this.alfa = 2; // modifica alfa, e assim aumenta o fitness desse individuo
        teste = true
        if(!objetoVencedor){
          objetoVencedor = this;
        }
      }
    }
  }
  drawI() {
      this.update();
      
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.globalAlpha = 0.5;
      ctx.arc(this.pos.x, this.pos.y, 7, 0, 2*Math.PI);
      ctx.fill();
      ctx.closePath();

  }
}

const isInObsticle = pX => pY => oX1 => oX2 => oY1 => oY2 => {
  if((pX > oX1 && pX < oX2) && (pY > oY1 && pY < oY2)){
    return true;
  }
  return false;
}
