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

// --- SISTEM AUDIO & INSTRUMEN ---
let bgMusic = new Audio("LAGU/BG SOUND.mpeg");
bgMusic.loop = true;
bgMusic.volume = 0.2;

function startMusic() { bgMusic.play().catch(e => console.log(e)); }
function coinSound() { let snd = new Audio("SOUND/SUCCESS.mp3"); snd.play().catch(() => {}); } // Menggantikan kesan bunyi coin/success
function jumpSound() { let snd = new Audio("SOUND/SUCCESS.mp3"); snd.play().catch(() => {}); }
function successSound() { let snd = new Audio("SOUND/SUCCESS.mp3"); snd.play().catch(() => {}); }
function failSound() { let snd = new Audio("SOUND/FAIL.mp3"); snd.play().catch(() => {}); }

function speak(text) {
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'ms-MY';
    window.speechSynthesis.speak(msg);
  }
}

// Menguruskan bar kemajuan kemajuan secara dinamik berdasarkan keperluan kod anda
function setProgress(step) {
  let progressBar = document.getElementById("bar");
  if (progressBar) {
    if (step === 1) progressBar.style.width = "50%";
    if (step === 2) progressBar.style.width = "100%";
  }
}

/* ================= SCAN FIRST ================= */
function startFirstScan() {
  startMusic();
  speak(""); 
  
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");
  
  scanner.start(
    { facingMode: { exact: "environment" } },
    {
      fps: 15, qrbox: 280,
      videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    },
    (text) => {
      firstBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop().then(() => {
        coinSound(); 
        setProgress(1);
        document.getElementById("btn1").disabled = true;
        document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
        document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
        document.getElementById("btn2").disabled = false;
      }).catch(err => console.error(err));
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
      scanner.stop().then(() => {
        coinSound(); 
        setProgress(1);
        document.getElementById("btn1").disabled = true;
        document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
        document.getElementById("result").innerHTML = "✔ Box pertama: <b>" + firstBox + "</b><br>Seterusnya, scan box kedua";
        document.getElementById("btn2").disabled = false;
      }).catch(err => console.error(err));
    }
  ).catch(err => alert("Sila semak kebenaran akses kamera peranti anda."));
}

/* ================= SCAN SECOND ================= */
function startSecondScan() {
  if (!firstBox) { alert("Scan box pertama dulu!"); return; }
  document.getElementById("gameAreaContainer").style.display = "none";
  document.getElementById("reader").style.display = "block";
  let scanner = new Html5Qrcode("reader");

  scanner.start(
    { facingMode: { exact: "environment" } },
    {
      fps: 15, qrbox: 280,
      videoConstraints: { facingMode: { exact: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
    },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop().then(() => {
        setProgress(2); 
        document.getElementById("btn2").disabled = true;
        document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
        semakKeputusan(firstBox, secondBox);
      }).catch(err => console.error(err));
    }
  ).catch(err => { startSecondScanFallback(); });
}

function startSecondScanFallback() {
  let scanner = new Html5Qrcode("reader");
  scanner.start(
    { fps: 15, qrbox: 280, videoConstraints: { width: { ideal: 1280 }, height: { ideal: 720 } } },
    (text) => {
      let secondBox = text.includes("box=") ? text.split("box=")[1].toUpperCase() : text.toUpperCase().trim();
      scanner.stop().then(() => {
        setProgress(2); 
        document.getElementById("btn2").disabled = true;
        document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
        semakKeputusan(firstBox, secondBox);
      }).catch(err => console.error(err));
    }
  ).catch(err => console.error(err));
}

/* ================= PROSES SEMAKAN & UI ================= */
function semakKeputusan(fBox, sBox) {
  let imageEl = document.getElementById("flashcardImg");
  let container = document.getElementById("gameAreaContainer");
  let targetLink = videoLinks[fBox];

  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";
  document.getElementById("reader").style.display = "none"; // Tutup ruangan kamera setelah selesai imbasan

  sessionStorage.setItem("lastFirstBox", fBox);
  sessionStorage.setItem("lastSecondBox", sBox);
  sessionStorage.setItem("hasScanned", "true");

  if (fBox === sBox) {
    successSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#16a34a";
    document.getElementById("result").innerHTML = "<div class='good'>Tahniah! Padanan Betul!</div>";

    setTimeout(() => { speak("Tahniah! Padanan Betul"); }, 400);

    imageEl.src = "FLASHCARD/" + fBox + ".png";
    container.style.display = "block";

    // Tetapkan fungsi klik untuk ID butang success mengikut index.html terkini
    document.getElementById("successVideoBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html");
      if (targetLink) { window.open(targetLink, "_blank"); }
    };

    document.getElementById("successWriteBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html");
      window.location.href = "video.html?type=stroke&letter=" + fBox;
    };

    document.getElementById("actionButtons").style.display = "flex";
    document.getElementById("failButtons").style.display = "none";

  } else {
    failSound();
    document.getElementById("icon").innerHTML = "😢";
    document.getElementById("icon").style.color = "#dc2626";
    document.getElementById("result").innerHTML = "<div class='bad'>Jangan risau! Cuba lagi ya!</div>";

    setTimeout(() => { speak("Jangan risau, Cuba lagi ya"); }, 400);
    
    imageEl.src = "FLASHCARD/ALPHABET LETTERS.png";
    container.style.display = "block";

    // Tetapkan fungsi klik untuk ID butang fail mengikut index.html terkini
    document.getElementById("failVideoBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html");
      window.location.href = "video.html?type=bonus_song&letter=" + (fBox || "A");
    };

    document.getElementById("actionButtons").style.display = "none";
    document.getElementById("failButtons").style.display = "flex";
  }
}

function goToPage(page) {
  sessionStorage.setItem("prevPage", "index.html");
  window.location.href = firstBox ? page + "?letter=" + firstBox : page;
}

function goToPlayABC() {
  sessionStorage.setItem("prevPage", "index.html");
  window.location.href = firstBox ? "video.html?type=song&letter=" + firstBox : "video.html?type=song";
}

function resetGame() {
  bgMusic.pause();
  sessionStorage.removeItem("lastFirstBox");
  sessionStorage.removeItem("lastSecondBox");
  sessionStorage.removeItem("hasScanned");
  window.location.href = "index.html";
}

/* ================= RESTORE STATUS SCANNING ================= */
window.onload = function() {
  let hasScanned = sessionStorage.getItem("hasScanned");
  if (hasScanned === "true") {
    firstBox = sessionStorage.getItem("lastFirstBox");
    let secondBox = sessionStorage.getItem("lastSecondBox");
    if (firstBox) {
      document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
      document.getElementById("btn1").disabled = true;
      document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
      document.getElementById("btn2").disabled = true;
      
      setProgress(2);
      semakKeputusan(firstBox, secondBox);
    }
  }
};
