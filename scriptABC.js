let firstBox = null;
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
speechSynthesis.onvoiceschanged = () => { voices = speechSynthesis.getVoices(); };
function getBestVoice() {
  if (!voices.length) voices = speechSynthesis.getVoices();
  return voices.find(v =>
    v.lang.includes("ms") ||
    v.lang.includes("en") && (v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("girl"))
  ) || voices[0];
}
function speak(text) {
  speechSynthesis.cancel();
  let msg = new SpeechSynthesisUtterance(text);
  msg.voice = getBestVoice();
  msg.rate = 1; msg.pitch = 1.2; 
  speechSynthesis.speak(msg);
}

let bgMusic = new Audio("https://cdn.pixabay.com/audio/2022/10/25/audio_946b9c0c87.mp3");
bgMusic.loop = true; bgMusic.volume = 0;
function startMusic() {
  if (!bgStarted) {
    bgStarted = true;
    bgMusic.play().then(() => { fadeInMusic(); }).catch(() => {});
  }
}
function fadeInMusic() {
  let vol = 0;
  let fade = setInterval(() => {
    if (vol < 0.15) { vol += 0.01; bgMusic.volume = vol; } else { clearInterval(fade); }
  }, 200);
}

function setProgress(step) {
  document.getElementById("bar").style.width = (step === 1) ? "50%" : "100%";
}

/* ================= SCAN FIRST ================= */
function startFirstScan() {
  initAudio(); resumeAudio(); jumpSound(); startMusic();
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("writingVideoArea").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  
  scanner.start(
    { facingMode: { exact: "environment" } },
    {
      fps: 15, qrbox: 280,
      videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    },
    (text) => {
      firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase().trim() : text.toUpperCase().trim();
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
      firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase().trim() : text.toUpperCase().trim();
      scanner.stop(); coinSound(); setProgress(1);
      document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
      document.getElementById("btn2").disabled = false;
    }
  ).catch(err => alert("Sila semak kebenaran akses kamera peranti anda."));
}

/* ================= SCAN SECOND ================= */
function startSecondScan() {
  if (!firstBox) { alert("Scan box pertama dulu!"); return; }
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("writingVideoArea").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: { exact: "environment" } },
    {
      fps: 15, qrbox: 280,
      videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase().trim() : text.toUpperCase().trim();
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
      let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase().trim() : text.toUpperCase().trim();
      scanner.stop(); setProgress(2); check(secondBox);
    }
  ).catch(err => console.error(err));
}

/* ================= RESULT CHECK ================= */
function check(secondBox) {
  let ok = (firstBox === secondBox);
  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";
  document.getElementById("reader").style.display = "none";

  let container = document.getElementById("gameAreaContainer");
  let imageEl = document.getElementById("flashcardImg");

  if (ok) {
    coinSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#22c55e";
    
    // Sembuhkan teks kejayaan baru
    document.getElementById("result").innerHTML = "<div class='good'>Tahniah! Anda berjaya mencari pasangan huruf yang betul. 🥳</div>";
    
    setTimeout(() => { speak("Tahniah! Anda berjaya mencari pasangan huruf yang betul"); }, 200);

    // Muat imej flashcard yang sepadan
    imageEl.src = "FLASHCARD/" + firstBox + ".png";
    container.style.display = "block";

    // Pautan video Starfall dinamik mengikut kod imbasan kotak kedua yang betul
    let targetLink = videoLinks[firstBox]; 
    document.getElementById("successVideoBtn").onclick = function() {
      if (targetLink) {
        window.open(targetLink, "_blank");
      } else {
        alert("Pautan video tidak dijumpai!");
      }
    };

    // Pautan untuk menukar paparan kepada 2 video cara menulis
    document.getElementById("successWriteBtn").onclick = function() {
      showWritingVideos(firstBox);
    };

    document.getElementById("actionButtons").style.display = "flex";

  } else {
    failSound();
    document.getElementById("icon").innerHTML = "😢";
    document.getElementById("icon").style.color = "#dc2626";
    document.getElementById("result").innerHTML = "<div class='bad'>Jangan risau! Cuba lagi ya!</div>";
    setTimeout(() => { speak("Jangan risau, Cuba lagi ya"); }, 200);

    imageEl.src = "FLASHCARD/" + firstBox + ".png";
    container.style.display = "block";

    document.getElementById("failVideoBtn").onclick = function() {
      showWritingVideos(firstBox);
    };
    document.getElementById("failButtons").style.display = "flex";
  }
}

/* ================= FUNGSI PAPARAN 2 VIDEO MENULIS (ATAS/BAWAH) ================= */
function showWritingVideos(letter) {
  document.getElementById("gameAreaContainer").style.display = "none";
  
  let videoArea = document.getElementById("writingVideoArea");
  let vCapital = document.getElementById("videoCapital");
  let vSmall = document.getElementById("videoSmall");
  
  document.getElementById("labelCapital").innerText = `Cara Menulis Huruf Besar (${letter})`;
  document.getElementById("labelSmall").innerText = `Cara Menulis Huruf Kecil (${letter.toLowerCase()})`;
  
  // Membaca fail .mp4 (Huruf Besar) dan fail _ .mp4 (Huruf Kecil)
  vCapital.src = "CARA MENULIS HURUF/" + letter + ".mp4";
  vSmall.src = "CARA MENULIS HURUF/" + letter.toLowerCase() + "_.mp4";
  
  videoArea.style.display = "flex";
  vCapital.play().catch(()=>{});
}

/* ================= OVERLAY POPUP FAIL ABC SONG ================= */
function playAbcSongVideo() {
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("writingVideoArea").style.display = "none";
  
  let modal = document.getElementById("videoModal");
  modal.innerHTML = `
    <div style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center; padding: 20px; box-sizing: border-box;">
      <h3 style="color: #a855f7; font-size: 24px; margin: 0 0 15px 0;">🎶 Lagu ABC</h3>
      <div style="width: 100%; max-width: 360px; height: 220px; background: #000; border-radius: 15px; overflow: hidden; border: 3px solid #a855f7;">
        <video src="ABC SONG.mp4" controls autoplay playsinline style="width:100%; height:100%; object-fit:contain;"></video>
      </div>
      <button onclick="closeVideoModal()" class="btn-back" style="margin-top: 20px; width: 150px;">⬅ Tutup</button>
    </div>
  `;
  modal.style.display = "block";
}

function closeVideoModal() {
  document.getElementById("videoModal").innerHTML = "";
  document.getElementById("videoModal").style.display = "none";
  document.getElementById("gameAreaContainer").style.display = "block";
}

function openBonusLink(url) { window.open(url, "_blank"); }
function goToPage(page) { window.location.href = firstBox ? page + "?letter=" + firstBox : page; }
function resetGame() { bgMusic.pause(); window.location.href = "index.html"; }
