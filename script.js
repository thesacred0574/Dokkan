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


document.querySelectorAll('.product-card .btn-primary').forEach((btn, i) => {
  setInterval(() => {
    btn.animate(
      [
        { transform: 'translateY(0px)', boxShadow: '0 12px 32px rgba(255,79,200,.24)' },
        { transform: 'translateY(-2px)', boxShadow: '0 18px 38px rgba(255,79,200,.34)' },
        { transform: 'translateY(0px)', boxShadow: '0 12px 32px rgba(255,79,200,.24)' }
      ],
      { duration: 1500, easing: 'ease-in-out' }
    );
  }, 3200 + i * 600);
});


// Gentle CTA pulse for stronger focus
document.querySelectorAll('.sticky-cta .btn-primary, .product-card .btn-primary').forEach((btn, i) => {
  setInterval(() => {
    btn.animate(
      [
        { transform: 'translateY(0)', boxShadow: '0 12px 32px rgba(255,79,200,.24)' },
        { transform: 'translateY(-2px)', boxShadow: '0 18px 40px rgba(255,79,200,.34)' },
        { transform: 'translateY(0)', boxShadow: '0 12px 32px rgba(255,79,200,.24)' }
      ],
      { duration: 1500, easing: 'ease-in-out' }
    );
  }, 2800 + i * 450);
});


const wowMessages=["Someone just secured 12K DS","New buyer opened crypto checkout","13K package got attention","Fast delivery request received"];
const wowSale=document.getElementById("live-sale");
if(wowSale){
  setInterval(()=>{
    wowSale.textContent=wowMessages[Math.floor(Math.random()*wowMessages.length)];
    wowSale.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,easing:'ease-out'});
  },4200);
}

const hero=document.querySelector(".hero-card");
if(hero && window.matchMedia("(pointer:fine)").matches){
  hero.addEventListener("mousemove",(e)=>{
    const r=hero.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-0.5;
    const y=(e.clientY-r.top)/r.height-0.5;
    hero.style.transform=`rotateY(${x*10}deg) rotateX(${-y*8}deg)`;
  });
  hero.addEventListener("mouseleave",()=>{hero.style.transform="rotateY(0deg) rotateX(0deg)";});
}

if(window.matchMedia("(pointer:fine)").matches){
  const dots=[];
  for(let i=0;i<10;i++){
    const d=document.createElement("div");
    d.className="energy-dot";
    d.style.opacity=String(Math.max(0.15,1-i*0.09));
    d.style.width=d.style.height=`${10-i*0.5}px`;
    document.body.appendChild(d);
    dots.push({el:d,x:0,y:0});
  }
  let mx=0,my=0;
  window.addEventListener("mousemove",(e)=>{mx=e.clientX;my=e.clientY;});
  function trail(){
    let x=mx,y=my;
    dots.forEach((dot,i)=>{
      dot.x+=(x-dot.x)*(0.35-i*0.02);
      dot.y+=(y-dot.y)*(0.35-i*0.02);
      dot.el.style.left=dot.x+"px";
      dot.el.style.top=dot.y+"px";
      x=dot.x; y=dot.y;
    });
    requestAnimationFrame(trail);
  }
  trail();
}

const revealEls=document.querySelectorAll(".strip-item, .product-card, .trust-card, .wallet-card, .qr-card, .faq-card, .contact-box");
revealEls.forEach(el=>el.classList.add("wow-reveal"));
const io=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("is-visible");});},{threshold:0.14});
revealEls.forEach(el=>io.observe(el));
