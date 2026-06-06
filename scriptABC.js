let firstBox = null;

// Pautan Starfall untuk kemenangan scan dari A-Z
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
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
function resumeAudio() {
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
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

function speak(text) {
  speechSynthesis.cancel();
  let msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1; msg.pitch = 1.2;
  speechSynthesis.speak(msg);
}

let bgMusic = new Audio("https://cdn.pixabay.com/audio/2022/10/25/audio_946b9c0c87.mp3");
bgMusic.loop = true; bgMusic.volume = 0.15;

function setProgress(step) {
  document.getElementById("bar").style.width = step === 1 ? "50%" : "100%";
}

function startFirstScan() {
  initAudio(); resumeAudio(); if(!bgStarted){ bgStarted=true; bgMusic.play().catch(()=>{}); }
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  scanner.start({ facingMode: "environment" }, { fps: 15, qrbox: 280 }, (text) => {
    firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
    scanner.stop(); coinSound(); setProgress(1);
    document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
    document.getElementById("btn2").disabled = false;
  }).catch(() => alert("Sila semak akses kamera peranti anda."));
}

function startSecondScan() {
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  scanner.start({ facingMode: "environment" }, { fps: 15, qrbox: 280 }, (text) => {
    let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
    scanner.stop(); setProgress(2); check(secondBox);
  });
}

function check(secondBox) {
  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";

  if (firstBox === secondBox) {
    // KEADAAN BETUL (TAHNIAH)
    coinSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#22c55e";
    document.getElementById("result").innerHTML = "<div class='good'>TAHNIAH ANDA BETUL! 🥳</div>";
    setTimeout(() => speak("Tahniah anda betul"), 200);

    if (videoLinks[firstBox]) openMediaFrame(videoLinks[firstBox], false);
    document.getElementById("actionButtons").style.display = "flex";
  } else {
    // KEADAAN SALAH (GAGAL)
    failSound();
    document.getElementById("icon").innerHTML = "😢"; // Emoticon Sedih
    document.getElementById("icon").style.color = "#dc2626";
    document.getElementById("result").innerHTML = "<div class='bad'>Jangan risau! Cuba lagi ya!</div>";
    setTimeout(() => speak("Jangan risau, Cuba lagi ya"), 200);

    // Papar Terus Imej Flashcard secara automatik (.png)
    let flashcardPath = "FLASHCARD/" + firstBox + ".png"; 
    openMediaFrame(flashcardPath, true);

    // Sediakan aksi Butang Video Huruf
    document.getElementById("failVideoBtn").onclick = function() {
      window.location.href = "video.html?type=stroke&letter=" + firstBox;
    };

    document.getElementById("failButtons").style.display = "flex";
  }
}

// Mengembalikan keadaan skrin jika user klik butang 'Kembali' dari fail lain
window.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const activeLetter = urlParams.get('letter');
  if (activeLetter) {
    firstBox = activeLetter.toUpperCase();
    setProgress(2);
    check("FORCE_FAIL_TRIGGER");
    document.getElementById("bar").style.width = "100%";
  }
});

function openMediaFrame(url, isFailedView) {
  document.getElementById("reader").style.display = "none";
  let container = document.getElementById("gameAreaContainer");
  let frame = document.getElementById("gameIframe");
  if (isFailedView) container.classList.add("failed-border");
  else container.classList.remove("failed-border");
  frame.src = url;
  container.style.display = "block";
}

function openBonusLink(url) { window.open(url, "_blank"); }
function goToPage(page) { window.location.href = firstBox ? page + "?letter=" + firstBox : page; }
function goToPlayABC() { window.location.href = firstBox ? "video.html?type=song&letter=" + firstBox : "video.html?type=song"; }
function resetGame() { bgMusic.pause(); window.location.href = "index.html"; }
