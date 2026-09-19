/**
 * 奇幻調酒館 (Fantasy Bartender) - 沉浸工坊與生動大地圖引擎
 * 核心升級：
 * 1. 中央專屬酒館小屋：可自由進出室內/室外！室內有壁爐、吧台與客人，調酒完直接賣給客人。
 * 2. 左側逛街街區：生動交錯的 5 間特色獨立商鋪（糖漿、烈酒、草藥、奇果、冰霜），各具建築外觀。
 * 3. 右側生動古林：具象大樹（枝幹紋理、蓬鬆葉團、樹幹碰撞、樹蔭半透明遮蔽），樹後藏寶箱開秘籍。
 * 4. 純淨探索：無小地圖干擾、無多餘快捷鍵阻擋，支援 WASD/點擊/極簡搖桿。
 */

// ==================== 1. 原料與資料定義 ====================

const INGREDIENTS = {
  moon_syrup: { id: 'moon_syrup', name: '月光糖漿', icon: '🍯', price: 15, repReq: 0, color: '#f6e58d', flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 }, desc: '月華糖露工坊熬製，入口溫潤甘美。', shopId: 'shop_syrup' },
  dawn_water: { id: 'dawn_water', name: '晨露純水', icon: '💧', price: 10, repReq: 0, color: '#7ed6df', flavors: { sweet: 1, sour: 2, spirit: 0, magic: 0, spicy: 0 }, desc: '精靈草藥坊採集，微酸清新自然。', shopId: 'shop_herbs' },
  abyss_rum: { id: 'abyss_rum', name: '深淵烈酒', icon: '🍷', price: 25, repReq: 0, color: '#e056fd', flavors: { sweet: 0, sour: 0, spirit: 3, magic: 1, spicy: 1 }, desc: '烈酒蒸餾所特釀，熔岩般狂野辛烈。', shopId: 'shop_rum' },
  star_fruit: { id: 'star_fruit', name: '星輝果萃', icon: '✨', price: 20, repReq: 10, color: '#ffbe76', flavors: { sweet: 2, sour: 2, spirit: 0, magic: 2, spicy: 0 }, desc: '奇果行鮮採星辰果，注入璀璨流光。', shopId: 'shop_fruit' },
  frost_mint: { id: 'frost_mint', name: '極地薄荷霜', icon: '🌿', price: 30, repReq: 25, color: '#686de0', flavors: { sweet: 0, sour: 3, spirit: 1, magic: 1, spicy: 0 }, desc: '冰霜閣凝鍊之霜，沁涼透骨醒神。', shopId: 'shop_frost' },
  dragon_chili: { id: 'dragon_chili', name: '巨龍朝天椒', icon: '🌶️', price: 45, repReq: 40, color: '#ff4757', flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 }, desc: '幼龍吐息炙烤，辛香在喉中引爆。', shopId: 'shop_rum' },
  // 森林寶箱/採集原料
  glowing_shroom: { id: 'glowing_shroom', name: '夜光幽魂菇', icon: '🍄', price: 0, forestOnly: true, repReq: 0, color: '#2ed573', flavors: { sweet: 0, sour: 1, spirit: 1, magic: 4, spicy: 0 }, desc: '古林深處幽暗菌菇，散發翠綠幻光。' },
  fairy_tear: { id: 'fairy_tear', name: '妖精之淚', icon: '💎', price: 0, forestOnly: true, repReq: 0, color: '#38ada9', flavors: { sweet: 3, sour: 1, spirit: 0, magic: 4, spicy: 0 }, desc: '林間精靈落下的靈液，極度珍稀純淨。' },
  phoenix_ember: { id: 'phoenix_ember', name: '不死鳥餘燼', icon: '🪶', price: 0, forestOnly: true, repReq: 0, color: '#ff6348', flavors: { sweet: 1, sour: 0, spirit: 3, magic: 3, spicy: 3 }, desc: '遠古神獸殘留之羽，蘊含不熄之溫。' }
};

const CUSTOMERS = [
  { id: 'elven_scholar', name: '精靈學者 艾爾文', avatar: '🧝‍♀️', badge: '精靈學者', quote: '「旅途勞頓，我想要一杯帶有甘甜微光的治癒之酒，若有些許魔幻層次更好...」', preferred: { sweet: 3, magic: 2 }, tipBonus: 1.2 },
  { id: 'dwarf_warrior', name: '矮人戰士 布隆', avatar: '🧔‍♂️', badge: '矮人鐵衛', quote: '「剛從礦坑出來滿喉灰塵！快給我來杯最烈、最夠勁、火辣辣的硬漢特飲！」', preferred: { spirit: 3, spicy: 2 }, tipBonus: 1.3 },
  { id: 'shadow_ranger', name: '暗影遊俠 薇拉', avatar: '🧕', badge: '暗夜斥候', quote: '「今晚需要保持敏銳。請調一杯酸爽刺激、透著神祕魔力的高冷之釀。」', preferred: { sour: 3, magic: 2 }, tipBonus: 1.15 },
  { id: 'mage_apprentice', name: '鍊金學徒 諾亞', avatar: '🧑‍🔬', badge: '鍊金術士', quote: '「導師讓我考察魔力液體分層！我要一杯魔幻感爆棚、層次分明的藝術品！」', preferred: { magic: 4, sweet: 1 }, tipBonus: 1.25 },
  { id: 'bard_lucas', name: '吟遊詩人 盧卡斯', avatar: '🪕', badge: '流浪歌者', quote: '「靈感如泉湧！想要一杯甜如情話、微醺似初戀的美酒，激發新歌謠！」', preferred: { sweet: 2, spirit: 2 }, tipBonus: 1.1 }
];

const RECIPES_CATALOG = [
  { name: '極光之夜', requirement: '魔幻值 ≥ 5 且至少 2 層分層', tags: '魔幻 / 漸層', icon: '🌌' },
  { name: '熔岩心跳', requirement: '烈度 ≥ 4 且 辛辣 ≥ 3', tags: '烈焰 / 辛香', icon: '🌋' },
  { name: '月影甘泉', requirement: '甘甜 ≥ 5 且 酸爽 ≥ 2', tags: '甘美 / 清爽', icon: '🌙' },
  { name: '幽谷幻精靈', requirement: '含有夜光幽魂菇 或 妖精之淚', tags: '秘傳 / 靈力', icon: '🧚‍♀️' },
  { name: '星空詠嘆調', requirement: '含有星輝果萃，總容量達 90ml 以上', tags: '流光 / 奢華', icon: '✨' },
  { name: '翡翠妖精之露', requirement: '在森林大樹後寶箱獲得秘籍', tags: '古林秘籍 / 珍品', icon: '📜' },
  { name: '冒險家特飲', requirement: '任一混調出品之基礎特飲', tags: '常規 / 家常', icon: '🍹' }
];

const CHEST_REWARD_POOL = [
  { type: 'recipe', name: '翡翠妖精之露', desc: '在密林巨樹後挖掘出的古老卷軸，記載著融合森林靈力的秘方，已永久收錄進你的秘籍圖鑑！', pts: 30, gold: 40 },
  { type: 'recipe', name: '幽谷幻精靈', desc: '古樸木盒中封存著調酒秘典，解鎖了全新靈性配方！', pts: 25, gold: 35 },
  { type: 'item', itemId: 'fairy_tear', count: 2, desc: '打開寶箱，裡面靜靜躺著閃爍晨露光澤的妖精之淚！', pts: 15, gold: 30 },
  { type: 'item', itemId: 'phoenix_ember', count: 2, desc: '箱中封存著熾熱的不死鳥餘燼，微光跳躍！', pts: 20, gold: 45 },
  { type: 'item', itemId: 'glowing_shroom', count: 3, desc: '箱內盛放著整簇新鮮的夜光幽魂菇，香氣奇異！', pts: 15, gold: 25 }
];

// ==================== 2. 地圖尺寸與世界定義 ====================

const WORLD_WIDTH = 3600;
const WORLD_HEIGHT = 1000;

const ZONE_MARKET_MAX_X = 1200;
const ZONE_TAVERN_MAX_X = 2200;
const FOREST_START_X = 2200;
const FOREST_WARN_X = 2700;
const FOREST_DANGER_X = 3100;
const FOREST_LOST_X = 3500;

// 室內地圖尺寸 (酒館內部)
const INDOOR_WIDTH = 1100;
const INDOOR_HEIGHT = 700;

// 左側逛街街區：5 間獨立特色店鋪（交錯分佈，不再排成直排）
const STREET_SHOPS = [
  { id: 'shop_syrup', name: '月華糖露工坊', icon: '🍯', type: 'syrup', x: 300, y: 280, w: 140, h: 100, doorX: 370, doorY: 380, intro: '專精調配月光濃縮糖漿與花蜜。' },
  { id: 'shop_rum', name: '深淵烈酒蒸餾廠', icon: '🍷', type: 'rum', x: 620, y: 640, w: 150, h: 110, doorX: 695, doorY: 640, intro: '紅磚大煙囪蒸餾廠，飄散濃郁烈酒麥香。' },
  { id: 'shop_herbs', name: '精靈草藥香料坊', icon: '🌿', type: 'herbs', x: 920, y: 260, w: 140, h: 95, doorX: 990, doorY: 355, intro: '爬滿常春藤的木屋，販售純淨晨露與香料。' },
  { id: 'shop_fruit', name: '星輝奇果行', icon: '✨', type: 'fruit', x: 440, y: 650, w: 130, h: 90, doorX: 505, doorY: 650, intro: '夜空色琉璃帳篷，陳列閃爍星光的奇異果品。' },
  { id: 'shop_frost', name: '極地冰霜閣', icon: '🧊', type: 'frost', x: 800, y: 640, w: 135, h: 95, doorX: 865, doorY: 640, intro: '屋簷結著晶瑩冰柱，提供沁涼薄荷與寒冰精粹。' }
];

// 中央：調酒師專屬酒館小屋建築
const TAVERN_HOUSE = {
  x: 1560,
  y: 330,
  w: 280,
  h: 180,
  doorX: 1700,
  doorY: 510,
  doorW: 50,
  doorH: 30
};

// 右側森林：生動大樹陣列（帶有樹皮、樹枝、樹冠層次與實體碰撞）
const FOREST_TREES = [
  { x: 2320, y: 300, trunkR: 24, crownR: 65, currentAlpha: 1, type: 'oak' },
  { x: 2380, y: 700, trunkR: 26, crownR: 70, currentAlpha: 1, type: 'pine' },
  { x: 2520, y: 430, trunkR: 28, crownR: 75, currentAlpha: 1, type: 'oak' },
  { x: 2590, y: 220, trunkR: 22, crownR: 62, currentAlpha: 1, type: 'pine' },
  { x: 2660, y: 680, trunkR: 26, crownR: 72, currentAlpha: 1, type: 'oak' },
  { x: 2740, y: 380, trunkR: 30, crownR: 80, currentAlpha: 1, type: 'ancient' }, // 樹後藏寶箱
  { x: 2890, y: 240, trunkR: 25, crownR: 68, currentAlpha: 1, type: 'pine' },
  { x: 2940, y: 620, trunkR: 30, crownR: 82, currentAlpha: 1, type: 'ancient' }, // 樹後藏寶箱
  { x: 3060, y: 420, trunkR: 32, crownR: 85, currentAlpha: 1, type: 'oak' },
  { x: 3140, y: 210, trunkR: 24, crownR: 66, currentAlpha: 1, type: 'pine' },
  { x: 3200, y: 740, trunkR: 28, crownR: 76, currentAlpha: 1, type: 'ancient' },
  { x: 3300, y: 360, trunkR: 34, crownR: 90, currentAlpha: 1, type: 'ancient' }, // 樹後藏寶箱
  { x: 3380, y: 610, trunkR: 30, crownR: 84, currentAlpha: 1, type: 'oak' },
  { x: 3460, y: 280, trunkR: 36, crownR: 92, currentAlpha: 1, type: 'ancient' }  // 迷霧深處秘寶
];

// 森林藏寶箱（藏在特定大樹後方）
const FOREST_CHESTS = [
  { id: 'chest_1', name: '老古樹後的木箱', x: 2740, y: 330, opened: false, rewardIndex: 0 },
  { id: 'chest_2', name: '青苔古樹旁的靈箱', x: 2940, y: 565, opened: false, rewardIndex: 1 },
  { id: 'chest_3', name: '古林幽徑隱秘寶盒', x: 3300, y: 305, opened: false, rewardIndex: 2 },
  { id: 'chest_4', name: '迷霧深林遺世秘藏', x: 3460, y: 225, opened: false, rewardIndex: 3 }
];

// ==================== 3. 遊戲狀態管理 ====================

class GameState {
  constructor() {
    this.gold = 160;
    this.reputation = 20;
    this.points = 0;

    // 當前場景：'outdoor'（戶外大地圖） 或 'indoor'（酒館小屋內部）
    this.currentScene = 'outdoor';

    this.inventory = {
      moon_syrup: 4,
      dawn_water: 5,
      abyss_rum: 3,
      star_fruit: 2,
      frost_mint: 1,
      dragon_chili: 0,
      glowing_shroom: 1,
      fairy_tear: 0,
      phoenix_ember: 0
    };

    this.collectedInCurrentRun = {};
    this.heartbeatTimer = null;
    this.currentCustomerIndex = 0;
    this.unlockedRecipes = new Set(['冒險家特飲']);

    // 調酒台
    this.glassCapacity = 100;
    this.glassLayers = [];
    this.selectedIngredient = null;
    this.isPouring = false;
    this.pourTimer = null;

    // 主角
    this.player = {
      x: 1700, // 初始在酒館門前
      y: 560,
      radius: 17,
      speed: 3.8,
      sprintSpeed: 6.4,
      isSprinting: false,
      angle: 0,
      walkAnimTime: 0,
      targetX: null,
      targetY: null,
      // 伴侶螢火小精靈
      fairyX: 1680,
      fairyY: 540,
      fairyAngle: 0
    };

    this.camera = { x: 0, y: 0 };

    this.keys = {
      w: false, a: false, s: false, d: false,
      ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
      Shift: false, j: false, ' ': false
    };

    this.joystickVector = { x: 0, y: 0 };
    this.activeInteractable = null;
  }
}

const game = new GameState();

// ==================== 4. DOM 快取 ====================

const DOM = {
  worldCanvas: document.getElementById('world-canvas'),
  currentZoneName: document.getElementById('current-zone-name'),
  goldDisplay: document.getElementById('gold-display'),
  repDisplay: document.getElementById('rep-display'),
  pointsDisplay: document.getElementById('points-display'),
  audioToggleBtn: document.getElementById('audio-toggle-btn'),
  recipeBookBtn: document.getElementById('recipe-book-btn'),

  mistVignette: document.getElementById('mist-vignette'),
  lostAlertBanner: document.getElementById('lost-alert-banner'),
  proximityPrompt: document.getElementById('proximity-prompt'),
  promptActionText: document.getElementById('prompt-action-text'),

  joystickZone: document.getElementById('joystick-zone'),
  joystickBase: document.getElementById('joystick-base'),
  joystickStick: document.getElementById('joystick-stick'),

  // 寶箱開箱彈窗
  chestRewardModal: document.getElementById('chest-reward-modal'),
  chestRewardType: document.getElementById('chest-reward-type'),
  chestRewardTitle: document.getElementById('chest-reward-title'),
  chestRewardDesc: document.getElementById('chest-reward-desc'),
  chestRewardPill: document.getElementById('chest-reward-pill'),
  closeChestBtn: document.getElementById('close-chest-btn'),

  // 店鋪彈窗
  marketModal: document.getElementById('market-modal'),
  shopModalIcon: document.getElementById('shop-modal-icon'),
  shopModalName: document.getElementById('shop-modal-name'),
  shopModalIntro: document.getElementById('shop-modal-intro'),
  closeMarketBtn: document.getElementById('close-market-btn'),
  marketGrid: document.getElementById('market-grid'),

  // 調酒台
  bartenderModal: document.getElementById('bartender-modal'),
  closeBartenderBtn: document.getElementById('close-bartender-btn'),
  orderCustAvatar: document.getElementById('order-cust-avatar'),
  orderCustName: document.getElementById('order-cust-name'),
  orderCustBadge: document.getElementById('order-cust-badge'),
  orderCustQuote: document.getElementById('order-cust-quote'),
  orderCustDesires: document.getElementById('order-cust-desires'),

  cocktailCanvas: document.getElementById('cocktail-canvas'),
  glassVolumeText: document.getElementById('glass-volume-text'),
  ingredientGrid: document.getElementById('ingredient-grid'),
  pourBtn: document.getElementById('pour-btn'),
  resetDrinkBtn: document.getElementById('reset-drink-btn'),
  finishDrinkBtn: document.getElementById('finish-drink-btn'),

  hudSweet: document.getElementById('hud-sweet'),
  hudSour: document.getElementById('hud-sour'),
  hudSpirit: document.getElementById('hud-spirit'),
  hudMagic: document.getElementById('hud-magic'),
  hudSpicy: document.getElementById('hud-spicy'),

  resultModal: document.getElementById('result-modal'),
  resDrinkName: document.getElementById('res-drink-name'),
  resDrinkTier: document.getElementById('res-drink-tier'),
  resVisualStars: document.getElementById('res-visual-stars'),
  resFlavorStars: document.getElementById('res-flavor-stars'),
  resPrecisionStars: document.getElementById('res-precision-stars'),
  resNpcAvatar: document.getElementById('res-npc-avatar'),
  resNpcName: document.getElementById('res-npc-name'),
  resNpcComment: document.getElementById('res-npc-comment'),
  resEarnGold: document.getElementById('res-earn-gold'),
  resEarnRep: document.getElementById('res-earn-rep'),
  resEarnPts: document.getElementById('res-earn-pts'),
  confirmResultBtn: document.getElementById('confirm-result-btn'),

  recipeBookModal: document.getElementById('recipe-book-modal'),
  closeBookBtn: document.getElementById('close-book-btn'),
  recipeGrid: document.getElementById('recipe-grid')
};

const worldCtx = DOM.worldCanvas.getContext('2d');
const cocktailCtx = DOM.cocktailCanvas.getContext('2d');

function resizeCanvas() {
  DOM.worldCanvas.width = window.innerWidth;
  DOM.worldCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ==================== 5. 操作監聽 ====================

window.addEventListener('keydown', (e) => {
  if (game.keys.hasOwnProperty(e.key)) game.keys[e.key] = true;
  if (e.key === 'j' || e.key === 'J' || e.key === 'Shift') game.player.isSprinting = true;
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    triggerActiveInteraction();
  }
});

window.addEventListener('keyup', (e) => {
  if (game.keys.hasOwnProperty(e.key)) game.keys[e.key] = false;
  if (!game.keys.j && !game.keys.Shift) game.player.isSprinting = false;
});

DOM.worldCanvas.addEventListener('click', (e) => {
  if (isAnyModalOpen()) return;
  const rect = DOM.worldCanvas.getBoundingClientRect();
  game.player.targetX = (e.clientX - rect.left) + game.camera.x;
  game.player.targetY = (e.clientY - rect.top) + game.camera.y;
});

// 手機極簡搖桿
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
const maxJoyR = 36;

function joyStart(cx, cy) {
  joystickActive = true;
  const rect = DOM.joystickBase.getBoundingClientRect();
  joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  joyMove(cx, cy);
}
function joyMove(cx, cy) {
  if (!joystickActive) return;
  const dx = cx - joystickCenter.x;
  const dy = cy - joystickCenter.y;
  const d = Math.hypot(dx, dy);
  const clamp = Math.min(d, maxJoyR);
  const angle = Math.atan2(dy, dx);
  const sx = Math.cos(angle) * clamp;
  const sy = Math.sin(angle) * clamp;

  DOM.joystickStick.style.transform = `translate(${sx}px, ${sy}px)`;
  game.joystickVector.x = sx / maxJoyR;
  game.joystickVector.y = sy / maxJoyR;
  game.player.targetX = null;
  game.player.targetY = null;
}
function joyEnd() {
  joystickActive = false;
  DOM.joystickStick.style.transform = 'translate(0px, 0px)';
  game.joystickVector.x = 0;
  game.joystickVector.y = 0;
}

DOM.joystickZone.addEventListener('mousedown', (e) => joyStart(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => { if (joystickActive) joyMove(e.clientX, e.clientY); });
window.addEventListener('mouseup', joyEnd);
DOM.joystickZone.addEventListener('touchstart', (e) => { if (e.touches.length > 0) joyStart(e.touches[0].clientX, e.touches[0].clientY); });
window.addEventListener('touchmove', (e) => { if (joystickActive && e.touches.length > 0) joyMove(e.touches[0].clientX, e.touches[0].clientY); });
window.addEventListener('touchend', joyEnd);

function isAnyModalOpen() {
  return !DOM.marketModal.classList.contains('hidden') ||
         !DOM.bartenderModal.classList.contains('hidden') ||
         !DOM.resultModal.classList.contains('hidden') ||
         !DOM.recipeBookModal.classList.contains('hidden') ||
         !DOM.chestRewardModal.classList.contains('hidden');
}

// ==================== 6. 物理碰撞與進出屋檢測 ====================

function checkCollision(x, y) {
  if (game.currentScene === 'indoor') {
    // 室內邊界拘束與吧台碰撞
    if (x < 120 || x > INDOOR_WIDTH - 120 || y < 200 || y > INDOOR_HEIGHT - 60) return true;
    // 吧台桌身阻擋 (x: 400~700, y: 260~340)
    if (x > 380 && x < 720 && y > 250 && y < 350) return true;
    return false;
  }

  // 戶外場景
  // 1. 酒館外屋主體阻擋（除了門口）
  const h = TAVERN_HOUSE;
  if (x > h.x && x < h.x + h.w && y > h.y && y < h.y + h.h - 10) {
    return true;
  }

  // 2. 街區店鋪牆面阻擋
  for (const shop of STREET_SHOPS) {
    if (x > shop.x && x < shop.x + shop.w && y > shop.y && y < shop.y + shop.h - 10) {
      return true;
    }
  }

  // 3. 森林樹幹碰撞阻擋
  for (const tree of FOREST_TREES) {
    const d = Math.hypot(x - tree.x, y - tree.y);
    if (d < tree.trunkR + game.player.radius) {
      return true;
    }
  }

  return false;
}

function updatePlayer() {
  if (isAnyModalOpen()) return;

  let moveX = 0;
  let moveY = 0;

  if (game.keys.w || game.keys.ArrowUp) moveY -= 1;
  if (game.keys.s || game.keys.ArrowDown) moveY += 1;
  if (game.keys.a || game.keys.ArrowLeft) moveX -= 1;
  if (game.keys.d || game.keys.ArrowRight) moveX += 1;

  if (Math.hypot(game.joystickVector.x, game.joystickVector.y) > 0.1) {
    moveX = game.joystickVector.x;
    moveY = game.joystickVector.y;
  }

  if (game.player.targetX !== null && game.player.targetY !== null && moveX === 0 && moveY === 0) {
    const dx = game.player.targetX - game.player.x;
    const dy = game.player.targetY - game.player.y;
    const d = Math.hypot(dx, dy);
    if (d > 8) {
      moveX = dx / d;
      moveY = dy / d;
    } else {
      game.player.targetX = null;
      game.player.targetY = null;
    }
  }

  const curSpeed = game.player.isSprinting ? game.player.sprintSpeed : game.player.speed;
  const mag = Math.hypot(moveX, moveY);

  if (mag > 0.05) {
    const nx = (moveX / (mag > 1 ? mag : 1)) * curSpeed;
    const ny = (moveY / (mag > 1 ? mag : 1)) * curSpeed;

    if (!checkCollision(game.player.x + nx, game.player.y)) {
      game.player.x += nx;
    }
    if (!checkCollision(game.player.x, game.player.y + ny)) {
      game.player.y += ny;
    }

    game.player.angle = Math.atan2(ny, nx);
    game.player.walkAnimTime += 0.22;
  }

  // 螢火小精靈游動跟隨
  game.player.fairyAngle += 0.07;
  const fairyTargetX = game.player.x - Math.cos(game.player.angle) * 30 + Math.sin(game.player.fairyAngle) * 15;
  const fairyTargetY = game.player.y - Math.sin(game.player.angle) * 30 - 22 + Math.cos(game.player.fairyAngle) * 12;
  game.player.fairyX += (fairyTargetX - game.player.fairyX) * 0.16;
  game.player.fairyY += (fairyTargetY - game.player.fairyY) * 0.16;

  // 鏡頭平滑居中跟隨
  const curWorldW = game.currentScene === 'indoor' ? INDOOR_WIDTH : WORLD_WIDTH;
  const curWorldH = game.currentScene === 'indoor' ? INDOOR_HEIGHT : WORLD_HEIGHT;

  const targetCamX = game.player.x - DOM.worldCanvas.width / 2;
  const targetCamY = game.player.y - DOM.worldCanvas.height / 2;
  game.camera.x += (targetCamX - game.camera.x) * 0.12;
  game.camera.y += (targetCamY - game.camera.y) * 0.12;

  const maxCamX = Math.max(0, curWorldW - DOM.worldCanvas.width);
  const maxCamY = Math.max(0, curWorldH - DOM.worldCanvas.height);
  game.camera.x = Math.max(0, Math.min(maxCamX, game.camera.x));
  game.camera.y = Math.max(0, Math.min(maxCamY, game.camera.y));

  // 戶外樹冠遮蔽透明度運算
  if (game.currentScene === 'outdoor') {
    FOREST_TREES.forEach(tree => {
      const d = Math.hypot(game.player.x - tree.x, game.player.y - (tree.y - 25));
      const targetAlpha = d < tree.crownR + 15 ? 0.3 : 1.0;
      tree.currentAlpha += (targetAlpha - tree.currentAlpha) * 0.15;
    });
    updateForestMist();
  }

  detectNearbyInteraction();
}

function updateForestMist() {
  if (game.player.x <= FOREST_START_X) {
    DOM.mistVignette.style.opacity = '0';
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
    return;
  }

  const distInForest = game.player.x - FOREST_START_X;
  if (game.player.x < FOREST_WARN_X) {
    DOM.mistVignette.style.opacity = `${(distInForest / (FOREST_WARN_X - FOREST_START_X)) * 0.4}`;
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
  } else if (game.player.x < FOREST_DANGER_X) {
    DOM.mistVignette.classList.add('danger');
    DOM.mistVignette.classList.remove('extreme');
    startHeartbeat(1900, 0.35);
  } else if (game.player.x < FOREST_LOST_X) {
    DOM.mistVignette.classList.remove('danger');
    DOM.mistVignette.classList.add('extreme');
    startHeartbeat(1000, 0.7);
  } else {
    // 迷失遣送
    triggerLostInForest();
  }
}

function startHeartbeat(interval, vol) {
  if (game.heartbeatTimer) return;
  game.heartbeatTimer = setInterval(() => window.soundEngine.playHeartbeat(vol), interval);
}
function stopHeartbeat() {
  if (game.heartbeatTimer) {
    clearInterval(game.heartbeatTimer);
    game.heartbeatTimer = null;
  }
}

function triggerLostInForest() {
  stopHeartbeat();
  window.soundEngine.playLostSound();
  DOM.lostAlertBanner.classList.add('show');

  Object.keys(game.collectedInCurrentRun).forEach(id => {
    const lostCount = Math.ceil(game.collectedInCurrentRun[id] / 2);
    game.inventory[id] = Math.max(0, (game.inventory[id] || 0) - lostCount);
  });
  game.collectedInCurrentRun = {};

  // 遣送回酒館大門口
  game.player.x = 1700;
  game.player.y = 560;
  game.player.targetX = null;
  game.player.targetY = null;

  updateResourceDisplays();
  setTimeout(() => DOM.lostAlertBanner.classList.remove('show'), 3600);
}

// 檢測當前可互動項目（進入酒館、出門、店鋪買料、吧台調酒、森林寶箱）
function detectNearbyInteraction() {
  let closest = null;
  let minDist = 75;

  if (game.currentScene === 'indoor') {
    // 1. 室內大門（出門）
    const dDoor = Math.hypot(game.player.x - 550, game.player.y - 650);
    if (dDoor < minDist) {
      closest = { type: 'exit_tavern', x: 550, y: 620, prompt: '🚪 推門走到庭院' };
    }

    // 2. 室內吧台（調酒與接待客人）
    const dBar = Math.hypot(game.player.x - 550, game.player.y - 360);
    if (dBar < minDist + 15) {
      const cust = CUSTOMERS[game.currentCustomerIndex];
      closest = { type: 'bartender', x: 550, y: 320, prompt: `✨ 為 ${cust.name} 調酒` };
    }

    DOM.currentZoneName.textContent = '🏠 奇幻酒館・溫馨室內';
  } else {
    // 戶外場景
    // 1. 酒館大門（進門）
    const dEnter = Math.hypot(game.player.x - TAVERN_HOUSE.doorX, game.player.y - TAVERN_HOUSE.doorY);
    if (dEnter < minDist) {
      closest = { type: 'enter_tavern', x: TAVERN_HOUSE.doorX, y: TAVERN_HOUSE.doorY - 20, prompt: '🏠 推門進入酒館' };
    }

    // 2. 街區各店鋪
    STREET_SHOPS.forEach(shop => {
      const d = Math.hypot(game.player.x - shop.doorX, game.player.y - shop.doorY);
      if (d < minDist) {
        closest = { type: 'shop', shop: shop, x: shop.doorX, y: shop.doorY - 15, prompt: `🛒 進入 ${shop.name}` };
      }
    });

    // 3. 森林隱藏寶箱
    FOREST_CHESTS.forEach(chest => {
      if (chest.opened) return;
      const d = Math.hypot(game.player.x - chest.x, game.player.y - chest.y);
      if (d < minDist) {
        closest = { type: 'chest', chest: chest, x: chest.x, y: chest.y - 25, prompt: `🎁 開啟 ${chest.name}` };
      }
    });

    // 區域名稱更新
    if (game.player.x < ZONE_MARKET_MAX_X) {
      DOM.currentZoneName.textContent = '🛒 星光夜市・漫步街區';
    } else if (game.player.x < ZONE_TAVERN_MAX_X) {
      DOM.currentZoneName.textContent = '🏠 奇幻酒館・門前庭院';
    } else {
      DOM.currentZoneName.textContent = '🌲 神祕迷霧古林';
    }
  }

  game.activeInteractable = closest;

  if (closest) {
    const sx = closest.x - game.camera.x;
    const sy = closest.y - game.camera.y;
    DOM.proximityPrompt.style.left = `${sx}px`;
    DOM.proximityPrompt.style.top = `${sy}px`;
    DOM.promptActionText.textContent = closest.prompt;
    DOM.proximityPrompt.classList.remove('hidden');
  } else {
    DOM.proximityPrompt.classList.add('hidden');
  }
}

function triggerActiveInteraction() {
  if (!game.activeInteractable) return;
  const target = game.activeInteractable;

  if (target.type === 'enter_tavern') {
    // 進入酒館室內
    window.soundEngine.playIceClink();
    game.currentScene = 'indoor';
    game.player.x = 550;
    game.player.y = 600;
    game.player.targetX = null;
    game.player.targetY = null;
    DOM.mistVignette.style.opacity = '0';
    stopHeartbeat();
  } else if (target.type === 'exit_tavern') {
    // 走出酒館到庭院
    window.soundEngine.playIceClink();
    game.currentScene = 'outdoor';
    game.player.x = TAVERN_HOUSE.doorX;
    game.player.y = TAVERN_HOUSE.doorY + 30;
    game.player.targetX = null;
    game.player.targetY = null;
  } else if (target.type === 'shop') {
    openShopModal(target.shop);
  } else if (target.type === 'bartender') {
    openBartenderModal();
  } else if (target.type === 'chest') {
    openTreasureChest(target.chest);
  }
}

// 開啟街區特色店鋪
function openShopModal(shop) {
  DOM.shopModalIcon.textContent = shop.icon;
  DOM.shopModalName.textContent = shop.name;
  DOM.shopModalIntro.textContent = shop.intro;
  DOM.marketGrid.innerHTML = '';

  // 找出該店販售的原料
  const items = Object.values(INGREDIENTS).filter(i => i.shopId === shop.id);
  items.forEach(item => {
    const isLocked = game.reputation < item.repReq;
    const canAfford = game.gold >= item.price && !isLocked;
    const stock = game.inventory[item.id] || 0;

    const card = document.createElement('div');
    card.className = 'market-card';
    card.innerHTML = `
      <div class="market-card-top">
        <div class="market-card-icon">${item.icon}</div>
        <div class="market-card-info">
          <h4>${item.name}</h4>
          <span class="mtag">風味: ${Object.keys(item.flavors).filter(k => item.flavors[k]>0).join('/')}</span>
        </div>
      </div>
      <p style="font-size:0.75rem;color:var(--text-parchment);">${item.desc}</p>
      <div class="market-card-bottom">
        <div>
          <strong style="color:var(--amber-gold);font-size:0.9rem;">🪙 ${item.price}</strong>
          <span style="font-size:0.72rem;color:var(--crystal-cyan);margin-left:6px;">庫存: ${stock}</span>
        </div>
        <button class="fantasy-btn primary-glow" style="padding:4px 10px;font-size:0.78rem;" ${canAfford ? '' : 'disabled'} onclick="buyMarketItem('${item.id}', '${shop.id}')">
          ${isLocked ? `需聲望${item.repReq}` : '採購 +1'}
        </button>
      </div>
    `;
    DOM.marketGrid.appendChild(card);
  });

  DOM.marketModal.classList.remove('hidden');
}

window.buyMarketItem = function(itemId, shopId) {
  const item = INGREDIENTS[itemId];
  if (!item || game.gold < item.price || game.reputation < item.repReq) return;
  game.gold -= item.price;
  game.inventory[itemId] = (game.inventory[itemId] || 0) + 1;
  window.soundEngine.playCoinSound();
  updateResourceDisplays();
  const shop = STREET_SHOPS.find(s => s.id === shopId);
  if (shop) openShopModal(shop);
};

DOM.closeMarketBtn.addEventListener('click', () => DOM.marketModal.classList.add('hidden'));

// 開啟森林隱藏寶箱
function openTreasureChest(chest) {
  chest.opened = true;
  window.soundEngine.playFanfare();

  const reward = CHEST_REWARD_POOL[chest.rewardIndex % CHEST_REWARD_POOL.length];
  game.gold += reward.gold;
  game.points += reward.pts;

  if (reward.type === 'recipe') {
    game.unlockedRecipes.add(reward.name);
    DOM.chestRewardType.textContent = '📜 失落特調秘籍';
    DOM.chestRewardTitle.textContent = `《${reward.name}》酒譜`;
    DOM.chestRewardDesc.textContent = reward.desc;
    DOM.chestRewardPill.innerHTML = `<span>✨ 靈積分 +${reward.pts}</span><span>🪙 金幣 +${reward.gold}</span><span>📖 已收錄圖鑑</span>`;
  } else {
    const item = INGREDIENTS[reward.itemId];
    game.inventory[reward.itemId] = (game.inventory[reward.itemId] || 0) + reward.count;
    game.collectedInCurrentRun[reward.itemId] = (game.collectedInCurrentRun[reward.itemId] || 0) + reward.count;
    DOM.chestRewardType.textContent = '💎 秘境珍稀原料';
    DOM.chestRewardTitle.textContent = `${item.icon} ${item.name} x${reward.count}`;
    DOM.chestRewardDesc.textContent = reward.desc;
    DOM.chestRewardPill.innerHTML = `<span>✨ 靈積分 +${reward.pts}</span><span>🪙 金幣 +${reward.gold}</span><span>🎒 存入調酒背包</span>`;
  }

  updateResourceDisplays();
  game.activeInteractable = null;
  DOM.proximityPrompt.classList.add('hidden');
  DOM.chestRewardModal.classList.remove('hidden');
}
DOM.closeChestBtn.addEventListener('click', () => DOM.chestRewardModal.classList.add('hidden'));

// ==================== 7. 2D 畫布繪製系統 ====================

function drawWorld() {
  worldCtx.clearRect(0, 0, DOM.worldCanvas.width, DOM.worldCanvas.height);
  worldCtx.save();
  worldCtx.translate(-game.camera.x, -game.camera.y);

  if (game.currentScene === 'indoor') {
    drawTavernInterior();
  } else {
    drawOutdoorWorld();
  }

  // 繪製主角調酒師
  drawPlayer();

  // 若在戶外，在大樹圖層頂部繪製半透明樹冠以呈現遮蔽
  if (game.currentScene === 'outdoor') {
    drawTreeCrowns();
  }

  worldCtx.restore();
}

// 繪製酒館溫馨室內場景
function drawTavernInterior() {
  // 木質地板
  worldCtx.fillStyle = '#2c1e14';
  worldCtx.fillRect(100, 100, INDOOR_WIDTH - 200, INDOOR_HEIGHT - 160);

  // 地板木紋橫線
  worldCtx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  worldCtx.lineWidth = 2;
  for (let y = 140; y < INDOOR_HEIGHT - 60; y += 45) {
    worldCtx.beginPath();
    worldCtx.moveTo(100, y);
    worldCtx.lineTo(INDOOR_WIDTH - 100, y);
    worldCtx.stroke();
  }

  // 奢華大紅金邊地毯
  worldCtx.fillStyle = '#800c2a';
  worldCtx.fillRect(300, 360, 500, 240);
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.6)';
  worldCtx.lineWidth = 3;
  worldCtx.strokeRect(300, 360, 500, 240);

  // 石壁爐（有火苗）
  worldCtx.fillStyle = '#4b4b4b';
  worldCtx.fillRect(160, 240, 90, 110);
  worldCtx.fillStyle = '#e67e22';
  worldCtx.beginPath();
  worldCtx.arc(205, 310, 16 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
  worldCtx.fill();

  // 背後高聳酒櫃（擺滿發光彩色酒瓶）
  worldCtx.fillStyle = '#3a2416';
  worldCtx.fillRect(380, 160, 340, 80);
  for (let bx = 395; bx < 700; bx += 22) {
    worldCtx.fillStyle = ['#f6c23e', '#e056fd', '#00d2d3', '#ff4757', '#2ed573'][bx % 5];
    worldCtx.fillRect(bx, 190, 8, 20);
  }

  // 豪華調酒吧台桌
  worldCtx.fillStyle = '#53351e';
  worldCtx.fillRect(380, 270, 340, 70);
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.85)';
  worldCtx.lineWidth = 2.5;
  worldCtx.strokeRect(380, 270, 340, 70);

  worldCtx.font = 'bold 13px sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.textAlign = 'center';
  worldCtx.fillText('★ 傳奇調酒操作台（按空白鍵）★', 550, 312);

  // 吧台高腳椅與顧客 NPC
  const cust = CUSTOMERS[game.currentCustomerIndex];
  worldCtx.fillStyle = '#833471';
  worldCtx.beginPath();
  worldCtx.arc(550, 385, 22, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.strokeStyle = '#f6c23e';
  worldCtx.stroke();

  worldCtx.font = '30px serif';
  worldCtx.fillText(cust.avatar, 550, 385);
  worldCtx.font = 'bold 12px sans-serif';
  worldCtx.fillStyle = '#fff';
  worldCtx.fillText(`${cust.name}（等待特調中）`, 550, 420);

  // 出門石階梯與木門
  worldCtx.fillStyle = '#221508';
  worldCtx.fillRect(510, 640, 80, 20);
  worldCtx.font = 'bold 12px sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.fillText('🚪 出門到庭院', 550, 630);
}

// 繪製戶外大地圖（左街區、中酒館小屋外觀、右古林）
function drawOutdoorWorld() {
  // 1. 地面
  worldCtx.fillStyle = '#121422'; // 街區石磚
  worldCtx.fillRect(0, 0, ZONE_MARKET_MAX_X, WORLD_HEIGHT);

  worldCtx.fillStyle = '#1a1829'; // 酒館庭院
  worldCtx.fillRect(ZONE_MARKET_MAX_X, 0, ZONE_TAVERN_MAX_X - ZONE_MARKET_MAX_X, WORLD_HEIGHT);

  const fGrad = worldCtx.createLinearGradient(FOREST_START_X, 0, WORLD_WIDTH, 0);
  fGrad.addColorStop(0, '#0a1613');
  fGrad.addColorStop(1, '#020806');
  worldCtx.fillStyle = fGrad; // 古林泥草地
  worldCtx.fillRect(FOREST_START_X, 0, WORLD_WIDTH - FOREST_START_X, WORLD_HEIGHT);

  // 蜿蜒泥徑
  worldCtx.strokeStyle = 'rgba(45, 65, 48, 0.4)';
  worldCtx.lineWidth = 50;
  worldCtx.lineCap = 'round';
  worldCtx.beginPath();
  worldCtx.moveTo(FOREST_START_X, 550);
  worldCtx.quadraticCurveTo(2700, 520, 2900, 610);
  worldCtx.quadraticCurveTo(3180, 680, 3420, 440);
  worldCtx.stroke();

  // 2. 街區 5 間生動特色商鋪（交錯散落）
  STREET_SHOPS.forEach(shop => {
    // 建築陰影
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    worldCtx.fillRect(shop.x + 8, shop.y + 8, shop.w, shop.h);

    // 依店鋪種類上不同色彩的外牆
    const colors = {
      syrup: { wall: '#3d2b1f', roof: '#d35400', sign: '月華糖露' },
      rum: { wall: '#4a2323', roof: '#7b1113', sign: '烈酒蒸餾' },
      herbs: { wall: '#1e382b', roof: '#218c74', sign: '草藥香料' },
      fruit: { wall: '#272042', roof: '#5f27cd', sign: '星輝奇果' },
      frost: { wall: '#1e2c38', roof: '#3498db', sign: '極地冰霜' }
    };
    const c = colors[shop.type];

    worldCtx.fillStyle = c.wall;
    worldCtx.fillRect(shop.x, shop.y, shop.w, shop.h);

    // 屋頂與瓦片感
    worldCtx.fillStyle = c.roof;
    worldCtx.fillRect(shop.x - 4, shop.y - 6, shop.w + 8, 26);
    worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.6)';
    worldCtx.lineWidth = 1.8;
    worldCtx.strokeRect(shop.x, shop.y, shop.w, shop.h);

    // 店鋪木門與招牌
    worldCtx.fillStyle = '#181008';
    worldCtx.fillRect(shop.doorX - 14, shop.y + shop.h - 32, 28, 32);

    worldCtx.font = '24px serif';
    worldCtx.textAlign = 'center';
    worldCtx.fillText(shop.icon, shop.x + shop.w / 2, shop.y + 56);

    worldCtx.font = 'bold 11px sans-serif';
    worldCtx.fillStyle = '#f6c23e';
    worldCtx.fillText(c.sign, shop.x + shop.w / 2, shop.y + 78);
  });

  // 3. 中央奇幻酒館小屋（立體外觀）
  const h = TAVERN_HOUSE;
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  worldCtx.fillRect(h.x + 10, h.y + 10, h.w, h.h);

  // 磚木牆身
  worldCtx.fillStyle = '#3a271c';
  worldCtx.fillRect(h.x, h.y, h.w, h.h);

  // 雙層斜屋頂
  worldCtx.fillStyle = '#800c2a'; // 酒紅瓦
  worldCtx.beginPath();
  worldCtx.moveTo(h.x - 12, h.y + 20);
  worldCtx.lineTo(h.x + h.w / 2, h.y - 30);
  worldCtx.lineTo(h.x + h.w + 12, h.y + 20);
  worldCtx.closePath();
  worldCtx.fill();
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.8)';
  worldCtx.lineWidth = 2.5;
  worldCtx.stroke();

  // 煙囪與裊裊白煙
  worldCtx.fillStyle = '#4b4b4b';
  worldCtx.fillRect(h.x + 35, h.y - 45, 24, 40);
  worldCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  worldCtx.beginPath();
  worldCtx.arc(h.x + 47 + Math.sin(Date.now() * 0.002) * 5, h.y - 55, 7, 0, Math.PI * 2);
  worldCtx.fill();

  // 酒館雙開木大門（門內透出暖光）
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.fillRect(h.doorX - 22, h.doorY - 32, 44, 32);
  worldCtx.fillStyle = '#221508';
  worldCtx.fillRect(h.doorX - 20, h.doorY - 30, 40, 30);

  worldCtx.font = 'bold 13px serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.textAlign = 'center';
  worldCtx.fillText('★ 奇幻調酒館・自家小店 ★', h.x + h.w / 2, h.y + 55);

  worldCtx.font = '11px sans-serif';
  worldCtx.fillStyle = '#e8d8b8';
  worldCtx.fillText('（走近按空白鍵進屋調酒）', h.doorX, h.doorY + 22);

  // 4. 森林樹幹與地面寶箱
  FOREST_CHESTS.forEach(chest => {
    if (!chest.opened) {
      const g = worldCtx.createRadialGradient(chest.x, chest.y, 4, chest.x, chest.y, 30);
      g.addColorStop(0, 'rgba(246, 194, 62, 0.6)');
      g.addColorStop(1, 'rgba(246, 194, 62, 0)');
      worldCtx.fillStyle = g;
      worldCtx.beginPath();
      worldCtx.arc(chest.x, chest.y, 30, 0, Math.PI * 2);
      worldCtx.fill();
    }
    worldCtx.font = '26px serif';
    worldCtx.textAlign = 'center';
    worldCtx.textBaseline = 'middle';
    worldCtx.fillText(chest.opened ? '📭' : '🎁', chest.x, chest.y);
  });

  // 樹幹（底部）
  FOREST_TREES.forEach(tree => {
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    worldCtx.beginPath();
    worldCtx.ellipse(tree.x, tree.y + tree.trunkR, tree.crownR * 0.8, tree.crownR * 0.35, 0, 0, Math.PI * 2);
    worldCtx.fill();

    // 粗糙樹皮與樹根
    worldCtx.fillStyle = '#301f11';
    worldCtx.beginPath();
    worldCtx.arc(tree.x, tree.y, tree.trunkR, 0, Math.PI * 2);
    worldCtx.fill();
    worldCtx.strokeStyle = '#1b1108';
    worldCtx.lineWidth = 2.5;
    worldCtx.stroke();
  });
}

// 繪製大樹樹冠（置於主角之上，支援透明度遮蔽）
function drawTreeCrowns() {
  FOREST_TREES.forEach(tree => {
    worldCtx.save();
    worldCtx.globalAlpha = tree.currentAlpha;

    const cy = tree.y - 28;
    // 多團蓬鬆樹葉組合
    const leafClusters = [
      { ox: 0, oy: 0, r: tree.crownR },
      { ox: -tree.crownR * 0.35, oy: -tree.crownR * 0.25, r: tree.crownR * 0.65 },
      { ox: tree.crownR * 0.35, oy: -tree.crownR * 0.2, r: tree.crownR * 0.65 },
      { ox: 0, oy: -tree.crownR * 0.45, r: tree.crownR * 0.55 }
    ];

    leafClusters.forEach((cl, i) => {
      const g = worldCtx.createRadialGradient(tree.x + cl.ox, cy + cl.oy, 5, tree.x + cl.ox, cy + cl.oy, cl.r);
      g.addColorStop(0, '#10ac84');
      g.addColorStop(0.7, '#075341');
      g.addColorStop(1, '#032a21');
      worldCtx.fillStyle = g;
      worldCtx.beginPath();
      worldCtx.arc(tree.x + cl.ox, cy + cl.oy, cl.r, 0, Math.PI * 2);
      worldCtx.fill();
    });

    worldCtx.strokeStyle = 'rgba(29, 209, 161, 0.4)';
    worldCtx.lineWidth = 2;
    worldCtx.stroke();

    worldCtx.restore();
  });
}

// 繪製主角調酒師
function drawPlayer() {
  const p = game.player;
  const bobY = Math.sin(p.walkAnimTime) * 3;

  // 1. 提燈扇形光錐
  worldCtx.save();
  const coneDist = 110;
  const coneAngle = Math.PI / 3.4;
  const lightG = worldCtx.createRadialGradient(p.x, p.y, 8, p.x, p.y, coneDist);
  lightG.addColorStop(0, 'rgba(246, 194, 62, 0.4)');
  lightG.addColorStop(0.7, 'rgba(246, 194, 62, 0.1)');
  lightG.addColorStop(1, 'rgba(246, 194, 62, 0)');

  worldCtx.fillStyle = lightG;
  worldCtx.beginPath();
  worldCtx.moveTo(p.x, p.y);
  worldCtx.arc(p.x, p.y, coneDist, p.angle - coneAngle / 2, p.angle + coneAngle / 2);
  worldCtx.closePath();
  worldCtx.fill();
  worldCtx.restore();

  // 2. 引路螢火小精靈
  worldCtx.fillStyle = 'rgba(0, 210, 211, 0.85)';
  worldCtx.shadowColor = '#00d2d3';
  worldCtx.shadowBlur = 10;
  worldCtx.beginPath();
  worldCtx.arc(p.fairyX, p.fairyY, 3.8, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.shadowBlur = 0;

  // 3. 腳底柔和陰影
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  worldCtx.beginPath();
  worldCtx.ellipse(p.x, p.y + 14, 14, 7, 0, 0, Math.PI * 2);
  worldCtx.fill();

  // 4. 調酒師主體（酒紅背心 + 白圍裙領 + 提燈）
  worldCtx.fillStyle = '#800c2a';
  worldCtx.beginPath();
  worldCtx.arc(p.x, p.y + bobY, 15, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.strokeStyle = '#f6c23e';
  worldCtx.lineWidth = 1.8;
  worldCtx.stroke();

  worldCtx.fillStyle = '#ffffff';
  worldCtx.fillRect(p.x - 4, p.y + bobY - 9, 8, 8);

  // 提燈
  const lanternX = p.x + Math.cos(p.angle + 0.5) * 17;
  const lanternY = p.y + bobY + Math.sin(p.angle + 0.5) * 17;
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.beginPath();
  worldCtx.arc(lanternX, lanternY, 4, 0, Math.PI * 2);
  worldCtx.fill();

  worldCtx.font = '22px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText('🧙‍♂️', p.x, p.y + bobY - 2);
}

// ==================== 8. 調酒操作台與結算 ====================

function updateResourceDisplays() {
  DOM.goldDisplay.textContent = game.gold;
  DOM.repDisplay.textContent = game.reputation;
  DOM.pointsDisplay.textContent = game.points;
}

function openBartenderModal() {
  const cust = CUSTOMERS[game.currentCustomerIndex];
  DOM.orderCustAvatar.textContent = cust.avatar;
  DOM.orderCustName.textContent = cust.name;
  DOM.orderCustBadge.textContent = cust.badge;
  DOM.orderCustQuote.textContent = cust.quote;

  DOM.orderCustDesires.innerHTML = '';
  const flvLabels = { sweet: '甘甜', sour: '酸爽', spirit: '烈度', magic: '魔幻', spicy: '辛辣' };
  const tagClasses = { sweet: 'tag-sweet', sour: 'tag-sour', spirit: 'tag-spirit', magic: 'tag-magic', spicy: 'tag-spicy' };

  Object.entries(cust.preferred).forEach(([flv, level]) => {
    const tag = document.createElement('span');
    tag.className = `desire-tag ${tagClasses[flv] || ''}`;
    tag.textContent = `渴求：${flvLabels[flv]} ${'+'.repeat(level)}`;
    DOM.orderCustDesires.appendChild(tag);
  });

  renderBartenderIngredients();
  drawCocktailGlass();
  updateFlavorHUD();
  DOM.bartenderModal.classList.remove('hidden');
}

DOM.closeBartenderBtn.addEventListener('click', () => {
  DOM.bartenderModal.classList.add('hidden');
  stopPouring();
});

function renderBartenderIngredients() {
  DOM.ingredientGrid.innerHTML = '';
  let firstValid = null;

  Object.values(INGREDIENTS).forEach(item => {
    const stock = game.inventory[item.id] || 0;
    const card = document.createElement('div');
    card.className = `ing-select-card ${game.selectedIngredient === item.id ? 'selected' : ''}`;

    if (stock <= 0) {
      card.style.opacity = '0.35';
      card.style.pointerEvents = 'none';
    } else if (!firstValid) {
      firstValid = item.id;
    }

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:0.82rem;color:#fff;">${item.icon} ${item.name}</strong>
        <span style="font-size:0.72rem;color:var(--crystal-cyan);">x${stock}</span>
      </div>
    `;
    card.addEventListener('click', () => selectBartenderIngredient(item.id));
    DOM.ingredientGrid.appendChild(card);
  });

  if (!game.selectedIngredient && firstValid) {
    selectBartenderIngredient(firstValid);
  } else if (game.selectedIngredient) {
    selectBartenderIngredient(game.selectedIngredient);
  }
}

function selectBartenderIngredient(id) {
  game.selectedIngredient = id;
  const stock = game.inventory[id] || 0;
  renderBartenderIngredients();

  if (stock > 0) {
    const item = INGREDIENTS[id];
    DOM.pourBtn.disabled = false;
    DOM.pourBtn.innerHTML = `<span class="pour-btn-icon">${item.icon}</span> 按住注入 ${item.name}`;
  } else {
    DOM.pourBtn.disabled = true;
    DOM.pourBtn.textContent = '此原料已耗盡';
  }
}

['mousedown', 'touchstart'].forEach(evt => {
  DOM.pourBtn.addEventListener(evt, (e) => { e.preventDefault(); startPouring(); });
});
['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
  DOM.pourBtn.addEventListener(evt, (e) => { e.preventDefault(); stopPouring(); });
});

function getTotalCocktailVolume() {
  return game.glassLayers.reduce((sum, l) => sum + l.amount, 0);
}

function startPouring() {
  if (game.isPouring || !game.selectedIngredient) return;
  const stock = game.inventory[game.selectedIngredient] || 0;
  if (stock <= 0) return;

  const currentVol = getTotalCocktailVolume();
  if (currentVol >= game.glassCapacity) return;

  game.isPouring = true;
  DOM.pourBtn.classList.add('pouring');
  window.soundEngine.startPour();

  const item = INGREDIENTS[game.selectedIngredient];

  game.pourTimer = setInterval(() => {
    const vol = getTotalCocktailVolume();
    if (vol >= game.glassCapacity) {
      stopPouring();
      return;
    }

    const pourStep = 2.5;
    const lastLayer = game.glassLayers[game.glassLayers.length - 1];

    if (lastLayer && lastLayer.id === item.id) {
      lastLayer.amount += pourStep;
    } else {
      game.glassLayers.push({
        id: item.id,
        color: item.color,
        amount: pourStep,
        flavors: { ...item.flavors }
      });
    }

    drawCocktailGlass();
    updateFlavorHUD();
    DOM.finishDrinkBtn.disabled = getTotalCocktailVolume() < 20;
  }, 80);
}

function stopPouring() {
  if (!game.isPouring) return;
  game.isPouring = false;
  DOM.pourBtn.classList.remove('pouring');
  window.soundEngine.stopPour();

  if (game.pourTimer) {
    clearInterval(game.pourTimer);
    game.pourTimer = null;
  }

  if (game.selectedIngredient && game.inventory[game.selectedIngredient] > 0) {
    game.inventory[game.selectedIngredient] = Math.max(0, game.inventory[game.selectedIngredient] - 1);
    updateResourceDisplays();
    renderBartenderIngredients();
  }
}

DOM.resetDrinkBtn.addEventListener('click', () => {
  game.glassLayers = [];
  stopPouring();
  drawCocktailGlass();
  updateFlavorHUD();
  DOM.finishDrinkBtn.disabled = true;
  window.soundEngine.playIceClink();
});

function drawCocktailGlass() {
  cocktailCtx.clearRect(0, 0, DOM.cocktailCanvas.width, DOM.cocktailCanvas.height);
  const gx = 25, gy = 20, gw = 150, gh = 240, bottomW = 90;

  cocktailCtx.save();
  cocktailCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  cocktailCtx.lineWidth = 3;

  cocktailCtx.beginPath();
  cocktailCtx.moveTo(gx, gy);
  cocktailCtx.lineTo(gx + (gw - bottomW) / 2, gy + gh);
  cocktailCtx.lineTo(gx + (gw + bottomW) / 2, gy + gh);
  cocktailCtx.lineTo(gx + gw, gy);
  cocktailCtx.stroke();

  cocktailCtx.save();
  cocktailCtx.beginPath();
  cocktailCtx.moveTo(gx, gy);
  cocktailCtx.lineTo(gx + (gw - bottomW) / 2, gy + gh);
  cocktailCtx.lineTo(gx + (gw + bottomW) / 2, gy + gh);
  cocktailCtx.lineTo(gx + gw, gy);
  cocktailCtx.closePath();
  cocktailCtx.clip();

  let currentBaseY = gy + gh;
  game.glassLayers.forEach((layer) => {
    const layerH = (layer.amount / game.glassCapacity) * gh;
    const topY = currentBaseY - layerH;

    cocktailCtx.fillStyle = layer.color;
    cocktailCtx.fillRect(0, topY, DOM.cocktailCanvas.width, layerH);

    cocktailCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    cocktailCtx.fillRect(0, topY, DOM.cocktailCanvas.width, 2);

    currentBaseY = topY;
  });

  cocktailCtx.restore();
  cocktailCtx.restore();

  DOM.glassVolumeText.textContent = `${Math.round(getTotalCocktailVolume())} / ${game.glassCapacity} ml`;
}

function updateFlavorHUD() {
  const totals = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  game.glassLayers.forEach(l => {
    Object.keys(totals).forEach(k => {
      totals[k] += (l.flavors[k] || 0) * (l.amount / 10);
    });
  });

  const maxVal = 15;
  DOM.hudSweet.style.width = `${Math.min(100, (totals.sweet / maxVal) * 100)}%`;
  DOM.hudSour.style.width = `${Math.min(100, (totals.sour / maxVal) * 100)}%`;
  DOM.hudSpirit.style.width = `${Math.min(100, (totals.spirit / maxVal) * 100)}%`;
  DOM.hudMagic.style.width = `${Math.min(100, (totals.magic / maxVal) * 100)}%`;
  DOM.hudSpicy.style.width = `${Math.min(100, (totals.spicy / maxVal) * 100)}%`;
}

// 完成調酒並呈送客人結算
DOM.finishDrinkBtn.addEventListener('click', () => {
  const totalVol = getTotalCocktailVolume();
  if (totalVol < 15) return;

  DOM.bartenderModal.classList.add('hidden');
  window.soundEngine.playFanfare();

  const flavors = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  game.glassLayers.forEach(l => {
    Object.keys(flavors).forEach(k => {
      flavors[k] += (l.flavors[k] || 0) * (l.amount / 10);
    });
  });

  const layerCount = game.glassLayers.length;
  let visualStars = layerCount >= 3 ? 5 : layerCount === 2 ? 4 : 3;
  let precisionStars = (totalVol >= 85 && totalVol <= 100) ? 5 : totalVol >= 60 ? 4 : 2;

  const cust = CUSTOMERS[game.currentCustomerIndex];
  let matchScore = 0;
  let targetCount = 0;
  Object.entries(cust.preferred).forEach(([flv, reqLevel]) => {
    targetCount++;
    const actual = flavors[flv] || 0;
    if (actual >= reqLevel * 1.5) matchScore += 1;
    else if (actual >= reqLevel * 0.8) matchScore += 0.7;
    else matchScore += 0.3;
  });

  const flavorStars = Math.max(2, Math.min(5, Math.round((matchScore / (targetCount || 1)) * 5)));

  let drinkName = '冒險家特飲';
  let tier = '良品特調';

  if (flavors.magic >= 6 && layerCount >= 2) {
    drinkName = '極光之夜';
    tier = '傳奇魔釀';
  } else if (flavors.spirit >= 5 && flavors.spicy >= 4) {
    drinkName = '熔岩心跳';
    tier = '烈焰絕品';
  } else if (flavors.sweet >= 6 && flavors.sour >= 3) {
    drinkName = '月影甘泉';
    tier = '特級特調';
  } else if (game.glassLayers.some(l => l.id === 'glowing_shroom' || l.id === 'fairy_tear')) {
    drinkName = '幽谷幻精靈';
    tier = '精靈秘傳';
  } else if (game.glassLayers.some(l => l.id === 'star_fruit') && totalVol >= 85) {
    drinkName = '星空詠嘆調';
    tier = '大師特選';
  }

  game.unlockedRecipes.add(drinkName);

  const avgStars = (visualStars + precisionStars + flavorStars) / 3;
  const baseGold = 30 + Math.round(totalVol * 0.25);
  const earnedGold = Math.round(baseGold * cust.tipBonus * (avgStars / 4));
  const earnedRep = Math.max(3, Math.round(avgStars * 2.2));
  const earnedPts = Math.round(avgStars * 3 + (layerCount >= 3 ? 5 : 0));

  game.gold += earnedGold;
  game.reputation += earnedRep;
  game.points += earnedPts;

  DOM.resDrinkName.textContent = drinkName;
  DOM.resDrinkTier.textContent = tier;
  DOM.resVisualStars.textContent = '⭐'.repeat(visualStars);
  DOM.resFlavorStars.textContent = '⭐'.repeat(flavorStars);
  DOM.resPrecisionStars.textContent = '⭐'.repeat(precisionStars);

  DOM.resNpcAvatar.textContent = cust.avatar;
  DOM.resNpcName.textContent = cust.name;
  DOM.resNpcComment.textContent = avgStars >= 4 ? '「這份層次與流動的色彩宛如藝術品，真是絕妙的特調！」' : '「口感細緻，為我的旅途帶來了充沛元氣！」';

  DOM.resEarnGold.textContent = `+${earnedGold}`;
  DOM.resEarnRep.textContent = `+${earnedRep}`;
  DOM.resEarnPts.textContent = `+${earnedPts}`;

  game.glassLayers = [];
  DOM.resultModal.classList.remove('hidden');
  updateResourceDisplays();
});

DOM.confirmResultBtn.addEventListener('click', () => {
  DOM.resultModal.classList.add('hidden');
  game.currentCustomerIndex = (game.currentCustomerIndex + 1) % CUSTOMERS.length;
});

// 圖鑑 Modal
DOM.recipeBookBtn.addEventListener('click', () => {
  DOM.recipeGrid.innerHTML = '';
  RECIPES_CATALOG.forEach(r => {
    const isUnlocked = game.unlockedRecipes.has(r.name);
    const card = document.createElement('div');
    card.className = `recipe-card ${isUnlocked ? '' : 'locked'}`;
    card.innerHTML = `
      <div style="font-size:1.6rem;">${isUnlocked ? r.icon : '🔒'}</div>
      <strong style="color:#fff;font-size:0.9rem;">${isUnlocked ? r.name : '？？？'}</strong>
      <div style="font-size:0.72rem;color:var(--magic-violet);">${r.tags}</div>
      <p style="font-size:0.72rem;color:var(--text-parchment);margin-top:4px;">${isUnlocked ? '已完成收錄' : `線索: ${r.requirement}`}</p>
    `;
    DOM.recipeGrid.appendChild(card);
  });
  DOM.recipeBookModal.classList.remove('hidden');
});

DOM.closeBookBtn.addEventListener('click', () => {
  DOM.recipeBookModal.classList.add('hidden');
});

DOM.audioToggleBtn.addEventListener('click', () => {
  const muted = window.soundEngine.toggleMute();
  DOM.audioToggleBtn.textContent = muted ? '🔇' : '🔊';
});

// ==================== 9. 主循環 ====================

function gameLoop() {
  updatePlayer();
  drawWorld();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', () => {
  updateResourceDisplays();
  requestAnimationFrame(gameLoop);
});
