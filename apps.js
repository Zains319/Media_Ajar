// script.js — robust single-file controller
console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  /* ===================== ELEMENT HELPERS ===================== */
  const $ = (id) => document.getElementById(id);
  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  /* ===================== PANELS & NAV ===================== */
  const panels = {
    home: $("home"),
    materi: $("materi"),
    flashcards: $("flashcards"),
    game: $("game")
  };

  function showPanel(name) {
    // hide all panels safely
    Object.values(panels).forEach(p => p && p.classList.remove("show"));
    if (panels[name]) panels[name].classList.add("show");

    // sidebar active
    qa(".menu a").forEach(a => a.classList.remove("active"));
    const sb = $("sb_" + name);
    if (sb) sb.classList.add("active");

    // bottom nav active
    qa(".nav-btn").forEach(b => b.classList.remove("active"));
    const nb = document.querySelector(`[data-target="${name}"]`);
    if (nb) nb.classList.add("active");

    updateFloatingBack(name);
  }

  // safe bindings for sidebar buttons
  const sbHome = $("sb_home"), sbMateri = $("sb_materi"), sbFlash = $("sb_flashcard") || $("sb_flashcards"), sbGame = $("sb_game");
  if (sbHome) sbHome.addEventListener("click", () => showPanel("home"));
  if (sbMateri) sbMateri.addEventListener("click", () => showPanel("materi"));
  if (sbFlash) sbFlash.addEventListener("click", () => showPanel("flashcards"));
  if (sbGame) sbGame.addEventListener("click", () => { showPanel("game"); showGameInstructions(); });

  // bottom nav
  qa(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const t = btn.dataset.target;
      if (!t) return;
      showPanel(t);
      if (t === "game") showGameInstructions();
    });
  });

  // home cards
  const goMateri = $("goMateri"), goFlash = $("goFlashcard"), goGame = $("goGame");
  if (goMateri) goMateri.addEventListener("click", () => showPanel("materi"));
  if (goFlash) goFlash.addEventListener("click", () => showPanel("flashcards"));
  if (goGame) goGame.addEventListener("click", () => { showPanel("game"); showGameInstructions(); });

  /* floating back */
  const floatBtn = $("floatingBackBtn");
  function updateFloatingBack(name) {
    if (!floatBtn) return;
    floatBtn.style.display = (name === "home") ? "none" : "flex";
  }
  if (floatBtn) floatBtn.addEventListener("click", () => showPanel("home"));

  /* theme toggle */
  const themeToggle = $("themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });
  }

  /* ===================== MATERI POSISI ===================== */
  const posData = {
    ue:{hira:"うえ",arti:"atas",penjelasan:"Posisi di bagian atas。",contoh:"つくえのうえに ほんがあります。",contohArti:"Ada buku di atas meja。"},
    shita:{hira:"した",arti:"bawah",penjelasan:"Posisi di bawah。",contoh:"テーブルのしたに ねこがいます。",contohArti:"Ada kucing di bawah meja。"},
    mae:{hira:"まえ",arti:"depan",penjelasan:"Posisi di depan。",contoh:"がっこうのまえに バスていがあります。",contohArti:"Ada halte di depan sekolah。"},
    ushiro:{hira:"うしろ",arti:"belakang",penjelasan:"Posisi di belakang。",contoh:"いすのうしろに かばんがあります。",contohArti:"Ada tas di belakang kursi。"},
    naka:{hira:"なか",arti:"dalam",penjelasan:"Posisi di dalam。",contoh:"かばんのなかに ノートがあります。",contohArti:"Ada buku catatan di dalam tas。"},
    soto:{hira:"そと",arti:"luar",penjelasan:"Posisi di luar。",contoh:"へやのそとに ねこがいます。",contohArti:"Ada kucing di luar ruangan。"},
    migi:{hira:"みぎ",arti:"kanan",penjelasan:"Posisi kanan。",contoh:"ぎんこうは スーパーのみぎです。",contohArti:"Bank di sebelah kanan supermarket。"},
    hidari:{hira:"ひだり",arti:"kiri",penjelasan:"Posisi kiri。",contoh:"くるまは みちのひだりを はしります。",contohArti:"Mobil berjalan di kiri jalan。"},
    tonari:{hira:"となり",arti:"sebelah",penjelasan:"Bersebelahan。",contoh:"わたしのとなりに ともだちがいます。",contohArti:"Teman saya ada di sebelah。"},
    yoko:{hira:"よこ",arti:"samping",penjelasan:"Posisi samping。",contoh:"いすのよこに かばんがあります。",contohArti:"Ada tas di samping kursi。"}
  };

  const posBtns = qa(".posBtn");
  const posInfoBox = $("posInfoBox");
  const posWord = $("posWord");
  const posArti = $("posArti");
  const posPenjelasan = $("posPenjelasan");
  const posContoh = $("posContoh");
  const posContohArti = $("posContohArti");
  const posCard3D = $("posCard3D");

  posBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      const d = posData[key];
      if (!d) return;
      if (posWord) posWord.textContent = d.hira;
      if (posArti) posArti.textContent = d.arti;
      if (posPenjelasan) posPenjelasan.textContent = d.penjelasan;
      if (posContoh) posContoh.textContent = d.contoh;
      if (posContohArti) posContohArti.textContent = d.contohArti;
      if (posInfoBox) posInfoBox.classList.remove("hidden");
      posInfoBox && posInfoBox.scrollIntoView({behavior:"smooth", block:"center"});
    });
  });
  if (posCard3D) posCard3D.addEventListener("click", () => posCard3D.classList.toggle("flipped"));

  /* ===================== FLASHCARDS ===================== */
  const VOCAB = [
    {image:"images/ue.jpg",hira:"うえ",romaji:"ue",meaning:"atas",desc:"Posisi di atas。"},
    {image:"images/shita.jpg",hira:"した",romaji:"shita",meaning:"bawah",desc:"Posisi di bawah。"},
    {image:"images/mae.jpg",hira:"まえ",romaji:"mae",meaning:"depan",desc:"Posisi depan。"},
    {image:"images/ushiro.jpg",hira:"うしろ",romaji:"ushiro",meaning:"belakang",desc:"Posisi belakang。"},
    {image:"images/naka.jpg",hira:"なか",romaji:"naka",meaning:"dalam",desc:"Posisi dalam。"},
    {image:"images/soto.jpg",hira:"そと",romaji:"soto",meaning:"luar",desc:"Posisi luar。"},
    {image:"images/migi.jpg",hira:"みぎ",romaji:"migi",meaning:"kanan",desc:"Posisi kanan。"},
    {image:"images/hidari.jpg",hira:"ひだり",romaji:"hidari",meaning:"kiri",desc:"Posisi kiri。"},
    {image:"images/tonari.jpg",hira:"となり",romaji:"tonari",meaning:"sebelah",desc:"Bersebelahan。"},
    {image:"images/yoko.jpg",hira:"よこ",romaji:"yoko",meaning:"samping",desc:"Posisi samping。"}
  ];

  // flashcard elements (safe)
  const cardEl = $("card");
  const cardImage = $("cardImage");
  const hiraganaText = $("hiraganaText");
  const romajiText = $("romajiText");
  const meaningText = $("meaningText");
  const descText = $("descText");
  const prevBtn = $("prevBtn");
  const nextBtn = $("nextBtn");
  const flipBtn = $("flipBtn");
  const shuffleBtn = $("shuffleBtn");
  const markBtn = $("markBtn");
  const resetProgressBtn = $("resetProgressBtn");
  const learnedCount = $("learnedCount");
  const totalCount = $("totalCount");

  let idx = 0;
  function renderCard() {
    const c = VOCAB[idx];
    if (!c) return;
    if (cardImage) cardImage.src = c.image;
    if (hiraganaText) hiraganaText.textContent = c.hira;
    if (romajiText) romajiText.textContent = c.romaji;
    if (meaningText) meaningText.textContent = c.meaning;
    if (descText) descText.textContent = c.desc;
    if (cardEl) cardEl.classList.remove("flipped");
    if (learnedCount) learnedCount.textContent = Object.keys(JSON.parse(localStorage.getItem("flash_progress_v1") || "{}")).length;
    if (totalCount) totalCount.textContent = VOCAB.length;
  }

  if (prevBtn) prevBtn.addEventListener("click", () => { idx = (idx - 1 + VOCAB.length) % VOCAB.length; renderCard(); });
  if (nextBtn) nextBtn.addEventListener("click", () => { idx = (idx + 1) % VOCAB.length; renderCard(); });
  if (flipBtn) flipBtn.addEventListener("click", () => cardEl && cardEl.classList.toggle("flipped"));
  if (shuffleBtn) shuffleBtn.addEventListener("click", () => { VOCAB.sort(()=>Math.random()-0.5); idx = 0; renderCard(); });
  if (resetProgressBtn) resetProgressBtn.addEventListener("click", () => { localStorage.removeItem("flash_progress_v1"); renderCard(); });

  renderCard();

  /* ===================== KANJI WOLF (Hiragana-only) ===================== */
  // Data pools (we'll use textual pairs; adapt per request)
  // Level 1-5: simple statement pairs (one wrong among simple)
  // Level 6-10: advanced pattern using 'ada di' sentences (material-style)
  const SIMPLE_CORRECT = [
    { jp: 'aku tau bahasa jepang bawah adalah "した".' , id: 'correct-simple-1' },
    { jp: 'aku tau bahasa jepang atas adalah "うえ".' , id: 'correct-simple-2' },
    { jp: 'aku tau bahasa jepang kiri adalah "ひだり".' , id: 'correct-simple-3' },
    { jp: 'aku tau bahasa jepang kanan adalah "みぎ".' , id: 'correct-simple-4' },
    { jp: 'aku tau bahasa jepang depan adalah "まえ".' , id: 'correct-simple-5' }
  ];
  // wrong variants for simple (mismatch one)
  const SIMPLE_WRONG = [
    { jp: 'aku tau bahasa jepang atas adalah "ひだり".' , id: 'wrong-simple-1' }, // intentional wrong mapping
    { jp: 'aku tau bahasa jepang bawah adalah "みぎ".' , id: 'wrong-simple-2' },
    { jp: 'aku tau bahasa jepang kiri adalah "うえ".' , id: 'wrong-simple-3' }
  ];

  // advanced correct/ wrong — format uses material-like sentences
  const ADV_CORRECT = [
    { jp: 'Ada pensil di atas meja, つくえのうえに えんぴつがあります。', id: 'adv-c-1' },
    { jp: 'Ada buku di dalam tas, かばんのなかに ほんがあります。', id: 'adv-c-2' },
    { jp: 'Ada kucing di luar rumah, いえのそとに ねこがいます。', id: 'adv-c-3' },
    { jp: 'Ada kursi di sebelah meja, いすのよこに テーブルがあります。', id: 'adv-c-4' }
  ];
  const ADV_WRONG = [
    { jp: 'Ada pohon di dalam, なかにきがありま', id: 'adv-w-1' }, // broken/incorrect grammar
    { jp: 'Ada pensil di bawah meja, つくえのしたに えんぴつが みます。', id: 'adv-w-2' },
    { jp: 'Ada buku di luar tas, かばんのそとに ほんが みます。', id: 'adv-w-3' }
  ];

  // DOM game pieces
  const npcList = $("npcList");
  const kwLevel = $("kw-level");
  const kwLives = $("kw-lives");
  const kwMsg = $("kw-msg");
  const kwOverlay = $("kw-overlay");
  const kwOverlayTitle = $("kw-overlay-title");
  const kwOverlayDetail = $("kw-overlay-detail");
  const kwPlayAgain = $("kw-play-again");
  const kwBackHome = $("kw-back-home");
  const kwRestart = $("kw-restart");
  // start/instructions
  const gameInstructions = $("gameInstructions");
  const gameArena = $("gameArena");
  const startGameBtn = $("startGameBtn");

  // state
  let level = 1;
  let lives = 3;
  let correctCount = 0;
  let wrongCount = 0;
  let inRound = false;

  function shuffleArray(arr) { return arr.sort(()=>Math.random()-0.5); }

  function setLives(n){
    lives = Math.max(0, n);
    if (kwLives) kwLives.textContent = "Lives: " + "♥".repeat(lives);
  }
  function setLevel(n){
    level = Math.max(1, n);
    if (kwLevel) kwLevel.textContent = "Level: " + level;
  }
  function showMsg(txt, short=true){
    if (!kwMsg) return;
    kwMsg.textContent = txt;
    if (!short) setTimeout(()=> { if (kwMsg) kwMsg.textContent = ""; }, 1600);
  }

  function buildNPCslots(){
    if (!npcList) return;
    npcList.innerHTML = "";
    for (let i=0;i<6;i++){
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "npc";
      btn.innerHTML = `<div class="avatar">🙂</div><div class="bubble"></div>`;
      npcList.appendChild(btn);
    }
  }

  function generateRound(){
    if (!npcList) return;
    inRound = true;
    const slots = Array.from(npcList.querySelectorAll(".npc"));
    const npcCount = (level <= 5) ? 3 : 4;

    // choose pools based on level
    const C = (level <=5) ? SIMPLE_CORRECT : ADV_CORRECT;
    const W = (level <=5) ? SIMPLE_WRONG : ADV_WRONG;

    // choose one wrong and fill rest with corrects (ensuring uniqueness)
    const wrong = shuffleArray(W)[0];
    let corrects = shuffleArray(C).slice(0, npcCount - 1);

    // create final array of objects
    const final = shuffleArray([wrong, ...corrects]);

    slots.forEach((el, i) => {
      const bubble = el.querySelector(".bubble");
      el.classList.remove("wrong","success");
      el.disabled = false;
      if (i < npcCount){
        const item = final[i];
        bubble.textContent = item.jp;
        // mark wrong with data-wrong="1"
        el.dataset.isWrong = (item.id && item.id.startsWith("wrong") || item.id && item.id.startsWith("adv-w")) ? "1" : "0";
        el.style.display = "flex";
        el.onclick = onNpcClick;
      } else {
        el.style.display = "none";
        el.onclick = null;
      }
    });

    setLevel(level);
    setLives(lives);
    inRound = false;
  }

  function onNpcClick(e){
    if (inRound) return;
    const btn = e.currentTarget;
    if (!btn) return;
    const isWrong = btn.dataset.isWrong === "1";

    if (isWrong){
      // found the liar -> good
      btn.classList.add("success");
      correctCount++;
      level++;
      setTimeout(() => {
        if (level > 10) return finishGame(true);
        generateRound();
      }, 700);
    } else {
      // wrong pick
      btn.classList.add("wrong");
      wrongCount++;
      setLives(lives - 1);
      showMsg("Salah — itu bukan うそつき!", false);
      if (lives <= 0) {
        setTimeout(()=> finishGame(false), 700);
      }
    }
  }

  function finishGame(win){
    if (!kwOverlay) return;
    kwOverlay.classList.remove("hidden");
    if (kwOverlayTitle) kwOverlayTitle.textContent = win ? "Kamu Menang!" : "Game Over";
    // always show stats
    if (kwOverlayDetail) kwOverlayDetail.innerHTML = `
      Level tercapai: ${Math.min(level, 10)}<br>
      Jawaban benar: <b>${correctCount}</b><br>
      Jawaban salah: <b>${wrongCount}</b>
    `;
  }

  function resetGame(){
    level = 1;
    lives = 3;
    correctCount = 0;
    wrongCount = 0;
    if (kwOverlay) kwOverlay.classList.add("hidden");
    generateRound();
  }

  if (kwRestart) kwRestart.addEventListener("click", resetGame);
  if (kwPlayAgain) kwPlayAgain.addEventListener("click", resetGame);
  if (kwBackHome) kwBackHome.addEventListener("click", () => { if (kwOverlay) kwOverlay.classList.add("hidden"); showPanel("home"); });

  // Start/Instructions behavior
  function showGameInstructions(){
    if (gameInstructions) gameInstructions.classList.remove("hidden");
    if (gameArena) gameArena.classList.add("hidden");
  }
  function startGame(){
    if (gameInstructions) gameInstructions.classList.add("hidden");
    if (gameArena) gameArena.classList.remove("hidden");
    buildNPCslots();
    resetGame();
  }

  if (startGameBtn) {
    startGameBtn.addEventListener("click", startGame);
  } else {
    console.warn("startGameBtn not found — ensure #startGameBtn exists in HTML");
  }

  // When user opens the game panel via nav, show instructions not arena
  if (sbGame) {
    sbGame.addEventListener("click", showGameInstructions);
  }
  qa('.nav-btn').forEach(b => {
    b.addEventListener('click', () => {
      if (b.dataset.target === 'game') showGameInstructions();
    });
  });

  // Initialize minimal UI
  showPanel('home');
  updateFloatingBack('home');
  // Build flashcard and NPC skeleton so UI elements exist
  buildNPCslots();
  // Render initial if flashcards present
  renderCard();

  console.log("script initialization complete");
}); // DOMContentLoaded end

/* ========== DARK MODE MOBILE ========== */

document.getElementById("game2Link").addEventListener("click", function (e) {
    e.stopPropagation();
    window.location.href = this.getAttribute("href");
  });

/* ========== DARK MODE MOBILE ========== */
const themeToggleMobile = document.getElementById("themeToggleMobile");

if (themeToggleMobile) {
  themeToggleMobile.onclick = () => {
    document.body.classList.toggle("dark");

    // Ganti icon
    const isDark = document.body.classList.contains("dark");
    themeToggleMobile.textContent = isDark ? "☀️" : "🌙";
  };
}

/* ===== ADMIN: EDIT MATERI ===== */
(function () {
  const PASSWORD = "Admin123";
  const KEY = "materi_edits_v1";
  let editMode = false;

  const adminBtn = document.getElementById("adminBtn");
  const adminBar = document.getElementById("adminBar");
  if (!adminBtn || !adminBar) return;

  // Bagian yang bisa diedit: card di Materi (kecuali kosakata posisi) + deskripsi Game 2
  function targets() {
    const list = [...document.querySelectorAll("#materi .card-block")]
      .filter(el => !el.querySelector(".pos-grid"));
    const g2 = document.querySelector("#game2Card p");
    if (g2) list.push(g2);
    return list;
  }

  // Terapkan hasil edit yang tersimpan
  (function load() {
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    targets().forEach((el, i) => {
      if (saved[i] !== undefined) el.innerHTML = saved[i];
    });
  })();

  function setEdit(on) {
    editMode = on;
    targets().forEach(el => {
      el.contentEditable = on ? "true" : "false";
      el.classList.toggle("editing", on);
    });
    adminBar.style.display = on ? "flex" : "none";
    adminBtn.textContent = on ? "✏️ Mode Edit" : "🔒 Admin";
  }

  function askPassword() {
    if (document.getElementById("adminPwBox")) return;
    const box = document.createElement("div");
    box.id = "adminPwBox";
    box.style.cssText =
      "position:fixed;left:16px;bottom:140px;z-index:99999;background:#fff;color:#000;" +
      "padding:12px;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.3);";
    box.innerHTML =
      '<input id="adminPwInput" type="password" placeholder="Sandi Admin" ' +
      'style="padding:8px;border:1px solid #aaa;border-radius:8px;"> ' +
      '<button id="adminPwOk" style="padding:8px 12px;border:none;border-radius:8px;' +
      'background:#16a34a;color:#fff;cursor:pointer;">OK</button>';
    document.body.appendChild(box);

    const input = document.getElementById("adminPwInput");
    input.focus();

    function submit() {
      const v = input.value;
      box.remove();
      if (v === PASSWORD) setEdit(true);
      else alert("Sandi salah!");
    }
    document.getElementById("adminPwOk").addEventListener("click", submit);
    input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  }

  adminBtn.addEventListener("click", function () {
    if (!editMode) askPassword();
  });

  document.getElementById("adminSave").addEventListener("click", function () {
    const data = {};
    targets().forEach((el, i) => { data[i] = el.innerHTML; });
    localStorage.setItem(KEY, JSON.stringify(data));
    alert("Perubahan tersimpan.");
  });

  document.getElementById("adminReset").addEventListener("click", function () {
    if (confirm("Kembalikan semua materi ke isi awal?")) {
      localStorage.removeItem(KEY);
      location.reload();
    }
  });

  document.getElementById("adminExit").addEventListener("click", function () {
    setEdit(false);
  });
})();
