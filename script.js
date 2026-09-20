(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;

  const dotsWrap = document.getElementById('dots');
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(d);
  });
  const dots = Array.from(dotsWrap.children);
  const countEl = document.getElementById('count');

  function render(){
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    countEl.textContent = (current + 1) + ' / ' + total;
  }

  function goTo(i){
    current = (i + total) % total;
    slides[current].scrollIntoView({ behavior: 'smooth', block: 'start' });
    render();
  }

  const observer = new IntersectionObserver((entries) => {
    let bestVisible = null;
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        if(!bestVisible || entry.intersectionRatio > bestVisible.intersectionRatio) {
          bestVisible = entry;
        }
      }
    });
    if (!bestVisible) return;
    
    slides.forEach(slide => slide.classList.remove('is-visible'));
    bestVisible.target.classList.add('is-visible');
    
    current = slides.indexOf(bestVisible.target);
    render();
  }, { threshold: [0.3, 0.5, 0.75, 1] });
  slides.forEach((slide) => observer.observe(slide));


  document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
  document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') goTo(current - 1);
  });

  // swipe support
  let touchStartY = null;
  const stage = document.getElementById('stage');
  stage.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; }, {passive:true});
  stage.addEventListener('touchend', (e) => {
    if (touchStartY === null) return;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dy) > 50) goTo(current + (dy < 0 ? 1 : -1));
    touchStartY = null;
  }, {passive:true});

  render();
})();
