var time_init = performance.now();
var time_final = 0;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;
const dnaLength = 300;
const genSize = 500;
let generation = [];
let framesDrawn = 0;
var goal = {x:canvas.width-100, y:canvas.height/2};
const tournamentParcipiants = 10;
let genNumber = 1;
var teste = false;
var objetoVencedor = null
var pos_inicial = [30,(canvas.height/2)];

// obsticle drawing
let obsticleNum = 0;
let obsticleArr = [];
let rect = {};
let drag = false;
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMove);
// Cenário Fácil gen : 2
// obsticleArr.push({startX:500, startY:500, w:500, h:500});
// obsticleArr.push({startX:500, startY:0, w:500, h:400});
// obsticleNum+=2;
// Cenário Médio gen : 31
// obsticleArr.push({startX:500, startY:500, w:30, h:canvas.height});
// obsticleArr.push({startX:600, startY:0, w:30, h:500});
// obsticleNum+= 2;
// Cenário Difícil gen : 44
// obsticleArr.push({startX:500, startY:500, w:30, h:canvas.height});
// obsticleArr.push({startX:700, startY:0, w:30, h:500});
// obsticleArr.push({startX:900, startY:300, w:30, h:300});
// obsticleArr.push({startX:1000, startY:300, w:30, h:300});
// obsticleNum+= 4;
loadScenario()

function mouseDown(e) {
  rect.startX = e.pageX;
  rect.startY = e.pageY;
  drag = true;
}
function mouseUp() {
  if(rect.w<0){
    rect.startX+=rect.w;
    rect.w*=-1;
  }
  if(rect.h<0){
    rect.startY+=rect.h;
    rect.h*=-1;
  }
  obsticleArr.push({startX:rect.startX, startY:rect.startY, w:rect.w, h:rect.h});
  obsticleNum++;
  drag = false;
}
function mouseMove(e) {
  if (drag) {
    rect.w = (e.pageX) - rect.startX;
    rect.h = (e.pageY) - rect.startY;
  }
}

// draw dos elmentos na tela - (obstaculos,objetivo e individuos)
const draw = () => {
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#211f1f';                         // clear canvas
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'white';
        ctx.font = "30px Arial";
        ctx.fillText("generation: " + genNumber,canvas.width-250,canvas.height-50);
        if(teste){
          ctx.fillText("Time: " + (time_final-time_init)+"ms",20,canvas.height-50);
        }
        ctx.fillStyle = '#a5551c';
        ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);  // drawing rect that is going to become obsticle
        obsticleArr.forEach( k => {ctx.fillRect(k.startX, k.startY, k.w, k.h);});  // drawing obsticles
        ctx.fillStyle = 'green';    // drawing goal
        ctx.fillRect(goal.x, goal.y, 20, 20);
        //Draw lines
       if(objetoVencedor !== null){
          //let posInicial = [30, (canvas.height / 2)]
          ctx.fillStyle = "yellow"
          ctx.strokeStyle = "yellow"
          ctx.beginPath()
          ctx.moveTo(pos_inicial[0], pos_inicial[1])
          for(let i in objetoVencedor.allAcc){
            ctx.lineTo(objetoVencedor.allAcc[i].x, objetoVencedor.allAcc[i].y)
          }
          ctx.stroke()
       } else {
         generation.forEach( indi => {  // drawing individuals
           indi.drawI();
         });

       }
}

// troca de cromossomos
const pairChromosomes = t1 => t2 => {
  let ret = []; // array que vai receber o resultado
  for (let i = 0; i < dnaLength; i++) {
    if(Math.random() > 0.01){ // teste de mutação
      i<dnaLength/(dnaLength/4 + Math.random()*dnaLength/2)?ret.push(t1.acc[i]):ret.push(t2.acc[i]); // função randomica para determinar de qual pai será pego o i gene
    }else{
      ret.push(randomVel()); // aconteceu mutação (gera um valor randomico e atribui ao i gene)
    }
  }
  return ret; // retorna o cromossomo resultante
}
// torneio para criar nova geração
const tournament = () => {
  let toHalf = 0;
  while(toHalf++ < genSize/2){ // avança até a metade da geração
    let tournament = [];
    // seleciona randomicamente -tournamentParcipiants- participantes
    for (let i = 0; i < tournamentParcipiants; i++) {
      let k = Math.random()*genSize; // gera um número aleatorio entre 0 e 299, limites e reais inclusos
      tournament.push(generation[Math.floor(k)]); // seleciona um individuo k na geração
    }
    // seleciona os 2 melhores pais do torneio
    let parent1 = tournament.reduce((a, b) => a.calcFit()>b.calcFit()?a:b); // compara os pais e pega o de maior fitness
    tournament.splice(tournament.indexOf(parent1), 1); // retira o pai selecionado do array
    let parent2 = tournament.reduce((a, b) => a.calcFit()>b.calcFit()?a:b); // seleciona o segundo maior fitness

    // gera 2 filhos a partir dos 2 pais
    let child1 = new Individual(pairChromosomes(parent1)(parent2));
    let child2 = new Individual(pairChromosomes(parent2)(parent1));

    // muda a geração
    generation[toHalf] = child1; // troca o individuo no indice toHalf pelo primeiro filho gerado
    generation[genSize/2 + toHalf] = child2; // troca o individuo no indice (genSize/2 + toHalf) pelo segundo filho gerado
  }
}

const newGeneration = () => {
  ++genNumber; // incrementa a geração
  tournament(); // torneio para gerar novos individuos
}

// loop de draw (cria uma nova geração quando a atual acaba)
//var frameControler = 0;
const step = () => {
    if (teste){
      draw();
      return;
    }
    if (++framesDrawn >= dnaLength) {
      framesDrawn = 0;
      newGeneration();
      window.requestAnimationFrame(step);
      draw();
      return;
    }
      //para depois de acertar
      window.requestAnimationFrame(step);

      draw();
}

// Gera um DNA randomico para a primeira geração

// Gera valores aleatórios
const randomVel = () => {
  return {x:(Math.random()*2-1)*1, y:(Math.random()*2-1)*1};
}

// Monta um DNA com dnaLength valores aleatórios
const getDna = () => {
  DNA = [];
  for (let j = 0; j < dnaLength; j++) {
    DNA.push(randomVel());
  }
  return DNA;
}

// Começo da Aplicação
      for (let i = 0; i < genSize; i++) {
        generation.push(new Individual(getDna()));
      }
      draw();
      requestAnimationFrame(step);
