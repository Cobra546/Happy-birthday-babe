(() => {
  const start = () => {
    const wrap = document.querySelector('.lock-count-wrap');
    const hoursEl = document.querySelector('[data-lock-unit="hours"]');
    if (!wrap || !hoursEl || document.querySelector('#hourlyHeartBurst')) return;

    const style = document.createElement('style');
    style.textContent = `
      #hourlyHeartBurst{
        position:absolute;left:0;right:0;bottom:8px;height:0;pointer-events:none;
        z-index:8;overflow:visible;
      }
      .lock-heart-burst{
        position:absolute;bottom:0;left:var(--left);font-size:var(--size);
        line-height:1;color:#f28fa4;text-shadow:0 0 12px rgba(242,143,164,.45);
        opacity:0;animation:hourHeartRise var(--duration) cubic-bezier(.2,.72,.25,1) var(--delay) forwards;
      }
      @keyframes hourHeartRise{
        0%{opacity:0;transform:translate3d(0,8px,0) scale(.45) rotate(0)}
        12%{opacity:1}
        70%{opacity:.8}
        100%{opacity:0;transform:translate3d(var(--drift),-185px,0) scale(1.15) rotate(var(--rot))}
      }
      @media (prefers-reduced-motion:reduce){
        .lock-heart-burst{animation:none;opacity:.7;transform:translateY(-70px)}
      }
    `;
    document.head.appendChild(style);

    const layer = document.createElement('div');
    layer.id = 'hourlyHeartBurst';
    layer.setAttribute('aria-hidden','true');
    wrap.style.position = 'relative';
    wrap.appendChild(layer);

    let lastHour = hoursEl.textContent.trim();

    const burst = () => {
      for(let i=0;i<48;i++){
        const heart = document.createElement('span');
        heart.className = 'lock-heart-burst';
        heart.textContent = ['♥','♡','💗','💖','❤'][Math.floor(Math.random()*5)];
        heart.style.setProperty('--left', (2 + Math.random()*96) + '%');
        heart.style.setProperty('--drift', ((Math.random()*150)-75) + 'px');
        heart.style.setProperty('--rot', ((Math.random()*80)-40) + 'deg');
        heart.style.setProperty('--size', (12 + Math.random()*17) + 'px');
        heart.style.setProperty('--delay', (Math.random()*.55) + 's');
        heart.style.setProperty('--duration', (2.4 + Math.random()*1.5) + 's');
        layer.appendChild(heart);
        setTimeout(() => heart.remove(), 4500);
      }
    };

    setInterval(() => {
      const current = hoursEl.textContent.trim();
      if(current && current !== lastHour){
        lastHour = current;
        burst();
      }
    }, 500);
  };

  if (document.querySelector('[data-lock-unit="hours"]')) start();
  else {
    const observer = new MutationObserver(() => {
      if(document.querySelector('[data-lock-unit="hours"]')){
        observer.disconnect();
        start();
      }
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }
})();