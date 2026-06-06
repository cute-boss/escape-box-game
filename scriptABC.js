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

function startFirstScan() {
  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear().catch(() => {});
  }
  bgMusic.play().catch(e => console.log(e));

  // KEKAL: Menggunakan fungsi pengimbas asal yang terbukti berfungsi pada peranti anda
  html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render((decodedText) => {
    firstBox = decodedText.trim().toUpperCase();

    document.getElementById("btn1").disabled = true;
    document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
    document.getElementById("btn2").disabled = false;
    document.getElementById("bar").style.width = "50%";
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

  // KEKAL: Menggunakan fungsi pengimbas asal untuk imbasan kedua
  html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render((decodedText) => {
    let secondBox = decodedText.trim().toUpperCase();

    document.getElementById("btn2").disabled = true;
    document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
    document.getElementById("bar").style.width = "100%";

    html5QrcodeScanner.clear().then(() => {
      document.getElementById("reader").innerHTML = "";

      // CIRI KEMBALI: Simpan keputusan ke memori untuk sokongan butang 'Back'
      sessionStorage.setItem("lastFirstBox", firstBox);
      sessionStorage.setItem("lastSecondBox", secondBox);
      sessionStorage.setItem("hasScanned", "true");

      semakKeputusan(firstBox, secondBox);
    }).catch(() => {});
  }, (errorMessage) => {});
}

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

  if (fBox === sBox) {
    successSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#16a34a";
    document.getElementById("result").innerHTML = "<div class='good'>Tahniah! Padanan Betul!</div>";

    setTimeout(() => { speak("Tahniah! Padanan Betul"); }, 400);
    imageEl.src = "FLASHCARD/" + fBox + ".png";
    container.style.display = "block";

    // CIRI MENULIS & VIDEO: Dipautkan ke halaman video mengikut huruf dikesan
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
    
    // KEKAL: Menggunakan paparan imej tersasar kegemaran anda
    imageEl.src = "FLASHCARD/ALPHABET LETTERS.png";
    container.style.display = "block";

    // CIRI BONUS FAIL: Jika salah, butang membawa ke lagu bonus mengikut huruf pertama
    document.getElementById("failVideoBtn").onclick = function() {
      sessionStorage.setItem("prevPage", "index.html");
      window.location.href = "video.html?type=bonus_song&letter=" + (fBox || "A");
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
  window.location.href = firstBox ? "video.html?type=song&letter=" + firstBox : "video.html?type=song";
}

function resetGame() {
  bgMusic.pause();
  sessionStorage.removeItem("lastFirstBox");
  sessionStorage.removeItem("lastSecondBox");
  sessionStorage.removeItem("hasScanned");
  window.location.href = "index.html";
}

// CIRI MEMORI: Memastikan jika pengguna klik butang kembali dari video.html, keputusan imbasan tidak hilang
window.onload = function() {
  let hasScanned = sessionStorage.getItem("hasScanned");
  if (hasScanned === "true") {
    firstBox = sessionStorage.getItem("lastFirstBox");
    let secondBox = sessionStorage.getItem("lastSecondBox");
    if (firstBox) {
      bgMusic.play().catch(() => {});
      document.getElementById("bar").style.width = "100%";
      semakKeputusan(firstBox, secondBox);
    }
  }
};
