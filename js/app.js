/*
 * DECLARAÇÃO DE VARIÁVEIS
 */
let carta = document.getElementsByClassName('card');
let cartas = [...carta]
// deck de cartas
const deck = document.getElementById('card-deck');
// variável de Jogadas
let jogadas = 0;
let contador = document.querySelector(".moves");
// variável da estrela
const estrelas = document.querySelectorAll(".fa-star");
// variável usada para quando o jogador acertar o par de cartas
let acertou = document.getElementsByClassName("match");
// lista de estrelas
let listaEstrelas = document.querySelectorAll(".stars li");
// declare modal
let modal = document.getElementById("fim");
// array de cartas abertas
var cartasAbertas = [];
// variáveis para controlar o timer
var segundo = 0, minuto = 0; hora = 0;
var timer = document.querySelector(".timer");
var intervalo;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * INICIA PARTIDA
 */
document.body.onload = iniciarPartida();

function iniciarPartida() {
    // esvazia o array de cartas abertas
    cartasAbertas = [];
    // embaralhar deck
    cartas = shuffle(cartas);
    // remove as classes existentes para os itens da lista
    for (var i = 0; i < cartas.length; i++){
        deck.innerHTML = "";
        [].forEach.call(cartas, function(item) {
            deck.appendChild(item);
        });
        cartas[i].classList.remove("show", "open", "match", "disabled");
    }
    // reseta número de jogadas
    jogadas = 0;
    contador.innerHTML = jogadas;
    // reseta performance
    for (var i= 0; i < estrelas.length; i++){
        estrelas[i].style.color = "#FFD700";
        estrelas[i].style.visibility = "visible";
    }
    //reseta o timer
    segundo = 0;
    minuto = 0; 
    hora = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 minutos 0 segundos";
    clearInterval(intervalo);
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// função de exibição de cartas
function exibirCarta() {
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};

// função para verificar se as cartas abertas combinam ou não
function abrirCarta() {
    cartasAbertas.push(this);
    var len = cartasAbertas.length;
    if(len === 2){
        contadorJogadas();
        if(cartasAbertas[0].type === cartasAbertas[1].type){
            igual();
        } else {
            diferente();
        }
    }
};

// função que trata as cartas quando ambas combinam
function igual() {
    cartasAbertas[0].classList.add("match", "disabled");
    cartasAbertas[1].classList.add("match", "disabled");
    cartasAbertas[0].classList.remove("show", "open", "no-event");
    cartasAbertas[1].classList.remove("show", "open", "no-event");
    cartasAbertas = [];
}

//função que trata as cartas quando são diferentes
function diferente(){
    cartasAbertas[0].classList.add("unmatched");
    cartasAbertas[1].classList.add("unmatched");
    desabilitar();
    setTimeout(function(){
        cartasAbertas[0].classList.remove("show", "open", "no-event", "unmatched");
        cartasAbertas[1].classList.remove("show", "open", "no-event", "unmatched");
        habilitar();
        cartasAbertas = [];
    },1100);
}

// função que habilita cartas
function desabilitar(){
    Array.prototype.filter.call(cartas, function(carta){
        carta.classList.add('disabled');
    });
}

// função que desabilita cartas
function habilitar(){
    Array.prototype.filter.call(cartas, function(carta){
        carta.classList.remove('disabled');
        for(var i = 0; i < acertou.length; i++){
            acertou[i].classList.add("disabled");
        }
    });
}

// função que faz a contagem de jogadas
function contadorJogadas(){
    jogadas++;
    contador.innerHTML = jogadas;
    // inicia a contagem do tempo
    if(jogadas == 1){
        segundos = 0;
        minutos = 0; 
        horas = 0;
        contagemTempo();
    }
    // determina a performance do jogador
    if (jogadas > 8 && jogadas < 13){
        for( i= 0; i < 3; i++){
            if(i > 1){
                estrelas[i].style.visibility = "collapse";
            }
        }
    }
    else if (jogadas > 15){
        for( i= 0; i < 3; i++){
            if(i > 0){
                estrelas[i].style.visibility = "collapse";
            }
        }
    }
}

// função de contagem de tempo
function contagemTempo(){
    intervalo = setInterval(function(){
        timer.innerHTML = minuto+"minutos "+segundo+"segundos";
        segundo++;
        if(segundo == 60){
            minuto++;
            segundo=0;
        }
        if(minuto == 60){
            hora++;
            minuto = 0;
        }
    },1000);
}

// função de encerramento da partida
function fim(){
    if (acertou.length == 16){
      
        clearInterval(intervalo);
        tempo = timer.innerHTML;

        modal.classList.add("show");

        var performance = document.querySelector(".stars").innerHTML;

        document.getElementById("jogadas").innerHTML = jogadas;
        document.getElementById("performance").innerHTML = performance;
        document.getElementById("tempo").innerHTML = tempo;
    };
}

// função para reiniciar partida
function jogarDenovo(){
    modal.classList.remove("show");
    iniciarPartida();
}

// loop para adicionar event listeners para cada carta
for (var i = 0; i < cartas.length; i++){
    carta = cartas[i];
    carta.addEventListener("click", exibirCarta);
    carta.addEventListener("click", abrirCarta);
    carta.addEventListener("click", fim);
};