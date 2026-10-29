// 返回顶部按钮
(function() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', '返回顶部');
  btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:48px;height:48px;border-radius:50%;background:#7253ed;color:#fff;font-size:24px;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);opacity:0;transition:opacity 0.3s;z-index:1000;';
  document.body.appendChild(btn);

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', function() {
    btn.style.opacity = window.scrollY > 300 ? '1' : '0';
  });
})();

// 阅读进度条
(function() {
  const bar = document.createElement('div');
  bar.id = 'reading-progress';
  bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#7253ed,#5c41b8);z-index:1001;transition:width 0.1s;';
  document.body.appendChild(bar);

  function updateProgress() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }

  window.addEventListener('scroll', updateProgress);
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();

// 移动端字体微调（仅在小屏幕生效）
(function() {
  if (window.innerWidth < 768) {
    document.documentElement.style.fontSize = '16px';
  }
})();
