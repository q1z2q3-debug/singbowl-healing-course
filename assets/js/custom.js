// 站点脚本：返回顶部 / 阅读进度 / 阅读书签 / 中英切换

(function () {
  'use strict';

  var BASE = (document.querySelector('meta[name="baseurl"]') || {}).content || '';
  var STORAGE_KEY = 'singbowl-reading-progress';

  // localStorage 在隐私模式或写入超限时可能抛错，统一兜底
  function readStore() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : {};
      return data && typeof data === 'object' ? data : {};
    } catch (e) {
      return {};
    }
  }

  function writeStore(data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // 忽略写入失败（隐私模式 / 存储已满）
    }
  }

  // 返回顶部
  (function () {
    var btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.innerHTML = '↑';
    btn.setAttribute('aria-label', '返回顶部');
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:48px;height:48px;border-radius:50%;background:#7253ed;color:#fff;font-size:24px;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);opacity:0;pointer-events:none;transition:opacity 0.3s;z-index:1000;';
    document.body.appendChild(btn);

    var visible = false;
    function setVisible(next) {
      if (next === visible) return;
      visible = next;
      btn.style.opacity = next ? '1' : '0';
      btn.style.pointerEvents = next ? 'auto' : 'none';
      btn.setAttribute('aria-hidden', next ? 'false' : 'true');
    }

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    function onScroll() {
      setVisible(window.scrollY > 300);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  // 阅读进度条
  (function () {
    var bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.cssText = 'position:fixed;top:0;left:0;width:0%;height:3px;background:linear-gradient(90deg,#7253ed,#5c41b8);z-index:1001;transition:width 0.1s;';
    document.body.appendChild(bar);

    function updateProgress() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    updateProgress();
  })();

  // 阅读书签：记录并恢复上次阅读位置
  (function () {
    var scrollTimeout;

    function saveProgress() {
      var path = window.location.pathname;
      var scrollY = window.scrollY;
      if (scrollY <= 100) return;
      var data = readStore();
      data[path] = {
        scrollY: scrollY,
        timestamp: Date.now(),
        title: document.title
      };
      writeStore(data);
    }

    window.addEventListener('scroll', function () {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(saveProgress, 2000);
    }, { passive: true });

    window.addEventListener('load', function () {
      var path = window.location.pathname;
      var entry = readStore()[path];
      if (!entry || typeof entry.scrollY !== 'number' || entry.scrollY <= 100) return;

      var banner = document.createElement('div');
      banner.id = 'progress-restore';
      banner.setAttribute('role', 'button');
      banner.setAttribute('tabindex', '0');
      banner.style.cssText = 'position:fixed;top:60px;right:24px;background:#7253ed;color:#fff;padding:10px 16px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.2);cursor:pointer;z-index:999;font-size:14px;';
      banner.textContent = '↻ 恢复上次阅读位置';

      function restore() {
        window.scrollTo({ top: entry.scrollY, behavior: 'smooth' });
        banner.remove();
      }

      banner.addEventListener('click', restore);
      banner.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          restore();
        }
      });

      document.body.appendChild(banner);
      setTimeout(function () {
        if (banner.parentNode) banner.remove();
      }, 8000);
    });

    // 导出进度数据（供用户备份）
    window.exportProgress = function () {
      var data = readStore();
      if (!Object.keys(data).length) {
        window.alert('暂无阅读进度');
        return;
      }
      var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'singbowl-progress.json';
      a.click();
      URL.revokeObjectURL(url);
    };
  })();

  // 中/英语言切换
  (function () {
    var path = window.location.pathname;
    var isEn = path.indexOf('/docs/en/') !== -1;

    var btn = document.createElement('a');
    btn.id = 'lang-switch';
    btn.href = isEn ? BASE + '/' : BASE + '/docs/en/';
    btn.textContent = isEn ? '中文版' : 'English';
    btn.setAttribute('aria-label', isEn ? '切换到中文版' : 'Switch to English');
    btn.style.cssText = 'position:fixed;top:14px;right:24px;padding:6px 14px;border-radius:999px;background:rgba(114,83,237,0.92);color:#fff;font-size:13px;text-decoration:none;z-index:1002;box-shadow:0 2px 8px rgba(0,0,0,0.25);letter-spacing:0.5px;';
    document.body.appendChild(btn);
  })();
})();
