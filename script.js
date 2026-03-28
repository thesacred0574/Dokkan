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


// ── Background music with smooth fade-in ─────────────────────
(function () {
  const music = document.getElementById('bg-music');
  const btn   = document.getElementById('music-btn');
  if (!music || !btn) return;

  music.volume = 0;
  let playing = false;
  let started = false;

  function fadeIn() {
    let v = 0;
    music.volume = 0;
    const step = () => {
      v = Math.min(v + 0.012, 0.45);   // max volume 45% — נעים לרקע
      music.volume = v;
      if (v < 0.45) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function fadeOut(cb) {
    let v = music.volume;
    const step = () => {
      v = Math.max(v - 0.018, 0);
      music.volume = v;
      if (v > 0) requestAnimationFrame(step);
      else { music.pause(); if (cb) cb(); }
    };
    requestAnimationFrame(step);
  }

  function startMusic() {
    if (started) return;
    started = true;
    music.play().then(() => {
      playing = true;
      btn.classList.add('playing');
      btn.classList.remove('paused');
      fadeIn();
    }).catch(() => {});
  }

  // Auto-start on first user interaction
  const tryStart = () => { startMusic(); };
  ['click','touchstart','keydown','scroll'].forEach(ev =>
    document.addEventListener(ev, tryStart, { once: true, passive: true })
  );

  // Manual toggle
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!started) { startMusic(); return; }
    if (playing) {
      fadeOut();
      playing = false;
      btn.classList.remove('playing');
      btn.classList.add('paused');
    } else {
      music.play().then(() => {
        playing = true;
        btn.classList.add('playing');
        btn.classList.remove('paused');
        fadeIn();
      }).catch(() => {});
    }
  });
})();


// ── Scroll progress bar ──────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  if (!progressBar) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = max > 0 ? (window.scrollY / max * 100) + '%' : '0%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();


// ── Reveal on scroll ─────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.10 });

document.querySelectorAll('.product-grid, .trust-grid, .faq-grid, .conversion-strip').forEach(grid => {
  grid.querySelectorAll('.reveal').forEach((el, i) => { el.style.transitionDelay = `${i * 0.12}s`; });
});
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


// ── Chess Engine ─────────────────────────────────────────────
(function () {
  const EMPTY = 0, PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6;
  const WHITE = 1, BLACK = -1;

  // ── Dragon Ball Z themed chess pieces ──
  function pieceSVG(type, white) {
    // White = gold (Z-fighters), Black = purple (Villains)
    const c1 = white ? '#ffe870' : '#9040e0';
    const c2 = white ? '#c07800' : '#1c0050';
    const sk = white ? '#6a2e00' : '#dd99ff';
    const id = white ? 'w' : 'b';
    const sw = 1.5;

    const defs = `<defs>
<linearGradient id="g${id}" x1="20%" y1="0%" x2="80%" y2="100%">
  <stop offset="0%" stop-color="${c1}"/>
  <stop offset="100%" stop-color="${c2}"/>
</linearGradient></defs>`;
    const F = `url(#g${id})`;
    const base = `<rect x="7" y="38" width="31" height="4.5" rx="2.25" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`;

    const shapes = {
      // PAWN – Saiyan warrior with 3 spiky hair points
      1: `<circle cx="22.5" cy="12" r="5.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<path d="M16.5 9.5 L13.5 3.5 L18.5 8.5" fill="${F}" stroke="${sk}" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M22.5 6.5 L21 1 L25 6" fill="${F}" stroke="${sk}" stroke-width="1.2" stroke-linejoin="round"/>
<path d="M28.5 9.5 L31.5 3.5 L26.5 8.5" fill="${F}" stroke="${sk}" stroke-width="1.2" stroke-linejoin="round"/>
<rect x="19.5" y="17.5" width="6" height="3.5" rx="1" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<path d="M15.5 21 L13.5 34.5 L31.5 34.5 L29.5 21 Z" fill="${F}" stroke="${sk}" stroke-width="${sw}" stroke-linejoin="round"/>
<rect x="12.5" y="34.5" width="20" height="3" rx="1.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`,

      // KNIGHT – Shenron dragon head with horns and eye
      2: `<path d="M10.5 25 C8.5 20 9 13 13.5 9 C17 6 21 5.5 24 5.5 C30 5.5 35.5 10.5 36 16.5 C36.5 22.5 33.5 27 29 29 L27.5 34.5 L17.5 34.5 L16 29 C12 27 11 26.5 10.5 25 Z" fill="${F}" stroke="${sk}" stroke-width="${sw}" stroke-linejoin="round"/>
<path d="M18 8 L15 2 L19.5 7" fill="${F}" stroke="${sk}" stroke-width="1.3" stroke-linejoin="round"/>
<path d="M27.5 7 L29 1.5 L31 7.5" fill="${F}" stroke="${sk}" stroke-width="1.3" stroke-linejoin="round"/>
<circle cx="18" cy="16.5" r="2.5" fill="${sk}"/>
<circle cx="18" cy="16.5" r="1.1" fill="${c1}"/>
<path d="M20 24 C22 21 25.5 21 27.5 24" fill="none" stroke="${sk}" stroke-width="1.5" stroke-linecap="round"/>
<rect x="12" y="34.5" width="21" height="3" rx="1.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`,

      // BISHOP – Namekian with antenna (like Piccolo)
      3: `<circle cx="22.5" cy="10" r="4.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<line x1="22.5" y1="5.5" x2="22.5" y2="0.5" stroke="${sk}" stroke-width="2.5" stroke-linecap="round"/>
<path d="M22.5 1.5 L18.5 4.5 M22.5 1.5 L26.5 4.5" stroke="${sk}" stroke-width="1.5" stroke-linecap="round"/>
<path d="M13 32.5 C13.5 24 17.5 16 22.5 12 C27.5 16 31.5 24 32 32.5 Z" fill="${F}" stroke="${sk}" stroke-width="${sw}" stroke-linejoin="round"/>
<line x1="17" y1="25" x2="28" y2="18" stroke="${sk}" stroke-width="1.8" stroke-linecap="round" opacity="0.65"/>
<rect x="11" y="32.5" width="23" height="3" rx="1.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`,

      // ROOK – Capsule Corp energy tower
      4: `<rect x="11.5" y="7" width="5" height="6" rx="0.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<rect x="20" y="7" width="5" height="6" rx="0.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<rect x="28.5" y="7" width="5" height="6" rx="0.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<rect x="10" y="12" width="25" height="3.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<rect x="12.5" y="15.5" width="20" height="18.5" rx="0.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<line x1="16.5" y1="19.5" x2="28.5" y2="19.5" stroke="${sk}" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
<line x1="16.5" y1="24" x2="28.5" y2="24" stroke="${sk}" stroke-width="1.2" stroke-linecap="round" opacity="0.55"/>
<rect x="10" y="34" width="25" height="3" rx="1.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`,

      // QUEEN – Dragon Ball crown (5 orbs as crown tips, center has star dot)
      5: `<circle cx="7.5" cy="13.5" r="2.8" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<circle cx="14.5" cy="9.5" r="2.8" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<circle cx="22.5" cy="8" r="3.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<circle cx="30.5" cy="9.5" r="2.8" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<circle cx="37.5" cy="13.5" r="2.8" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<circle cx="22.5" cy="8" r="1.5" fill="${sk}" opacity="0.75"/>
<path d="M6 16.5 L10 32 L35 32 L39 16.5 L30.5 23.5 L22.5 12.5 L14.5 23.5 Z" fill="${F}" stroke="${sk}" stroke-width="${sw}" stroke-linejoin="round"/>
<rect x="9.5" y="32" width="26" height="3" rx="1.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`,

      // KING – Goku's 5 spiky hair points + crown band
      6: `<path d="M13 16.5 L10.5 9 L16 14.5" fill="${F}" stroke="${sk}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M18.5 14 L16.5 6 L21.5 13" fill="${F}" stroke="${sk}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M22.5 13 L22 4.5 L26 12.5" fill="${F}" stroke="${sk}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M26.5 14 L28.5 6 L23.5 13" fill="${F}" stroke="${sk}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M32 16.5 L34.5 9 L29 14.5" fill="${F}" stroke="${sk}" stroke-width="1.4" stroke-linejoin="round"/>
<rect x="10" y="16" width="25" height="3.5" rx="1" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>
<path d="M12.5 19.5 L11 33 L34 33 L32.5 19.5 Z" fill="${F}" stroke="${sk}" stroke-width="${sw}" stroke-linejoin="round"/>
<rect x="10" y="33.5" width="25" height="3" rx="1.5" fill="${F}" stroke="${sk}" stroke-width="${sw}"/>`,
    };

    return `<svg viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg">${defs}${shapes[type] || ''}${base}</svg>`;
  }

  const INIT = [
    [-4,-2,-3,-5,-6,-3,-2,-4],
    [-1,-1,-1,-1,-1,-1,-1,-1],
    [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1],
    [4,2,3,5,6,3,2,4]
  ];

  let board, turn, ep, castle, history, over, sel, hints, lastMv;

  function cloneBoard(b) { return b.map(r => [...r]); }
  function col(p) { return p > 0 ? WHITE : p < 0 ? BLACK : 0; }
  function abs(p) { return Math.abs(p); }

  function pseudo(b, r, c, enP, cas) {
    const p = b[r][c], color = col(p), type = abs(p);
    const mv = [];
    function add(nr, nc, fl = {}) {
      if (nr < 0 || nr > 7 || nc < 0 || nc > 7) return;
      if (col(b[nr][nc]) === color) return;
      mv.push({ fr: r, fc: c, tr: nr, tc: nc, ...fl });
    }
    function slide(dirs) {
      for (const [dr, dc] of dirs) {
        let nr = r+dr, nc = c+dc;
        while (nr>=0&&nr<8&&nc>=0&&nc<8) {
          if (b[nr][nc]) { if (col(b[nr][nc])!==color) mv.push({fr:r,fc:c,tr:nr,tc:nc}); break; }
          mv.push({fr:r,fc:c,tr:nr,tc:nc}); nr+=dr; nc+=dc;
        }
      }
    }
    if (type===PAWN) {
      const d = color===WHITE?-1:1, start = color===WHITE?6:1, prRow = color===WHITE?0:7;
      if (b[r+d]&&b[r+d][c]===EMPTY) {
        mv.push({fr:r,fc:c,tr:r+d,tc:c,promo:r+d===prRow});
        if (r===start&&b[r+d*2][c]===EMPTY) mv.push({fr:r,fc:c,tr:r+d*2,tc:c,dbl:true});
      }
      for (const dc of [-1,1]) {
        const nr=r+d,nc=c+dc;
        if (nc<0||nc>7) continue;
        if (col(b[nr][nc])===(-color)) mv.push({fr:r,fc:c,tr:nr,tc:nc,promo:nr===prRow});
        if (enP&&enP[0]===nr&&enP[1]===nc) mv.push({fr:r,fc:c,tr:nr,tc:nc,ep:true});
      }
    } else if (type===KNIGHT) {
      for (const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) add(r+dr,c+dc);
    } else if (type===BISHOP) { slide([[-1,-1],[-1,1],[1,-1],[1,1]]);
    } else if (type===ROOK)   { slide([[-1,0],[1,0],[0,-1],[0,1]]);
    } else if (type===QUEEN)  { slide([[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
    } else if (type===KING) {
      for (const [dr,dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) add(r+dr,c+dc);
      if (cas) {
        const br = color===WHITE?7:0;
        if (r===br&&c===4) {
          const kR = color===WHITE?cas.wK:cas.bK, qR = color===WHITE?cas.wQ:cas.bQ;
          if (kR&&b[br][5]===EMPTY&&b[br][6]===EMPTY) mv.push({fr:r,fc:c,tr:br,tc:6,cas:'K'});
          if (qR&&b[br][3]===EMPTY&&b[br][2]===EMPTY&&b[br][1]===EMPTY) mv.push({fr:r,fc:c,tr:br,tc:2,cas:'Q'});
        }
      }
    }
    return mv;
  }

  function inCheck(b, color) {
    let kr=-1,kc=-1;
    outer: for (let r=0;r<8;r++) for (let c=0;c<8;c++) if (b[r][c]===color*KING){kr=r;kc=c;break outer;}
    for (let r=0;r<8;r++) for (let c=0;c<8;c++)
      if (col(b[r][c])===(-color) && pseudo(b,r,c,null,null).some(m=>m.tr===kr&&m.tc===kc)) return true;
    return false;
  }

  function applyMv(b, m, cas) {
    const nb = cloneBoard(b);
    nb[m.tr][m.tc] = nb[m.fr][m.fc];
    nb[m.fr][m.fc] = EMPTY;
    if (m.ep) nb[m.fr][m.tc] = EMPTY;
    if (m.promo) nb[m.tr][m.tc] = col(nb[m.tr][m.tc]) * QUEEN;
    if (m.cas==='K') { nb[m.tr][5]=nb[m.tr][7]; nb[m.tr][7]=EMPTY; }
    if (m.cas==='Q') { nb[m.tr][3]=nb[m.tr][0]; nb[m.tr][0]=EMPTY; }
    const nc = cas ? {...cas} : null;
    if (nc) {
      const pc = abs(b[m.fr][m.fc]);
      if (pc===KING) { if (col(b[m.fr][m.fc])===WHITE){nc.wK=nc.wQ=false;}else{nc.bK=nc.bQ=false;} }
      if (m.fr===7&&m.fc===0) nc.wQ=false; if (m.fr===7&&m.fc===7) nc.wK=false;
      if (m.fr===0&&m.fc===0) nc.bQ=false; if (m.fr===0&&m.fc===7) nc.bK=false;
    }
    return { nb, nc };
  }

  function legal(b, color, enP, cas) {
    const moves = [];
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      if (col(b[r][c])!==color) continue;
      for (const m of pseudo(b,r,c,enP,cas)) {
        if (m.cas) {
          const midC = m.cas==='K'?5:3;
          const {nb} = applyMv(b,{fr:m.fr,fc:m.fc,tr:m.tr,tc:midC},cas);
          if (inCheck(nb,color)) continue;
        }
        const {nb} = applyMv(b,m,cas);
        if (!inCheck(nb,color)) moves.push(m);
      }
    }
    return moves;
  }

  const PST = {
    1:[[0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]],
    2:[[-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]],
    3:[[-20,-10,-10,-10,-10,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,10,10,5,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,10,10,10,10,0,-10],[-10,10,10,10,10,10,10,-10],[-10,5,0,0,0,0,5,-10],[-20,-10,-10,-10,-10,-10,-10,-20]],
    4:[[0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]],
    5:[[-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]],
    6:[[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]]
  };
  const VAL = {1:100,2:320,3:330,4:500,5:900,6:20000};

  function evaluate(b) {
    let s = 0;
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      const p=b[r][c]; if (!p) continue;
      const cl=col(p),t=abs(p),pr=cl===WHITE?r:7-r;
      s += cl*(VAL[t]+(PST[t]?PST[t][pr][c]:0));
    }
    return s;
  }

  function minimax(b, depth, alpha, beta, maxing, enP, cas) {
    const color = maxing ? BLACK : WHITE;
    const moves = legal(b, color, enP, cas);
    if (!depth || !moves.length) {
      if (!moves.length) return inCheck(b,color)?(maxing?-99999:99999):0;
      return evaluate(b);
    }
    moves.sort((a,z)=>abs(b[z.tr][z.tc])-abs(b[a.tr][a.tc]));
    let best = maxing ? -Infinity : Infinity;
    for (const m of moves) {
      const newEp = m.dbl?[m.tr+(maxing?1:-1),m.tc]:null;
      const {nb,nc} = applyMv(b,m,cas);
      const score = minimax(nb,depth-1,alpha,beta,!maxing,newEp,nc);
      if (maxing) { best=Math.max(best,score); alpha=Math.max(alpha,best); }
      else        { best=Math.min(best,score); beta=Math.min(beta,best);  }
      if (beta<=alpha) break;
    }
    return best;
  }

  function bestAiMove() {
    const moves = legal(board, BLACK, ep, castle);
    if (!moves.length) return null;
    moves.sort(()=>Math.random()-.5);
    let best=-Infinity, bm=null;
    for (const m of moves) {
      const newEp = m.dbl?[m.tr+1,m.tc]:null;
      const {nb,nc} = applyMv(board,m,castle);
      const s = minimax(nb,3,-Infinity,Infinity,false,newEp,nc);
      if (s>best){best=s;bm=m;}
    }
    return bm;
  }

  function setStatus(msg, cls='') {
    const el = document.getElementById('chess-status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'chess-status' + (cls?' '+cls:'');
  }

  function render() {
    const boardEl = document.getElementById('chess-board');
    if (!boardEl) return;
    boardEl.innerHTML = '';
    const targets = new Set(hints.map(m=>`${m.tr},${m.tc}`));
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      const sq = document.createElement('div');
      sq.className='chess-sq '+((r+c)%2===0?'chess-sq-light':'chess-sq-dark');
      if (sel&&sel[0]===r&&sel[1]===c) sq.classList.add('chess-sq-selected');
      if (targets.has(`${r},${c}`)) sq.classList.add(board[r][c]?'chess-sq-capture':'chess-sq-hint');
      if (lastMv&&((lastMv.fr===r&&lastMv.fc===c)||(lastMv.tr===r&&lastMv.tc===c))) sq.classList.add('chess-sq-lastmove');
      if (inCheck(board,turn)&&board[r][c]===turn*KING) sq.classList.add('chess-sq-check');
      const p = board[r][c];
      if (p) {
        const pe = document.createElement('div');
        pe.className='chess-piece '+(col(p)===WHITE?'chess-piece-white':'chess-piece-black');
        pe.innerHTML = pieceSVG(abs(p), col(p)===WHITE);
        sq.appendChild(pe);
      }
      sq.addEventListener('click',()=>onClick(r,c));
      boardEl.appendChild(sq);
    }
  }

  function onClick(r, c) {
    if (over || turn===BLACK) return;
    const p = board[r][c];
    if (sel) {
      const mv = hints.find(m=>m.tr===r&&m.tc===c);
      if (mv) { sel=null; hints=[]; doMove(mv); return; }
      if (col(p)===WHITE) { sel=[r,c]; hints=legal(board,WHITE,ep,castle).filter(m=>m.fr===r&&m.fc===c); render(); return; }
      sel=null; hints=[]; render(); return;
    }
    if (col(p)===WHITE) { sel=[r,c]; hints=legal(board,WHITE,ep,castle).filter(m=>m.fr===r&&m.fc===c); render(); }
  }

  function doMove(m) {
    const newEp = m.dbl?[m.tr+(turn===WHITE?-1:1),m.tc]:null;
    const {nb,nc} = applyMv(board,m,castle);
    history.push({board:cloneBoard(board),ep,castle:{...castle},lastMv});
    board=nb; castle=nc; ep=newEp; lastMv=m; turn=-turn;
    render();
    const nextMoves = legal(board,turn,ep,castle);
    if (!nextMoves.length) {
      if (inCheck(board,turn)) { setStatus((turn===WHITE?'Black':'White')+' wins! Checkmate 🏆','gameover'); }
      else setStatus("Stalemate — it's a draw!",'gameover');
      over=true; return;
    }
    if (inCheck(board,turn)) setStatus(turn===WHITE?'⚠️ White is in check!':'⚠️ Black is in check!','check');
    else setStatus(turn===WHITE?'Your turn (White)':'AI is thinking...', turn===BLACK?'thinking':'');
    if (turn===BLACK&&!over) {
      setTimeout(()=>{ const ai=bestAiMove(); if(ai) doMove(ai); },60);
    }
  }

  function initGame() {
    board=INIT.map(r=>[...r]); turn=WHITE; ep=null;
    castle={wK:true,wQ:true,bK:true,bQ:true};
    history=[]; over=false; sel=null; hints=[]; lastMv=null;
    render(); setStatus('Your turn (White)');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const ng = document.getElementById('chess-new-game');
    const undo = document.getElementById('chess-undo');
    if (ng) ng.addEventListener('click', initGame);
    if (undo) undo.addEventListener('click', () => {
      if (history.length>=2) {
        const prev = history[history.length-2];
        history.length-=2;
        board=prev.board; ep=prev.ep; castle=prev.castle; lastMv=prev.lastMv;
        turn=WHITE; over=false; sel=null; hints=[];
        render(); setStatus('Your turn (White)');
      }
    });
    if (document.getElementById('chess-board')) initGame();
  });
})();
