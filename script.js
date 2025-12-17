// Images: imgs/1.jpg ... imgs/12.jpg
const imageFiles = Array.from({ length: 12 }, (_, i) => `imgs/${i + 1}.jpg`);

const track = document.getElementById("track");
const dotsEl = document.getElementById("dots");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const viewport = document.getElementById("viewport");

let index = 0;

// --- Build slides ---
function buildSlides() {
  track.innerHTML = "";
  dotsEl.innerHTML = "";

  imageFiles.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = "Anniversary photo";
    img.loading = "lazy";

    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement("button");
    dot.className = "dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  });

  updateUI();
}

function goTo(i) {
  index = (i + imageFiles.length) % imageFiles.length;
  track.style.transform = `translateX(${-index * 100}%)`;
  updateUI();
}

function updateUI() {
  const dots = Array.from(dotsEl.children);
  dots.forEach((d, i) => d.classList.toggle("active", i === index));
}

prevBtn.addEventListener("click", () => goTo(index - 1));
nextBtn.addEventListener("click", () => goTo(index + 1));

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") goTo(index - 1);
  if (e.key === "ArrowRight") goTo(index + 1);
});

// Swipe support
let startX = null;
let dragging = false;

viewport.addEventListener(
  "touchstart",
  (e) => {
    if (!e.touches || e.touches.length !== 1) return;
    startX = e.touches[0].clientX;
    dragging = true;
  },
  { passive: true }
);

viewport.addEventListener(
  "touchend",
  (e) => {
    if (!dragging || startX === null) return;
    const endX =
      e.changedTouches && e.changedTouches[0]
        ? e.changedTouches[0].clientX
        : startX;
    const dx = endX - startX;

    if (Math.abs(dx) > 45) {
      if (dx > 0) goTo(index - 1);
      else goTo(index + 1);
    }
    startX = null;
    dragging = false;
  },
  { passive: true }
);

// Optional autoplay (set to 0 to disable)
const autoplayMs = 0;
let autoplayTimer = null;

function startAutoplay() {
  if (!autoplayMs) return;
  stopAutoplay();
  autoplayTimer = setInterval(() => goTo(index + 1), autoplayMs);
}

function stopAutoplay() {
  if (autoplayTimer) clearInterval(autoplayTimer);
  autoplayTimer = null;
}

viewport.addEventListener("mouseenter", stopAutoplay);
viewport.addEventListener("mouseleave", startAutoplay);
viewport.addEventListener("touchstart", stopAutoplay, { passive: true });
viewport.addEventListener("touchend", startAutoplay, { passive: true });

// Floating hearts
function spawnHearts() {
  const host = document.querySelector(".floating-hearts");
  if (!host) return;

  const heart = document.createElement("div");
  heart.className = "heart";
  heart.textContent = Math.random() > 0.5 ? "♥" : "❤";

  const left = Math.random() * 100;
  const drift = (Math.random() * 120 - 60).toFixed(0) + "px";
  const duration = (Math.random() * 2.2 + 3.2).toFixed(2) + "s";
  const size = (Math.random() * 10 + 12).toFixed(0) + "px";

  heart.style.left = left + "%";
  heart.style.setProperty("--drift", drift);
  heart.style.animationDuration = duration;
  heart.style.fontSize = size;

  host.appendChild(heart);
  setTimeout(() => heart.remove(), 6500);
}

buildSlides();
goTo(0);
startAutoplay();
setInterval(spawnHearts, 700);
