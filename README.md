# 🍸 奇幻調酒館 (Fantasy Bartender)

一款結合「奇幻模擬經營」、「開放探索採集」與「自由風味調配」的跨平台 Web 遊戲原型。
跳脫現實調酒刻板限制，用想像力調配極光色彩、探索迷霧森林，並建立屬於你的傳奇酒吧！

![Game Preview](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-blueviolet)
![Tech Stack](https://img.shields.io/badge/Tech-HTML5%20Canvas%20%7C%20Web%20Audio-emerald)
![License](https://img.shields.io/badge/License-MIT-amber)

---

## ✨ 核心遊戲特色

1. **三向無縫空間探索**：
   - 🛒 **左側星光市集**：購買基礎糖漿（月光糖漿、晨露純水、深淵烈酒），聲望提升解鎖更多原料。
   - 🏠 **中央奇幻吧台**：顧客席位、動態點單對話氣泡、互動調酒操作台與聲望經營。
   - 🌲 **右側神祕森林**：冒險尋寶、採集稀有幽魂菇與妖精之淚；內建**防迷路系統**（起霧警示、心跳加速，超距將強制遣返酒吧並遺失採集原料）。

2. **鍊金調酒工作台（即時 Canvas 渲染）**：
   - **長按注酒**：支援手機觸控與滑鼠操作，即時呈現多色液體分層與氣泡流光。
   - **綜合評分算法**：依據「視覺與層次表現」、「顧客風味契合度」、「倒酒精準度」進行三維評鑑。
   - **隱藏酒譜命名**：符合特定標籤自動解鎖如「極光之夜」、「熔岩心跳」、「月影甘泉」等特調。

3. **三元經濟循環**：
   - 🪙 **金幣 (Gold)**：售酒與小費收入，用於市集採購與原料補給。
   - ⭐ **聲望值 (Reputation)**：解鎖高階調酒原料與特殊階級顧客。
   - 🔮 **積分 (Points)**：調酒里程碑、森林尋寶成就。

4. **純程式 Web Audio API 音效引擎**：
   - 倒酒水流咕嘟聲、冰塊晶瑩碰撞聲、收錢叮咚金幣聲、森林迷霧心跳警戒音，零依賴外置音檔，任何設備開箱即玩！

---

## 🚀 跨裝置遊玩：如何部署到 GitHub & 啟用 GitHub Pages

本專案為**純前端靜態應用（Vanilla Web Application）**，任何裝置（iPhone、iPad、Android、Mac、Windows）只需打開瀏覽器即可遊玩。

### 第一步：在 GitHub 建立遠端儲存庫
1. 登入你的 [GitHub](https://github.com/) 帳號。
2. 點擊右上角的 **+** ➜ **New repository**。
3. 填寫倉庫名稱，例如 `fantasy-bartender`，勾選 **Public**，然後點擊 **Create repository**。

### 第二步：推送本地專案至 GitHub
在本地終端機（Terminal）進入此專案目錄，執行以下指令：

```bash
# 1. 初始化本地 Git 倉庫並加入所有檔案
git init
git add .
git commit -m "feat: 奇幻調酒館 (Fantasy Bartender) 第一階段原型發布"

# 2. 將主要分支命名為 main
git branch -M main

# 3. 綁定你的 GitHub 倉庫網址（請將 YOUR_USERNAME 替換為你的 GitHub 帳號名）
git remote add origin https://github.com/YOUR_USERNAME/fantasy-bartender.git

# 4. 推送至 GitHub
git push -u origin main
```

### 第三步：一鍵開啟 GitHub Pages（手機與別台電腦即可連線遊玩）
1. 進入你的 GitHub 專案頁面，點擊上方的 **Settings**（設定）。
2. 在左側選單點擊 **Pages**。
3. 在 **Build and deployment** 下方的 **Source** 選擇 `Deploy from a branch`。
4. Branch 選擇 `main`，資料夾選擇 `/ (root)`，點擊 **Save**。
5. 等待約 1 分鐘，GitHub 會生成你的專屬公開遊玩網址：
   `https://YOUR_USERNAME.github.io/fantasy-bartender/`
6. 將這個網址發送到你的手機、平板或其他電腦，隨點隨玩！

---

## 💻 本地直接開啟遊玩

無需安裝 Node.js 或複雜伺服器環境：
- 直接在檔案總管或 Finder 雙擊 `index.html` 即可在瀏覽器中暢玩。
- 或使用 Python 快速架設本地測試伺服器：
  ```bash
  python3 -m http.server 8080
  ```
  瀏覽器訪問 `http://localhost:8080` 即可。
