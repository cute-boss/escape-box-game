let firstBox = null;

// External interactive URLs for winning execution flows
const videoLinks = {
  A: "https://www.starfall.com/h/abcs/letter-a/?mg=k",
  B: "https://www.starfall.com/h/abcs/letter-b/?mg=k",
  C: "https://www.starfall.com/h/abcs/letter-c/?mg=k",
  D: "https://www.starfall.com/h/abcs/letter-d/?mg=k",
  E: "https://www.starfall.com/h/abcs/letter-e/?mg=k",
  F: "https://www.starfall.com/h/abcs/letter-f/?mg=k",
  G: "https://www.starfall.com/h/abcs/letter-g/?mg=k",
  H: "https://www.starfall.com/h/abcs/letter-h/?mg=k",
  I: "https://www.starfall.com/h/abcs/letter-i/?mg=k",
  J: "https://www.starfall.com/h/abcs/letter-j/?mg=k",
  K: "https://www.starfall.com/h/abcs/letter-k/?mg=k",
  L: "https://www.starfall.com/h/abcs/letter-l/?mg=k",
  M: "https://www.starfall.com/h/abcs/letter-m/?mg=k",
  N: "https://www.starfall.com/h/abcs/letter-n/?mg=k",
  O: "https://www.starfall.com/h/abcs/letter-o/?mg=k",
  P: "https://www.starfall.com/h/abcs/letter-p/?mg=k",
  Q: "https://www.starfall.com/h/abcs/letter-q/?mg=k",
  R: "https://www.starfall.com/h/abcs/letter-r/?mg=k",
  S: "https://www.starfall.com/h/abcs/letter-s/?mg=k",
  T: "https://www.starfall.com/h/abcs/letter-t/?mg=k",
  U: "https://www.starfall.com/h/abcs/letter-u/?mg=k",
  V: "https://www.starfall.com/h/abcs/letter-v/?mg=k",
  W: "https://www.starfall.com/h/abcs/letter-w/?mg=k",
  X: "https://www.starfall.com/h/abcs/letter-x/?mg=k",
  Y: "https://www.starfall.com/h/abcs/letter-y/?mg=k",
  Z: "https://www.starfall.com/h/abcs/letter-z/?mg=k"
};

let audioCtx = null;
let bgStarted = false;

/* ================= AUDIO INIT ================= */
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}
function resumeAudio() {
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

/* ================= SFX GENERATION ================= */
function coinSound() {
  resumeAudio();
  let o = audioCtx.createOscillator();
  o.frequency.setValueAtTime(700, audioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
  o.connect(audioCtx.destination);
  o.start();
  setTimeout(() => o.stop(), 120);
}

function failSound() {
  resumeAudio();
  let o = audioCtx.createOscillator();
  o.frequency.setValueAtTime(300, audioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.2);
  o.connect(audioCtx.destination);
  o.start();
  setTimeout(() => o.stop(), 150);
}

function jumpSound() {
  resumeAudio();
  let o = audioCtx.createOscillator();
  o.frequency.setValueAtTime(400, audioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.15);
  o.connect(audioCtx.destination);
  o.start();
  setTimeout(() => o.stop(), 150);
}

/* ================= VOICE TTS ENGINE ================= */
let voices = [];
speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); };

function getBestVoice() {
  if (!voices.length) voices = speechSynthesis.getVoices();
  return voices.find(v =>
    v.lang.includes("ms") ||
    v.lang.includes("en") &&
    (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("girl"))
  ) || voices[0];
}

function speak(text) {
  speechSynthesis.cancel();
  let msg = new SpeechSynthesisUtterance(text);
  msg.voice = getBestVoice();
  msg.rate = 1;
  msg.pitch = 1.2;
  speechSynthesis.speak(msg);
}

/* ================= BACKGROUND LOOP ================= */
let bgMusic = new Audio("https://cdn.pixabay.com/audio/2022/10/25/audio_946b9c0c87.mp3");
bgMusic.loop = true;
bgMusic.volume = 0;

function startMusic() {
  if (!bgStarted) {
    bgStarted = true;
    bgMusic.play().then(() => fadeInMusic()).catch(() => {});
  }
}

function fadeInMusic() {
  let vol = 0;
  let fade = setInterval(() => {
    if (vol < 0.15) { vol += 0.01; bgMusic.volume = vol; } else { clearInterval(fade); }
  }, 200);
}

function setProgress(step) {
  document.getElementById("bar").style.width = step === 1 ? "50%" : "100%";
}

/* ================= CAMERA HARDWARE SCANNERS ================= */
function startFirstScan() {
  initAudio(); resumeAudio(); jumpSound(); startMusic();
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: { exact: "environment" } },
    { fps: 15, qrbox: 280, videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => { handleFirstScanSuccess(text, scanner); }
  ).catch(() => startFirstScanFallback());
}

function startFirstScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 15, qrbox: 280, videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => { handleFirstScanSuccess(text, scanner); }
  ).catch(() => alert("Sila semak kebenaran akses kamera peranti anda."));
}

function handleFirstScanSuccess(text, scanner) {
  firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
  scanner.stop();
  coinSound();
  setProgress(1);
  document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
  document.getElementById("btn2").disabled = false;
}

function startSecondScan() {
  if (!firstBox) return alert("Scan box pertama dulu!");
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: { exact: "environment" } },
    { fps: 15, qrbox: 280, videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => { handleSecondScanSuccess(text, scanner); }
  ).catch(() => startSecondScanFallback());
}

function startSecondScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 15, qrbox: 280, videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => { handleSecondScanSuccess(text, scanner); }
  ).catch((err) => console.error(err));
}

function handleSecondScanSuccess(text, scanner) {
  let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
  scanner.stop();
  setProgress(2);
  check(secondBox);
}

/* ================= HARDWARE LOGIC VALIDATOR ================= */
function check(secondBox) {
  let isMatch = (firstBox === secondBox);
  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";

  if (isMatch) {
    // WIN STATE
    coinSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#22c55e";
    document.getElementById("lock").innerText = "🔓";
    document.getElementById("result").innerHTML = "<div class='good'>TAHNIAH ANDA BETUL! 🥳</div>";
    
    setTimeout(() => speak("Tahniah anda betul"), 200);

    if (videoLinks[firstBox]) {
      openMediaFrame(videoLinks[firstBox], false);
    }
    document.getElementById("actionButtons").style.display = "flex";

  } else {
    // FAILURE STATE
    failSound();
    document.getElementById("icon").innerHTML = "😢"; 
    document.getElementById("icon").style.color = "#dc2626";
    document.getElementById("lock").innerText = "🔒";
    document.getElementById("result").innerHTML = "<div class='bad'>Jangan risau! Cuba lagi ya!</div>";
    
    setTimeout(() => speak("Jangan risau, Cuba lagi ya"), 200);

    // Dynamic extraction maps cleanly to local FLASHCARD folder path (.png extension format)
    let flashcardPath = "FLASHCARD/" + firstBox + ".png"; 
    openMediaFrame(flashcardPath, true);

    // Wire up execution pointer linking local stroke file within folder 'CARA MENULIS HURUF'
    let strokeVideoPath = "CARA MENULIS HURUF/" + firstBox + ".mp4";
    document.getElementById("failVideoBtn").onclick = function() {
      openMediaFrame(strokeVideoPath, true);
    };

    document.getElementById("failButtons").style.display = "flex";
  }
}

function openMediaFrame(url, isFailedView) {
  document.getElementById("reader").style.display = "none";
  let container = document.getElementById("gameAreaContainer");
  let frame = document.getElementById("gameIframe");
  let fallback = document.getElementById("iframeFallbackBox");
  
  if (isFailedView) {
    container.classList.add("failed-border");
  } else {
    container.classList.remove("failed-border");
  }

  frame.src = url;
  fallback.style.display = "none";
  container.style.display = "block";

  setTimeout(() => {
    document.getElementById("fallbackPlayBtn").setAttribute("onclick", `window.open('${url}', '_blank')`);
    fallback.style.display = "flex";
  }, 700);
}

function openLocalMedia(filePath) {
  openMediaFrame(filePath, true);
}

function openBonusLink(url) {
  window.open(url, "_blank");
}

function goToMatchPage() {
  window.location.href = "match.html";
}

function resetGame() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  window.location.href = "index.html";
}