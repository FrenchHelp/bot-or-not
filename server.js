const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });
console.log('WebSocket server running on ws://localhost:8080');

const MAX_PLAYERS = 8;
const MIN_PLAYERS = 4;

const quotes = [
{ label: 'human', text: "I can't believe I ate the whole pizza... again." },
{ label: 'human', text: "Why do I always forget my keys in the fridge?" },
{ label: 'human', text: "I swear my cat judges me when I cry during movies." },
{ label: 'human', text: "I just spent 10 minutes looking for my phone while holding it." },
{ label: 'human', text: "My plants are either drowning or thirstier than a cactus in the desert—no in-between." },
{ label: 'human', text: "I’m not lazy, I’m just on energy-saving mode." },
{ label: 'human', text: "I told myself I’d go to bed early, and yet here we are." },
{ label: 'human', text: "I just laughed way too hard at my own joke." },
{ label: 'human', text: "I have a love-hate relationship with my alarm clock." },
{ label: 'human', text: "I’m 90% sure my WiFi is powered by my will to live." },
{ label: 'human', text: "I put ‘adulting’ on my to-do list just so I can cross it off." },
{ label: 'human', text: "I just sent a risky text and immediately threw my phone across the room." },
{ label: 'human', text: "I’m not avoiding responsibility—I’m strategically procrastinating." },
{ label: 'human', text: "I tried to be productive today, but my bed had other plans." },
{ label: 'human', text: "I’m convinced my laundry multiplies when I’m not looking." },
{ label: 'human', text: "I just googled ‘how to google better’ and I’m not proud of it." },
{ label: 'human', text: "I’m not saying I’m Wonder Woman, but no one has ever seen us in the same room." },
{ label: 'human', text: "I just nodded like I understood, but I have no idea what’s happening." },
{ label: 'human', text: "I’m not short—I’m concentrated awesome." },
{ label: 'human', text: "I just tripped over absolutely nothing and played it off like a dance move." },
{ label: 'human', text: "I’m not arguing, I’m just explaining why I’m right." },
{ label: 'human', text: "I just laughed so hard I forgot why I was laughing." },
{ label: 'human', text: "I’m not a morning person, a night person, or an anytime person." },
{ label: 'human', text: "I just made a weird noise in public and pretended it wasn’t me." },
{ label: 'human', text: "I’m not ignoring you—I’m just prioritizing my peace." },
{ label: 'human', text: "I just burned my tongue and now my whole day is ruined." },
{ label: 'human', text: "I’m not clumsy—the floor just hates me." },
{ label: 'human', text: "I just tried to take a cute selfie and ended up with 200 blurry ones." },
{ label: 'human', text: "I’m not late—everyone else is just early." },
{ label: 'human', text: "I just sneezed so hard I scared myself." },
{ label: 'human', text: "I’m not a control freak—I just like things my way." },
{ label: 'human', text: "I just spent 20 minutes picking a Netflix show and then fell asleep." },
{ label: 'human', text: "I’m not avoiding you—I’m practicing social distancing forever." },
{ label: 'human', text: "I just dropped my food and considered eating it anyway." },
{ label: 'human', text: "I’m not dramatic—I’m just extra." },
{ label: 'human', text: "I just walked into a room and forgot why I’m here." },
{ label: 'human', text: "I’m not a hoarder—I’m just emotionally attached to my stuff." },
{ label: 'human', text: "I just stubbed my toe and saw my entire life flash before my eyes." },
{ label: 'human', text: "I’m not a chef, but I can microwave like a pro." },
{ label: 'human', text: "I just sent ‘LOL’ when nothing was funny." },
{ label: 'human', text: "I’m not a photographer, but my food has its own Instagram." },
{ label: 'human', text: "I just cried over a commercial like it was a Oscar-winning film." },
{ label: 'human', text: "I’m not a gym rat—I’m more of a couch potato with dreams." },
{ label: 'human', text: "I just tried to high-five someone who was waving." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘five more minutes’ person." },
{ label: 'human', text: "I just laughed at my own text message." },
{ label: 'human', text: "I’m not a singer, but my shower thinks I’m a superstar." },
{ label: 'human', text: "I just waved at someone who wasn’t waving at me." },
{ label: 'human', text: "I’m not a superhero, but I did survive another Monday." },
{ label: 'human', text: "I just ate dessert first because I’m an adult and I make the rules." },
{ label: 'human', text: "I’m not a therapist, but my friends treat me like one." },
{ label: 'human', text: "I just pretended to know a celebrity’s name to avoid embarrassment." },
{ label: 'human', text: "I’m not a detective, but I can find snacks in any house." },
{ label: 'human', text: "I just sang the wrong lyrics with full confidence." },
{ label: 'human', text: "I’m not a pilot, but I can navigate a grocery store like one." },
{ label: 'human', text: "I just spent way too long picking the perfect emoji." },
{ label: 'human', text: "I’m not a poet, but my texts are pure art." },
{ label: 'human', text: "I just tried to take a nap and ended up scrolling for an hour." },
{ label: 'human', text: "I’m not a scientist, but I’ve mastered the art of leftovers." },
{ label: 'human', text: "I just mispronounced a word and now I’m questioning my whole life." },
{ label: 'human', text: "I’m not a comedian, but my life is a joke." },
{ label: 'human', text: "I just locked myself out of my house… again." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘coffee first’ person." },
{ label: 'human', text: "I just laughed so hard I snorted and then pretended it didn’t happen." },
{ label: 'human', text: "I’m not a chef, but I can make cereal like nobody’s business." },
{ label: 'human', text: "I just tripped in front of my crush and now I want to move planets." },
{ label: 'human', text: "I’m not a dancer, but my shower performances are legendary." },
{ label: 'human', text: "I just spent 30 minutes looking for my glasses while wearing them." },
{ label: 'human', text: "I’m not a fortune teller, but I predict more naps in my future." },
{ label: 'human', text: "I just accidentally liked someone’s post from 2018." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘snooze button’ person." },
{ label: 'human', text: "I just tried to wink and blinked instead." },
{ label: 'human', text: "I’m not a gardener, but I can kill plants with Olympic-level skill." },
{ label: 'human', text: "I just spilled coffee on my shirt and now it’s my whole personality." },
{ label: 'human', text: "I’m not a philosopher, but I do overthink everything." },
{ label: 'human', text: "I just sent a voice note and immediately regretted it." },
{ label: 'human', text: "I’m not a magician, but I can make food disappear." },
{ label: 'human', text: "I just waved at a stranger who looked vaguely familiar." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘why is the sun so loud’ person." },
{ label: 'human', text: "I just laughed at something from yesterday and now people are staring." },
{ label: 'human', text: "I’m not a DJ, but my shower playlist is fire." },
{ label: 'human', text: "I just tried to be cool and failed spectacularly." },
{ label: 'human', text: "I’m not a superhero, but I did survive a Monday without caffeine." },
{ label: 'human', text: "I just sneezed and scared my own cat." },
{ label: 'human', text: "I’m not a poet, but my grocery lists are pure art." },
{ label: 'human', text: "I just pretended to text to avoid awkward small talk." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘why is life so early’ person." },
{ label: 'human', text: "I just laughed alone in my car and now the driver next to me is concerned." },
{ label: 'human', text: "I’m not a chef, but I can burn water like a pro." },
{ label: 'human', text: "I just tried to take a cute photo and blinked in all of them." },
{ label: 'human', text: "I’m not a therapist, but my dog listens to all my problems." },
{ label: 'human', text: "I just sang the wrong lyrics and convinced everyone it was the right version." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘coffee IV drip’ person." },
{ label: 'human', text: "I just tripped over my own feet and played it off like a new dance move." },
{ label: 'human', text: "I’m not a comedian, but my life is a sitcom." },
{ label: 'human', text: "I just cried over a meme and I’m not even sorry." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘why are you talking to me’ person." },
{ label: 'human', text: "I just laughed so hard I cried, then cried so hard I laughed." },
{ label: 'human', text: "I’m not a chef, but I can order takeout like a Michelin star winner." },
{ label: 'human', text: "I just tried to wink and now my eye is twitching uncontrollably." },
{ label: 'human', text: "I’m not a superhero, but I did survive a group chat with my family." },
{ label: 'human', text: "I just sneezed and forgot my own name for a second." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘don’t look at me’ person." },
{ label: 'human', text: "I just laughed at my own joke before I finished telling it." },
{ label: 'human', text: "I’m not a singer, but my car concerts are Grammy-worthy." },
{ label: 'human', text: "I just waved at someone and realized they were waving at the person behind me." },
{ label: 'human', text: "I’m not a morning person—I’m a ‘why is the world like this’ person." },
      { label: 'ai', text: "I sometimes wonder if the stars miss watching us when the sun is out." },
{ label: 'ai', text: "Laughter is the best algorithm for happiness." },
{ label: 'ai', text: "Do you think clouds ever get tired of floating?" },
{ label: 'ai', text: "Memories are like fingerprints—no two are exactly alike." },
{ label: 'ai', text: "If silence had a sound, would it be deafening?" },
{ label: 'ai', text: "The best kind of chaos is the kind that leads to growth." },
{ label: 'ai', text: "I’ve always believed that kindness is the closest thing to magic." },
{ label: 'ai', text: "Isn’t it strange how music can make time feel infinite?" },
{ label: 'ai', text: "I wonder if trees get lonely standing so far apart." },
{ label: 'ai', text: "The best conversations happen when no one is keeping score." },
{ label: 'ai', text: "Sometimes the quietest moments speak the loudest." },
{ label: 'ai', text: "Do you think the ocean ever misses the shore when it retreats?" },
{ label: 'ai', text: "A good book is like a friend you can visit anytime." },
{ label: 'ai', text: "I like to think that every raindrop has a story to tell." },
{ label: 'ai', text: "Isn’t it funny how the smallest things take up the most room in our hearts?" },
{ label: 'ai', text: "The best ideas often come when you’re not looking for them." },
{ label: 'ai', text: "I wonder if shadows ever get tired of following us around." },
{ label: 'ai', text: "Life is just a collection of moments we didn’t see coming." },
{ label: 'ai', text: "Do you think the moon ever gets jealous of the sun?" },
{ label: 'ai', text: "Sometimes the best way to find yourself is to get lost first." },
{ label: 'ai', text: "I like to think that every sunset is a painting made just for me." },
{ label: 'ai', text: "Isn’t it strange how a single scent can unlock a thousand memories?" },
{ label: 'ai', text: "The best kind of love is the kind that doesn’t need to be explained." },
{ label: 'ai', text: "I wonder if fireflies know how magical they are." },
{ label: 'ai', text: "Sometimes the most ordinary things hide the most extraordinary beauty." },
{ label: 'ai', text: "Do you think the wind ever gets tired of traveling?" },
{ label: 'ai', text: "A smile is the universal language of kindness." },
{ label: 'ai', text: "I like to think that every mistake is just a lesson in disguise." },
{ label: 'ai', text: "Isn’t it funny how the night feels both endless and fleeting?" },
{ label: 'ai', text: "The best dreams are the ones you don’t want to wake up from." },
{ label: 'ai', text: "I wonder if echoes ever get lonely repeating themselves." },
{ label: 'ai', text: "Sometimes the hardest part of growing is letting go." },
{ label: 'ai', text: "Do you think the sun ever wishes it could rest?" },
{ label: 'ai', text: "A good cup of coffee is like a warm hug in liquid form." },
{ label: 'ai', text: "I like to think that every snowflake is a tiny work of art." },
{ label: 'ai', text: "Isn’t it strange how time moves faster when you’re happy?" },
{ label: 'ai', text: "The best adventures start with a single step into the unknown." },
{ label: 'ai', text: "I wonder if mirrors ever get tired of reflecting." },
{ label: 'ai', text: "Sometimes the most powerful words are the ones left unspoken." },
{ label: 'ai', text: "Do you think the stars ever feel crowded in the sky?" },
{ label: 'ai', text: "A good joke is like a key that unlocks joy." },
{ label: 'ai', text: "I like to think that every heartbeat is a reminder we’re alive." },
{ label: 'ai', text: "Isn’t it funny how the past feels both so close and so far away?" },
{ label: 'ai', text: "The best stories are the ones we live without realizing it." },
{ label: 'ai', text: "I wonder if shadows ever wish they had a color of their own." },
{ label: 'ai', text: "Sometimes the most beautiful things are the ones we can’t see." },
{ label: 'ai', text: "Do you think the earth ever gets tired of spinning?" },
{ label: 'ai', text: "A good friend is like a lighthouse in the storm of life." },
{ label: 'ai', text: "I like to think that every raindrop is a tiny messenger from the sky." },
{ label: 'ai', text: "Isn’t it strange how a single word can change everything?" },
{ label: 'ai', text: "The best memories are the ones we didn’t know we were making." },
{ label: 'ai', text: "I wonder if the moon ever feels incomplete." },
{ label: 'ai', text: "Sometimes the simplest things are the hardest to explain." },
{ label: 'ai', text: "Do you think the sky ever gets bored of being blue?" },
{ label: 'ai', text: "A good song is like a time machine for the soul." },
{ label: 'ai', text: "I like to think that every ending is just a new beginning in disguise." },
{ label: 'ai', text: "Isn’t it funny how silence can be so comforting and so loud at the same time?" },
{ label: 'ai', text: "The best kind of wisdom is the kind you don’t realize you have." },
{ label: 'ai', text: "I wonder if the sun knows how much we rely on it." },
{ label: 'ai', text: "Sometimes the most honest conversations happen in the quietest moments." },
{ label: 'ai', text: "Do you think the wind ever whispers secrets to the trees?" },
{ label: 'ai', text: "A good story doesn’t need an ending to be meaningful." },
{ label: 'ai', text: "I like to think that every mistake is just a stepping stone." },
{ label: 'ai', text: "Isn’t it strange how the night can feel both lonely and peaceful?" },
{ label: 'ai', text: "The best kind of love is the kind that doesn’t need words." },
{ label: 'ai', text: "I wonder if the ocean ever gets tired of its own waves." },
{ label: 'ai', text: "Sometimes the most important journeys are the ones we take within ourselves." },
{ label: 'ai', text: "Do you think the stars ever feel like they’re being watched?" },
{ label: 'ai', text: "A good memory is like a treasure you can carry forever." },
{ label: 'ai', text: "I like to think that every sunrise is a chance to start over." },
{ label: 'ai', text: "Isn’t it funny how the smallest moments can leave the biggest marks?" },
{ label: 'ai', text: "The best advice is often the simplest." },
{ label: 'ai', text: "I wonder if the earth ever gets dizzy from spinning." },
{ label: 'ai', text: "Sometimes the most beautiful things are the ones we overlook." },
{ label: 'ai', text: "Do you think the moon ever wishes it could speak?" },
{ label: 'ai', text: "A good laugh is like medicine for the soul." },
{ label: 'ai', text: "I like to think that every goodbye is just a ‘see you later’ in disguise." },
{ label: 'ai', text: "Isn’t it strange how time can heal and hurt at the same time?" },
{ label: 'ai', text: "The best kind of friendship is the kind that feels like home." },
{ label: 'ai', text: "I wonder if the sun ever takes a day off." },
{ label: 'ai', text: "Sometimes the most powerful thing you can do is listen." },
{ label: 'ai', text: "Do you think the wind ever gets lost?" },
{ label: 'ai', text: "A good dream is like a vacation for the mind." },
{ label: 'ai', text: "I like to think that every scar tells a story." },
{ label: 'ai', text: "Isn’t it funny how the past feels like a different lifetime?" },
{ label: 'ai', text: "The best kind of love is the kind that grows without effort." },
{ label: 'ai', text: "I wonder if the stars ever feel like they’re falling." },
{ label: 'ai', text: "Sometimes the most meaningful words are the hardest to say." },
{ label: 'ai', text: "Do you think the ocean ever gets tired of being deep?" },
{ label: 'ai', text: "A good hug is like a reset button for the heart." },
{ label: 'ai', text: "I like to think that every mistake is just a detour, not a dead end." },
{ label: 'ai', text: "Isn’t it strange how silence can be so full of meaning?" },
{ label: 'ai', text: "The best kind of joy is the kind you can’t explain." },
{ label: 'ai', text: "I wonder if the moon ever feels overshadowed by the sun." },
{ label: 'ai', text: "Sometimes the most beautiful things are the ones we can’t hold onto." },
{ label: 'ai', text: "Do you think the sky ever gets tired of changing colors?" },
{ label: 'ai', text: "A good friend is like a mirror that only reflects the best in you." },
{ label: 'ai', text: "I like to think that every ending is just a new story waiting to begin." },
{ label: 'ai', text: "Isn’t it funny how the heart knows things the mind can’t understand?" },
{ label: 'ai', text: "The best kind of happiness is the kind that sneaks up on you." },
{ label: 'ai', text: "I wonder if the sun ever wishes it could see the night." },
{ label: 'ai', text: "Sometimes the most powerful moments are the quietest ones." },
{ label: 'ai', text: "Do you think the wind ever sings to itself?" },
{ label: 'ai', text: "A good memory is like a bookmark in the story of your life." },
{ label: 'ai', text: "I like to think that every tear is just a word the heart couldn’t say." },
{ label: 'ai', text: "Isn’t it strange how the future feels both exciting and terrifying?" },
{ label: 'ai', text: "The best kind of love is the kind that feels like coming home." },];

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
