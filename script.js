// ── TRANSITION DE PAGE ──
window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.page-overlay').classList.add('hide');
});

document.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    link.addEventListener('click', e => {
        e.preventDefault();
        const overlay = document.querySelector('.page-overlay');
        overlay.classList.remove('hide');
        overlay.classList.add('show');
        setTimeout(() => { window.location.href = href; }, 600);
    });
});

// ── LUEUR QUI SUIT LE CURSEUR ──
const cursor = document.createElement('div');
cursor.className = 'cursor-glow';
document.body.appendChild(cursor);

let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let cx = mx, cy = my;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});

(function animate() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    cursor.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
    requestAnimationFrame(animate);
})();

// ── CURSEUR PERSONNALISÉ ──
const dot = document.createElement("div");
dot.className = "custom-cursor-dot";
const ring = document.createElement("div");
ring.className = "custom-cursor-ring";
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx2 = 0, my2 = 0, rx = 0, ry = 0;

document.addEventListener("mousemove", e => {
    mx2 = e.clientX;
    my2 = e.clientY;
    dot.style.left = mx2 + "px";
    dot.style.top = my2 + "px";
});

(function animateRing() {
    rx += (mx2 - rx) * 0.12;
    ry += (my2 - ry) * 0.12;
    ring.style.left = rx + "px";
    ring.style.top = ry + "px";
    requestAnimationFrame(animateRing);
})();

document.querySelectorAll("a, button, .filter-btn").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});

document.querySelectorAll(".poster-card").forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-zoom"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-zoom"));
});

// ── BULLES DE FOND ──
const bubblesContainer = document.createElement("div");
bubblesContainer.className = "bubbles-container";
document.body.appendChild(bubblesContainer);

const NUM_BUBBLES = 20;
const bubbles = [];

function rand(min, max) {
    return Math.random() * (max - min) + min;
}

for (let i = 0; i < NUM_BUBBLES; i++) {
    const b = document.createElement("div");
    b.className = "bubble";
    const size = rand(35, 120);
    b.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
    `;
    const inner = document.createElement("div");
    inner.className = "bubble-inner";
    b.appendChild(inner);
    bubblesContainer.appendChild(b);

    // Etat de la bulle
    bubbles.push({
        el: b,
        inner: inner,
        x: rand(0, window.innerWidth),
        y: rand(0, window.innerHeight),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        size: size,
        repX: 0,
        repY: 0,
    });
}

// Animation libre
let mouseX = -999, mouseY = -999;

document.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

(function animateBubbles() {
    bubbles.forEach(b => {
        // Dérive aléatoire légère
        b.vx += rand(-0.02, 0.02);
        b.vy += rand(-0.02, 0.02);

        // Limite de vitesse
        const maxSpeed = 0.6;
        b.vx = Math.max(-maxSpeed, Math.min(maxSpeed, b.vx));
        b.vy = Math.max(-maxSpeed, Math.min(maxSpeed, b.vy));

        b.x += b.vx;
        b.y += b.vy;

        // Rebond sur les bords
        if (b.x < -b.size) b.x = window.innerWidth + b.size;
        if (b.x > window.innerWidth + b.size) b.x = -b.size;
        if (b.y < -b.size) b.y = window.innerHeight + b.size;
        if (b.y > window.innerHeight + b.size) b.y = -b.size;

        // Répulsion curseur
        const dx = mouseX - b.x;
        const dy = mouseY - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulseRadius = 180;

        let targetRepX = 0, targetRepY = 0;
        if (dist < repulseRadius && dist > 0) {
            const force = (repulseRadius - dist) / repulseRadius;
            const angle = Math.atan2(dy, dx);
            targetRepX = -Math.cos(angle) * force * 100;
            targetRepY = -Math.sin(angle) * force * 100;
        }

        b.repX += (targetRepX - b.repX) * 0.1;
        b.repY += (targetRepY - b.repY) * 0.1;

        b.el.style.left = b.x + "px";
        b.el.style.top = b.y + "px";
        b.inner.style.transform = `translate(${b.repX}px, ${b.repY}px)`;
    });

    requestAnimationFrame(animateBubbles);
})();