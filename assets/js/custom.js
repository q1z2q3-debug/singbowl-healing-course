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

// 学习进度本地存储书签
(function() {
  const STORAGE_KEY = 'singbowl-reading-progress';
  
  // 保存当前阅读位置（每 30 秒或滚动停止后）
  let scrollTimeout;
  function saveProgress() {
    const path = window.location.pathname;
    const scrollY = window.scrollY;
    if (scrollY > 100) {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      data[path] = {
        scrollY: scrollY,
        timestamp: Date.now(),
        title: document.title
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }
  
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(saveProgress, 2000);
  });
  
  // 页面加载时恢复位置
  window.addEventListener('load', function() {
    const path = window.location.pathname;
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data[path] && data[path].scrollY > 100) {
      // 显示恢复提示
      const banner = document.createElement('div');
      banner.id = 'progress-restore';
      banner.style.cssText = 'position:fixed;top:60px;right:24px;background:#7253ed;color:#fff;padding:10px 16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;z-index:999;font-size:14px;';
      banner.innerHTML = '↻ 恢复上次阅读位置';
      banner.onclick = function() {
        window.scrollTo({ top: data[path].scrollY, behavior: 'smooth' });
        banner.remove();
      };
      document.body.appendChild(banner);
      // 5 秒后自动隐藏
      setTimeout(function() {
        if (banner.parentNode) banner.remove();
      }, 8000);
    }
  });
  
  // 导出进度数据（供用户备份）
  window.exportProgress = function() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return alert('暂无阅读进度');
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'singbowl-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  };
})();

// 中/英语言切换按钮
(function() {
  const BASE = '/singbowl-healing-course';
  const path = window.location.pathname;
  const isEn = path.indexOf('/docs/en/') !== -1;

  const btn = document.createElement('a');
  btn.id = 'lang-switch';
  btn.href = isEn ? BASE + '/' : BASE + '/docs/en/chapter-01.html';
  btn.textContent = isEn ? '中文版' : 'English';
  btn.setAttribute('aria-label', isEn ? '切换到中文版' : 'Switch to English');
  btn.style.cssText = 'position:fixed;top:14px;right:24px;padding:6px 14px;border-radius:999px;background:rgba(114,83,237,0.92);color:#fff;font-size:13px;text-decoration:none;z-index:1002;box-shadow:0 2px 8px rgba(0,0,0,0.25);letter-spacing:0.5px;';
  btn.onmouseover = function() { btn.style.opacity = '0.85'; };
  btn.onmouseout = function() { btn.style.opacity = '1'; };
  document.body.appendChild(btn);
})();
