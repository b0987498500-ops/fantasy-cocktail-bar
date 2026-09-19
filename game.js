/**
 * 奇幻調酒館 (Fantasy Bartender) - 2D 俯視自由走動冒險引擎
 * 支援：WASD / 滑鼠點航 / 虛擬搖桿、三區無縫大地圖、鏡頭平滑跟隨、迷霧防迷路機制、
 * 調酒工作台 Canvas 液體分層渲染、NPC 互動與三元經濟閉環。
 */

// ==================== 1. 原料與資料定義 ====================

const INGREDIENTS = {
  moon_syrup: {
    id: 'moon_syrup',
    name: '月光糖漿',
    icon: '🌙',
    price: 15,
    repReq: 0,
    color: '#f6e58d',
    flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 },
    desc: '月圓之夜採集的甘露，入口溫潤綿長。'
  },
  dawn_water: {
    id: 'dawn_water',
    name: '晨露純水',
    icon: '💧',
    price: 10,
    repReq: 0,
    color: '#7ed6df',
    flavors: { sweet: 1, sour: 2, spirit: 0, magic: 0, spicy: 0 },
    desc: '清晨自精靈花苞採集的水滴，微酸清新。'
  },
  abyss_rum: {
    id: 'abyss_rum',
    name: '深淵烈酒',
    icon: '🔥',
    price: 25,
    repReq: 0,
    color: '#e056fd',
    flavors: { sweet: 0, sour: 0, spirit: 3, magic: 1, spicy: 1 },
    desc: '蘊含地下熔岩熱力的烈酒，微醺狂野。'
  },
  star_fruit: {
    id: 'star_fruit',
    name: '星輝果萃',
    icon: '✨',
    price: 20,
    repReq: 10,
    color: '#ffbe76',
    flavors: { sweet: 2, sour: 2, spirit: 0, magic: 2, spicy: 0 },
    desc: '閃爍星芒的果實精華，為酒液注入流光。'
  },
  frost_mint: {
    id: 'frost_mint',
    name: '極地薄荷霜',
    icon: '🌿',
    price: 30,
    repReq: 25,
    color: '#686de0',
    flavors: { sweet: 0, sour: 3, spirit: 1, magic: 1, spicy: 0 },
    desc: '極北冰原的薄荷霜凝，沁涼透骨。'
  },
  dragon_chili: {
    id: 'dragon_chili',
    name: '巨龍朝天椒',
    icon: '🌶️',
    price: 45,
    repReq: 40,
    color: '#ff4757',
    flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 },
    desc: '幼龍吐息烤炙的辣椒，在喉中引爆辛香。'
  },
  glowing_shroom: {
    id: 'glowing_shroom',
    name: '夜光幽魂菇',
    icon: '🍄',
    price: 0,
    forestOnly: true,
    repReq: 0,
    color: '#2ed573',
    flavors: { sweet: 0, sour: 1, spirit: 1, magic: 4, spicy: 0 },
    desc: '森林幽暗處生長的奇異菌菇，散發翠綠幻光。'
  },
  fairy_tear: {
    id: 'fairy_tear',
    name: '妖精之淚',
    icon: '💎',
    price: 0,
    forestOnly: true,
    repReq: 0,
    color: '#38ada9',
    flavors: { sweet: 3, sour: 1, spirit: 0, magic: 4, spicy: 0 },
    desc: '森林妖精喜極而泣時落下的靈液，極度稀有。'
  },
  phoenix_ember: {
    id: 'phoenix_ember',
    name: '不死鳥餘燼',
    icon: '🪶',
    price: 0,
    forestOnly: true,
    repReq: 0,
    color: '#ff6348',
    flavors: { sweet: 1, sour: 0, spirit: 3, magic: 3, spicy: 3 },
    desc: '神獸棲息處殘留的火羽殘燼，擁有不熄熱度。'
  }
};

const CUSTOMERS = [
  {
    id: 'elven_scholar',
    name: '精靈學者 艾爾文',
    avatar: '🧝‍♀️',
    badge: '精靈學者',
    quote: '「旅途勞頓，我想要一杯帶有甘甜微光的治癒之酒，若有些許魔幻層次更好...」',
    preferred: { sweet: 3, magic: 2 },
    tipBonus: 1.2
  },
  {
    id: 'dwarf_warrior',
    name: '矮人戰士 布隆',
    avatar: '🧔‍♂️',
    badge: '矮人鐵衛',
    quote: '「剛從礦坑出來滿喉灰塵！快給我來杯最烈、最夠勁、火辣辣的硬漢特飲！」',
    preferred: { spirit: 3, spicy: 2 },
    tipBonus: 1.3
  },
  {
    id: 'shadow_ranger',
    name: '暗影遊俠 薇拉',
    avatar: '🧕',
    badge: '暗夜斥候',
    quote: '「今晚需要保持敏銳。請調一杯酸爽刺激、透著神祕魔力的高冷之釀。」',
    preferred: { sour: 3, magic: 2 },
    tipBonus: 1.15
  },
  {
    id: 'mage_apprentice',
    name: '鍊金學徒 諾亞',
    avatar: '🧑‍🔬',
    badge: '鍊金術士',
    quote: '「導師讓我考察不同魔力液體的分層結構！我要一杯魔幻感爆棚、層次分明的藝術品！」',
    preferred: { magic: 4, sweet: 1 },
    tipBonus: 1.25
  },
  {
    id: 'bard_lucas',
    name: '吟遊詩人 盧卡斯',
    avatar: '🪕',
    badge: '流浪歌者',
    quote: '「靈感如泉湧！想要一杯甜如情話、微醺似初戀的美酒，激發我寫下新歌謠！」',
    preferred: { sweet: 2, spirit: 2 },
    tipBonus: 1.1
  }
];

const RECIPES_CATALOG = [
  { name: '極光之夜', requirement: '魔幻值 ≥ 5 且至少 2 層分層', tags: '魔幻 / 漸層', icon: '🌌' },
  { name: '熔岩心跳', requirement: '烈度 ≥ 4 且 辛辣 ≥ 3', tags: '烈焰 / 辛香', icon: '🌋' },
  { name: '月影甘泉', requirement: '甘甜 ≥ 5 且 酸爽 ≥ 2', tags: '甘美 / 清爽', icon: '🌙' },
  { name: '幽谷幻精靈', requirement: '含有夜光幽魂菇 或 妖精之淚', tags: '秘傳 / 靈力', icon: '🧚‍♀️' },
  { name: '星空詠嘆調', requirement: '含有星輝果萃，總容量達 90ml 以上', tags: '流光 / 奢華', icon: '✨' },
  { name: '冒險家特飲', requirement: '任一混調出品之基礎特飲', tags: '常規 / 家常', icon: '🍹' }
];

// ==================== 2. 世界常數與地圖規格 ====================

const WORLD_WIDTH = 3600;
const WORLD_HEIGHT = 1000;

// 區域邊界
const ZONE_MARKET_MAX_X = 1150;
const ZONE_TAVERN_MAX_X = 2350;
// 森林防迷路閾值
const FOREST_START_X = 2350;
const FOREST_WARN_X = 2800;
const FOREST_DANGER_X = 3200;
const FOREST_LOST_X = 3550;

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

    // 森林單次探索採集記錄（防迷路遺失用）
    this.collectedInCurrentRun = {};
    this.heartbeatTimer = null;

    // 顧客與酒譜
    this.currentCustomerIndex = 0;
    this.unlockedRecipes = new Set(['冒險家特飲']);

    // 調酒台
    this.glassCapacity = 100;
    this.glassLayers = [];
    this.selectedIngredient = null;
    this.isPouring = false;
    this.pourTimer = null;

    // 主角狀態
    this.player = {
      x: 1750, // 初始在酒吧中央
      y: 550,
      radius: 20,
      speed: 3.6,
      sprintSpeed: 6.2,
      isSprinting: false,
      angle: 0,
      walkAnimTime: 0,
      targetX: null,
      targetY: null
    };

    // 鏡頭
    this.camera = { x: 0, y: 0 };

    // 輸入狀態
    this.keys = {
      w: false, a: false, s: false, d: false,
      ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false,
      Shift: false, j: false, ' ': false
    };

    // 虛擬搖桿輸入向量
    this.joystickVector = { x: 0, y: 0 };

    // 最近可交互物件
    this.activeInteractable = null;
  }
}

const game = new GameState();

// ==================== 4. 地圖實體（建築、NPC、採集點、裝飾） ====================

const mapEntities = {
  // 市集店鋪
  marketStalls: [
    { id: 'stall_syrup', name: '星光調飲原料行', icon: '🏪', x: 450, y: 380, width: 140, height: 100, interactType: 'market' },
    { id: 'stall_magic', name: '鍊金奇物雜貨鋪', icon: '🔮', x: 800, y: 380, width: 140, height: 100, interactType: 'market' }
  ],
  // 酒吧核心實體
  tavernItems: [
    { id: 'bar_counter', name: '調酒操作吧台', icon: '🍸', x: 1750, y: 360, width: 220, height: 70, interactType: 'bartender' },
    { id: 'customer_seat', name: '顧客席', icon: '🧝‍♀️', x: 1750, y: 440, radius: 24, interactType: 'bartender' }
  ],
  // 森林採集點與寶箱（動態分佈）
  gatherNodes: [
    { id: 'g_shroom_1', type: 'item', itemId: 'glowing_shroom', name: '夜光幽魂菇', icon: '🍄', x: 2600, y: 400, radius: 20, gathered: false },
    { id: 'g_tear_1', type: 'item', itemId: 'fairy_tear', name: '妖精之淚靈泉', icon: '💎', x: 2850, y: 650, radius: 20, gathered: false },
    { id: 'g_chest_1', type: 'chest', gold: 50, name: '林間遠古寶箱', icon: '🎁', x: 3100, y: 350, radius: 22, gathered: false },
    { id: 'g_chili_1', type: 'item', itemId: 'dragon_chili', name: '赤焰辣椒叢', icon: '🌶️', x: 3350, y: 600, radius: 20, gathered: false },
    { id: 'g_chest_2', type: 'chest', gold: 80, name: '迷霧深處密寶', icon: '🎁', x: 3480, y: 450, radius: 22, gathered: false }
  ],
  // 路燈
  streetLights: [
    { x: 300, y: 550 }, { x: 600, y: 550 }, { x: 950, y: 550 },
    { x: 1350, y: 550 }, { x: 1750, y: 580 }, { x: 2150, y: 550 },
    { x: 2500, y: 550 }, { x: 2800, y: 550 }, { x: 3100, y: 550 }
  ],
  // 環境奇幻螢火蟲
  fireflies: Array.from({ length: 45 }, () => ({
    x: Math.random() * WORLD_WIDTH,
    y: Math.random() * WORLD_HEIGHT,
    size: 1.5 + Math.random() * 2.5,
    speedX: (Math.random() - 0.5) * 0.8,
    speedY: (Math.random() - 0.5) * 0.8,
    glow: Math.random() * Math.PI * 2
  }))
};

// ==================== 5. DOM 元素快取 ====================

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

  // 觸控虛擬搖桿
  joystickZone: document.getElementById('joystick-zone'),
  joystickBase: document.getElementById('joystick-base'),
  joystickStick: document.getElementById('joystick-stick'),
  touchSprintBtn: document.getElementById('touch-sprint-btn'),
  touchInteractBtn: document.getElementById('touch-interact-btn'),

  // 模態彈窗
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

// ==================== 6. 視窗尺寸自適應 ====================

function resizeCanvases() {
  DOM.worldCanvas.width = window.innerWidth;
  DOM.worldCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// ==================== 7. 輸入系統（鍵盤、滑鼠點擊、虛擬搖桿） ====================

window.addEventListener('keydown', (e) => {
  if (game.keys.hasOwnProperty(e.key)) {
    game.keys[e.key] = true;
  }
  if (e.key === 'j' || e.key === 'J' || e.key === 'Shift') {
    game.player.isSprinting = true;
  }
  if (e.key === ' ' || e.code === 'Space') {
    e.preventDefault();
    triggerActiveInteraction();
  }
});

window.addEventListener('keyup', (e) => {
  if (game.keys.hasOwnProperty(e.key)) {
    game.keys[e.key] = false;
  }
  if (!game.keys.j && !game.keys.Shift) {
    game.player.isSprinting = false;
  }
});

// 滑鼠點擊地面導航移動
DOM.worldCanvas.addEventListener('click', (e) => {
  // 若點擊的是 UI 彈窗則不干擾
  if (isAnyModalOpen()) return;

  const rect = DOM.worldCanvas.getBoundingClientRect();
  const clickScreenX = e.clientX - rect.left;
  const clickScreenY = e.clientY - rect.top;

  // 轉換成世界座標
  game.player.targetX = clickScreenX + game.camera.x;
  game.player.targetY = clickScreenY + game.camera.y;
});

// 虛擬搖桿拖拽事件
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
const maxJoystickRadius = 40;

function handleJoystickStart(clientX, clientY) {
  joystickActive = true;
  const rect = DOM.joystickBase.getBoundingClientRect();
  joystickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
  handleJoystickMove(clientX, clientY);
}

function handleJoystickMove(clientX, clientY) {
  if (!joystickActive) return;

  const dx = clientX - joystickCenter.x;
  const dy = clientY - joystickCenter.y;
  const dist = Math.hypot(dx, dy);

  let clampDist = Math.min(dist, maxJoystickRadius);
  let angle = Math.atan2(dy, dx);

  const stickX = Math.cos(angle) * clampDist;
  const stickY = Math.sin(angle) * clampDist;

  DOM.joystickStick.style.transform = `translate(${stickX}px, ${stickY}px)`;

  // 歸一化輸出向量
  game.joystickVector.x = stickX / maxJoystickRadius;
  game.joystickVector.y = stickY / maxJoystickRadius;

  // 搖桿移動時取消滑鼠點擊目標
  game.player.targetX = null;
  game.player.targetY = null;
}

function handleJoystickEnd() {
  joystickActive = false;
  DOM.joystickStick.style.transform = `translate(0px, 0px)`;
  game.joystickVector.x = 0;
  game.joystickVector.y = 0;
}

DOM.joystickZone.addEventListener('mousedown', (e) => handleJoystickStart(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => { if (joystickActive) handleJoystickMove(e.clientX, e.clientY); });
window.addEventListener('mouseup', handleJoystickEnd);

DOM.joystickZone.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) handleJoystickStart(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchmove', (e) => {
  if (joystickActive && e.touches.length > 0) handleJoystickMove(e.touches[0].clientX, e.touches[0].clientY);
});
window.addEventListener('touchend', handleJoystickEnd);
window.addEventListener('touchcancel', handleJoystickEnd);

// 右下角觸控按鈕
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
         !DOM.recipeBookModal.classList.contains('hidden');
}

// ==================== 8. 物理更新與鏡頭跟隨 ====================

function updatePlayer() {
  if (isAnyModalOpen()) return;

  let moveX = 0;
  let moveY = 0;

  // 1. 鍵盤輸入
  if (game.keys.w || game.keys.ArrowUp) moveY -= 1;
  if (game.keys.s || game.keys.ArrowDown) moveY += 1;
  if (game.keys.a || game.keys.ArrowLeft) moveX -= 1;
  if (game.keys.d || game.keys.ArrowRight) moveX += 1;

  // 2. 搖桿輸入覆蓋
  if (Math.hypot(game.joystickVector.x, game.joystickVector.y) > 0.1) {
    moveX = game.joystickVector.x;
    moveY = game.joystickVector.y;
  }

  // 3. 滑鼠尋路導航
  if (game.player.targetX !== null && game.player.targetY !== null && moveX === 0 && moveY === 0) {
    const tdx = game.player.targetX - game.player.x;
    const tdy = game.player.targetY - game.player.y;
    const tdist = Math.hypot(tdx, tdy);

    if (tdist > 8) {
      moveX = tdx / tdist;
      moveY = tdy / tdist;
    } else {
      game.player.targetX = null;
      game.player.targetY = null;
    }
  }

  // 計算實際速度
  const curSpeed = game.player.isSprinting ? game.player.sprintSpeed : game.player.speed;
  const moveMag = Math.hypot(moveX, moveY);

  if (moveMag > 0.05) {
    const nx = moveX / (moveMag > 1 ? moveMag : 1);
    const ny = moveY / (moveMag > 1 ? moveMag : 1);

    game.player.x += nx * curSpeed;
    game.player.y += ny * curSpeed;
    game.player.angle = Math.atan2(ny, nx);
    game.player.walkAnimTime += 0.18;
  }

  // 世界邊界拘束
  game.player.x = Math.max(game.player.radius, Math.min(WORLD_WIDTH - game.player.radius, game.player.x));
  game.player.y = Math.max(120, Math.min(WORLD_HEIGHT - 80, game.player.y));

  // 鏡頭平滑居中跟隨
  const targetCamX = game.player.x - DOM.worldCanvas.width / 2;
  const targetCamY = game.player.y - DOM.worldCanvas.height / 2;
  game.camera.x += (targetCamX - game.camera.x) * 0.1;
  game.camera.y += (targetCamY - game.camera.y) * 0.1;

  // 限制鏡頭邊界
  const maxCamX = Math.max(0, WORLD_WIDTH - DOM.worldCanvas.width);
  const maxCamY = Math.max(0, WORLD_HEIGHT - DOM.worldCanvas.height);
  game.camera.x = Math.max(0, Math.min(maxCamX, game.camera.x));
  game.camera.y = Math.max(0, Math.min(maxCamY, game.camera.y));

  // 更新當前區域標籤
  updateZoneTag();

  // 檢測森林防迷路機制
  updateForestFogMechanic();

  // 檢測身邊最近可交互實體
  detectNearbyInteractables();
}

// 區域名稱提示
function updateZoneTag() {
  if (game.player.x < ZONE_MARKET_MAX_X) {
    DOM.currentZoneName.textContent = '🛒 星光市集・熱鬧大街';
    DOM.forestDangerHud.classList.add('hidden');
  } else if (game.player.x < ZONE_TAVERN_MAX_X) {
    DOM.currentZoneName.textContent = '🏠 奇幻酒吧・主營業廳';
    DOM.forestDangerHud.classList.add('hidden');
  } else {
    DOM.currentZoneName.textContent = '🌲 神祕迷霧森林';
    DOM.forestDangerHud.classList.remove('hidden');
  }
}

// 森林防迷路心跳與迷霧收窄機制
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
    DOM.dangerStatusBadge.textContent = '安全探索';
    DOM.dangerStatusBadge.className = 'badge-safe';
    DOM.mistVignette.style.opacity = `${(distInForest / (FOREST_WARN_X - FOREST_START_X)) * 0.4}`;
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
  } else if (game.player.x < FOREST_DANGER_X) {
    DOM.dangerStatusBadge.textContent = '起霧警戒！';
    DOM.dangerStatusBadge.className = 'badge-warning';
    DOM.mistVignette.classList.add('danger');
    DOM.mistVignette.classList.remove('extreme');
    startHeartbeat(2000, 0.35);
  } else if (game.player.x < FOREST_LOST_X) {
    DOM.dangerStatusBadge.textContent = '⚠️ 極度危險！即將迷失';
    DOM.dangerStatusBadge.className = 'badge-danger';
    DOM.mistVignette.classList.remove('danger');
    DOM.mistVignette.classList.add('extreme');
    startHeartbeat(1000, 0.7);
  } else {
    // 超越極限邊界 ➜ 觸發迷失強制遣返
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

  // 遺失本次在森林採集之 50% 物品
  Object.keys(game.collectedInCurrentRun).forEach(id => {
    const lostCount = Math.ceil(game.collectedInCurrentRun[id] / 2);
    game.inventory[id] = Math.max(0, (game.inventory[id] || 0) - lostCount);
  });
  game.collectedInCurrentRun = {};

  // 強制瞬移回酒吧吧台前
  game.player.x = 1750;
  game.player.y = 520;
  game.player.targetX = null;
  game.player.targetY = null;

  updateResourceDisplays();

  setTimeout(() => {
    DOM.lostAlertBanner.classList.remove('show');
  }, 3600);
}

// 檢測身邊最近的可互動實體
function detectNearbyInteractables() {
  let closest = null;
  let minDist = 75; // 觸發距離閾值

  // 1. 檢測市集店鋪
  mapEntities.marketStalls.forEach(stall => {
    const cx = stall.x + stall.width / 2;
    const cy = stall.y + stall.height / 2;
    const d = Math.hypot(game.player.x - cx, game.player.y - cy);
    if (d < minDist + 20 && d < minDist) {
      minDist = d;
      closest = { type: 'market', name: stall.name, x: cx, y: stall.y - 15, prompt: '🛒 進入市集商販' };
    }
  });

  // 2. 檢測酒吧調酒台與顧客席
  const custSeat = mapEntities.tavernItems.find(i => i.id === 'customer_seat');
  if (custSeat) {
    const d = Math.hypot(game.player.x - custSeat.x, game.player.y - custSeat.y);
    if (d < minDist + 15) {
      minDist = d;
      const cust = CUSTOMERS[game.currentCustomerIndex];
      closest = { type: 'bartender', name: cust.name, x: custSeat.x, y: custSeat.y - 35, prompt: `✨ 招待 ${cust.name}（調酒）` };
    }
  }

  // 3. 檢測森林採集點與寶箱
  mapEntities.gatherNodes.forEach(node => {
    if (node.gathered) return;
    const d = Math.hypot(game.player.x - node.x, game.player.y - node.y);
    if (d < minDist) {
      minDist = d;
      const promptText = node.type === 'chest' ? `🎁 開啟 ${node.name}` : `🌿 採集 ${node.name}`;
      closest = { type: 'gather', node: node, x: node.x, y: node.y - 25, prompt: promptText };
    }
  });

  game.activeInteractable = closest;

  // 更新互動浮標位置與文字
  if (closest) {
    const screenX = closest.x - game.camera.x;
    const screenY = closest.y - game.camera.y;

    DOM.proximityPrompt.style.left = `${screenX}px`;
    DOM.proximityPrompt.style.top = `${screenY}px`;
    DOM.promptActionText.textContent = closest.prompt;
    DOM.proximityPrompt.classList.remove('hidden');
  } else {
    DOM.proximityPrompt.classList.add('hidden');
  }
}

// 觸發目前鎖定的交互
function triggerActiveInteraction() {
  if (!game.activeInteractable) return;

  const target = game.activeInteractable;
  if (target.type === 'market') {
    openMarketModal();
  } else if (target.type === 'bartender') {
    openBartenderModal();
  } else if (target.type === 'gather') {
    const node = target.node;
    node.gathered = true;

    if (node.type === 'chest') {
      game.gold += node.gold;
      game.points += 8;
      window.soundEngine.playCoinSound();
    } else {
      game.inventory[node.itemId] = (game.inventory[node.itemId] || 0) + 1;
      game.collectedInCurrentRun[node.itemId] = (game.collectedInCurrentRun[node.itemId] || 0) + 1;
      window.soundEngine.playGatherSound();
    }
    updateResourceDisplays();
    game.activeInteractable = null;
    DOM.proximityPrompt.classList.add('hidden');
  }
}

// ==================== 9. 2D 畫布世界渲染 ====================

function drawWorld() {
  worldCtx.clearRect(0, 0, DOM.worldCanvas.width, DOM.worldCanvas.height);

  worldCtx.save();
  worldCtx.translate(-game.camera.x, -game.camera.y);

  // 1. 繪製三區地面底色與紋理
  drawGround();

  // 2. 繪製道路與路燈光暈
  drawRoadsAndLighting();

  // 3. 繪製建築與攤位
  drawStructures();

  // 4. 繪製採集點與寶箱
  drawGatherNodes();

  // 5. 繪製顧客 NPC
  drawCustomers();

  // 6. 繪製環境飄動螢火蟲粒子
  drawFireflies();

  // 7. 繪製調酒師主角
  drawPlayer();

  worldCtx.restore();

  // 8. 繪製小地圖雷達
  drawMinimap();
}

function drawGround() {
  // 左區：星光市集 (青灰石板地)
  worldCtx.fillStyle = '#111424';
  worldCtx.fillRect(0, 0, ZONE_MARKET_MAX_X, WORLD_HEIGHT);
  // 石板格線微紋理
  worldCtx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  worldCtx.lineWidth = 1;
  for (let x = 0; x < ZONE_MARKET_MAX_X; x += 60) {
    worldCtx.beginPath();
    worldCtx.moveTo(x, 0);
    worldCtx.lineTo(x, WORLD_HEIGHT);
    worldCtx.stroke();
  }

  // 中區：奇幻酒吧 (溫暖深木紋地板)
  worldCtx.fillStyle = '#19152b';
  worldCtx.fillRect(ZONE_MARKET_MAX_X, 0, ZONE_TAVERN_MAX_X - ZONE_MARKET_MAX_X, WORLD_HEIGHT);
  // 酒吧地毯
  worldCtx.fillStyle = 'rgba(165, 94, 234, 0.12)';
  worldCtx.fillRect(ZONE_MARKET_MAX_X + 100, 260, 1000, 480);
  worldCtx.strokeStyle = 'rgba(249, 202, 36, 0.3)';
  worldCtx.strokeRect(ZONE_MARKET_MAX_X + 100, 260, 1000, 480);

  // 右區：神祕森林 (幽暗苔蘚草地)
  const forestGrad = worldCtx.createLinearGradient(ZONE_TAVERN_MAX_X, 0, WORLD_WIDTH, 0);
  forestGrad.addColorStop(0, '#0c1b18');
  forestGrad.addColorStop(0.5, '#071513');
  forestGrad.addColorStop(1, '#030a08');
  worldCtx.fillStyle = forestGrad;
  worldCtx.fillRect(ZONE_TAVERN_MAX_X, 0, WORLD_WIDTH - ZONE_TAVERN_MAX_X, WORLD_HEIGHT);

  // 森林奇幻樹木背景裝飾
  for (let fx = ZONE_TAVERN_MAX_X + 80; fx < WORLD_WIDTH; fx += 140) {
    worldCtx.fillStyle = 'rgba(16, 172, 132, 0.15)';
    worldCtx.beginPath();
    worldCtx.arc(fx, 180 + ((fx * 13) % 120), 55, 0, Math.PI * 2);
    worldCtx.fill();
    worldCtx.beginPath();
    worldCtx.arc(fx, 820 - ((fx * 7) % 100), 50, 0, Math.PI * 2);
    worldCtx.fill();
  }
}

function drawRoadsAndLighting() {
  // 貫穿三區的主幹道
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  worldCtx.fillRect(0, 500, WORLD_WIDTH, 100);
  worldCtx.strokeStyle = 'rgba(249, 202, 36, 0.2)';
  worldCtx.setLineDash([15, 15]);
  worldCtx.beginPath();
  worldCtx.moveTo(0, 550);
  worldCtx.lineTo(WORLD_WIDTH, 550);
  worldCtx.stroke();
  worldCtx.setLineDash([]);

  // 路燈與暖光光暈
  mapEntities.streetLights.forEach(light => {
    // 燈柱
    worldCtx.fillStyle = '#2f3640';
    worldCtx.fillRect(light.x - 3, light.y - 40, 6, 40);
    // 燈頭
    worldCtx.fillStyle = '#f9ca24';
    worldCtx.beginPath();
    worldCtx.arc(light.x, light.y - 45, 7, 0, Math.PI * 2);
    worldCtx.fill();
    // 光暈
    const radGrad = worldCtx.createRadialGradient(light.x, light.y - 45, 5, light.x, light.y - 45, 65);
    radGrad.addColorStop(0, 'rgba(249, 202, 36, 0.35)');
    radGrad.addColorStop(1, 'rgba(249, 202, 36, 0)');
    worldCtx.fillStyle = radGrad;
    worldCtx.beginPath();
    worldCtx.arc(light.x, light.y - 45, 65, 0, Math.PI * 2);
    worldCtx.fill();
  });
}

function drawStructures() {
  // 市集攤位
  mapEntities.marketStalls.forEach(stall => {
    // 陰影
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    worldCtx.fillRect(stall.x + 8, stall.y + 8, stall.width, stall.height);

    // 攤位主體
    worldCtx.fillStyle = '#222f3e';
    worldCtx.fillRect(stall.x, stall.y, stall.width, stall.height);
    worldCtx.strokeStyle = 'rgba(249, 202, 36, 0.6)';
    worldCtx.lineWidth = 2;
    worldCtx.strokeRect(stall.x, stall.y, stall.width, stall.height);

    // 屋頂遮陽棚條紋
    worldCtx.fillStyle = '#e67e22';
    worldCtx.fillRect(stall.x, stall.y, stall.width, 24);

    // 圖示與招牌
    worldCtx.font = '28px serif';
    worldCtx.textAlign = 'center';
    worldCtx.fillText(stall.icon, stall.x + stall.width / 2, stall.y + 60);

    worldCtx.font = '12px sans-serif';
    worldCtx.fillStyle = '#fff';
    worldCtx.fillText(stall.name, stall.x + stall.width / 2, stall.y + 90);
  });

  // 酒吧核心吧台
  const counter = mapEntities.tavernItems.find(i => i.id === 'bar_counter');
  if (counter) {
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    worldCtx.fillRect(counter.x - counter.width / 2 + 6, counter.y + 6, counter.width, counter.height);

    worldCtx.fillStyle = '#4b382a';
    worldCtx.fillRect(counter.x - counter.width / 2, counter.y, counter.width, counter.height);
    worldCtx.strokeStyle = 'rgba(249, 202, 36, 0.8)';
    worldCtx.lineWidth = 2;
    worldCtx.strokeRect(counter.x - counter.width / 2, counter.y, counter.width, counter.height);

    worldCtx.font = '24px serif';
    worldCtx.textAlign = 'center';
    worldCtx.fillText('🍸', counter.x, counter.y + 35);

    worldCtx.font = 'bold 13px sans-serif';
    worldCtx.fillStyle = '#f9ca24';
    worldCtx.fillText('★ 奇幻調酒師工作台 ★', counter.x, counter.y + 58);
  }
}

function drawGatherNodes() {
  mapEntities.gatherNodes.forEach(node => {
    if (node.gathered) return;

    // 發光光暈
    const grad = worldCtx.createRadialGradient(node.x, node.y, 4, node.x, node.y, 30);
    grad.addColorStop(0, 'rgba(46, 204, 113, 0.45)');
    grad.addColorStop(1, 'rgba(46, 204, 113, 0)');
    worldCtx.fillStyle = grad;
    worldCtx.beginPath();
    worldCtx.arc(node.x, node.y, 30, 0, Math.PI * 2);
    worldCtx.fill();

    // 採集物圖示
    worldCtx.font = '24px serif';
    worldCtx.textAlign = 'center';
    worldCtx.textBaseline = 'middle';
    worldCtx.fillText(node.icon, node.x, node.y);

    // 浮動小標籤
    worldCtx.font = '11px sans-serif';
    worldCtx.fillStyle = '#2ecc71';
    worldCtx.fillText(node.name, node.x, node.y + 22);
  });
}

function drawCustomers() {
  const custSeat = mapEntities.tavernItems.find(i => i.id === 'customer_seat');
  if (!custSeat) return;

  const cust = CUSTOMERS[game.currentCustomerIndex];

  // 顧客等待光圈
  worldCtx.strokeStyle = 'rgba(165, 94, 234, 0.7)';
  worldCtx.lineWidth = 2;
  worldCtx.beginPath();
  worldCtx.arc(custSeat.x, custSeat.y, 28, 0, Math.PI * 2);
  worldCtx.stroke();

  // 顧客大頭貼圖示
  worldCtx.font = '32px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText(cust.avatar, custSeat.x, custSeat.y);

  // 顧客名牌
  worldCtx.font = 'bold 12px sans-serif';
  worldCtx.fillStyle = '#fff';
  worldCtx.fillText(cust.name, custSeat.x, custSeat.y - 32);

  // 渴求對話小氣泡
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  worldCtx.fillRect(custSeat.x - 70, custSeat.y + 26, 140, 20);
  worldCtx.fillStyle = '#f9ca24';
  worldCtx.font = '11px sans-serif';
  worldCtx.fillText('點酒中・按空白鍵', custSeat.x, custSeat.y + 40);
}

function drawFireflies() {
  mapEntities.fireflies.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.glow += 0.05;

    // 螢火蟲邊界回彈
    if (p.x < 0) p.x = WORLD_WIDTH;
    if (p.x > WORLD_WIDTH) p.x = 0;
    if (p.y < 0) p.y = WORLD_HEIGHT;
    if (p.y > WORLD_HEIGHT) p.y = 0;

    const alpha = 0.3 + Math.sin(p.glow) * 0.3;
    worldCtx.fillStyle = `rgba(0, 210, 211, ${alpha})`;
    worldCtx.beginPath();
    worldCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    worldCtx.fill();
  });
}

function drawPlayer() {
  const p = game.player;

  // 1. 角色腳下發光星辰視野環（比照截圖探查圈）
  worldCtx.save();
  worldCtx.strokeStyle = 'rgba(249, 202, 36, 0.65)';
  worldCtx.lineWidth = 2;
  worldCtx.setLineDash([6, 4]);
  worldCtx.beginPath();
  worldCtx.arc(p.x, p.y, 42, 0, Math.PI * 2);
  worldCtx.stroke();
  worldCtx.setLineDash([]);

  // 視野環內淡高光
  const circleGrad = worldCtx.createRadialGradient(p.x, p.y, 10, p.x, p.y, 42);
  circleGrad.addColorStop(0, 'rgba(249, 202, 36, 0.18)');
  circleGrad.addColorStop(1, 'rgba(249, 202, 36, 0)');
  worldCtx.fillStyle = circleGrad;
  worldCtx.beginPath();
  worldCtx.arc(p.x, p.y, 42, 0, Math.PI * 2);
  worldCtx.fill();

  // 2. 移動方向箭頭指示針
  const arrowDist = 32;
  const ax = p.x + Math.cos(p.angle) * arrowDist;
  const ay = p.y + Math.sin(p.angle) * arrowDist;
  worldCtx.fillStyle = '#f9ca24';
  worldCtx.beginPath();
  worldCtx.arc(ax, ay, 4.5, 0, Math.PI * 2);
  worldCtx.fill();

  // 3. 調酒師小人身體（帶有行走微彈跳動畫）
  const bobY = Math.sin(p.walkAnimTime) * 3;

  // 披風陰影
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  worldCtx.beginPath();
  worldCtx.ellipse(p.x, p.y + 16, 16, 8, 0, 0, Math.PI * 2);
  worldCtx.fill();

  // 魔法燕尾長袍
  worldCtx.fillStyle = '#1e272e';
  worldCtx.beginPath();
  worldCtx.arc(p.x, p.y + bobY, 16, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.strokeStyle = '#f9ca24';
  worldCtx.lineWidth = 2;
  worldCtx.stroke();

  // 禮帽/頭部
  worldCtx.font = '22px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText('🧙‍♂️', p.x, p.y + bobY - 2);

  // 4. 頭頂名牌標籤（比照截圖「本尊 調酒聖手」）
  worldCtx.fillStyle = 'rgba(10, 12, 22, 0.85)';
  worldCtx.strokeStyle = 'rgba(249, 202, 36, 0.5)';
  worldCtx.lineWidth = 1;
  worldCtx.fillRect(p.x - 55, p.y - 48, 110, 20);
  worldCtx.strokeRect(p.x - 55, p.y - 48, 110, 20);

  worldCtx.fillStyle = '#f9ca24';
  worldCtx.font = 'bold 11px sans-serif';
  worldCtx.fillText('★ 傳奇調酒師', p.x, p.y - 34);

  worldCtx.restore();
}

// 繪製左上角小地圖 (Minimap)
function drawMinimap() {
  const mw = DOM.minimapCanvas.width;
  const mh = DOM.minimapCanvas.height;

  minimapCtx.clearRect(0, 0, mw, mh);

  // 三區底色微縮
  minimapCtx.fillStyle = '#1e272e';
  minimapCtx.fillRect(0, 0, mw * (ZONE_MARKET_MAX_X / WORLD_WIDTH), mh);

  minimapCtx.fillStyle = '#341f97';
  minimapCtx.fillRect(mw * (ZONE_MARKET_MAX_X / WORLD_WIDTH), 0, mw * ((ZONE_TAVERN_MAX_X - ZONE_MARKET_MAX_X) / WORLD_WIDTH), mh);

  minimapCtx.fillStyle = '#0c1b18';
  minimapCtx.fillRect(mw * (ZONE_TAVERN_MAX_X / WORLD_WIDTH), 0, mw * (1 - ZONE_TAVERN_MAX_X / WORLD_WIDTH), mh);

  // 主角小金點
  const px = (game.player.x / WORLD_WIDTH) * mw;
  const py = (game.player.y / WORLD_HEIGHT) * mh;

  minimapCtx.fillStyle = '#f9ca24';
  minimapCtx.beginPath();
  minimapCtx.arc(px, py, 3, 0, Math.PI * 2);
  minimapCtx.fill();
}

// ==================== 10. 市集與調酒互動邏輯 ====================

function updateResourceDisplays() {
  DOM.goldDisplay.textContent = game.gold;
  DOM.repDisplay.textContent = game.reputation;
  DOM.pointsDisplay.textContent = game.points;
}

// 開啟市集
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
      .map(([flv, val]) => {
        const names = { sweet: '甜', sour: '酸', spirit: '烈', magic: '魔', spicy: '辣' };
        return `<span class="mtag">${names[flv]}+${val}</span>`;
      }).join(' ');

    card.innerHTML = `
      <div class="market-card-top">
        <div class="market-card-icon">${item.icon}</div>
        <div class="market-card-info">
          <h4>${item.name}</h4>
          <div class="market-tags">${tagsHtml}</div>
        </div>
      </div>
      <p style="font-size:0.75rem;color:var(--text-dim);">${item.desc}</p>
      <div class="market-card-bottom">
        <div>
          <strong style="color:var(--gold);font-size:0.9rem;">🪙 ${item.price}</strong>
          <div style="font-size:0.72rem;color:var(--cyan);">庫存: ${stock}</div>
        </div>
        <button class="buy-action-btn" ${canAfford ? '' : 'disabled'} onclick="buyMarketItem('${item.id}')">
          ${isLocked ? `⭐需聲望${item.repReq}` : '採購 +1'}
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

DOM.closeMarketBtn.addEventListener('click', () => {
  DOM.marketModal.classList.add('hidden');
});

// 開啟調酒工作台
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

    const flvText = Object.entries(item.flavors)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => {
        const short = { sweet: '甜', sour: '酸', spirit: '烈', magic: '魔', spicy: '辣' };
        return `${short[k]}${v}`;
      }).join(' ');

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong style="font-size:0.82rem;color:#fff;">${item.icon} ${item.name}</strong>
        <span style="font-size:0.72rem;color:var(--cyan);">x${stock}</span>
      </div>
      <div style="font-size:0.7rem;color:var(--text-dim);">${flvText}</div>
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

// 倒酒長按事件
['mousedown', 'touchstart'].forEach(evt => {
  DOM.pourBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    startPouring();
  });
});

['mouseup', 'mouseleave', 'touchend', 'touchcancel'].forEach(evt => {
  DOM.pourBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    stopPouring();
  });
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

  // 每次調酒使用該原料扣 1 份庫存
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

// 調酒杯 Canvas 繪製
function drawCocktailGlass() {
  cocktailCtx.clearRect(0, 0, DOM.cocktailCanvas.width, DOM.cocktailCanvas.height);

  const gx = 25;
  const gy = 20;
  const gw = 150;
  const gh = 240;
  const bottomW = 90;

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

    const grad = cocktailCtx.createLinearGradient(0, topY, 0, currentBaseY);
    grad.addColorStop(0, layer.color);
    grad.addColorStop(1, layer.color);

    cocktailCtx.fillStyle = grad;
    cocktailCtx.fillRect(0, topY, DOM.cocktailCanvas.width, layerH);

    cocktailCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    cocktailCtx.fillRect(0, topY, DOM.cocktailCanvas.width, 2);

    currentBaseY = topY;
  });

  cocktailCtx.restore();

  // 反光線
  cocktailCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  cocktailCtx.lineWidth = 2;
  cocktailCtx.beginPath();
  cocktailCtx.moveTo(gx + 6, gy + 8);
  cocktailCtx.lineTo(gx + (gw - bottomW) / 2 + 6, gy + gh - 8);
  cocktailCtx.stroke();

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

// 結算與打分
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
      <div style="font-size:0.72rem;color:var(--magic);">${r.tags}</div>
      <p style="font-size:0.72rem;color:var(--text-dim);margin-top:4px;">${isUnlocked ? '已完成收錄' : `線索: ${r.requirement}`}</p>
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

// ==================== 11. 主遊戲循環 (Game Loop) ====================

function gameLoop() {
  updatePlayer();
  drawWorld();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('DOMContentLoaded', () => {
  updateResourceDisplays();
  requestAnimationFrame(gameLoop);
});
