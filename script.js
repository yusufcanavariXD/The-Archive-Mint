const LEVELS = [
  { title: "First Edges", desc: "Read the first letter of each line from bottom to top.", box: "Every lock has a key.\nDoors open slowly.\nOnly the patient see.\nClues hide in plain sight.", hint: "Take E, D, O, C and read upward.", answer: "CODE" },
  { title: "Odd One Out", desc: "Every word shares a theme except one. Enter the odd one out.", box: "FIREFOX   CHROMIUM   BRAVE   LINUX   SAFARI", hint: "Four are web browsers. One is an OS kernel.", answer: "LINUX" },
  { title: "Keyboard Shift", desc: "Each letter was typed one key to the RIGHT on a QWERTY keyboard. Shift one key LEFT.", box: "L R U", hint: "Left of L is K, left of R is E, left of U is Y.", answer: "KEY" },
  { title: "Mirror Math", desc: "Solve the math, then reverse the digits like a mirror.", box: "(100 x 3) + 17 = ?", hint: "300 + 17 is 317. Flip the digits.", answer: "713" },
  { title: "Missing Vowel", desc: "Only one English vowel (A, E, I, O, U) is missing from the line below.", box: "THE QUICK BROWN FOX JUMPS OVER A LAZY DOG.", hint: "Check each vowel: A, E, O, U are there. Which one is gone?", answer: "I" },
  { title: "Filter the True", desc: "Keep only the records where valid is true, in order.", box: '[\n  { "valid": false, "ch": "Z" },\n  { "valid": true,  "ch": "M" },\n  { "valid": true,  "ch": "I" },\n  { "valid": false, "ch": "Q" },\n  { "valid": true,  "ch": "N" },\n  { "valid": true,  "ch": "T" }\n]', hint: "Skip Z and Q, join the remaining four letters.", answer: "MINT" },
  { title: "Hidden Attribute", desc: "Open DevTools (Ctrl+Shift+I) and inspect the text inside the box below.", box: '<span id="secret-node" data-unlock="SHADOW">Nothing to see here.</span>', hint: "Right-click the text -> Inspect, and check data-unlock.", answer: "SHADOW" },
  { title: "Invisible Ink", desc: "A hidden word is sitting inside the box below, painted the same color as the background.", box: 'WORD: <span style="color:#0e1117; user-select:all;">GHOST</span>', hint: "Highlight the empty space after WORD: with your mouse.", answer: "GHOST" },
  { title: "CSS Specificity", desc: "Three CSS rules target the word below. Which color name wins?", box: '<div id="trap-word" class="trap-word">WINNER</div>\n\nRules:\n.trap-word { color: red; }\n#trap-word { color: blue; }\n#trap-word.trap-word { color: green; }', hint: "ID + Class (110 pts) beats ID (100) and Class (10).", answer: "GREEN" },
  { title: "Console Whisper", desc: "This page just logged a secret message to your Developer Console.", box: "Open DevTools -> Console tab to read the message.", hint: "Press Ctrl+Shift+I and click Console.", onEnter: function() { console.log("%c[ARCHIVE] Level 10 Answer: TERMINAL", "color:#38bdf8;font-weight:bold;"); }, answer: "TERMINAL" },
  { title: "Hexadecimal Bytes", desc: "Convert these four hex ASCII bytes into uppercase letters (41 = A, 50 = P).", box: "42 59 54 45", hint: "42=B, 59=Y, 54=T, 45=E.", answer: "BYTE" },
  { title: "Not Encryption", desc: "Decode this Base64 string into plain English text.", box: "Q0lQSEVS", hint: "Decode by hand or run atob('Q0lQSEVS') in Console.", answer: "CIPHER" },
  { title: "Caesar +3", desc: "Each letter was shifted 3 places FORWARD in the alphabet. Shift 3 places BACK.", box: "Y D X O W", hint: "Y minus 3 is V. D minus 3 is A.", answer: "VAULT" },
  { title: "Spiral Grid", desc: "Start top-left, go clockwise around the outer ring, and finish in the center.", box: "M  A  T\nX  S  R\nI  R  E", hint: "M-A-T -> R-E -> R-I -> X -> S.", answer: "MATRERIXS" },
  { title: "Binary Nibbles", desc: "Convert each 8-bit binary number to decimal, then map 1=A, 2=B ... 26=Z.", box: "00001110   00001111   00000100   00000101", hint: "8+4+2 = 14 (N), 15 (O), 4 (D), 5 (E).", answer: "NODE" },
  { title: "URL Fragment", desc: "Check your browser address bar! Apply the #pick instruction to the row below (counting from 1).", box: "ALPHA  /  BRAVO  /  VECTOR  /  DELTA", hint: "Look at #pick=3 in the URL bar: pick the 3rd word.", onEnter: function() { history.replaceState(null, "", "#pick=3"); }, answer: "VECTOR" },
  { title: "Browser Memory", desc: "A key was saved inside Local Storage. Find the value of 'archive_key'.", box: "Open DevTools -> Storage -> Local Storage.", hint: "In Firefox DevTools, check the Storage tab.", onEnter: function() { localStorage.setItem("archive_key", "KERNEL"); }, answer: "KERNEL" },
  { title: "Window Title", desc: "Look above the webpage itself—at your Firefox tab title.", box: "The browser tab holds a 6-letter password in brackets.", hint: "Look at the very top of your active browser tab.", onEnter: function() { document.title = "[PACKET] — THE ARCHIVE"; }, answer: "PACKET" },
  { title: "Layered Encoding", desc: "First decode the Hex into ASCII text, then decode that result from Base64.", box: "55 6b 39 50 56 41 3d 3d", hint: "The hex becomes 'Uk9PVA=='. Now Base64-decode it.", answer: "ROOT" },
  { title: "THE FINAL GATE (BOSS)", desc: "Combine the FIRST letters of Level 6 (MINT), Level 5 (I), Level 15 (NODE), and Level 10 (TERMINAL).", box: "L6 + L5 + L15 + L10 = ?", hint: "M + I + N + T.", answer: "MINT" }
];

let current = parseInt(localStorage.getItem("archive_progress") || "0", 10);
if (current < 0 || current >= LEVELS.length) current = 0;

const trackEl = document.getElementById("progress-track");
const entryLabel = document.getElementById("entry-label");
const tierBadge = document.getElementById("tier-badge");
const titleEl = document.getElementById("level-title");
const descEl = document.getElementById("level-desc");
const boxEl = document.getElementById("puzzle-box");
const formEl = document.getElementById("answer-form");
const inputEl = document.getElementById("answer-input");
const statusEl = document.getElementById("status-msg");
const hintBox = document.getElementById("hint-box");

function renderBar() {
  trackEl.innerHTML = "";
  for (let i = 0; i < LEVELS.length; i++) {
    const seg = document.createElement("div");
    seg.className = "segment";
    if (i < current) {
      if (i < 5) seg.classList.add("done-1");
      else if (i < 10) seg.classList.add("done-2");
      else if (i < 15) seg.classList.add("done-3");
      else seg.classList.add("done-4");
    }
    trackEl.appendChild(seg);
  }
}

function loadLevel() {
  document.title = "THE ARCHIVE — 20 Web Puzzles";
  if (window.location.hash) history.replaceState(null, "", window.location.pathname);
  statusEl.textContent = "";
  hintBox.style.display = "none";
  inputEl.value = "";
  renderBar();

  if (current >= LEVELS.length) {
    entryLabel.textContent = "COMPLETE — 20 / 20";
    tierBadge.textContent = "MASTERED";
    tierBadge.style.background = "#a855f7";
    tierBadge.style.color = "#fff";
    titleEl.textContent = "You Cleared The Archive!";
    descEl.textContent = "All 20 levels solved! Edit LEVELS in script.js to make your own riddles.";
    boxEl.textContent = "100% COMPLETE — Ready for GitHub Pages!";
    formEl.style.display = "none";
    return;
  }

  formEl.style.display = "flex";
  const lvl = LEVELS[current];
  const num = String(current + 1).padStart(2, "0");
  entryLabel.textContent = "ENTRY " + num + " / 20";

  if (current < 5) {
    tierBadge.textContent = "GREEN: WARMUP"; tierBadge.style.background = "#22c55e"; tierBadge.style.color = "#052e16";
  } else if (current < 10) {
    tierBadge.textContent = "YELLOW: DEVTOOLS"; tierBadge.style.background = "#eab308"; tierBadge.style.color = "#422006";
  } else if (current < 15) {
    tierBadge.textContent = "RED: ENCODING"; tierBadge.style.background = "#ef4444"; tierBadge.style.color = "#fff";
  } else {
    tierBadge.textContent = "PURPLE: BOSS ZONE"; tierBadge.style.background = "#a855f7"; tierBadge.style.color = "#fff";
  }

  titleEl.textContent = lvl.title;
  descEl.textContent = lvl.desc;
  boxEl.innerHTML = lvl.box;
  hintBox.textContent = "HINT: " + lvl.hint;
  if (lvl.onEnter) lvl.onEnter();
}

formEl.addEventListener("submit", function(e) {
  e.preventDefault();
  const guess = inputEl.value.trim().toUpperCase();
  const target = LEVELS[current].answer.toUpperCase();
  if (guess === target) {
    statusEl.style.color = "#22c55e";
    statusEl.textContent = "Correct! Advancing...";
    current++;
    localStorage.setItem("archive_progress", current);
    setTimeout(loadLevel, 550);
  } else {
    statusEl.style.color = "#ef4444";
    statusEl.textContent = "Not quite. Check the clue or click 'Need a hint?'";
  }
});

document.getElementById("hint-btn").addEventListener("click", function() {
  hintBox.style.display = hintBox.style.display === "block" ? "none" : "block";
});

document.getElementById("reset-btn").addEventListener("click", function() {
  localStorage.removeItem("archive_progress");
  localStorage.removeItem("archive_key");
  current = 0;
  loadLevel();
});

loadLevel();

