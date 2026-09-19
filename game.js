/**
 * 奇幻調酒館 (Fantasy Bartender) - 原創奇幻冒險探索引擎
 * 特色：
 * 1. 原創調酒師形象（提燈、圍裙、跟隨小精靈伴侶、光錐）
 * 2. 森林實體大樹（樹幹物理碰撞 + 樹冠遮蔽半透明）
 * 3. 樹後隱藏寶箱（開啟獲得失落調酒秘籍與稀有原料）
 * 4. 三向大地圖無縫走動（左市集・中酒吧・右森林）
 * 5. 防迷路心跳迷霧機制與調酒工坊
 */

// ==================== 1. 資料庫定義 ====================

const INGREDIENTS = {
  moon_syrup: { id: 'moon_syrup', name: '月光糖漿', icon: '🌙', price: 15, repReq: 0, color: '#f6e58d', flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 }, desc: '月圓之夜採集的甘露，入口溫潤綿長。' },
  dawn_water: { id: 'dawn_water', name: '晨露純水', icon: '💧', price: 10, repReq: 0, color: '#7ed6df', flavors: { sweet: 1, sour: 2, spirit: 0, magic: 0, spicy: 0 }, desc: '清晨自精靈花苞採集的水滴，微酸清新。' },
  abyss_rum: { id: 'abyss_rum', name: '深淵烈酒', icon: '🔥', price: 25, repReq: 0, color: '#e056fd', flavors: { sweet: 0, sour: 0, spirit: 3, magic: 1, spicy: 1 }, desc: '地下熔岩熱力的烈酒，微醺狂野。' },
  star_fruit: { id: 'star_fruit', name: '星輝果萃', icon: '✨', price: 20, repReq: 10, color: '#ffbe76', flavors: { sweet: 2, sour: 2, spirit: 0, magic: 2, spicy: 0 }, desc: '閃爍星芒的果實精華，注入流光。' },
  frost_mint: { id: 'frost_mint', name: '極地薄荷霜', icon: '🌿', price: 30, repReq: 25, color: '#686de0', flavors: { sweet: 0, sour: 3, spirit: 1, magic: 1, spicy: 0 }, desc: '極北冰原薄荷霜凝，沁涼透骨。' },
  dragon_chili: { id: 'dragon_chili', name: '巨龍朝天椒', icon: '🌶️', price: 45, repReq: 40, color: '#ff4757', flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 }, desc: '幼龍吐息烤炙辣椒，辛香狂烈。' },
  // 森林專屬寶箱/採集原料
  glowing_shroom: { id: 'glowing_shroom', name: '夜光幽魂菇', icon: '🍄', price: 0, forestOnly: true, repReq: 0, color: '#2ed573', flavors: { sweet: 0, sour: 1, spirit: 1, magic: 4, spicy: 0 }, desc: '森林深處幽暗菌菇，散發翠綠幻光。' },
  fairy_tear: { id: 'fairy_tear', name: '妖精之淚', icon: '💎', price: 0, forestOnly: true, repReq: 0, color: '#38ada9', flavors: { sweet: 3, sour: 1, spirit: 0, magic: 4, spicy: 0 }, desc: '森林妖精落下的靈液，極度珍稀。' },
  phoenix_ember: { id: 'phoenix_ember', name: '不死鳥餘燼', icon: '🪶', price: 0, forestOnly: true, repReq: 0, color: '#ff6348', flavors: { sweet: 1, sour: 0, spirit: 3, magic: 3, spicy: 3 }, desc: '神獸棲息處殘留的火羽殘燼，不熄之熱。' }
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
  { name: '冰焰極光特調', requirement: '在森林大樹後寶箱獲得秘籍', tags: '古林秘籍 / 珍品', icon: '📜' },
  { name: '冒險家特飲', requirement: '任一混調出品之基礎特飲', tags: '常規 / 家常', icon: '🍹' }
];

// 寶箱掉落獎勵池（包含失落秘籍）
const CHEST_REWARD_POOL = [
  { type: 'recipe', name: '冰焰極光特調', desc: '在密林巨樹陰影下發現的前代調酒師秘錄，已完整登錄至你的特調圖鑑中！', pts: 30, gold: 40 },
  { type: 'recipe', name: '幽谷幻精靈', desc: '古老羊皮紙捲軸中記載著以妖精之淚為引的秘方！', pts: 25, gold: 35 },
  { type: 'item', itemId: 'fairy_tear', count: 2, desc: '打開寶箱，裡面靜靜躺著閃爍晨光的妖精之淚！', pts: 15, gold: 30 },
  { type: 'item', itemId: 'phoenix_ember', count: 2, desc: '箱中封存著熾熱的不死鳥餘燼，握在手中仍散發微溫！', pts: 20, gold: 45 },
  { type: 'item', itemId: 'glowing_shroom', count: 3, desc: '箱內生長著整簇新鮮的夜光幽魂菇，香氣奇異！', pts: 15, gold: 25 }
];

// ==================== 2. 世界與實體定義 ====================

const WORLD_WIDTH = 3600;
const WORLD_HEIGHT = 1000;

const ZONE_MARKET_MAX_X = 1150;
const ZONE_TAVERN_MAX_X = 2250;
const FOREST_START_X = 2250;
const FOREST_WARN_X = 2750;
const FOREST_DANGER_X = 3150;
const FOREST_LOST_X = 3520;

// 森林大樹陣列（帶有樹幹碰撞與遮蔽半透明）
const FOREST_TREES = [
  // 入口迎賓樹
  { x: 2340, y: 320, trunkR: 22, crownR: 62, currentAlpha: 1 },
  { x: 2360, y: 720, trunkR: 24, crownR: 68, currentAlpha: 1 },
  // 前段林蔭小徑
  { x: 2520, y: 440, trunkR: 26, crownR: 72, currentAlpha: 1 },
  { x: 2580, y: 220, trunkR: 22, crownR: 60, currentAlpha: 1 },
  { x: 2650, y: 680, trunkR: 25, crownR: 70, currentAlpha: 1 },
  { x: 2720, y: 380, trunkR: 28, crownR: 75, currentAlpha: 1 }, // 此樹後藏寶箱
  // 中段密林交錯
  { x: 2880, y: 260, trunkR: 26, crownR: 74, currentAlpha: 1 },
  { x: 2920, y: 620, trunkR: 28, crownR: 78, currentAlpha: 1 }, // 此樹後藏寶箱
  { x: 3040, y: 420, trunkR: 30, crownR: 82, currentAlpha: 1 },
  { x: 3120, y: 200, trunkR: 24, crownR: 66, currentAlpha: 1 },
  { x: 3180, y: 740, trunkR: 26, crownR: 72, currentAlpha: 1 },
  // 深處古林巨樹（高危險區）
  { x: 3280, y: 360, trunkR: 32, crownR: 88, currentAlpha: 1 }, // 此樹後藏寶箱
  { x: 3360, y: 600, trunkR: 30, crownR: 85, currentAlpha: 1 },
  { x: 3450, y: 280, trunkR: 34, crownR: 90, currentAlpha: 1 }, // 迷霧邊界秘寶
  { x: 3480, y: 720, trunkR: 28, crownR: 80, currentAlpha: 1 }
];

// 森林隱藏寶箱陣列（精確藏在大樹後方或密林小道）
const FOREST_CHESTS = [
  { id: 'chest_tree_1', name: '林蔭老樹後的木箱', x: 2720, y: 330, opened: false, rewardIndex: 0 },
  { id: 'chest_tree_2', name: '翠苔巨岩旁的靈箱', x: 2920, y: 570, opened: false, rewardIndex: 1 },
  { id: 'chest_tree_3', name: '幽谷深處古樸秘盒', x: 3280, y: 310, opened: false, rewardIndex: 2 },
  { id: 'chest_tree_4', name: '迷霧邊緣遠古秘藏', x: 3450, y: 230, opened: false, rewardIndex: 3 }
];

// 市集攤位
const MARKET_STALLS = [
  { id: 'stall_syrup', name: '月華糖漿鋪', icon: '🍯', x: 420, y: 380, width: 140, height: 90 },
  { id: 'stall_wine', name: '矮人烈酒坊', icon: '🍷', x: 720, y: 380, width: 140, height: 90 },
  { id: 'stall_herbs', name: '精靈香草攤', icon: '🌿', x: 980, y: 380, width: 140, height: 90 }
];

// 酒吧核心實體
const TAVERN_ITEMS = {
  counter: { x: 1700, y: 380, width: 240, height: 80 },
  customerSeat: { x: 1700, y: 470, radius: 26 }
};

// ==================== 3. 遊戲狀態 ====================

class GameState {
  constructor() {
    this.gold = 160;
    this.reputation = 20;
    this.points = 0;

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

    // 原創調酒師主角
    this.player = {
      x: 1700,
      y: 560,
      radius: 18,
      speed: 3.8,
      sprintSpeed: 6.4,
      isSprinting: false,
      angle: 0,
      walkAnimTime: 0,
      targetX: null,
      targetY: null,
      // 引路小精靈（螢火伴侶）
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
  minimapCanvas: document.getElementById('minimap-canvas'),
  currentZoneName: document.getElementById('current-zone-name'),
  goldDisplay: document.getElementById('gold-display'),
  repDisplay: document.getElementById('rep-display'),
  pointsDisplay: document.getElementById('points-display'),
  audioToggleBtn: document.getElementById('audio-toggle-btn'),
  recipeBookBtn: document.getElementById('recipe-book-btn'),

  mistVignette: document.getElementById('mist-vignette'),
  lostAlertBanner: document.getElementById('lost-alert-banner'),
  forestDangerHud: document.getElementById('forest-danger-hud'),
  dangerMeterFill: document.getElementById('danger-meter-fill'),
  dangerDistText: document.getElementById('danger-dist-text'),
  dangerStatusBadge: document.getElementById('danger-status-badge'),
  proximityPrompt: document.getElementById('proximity-prompt'),
  promptActionText: document.getElementById('prompt-action-text'),

  joystickZone: document.getElementById('joystick-zone'),
  joystickBase: document.getElementById('joystick-base'),
  joystickStick: document.getElementById('joystick-stick'),
  touchSprintBtn: document.getElementById('touch-sprint-btn'),
  touchInteractBtn: document.getElementById('touch-interact-btn'),

  // 寶箱開啟獲得秘籍彈窗
  chestRewardModal: document.getElementById('chest-reward-modal'),
  chestRewardType: document.getElementById('chest-reward-type'),
  chestRewardTitle: document.getElementById('chest-reward-title'),
  chestRewardDesc: document.getElementById('chest-reward-desc'),
  chestRewardPill: document.getElementById('chest-reward-pill'),
  closeChestBtn: document.getElementById('close-chest-btn'),

  marketModal: document.getElementById('market-modal'),
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
const minimapCtx = DOM.minimapCanvas.getContext('2d');
const cocktailCtx = DOM.cocktailCanvas.getContext('2d');

function resizeCanvases() {
  DOM.worldCanvas.width = window.innerWidth;
  DOM.worldCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// ==================== 5. 輸入與操作監聽 ====================

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

// 虛擬搖桿拖拽
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
const maxJoystickRadius = 38;

function joyStart(clientX, clientY) {
  joystickActive = true;
  const rect = DOM.joystickBase.getBoundingClientRect();
  joystickCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  joyMove(clientX, clientY);
}

function joyMove(clientX, clientY) {
  if (!joystickActive) return;
  const dx = clientX - joystickCenter.x;
  const dy = clientY - joystickCenter.y;
  const dist = Math.hypot(dx, dy);
  const clampDist = Math.min(dist, maxJoystickRadius);
  const angle = Math.atan2(dy, dx);

  const sx = Math.cos(angle) * clampDist;
  const sy = Math.sin(angle) * clampDist;

  DOM.joystickStick.style.transform = `translate(${sx}px, ${sy}px)`;
  game.joystickVector.x = sx / maxJoystickRadius;
  game.joystickVector.y = sy / maxJoystickRadius;

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

DOM.joystickZone.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) joyStart(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchmove', (e) => {
  if (joystickActive && e.touches.length > 0) joyMove(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchend', joyEnd);

DOM.touchSprintBtn.addEventListener('click', () => {
  game.player.isSprinting = !game.player.isSprinting;
  DOM.touchSprintBtn.classList.toggle('active', game.player.isSprinting);
});

DOM.touchInteractBtn.addEventListener('click', () => {
  triggerActiveInteraction();
});

function isAnyModalOpen() {
  return !DOM.marketModal.classList.contains('hidden') ||
         !DOM.bartenderModal.classList.contains('hidden') ||
         !DOM.resultModal.classList.contains('hidden') ||
         !DOM.recipeBookModal.classList.contains('hidden') ||
         !DOM.chestRewardModal.classList.contains('hidden');
}

// ==================== 6. 物理碰撞與樹木遮擋檢測 ====================

// 檢測是否與樹幹碰撞
function checkTreeCollision(x, y) {
  for (const tree of FOREST_TREES) {
    const dist = Math.hypot(x - tree.x, y - tree.y);
    if (dist < tree.trunkR + game.player.radius) {
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

    // 嘗試分軸移動以支援滑行碰撞
    const nextX = game.player.x + nx;
    const nextY = game.player.y + ny;

    if (!checkTreeCollision(nextX, game.player.y)) {
      game.player.x = nextX;
    }
    if (!checkTreeCollision(game.player.x, nextY)) {
      game.player.y = nextY;
    }

    game.player.angle = Math.atan2(ny, nx);
    game.player.walkAnimTime += 0.22;
  }

  // 世界邊界約束
  game.player.x = Math.max(game.player.radius, Math.min(WORLD_WIDTH - game.player.radius, game.player.x));
  game.player.y = Math.max(140, Math.min(WORLD_HEIGHT - 90, game.player.y));

  // 更新引路小精靈位置（跟隨在主角身旁游動）
  game.player.fairyAngle += 0.06;
  const fairyTargetX = game.player.x - Math.cos(game.player.angle) * 32 + Math.sin(game.player.fairyAngle) * 16;
  const fairyTargetY = game.player.y - Math.sin(game.player.angle) * 32 - 24 + Math.cos(game.player.fairyAngle) * 12;
  game.player.fairyX += (fairyTargetX - game.player.fairyX) * 0.15;
  game.player.fairyY += (fairyTargetY - game.player.fairyY) * 0.15;

  // 鏡頭跟隨
  const targetCamX = game.player.x - DOM.worldCanvas.width / 2;
  const targetCamY = game.player.y - DOM.worldCanvas.height / 2;
  game.camera.x += (targetCamX - game.camera.x) * 0.1;
  game.camera.y += (targetCamY - game.camera.y) * 0.1;

  const maxCamX = Math.max(0, WORLD_WIDTH - DOM.worldCanvas.width);
  const maxCamY = Math.max(0, WORLD_HEIGHT - DOM.worldCanvas.height);
  game.camera.x = Math.max(0, Math.min(maxCamX, game.camera.x));
  game.camera.y = Math.max(0, Math.min(maxCamY, game.camera.y));

  // 樹冠遮蔽半透明更新：當玩家在樹冠範圍內且在樹幹上方/後方時，樹冠透明化
  FOREST_TREES.forEach(tree => {
    const distToCrown = Math.hypot(game.player.x - tree.x, game.player.y - (tree.y - 20));
    const isUnderCrown = distToCrown < tree.crownR + 15;
    const targetAlpha = isUnderCrown ? 0.35 : 1.0;
    tree.currentAlpha += (targetAlpha - tree.currentAlpha) * 0.15;
  });

  updateZoneTag();
  updateForestFogMechanic();
  detectNearbyInteractables();
}

function updateZoneTag() {
  if (game.player.x < ZONE_MARKET_MAX_X) {
    DOM.currentZoneName.textContent = '🛒 星光夜市・調飲商圈';
    DOM.forestDangerHud.classList.add('hidden');
  } else if (game.player.x < ZONE_TAVERN_MAX_X) {
    DOM.currentZoneName.textContent = '🏠 奇幻酒館・工坊大廳';
    DOM.forestDangerHud.classList.add('hidden');
  } else {
    DOM.currentZoneName.textContent = '🌲 神祕迷霧古林';
    DOM.forestDangerHud.classList.remove('hidden');
  }
}

function updateForestFogMechanic() {
  if (game.player.x <= FOREST_START_X) {
    DOM.mistVignette.style.opacity = '0';
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
    return;
  }

  const distInForest = game.player.x - FOREST_START_X;
  const maxForestDist = FOREST_LOST_X - FOREST_START_X;
  const progress = Math.min(100, Math.round((distInForest / maxForestDist) * 100));

  DOM.dangerDistText.textContent = `${Math.round(distInForest / 5)}m`;
  DOM.dangerMeterFill.style.width = `${progress}%`;

  if (game.player.x < FOREST_WARN_X) {
    DOM.dangerStatusBadge.textContent = '林道明晰';
    DOM.dangerStatusBadge.className = 'state-safe';
    DOM.mistVignette.style.opacity = `${(distInForest / (FOREST_WARN_X - FOREST_START_X)) * 0.4}`;
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
  } else if (game.player.x < FOREST_DANGER_X) {
    DOM.dangerStatusBadge.textContent = '起霧警戒！';
    DOM.dangerStatusBadge.className = 'state-warn';
    DOM.mistVignette.classList.add('danger');
    DOM.mistVignette.classList.remove('extreme');
    startHeartbeat(2000, 0.35);
  } else if (game.player.x < FOREST_LOST_X) {
    DOM.dangerStatusBadge.textContent = '⚠️ 極度危險！即將迷失';
    DOM.dangerStatusBadge.className = 'state-danger';
    DOM.mistVignette.classList.remove('danger');
    DOM.mistVignette.classList.add('extreme');
    startHeartbeat(1000, 0.7);
  } else {
    triggerLostMechanic();
  }
}

function startHeartbeat(intervalMs, vol) {
  if (game.heartbeatTimer) return;
  game.heartbeatTimer = setInterval(() => {
    window.soundEngine.playHeartbeat(vol);
  }, intervalMs);
}

function stopHeartbeat() {
  if (game.heartbeatTimer) {
    clearInterval(game.heartbeatTimer);
    game.heartbeatTimer = null;
  }
}

function triggerLostMechanic() {
  stopHeartbeat();
  window.soundEngine.playLostSound();
  DOM.lostAlertBanner.classList.add('show');

  Object.keys(game.collectedInCurrentRun).forEach(id => {
    const lostCount = Math.ceil(game.collectedInCurrentRun[id] / 2);
    game.inventory[id] = Math.max(0, (game.inventory[id] || 0) - lostCount);
  });
  game.collectedInCurrentRun = {};

  game.player.x = 1700;
  game.player.y = 520;
  game.player.targetX = null;
  game.player.targetY = null;

  updateResourceDisplays();

  setTimeout(() => {
    DOM.lostAlertBanner.classList.remove('show');
  }, 3600);
}

// 檢測身邊最近可交互實體（市集、調酒、樹後隱藏寶箱）
function detectNearbyInteractables() {
  let closest = null;
  let minDist = 75;

  // 1. 市集商鋪
  MARKET_STALLS.forEach(stall => {
    const cx = stall.x + stall.width / 2;
    const cy = stall.y + stall.height / 2;
    const d = Math.hypot(game.player.x - cx, game.player.y - cy);
    if (d < minDist + 20 && d < minDist) {
      minDist = d;
      closest = { type: 'market', name: stall.name, x: cx, y: stall.y - 15, prompt: `🛒 走進 ${stall.name}` };
    }
  });

  // 2. 酒吧顧客
  const custSeat = TAVERN_ITEMS.customerSeat;
  const dCust = Math.hypot(game.player.x - custSeat.x, game.player.y - custSeat.y);
  if (dCust < minDist + 15) {
    minDist = dCust;
    const cust = CUSTOMERS[game.currentCustomerIndex];
    closest = { type: 'bartender', name: cust.name, x: custSeat.x, y: custSeat.y - 35, prompt: `✨ 招待 ${cust.name}（調酒）` };
  }

  // 3. 森林樹後寶箱
  FOREST_CHESTS.forEach(chest => {
    if (chest.opened) return;
    const d = Math.hypot(game.player.x - chest.x, game.player.y - chest.y);
    if (d < minDist) {
      minDist = d;
      closest = { type: 'chest', chest: chest, x: chest.x, y: chest.y - 25, prompt: `🎁 開啟 ${chest.name}` };
    }
  });

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
  if (target.type === 'market') {
    openMarketModal();
  } else if (target.type === 'bartender') {
    openBartenderModal();
  } else if (target.type === 'chest') {
    openTreasureChest(target.chest);
  }
}

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
    DOM.chestRewardPill.innerHTML = `<span>✨ 靈積分 +${reward.pts}</span><span>🪙 金幣 +${reward.gold}</span><span>📖 圖鑑已解鎖</span>`;
  } else {
    const item = INGREDIENTS[reward.itemId];
    game.inventory[reward.itemId] = (game.inventory[reward.itemId] || 0) + reward.count;
    game.collectedInCurrentRun[reward.itemId] = (game.collectedInCurrentRun[reward.itemId] || 0) + reward.count;

    DOM.chestRewardType.textContent = '💎 秘境珍稀原料';
    DOM.chestRewardTitle.textContent = `${item.icon} ${item.name} x${reward.count}`;
    DOM.chestRewardDesc.textContent = reward.desc;
    DOM.chestRewardPill.innerHTML = `<span>✨ 靈積分 +${reward.pts}</span><span>🪙 金幣 +${reward.gold}</span><span>🎒 已存入背包</span>`;
  }

  updateResourceDisplays();
  game.activeInteractable = null;
  DOM.proximityPrompt.classList.add('hidden');

  DOM.chestRewardModal.classList.remove('hidden');
}

DOM.closeChestBtn.addEventListener('click', () => {
  DOM.chestRewardModal.classList.add('hidden');
});

// ==================== 7. 2D 畫布世界渲染 ====================

function drawWorld() {
  worldCtx.clearRect(0, 0, DOM.worldCanvas.width, DOM.worldCanvas.height);

  worldCtx.save();
  worldCtx.translate(-game.camera.x, -game.camera.y);

  // 1. 繪製三區大地圖背景
  drawMapGround();

  // 2. 繪製市集店鋪
  drawMarketStalls();

  // 3. 繪製酒館溫馨吧台與壁爐
  drawTavernArea();

  // 4. 繪製森林隱藏寶箱（繪製在樹木底層）
  drawChests();

  // 5. 繪製主角調酒師與提燈光芒
  drawPlayer();

  // 6. 繪製森林大樹（樹幹與帶透明遮蔽的樹冠）
  drawForestTrees();

  worldCtx.restore();

  // 7. 繪製左上角奇幻星盤小地圖
  drawMinimap();
}

function drawMapGround() {
  // 左區：星光夜市（石板路、暖色微光）
  worldCtx.fillStyle = '#101322';
  worldCtx.fillRect(0, 0, ZONE_MARKET_MAX_X, WORLD_HEIGHT);
  // 石磚格線
  worldCtx.strokeStyle = 'rgba(230, 180, 80, 0.08)';
  worldCtx.lineWidth = 1;
  for (let x = 0; x < ZONE_MARKET_MAX_X; x += 55) {
    worldCtx.beginPath();
    worldCtx.moveTo(x, 0);
    worldCtx.lineTo(x, WORLD_HEIGHT);
    worldCtx.stroke();
  }

  // 中區：奇幻酒館（溫暖深木紋地、紫金地毯）
  worldCtx.fillStyle = '#1c152b';
  worldCtx.fillRect(ZONE_MARKET_MAX_X, 0, ZONE_TAVERN_MAX_X - ZONE_MARKET_MAX_X, WORLD_HEIGHT);
  worldCtx.fillStyle = 'rgba(165, 94, 234, 0.14)';
  worldCtx.fillRect(ZONE_MARKET_MAX_X + 80, 240, 940, 520);
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.4)';
  worldCtx.lineWidth = 2;
  worldCtx.strokeRect(ZONE_MARKET_MAX_X + 80, 240, 940, 520);

  // 右區：神祕迷霧古林（幽暗苔蘚泥地與幽綠草坪）
  const forestGrad = worldCtx.createLinearGradient(FOREST_START_X, 0, WORLD_WIDTH, 0);
  forestGrad.addColorStop(0, '#0c1a16');
  forestGrad.addColorStop(0.5, '#071512');
  forestGrad.addColorStop(1, '#030a08');
  worldCtx.fillStyle = forestGrad;
  worldCtx.fillRect(FOREST_START_X, 0, WORLD_WIDTH - FOREST_START_X, WORLD_HEIGHT);

  // 林間蜿蜒泥道小徑
  worldCtx.strokeStyle = 'rgba(40, 60, 45, 0.4)';
  worldCtx.lineWidth = 45;
  worldCtx.lineCap = 'round';
  worldCtx.beginPath();
  worldCtx.moveTo(FOREST_START_X, 540);
  worldCtx.quadraticCurveTo(2700, 500, 2900, 600);
  worldCtx.quadraticCurveTo(3150, 680, 3400, 450);
  worldCtx.stroke();
}

function drawMarketStalls() {
  MARKET_STALLS.forEach(stall => {
    // 陰影
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    worldCtx.fillRect(stall.x + 8, stall.y + 8, stall.width, stall.height);

    // 木造店鋪主體
    worldCtx.fillStyle = '#2c223b';
    worldCtx.fillRect(stall.x, stall.y, stall.width, stall.height);
    worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.7)';
    worldCtx.lineWidth = 2;
    worldCtx.strokeRect(stall.x, stall.y, stall.width, stall.height);

    // 遮陽布蓬
    worldCtx.fillStyle = '#b71540';
    worldCtx.fillRect(stall.x, stall.y, stall.width, 22);

    worldCtx.font = '28px serif';
    worldCtx.textAlign = 'center';
    worldCtx.fillText(stall.icon, stall.x + stall.width / 2, stall.y + 55);

    worldCtx.font = 'bold 12px sans-serif';
    worldCtx.fillStyle = '#f6c23e';
    worldCtx.fillText(stall.name, stall.x + stall.width / 2, stall.y + 80);
  });
}

function drawTavernArea() {
  const counter = TAVERN_ITEMS.counter;
  // 吧台木桌
  worldCtx.fillStyle = '#483424';
  worldCtx.fillRect(counter.x - counter.width / 2, counter.y, counter.width, counter.height);
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.85)';
  worldCtx.lineWidth = 2.5;
  worldCtx.strokeRect(counter.x - counter.width / 2, counter.y, counter.width, counter.height);

  worldCtx.font = '26px serif';
  worldCtx.textAlign = 'center';
  worldCtx.fillText('🍸', counter.x, counter.y + 40);

  worldCtx.font = 'bold 13px sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.fillText('★ 琉璃調酒操作工坊 ★', counter.x, counter.y + 64);

  // 顧客座位席
  const seat = TAVERN_ITEMS.customerSeat;
  const cust = CUSTOMERS[game.currentCustomerIndex];

  worldCtx.strokeStyle = 'rgba(165, 94, 234, 0.8)';
  worldCtx.lineWidth = 2;
  worldCtx.beginPath();
  worldCtx.arc(seat.x, seat.y, seat.radius, 0, Math.PI * 2);
  worldCtx.stroke();

  worldCtx.font = '32px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText(cust.avatar, seat.x, seat.y);

  worldCtx.font = 'bold 12px sans-serif';
  worldCtx.fillStyle = '#fff';
  worldCtx.fillText(cust.name, seat.x, seat.y - 32);
}

function drawChests() {
  FOREST_CHESTS.forEach(chest => {
    // 若未開啟，散發金色靈氣
    if (!chest.opened) {
      const grad = worldCtx.createRadialGradient(chest.x, chest.y, 4, chest.x, chest.y, 35);
      grad.addColorStop(0, 'rgba(246, 194, 62, 0.6)');
      grad.addColorStop(1, 'rgba(246, 194, 62, 0)');
      worldCtx.fillStyle = grad;
      worldCtx.beginPath();
      worldCtx.arc(chest.x, chest.y, 35, 0, Math.PI * 2);
      worldCtx.fill();
    }

    worldCtx.font = '28px serif';
    worldCtx.textAlign = 'center';
    worldCtx.textBaseline = 'middle';
    worldCtx.fillText(chest.opened ? '📭' : '🎁', chest.x, chest.y);

    worldCtx.font = '11px sans-serif';
    worldCtx.fillStyle = chest.opened ? '#888' : '#f6c23e';
    worldCtx.fillText(chest.name, chest.x, chest.y + 22);
  });
}

function drawPlayer() {
  const p = game.player;
  const bobY = Math.sin(p.walkAnimTime) * 3;

  // 1. 調酒提燈扇形光錐（照亮前方的探索感）
  worldCtx.save();
  const coneDist = 110;
  const coneAngle = Math.PI / 3.5;
  const lightGrad = worldCtx.createRadialGradient(p.x, p.y, 10, p.x, p.y, coneDist);
  lightGrad.addColorStop(0, 'rgba(246, 194, 62, 0.35)');
  lightGrad.addColorStop(0.7, 'rgba(246, 194, 62, 0.12)');
  lightGrad.addColorStop(1, 'rgba(246, 194, 62, 0)');

  worldCtx.fillStyle = lightGrad;
  worldCtx.beginPath();
  worldCtx.moveTo(p.x, p.y);
  worldCtx.arc(p.x, p.y, coneDist, p.angle - coneAngle / 2, p.angle + coneAngle / 2);
  worldCtx.closePath();
  worldCtx.fill();
  worldCtx.restore();

  // 2. 引路小精靈（螢火伴星）
  worldCtx.fillStyle = 'rgba(0, 210, 211, 0.85)';
  worldCtx.shadowColor = '#00d2d3';
  worldCtx.shadowBlur = 12;
  worldCtx.beginPath();
  worldCtx.arc(p.fairyX, p.fairyY, 4, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.shadowBlur = 0;

  // 3. 主角腳底光影
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  worldCtx.beginPath();
  worldCtx.ellipse(p.x, p.y + 14, 15, 7, 0, 0, Math.PI * 2);
  worldCtx.fill();

  // 4. 調酒師主體（酒紅背心 + 白襯衫領結）
  worldCtx.fillStyle = '#800c2a'; // 酒紅背心
  worldCtx.beginPath();
  worldCtx.arc(p.x, p.y + bobY, 15, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.strokeStyle = '#f6c23e';
  worldCtx.lineWidth = 1.8;
  worldCtx.stroke();

  // 白圍裙領口裝飾
  worldCtx.fillStyle = '#ffffff';
  worldCtx.fillRect(p.x - 4, p.y + bobY - 10, 8, 9);

  // 調酒師手持提燈手柄
  const lanternX = p.x + Math.cos(p.angle + 0.5) * 18;
  const lanternY = p.y + bobY + Math.sin(p.angle + 0.5) * 18;
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.beginPath();
  worldCtx.arc(lanternX, lanternY, 4, 0, Math.PI * 2);
  worldCtx.fill();

  // 調酒師帽子/頭像
  worldCtx.font = '22px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText('🧙‍♂️', p.x, p.y + bobY - 2);

  // 原創頭頂名牌
  worldCtx.fillStyle = 'rgba(20, 16, 30, 0.85)';
  worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.5)';
  worldCtx.lineWidth = 1;
  worldCtx.fillRect(p.x - 45, p.y - 42, 90, 18);
  worldCtx.strokeRect(p.x - 45, p.y - 42, 90, 18);

  worldCtx.fillStyle = '#f6c23e';
  worldCtx.font = 'bold 10px sans-serif';
  worldCtx.fillText('★ 秘境調酒師', p.x, p.y - 30);
}

// 繪製森林大樹（樹幹物理阻擋 + 樹冠動態半透明遮擋）
function drawForestTrees() {
  FOREST_TREES.forEach(tree => {
    worldCtx.save();
    worldCtx.globalAlpha = tree.currentAlpha;

    // 樹根陰影
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    worldCtx.beginPath();
    worldCtx.ellipse(tree.x, tree.y + tree.trunkR, tree.crownR * 0.9, tree.crownR * 0.4, 0, 0, Math.PI * 2);
    worldCtx.fill();

    // 粗壯古木樹幹
    worldCtx.fillStyle = '#3a2818';
    worldCtx.beginPath();
    worldCtx.arc(tree.x, tree.y, tree.trunkR, 0, Math.PI * 2);
    worldCtx.fill();
    worldCtx.strokeStyle = '#221509';
    worldCtx.lineWidth = 2;
    worldCtx.stroke();

    // 繁茂奇幻樹冠（帶有翠綠微光）
    const crownY = tree.y - 25;
    const treeGrad = worldCtx.createRadialGradient(tree.x, crownY, 10, tree.x, crownY, tree.crownR);
    treeGrad.addColorStop(0, '#10ac84');
    treeGrad.addColorStop(0.7, '#075341');
    treeGrad.addColorStop(1, '#032a21');

    worldCtx.fillStyle = treeGrad;
    worldCtx.beginPath();
    worldCtx.arc(tree.x, crownY, tree.crownR, 0, Math.PI * 2);
    worldCtx.fill();

    worldCtx.strokeStyle = 'rgba(29, 209, 161, 0.35)';
    worldCtx.lineWidth = 2.5;
    worldCtx.stroke();

    // 樹冠上的微光靈菇裝飾
    worldCtx.fillStyle = 'rgba(246, 194, 62, 0.7)';
    worldCtx.beginPath();
    worldCtx.arc(tree.x - 18, crownY - 12, 3, 0, Math.PI * 2);
    worldCtx.arc(tree.x + 22, crownY + 8, 3.5, 0, Math.PI * 2);
    worldCtx.fill();

    worldCtx.restore();
  });
}

function drawMinimap() {
  const mw = DOM.minimapCanvas.width;
  const mh = DOM.minimapCanvas.height;

  minimapCtx.clearRect(0, 0, mw, mh);

  // 三區底色
  minimapCtx.fillStyle = '#101322';
  minimapCtx.fillRect(0, 0, mw * (ZONE_MARKET_MAX_X / WORLD_WIDTH), mh);

  minimapCtx.fillStyle = '#2c223b';
  minimapCtx.fillRect(mw * (ZONE_MARKET_MAX_X / WORLD_WIDTH), 0, mw * ((ZONE_TAVERN_MAX_X - ZONE_MARKET_MAX_X) / WORLD_WIDTH), mh);

  minimapCtx.fillStyle = '#071512';
  minimapCtx.fillRect(mw * (ZONE_TAVERN_MAX_X / WORLD_WIDTH), 0, mw * (1 - ZONE_TAVERN_MAX_X / WORLD_WIDTH), mh);

  // 寶箱位置（未開啟顯示小金點）
  FOREST_CHESTS.forEach(c => {
    if (!c.opened) {
      minimapCtx.fillStyle = '#f6c23e';
      minimapCtx.fillRect((c.x / WORLD_WIDTH) * mw - 1, (c.y / WORLD_HEIGHT) * mh - 1, 2.5, 2.5);
    }
  });

  // 主角位置
  const px = (game.player.x / WORLD_WIDTH) * mw;
  const py = (game.player.y / WORLD_HEIGHT) * mh;
  minimapCtx.fillStyle = '#ff7979';
  minimapCtx.beginPath();
  minimapCtx.arc(px, py, 3, 0, Math.PI * 2);
  minimapCtx.fill();
}

// ==================== 8. 市集與調酒系統 ====================

function updateResourceDisplays() {
  DOM.goldDisplay.textContent = game.gold;
  DOM.repDisplay.textContent = game.reputation;
  DOM.pointsDisplay.textContent = game.points;
}

function openMarketModal() {
  DOM.marketGrid.innerHTML = '';
  Object.values(INGREDIENTS).forEach(item => {
    if (item.forestOnly) return;
    const isLocked = game.reputation < item.repReq;
    const canAfford = game.gold >= item.price && !isLocked;
    const stock = game.inventory[item.id] || 0;

    const card = document.createElement('div');
    card.className = 'market-card';

    const tagsHtml = Object.entries(item.flavors)
      .filter(([_, val]) => val > 0)
      .map(([flv, val]) => `<span class="mtag">${flv}+${val}</span>`).join(' ');

    card.innerHTML = `
      <div class="market-card-top">
        <div class="market-card-icon">${item.icon}</div>
        <div class="market-card-info">
          <h4>${item.name}</h4>
          <div class="market-tags">${tagsHtml}</div>
        </div>
      </div>
      <p style="font-size:0.75rem;color:var(--text-parchment);">${item.desc}</p>
      <div class="market-card-bottom">
        <div>
          <strong style="color:var(--amber-gold);font-size:0.9rem;">🪙 ${item.price}</strong>
          <span style="font-size:0.72rem;color:var(--crystal-cyan);margin-left:6px;">庫存: ${stock}</span>
        </div>
        <button class="fantasy-btn primary-glow" style="padding:4px 10px;font-size:0.78rem;" ${canAfford ? '' : 'disabled'} onclick="buyMarketItem('${item.id}')">
          ${isLocked ? `需聲望${item.repReq}` : '購買 +1'}
        </button>
      </div>
    `;
    DOM.marketGrid.appendChild(card);
  });
  DOM.marketModal.classList.remove('hidden');
}

window.buyMarketItem = function(id) {
  const item = INGREDIENTS[id];
  if (!item || game.gold < item.price || game.reputation < item.repReq) return;
  game.gold -= item.price;
  game.inventory[id] = (game.inventory[id] || 0) + 1;
  window.soundEngine.playCoinSound();
  updateResourceDisplays();
  openMarketModal();
};

DOM.closeMarketBtn.addEventListener('click', () => DOM.marketModal.classList.add('hidden'));

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

// 調酒評分與結算
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
  const baseGold = 25 + Math.round(totalVol * 0.2);
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

// ==================== 9. 主遊戲循環 ====================

function gameLoop() {
  updatePlayer();
  drawWorld();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', () => {
  updateResourceDisplays();
  requestAnimationFrame(gameLoop);
});
