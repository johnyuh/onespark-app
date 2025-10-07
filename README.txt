OneSpark 星火 PWA（可加到主畫面的 Web App）
===========================================

內容
----
- index.html ：主頁（含「啟動星火下載器」按鈕）
- manifest.json ：PWA 設定（名稱、圖示、主題色）
- service-worker.js ：快取與離線支援
- icons/icon-192.png / icon-512.png ：App 圖示

部署（GitHub Pages 範例）
------------------------
1. 建一個公開 Repo，例如 onespark-app。
2. 上傳本資料夾所有檔案（保持相對路徑）。
3. 到 Repo → Settings → Pages → Source 選 main / root → Save。
4. 約 1 分鐘後即可用瀏覽器開啟： https://你的帳號.github.io/onespark-app/

iPhone 安裝到主畫面
-------------------
1. 用 Safari 開啟網站。
2. 按「分享」→「加到主畫面」。
3. 桌面會出現「☕ OneSpark 星火」圖示。

連動捷徑
--------
按鈕會呼叫 iOS 捷徑：OneSpark 星火 下載器 ☕️ v1.1
需先在捷徑 App 建立同名捷徑（或調整 index.html 內的名稱）。

修改捷徑名稱
-------------
- 打開 index.html，搜尋 'OneSpark 星火 下載器 ☕️ v1.1'
- 將其替換為你的捷徑實際名稱（同捷徑 App 的顯示名）。

顏色與樣式
-----------
- 主題色為 #ff8800，可在 index.html 與 manifest.json 調整。
