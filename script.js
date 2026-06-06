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

/* ================= SOUND ================= */

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

/* ================= VOICE ================= */

let voices = [];
speechSynthesis.onvoiceschanged = () => {
  voices = speechSynthesis.getVoices();
};

function getBestVoice() {
  if (!voices.length) voices = speechSynthesis.getVoices();
  return voices.find(v =>
    v.lang.includes("ms") ||
    v.lang.includes("en") &&
    (v.name.toLowerCase().includes("female") ||
     v.name.toLowerCase().includes("girl") ||
     v.name.toLowerCase().includes("zira") ||
     v.name.toLowerCase().includes("samantha"))
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

/* ================= BACKGROUND MUSIC ================= */

let bgMusic = new Audio("https://cdn.pixabay.com/audio/2022/10/25/audio_946b9c0c87.mp3");
bgMusic.loop = true;
bgMusic.volume = 0;

function startMusic() {
  if (!bgStarted) {
    bgStarted = true;
    bgMusic.play().then(() => {
      fadeInMusic();
    }).catch(() => {});
  }
}

function fadeInMusic() {
  let vol = 0;
  let fade = setInterval(() => {
    if (vol < 0.15) {
      vol += 0.01;
      bgMusic.volume = vol;
    } else {
      clearInterval(fade);
    }
  }, 200);
}

/* ================= PROGRESS ================= */

function setProgress(step) {
  document.getElementById("bar").style.width = (step === 1) ? "50%" : "100%";
}

/* ================= SCAN FIRST ================= */

function startFirstScan() {
  initAudio();
  resumeAudio();
  jumpSound();
  startMusic();

  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";

  let scanner = new Html5Qrcode("reader");
  
  scanner.start(
    { facingMode: { exact: "environment" } },
    {
      fps: 15,
      qrbox: 280,
      videoConstraints: {
        facingMode: { exact: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    },
    (text) => {
      firstBox = text.includes("box=") ? text.split("box=")[1] : text;
      scanner.stop();
      coinSound();
      setProgress(1);
      document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
      document.getElementById("btn2").disabled = false;
    }
  ).catch(err => {
      startFirstScanFallback();
  });
}

function startFirstScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    {
      fps: 15, qrbox: 280,
      videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } }
    },
    (text) => {
      firstBox = text.includes("box=") ? text.split("box=")[1] : text;
      scanner.stop(); coinSound(); setProgress(1);
      document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
      document.getElementById("btn2").disabled = false;
    }
  ).catch(err => alert("Sila semak kebenaran akses kamera peranti anda."));
}

/* ================= SCAN SECOND ================= */

function startSecondScan() {
  if (!firstBox) {
    alert("Scan box pertama dulu!");
    return;
  }

  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: { exact: "environment" } },
    {
      fps: 15, 
      qrbox: 280,
      videoConstraints: {
        facingMode: { exact: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1] : text;
      scanner.stop();
      setProgress(2);
      check(secondBox);
    }
  ).catch(err => {
      startSecondScanFallback();
  });
}

function startSecondScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { facingMode: "environment" },
    {
      fps: 15, qrbox: 280,
      videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } }
    },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1] : text;
      scanner.stop(); setProgress(2); check(secondBox);
    }
  ).catch(err => console.error(err));
}

/* ================= RESULT ================= */

function check(secondBox) {
  let ok = (firstBox === secondBox);

  if (ok) {
    coinSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#22c55e";
    document.getElementById("lock").innerText = "🔓";
    document.getElementById("result").innerHTML = "<div class='good'>TAHNIAH ANDA BETUL! 🥳</div>";
    
    setTimeout(() => {
      speak("Tahniah anda betul");
    }, 200);

    // Memuatkan iframe video huruf mengikut abjad box pertama
    if (videoLinks[firstBox]) {
      loadIframeAtLocation(videoLinks[firstBox]);
    }
  } else {
    failSound();
    setTimeout(() => {
      speak("Salah sila cuba lagi");
    }, 200);
    showFailGif();
  }

  // Sembunyikan butang kamera imbasan asal
  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";
  
  // BARU: Paparkan menu dengan 3 butang pilihan baharu
  document.getElementById("actionButtons").style.display = "flex";
}

// Fungsi memuatkan iframe di lokasi kamera dengan pengesan khas
function loadIframeAtLocation(url) {
  document.getElementById("reader").style.display = "none"; 
  
  let container = document.getElementById("gameAreaContainer");
  let frame = document.getElementById("gameIframe");
  let fallback = document.getElementById("iframeFallbackBox");
  
  frame.src = url;
  fallback.style.display = "none";
  container.style.display = "block";
  
  // Persediaan sokongan butang manual sekiranya pelayar menyekat muatan iframe luaran
  setTimeout(() => {
    document.getElementById("fallbackPlayBtn").setAttribute("onclick", `window.open('${url}', '_blank')`);
    fallback.style.display = "flex";
  }, 500);
}

// BARU: Fungsi untuk mengendalikan pembukaan pautan bonus (Lagu & Game)
function openBonusLink(url) {
  window.open(url, "_blank");
}

function showFailGif() {
  document.getElementById("videoModal").innerHTML = `
    <div class="fail-container">
      <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXN6Ym90am9vN21ndm14cmMxZndpOHg0ZzZ5d3B5ZzF0bnd5cmh6ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/E7V3EDm6866fD3wHhS/giphy.gif" class="fail-gif">
      <h2 class="fail-title">Alamak! Cuba Lagi 🤭</h2>
      <p class="fail-desc">Kotak tidak sama. Sila imbas semula!</p>
      <button onclick="resetGame()" class="fail-retry-btn">🔁 IMBAZ SEMULA</button>
    </div>
  `;
  document.getElementById("videoModal").style.display = "block";
}

/* ================= RESET ================= */

function resetGame() {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  location.reload();
}