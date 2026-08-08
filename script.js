/* ============================================================
   For my love — game logic
   ============================================================ */

"use strict";

/* ------------------------------------------------------------
   State & persistence (single organized localStorage key)
   ------------------------------------------------------------ */

const SAVE_KEY = "forMyLove.save.v1";

const defaultState = () => ({
  money: 0,
  coins: 0,
  love: 0,
  loveUnlocked: false,   // set by "Start dating"
  musicMuted: false,
  usedWords: [],         // good/bad keywords already spent
  letterClaimed: false,  // love letter +10 claimed
  purchased: [],         // shop item ids
  stage: "main",         // main | ticket | end
});

let state = defaultState();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    state = Object.assign(defaultState(), data);
    if (!Array.isArray(state.usedWords)) state.usedWords = [];
    if (!Array.isArray(state.purchased)) state.purchased = [];
    state.love = clampLove(state.love);
  } catch (e) {
    console.warn("Could not load save, starting fresh.", e);
    state = defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save.", e);
  }
}

function clampLove(v) {
  return Math.max(0, Math.min(100, Math.round(v)));
}

/* ------------------------------------------------------------
   Keyword lists
   ------------------------------------------------------------ */

const GOOD_WORDS = new Set([
  // looks
  "beautiful","gorgeous","pretty","cute","adorable","lovely","stunning","attractive",
  "hot","sexy","dreamy","radiant","glowing","breathtaking","dazzling","mesmerizing",
  "captivating","alluring","elegant","graceful","charming","enchanting","angelic",
  "flawless","photogenic","irresistible","cutie","beauty","goddess","model","gata","linda",
  // personality
  "kind","caring","sweet","smart","intelligent","funny","hilarious","witty","clever",
  "wise","gentle","loving","warm","thoughtful","patient","honest","loyal","generous",
  "creative","talented","brave","strong","supportive","understanding","inspiring",
  "motivating","silly","playful","fun","calm","peaceful","soothing","healing","genuine",
  "real","authentic","humble","selfless","ambitious","hardworking","determined",
  "resilient","courageous","passionate","devoted","faithful","tender","gifted","curious",
  "adventurous","spontaneous","optimistic","cheerful","bubbly","goofy","sincere",
  "trustworthy","dependable","reliable","protective","nurturing","empathetic","confident",
  "independent","classy","stylish","fashionable","organized","dedicated","considerate",
  // feelings & superlatives
  "amazing","wonderful","perfect","incredible","brilliant","magical","unique","special",
  "precious","marvelous","fantastic","fabulous","spectacular","extraordinary","phenomenal",
  "delightful","blissful","heavenly","divine","lovable","huggable","kissable","cuddly",
  "soft","best","favorite","irreplaceable","unforgettable","priceless","remarkable",
  "outstanding","exceptional","impressive","legendary","iconic","majestic","glorious",
  "wholesome","golden","magnificent","stellar","supreme","peerless","matchless","ideal",
  // romance & poetry
  "love","heart","soulmate","darling","treasure","everything","happiness","joy","comfort",
  "home","safe","angel","sunshine","queen","princess","sweetheart","honey","baby","babe",
  "dear","beloved","gem","jewel","pearl","diamond","gold","rose","flower","blossom",
  "butterfly","music","melody","harmony","poetry","art","masterpiece","muse","inspiration",
  "star","moon","universe","world","light","spark","fire","flame","glow","shine","sparkle",
  "dream","miracle","blessing","destiny","forever","always","eternal","endless","infinite",
  "boundless","unconditional","cherish","adore","admire","respect","trust","magic","fate",
  "paradise","serendipity","valentine","romance","romantic","lucky","blessed","complete",
  "whole","partner","teammate","bestfriend","confidant","haven","anchor","compass","north",
  // qualities you can love ("I love your ...")
  "humor","humour","kindness","patience","smile","laugh","laughter","giggle","giggles",
  "eyes","voice","hair","lips","dimples","freckles","blush","hugs","hug","kiss","kisses",
  "cuddles","cuddle","warmth","honesty","loyalty","courage","generosity","empathy",
  "compassion","intelligence","grace","charm","energy","positivity","vibe","vibes",
  "presence","company","personality","character","soul","mind","touch","style","cooking",
  "advice","wisdom","strength","dedication","effort","attention","affection","devotion",
  "care","tenderness","sweetness","gentleness","thoughtfulness","selflessness","jokes",
  "listener","optimism","enthusiasm","imagination","creativity","spirit","aura","glowup",
  // things you do / how you make me feel ("you make me feel ...")
  "listen","support","protect","comfort","encourage","motivate","inspire","appreciate",
  "appreciated","valued","wanted","needed","seen","heard","understood","loved","happy",
  "happier","alive","peace","peaceful","butterflies","smitten","cozy","snug","secure",
  "protected","cherished","adored","spoiled","grateful","thankful","proud","believe",
  "belong","complete","fulfilled","content","relaxed","excited","giddy","warm","free",
]);

const BAD_WORDS = new Set([
  "ugly","stupid","dumb","annoying","boring","lazy","mean","rude","hate","gross",
  "disgusting","horrible","terrible","awful","bad","worst","idiot","loser","weird",
  "creepy","selfish","cold","cruel","toxic","liar","fake","evil","nasty","trash",
  "garbage","pathetic","useless","worthless","dull","bland","obnoxious","irritating",
  "clingy","needy","crazy","psycho","witch","monster","demon","devil","nightmare",
  "disaster","jealous","petty","shallow","arrogant","cocky","bossy","nagging","whiny",
  "childish","immature","messy","gross","smelly","stinky","fat","hideous","repulsive",
  "unbearable","insufferable","dreadful","vile","wicked","heartless","soulless","bitter",
  "grumpy","moody","dramatic","exhausting","overrated","basic","cringe","mid","meh",
]);

/* ------------------------------------------------------------
   Love letter text  — edit LETTER_TEXT to change the letter ♥
   ------------------------------------------------------------ */

const LETTER_TEXT = `My dearest Lana,

If you are reading this, it means you found your way to the softest corner of this little sky I built for you. I wanted to make you something that no store could sell and no screen could copy — a small world where every cloud drifts just for you.

Do you remember how it all started? A message. Just words on a screen, and yet somehow they carried everything: the laughter, the late nights, the "one more minute" that always turned into hours. Distance drew a long line between Porto and Zagreb, but we kept folding that line smaller and smaller with every call, every game, every sleepy goodnight.

I love the way you laugh at your own jokes before you finish telling them. I love how you pretend not to care and then care more than anyone I have ever met. I love the little pause you take before saying something important, like the words need a running start. I love that being with you feels less like something new and more like something remembered — as if some part of me always knew you were out there.

They say long distance is hard, and they are right. But they never mention the secret: that missing someone this much is only possible when you have someone this worth missing. Every kilometre between us is just proof of how far love can stretch without breaking.

So here is my promise, written in this cartoon sky: I will keep choosing you. On the slow days and the loud days, through time zones and bad connections, through every "goodnight" that should have been a "stay". One day soon there will be no screen between us — just an airport, a runway, and me, running out of patience in the best possible way.

Until then, keep this little world close. The clouds will keep moving, the plane will keep waiting, and so will I.

Forever yours,
with all my heart ♥`;

/* ------------------------------------------------------------
   Shop items
   ------------------------------------------------------------ */

const SHOP_ITEMS = [
  {
    id: "texting",
    icon: "📱",
    title: "Start texting",
    desc: "Start talking on discord. +1€/s",
    cost: { coins: 10 },
    incomeMoney: 1,
  },
  {
    id: "calling",
    icon: "📞",
    title: "Start calling",
    desc: "You have been texting for a while! Time for an upgrade to voice! +2€/s",
    cost: { coins: 15 },
    incomeMoney: 2,
  },
  {
    id: "playing",
    icon: "🎮",
    title: "Start playing",
    desc: "It's a thing! You are close now, play some games together! +3€/s",
    cost: { coins: 15 },
    incomeMoney: 3,
  },
  {
    id: "dating",
    icon: "💗",
    title: "Start dating",
    desc: "You are closer than ever, time to take things to the next level! Tip: You can now earn hearts! +10❤️",
    cost: { coins: 10, money: 500 },
  },
  {
    id: "videocall",
    icon: "📹",
    title: "Start videocalling during bedtime",
    desc: "You are officially one, the only thing in the way now is the distance. +1❤️/s",
    cost: { love: 15 },   // requirement only — hearts are not taken away
    loveIsRequirementOnly: true,
    incomeLove: 1,
  },
  {
    id: "ticket",
    icon: "🎫",
    title: "The time has come, fly!",
    desc: "After so long, it's finally over, defeat the distance and be together.",
    cost: { money: 1500, love: 100 },
    loveIsRequirementOnly: true,
  },
];

/* ------------------------------------------------------------
   Sound engine (WebAudio, no files needed)
   ------------------------------------------------------------ */

const Sound = (() => {
  let ctx = null;

  function ensure() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { return null; }
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone(freqFrom, freqTo, dur, type = "sine", vol = 0.15, delay = 0) {
    const c = ensure();
    if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqFrom, t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, freqTo), t0 + dur);
    gain.gain.setValueAtTime(vol, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  return {
    unlock() { ensure(); },
    click()  { tone(600, 220, 0.09, "sine", 0.18); },
    open()   { tone(300, 620, 0.16, "sine", 0.14); tone(450, 900, 0.18, "sine", 0.07, 0.04); },
    close()  { tone(560, 240, 0.16, "sine", 0.14); },
    coin(n = 0) { tone(880, 1180, 0.1, "square", 0.06, n * 0.08); tone(1320, 1760, 0.12, "square", 0.05, n * 0.08 + 0.06); },
    heart()  { tone(520, 780, 0.18, "sine", 0.12); tone(660, 990, 0.2, "sine", 0.08, 0.07); },
    buy()    { tone(392, 392, 0.12, "triangle", 0.14); tone(494, 494, 0.12, "triangle", 0.14, 0.09); tone(587, 587, 0.2, "triangle", 0.14, 0.18); },
    error()  { tone(180, 110, 0.22, "sawtooth", 0.1); },
    takeoff() {
      tone(80, 420, 4.6, "sawtooth", 0.05);
      tone(110, 560, 4.6, "triangle", 0.06, 0.2);
    },
    tada() {
      [523, 659, 784, 1047].forEach((f, i) => tone(f, f, 0.35, "triangle", 0.12, i * 0.13));
    },
  };
})();

document.addEventListener("pointerdown", () => Sound.unlock(), { once: true });

/* ------------------------------------------------------------
   Background music (two tracks alternating, low volume)
   ------------------------------------------------------------ */

const Music = (() => {
  const VOL = 0.12;
  const FADE_MS = 3500;
  let dayTracks = [];
  let nightTrack = null;
  let dayIdx = 0;      // 0 = music.mp3, 1 = musicelectro.mp3
  let started = false;
  let night = false;
  let fadeTimer = null;

  function init() {
    dayTracks = [document.getElementById("music-a"), document.getElementById("music-b")];
    nightTrack = document.getElementById("music-night");
    nightTrack.loop = true; // the night mix loops until dawn
    dayTracks.forEach((t, i) => {
      t.volume = VOL;
      t.addEventListener("ended", () => {
        if (night || state.musicMuted) return;
        dayIdx = (i + 1) % dayTracks.length;
        fadeIn(dayTracks[dayIdx]);
      });
    });
  }

  function active() { return night ? nightTrack : dayTracks[dayIdx]; }

  function stopFade() { if (fadeTimer) { clearInterval(fadeTimer); fadeTimer = null; } }

  function fadeIn(t) {
    stopFade();
    t.volume = 0;
    const p = t.play();
    if (p) p.catch(() => {}); // autoplay may be blocked until interaction
    fadeTimer = setInterval(() => {
      t.volume = Math.min(VOL, t.volume + VOL / 20);
      if (t.volume >= VOL) stopFade();
    }, 100);
  }

  function crossfade(from, to, syncTime) {
    stopFade();
    // the night mix matches the electro track, so keep the playback position
    if (syncTime != null && !isNaN(to.duration) && to.duration > 0) {
      to.currentTime = syncTime % to.duration;
    }
    to.volume = 0;
    const p = to.play();
    if (p) p.catch(() => {});
    const steps = FADE_MS / 100;
    let i = 0;
    fadeTimer = setInterval(() => {
      i++;
      const k = Math.min(1, i / steps);
      to.volume = VOL * k;
      from.volume = VOL * (1 - k);
      if (k >= 1) {
        from.pause();
        stopFade();
      }
    }, 100);
  }

  function start() {
    if (started) return;
    started = true;
    if (!state.musicMuted) fadeIn(active());
  }

  function setNight(n) {
    if (night === n) return;
    night = n;
    if (!started || state.musicMuted) return;
    if (n) {
      const from = dayTracks[dayIdx];
      // electro (idx 1) has a matching night version — swap seamlessly in place
      const sync = dayIdx === 1 ? from.currentTime : 0;
      crossfade(from, nightTrack, sync);
    } else {
      // dawn: return to the electro day mix at the same position
      dayIdx = 1;
      crossfade(nightTrack, dayTracks[dayIdx], nightTrack.currentTime);
    }
  }

  function setMuted(m) {
    state.musicMuted = m;
    saveState();
    const btn = document.getElementById("music-toggle");
    btn.classList.toggle("muted", m);
    btn.textContent = m ? "🔇" : "🔊";
    stopFade();
    if (m) {
      [...dayTracks, nightTrack].forEach((t) => t.pause());
    } else if (started) {
      fadeIn(active());
    }
  }

  return { init, start, setMuted, setNight };
})();

Music.init();
document.addEventListener("pointerdown", () => Music.start(), { once: true });
document.getElementById("music-toggle").addEventListener("click", (e) => {
  e.stopPropagation();
  Music.setMuted(!state.musicMuted);
  Sound.click();
});

/* ------------------------------------------------------------
   DOM refs
   ------------------------------------------------------------ */

const $ = (sel) => document.querySelector(sel);

const el = {
  title: $("#title"),
  stats: $("#stats"),
  cards: $("#cards"),
  moneyValue: $("#money-value"),
  coinsValue: $("#coins-value"),
  loveValue: $("#love-value"),
  statMoney: $("#stat-money"),
  statCoins: $("#stat-coins"),
  statLove: $("#stat-love"),
  overlay: $("#modal-overlay"),
  earnForm: $("#earn-form"),
  earnInput: $("#earn-input"),
  earnFeedback: $("#earn-feedback"),
  letterText: $("#letter-text"),
  letterScroll: $("#letter-scroll"),
  letterClaim: $("#letter-claim"),
  shopScroll: $("#shop-scroll"),
  ticketStage: $("#ticket-stage"),
  ticket: $("#ticket"),
  ticketQr: $("#ticket-qr"),
  startJourney: $("#start-journey"),
  endOverlay: $("#end-overlay"),
  btnAgain: $("#btn-again"),
  plane: $("#plane"),
  airport: $("#airport"),
  flyers: $("#flyers"),
  fxLayer: $("#fx-layer"),
};

/* ------------------------------------------------------------
   Stats HUD
   ------------------------------------------------------------ */

function bump(elm) {
  elm.classList.remove("bump");
  void elm.offsetWidth; // restart animation
  elm.classList.add("bump");
}

function renderStats(animate = {}) {
  el.moneyValue.textContent = Math.floor(state.money).toLocaleString("en-US");
  el.coinsValue.textContent = state.coins;
  el.loveValue.textContent = state.love;
  el.statLove.classList.toggle("locked", state.love < 1);
  // clouds blush pink as love grows
  document.documentElement.style.setProperty(
    "--cloud-pink",
    `rgba(255, 107, 157, ${((state.love / 100) * 0.7).toFixed(3)})`
  );
  updateLoveUi();
  if (animate.money) bump(el.statMoney);
  if (animate.coins) bump(el.statCoins);
  if (animate.love) bump(el.statLove);
}

function updateLoveUi() {
  document.body.classList.toggle("love-on", state.loveUnlocked);
  const desc = document.getElementById("earn-desc-text");
  if (desc) {
    desc.textContent = state.loveUnlocked
      ? "Type reasons why you love me to earn coins and hearts!"
      : "Type reasons why you love me to earn coins!";
  }
}

function addMoney(n) {
  state.money += n;
  renderStats({ money: true });
}

function addCoins(n) {
  state.coins += n;
  renderStats({ coins: true });
}

function addLove(n) {
  const before = state.love;
  state.love = clampLove(state.love + n);
  if (state.love !== before) renderStats({ love: true });
}

/* ------------------------------------------------------------
   Flying coin / heart FX
   ------------------------------------------------------------ */

function flyToStat(kind, fromX, fromY, delay = 0) {
  const target = kind === "coin" ? el.statCoins : el.statLove;
  const rect = target.getBoundingClientRect();
  const toX = rect.left + rect.width / 2;
  const toY = rect.top + rect.height / 2;

  const node = document.createElement("div");
  if (kind === "coin") {
    node.className = "fx-coin";
    node.innerHTML = '<span class="coin-icon"></span>';
  } else {
    node.className = "fx-heart";
    node.textContent = "💗";
  }
  node.style.left = "0px";
  node.style.top = "0px";
  el.fxLayer.appendChild(node);

  const jumpX = fromX + (Math.random() * 60 - 30);
  const jumpY = fromY - 70 - Math.random() * 40;

  const anim = node.animate(
    [
      { transform: `translate(${fromX}px, ${fromY}px) scale(0.4)`, opacity: 0 },
      { transform: `translate(${jumpX}px, ${jumpY}px) scale(1.25)`, opacity: 1, offset: 0.3 },
      { transform: `translate(${(jumpX + toX) / 2}px, ${jumpY - 20}px) scale(1.1)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${toX}px, ${toY}px) scale(0.5)`, opacity: 0.9 },
    ],
    { duration: 950, delay, easing: "cubic-bezier(0.45, 0, 0.35, 1)", fill: "backwards" }
  );
  anim.onfinish = () => {
    node.remove();
    bump(kind === "coin" ? el.statCoins : el.statLove);
  };
}

/* ------------------------------------------------------------
   Modal system
   ------------------------------------------------------------ */

let activeModal = null;

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal || activeModal) return;
  activeModal = modal;
  Sound.open();
  el.overlay.classList.remove("hidden");
  modal.classList.add("opening");
  requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add("open")));
  if (id === "modal-shop") renderShop();
  if (id === "modal-letter") startLetterHearts();
  if (id === "modal-earn") setTimeout(() => el.earnInput.focus(), 350);
}

function closeModal() {
  if (!activeModal) return;
  const modal = activeModal;
  activeModal = null;
  Sound.close();
  modal.classList.remove("open");
  el.overlay.classList.add("hidden");
  stopLetterHearts();
  setTimeout(() => modal.classList.remove("opening"), 400);
}

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    Sound.click();
    openModal(card.dataset.modal);
  });
});
document.querySelectorAll(".modal-close").forEach((btn) =>
  btn.addEventListener("click", closeModal)
);
el.overlay.addEventListener("click", (e) => {
  if (e.target === el.overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* ------------------------------------------------------------
   Card 1 — Earn
   ------------------------------------------------------------ */

function normalizeWord(w) {
  return w
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}]/gu, "");
}

function showFeedback(text, cls) {
  const line = document.createElement("div");
  line.className = `feedback-line ${cls}`;
  line.textContent = text;
  el.earnFeedback.prepend(line);
  requestAnimationFrame(() => requestAnimationFrame(() => line.classList.add("show")));
  while (el.earnFeedback.children.length > 3) {
    el.earnFeedback.lastElementChild.remove();
  }
  setTimeout(() => {
    if (line.parentNode) {
      line.classList.remove("show");
      setTimeout(() => line.remove(), 450);
    }
  }, 6000);
}

/* live-rotating placeholder suggestions while the input is empty */
const EARN_SUGGESTIONS = [
  "You are so...",
  "You make me feel...",
  "With you I am...",
  "I love how you...",
  "I love your...",
  "When I'm with you...",
  "Your smile makes me...",
  "You always know how to...",
];
const earnPlaceholder = document.getElementById("earn-placeholder");
let suggestionIdx = 0;

setInterval(() => {
  if (el.earnInput.value !== "") return;
  earnPlaceholder.classList.add("swap");
  setTimeout(() => {
    suggestionIdx = (suggestionIdx + 1) % EARN_SUGGESTIONS.length;
    earnPlaceholder.textContent = EARN_SUGGESTIONS[suggestionIdx];
    earnPlaceholder.classList.remove("swap");
  }, 460);
}, 2800);

el.earnInput.addEventListener("input", () => {
  earnPlaceholder.classList.toggle("hide", el.earnInput.value !== "");
});

// drop the red outline once the shake animation is done
el.earnInput.addEventListener("animationend", () => el.earnInput.classList.remove("shake"));

el.earnForm.addEventListener("submit", (e) => {
  e.preventDefault();
  Sound.click();
  const phrase = el.earnInput.value.trim();
  if (!phrase) return;

  const words = [...new Set(phrase.split(/\s+/).map(normalizeWord).filter(Boolean))];
  const newGood = [];
  const newBad = [];
  let repeated = 0;

  for (const w of words) {
    if (GOOD_WORDS.has(w)) {
      if (state.usedWords.includes(w)) { repeated++; continue; }
      state.usedWords.push(w);
      newGood.push(w);
    } else if (BAD_WORDS.has(w)) {
      if (state.usedWords.includes(w)) { repeated++; continue; }
      state.usedWords.push(w);
      newBad.push(w);
    }
  }

  const inputRect = el.earnInput.getBoundingClientRect();
  const srcX = inputRect.left + inputRect.width / 2;
  const srcY = inputRect.top;

  if (newGood.length > 0) {
    addCoins(newGood.length);
    newGood.forEach((_, i) => {
      flyToStat("coin", srcX + (Math.random() * 120 - 60), srcY, i * 120);
      Sound.coin(i);
    });
    if (state.loveUnlocked) {
      addLove(newGood.length);
      newGood.forEach((_, i) => flyToStat("heart", srcX + (Math.random() * 120 - 60), srcY + 20, i * 140 + 200));
      Sound.heart();
    }
    const loveTxt = state.loveUnlocked ? ` and +${newGood.length} ❤️` : "";
    showFeedback(`Awww! +${newGood.length} 🪙${loveTxt} for: ${newGood.join(", ")}`, "good");
  }

  if (newBad.length > 0) {
    el.earnInput.classList.remove("shake");
    void el.earnInput.offsetWidth;
    el.earnInput.classList.add("shake");
    Sound.error();
    if (state.loveUnlocked) {
      addLove(-newBad.length);
      showFeedback(`Hey!! 😠 -${newBad.length} ❤️ for: ${newBad.join(", ")}`, "bad");
    } else {
      showFeedback(`Hey!! 😠 no coins for: ${newBad.join(", ")}`, "bad");
    }
  }

  if (newGood.length === 0 && newBad.length === 0) {
    if (repeated > 0) {
      showFeedback("You already told me that one! 😊 Try new words~", "neutral");
    } else {
      showFeedback("Hmm, tell me more… use words from the heart 💭", "neutral");
    }
  } else if (repeated > 0) {
    showFeedback(`(${repeated} word${repeated > 1 ? "s" : ""} already used before)`, "neutral");
  }

  saveState();
  el.earnInput.value = "";
  earnPlaceholder.classList.remove("hide");
  el.earnInput.focus();
});

/* ------------------------------------------------------------
   Card 2 — Love Letter
   ------------------------------------------------------------ */

el.letterText.textContent = LETTER_TEXT;

function renderLetterClaim() {
  if (state.letterClaimed) {
    el.letterClaim.disabled = true;
    el.letterClaim.innerHTML = "I love you too 💗 (claimed)";
  }
}

el.letterClaim.addEventListener("click", () => {
  if (state.letterClaimed) return;
  state.letterClaimed = true;
  Sound.buy();
  const rect = el.letterClaim.getBoundingClientRect();
  addCoins(10);
  for (let i = 0; i < 10; i++) {
    flyToStat("coin", rect.left + rect.width / 2 + (Math.random() * 100 - 50), rect.top, i * 90);
    if (i < 4) Sound.coin(i);
  }
  renderLetterClaim();
  saveState();
});

/* hearts floating off the letter card while open */
let heartTimer = null;

function startLetterHearts() {
  stopLetterHearts();
  heartTimer = setInterval(() => {
    const modal = document.getElementById("modal-letter");
    if (!modal.classList.contains("open")) return;
    const r = modal.getBoundingClientRect();
    const side = Math.floor(Math.random() * 4);
    let x, y;
    if (side === 0) { x = r.left + Math.random() * r.width; y = r.top; }
    else if (side === 1) { x = r.left + Math.random() * r.width; y = r.bottom; }
    else if (side === 2) { x = r.left; y = r.top + Math.random() * r.height; }
    else { x = r.right; y = r.top + Math.random() * r.height; }

    const h = document.createElement("div");
    h.className = "float-heart";
    h.textContent = ["💗", "💕", "💖", "🩷", "❤️"][Math.floor(Math.random() * 5)];
    h.style.left = "0px";
    h.style.top = "0px";
    document.body.appendChild(h);

    const driftX = x + (Math.random() * 140 - 70) + (side === 2 ? -80 : side === 3 ? 80 : 0);
    const driftY = y - 120 - Math.random() * 100;
    const anim = h.animate(
      [
        { transform: `translate(${x}px, ${y}px) scale(0.3) rotate(0deg)`, opacity: 0 },
        { transform: `translate(${(x + driftX) / 2}px, ${(y + driftY) / 2}px) scale(1) rotate(${Math.random() * 40 - 20}deg)`, opacity: 0.9, offset: 0.4 },
        { transform: `translate(${driftX}px, ${driftY}px) scale(0.6) rotate(${Math.random() * 60 - 30}deg)`, opacity: 0 },
      ],
      { duration: 2600 + Math.random() * 1200, easing: "ease-out" }
    );
    anim.onfinish = () => h.remove();
  }, 380);
}

function stopLetterHearts() {
  if (heartTimer) { clearInterval(heartTimer); heartTimer = null; }
}

/* ------------------------------------------------------------
   Card 3 — Shop
   ------------------------------------------------------------ */

function costLabel(cost) {
  const parts = [];
  if (cost.coins) parts.push(`${cost.coins} <span class="coin-icon"></span>`);
  if (cost.money) parts.push(`${cost.money}€`);
  if (cost.love) parts.push(`${cost.love}❤️`);
  return parts.join(" + ");
}

function canAfford(item) {
  const c = item.cost;
  if (c.coins && state.coins < c.coins) return false;
  if (c.money && state.money < c.money) return false;
  if (c.love && state.love < c.love) return false;
  return true;
}

function isUnlocked(item) {
  const idx = SHOP_ITEMS.indexOf(item);
  return idx === 0 || state.purchased.includes(SHOP_ITEMS[idx - 1].id);
}

const CONVERT_COST = 500; // € per ❤️

function renderShop() {
  el.shopScroll.innerHTML = "";

  if (state.loveUnlocked) {
    const conv = document.createElement("div");
    conv.className = "shop-converter";
    const full = state.love >= 100;
    conv.innerHTML = `
      <div class="converter-info">
        <span class="converter-title">💱 Love converter</span>
        <span class="converter-desc">Turn your savings into feelings — ${CONVERT_COST}€ per ❤️</span>
      </div>
      <button class="btn converter-btn" id="converter-btn" ${state.money < CONVERT_COST || full ? "disabled" : ""}>
        ${full ? "❤️ is full!" : `${CONVERT_COST}€ → 1❤️`}
      </button>
    `;
    el.shopScroll.appendChild(conv);
  }

  for (const item of SHOP_ITEMS) {
    const bought = state.purchased.includes(item.id);
    const unlocked = isUnlocked(item);
    const row = document.createElement("div");
    row.className = "shop-item" + (bought ? " bought" : "") + (!bought && !unlocked ? " locked" : "");
    const btnLabel = bought
      ? "Purchased ✓"
      : !unlocked
        ? "🔒 Locked"
        : `<span class="shop-cost">${costLabel(item.cost)}</span>`;
    row.innerHTML = `
      <div class="shop-item-icon">${item.icon}</div>
      <div class="shop-item-title">${item.title}</div>
      <button class="btn btn-gold shop-item-buy" data-id="${item.id}" ${bought || !unlocked || !canAfford(item) ? "disabled" : ""}>
        ${btnLabel}
      </button>
      <div class="shop-item-desc">${!bought && !unlocked ? "Unlock the previous step of our story first…" : item.desc}</div>
    `;
    el.shopScroll.appendChild(row);
  }
}

el.shopScroll.addEventListener("click", (e) => {
  const convBtn = e.target.closest("#converter-btn");
  if (convBtn && !convBtn.disabled) {
    if (state.money < CONVERT_COST || state.love >= 100) { Sound.error(); return; }
    state.money -= CONVERT_COST;
    Sound.heart();
    addLove(1);
    renderStats({ money: true });
    const r = convBtn.getBoundingClientRect();
    flyToStat("heart", r.left + r.width / 2, r.top);
    saveState();
    renderShop();
    return;
  }
  const btn = e.target.closest(".shop-item-buy");
  if (!btn || btn.disabled) return;
  buyItem(btn.dataset.id);
});

function buyItem(id) {
  const item = SHOP_ITEMS.find((i) => i.id === id);
  if (!item || state.purchased.includes(id) || !isUnlocked(item) || !canAfford(item)) {
    Sound.error();
    return;
  }

  // pay
  if (item.cost.coins) state.coins -= item.cost.coins;
  if (item.cost.money) state.money -= item.cost.money;
  if (item.cost.love && !item.loveIsRequirementOnly) state.love = clampLove(state.love - item.cost.love);

  state.purchased.push(id);
  Sound.buy();
  renderStats({ money: true, coins: true });

  if (id === "dating") {
    state.loveUnlocked = true;
    addLove(10);
    const r = el.shopScroll.getBoundingClientRect();
    for (let i = 0; i < 10; i++) {
      flyToStat("heart", r.left + Math.random() * r.width, r.top + 60, i * 110);
    }
    Sound.heart();
  }

  saveState();
  renderShop();

  if (id === "ticket") {
    setTimeout(startTicketStage, 500);
  }
}

/* ------------------------------------------------------------
   Income tick (every second)
   ------------------------------------------------------------ */

function incomePerSecond() {
  let money = 0;
  let love = 0;
  for (const item of SHOP_ITEMS) {
    if (!state.purchased.includes(item.id)) continue;
    if (item.incomeMoney) money += item.incomeMoney;
    if (item.incomeLove) love += item.incomeLove;
  }
  return { money, love };
}

setInterval(() => {
  if (state.stage !== "main") return;
  const inc = incomePerSecond();
  let dirty = false;
  if (inc.money > 0) { addMoney(inc.money); dirty = true; }
  if (inc.love > 0 && state.love < 100) { addLove(inc.love); dirty = true; }
  if (dirty) {
    saveState();
    if (activeModal && activeModal.id === "modal-shop") renderShop();
  }
}, 1000);

/* ------------------------------------------------------------
   Background flyers (planes & birds)
   ------------------------------------------------------------ */

const PLANE_SVG = `
  <svg viewBox="0 0 150 74" xmlns="http://www.w3.org/2000/svg">
    <path d="M 26 34 Q 22 16 34 8 Q 44 14 46 26 L 48 36 Z" fill="#9bd1ff" stroke="#3b4a6b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 26 42 L 8 52 Q 20 54 32 50 L 40 44 Z" fill="#bfe6ff" stroke="#3b4a6b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 22 40 Q 22 28 48 26 L 102 25 Q 132 26 143 38 Q 134 50 102 52 L 48 52 Q 22 50 22 40 Z" fill="#ffffff" stroke="#3b4a6b" stroke-width="3" stroke-linejoin="round"/>
    <path d="M 27 45 Q 60 51 110 50 Q 130 48 139 41 Q 132 49 102 52 L 48 52 Q 30 50 27 45 Z" fill="#ffb8c8"/>
    <path d="M 124 30 Q 134 32 138 37 Q 130 36 122 35 Q 121 32 124 30 Z" fill="#3b4a6b"/>
    <circle cx="96" cy="35" r="4.4" fill="#bfe6ff" stroke="#3b4a6b" stroke-width="2.5"/>
    <circle cx="79" cy="35" r="4.4" fill="#bfe6ff" stroke="#3b4a6b" stroke-width="2.5"/>
    <circle cx="62" cy="35" r="4.4" fill="#bfe6ff" stroke="#3b4a6b" stroke-width="2.5"/>
    <path d="M 64 44 L 40 66 Q 58 66 74 60 L 90 46 Z" fill="#9bd1ff" stroke="#3b4a6b" stroke-width="3" stroke-linejoin="round"/>
    <ellipse cx="88" cy="53" rx="11" ry="6.5" fill="#ffb8c8" stroke="#3b4a6b" stroke-width="3"/>
    <ellipse cx="79" cy="53" rx="2.6" ry="4.2" fill="#3b4a6b"/>
  </svg>`;

const BIRD_SVG = `
  <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="30" cy="24" rx="14" ry="9" fill="#ffd166" stroke="#3b4a6b" stroke-width="2.5"/>
    <circle cx="42" cy="18" r="7" fill="#ffd166" stroke="#3b4a6b" stroke-width="2.5"/>
    <path d="M 48 17 L 56 19 L 48 22 Z" fill="#ff8c42" stroke="#3b4a6b" stroke-width="2"/>
    <circle cx="44" cy="16" r="1.6" fill="#3b4a6b"/>
    <path class="bird-wing" d="M 28 22 Q 20 6 34 10 Q 38 16 32 24 Z" fill="#f4a940" stroke="#3b4a6b" stroke-width="2.5"/>
  </svg>`;

const GOLD_PLANE_SVG = PLANE_SVG
  .replace(/#ffffff/g, "#ffe9a8")
  .replace(/#9bd1ff/g, "#ffd75e")
  .replace(/#bfe6ff/g, "#fff3c4")
  .replace(/#ffb8c8/g, "#ffbe3d");

const BANNER_TEXTS = [
  "I love you!",
  "Lana ♥",
  "OPO → ZAG",
  "You + Me",
  "Miss you!",
  "My love ♥",
  "Forever us",
];

function spawnFlyer(forceKind) {
  // kinds: bird | plane | golden | banner
  let kind = forceKind;
  if (!kind) {
    if (Math.random() >= 0.45) kind = "bird";
    else {
      const r = Math.random();
      kind = r < 0.28 ? "golden" : r < 0.5 ? "banner" : "plane";
    }
  }
  // birds sleep at night — send a plane instead
  if (kind === "bird" && document.body.classList.contains("phase-night")) kind = "plane";
  const isBird = kind === "bird";
  const goingRight = Math.random() < 0.5;
  const size = isBird ? 26 + Math.random() * 22 : 55 + Math.random() * 60;
  // golden planes stay high so they aren't hidden behind the cards
  const y = kind === "golden"
    ? 40 + Math.random() * (window.innerHeight * 0.22)
    : 40 + Math.random() * (window.innerHeight * 0.55);
  const tilt = (Math.random() * 16 - 8) * (goingRight ? 1 : -1); // up = taking off, down = landing
  const dur = (isBird ? 16000 : 11000) + Math.random() * 9000;

  const f = document.createElement("div");
  f.className = "flyer" + (kind === "golden" ? " golden" : "");
  const svgHtml = isBird ? BIRD_SVG : kind === "golden" ? GOLD_PLANE_SVG : PLANE_SVG;
  // planes get red/green navigation strobes (visible at night)
  const body = isBird
    ? svgHtml
    : `<span class="plane-body">${svgHtml}<span class="nav-light nl-red"></span><span class="nav-light nl-green"></span></span>`;

  if (kind === "banner") {
    const text = BANNER_TEXTS[Math.floor(Math.random() * BANNER_TEXTS.length)];
    const banner = `<div class="flyer-banner" style="font-size:${Math.round(size * 0.17)}px">${text}</div>`;
    const rope = `<div class="flyer-rope"></div>`;
    // the banner trails behind the plane
    f.innerHTML = goingRight ? banner + rope + body : body + rope + banner;
  } else {
    f.innerHTML = body;
  }

  f.style.top = "0px";
  f.style.left = "0px";
  const svg = f.querySelector("svg");
  svg.style.width = size + "px";
  if (!goingRight) svg.style.transform = "scaleX(-1)"; // flip the plane only, not the banner text
  el.flyers.appendChild(f);

  if (kind === "golden") {
    f.addEventListener("click", (e) => {
      if (f.classList.contains("collected")) return;
      f.classList.add("collected");
      Sound.coin();
      Sound.coin(1);
      addCoins(2);
      flyToStat("coin", e.clientX, e.clientY);
      flyToStat("coin", e.clientX, e.clientY, 130);
      saveState();
    });
  }

  const startX = goingRight ? -size - 260 : window.innerWidth + 40;
  const endX = goingRight ? window.innerWidth + 40 : -size - 260;
  const dir = goingRight ? 1 : -1;
  const endY = y - Math.tan((tilt * Math.PI) / 180) * (endX - startX) * 0.35 * dir;

  const anim = f.animate(
    [
      { transform: `translate(${startX}px, ${y}px) rotate(${-tilt * dir}deg)` },
      { transform: `translate(${endX}px, ${endY}px) rotate(${-tilt * dir}deg)` },
    ],
    { duration: dur, easing: "linear" }
  );
  anim.onfinish = () => f.remove();
  return f;
}

window.__spawnFlyer = spawnFlyer; // used by the automated tests

function scheduleFlyers() {
  const next = 8000 + Math.random() * 14000;
  setTimeout(() => {
    spawnFlyer();
    scheduleFlyers();
  }, next);
}

/* ------------------------------------------------------------
   Plane thought bubble
   ------------------------------------------------------------ */

const THOUGHTS = [
  "I'm coming!",
  "Hang in there!",
  "Almost there!",
  "Can't wait!",
  "Zagreb awaits!",
  "Soon, my love ♥",
  "Counting the days…",
  "Fueled up and ready!",
];
let cutsceneRunning = false;

function showThought() {
  const bubble = document.getElementById("plane-thought");
  document.getElementById("thought-text").textContent =
    THOUGHTS[Math.floor(Math.random() * THOUGHTS.length)];
  bubble.classList.add("show");
  setTimeout(() => bubble.classList.remove("show"), 3800);
}
window.__showThought = showThought; // used by the automated tests

function scheduleThoughts() {
  setTimeout(() => {
    if (state.stage !== "end" && !cutsceneRunning) showThought();
    scheduleThoughts();
  }, 9000 + Math.random() * 10000);
}

/* ------------------------------------------------------------
   Ticket stage & final cutscene
   ------------------------------------------------------------ */

function buildQr() {
  // deterministic fake QR: finder squares + pseudo-random modules
  el.ticketQr.innerHTML = "";
  let seed = 2803; // OPO→ZAG ;)
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const N = 21;
  const finder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
  const finderOn = (r, c) => {
    const lr = r < 7 ? r : r - (N - 7);
    const lc = c < 7 ? c : c - (N - 7);
    const border = lr === 0 || lr === 6 || lc === 0 || lc === 6;
    const core = lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4;
    return border || core;
  };
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const cell = document.createElement("span");
      const on = finder(r, c) ? finderOn(r, c) : rand() < 0.45;
      if (on) cell.classList.add("on");
      el.ticketQr.appendChild(cell);
    }
  }
}

function hideMainUi() {
  closeModal();
  [el.title, el.stats, el.cards].forEach((n) => n.classList.add("fade-out"));
}

function startTicketStage() {
  state.stage = "ticket";
  saveState();
  hideMainUi();
  buildQr();
  Sound.tada();
  el.ticketStage.classList.remove("hidden");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      el.ticket.classList.add("landed");
      setTimeout(() => el.startJourney.classList.remove("hidden"), 1100);
    })
  );
}

el.startJourney.addEventListener("click", () => {
  Sound.click();
  startCutscene();
});

function startCutscene() {
  state.stage = "end";
  cutsceneRunning = true;
  document.getElementById("plane-thought").classList.remove("show");
  saveState();

  // everything UI fades away, only scenery stays
  el.ticketStage.classList.add("fade-out");
  hideMainUi();

  setTimeout(() => {
    el.ticketStage.classList.add("hidden");
    Sound.takeoff();

    // plane rolls down the runway then lifts off and flies out of the screen
    // in one continuous accelerating motion (single easing over the whole path)
    el.plane.classList.add("no-idle");
    const W = window.innerWidth;
    const H = window.innerHeight;
    // dense keyframes so speed AND rotation ramp gradually — no snappy turns
    const anim = el.plane.animate(
      [
        { transform: "translate(0px, 0px) rotate(0deg)" },
        { transform: "translate(150px, 0px) rotate(0deg)", offset: 0.30 },
        { transform: "translate(230px, -2px) rotate(-3deg)", offset: 0.45 },
        { transform: "translate(330px, -16px) rotate(-8deg)", offset: 0.58 },
        { transform: "translate(460px, -58px) rotate(-13deg)", offset: 0.70 },
        { transform: "translate(620px, -135px) rotate(-17deg)", offset: 0.80 },
        { transform: "translate(820px, -255px) rotate(-20deg)", offset: 0.88 },
        { transform: `translate(${W + 400}px, -${H + 350}px) rotate(-23deg)` },
      ],
      { duration: 5600, easing: "cubic-bezier(0.42, 0.05, 0.88, 0.45)", fill: "forwards" }
    );

    anim.onfinish = () => {
      el.plane.style.visibility = "hidden";
      showEndScreen();
    };
  }, 800);
}

function showEndScreen() {
  el.endOverlay.classList.remove("hidden");
  Sound.tada();
  const lines = el.endOverlay.querySelectorAll(".end-line");
  lines.forEach((line, i) => {
    setTimeout(() => line.classList.add("show"), 500 + i * 1100);
  });
}

el.btnAgain.addEventListener("click", () => {
  Sound.click();
  localStorage.removeItem(SAVE_KEY);
  location.reload();
});

/* ------------------------------------------------------------
   Day → evening → dusk → night cycle
   ------------------------------------------------------------ */

const PHASES = [
  ["day", 70000],
  ["evening", 20000],
  ["dusk", 18000],
  ["night", 55000],
  ["evening", 12000], // dawn
];

function setPhase(name) {
  document.body.classList.remove("phase-day", "phase-evening", "phase-dusk", "phase-night");
  document.body.classList.add("phase-" + name);
  Music.setNight(name === "night");
}
window.__setPhase = setPhase; // used by the automated tests

function runDayCycle(i = 0) {
  setPhase(PHASES[i][0]);
  setTimeout(() => runDayCycle((i + 1) % PHASES.length), PHASES[i][1]);
}

function buildStars() {
  const stars = document.getElementById("stars");
  for (let i = 0; i < 70; i++) {
    const s = document.createElement("span");
    s.className = "star";
    const size = 1.5 + Math.random() * 2.2;
    s.style.width = size + "px";
    s.style.height = size + "px";
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.animationDuration = 1 + Math.random() * 2.4 + "s";
    s.style.animationDelay = -Math.random() * 3 + "s";
    stars.appendChild(s);
  }
}

/* ------------------------------------------------------------
   Wavey bouncy title (split into per-letter spans)
   ------------------------------------------------------------ */

function waveTitle() {
  const text = el.title.textContent;
  el.title.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "title-letter";
    span.innerHTML = ch === " " ? "&nbsp;" : ch;
    span.style.animationDelay = `${i * 0.09}s`;
    el.title.appendChild(span);
  });
}

/* ------------------------------------------------------------
   Ambient rising hearts — intensity grows with shop progress
   ------------------------------------------------------------ */

const risingHearts = document.getElementById("rising-hearts");

function spawnRisingHeart() {
  const size = 13 + Math.random() * 22;
  const x = Math.random() * window.innerWidth;
  const drift = Math.random() * 120 - 60;
  const dur = 8000 + Math.random() * 8000;

  const h = document.createElement("div");
  h.className = "rise-heart";
  h.textContent = ["💗", "💕", "💖", "🩷", "❤️", "💘"][Math.floor(Math.random() * 6)];
  h.style.fontSize = size + "px";
  h.style.left = "0px";
  h.style.top = "0px";
  risingHearts.appendChild(h);

  const anim = h.animate(
    [
      { transform: `translate(${x}px, ${window.innerHeight + 50}px) rotate(-8deg)`, opacity: 0 },
      { opacity: 0.35 + Math.random() * 0.3, offset: 0.12 },
      { transform: `translate(${x + drift * 0.5}px, ${window.innerHeight * 0.45}px) rotate(8deg)`, offset: 0.5 },
      { opacity: 0.4, offset: 0.85 },
      { transform: `translate(${x + drift}px, -70px) rotate(-6deg)`, opacity: 0 },
    ],
    { duration: dur, easing: "linear" }
  );
  anim.onfinish = () => h.remove();
}

function scheduleRisingHearts() {
  const progress = state.purchased.length; // 0..6
  // no hearts before the first purchase; then ramp up gently
  const delay = progress === 0 ? 2500 : Math.max(1400, 7500 - progress * 1050) * (0.7 + Math.random() * 0.6);
  setTimeout(() => {
    if (state.purchased.length > 0) spawnRisingHeart();
    scheduleRisingHearts();
  }, delay);
}

/* ------------------------------------------------------------
   Restore progress on load
   ------------------------------------------------------------ */

function restore() {
  loadState();
  renderStats();
  renderLetterClaim();
  Music.setMuted(state.musicMuted);

  if (state.stage === "ticket") {
    hideMainUi();
    buildQr();
    el.ticketStage.classList.remove("hidden");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.ticket.classList.add("landed");
        setTimeout(() => el.startJourney.classList.remove("hidden"), 900);
      })
    );
  } else if (state.stage === "end") {
    hideMainUi();
    el.ticketStage.classList.add("hidden");
    el.plane.style.visibility = "hidden";
    showEndScreen();
  }
}

restore();
waveTitle();
buildStars();
runDayCycle();
scheduleFlyers();
scheduleRisingHearts();
scheduleThoughts();
