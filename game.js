/**
 * 奇幻調酒館 (Fantasy Bartender) - 吉卜力手繪動畫風格 (Studio Ghibli-inspired)
 * 整合專屬手繪資產：
 * 1. 柑橘造型水果糖漿鋪 (fruit_stall.jpg)
 * 2. 盤根古樹與生物光蘑菇秘境寶箱 (forest_roots.jpg)
 * 3. 溫馨手繪調酒師酒館小屋 (tavern_house.jpg)
 * 4. 浮動落葉與微光氣泡環境粒子系統
 */

// ==================== 1. 預載吉卜力手繪美術資產 ====================

const ASSET_IMAGES = {
  fruitStall: new Image(),
  forestRoots: new Image(),
  tavernHouse: new Image()
};
ASSET_IMAGES.fruitStall.src = 'assets/fruit_stall.jpg';
ASSET_IMAGES.forestRoots.src = 'assets/forest_roots.jpg';
ASSET_IMAGES.tavernHouse.src = 'assets/tavern_house.jpg';

// ==================== 2. 原料與資料定義 ====================

const INGREDIENTS = {
  moon_syrup: { id: 'moon_syrup', name: '月光糖漿', icon: '🍯', price: 15, repReq: 0, color: '#f6e58d', flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 }, desc: '柑橘水果工坊特釀，入口溫潤甘甜。', shopId: 'shop_citrus' },
  dawn_water: { id: 'dawn_water', name: '晨露純水', icon: '💧', price: 10, repReq: 0, color: '#7ed6df', flavors: { sweet: 1, sour: 2, spirit: 0, magic: 0, spicy: 0 }, desc: '花苞採集純淨晨露，微酸沁涼。', shopId: 'shop_herbs' },
  abyss_rum: { id: 'abyss_rum', name: '深淵烈酒', icon: '🍷', price: 25, repReq: 0, color: '#e056fd', flavors: { sweet: 0, sour: 0, spirit: 3, magic: 1, spicy: 1 }, desc: '地下熔岩烈火蒸餾，微醺狂烈。', shopId: 'shop_rum' },
  star_fruit: { id: 'star_fruit', name: '星輝果萃', icon: '✨', price: 20, repReq: 10, color: '#ffbe76', flavors: { sweet: 2, sour: 2, spirit: 0, magic: 2, spicy: 0 }, desc: '柑橘鋪鮮採星辰果，滿溢魔法流光。', shopId: 'shop_citrus' },
  frost_mint: { id: 'frost_mint', name: '極地薄荷霜', icon: '🌿', price: 30, repReq: 25, color: '#686de0', flavors: { sweet: 0, sour: 3, spirit: 1, magic: 1, spicy: 0 }, desc: '冰原凝鍊薄荷冰霜，沁涼透骨。', shopId: 'shop_frost' },
  dragon_chili: { id: 'dragon_chili', name: '巨龍朝天椒', icon: '🌶️', price: 45, repReq: 40, color: '#ff4757', flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 }, desc: '龍息炙烤朝天椒，喉中爆發辛香。', shopId: 'shop_rum' },
  // 森林寶箱專屬原料
  glowing_shroom: { id: 'glowing_shroom', name: '夜光幽魂菇', icon: '🍄', price: 0, forestOnly: true, repReq: 0, color: '#2ed573', flavors: { sweet: 0, sour: 1, spirit: 1, magic: 4, spicy: 0 }, desc: '生物光蘑菇樹下生長，散發翠綠幻光。' },
  fairy_tear: { id: 'fairy_tear', name: '妖精之淚', icon: '💎', price: 0, forestOnly: true, repReq: 0, color: '#38ada9', flavors: { sweet: 3, sour: 1, spirit: 0, magic: 4, spicy: 0 }, desc: '盤根老樹深處精靈落下的靈液。' },
  phoenix_ember: { id: 'phoenix_ember', name: '不死鳥餘燼', icon: '🪶', price: 0, forestOnly: true, repReq: 0, color: '#ff6348', flavors: { sweet: 1, sour: 0, spirit: 3, magic: 3, spicy: 3 }, desc: '古老神獸遺留火羽，擁有不滅之溫。' }
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
  { type: 'recipe', name: '翡翠妖精之露', desc: '在古橡樹盤根交錯深處發現的手繪羊皮古卷，解鎖了失落的高階特調酒譜！', pts: 35, gold: 45 },
  { type: 'recipe', name: '幽谷幻精靈', desc: '在生物光蘑菇樹蔭下掘得前代調酒師秘錄，已完整收錄至圖鑑！', pts: 30, gold: 40 },
  { type: 'item', itemId: 'fairy_tear', count: 2, desc: '寶箱中盛放著清澈璀璨的妖精之淚靈液！', pts: 20, gold: 35 },
  { type: 'item', itemId: 'phoenix_ember', count: 2, desc: '箱中封存著熾烈的不死鳥餘燼，散發溫暖金紅微光！', pts: 25, gold: 50 },
  { type: 'item', itemId: 'glowing_shroom', count: 3, desc: '箱內生長著整簇剛採摘的夜光幽魂菇！', pts: 15, gold: 25 }
];

// ==================== 3. 世界地圖規格與實體佈局 ====================

const WORLD_WIDTH = 3600;
const WORLD_HEIGHT = 1000;

const ZONE_MARKET_MAX_X = 1200;
const ZONE_TAVERN_MAX_X = 2200;
const FOREST_START_X = 2200;
const FOREST_WARN_X = 2700;
const FOREST_DANGER_X = 3100;
const FOREST_LOST_X = 3520;

const INDOOR_WIDTH = 1100;
const INDOOR_HEIGHT = 700;

// 街區特色店鋪（包含柑橘木質手繪水果鋪與其他工坊）
const STREET_SHOPS = [
  { id: 'shop_citrus', name: '切片柑橘糖果工坊', icon: '🍊', isGhibliStall: true, x: 380, y: 220, w: 260, h: 260, doorX: 510, doorY: 480, intro: '切片柑橘造型木質棚屋，掛滿果籃與七彩琉璃糖漿罐。' },
  { id: 'shop_rum', name: '深淵烈酒蒸餾廠', icon: '🍷', isGhibliStall: false, x: 740, y: 640, w: 150, h: 110, doorX: 815, doorY: 640, intro: '紅磚大煙囪蒸餾廠，飄散著濃郁烈酒與橡木香。' },
  { id: 'shop_herbs', name: '精靈香草晨露屋', icon: '🌿', isGhibliStall: false, x: 960, y: 260, w: 140, h: 95, doorX: 1030, doorY: 355, intro: '綠藤纏繞的木屋，販售純淨晨露與草藥。' },
  { id: 'shop_frost', name: '極地薄荷霜閣', icon: '🧊', isGhibliStall: false, x: 200, y: 640, w: 140, h: 95, doorX: 270, doorY: 640, intro: '屋簷結著晶瑩冰柱，提供沁涼薄荷精粹。' }
];

// 中央調酒師酒館小店
const TAVERN_HOUSE = {
  x: 1540,
  y: 200,
  w: 340,
  h: 340,
  doorX: 1710,
  doorY: 530
};

// 森林古樹與盤根秘境景點
const FOREST_LANDMARK = {
  x: 2720,
  y: 220,
  w: 340,
  h: 340,
  chestX: 2890,
  chestY: 480
};

// 森林生動大樹陣列
const FOREST_TREES = [
  { x: 2340, y: 300, trunkR: 24, crownR: 65, currentAlpha: 1 },
  { x: 2400, y: 700, trunkR: 26, crownR: 70, currentAlpha: 1 },
  { x: 2540, y: 440, trunkR: 28, crownR: 75, currentAlpha: 1 },
  { x: 2600, y: 220, trunkR: 22, crownR: 62, currentAlpha: 1 },
  { x: 3160, y: 340, trunkR: 30, crownR: 80, currentAlpha: 1 }, // 樹後藏寶箱
  { x: 3260, y: 650, trunkR: 30, crownR: 82, currentAlpha: 1 },
  { x: 3380, y: 320, trunkR: 34, crownR: 88, currentAlpha: 1 }, // 樹後藏寶箱
  { x: 3480, y: 680, trunkR: 32, crownR: 85, currentAlpha: 1 }
];

// 森林藏寶箱（包含盤根老樹下的核心寶箱與樹後密箱）
const FOREST_CHESTS = [
  { id: 'chest_roots', name: '盤根老樹下的古老寶箱', x: 2890, y: 480, opened: false, rewardIndex: 0 },
  { id: 'chest_tree_1', name: '幽谷古樹後的寶盒', x: 3160, y: 290, opened: false, rewardIndex: 1 },
  { id: 'chest_tree_2', name: '迷霧深處青苔寶藏', x: 3380, y: 270, opened: false, rewardIndex: 2 }
];

// 環境浮動微粒（落葉與魔法氣泡）
const AMBIENT_PARTICLES = Array.from({ length: 50 }, () => ({
  x: Math.random() * WORLD_WIDTH,
  y: Math.random() * WORLD_HEIGHT,
  size: 2 + Math.random() * 3,
  speedX: 0.3 + Math.random() * 0.6,
  speedY: (Math.random() - 0.5) * 0.4,
  type: Math.random() > 0.5 ? 'leaf' : 'bubble',
  sway: Math.random() * Math.PI * 2
}));

// ==================== 4. 遊戲狀態 ====================

class GameState {
  constructor() {
    this.gold = 160;
    this.reputation = 20;
    this.points = 0;

    this.currentScene = 'outdoor'; // 'outdoor' 或 'indoor'

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

    this.glassCapacity = 100;
    this.glassLayers = [];
    this.selectedIngredient = null;
    this.isPouring = false;
    this.pourTimer = null;

    this.player = {
      x: 1710,
      y: 570,
      radius: 17,
      speed: 3.8,
      sprintSpeed: 6.4,
      isSprinting: false,
      angle: 0,
      walkAnimTime: 0,
      targetX: null,
      targetY: null,
      fairyX: 1690,
      fairyY: 550,
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

// ==================== 5. DOM 快取 ====================

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

  chestRewardModal: document.getElementById('chest-reward-modal'),
  chestRewardType: document.getElementById('chest-reward-type'),
  chestRewardTitle: document.getElementById('chest-reward-title'),
  chestRewardDesc: document.getElementById('chest-reward-desc'),
  chestRewardPill: document.getElementById('chest-reward-pill'),
  closeChestBtn: document.getElementById('close-chest-btn'),

  marketModal: document.getElementById('market-modal'),
  shopModalIcon: document.getElementById('shop-modal-icon'),
  shopModalName: document.getElementById('shop-modal-name'),
  shopModalIntro: document.getElementById('shop-modal-intro'),
  closeMarketBtn: document.getElementById('close-market-btn'),
  marketGrid: document.getElementById('market-grid'),

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

// ==================== 6. 輸入監聽 ====================

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

// ==================== 7. 物理碰撞與進出屋邏輯 ====================

function checkCollision(x, y) {
  if (game.currentScene === 'indoor') {
    if (x < 120 || x > INDOOR_WIDTH - 120 || y < 200 || y > INDOOR_HEIGHT - 60) return true;
    if (x > 380 && x < 720 && y > 250 && y < 350) return true; // 吧台
    return false;
  }

  // 戶外
  // 1. 酒館外觀阻擋
  const h = TAVERN_HOUSE;
  if (x > h.x + 20 && x < h.x + h.w - 20 && y > h.y + 60 && y < h.y + h.h - 30) {
    // 門口留出通道
    if (!(x > h.doorX - 25 && x < h.doorX + 25 && y > h.doorY - 30)) return true;
  }

  // 2. 柑橘店鋪與其他商鋪阻擋
  for (const shop of STREET_SHOPS) {
    if (x > shop.x + 10 && x < shop.x + shop.w - 10 && y > shop.y + 30 && y < shop.y + shop.h - 20) {
      return true;
    }
  }

  // 3. 森林樹幹阻擋
  for (const tree of FOREST_TREES) {
    const d = Math.hypot(x - tree.x, y - tree.y);
    if (d < tree.trunkR + game.player.radius) return true;
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

  // 螢火小精靈游動
  game.player.fairyAngle += 0.07;
  const fairyTargetX = game.player.x - Math.cos(game.player.angle) * 30 + Math.sin(game.player.fairyAngle) * 15;
  const fairyTargetY = game.player.y - Math.sin(game.player.angle) * 30 - 22 + Math.cos(game.player.fairyAngle) * 12;
  game.player.fairyX += (fairyTargetX - game.player.fairyX) * 0.16;
  game.player.fairyY += (fairyTargetY - game.player.fairyY) * 0.16;

  // 鏡頭平滑跟隨
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

  // 森林落葉與氣泡粒子漂浮
  AMBIENT_PARTICLES.forEach(p => {
    p.x += p.speedX;
    p.sway += 0.04;
    p.y += Math.sin(p.sway) * 0.4;
    if (p.x > WORLD_WIDTH) p.x = 0;
  });

  // 樹冠遮蔽透明度
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

  game.player.x = TAVERN_HOUSE.doorX;
  game.player.y = TAVERN_HOUSE.doorY + 30;
  game.player.targetX = null;
  game.player.targetY = null;

  updateResourceDisplays();
  setTimeout(() => DOM.lostAlertBanner.classList.remove('show'), 3600);
}

// 檢測當前可互動項目
function detectNearbyInteraction() {
  let closest = null;
  let minDist = 80;

  if (game.currentScene === 'indoor') {
    const dDoor = Math.hypot(game.player.x - 550, game.player.y - 650);
    if (dDoor < minDist) {
      closest = { type: 'exit_tavern', x: 550, y: 620, prompt: '🚪 推門走到庭院' };
    }

    const dBar = Math.hypot(game.player.x - 550, game.player.y - 360);
    if (dBar < minDist + 15) {
      const cust = CUSTOMERS[game.currentCustomerIndex];
      closest = { type: 'bartender', x: 550, y: 320, prompt: `✨ 為 ${cust.name} 調酒` };
    }

    DOM.currentZoneName.textContent = '🏠 奇幻酒館・溫馨室內';
  } else {
    // 1. 酒館大門
    const dEnter = Math.hypot(game.player.x - TAVERN_HOUSE.doorX, game.player.y - TAVERN_HOUSE.doorY);
    if (dEnter < minDist) {
      closest = { type: 'enter_tavern', x: TAVERN_HOUSE.doorX, y: TAVERN_HOUSE.doorY - 20, prompt: '🏠 推門進入酒館' };
    }

    // 2. 街區店鋪（包含手繪柑橘店）
    STREET_SHOPS.forEach(shop => {
      const d = Math.hypot(game.player.x - shop.doorX, game.player.y - shop.doorY);
      if (d < minDist + 20) {
        closest = { type: 'shop', shop: shop, x: shop.doorX, y: shop.doorY - 20, prompt: `🛒 走進 ${shop.name}` };
      }
    });

    // 3. 森林寶箱（包含盤根老樹下的寶箱）
    FOREST_CHESTS.forEach(chest => {
      if (chest.opened) return;
      const d = Math.hypot(game.player.x - chest.x, game.player.y - chest.y);
      if (d < minDist) {
        closest = { type: 'chest', chest: chest, x: chest.x, y: chest.y - 25, prompt: `🎁 開啟 ${chest.name}` };
      }
    });

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
    window.soundEngine.playIceClink();
    game.currentScene = 'indoor';
    game.player.x = 550;
    game.player.y = 600;
    game.player.targetX = null;
    game.player.targetY = null;
    DOM.mistVignette.style.opacity = '0';
    stopHeartbeat();
  } else if (target.type === 'exit_tavern') {
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

function openShopModal(shop) {
  DOM.shopModalIcon.textContent = shop.icon;
  DOM.shopModalName.textContent = shop.name;
  DOM.shopModalIntro.textContent = shop.intro;
  DOM.marketGrid.innerHTML = '';

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

// ==================== 8. 2D 畫布繪製系統 ====================

function drawWorld() {
  worldCtx.clearRect(0, 0, DOM.worldCanvas.width, DOM.worldCanvas.height);
  worldCtx.save();
  worldCtx.translate(-game.camera.x, -game.camera.y);

  if (game.currentScene === 'indoor') {
    drawTavernInterior();
  } else {
    drawOutdoorWorld();
  }

  drawPlayer();

  if (game.currentScene === 'outdoor') {
    drawTreeCrowns();
    drawAmbientParticles();
  }

  worldCtx.restore();
}

function drawTavernInterior() {
  worldCtx.fillStyle = '#261a10';
  worldCtx.fillRect(100, 100, INDOOR_WIDTH - 200, INDOOR_HEIGHT - 160);

  worldCtx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
  worldCtx.lineWidth = 2;
  for (let y = 140; y < INDOOR_HEIGHT - 60; y += 45) {
    worldCtx.beginPath();
    worldCtx.moveTo(100, y);
    worldCtx.lineTo(INDOOR_WIDTH - 100, y);
    worldCtx.stroke();
  }

  worldCtx.fillStyle = '#7a102b';
  worldCtx.fillRect(300, 360, 500, 240);
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.6)';
  worldCtx.lineWidth = 3;
  worldCtx.strokeRect(300, 360, 500, 240);

  // 壁爐
  worldCtx.fillStyle = '#444';
  worldCtx.fillRect(160, 240, 90, 110);
  worldCtx.fillStyle = '#e67e22';
  worldCtx.beginPath();
  worldCtx.arc(205, 310, 16 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
  worldCtx.fill();

  // 背後酒架
  worldCtx.fillStyle = '#3a2416';
  worldCtx.fillRect(380, 160, 340, 80);
  for (let bx = 395; bx < 700; bx += 22) {
    worldCtx.fillStyle = ['#f6c23e', '#e056fd', '#00d2d3', '#ff4757', '#2ed573'][bx % 5];
    worldCtx.fillRect(bx, 190, 8, 20);
  }

  // 吧台
  worldCtx.fillStyle = '#53351e';
  worldCtx.fillRect(380, 270, 340, 70);
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.85)';
  worldCtx.lineWidth = 2.5;
  worldCtx.strokeRect(380, 270, 340, 70);

  worldCtx.font = 'bold 13px sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.textAlign = 'center';
  worldCtx.fillText('★ 傳奇調酒吧台（按空白鍵）★', 550, 312);

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

  worldCtx.fillStyle = '#221508';
  worldCtx.fillRect(510, 640, 80, 20);
  worldCtx.font = 'bold 12px sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.fillText('🚪 出門到庭院', 550, 630);
}

function drawOutdoorWorld() {
  // 地表底色
  worldCtx.fillStyle = '#141624';
  worldCtx.fillRect(0, 0, ZONE_MARKET_MAX_X, WORLD_HEIGHT);
  worldCtx.fillStyle = '#1d1a2d';
  worldCtx.fillRect(ZONE_MARKET_MAX_X, 0, ZONE_TAVERN_MAX_X - ZONE_MARKET_MAX_X, WORLD_HEIGHT);

  const fGrad = worldCtx.createLinearGradient(FOREST_START_X, 0, WORLD_WIDTH, 0);
  fGrad.addColorStop(0, '#0c1b17');
  fGrad.addColorStop(1, '#030a08');
  worldCtx.fillStyle = fGrad;
  worldCtx.fillRect(FOREST_START_X, 0, WORLD_WIDTH - FOREST_START_X, WORLD_HEIGHT);

  // 1. 左側街區店鋪渲染
  STREET_SHOPS.forEach(shop => {
    if (shop.isGhibliStall && ASSET_IMAGES.fruitStall.complete && ASSET_IMAGES.fruitStall.naturalWidth > 0) {
      // 繪製手繪柑橘水果工坊
      worldCtx.save();
      // 繪製微光與投影
      worldCtx.shadowColor = 'rgba(243, 156, 18, 0.4)';
      worldCtx.shadowBlur = 18;
      // 圓角裁切或直接精緻繪出
      worldCtx.drawImage(ASSET_IMAGES.fruitStall, shop.x, shop.y, shop.w, shop.h);
      worldCtx.restore();

      // 招牌標籤
      worldCtx.font = 'bold 12px sans-serif';
      worldCtx.fillStyle = '#f6c23e';
      worldCtx.textAlign = 'center';
      worldCtx.fillText('★ 柑橘水果工坊 ★', shop.doorX, shop.doorY - 5);
    } else {
      // 其他特色商鋪
      worldCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      worldCtx.fillRect(shop.x + 6, shop.y + 6, shop.w, shop.h);

      const colors = {
        rum: { wall: '#4a2323', roof: '#8b1517', sign: '烈酒蒸餾所' },
        herbs: { wall: '#1e382b', roof: '#218c74', sign: '草藥晨露屋' },
        frost: { wall: '#1e2c38', roof: '#3498db', sign: '極地薄荷霜閣' }
      }[shop.id.replace('shop_', '')] || { wall: '#333', roof: '#555', sign: shop.name };

      worldCtx.fillStyle = colors.wall;
      worldCtx.fillRect(shop.x, shop.y, shop.w, shop.h);
      worldCtx.fillStyle = colors.roof;
      worldCtx.fillRect(shop.x - 4, shop.y - 4, shop.w + 8, 22);

      worldCtx.font = '24px serif';
      worldCtx.textAlign = 'center';
      worldCtx.fillText(shop.icon, shop.x + shop.w / 2, shop.y + 55);
      worldCtx.font = 'bold 11px sans-serif';
      worldCtx.fillStyle = '#f6c23e';
      worldCtx.fillText(colors.sign, shop.x + shop.w / 2, shop.y + 78);
    }
  });

  // 2. 中央手繪酒館小屋
  const h = TAVERN_HOUSE;
  if (ASSET_IMAGES.tavernHouse.complete && ASSET_IMAGES.tavernHouse.naturalWidth > 0) {
    worldCtx.save();
    worldCtx.shadowColor = 'rgba(246, 194, 62, 0.45)';
    worldCtx.shadowBlur = 24;
    worldCtx.drawImage(ASSET_IMAGES.tavernHouse, h.x, h.y, h.w, h.h);
    worldCtx.restore();

    worldCtx.font = 'bold 13px serif';
    worldCtx.fillStyle = '#f6c23e';
    worldCtx.textAlign = 'center';
    worldCtx.fillText('★ 奇幻調酒館 ★', h.doorX, h.doorY + 22);
  }

  // 3. 右側森林：古橡樹、生物光蘑菇與盤根寶箱秘境
  const fl = FOREST_LANDMARK;
  if (ASSET_IMAGES.forestRoots.complete && ASSET_IMAGES.forestRoots.naturalWidth > 0) {
    worldCtx.save();
    worldCtx.shadowColor = 'rgba(29, 209, 161, 0.5)';
    worldCtx.shadowBlur = 28;
    worldCtx.drawImage(ASSET_IMAGES.forestRoots, fl.x, fl.y, fl.w, fl.h);
    worldCtx.restore();
  }

  // 森林其他樹幹與寶箱
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

  FOREST_TREES.forEach(tree => {
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    worldCtx.beginPath();
    worldCtx.ellipse(tree.x, tree.y + tree.trunkR, tree.crownR * 0.8, tree.crownR * 0.35, 0, 0, Math.PI * 2);
    worldCtx.fill();

    worldCtx.fillStyle = '#332113';
    worldCtx.beginPath();
    worldCtx.arc(tree.x, tree.y, tree.trunkR, 0, Math.PI * 2);
    worldCtx.fill();
    worldCtx.strokeStyle = '#1a0f07';
    worldCtx.lineWidth = 2.5;
    worldCtx.stroke();
  });
}

function drawTreeCrowns() {
  FOREST_TREES.forEach(tree => {
    worldCtx.save();
    worldCtx.globalAlpha = tree.currentAlpha;

    const cy = tree.y - 28;
    const leafClusters = [
      { ox: 0, oy: 0, r: tree.crownR },
      { ox: -tree.crownR * 0.35, oy: -tree.crownR * 0.25, r: tree.crownR * 0.65 },
      { ox: tree.crownR * 0.35, oy: -tree.crownR * 0.2, r: tree.crownR * 0.65 }
    ];

    leafClusters.forEach((cl) => {
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

// 繪製漂浮落葉與魔法氣泡粒子
function drawAmbientParticles() {
  AMBIENT_PARTICLES.forEach(p => {
    if (p.type === 'leaf') {
      worldCtx.fillStyle = 'rgba(246, 194, 62, 0.65)';
      worldCtx.beginPath();
      worldCtx.ellipse(p.x, p.y, p.size, p.size * 0.5, p.sway, 0, Math.PI * 2);
      worldCtx.fill();
    } else {
      worldCtx.fillStyle = 'rgba(0, 210, 211, 0.5)';
      worldCtx.beginPath();
      worldCtx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      worldCtx.fill();
    }
  });
}

function drawPlayer() {
  const p = game.player;
  const bobY = Math.sin(p.walkAnimTime) * 3;

  // 提燈光錐
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

  // 螢火伴星
  worldCtx.fillStyle = 'rgba(0, 210, 211, 0.85)';
  worldCtx.shadowColor = '#00d2d3';
  worldCtx.shadowBlur = 10;
  worldCtx.beginPath();
  worldCtx.arc(p.fairyX, p.fairyY, 3.8, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.shadowBlur = 0;

  // 陰影
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  worldCtx.beginPath();
  worldCtx.ellipse(p.x, p.y + 14, 14, 7, 0, 0, Math.PI * 2);
  worldCtx.fill();

  // 酒紅背心調酒師
  worldCtx.fillStyle = '#800c2a';
  worldCtx.beginPath();
  worldCtx.arc(p.x, p.y + bobY, 15, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.strokeStyle = '#f6c23e';
  worldCtx.lineWidth = 1.8;
  worldCtx.stroke();

  worldCtx.fillStyle = '#ffffff';
  worldCtx.fillRect(p.x - 4, p.y + bobY - 9, 8, 8);

  // 提燈手柄
  const lx = p.x + Math.cos(p.angle + 0.5) * 17;
  const ly = p.y + bobY + Math.sin(p.angle + 0.5) * 17;
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.beginPath();
  worldCtx.arc(lx, ly, 4, 0, Math.PI * 2);
  worldCtx.fill();

  worldCtx.font = '22px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText('🧙‍♂️', p.x, p.y + bobY - 2);
}

// ==================== 9. 調酒與結算 ====================

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
DOM.closeBookBtn.addEventListener('click', () => DOM.recipeBookModal.classList.add('hidden'));

DOM.audioToggleBtn.addEventListener('click', () => {
  const muted = window.soundEngine.toggleMute();
  DOM.audioToggleBtn.textContent = muted ? '🔇' : '🔊';
});

// ==================== 10. 主遊戲循環 ====================

function gameLoop() {
  updatePlayer();
  drawWorld();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', () => {
  updateResourceDisplays();
  requestAnimationFrame(gameLoop);
});
