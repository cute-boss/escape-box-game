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

// Menguruskan Audio Kesan Bunyi (Sound Effects)
function successSound() {
  let audio = new Audio("LAGU/SUCCESS SOUND.mp3");
  audio.play().catch(e => console.log("Audio play blocked", e));
}

function failSound() {
  let audio = new Audio("LAGU/FAIL SOUND.mp3");
  audio.play().catch(e => console.log("Audio play blocked", e));
}

// Fungsi Sebutan Suara Melayu (Text-to-Speech)
function speak(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Hentikan suara sedia ada jika ada
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ms-MY'; // Set loghat Bahasa Melayu tetap
    utterance.rate = 0.9;     // Kelajuan natural
    window.speechSynthesis.speak(utterance);
  }
}

// Fungsi Semakan Padanan Kod (Match Check)
function checkMatch(fBox, sBox) {
  let imageEl = document.getElementById("flashcardImg");
  let container = document.getElementById("gameAreaContainer");

  if (fBox.toUpperCase() === sBox.toUpperCase()) {
    successSound();
    document.getElementById("icon").innerHTML = "🎉";
    document.getElementById("icon").style.color = "#22c55e";
    
    // Mesej Berjaya yang Tepat
    document.getElementById("result").innerHTML = "<div class='good'>Tahniah! Padanan anda betul!</div>";
    
    // Suara Melayu Berjaya
    setTimeout(() => { speak("Tahniah! Padanan anda betul!"); }, 400);

    // Paparkan Gambar Flashcard
    imageEl.src = "FLASHCARD/" + fBox.toUpperCase() + ".png";
    container.style.display = "block";

    // Konfigurasi Butang Berjaya
    let targetLink = videoLinks[fBox.toUpperCase()];
    document.getElementById("successVideoBtn").onclick = function() {
      if (targetLink) { window.open(targetLink, "_blank"); } else { alert("Pautan video tidak dijumpai!"); }
    };

    document.getElementById("successWriteBtn").onclick = function() {
      sessionStorage.setItem(\"prevPage\", \"index.html\");
      window.location.href = "video.html?type=stroke&letter=" + firstBox;
    };

    // Urus Paparan Blok Butang
    document.getElementById("actionButtons").style.display = "flex";
    document.getElementById("failButtons").style.display = "none";

  } else {
    failSound();
    document.getElementById("icon").innerHTML = "😢";
    document.getElementById("icon").style.color = "#dc2626";
    
    // Mesej Gagal yang Tepat
    document.getElementById("result").innerHTML = "<div class='bad'>Jangan risau! Cuba lagi ya!</div>";
    
    // Suara Melayu Gagal
    setTimeout(() => { speak("Jangan risau, Cuba lagi ya"); }, 400);

    // Tukar gambar kepada carta abjad tetap jika salah
    imageEl.src = "FLASHCARD/ALPHABET LETTERS.png";
    container.style.display = "block";

    // Konfigurasi Butang Gagal (Memastikan firstBox digunakan dengan betul)
    document.getElementById("failVideoBtn").onclick = function() {
      sessionStorage.setItem(\"prevPage\", \"index.html\");
      window.location.href = "video.html?type=bonus_song&letter=" + (firstBox || "A");
    };

    // Urus Paparan Blok Butang
    document.getElementById("actionButtons").style.display = "none";
    document.getElementById("failButtons").style.display = "flex";
  }
}

function goToPage(page) {
  sessionStorage.setItem(\"prevPage\", \"index.html\");
  window.location.href = firstBox ? page + "?letter=" + firstBox : page;
}

function goToPlayABC() {
  sessionStorage.setItem(\"prevPage\", \"index.html\");
  window.location.href = firstBox ? "video.html?type=song&letter=" + firstBox : "video.html?type=song";
}

function resetGame() {
  sessionStorage.removeItem("lastFirstBox");
  sessionStorage.removeItem("lastSecondBox");
  sessionStorage.removeItem("hasScanned");
  window.location.href = "index.html";
}

// Logik Imbasan Kamera & Membaca Kod QR/Bar
function startFirstScan() {
  document.getElementById("reader").style.display = "block";
  const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render((decodedText) => {
    firstBox = decodedText.trim();
    sessionStorage.setItem("lastFirstBox", firstBox);
    document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
    document.getElementById("btn2").disabled = false;
    document.getElementById("bar").style.width = "50%";
    html5QrcodeScanner.clear();
    document.getElementById("reader").style.display = "none";
  }, (error) => { /* log bising dikurangkan */ });
}

function startSecondScan() {
  document.getElementById("reader").style.display = "block";
  const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
  html5QrcodeScanner.render((decodedText) => {
    let secondBox = decodedText.trim();
    sessionStorage.setItem("lastSecondBox", secondBox);
    sessionStorage.setItem("hasScanned", "true");
    document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
    document.getElementById("bar").style.width = "100%";
    html5QrcodeScanner.clear();
    document.getElementById("reader").style.display = "none";
    
    checkMatch(firstBox, secondBox);
  }, (error) => { /* log bising dikurangkan */ });
}

// Pintu Pencetus Pemulihan Sesi (Bila halaman dimuatkan semula)
window.onload = function() {
  let hasScanned = sessionStorage.getItem("hasScanned");
  if (hasScanned === "true") {
    firstBox = sessionStorage.getItem("lastFirstBox");
    let secondBox = sessionStorage.getItem("lastSecondBox");
    if (firstBox) {
      document.getElementById("btn1").innerText = "Box Pertama: " + firstBox;
      document.getElementById("btn2").disabled = false;
    }
    if (secondBox) {
      document.getElementById("btn2").innerText = "Box Kedua: " + secondBox;
      document.getElementById("bar").style.width = "100%";
      checkMatch(firstBox, secondBox);
    }
  }
};
