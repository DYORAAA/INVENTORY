// ui-anim.js
// Small UX polish: parallax of container and decorative dots.
// Safe, lightweight, no external deps.

(function(){
  // Add decorative dots
  function makeDots(n=6){
    for(let i=0;i<n;i++){
      const d = document.createElement('div');
      d.className = 'decor-dot';
      d.style.left = Math.random()*100 + 'vw';
      d.style.top  = Math.random()*100 + 'vh';
      d.style.width = 6 + Math.random()*30 + 'px';
      d.style.height = d.style.width;
      d.style.opacity = (0.04 + Math.random()*0.14).toString();
      d.style.transform = `translate3d(0,0,0) scale(${0.6 + Math.random()*1.2})`;
      document.body.appendChild(d);
    }
  }

  // Parallax container tilt effect
  function initParallax(){
    const container = document.querySelector('.container');
    if(!container) return;
    document.addEventListener('mousemove', (e) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const nx = (e.clientX - w/2) / (w/2);
      const ny = (e.clientY - h/2) / (h/2);
      const tx = nx * 6; // rotate range
      const ty = ny * -6;
      container.style.transform = `translateZ(0) translate3d(${tx}px, ${ty}px, 0)`;
    });

    document.addEventListener('mouseleave', () => {
      container.style.transform = '';
    });
  }

  // gentle breathe for container
  function breathe(){
    const c = document.querySelector('.container');
    if (!c) return;
    c.animate([
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(-6px) scale(1.002)' },
      { transform: 'translateY(0) scale(1)' }
    ], { duration: 8000, iterations: Infinity, easing: 'ease-in-out' });
  }

  // init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { makeDots(8); initParallax(); breathe(); });
  } else {
    makeDots(8); initParallax(); breathe();
  }
})();
