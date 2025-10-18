// service-worker.js — OneSpark 星火 安全版快取
const CACHE_NAME = "OneSparkCache-v1";

// 建議快取的主要資源
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./email.js",
  "./icon-192.png",
  "./icon-512.png"
];

// 安裝階段：快取核心檔案（忽略失敗資源）
self.addEventListener("install", event => {
  console.log("🪄 [ServiceWorker] Installing...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of FILES_TO_CACHE) {
        try {
          await cache.add(url);
          console.log("✅ 已快取:", url);
        } catch (e) {
          console.warn("⚠️ 跳過無法快取的資源:", url, e);
        }
      }
      self.skipWaiting(); // 立即啟用新版本
    })()
  );
});

// 啟用階段：清除舊快取
self.addEventListener("activate", event => {
  console.log("⚙️ [ServiceWorker] Activating...");
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🧹 移除舊快取:", key);
            return caches.delete(key);
          }
        })
      );
      self.clients.claim();
    })()
  );
});

// 讀取階段：優先使用快取，失敗時回網路
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return; // 只處理 GET
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(event.request);
      if (cached) {
        // 背景更新版本
        event.waitUntil(
          fetch(event.request)
            .then(response => {
              if (response && response.status === 200) {
                cache.put(event.request, response.clone());
              }
            })
            .catch(() => {})
        );
        return cached;
      }
      try {
        const response = await fetch(event.request);
        if (response && response.status === 200) {
          cache.put(event.request, response.clone());
        }
        return response;
      } catch (err) {
        console.warn("🚫 無法從網路取得：", event.request.url);
        return cached || Response.error();
      }
    })()
  );
});

console.log("✨ OneSpark 安全版 Service Worker 已啟動。");

