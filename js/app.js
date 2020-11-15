// Read URL to see if we should show physics or chemistry
let params = new URLSearchParams(window.location.search);
const pairType = params.get("type"); // This is either kemija or fizika
// Only deal with selected pairs and default to kemija if type is missing
const selectedPairs = ALL_PAIRS[pairType] || ALL_PAIRS.kemija;

// Set page title
document.getElementById("title").innerHTML = selectedPairs.title;
document.title = selectedPairs.title;

// deck of all cards in game
const deck = document.getElementById("card-deck");

// Shuffle list of pairs and insert first 10 random pairs
// into deck with javascript. Types will be just numbers "0", "1", "2",...
let chosenPairs = shuffle(selectedPairs.pairs);
for (let i = 0; i < 10; i++) {
    for (let pair of chosenPairs[i]) { // first and second pair
        if (pair.length > 10) {
            // If text is longer than 10 characters make font-size 1% smaller for
            // every two characters it has.
            let fontSize = 90 - pair.length/2;
            pair = `<span style="font-size: ${fontSize}%;">${pair}</span>`;
        }
        // This HTML definition of a card
        // e.g. <li class="card" type="1">Helij</li>
        deck.innerHTML += `<li class="card" type="${i}">${pair}</li>`;
    }
}

// cards array holds all cards
let card = document.getElementsByClassName("card");
let cards = [...card];

// declaring move variable
let moves = 0;
let counter = document.querySelector(".moves");

// declare variables for star icons and set the correct icon
const stars = document.getElementsByClassName("star");
for (let i = 0; i < stars.length; i++) {
    stars[i].classList.add("fa-" + selectedPairs.score_icon);
}

// declaring variable of matchedCards
let matchedCard = document.getElementsByClassName("match");

 // stars list
 let starsList = document.querySelectorAll(".stars li");

 // close icon in modal
 let closeicon = document.querySelector(".close");

 // declare modal
 let modal = document.getElementById("popup1")

 // array for opened cards
var openedCards = [];


// @description shuffles cards
// @param {array}
// @returns shuffledarray
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
};


// @description shuffles cards when page is refreshed / loads
document.body.onload = startGame();

// @description function to start a new play 
function startGame(){
 
    // empty the openCards array
    openedCards = [];

    // shuffle deck
    cards = shuffle(cards);
    
    // remove all exisiting classes from each card
    for (var i = 0; i < cards.length; i++){
        cards[i].classList.remove("show", "open", "match", "disabled");
    }
    
    deck.innerHTML = "";
    [].forEach.call(cards, function(item) {
        deck.appendChild(item);
    });
    
    // reset moves
    moves = 0;
    counter.innerHTML = moves;
    // reset rating
    for (var i= 0; i < stars.length; i++){
        stars[i].style.visibility = "visible";
    }
    //reset timer
    second = 0;
    minute = 0; 
    hour = 0;
    var timer = document.querySelector(".timer");
    timer.innerHTML = "0 mins 0 secs";
    clearInterval(interval);
}


// @description toggles open and show class to display cards
var displayCard = function (){
    this.classList.toggle("open");
    this.classList.toggle("show");
    this.classList.toggle("disabled");
};


// @description add opened cards to OpenedCards list and check if cards are match or not
function cardOpen() {
    openedCards.push(this);
    var len = openedCards.length;
    if(len === 2){
        moveCounter();
        if(openedCards[0].type === openedCards[1].type){
            matched();
        } else {
            unmatched();
        }
    }
};


// @description when cards match
function matched(){
    openedCards[0].classList.add("match", "disabled");
    openedCards[1].classList.add("match", "disabled");
    openedCards[0].classList.remove("show", "open", "no-event");
    openedCards[1].classList.remove("show", "open", "no-event");
    openedCards = [];
}


// description when cards don't match
function unmatched(){
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disable();
    setTimeout(function(){
        openedCards[0].classList.remove("show", "open", "no-event","unmatched");
        openedCards[1].classList.remove("show", "open", "no-event","unmatched");
        enable();
        openedCards = [];
    },900);
}


// @description disable cards temporarily
function disable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.add('disabled');
    });
}


// @description enable cards and disable matched cards
function enable(){
    Array.prototype.filter.call(cards, function(card){
        card.classList.remove('disabled');
        for(var i = 0; i < matchedCard.length; i++){
            matchedCard[i].classList.add("disabled");
        }
    });
}


// @description count player's moves
function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        second = 0;
        minute = 0; 
        hour = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 20 && moves <= 27){
        stars[2].style.visibility = "collapse";
    }
    else if (moves > 27){
        stars[1].style.visibility = "collapse";
        stars[2].style.visibility = "collapse";
    }
}


// @description game timer
var second = 0, minute = 0; hour = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}


// @description congratulations when all cards match, show modal and moves, time and rating
function congratulations(){
    if (matchedCard.length == 20){
        clearInterval(interval);
        finalTime = timer.innerHTML;

        // show congratulations modal
        modal.classList.add("show");

        // declare star rating variable
        var starRating = document.querySelector(".stars").innerHTML;

        //showing move, rating, time on modal
        document.getElementById("finalMove").innerHTML = moves;
        document.getElementById("starRating").innerHTML = starRating;
        document.getElementById("totalTime").innerHTML = finalTime;

        //closeicon on modal
        closeModal();
    };
}


// @description close icon on modal
function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("show");
        startGame();
    });
}


// @desciption for user to play Again 
function playAgain(){
    modal.classList.remove("show");
    startGame();
}


// loop to add event listeners to each card
for (var i = 0; i < cards.length; i++){
    card = cards[i];
    card.addEventListener("click", displayCard);
    card.addEventListener("click", cardOpen);
    card.addEventListener("click",congratulations);
};
