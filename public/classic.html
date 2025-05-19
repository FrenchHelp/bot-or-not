const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server running on ws://localhost:8080');

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 4;

const quotes = [
  { label: 'human', text: "I love spending time outdoors and reading books." },
  { label: 'ai', text: "The algorithm optimizes the output based on training data." },
  { label: 'human', text: "Sometimes I just want to watch movies all day." },
  { label: 'ai', text: "Natural language processing allows machines to understand human language." },
  { label: 'human', text: "Cooking is a hobby that brings me joy and relaxation." },
  { label: 'ai', text: "The neural network adjusts weights through backpropagation." },
  { label: 'human', text: "Traveling helps me learn about different cultures." },
  { label: 'ai', text: "Data is the new oil in the digital economy." },
  // Add more quotes here...
];

let players = []; // { id, ws, username, score }
let currentQuoteIndex = 0;
let gameStarted = false;

function broadcast(data) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function sendToPlayer(player, data) {
  if (player.ws.readyState === WebSocket.OPEN) {
    player.ws.send(JSON.stringify(data));
  }
}

function shuffle(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function nextQuote() {
  currentQuoteIndex++;
  if(currentQuoteIndex >= quotes.length){
    return null;
  }
  return quotes[currentQuoteIndex];
}

function resetGame() {
  players.forEach(p => p.score = 0);
  currentQuoteIndex = 0;
  gameStarted = true;
  shuffle(quotes);
}

function allPlayersReady() {
  return players.length >= MIN_PLAYERS && players.length <= MAX_PLAYERS;
}

wss.on('connection', function connection(ws) {
  if(players.length >= MAX_PLAYERS) {
    ws.send(JSON.stringify({ type: 'error', message: 'Room full, try again later.' }));
    ws.close();
    return;
  }

  const playerId = Date.now() + Math.floor(Math.random() * 1000);
  let player = { id: playerId, ws, username: '', score: 0 };
  players.push(player);

  console.log(`Player connected: ${playerId}`);

  ws.on('message', function message(data) {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch {
      ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format.' }));
      return;
    }

    switch(msg.type) {
      case 'join':
        player.username = msg.username || 'Anon';
        // Notify all players of new player list
        broadcast({ type: 'players', players: players.map(p => ({ id: p.id, username: p.username, score: p.score })) });

        // Auto start game if enough players
        if (!gameStarted && allPlayersReady()) {
          resetGame();
          broadcast({ type: 'start', quote: quotes[currentQuoteIndex], players: players.map(p => ({ id: p.id, username: p.username, score: p.score })) });
        }
        break;

      case 'guess':
        if(!gameStarted) return;
        const guess = msg.guess; // 'human' or 'ai'
        const correct = (guess === quotes[currentQuoteIndex].label);
        if(correct) player.score++;

        // Update scores for all players
        broadcast({ 
          type: 'scoreUpdate', 
          playerId: player.id, 
          score: player.score, 
          correct, 
          guess,
          currentQuoteIndex
        });

        // Move to next quote only when all players answered for current quote?
        // For simplicity, advance on each guess, but can be improved
        currentQuoteIndex++;
        if(currentQuoteIndex >= quotes.length){
          // Game over
          gameStarted = false;
          broadcast({ type: 'gameOver', players: players.map(p => ({ id: p.id, username: p.username, score: p.score })) });
        } else {
          broadcast({ type: 'nextQuote', quote: quotes[currentQuoteIndex] });
        }
        break;

      case 'chat':
        // Broadcast chat to all players
        broadcast({ type: 'chat', username: player.username, message: msg.message });
        break;
    }
  });

  ws.on('close', () => {
    players = players.filter(p => p.id !== player.id);
    broadcast({ type: 'players', players: players.map(p => ({ id: p.id, username: p.username, score: p.score })) });

    if (players.length < MIN_PLAYERS) {
      gameStarted = false;
      broadcast({ type: 'gameStopped', message: 'Not enough players. Waiting for more...' });
    }

    console.log(`Player disconnected: ${player.id}`);
  });
});
