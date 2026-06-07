let firstBox = null;
let audioCtx = null;
let bgStarted = false;

// Sediakan fail Audio awal-awal
let bgMusic = new Audio("LAGU/BG SOUND.mpeg");
bgMusic.loop = true;
bgMusic.volume = 0;

function initAudio() {
  if (!audioCtx) { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
}
function resumeAudio() {
  if (audioCtx && audioCtx.state === "suspended") { audioCtx.resume(); }
}

function coinSound() {
  resumeAudio();
  let o = audioCtx.createOscillator();
  o.frequency.setValueAtTime(700, audioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(1200, audioCtx.currentTime + 0.1);
  o.connect(audioCtx.destination); o.start(); setTimeout(() => o.stop(), 120);
}
function failSound() {
  resumeAudio();
  let o = audioCtx.createOscillator();
  o.frequency.setValueAtTime(300, audioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(150, audioCtx.currentTime + 0.2);
  o.connect(audioCtx.destination); o.start(); setTimeout(() => o.stop(), 150);
}
function jumpSound() {
  resumeAudio();
  let o = audioCtx.createOscillator();
  o.frequency.setValueAtTime(400, audioCtx.currentTime);
  o.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.15);
  o.connect(audioCtx.destination); o.start(); setTimeout(() => o.stop(), 150);
}

let voices = [];
function loadVoices() { voices = speechSynthesis.getVoices(); }
if (speechSynthesis.onvoiceschanged !== undefined) { speechSynthesis.onvoiceschanged = loadVoices; }
loadVoices();

function getBestVoice() {
  if (!voices.length) voices = speechSynthesis.getVoices();
  let malayVoice = voices.find(v => v.lang.toLowerCase().includes("ms"));
  if (malayVoice) return malayVoice;
  let engFemaleVoice = voices.find(v => v.lang.toLowerCase().includes("en") && (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("girl") || v.name.toLowerCase().includes("zira")));
  if (engFemaleVoice) return engFemaleVoice;
  return voices[0];
}

function speak(text) {
  speechSynthesis.cancel();
  if (!voices.length) loadVoices();
  
  let msg = new SpeechSynthesisUtterance(text);
  let selectedVoice = getBestVoice();
  if (selectedVoice) { msg.voice = selectedVoice; msg.lang = selectedVoice.lang; } else { msg.lang = "ms-MY"; }
  msg.rate = 0.9; msg.pitch = 1.1;

  // Perlahankan musik latar belakang semasa bercakap
  msg.onstart = function() {
    bgMusic.volume = 0.02;
  };

  // Naikkan semula musik latar belakang selepas habis bercakap
  msg.onend = function() {
    fadeInMusic();
  };

  speechSynthesis.speak(msg);
}

function startMusic() {
  // Pastikan ia hanya dimainkan sekali sahaja dan dipicu selepas interaksi pengguna
  if (!bgStarted) {
    bgStarted = true;
    bgMusic.play().then(() => { 
      fadeInMusic(); 
    }).catch((err) => {
      console.log("Muzik disekat pelayar:", err);
      bgStarted = false; // Set semula supaya boleh dicuba lagi pada klik seterusnya
    });
  }
}

function fadeInMusic() {
  let vol = bgMusic.volume;
  let fade = setInterval(() => {
    if (vol < 0.15) { 
      vol += 0.02; 
      bgMusic.volume = Math.min(vol, 0.15); 
    } else { 
      clearInterval(fade); 
    }
  }, 100);
}

function setProgress(step) {
  document.getElementById("bar").style.width = (step === 1) ? "50%" : "100%";
}

function startFirstScan() {
  initAudio(); 
  resumeAudio(); 
  jumpSound(); 
  startMusic(); // Diaktifkan secara rasmi di sini selepas pengguna menekan butang
  speak(""); 
  
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: { exact: "environment" } },
    { fps: 15, qrbox: 280, videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => {
      firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop(); coinSound(); setProgress(1);
      document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
      document.getElementById("btn2").disabled = false;
    }
  ).catch(err => { startFirstScanFallback(); });
}

function startFirstScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 15, qrbox: 280, videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => {
      firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop(); coinSound(); setProgress(1);
      document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
      document.getElementById("btn2").disabled = false;
    }
  ).catch(err => alert("Sila semak kebenaran akses kamera peranti anda."));
}

function startSecondScan() {
  if (!firstBox) { alert("Scan box pertama dulu!"); return; }
  startMusic(); // Tambahan perlindungan sekiranya pelayar memerlukan ketukan kedua
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: { exact: "environment" } },
    { fps: 15, qrbox: 280, videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop(); setProgress(2); check(secondBox);
    }
  ).catch(err => { startSecondScanFallback(); });
}

function startSecondScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    { fps: 15, qrbox: 280, videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop(); setProgress(2); check(secondBox);
    }
  ).catch(err => console.error(err));
}

function check(secondBox, isRestored = false) {
  let ok = (firstBox === secondBox);
  
  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";
  document.getElementById("reader").style.display = "none";

  let container = document.getElementById("gameAreaContainer");
  let imageEl = document.getElementById("flashcardImg");
  let targetLink = videoLinks[firstBox]; 

  sessionStorage.setItem("lastFirstBox", firstBox);
  sessionStorage.setItem("lastSecondBox", secondBox);
  sessionStorage.setItem("hasScanned", "true");

  if (ok) {
    if (!isRestored) {
      coinSound();
      setTimeout(() => { speak("Tahniah! Anda berjaya mencari pasangan huruf yang betul"); }, 400);
    }
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#22c55e";
    document.getElementById("result").innerHTML = "<div class='good'>Tahniah! Anda berjaya mencari pasangan huruf yang betul. 🥳</div>";
    setProgress(2);

    imageEl.src = "FLASHCARD/" + firstBox + ".png";
    container.style.display = "block";

    // DIKEMASKINI: Tukar window.open ke window.location.href untuk membuka video tempatan
    document.getElementById("successVideoBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html");
      window.location.href = "video.html?type=letter_video&letter=" + firstBox;
    };

    document.getElementById("successWriteBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html"); 
      window.location.href = "video.html?type=stroke&letter=" + firstBox;
    };

    document.getElementById("actionButtons").style.display = "flex";
    document.getElementById("failButtons").style.display = "none";

  } else {
    if (!isRestored) {
      failSound();
      setTimeout(() => { speak("Jangan risau, Cuba lagi ya"); }, 400);
    }
    document.getElementById("icon").innerHTML = "😢";
    document.getElementById("icon").style.color = "#dc2626";
    document.getElementById("result").innerHTML = "<div class='bad'>Jangan risau! Cuba lagi ya!</div>";
    setProgress(2);

    imageEl.src = "FLASHCARD/ALPHABET LETTERS.png";
    container.style.display = "block";

    document.getElementById("failVideoBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html");
      window.location.href = "video.html?type=bonus_song&letter=" + (firstBox || "A");
    };

    document.getElementById("actionButtons").style.display = "none";
    document.getElementById("failButtons").style.display = "flex";
  }
}

function openBonusLink(url) { window.open(url, "_blank"); }

function goToPage(page) { 
  sessionStorage.setItem("prevPage", "index.html"); 
  window.location.href = firstBox ? page + "?letter=" + firstBox : page; 
}

function goToPlayABC() { 
  sessionStorage.setItem("prevPage", "index.html"); 
  window.location.href = \"video.html?type=song\";
}

function resetGame() { 
  bgMusic.pause(); 
  sessionStorage.removeItem("lastFirstBox");
  sessionStorage.removeItem("lastSecondBox");
  sessionStorage.removeItem("hasScanned");
  window.location.href = "index.html"; 
}

window.onload = function() {
  let hasScanned = sessionStorage.getItem("hasScanned");
  if (hasScanned === "true") {
    firstBox = sessionStorage.getItem("lastFirstBox");
    let secondBox = sessionStorage.getItem("lastSecondBox");
    if (firstBox) {
      // Pembetulan: Pintu pencetus interaksi diaktifkan semula di sini untuk sambung muzik
      bgStarted = true;
      bgMusic.play().then(() => { bgMusic.volume = 0.15; }).catch(() => { bgStarted = false; });
      check(secondBox, true); 
    }
  }
};
