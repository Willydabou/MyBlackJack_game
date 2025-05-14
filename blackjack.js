

const cards = [
    { name: "1", point: 1, src: "01.png" },
    { name: "2", point: 2, src: "02.jpg" },
    { name: "3", point: 3, src: "03.png" },
    { name: "4", point: 4, src: "04.png" },
    { name: "5", point: 5, src: "05.png" },
    { name: "6", point: 6, src: "06.png" },
    { name: "7", point: 7, src: "07.png" },
    { name: "8", point: 8, src: "08.png" },
    { name: "9", point: 9, src: "09.png" },
    { name: "10", point: 10, src: "10.jpg" },
    { name: "Q", point: 11, src: "Q.jpg" },
    { name: "J", point: 12, src: "J.jpg" },
    { name: "K", point: 13, src: "K.jpg" },
    { name: "A", point: 14, src: "A.jpg" }
  ];
  
  const players = [
    { name: "You", score: 0 },
    { name: "Bot", score: 0 }
  ];
  
  
  let winCount = 0, drawCount = 0, lossCount = 0, currentScore = 0;
  let isOver = false;
  let currentPlayer = players[0];
  const winSound = new Audio('WIN.mp3');
  const loseSound = new Audio('Lost.mp3');
  
  // ------------------------------------------------------- DOM Helpers
  const updateText = (id, text) => document.getElementById(id).textContent = text;
  const updateColor = (id, color) => document.getElementById(id).style.color = color;
  const updateScore = (id, score) => document.getElementById(id).innerHTML = score;
  
  function getRandomCard() {  //---------------------------- Choose card
    return cards[Math.floor(Math.random() * cards.length)];
  }


  
  function createCardImage(src) { //----------------------- Create card image
    const img = document.createElement('img');
    img.src = src;
    img.className = 'card-img';
    return img;
  }
  


  function appendCard(playerName, img) { //-----------------Append card to the right box
    const cardContainer = document.getElementById(playerName === 'You' ? 'yourCards' : 'botCards');
    cardContainer.appendChild(img);
  }
  


  function hitFunction() {
    if (isOver) return;
  
    const card = getRandomCard();
    currentScore += card.point;
    appendCard(currentPlayer.name, createCardImage(card.src));
  
    const scoreId = currentPlayer.name === 'You' ? 'yourScore' : 'botScore';
    updateScore(scoreId, currentScore);
    checkScore();
  }
  


  function checkScore() {
    if (currentScore > 21) {
      updateText('h3_title', 'Bust');
      updateColor('h3_title', 'red');
      standFunction();
    }
  }


  
  function standFunction() {
    if (isOver) return;
  
    currentPlayer.score = currentScore;
    currentScore = 0;
  
    if (currentPlayer.name === 'You') {
      currentPlayer = players[1];
      botTurn();
    } else {
      evaluateResult();
      currentPlayer = players[0];
      isOver = true;
    }
  }
  
  function evaluateResult() {
    const youScore = players[0].score;
    const botScore = players[1].score;
  
    const isDraw = (
      (youScore > 21 && botScore > 21) ||
      (youScore <= 21 && botScore <= 21 && youScore === botScore)
    );
  
    const youWin = (
      (youScore <= 21 && botScore > 21) ||
      (youScore <= 21 && botScore <= 21 && youScore > botScore)
    );
  
    const youLose = !isDraw && !youWin;
  
    if (isDraw) {
      updateText('h3_title', "It's a draw");
      updateColor('h3_title', 'darkyellow');
      updateScore('draw-score', ++drawCount);
    } else if (youWin) {
      updateText('h3_title', 'You Win');
      updateColor('h3_title', 'green');
      updateScore('win-score', ++winCount);
      winSound.play();
    } else if (youLose) {
      updateText('h3_title', 'You Lost');
      updateColor('h3_title', 'red');
      updateScore('losse-score', ++lossCount);
      loseSound.play();
    }
  }
  
  function dealFunction() {
    if (!isOver) return;
  
    isOver = false;
    ['yourCards', 'botCards'].forEach(id => {
      const container = document.getElementById(id);
      while (container.firstChild) container.removeChild(container.firstChild);
    });
  
    currentScore = 0;
    players.forEach(player => player.score = 0);
    updateScore('yourScore', 0);
    updateScore('botScore', 0);
    updateText('h3_title', 'Lets play');
    updateColor('h3_title', 'white');
    currentPlayer = players[0];
  }
  
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async function botTurn() {
    while (currentPlayer.name === 'Bot') {
      hitFunction();
      await sleep(1000);
  
      if (currentScore >= 15 && Math.random() > 0.5) {
        standFunction();
      }
    }
  }
  