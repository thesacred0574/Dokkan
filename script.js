const walletButton = document.getElementById("copy-wallet-btn");
const walletAddress = document.getElementById("wallet-address");

if (walletButton && walletAddress) {
  walletButton.addEventListener("click", async () => {
    const original = walletButton.textContent;
    try {
      await navigator.clipboard.writeText(walletAddress.textContent.trim());
      walletButton.textContent = "Copied";
      setTimeout(() => walletButton.textContent = original, 1400);
    } catch {
      walletButton.textContent = "Copy Failed";
      setTimeout(() => walletButton.textContent = original, 1400);
    }
  });
}

document.querySelectorAll(".tilt-card").forEach((card) => {
  const strength = card.classList.contains("hero-card") ? 12 : 9;

  function resetCard() {
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
  }

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateY = ((x / rect.width) - 0.5) * (strength * 2);
    const rotateX = (0.5 - (y / rect.height)) * (strength * 2);

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", resetCard);
  card.addEventListener("blur", resetCard);
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});


// Stronger parallax on scroll
const heroVisual = document.querySelector(".hero-visual");
const orbs = document.querySelectorAll(".orb");

function applyParallax() {
  const scrolled = window.scrollY || window.pageYOffset;
  if (heroVisual) {
    heroVisual.style.transform = `translateY(${scrolled * 0.06}px)`;
  }
  orbs.forEach((orb, i) => {
    const factor = 0.03 + i * 0.015;
    orb.style.transform = `translateY(${scrolled * factor}px)`;
  });
}
window.addEventListener("scroll", applyParallax, { passive: true });
applyParallax();


document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transition = "transform .12s ease, box-shadow .18s ease, border-color .18s ease";
  });
});
