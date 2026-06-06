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

let html5QrcodeScanner = null;
let bgMusic = new Audio("LAGU/BG SOUND.mpeg");
bgMusic.loop = true;
bgMusic.volume = 0.2;

// --- FUNGSI KAMERA ASAL (TIDAK DIUBAH SAMA SEKALI) ---
function startFirstScan() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(() => {});
  }
  bgMusic.play().catch(e => console.log(e));

  html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render((decodedText) => {
    firstBox = decodedText.trim().toUpperCase();

    document.getElementById("btn1").disabled = true;
    document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
    document.getElementById("btn2").disabled = false;
    
    let progressBar = document.getElementById("bar");
    if (progressBar) progressBar.style.width = "50%";
    
    document.getElementById("result").innerText = "Sila scan Box Kedua pula!";

    html5QrcodeScanner.clear().then(() => {
      document.getElementById("reader").innerHTML = "";
    }).catch(() => {});
  }, (errorMessage) => {});
}

function startSecondScan() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(() => {});
  }

  html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render((decodedText) => {
    let secondBox = decodedText.trim().toUpperCase();

    document.getElementById("btn2").disabled = true;
    document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
    
    let progressBar = document.getElementById("bar");
    if (progressBar) progressBar.style.width = "100%";

    html5QrcodeScanner.clear().then(() => {
      document.getElementById("reader").innerHTML = "";
      semakKeputusan(firstBox, secondBox);
    }).catch(() => {});
  }, (errorMessage) => {});
}
// --- TAMAT FUNGSI KAMERA ASAL ---

function successSound() { let snd = new Audio("SOUND/SUCCESS.mp3"); snd.play().catch(() => {}); }
function failSound() { let snd = new Audio("SOUND/FAIL.mp3"); snd.play().catch(() => {}); }

function speak(text) {
  if ('speechSynthesis' in window) {
    var msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'ms-MY';
    window.speechSynthesis.speak(msg);
  }
}

function semakKeputusan(fBox, sBox) {
  let imageEl = document.getElementById("flashcardImg");
  let container = document.getElementById("gameAreaContainer");
  let targetLink = videoLinks[fBox];

  document.getElementById("btn1").style.display = "none";
  document.getElementById("btn2").style.display = "none";

  // Simpan data untuk sokongan butang kembali (back)
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

    // Dipadankan mengikut ID pada index.html semasa anda
    let successVideoBtn = document.getElementById("successVideoBtn");
    if (successVideoBtn) {
      successVideoBtn.onclick = function() {
        sessionStorage.setItem("prevPage", "index.html");
        if (targetLink) { window.open(targetLink, "_blank"); }
      };
    }

    let successWriteBtn = document.getElementById("successWriteBtn");
    if (successWriteBtn) {
      successWriteBtn.onclick = function() {
        sessionStorage.setItem("prevPage", "index.html");
        window.location.href = "video.html?type=stroke&letter=" + fBox;
      };
    }

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

    let failVideoBtn = document.getElementById("failVideoBtn");
    if (failVideoBtn) {
      failVideoBtn.onclick = function() {
        sessionStorage.setItem("prevPage", "index.html");
        window.location.href = "video.html?type=bonus_song&letter=" + (fBox || "A");
      };
    }

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
  window.location.href = firstBox ? "video.html?type=song&letter=" + firstBox : "video.html?type=song";
}

function resetGame() {
  bgMusic.pause();
  sessionStorage.removeItem("lastFirstBox");
  sessionStorage.removeItem("lastSecondBox");
  sessionStorage.removeItem("hasScanned");
  window.location.href = "index.html";
}

// Diperbaiki supaya menyemak keadaan sesi tanpa menyekat atau crash kamera asal
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
      
      let progressBar = document.getElementById("bar");
      if (progressBar) progressBar.style.width = "100%";
      
      semakKeputusan(firstBox, secondBox);
    }
  }
};
