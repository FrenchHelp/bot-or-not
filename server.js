<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Classic Mode - Bot or Not?</title>
  <style>
    body {
      font-family: 'Inter', sans-serif;
      background: #1a1a2e;
      color: white;
      margin: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100vh;
      padding: 1rem;
      box-sizing: border-box;
    }
    #login {
      margin-top: 4rem;
    }
    #game {
      display: none;
      max-width: 800px;
      width: 100%;
    }
    h1 {
      color: #00e6e6;
    }
    #quote {
      background: #16213e;
      border-radius: 12px;
      padding: 1.5rem;
      font-size: 1.5rem;
      margin: 1rem 0;
      min-height: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    button {
      background-color: #00e6e6;
      border: none;
      color: #000;
      font-weight: bold;
      padding: 0.8rem 2rem;
      border-radius: 50px;
      cursor: pointer;
      font-size: 1.2rem;
      margin: 0 1rem;
      box-shadow: 0 0 12px #00e6e6;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    button:hover {
      transform: scale(1.05);
      box-shadow: 0 0 25px #00ffff;
    }
    #scores {
      margin-top: 1rem;
      background: #0f3460;
      padding: 1rem;
      border-radius: 10px;
      max-height: 150px;
      overflow-y: auto;
    }
    #chat {
      margin-top: 1rem;
      background: #0f3460;
      border-radius: 10px;
      max-height: 200px;
      overflow-y: auto;
      padding: 0.5rem;
    }
    #chat input {
      width: 100%;
      padding: 0.7rem;
      border-radius: 50px;
      border: none;
      margin-top: 0.5rem;
      font-size: 1rem;
    }
    #status {
      margin-top: 1rem;
      font-style: italic;
      color: #999;
    }
  </style>
</head>
<body>
  <div id="login">
    <h1>Classic Mode - Bot or Not?</h1>
    <label for="username">Enter your username:</label>
    <input type="text" id="username" placeholder="Your name" />
    <button id="joinBtn">Join Game</button>
    <div id="status"></div>
  </div>

  <div id="game">
    <h1>Guess: AI or Human?</h1>
    <div id="quote">Waiting for game to start...</div>
    <div>
      <button id="btnHuman">Human</button>
      <button id="btnAI">AI</button>
    </div>

    <div id="scores">
      <h3>Players & Scores</h3>
      <ul id="playerList"></ul>
    </div>

    <div id="chat">
      <h3>Chat</h3>
      <div id="chatMessages" style="max-height:150px; overflow-y:auto;"></div>
      <input id="chatInput" placeholder="Type a message..." />
    </div>
  </div>

  <script>
    let ws;
    let playerId = null;
    let username = null;
    let gameStarted = false;

    const loginDiv = document.getElementById('login');
    const gameDiv = document.getElementById('game');
    const joinBtn = document.getElementById('joinBtn');
    const usernameInput = document.getElementById('username');
    const statusEl = document.getElementById('status');
    const quoteEl = document.getElementById('quote');
    const btnHuman = document.getElementById('btnHuman');
    const btnAI = document.getElementById('btnAI');
    const playerListEl = document.getElementById('playerList');
    const chatMessagesEl = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');

    joinBtn.onclick = () => {
      username = usernameInput.value.trim();
      if (!username) {
        alert('Please enter a username');
        return;
      }
      connectWebSocket();
    };

    function connectWebSocket() {
      ws = new WebSocket('ws://localhost:8080');

      ws.onopen = () => {
        statusEl.textContent = 'Connected to server.';
        // Send join message
        ws.send(JSON.stringify({ type: 'join', username }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'error':
            alert(data.message);
            ws.close();
            break;

          case 'players':
            updatePlayerList(data.players);
            break;

          case 'start':
            gameStarted = true;
            loginDiv.style.display = 'none';
            gameDiv.style.display = 'block';
            statusEl.textContent = '';
            updatePlayerList(data.players);
            loadQuote(data.quote);
            break;

          case 'nextQuote':
            loadQuote(data.quote);
            break;

          case 'scoreUpdate':
            updateScore(data.playerId, data.score);
            break;

          case 'gameOver':
            alert('Game Over! Check final scores.');
            updatePlayerList(data.players);
            gameStarted = false;
            quoteEl.textContent = "Game Over! Thanks for playing.";
            btnHuman.disabled = true;
            btnAI.disabled = true;
            break;

          case 'gameStopped':
            statusEl.textContent = data.message;
            btnHuman.disabled = true;
            btnAI.disabled = true;
            break;

          case 'chat':
            appendChatMessage(data.username, data.message);
            break;
        }
      };

      ws.onclose = () => {
        statusEl.textContent = 'Disconnected from server.';
        btnHuman.disabled = true;
        btnAI.disabled = true;
      };

      btnHuman.onclick = () => {
        if (gameStarted) sendGuess('human');
      };
      btnAI.onclick = () => {
        if (gameStarted) sendGuess('ai');
      };

      chatInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          const msg = chatInput.value.trim();
          if (msg && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'chat', message: msg }));
            chatInput.value = '';
          }
        }
      });
    }

    function loadQuote(quote) {
      quoteEl.textContent = quote.text;
      btnHuman.disabled = false;
      btnAI.disabled = false;
    }

    function sendGuess(guess) {
      ws.send(JSON.stringify({ type: 'guess', guess }));
      btnHuman.disabled = true;
      btnAI.disabled = true;
    }

    function updatePlayerList(players) {
      playerListEl.innerHTML = '';
      players.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.username}: ${p.score}`;
        if (p.id === playerId) {
          li.style.fontWeight = 'bold';
        }
        playerListEl.appendChild(li);
      });
    }

    function updateScore(playerIdToUpdate, score) {
      // Re-fetch full players from server or update locally
      // For simplicity, assume server sends full players list on 'players' type only.
      // So just re-enable buttons for next guess:
      btnHuman.disabled = false;
      btnAI.disabled = false;
    }

    function appendChatMessage(username, message) {
      const div = document.createElement('div');
      div.textContent = `${username}: ${message}`;
      chatMessagesEl.appendChild(div);
      chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }
  </script>
</body>
</html>
