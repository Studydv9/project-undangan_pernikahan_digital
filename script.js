const tanggalNikah = new Date(2026, 11, 20, 8, 0, 0); 

const fotoGaleri = [
  { src: "img/galeri-5.jpg", alt: "Razi seated with Ilusi standing beside him",  w: 900, h: 1599 },
  { src: "img/galeri-6.jpg", alt: "Wedding table with sage green draping",       w: 600, h: 600 },
  { src: "img/galeri-1.jpg", alt: "Ilusi and Razi in cream traditional attire",  w: 1000, h: 1200 },
  { src: "img/galeri-2.jpg", alt: "Sage green wedding aisle",                    w: 675, h: 1200 },
  { src: "img/galeri-3.jpg", alt: "Razi seated with Ilusi beside him",           w: 1000, h: 1187 },
  { src: "img/galeri-4.jpg", alt: "Wedding table with flowers and chandelier",   w: 900, h: 1600 }
];

let ucapan = [
  { nama: "Budi",  hadir: "Attending", pesan: "Congratulations on your wedding!" },
  { nama: "Sinta", hadir: "Attending", pesan: "May your marriage be filled with love and blessings." }
];

const params = new URLSearchParams(window.location.search);
const tamu = params.get("to");
if (tamu) document.getElementById("namaTamu").textContent = tamu;

const hariIni = new Date().getDay();
let sapa;
switch (hariIni) {
  case 0: sapa = "Happy Sunday"; break;
  case 5: sapa = "Happy Friday"; break;
  case 6: sapa = "Happy Saturday"; break;
  default: sapa = "Have a lovely day";
}
document.getElementById("sapaan").textContent = sapa + "!";

const cover = document.getElementById("cover");
const musik = document.getElementById("musik");
const btnMusik = document.getElementById("btnMusik");
document.body.classList.add("terkunci");

document.getElementById("btnBuka").addEventListener("click", () => {
  console.log("Invitation opened");
  cover.classList.add("buka");
  document.body.classList.remove("terkunci");
  musik.play().then(() => btnMusik.classList.add("putar")).catch(() => console.warn("Autoplay was blocked by the browser"));
});

btnMusik.addEventListener("click", () => {
  if (musik.paused) {
    musik.play().catch(() => { console.error("Music failed to play"); alert("The music file (lagu.mp3) could not be played."); });
  } else {
    musik.pause();
  }
  btnMusik.classList.toggle("putar", !musik.paused);
});

function dua(n) {
  let s = String(n);
  while (s.length < 2) s = "0" + s;
  return s;
}

function hitungMundur() {
  const selisih = tanggalNikah - new Date();
  if (selisih <= 0) {
    document.getElementById("countdown").textContent = "The happy day has arrived!";
    return;
  }
  const detikTotal = Math.floor(selisih / 1000);
  document.getElementById("hari").textContent = Math.floor(detikTotal / 86400);
  document.getElementById("jam").textContent = dua(Math.floor((detikTotal % 86400) / 3600));
  document.getElementById("menit").textContent = dua(Math.floor((detikTotal % 3600) / 60));
  document.getElementById("detik").textContent = dua(detikTotal % 60);
}
hitungMundur();
setInterval(hitungMundur, 1000);

const galeriGrid = document.getElementById("galeriGrid");
fotoGaleri.forEach(foto => {
  const img = document.createElement("img");
  img.src = foto.src;
  img.alt = foto.alt;
  img.width = foto.w;      
  img.height = foto.h;
  img.loading = "lazy";
  img.className = "foto";
  galeriGrid.appendChild(img);
});

const hero = document.getElementById("beranda");
let i = 0;
do {
  const kelopak = document.createElement("span");
  kelopak.className = "kelopak";
  kelopak.style.left = Math.random() * 100 + "%";
  kelopak.style.animationDuration = 9 + Math.random() * 8 + "s";
  kelopak.style.animationDelay = -Math.random() * 15 + "s";
  kelopak.style.opacity = 0.4 + Math.random() * 0.4;
  hero.appendChild(kelopak);
  i++;
} while (i < 28);

var jumlahKirim = 0;   

function tampilkanUcapan() {
  const wadah = document.getElementById("daftarUcapan");
  wadah.innerHTML = "";
  let jumlahHadir = 0;
  for (let i = ucapan.length - 1; i >= 0; i--) {      
    const u = ucapan[i];
    if (u.hadir.startsWith("Attending")) jumlahHadir++;
    const item = document.createElement("div");
    item.className = "ucapan";
    const nama = document.createElement("b");
    nama.textContent = u.nama;
    const status = document.createElement("span");
    status.className = "status";
    status.textContent = " · " + u.hadir;
    const pesan = document.createElement("p");
    pesan.className = "mb-0";
    pesan.textContent = u.pesan;
    item.append(nama, status, pesan);
    wadah.appendChild(item);
  }
  document.getElementById("totalUcapan").textContent = ucapan.length;
  document.getElementById("totalHadir").textContent = jumlahHadir;
}
tampilkanUcapan();

const selectHadir = document.getElementById("hadir");
const detailTamu = document.getElementById("detailTamu");
function aturDetailTamu() { detailTamu.disabled = selectHadir.value !== "Attending"; }
selectHadir.addEventListener("change", aturDetailTamu);
document.getElementById("formRsvp").addEventListener("reset", () => setTimeout(aturDetailTamu, 0));
aturDetailTamu();

function validasiForm() {
  const nama = document.getElementById("nama").value.trim();
  const hadir = selectHadir.value;
  const pesan = document.getElementById("pesan").value.trim();
  const jumlah = Number(document.getElementById("jumlah").value);
  const menu = document.querySelector('input[name="menu"]:checked');
  const extra = [];
  document.querySelectorAll('input[name="extra"]:checked').forEach(c => extra.push(c.value));

  if (nama === "" || hadir === "" || pesan === "") {
    alert("Please fill in your name, attendance, and wishes.");
    return false;                       
  }
  if (hadir === "Attending" && (jumlah < 1 || jumlah > 5)) {
    alert("The number of guests must be between 1 and 5.");
    return false;
  }
  let status = hadir;
  if (hadir === "Attending") {
    status += " · " + jumlah + (jumlah === 1 ? " guest" : " guests") + " · " + menu.value;
    if (extra.length) status += " · " + extra.join(", ");
  }
  jumlahKirim++;
  console.log("Wishes sent:", jumlahKirim, "(type: " + typeof jumlahKirim + ")");
  ucapan.push({ nama, hadir: status, pesan });
  tampilkanUcapan();
  document.getElementById("formRsvp").reset();
  aturDetailTamu();

  document.getElementById("isiModal").textContent = "Your wishes have been sent, " + nama + ".";
  new bootstrap.Modal(document.getElementById("modalSukses")).show();
  return false;                       
}

document.querySelectorAll(".btn-salin").forEach(btn => {
  btn.addEventListener("click", async () => {
    const nomor = btn.dataset.nomor;
    try {
      await navigator.clipboard.writeText(nomor);
    } catch (err) {                       
      const t = document.createElement("textarea");
      t.value = nomor; document.body.appendChild(t); t.select();
      document.execCommand("copy"); t.remove();
    }
    const awal = btn.textContent;
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = awal), 1800);   
  });
});

const blokReveal = document.querySelectorAll("main section[id] > .container");
blokReveal.forEach(el => el.classList.add("reveal"));
const pengamat = new IntersectionObserver((daftar) => {
  daftar.forEach(item => {
    if (item.isIntersecting) {
      item.target.classList.add("tampil");
      pengamat.unobserve(item.target);
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px -8% 0px" });
blokReveal.forEach(el => pengamat.observe(el));

const btnAtas = document.getElementById("btnAtas");
window.addEventListener("scroll", () => btnAtas.classList.toggle("tampil", window.scrollY > 400));
btnAtas.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));