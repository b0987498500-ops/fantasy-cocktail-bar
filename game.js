/**
 * 奇幻調酒館 (Fantasy Bartender) - 純淨吉卜力宮崎駿手繪動畫風格 (Studio Ghibli Artworks)
 * 1. 100% 正宗宮崎駿手繪美術資產（高畫質手繪全景、切片柑橘商鋪、木造酒館與盤根神木）
 * 2. 真正 2.5D 深度探索：向深處走動時背景與環境動態跟隨流動，告別畫面卡死
 * 3. 空間透視景深（Perspective Scaling）：角色往長街深處走動時自然遠小近大
 * 4. 手繪調酒師精細造型：羽毛禮帽、酒紅馬甲、領結、邁步動畫與手提黃銅魔燈光錐
 * 5. 街區漫步居民（NPC）：少女艾莉、矮人老爹、橘斑花貓、旅行學者悠閒散步與交談
 * 6. 巨幅秘境古林（4800px 寬 x 2200px 深）：4 座藏寶箱、3 處特色草藥採集與林深心跳迷路警戒
 */

// ==================== 1. 預載吉卜力手繪美術資產 ====================

const ASSET_IMAGES = {
  worldMasterBg: new Image(),
  tavernInterior: new Image(),
  fruitStall: new Image(),
  forestRoots: new Image(),
  tavernHouse: new Image(),
  marketStreet: new Image(),
  tavernGrounds: new Image(),
  enchantedForest: new Image()
};
ASSET_IMAGES.worldMasterBg.src = 'assets/world_master_bg.jpg';
ASSET_IMAGES.tavernInterior.src = 'assets/tavern_interior.jpg';
ASSET_IMAGES.fruitStall.src = 'assets/fruit_stall.png';
ASSET_IMAGES.forestRoots.src = 'assets/forest_roots.jpg';
ASSET_IMAGES.tavernHouse.src = 'assets/tavern_house.jpg';
ASSET_IMAGES.marketStreet.src = 'assets/market_street.jpg';
ASSET_IMAGES.tavernGrounds.src = 'assets/tavern_grounds.jpg';
ASSET_IMAGES.enchantedForest.src = 'assets/enchanted_forest.jpg';

// ==================== 2. 原料與資料定義 ====================

const INGREDIENTS = {
  moon_syrup: { id: 'moon_syrup', name: '月光糖漿', icon: '🍯', price: 15, repReq: 0, color: '#f6e58d', flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 }, desc: '柑橘水果工坊特釀，入口溫潤甘甜。', shopId: 'shop_citrus' },
  dawn_water: { id: 'dawn_water', name: '晨露純水', icon: '💧', price: 10, repReq: 0, color: '#7ed6df', flavors: { sweet: 1, sour: 2, spirit: 0, magic: 0, spicy: 0 }, desc: '花苞採集純淨晨露，微酸沁涼。', shopId: 'shop_herbs' },
  abyss_rum: { id: 'abyss_rum', name: '深淵烈酒', icon: '🍷', price: 25, repReq: 0, color: '#e056fd', flavors: { sweet: 0, sour: 0, spirit: 3, magic: 1, spicy: 1 }, desc: '地下熔岩烈火蒸餾，微醺狂烈。', shopId: 'shop_rum' },
  star_fruit: { id: 'star_fruit', name: '星輝果萃', icon: '✨', price: 20, repReq: 10, color: '#ffbe76', flavors: { sweet: 2, sour: 2, spirit: 0, magic: 2, spicy: 0 }, desc: '柑橘鋪鮮採星辰果，滿溢魔法流光。', shopId: 'shop_citrus' },
  frost_mint: { id: 'frost_mint', name: '極地薄荷霜', icon: '🌿', price: 30, repReq: 25, color: '#686de0', flavors: { sweet: 0, sour: 3, spirit: 1, magic: 1, spicy: 0 }, desc: '冰原凝鍊薄荷冰霜，沁涼透骨。', shopId: 'shop_frost' },
  dragon_chili: { id: 'dragon_chili', name: '巨龍朝天椒', icon: '🌶️', price: 45, repReq: 40, color: '#ff4757', flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 }, desc: '龍息炙烤朝天椒，喉中爆發辛香。', shopId: 'shop_rum' },
  // 森林寶箱與採集專屬原料
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

// ==================== 3. 世界地圖規格與實體佈局 (巨幅 4800 x 2200 空間) ====================

const WORLD_WIDTH = 4800;
const WORLD_HEIGHT = 2200;

const ZONE_MARKET_MAX_X = 1400;
const ZONE_TAVERN_MAX_X = 2300;
const FOREST_START_X = 2300;
const FOREST_WARN_X = 3500;
const FOREST_DANGER_X = 4100;
const FOREST_LOST_X = 4720;

const INDOOR_WIDTH = 1100;
const INDOOR_HEIGHT = 700;

// 街區特色店鋪
const STREET_SHOPS = [
  { id: 'shop_rum', name: '深淵烈酒蒸餾廠', icon: '🍷', isGhibliStall: false, x: 180, y: 1020, w: 230, h: 220, doorX: 295, doorY: 1260, intro: '紅磚大煙囪手繪蒸餾廠，飄散著濃郁烈酒與橡木香。' },
  { id: 'shop_citrus', name: '切片柑橘糖果工坊', icon: '🍊', isGhibliStall: true, x: 520, y: 960, w: 320, h: 320, doorX: 680, doorY: 1300, intro: '切片柑橘造型木質手繪工坊，掛滿果籃與七彩琉璃糖漿罐。' },
  { id: 'shop_herbs', name: '精靈香草晨露屋', icon: '🌿', isGhibliStall: false, x: 950, y: 1010, w: 220, h: 210, doorX: 1060, doorY: 1240, intro: '綠藤纏繞的木屋，販售純淨晨露與草藥。' },
  { id: 'shop_frost', name: '極地薄荷霜閣', icon: '🧊', isGhibliStall: false, x: 1230, y: 1020, w: 200, h: 210, doorX: 1330, doorY: 1240, intro: '屋簷結著晶瑩冰柱，提供沁涼薄荷精粹。' }
];

// 中央調酒師酒館小店
const TAVERN_HOUSE = {
  x: 1540,
  y: 780,
  w: 520,
  h: 460,
  doorX: 1800,
  doorY: 1260,
  solidMinX: 1610,
  solidMaxX: 1990,
  solidMinY: 880,
  solidMaxY: 1230
};

// 森林神聖盤根巨木地標
const FOREST_LANDMARK = {
  x: 3450,
  y: 1020,
  w: 420,
  h: 420,
  chestX: 3450,
  chestY: 1100
};

// 森林巨樹陣列
const FOREST_TREES = [
  { x: 2380, y: 920, trunkR: 26, crownR: 75, currentAlpha: 1 },
  { x: 2480, y: 1420, trunkR: 28, crownR: 78, currentAlpha: 1 },
  { x: 2650, y: 880, trunkR: 30, crownR: 82, currentAlpha: 1 },
  { x: 2780, y: 1320, trunkR: 25, crownR: 70, currentAlpha: 1 },
  { x: 2950, y: 920, trunkR: 32, crownR: 85, currentAlpha: 1 }, // 樹後寶箱 1
  { x: 3150, y: 1480, trunkR: 30, crownR: 82, currentAlpha: 1 },
  { x: 3300, y: 880, trunkR: 28, crownR: 75, currentAlpha: 1 },
  { x: 3650, y: 1420, trunkR: 34, crownR: 88, currentAlpha: 1 },
  { x: 3820, y: 900, trunkR: 32, crownR: 85, currentAlpha: 1 },
  { x: 4050, y: 1420, trunkR: 35, crownR: 90, currentAlpha: 1 }, // 樹後寶箱 2
  { x: 4250, y: 950, trunkR: 32, crownR: 84, currentAlpha: 1 },
  { x: 4450, y: 1350, trunkR: 36, crownR: 92, currentAlpha: 1 },
  { x: 4560, y: 1050, trunkR: 38, crownR: 96, currentAlpha: 1 }  // 終點神殿寶箱
];

// 4 處森林寶箱
const FOREST_CHESTS = [
  { id: 'chest_roots', name: '盤根老樹下的古老寶箱', x: 3450, y: 1100, opened: false, rewardIndex: 0 },
  { id: 'chest_tree_1', name: '微光幽谷古樹後的寶盒', x: 2950, y: 920, opened: false, rewardIndex: 1 },
  { id: 'chest_tree_2', name: '紫霧深處青苔寶藏', x: 4050, y: 1420, opened: false, rewardIndex: 2 },
  { id: 'chest_phoenix', name: '神殿遺跡不滅鳥寶藏', x: 4560, y: 1050, opened: false, rewardIndex: 3 }
];

// 3 處草藥採集點
const FOREST_HERBS = [
  { id: 'herb_flowers', name: '微光陽光花叢', x: 2620, y: 1400, icon: '🌼', itemId: 'dawn_water', count: 2, gathered: false },
  { id: 'herb_shrooms', name: '翠光幽靈菇聚落', x: 3200, y: 920, icon: '🍄', itemId: 'glowing_shroom', count: 2, gathered: false },
  { id: 'herb_spring', name: '古木精靈甘泉水池', x: 3880, y: 1260, icon: '💧', itemId: 'fairy_tear', count: 1, gathered: false }
];

// 4 位悠閒漫步的街區 NPC 居民
const TOWN_NPCS = [
  { id: 'npc_baker', name: '艾莉', title: '小鎮少女', avatar: '🍞', x: 420, y: 1380, minX: 250, maxX: 650, speed: 0.65, dir: 1, animTime: 0, bubble: '🌸', chat: '艾莉微笑著說：「今天陽光真好，我烤了熱騰騰的焦糖奶油麵包，要來一塊嗎？」' },
  { id: 'npc_dwarf', name: '葛倫', title: '矮人老爹', avatar: '🧔', x: 220, y: 1420, minX: 100, maxX: 380, speed: 0.55, dir: -1, animTime: 0, bubble: '🍺', chat: '葛倫拍著小木酒桶大笑：「哈哈！深淵蒸餾廠剛出了新批次烈酒，夠勁夠辣！」' },
  { id: 'npc_cat', name: '咪咪', title: '橘斑花貓', avatar: '🐾', x: 740, y: 1480, minX: 520, maxX: 880, speed: 0.8, dir: 1, animTime: 0, bubble: '🐾', chat: '咪咪瞇起金黃色眼睛在石板路上打了個滾：「喵嗚～（蹭了蹭你的調酒師提燈）」' },
  { id: 'npc_scholar', name: '羅納德', title: '旅行學者', avatar: '📜', x: 1080, y: 1400, minX: 850, maxX: 1250, speed: 0.6, dir: -1, animTime: 0, bubble: '📜', chat: '羅納德扶了扶金邊眼鏡：「根據古代星象記載，右側古林深處似乎封存著不死鳥的餘燼...」' }
];

// 環境浮動微粒
const AMBIENT_PARTICLES = Array.from({ length: 70 }, () => ({
  x: Math.random() * WORLD_WIDTH,
  y: 400 + Math.random() * 1600,
  size: 2 + Math.random() * 3.5,
  speedX: 0.3 + Math.random() * 0.7,
  speedY: (Math.random() - 0.5) * 0.4,
  type: Math.random() > 0.6 ? 'leaf' : (Math.random() > 0.5 ? 'spore' : 'bubble'),
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

    // 玩家初始位置（酒館門前石板大道中央）
    this.player = {
      x: 1800,
      y: 1380,
      radius: 17,
      speed: 4.2,
      sprintSpeed: 6.8,
      isSprinting: false,
      angle: -Math.PI / 2, // 預設面朝前方酒館
      walkAnimTime: 0,
      targetX: null,
      targetY: null,
      fairyX: 1780,
      fairyY: 1350,
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

function isAnyModalOpen() {
  return !DOM.marketModal.classList.contains('hidden') ||
         !DOM.bartenderModal.classList.contains('hidden') ||
         !DOM.resultModal.classList.contains('hidden') ||
         !DOM.recipeBookModal.classList.contains('hidden') ||
         !DOM.chestRewardModal.classList.contains('hidden');
}

// ==================== 6. 控制與事件監聽 ====================

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
  DOM.worldCanvas.width = window.innerWidth;
  DOM.worldCanvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener('keydown', (e) => {
  const code = e.code;
  const key = (e.key || '').toLowerCase();

  if (code === 'KeyW' || code === 'ArrowUp' || key === 'w') { game.keys.w = true; game.keys.ArrowUp = true; }
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a') { game.keys.a = true; game.keys.ArrowLeft = true; }
  if (code === 'KeyS' || code === 'ArrowDown' || key === 's') { game.keys.s = true; game.keys.ArrowDown = true; }
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'd') { game.keys.d = true; game.keys.ArrowRight = true; }

  if (code === 'KeyJ' || code === 'ShiftLeft' || code === 'ShiftRight' || key === 'j' || key === 'shift') {
    game.player.isSprinting = true;
  }

  if (code === 'Space' || key === ' ' || key === 'spacebar') {
    e.preventDefault();
    triggerActiveInteraction();
  }
});

window.addEventListener('keyup', (e) => {
  const code = e.code;
  const key = (e.key || '').toLowerCase();

  if (code === 'KeyW' || code === 'ArrowUp' || key === 'w') { game.keys.w = false; game.keys.ArrowUp = false; }
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a') { game.keys.a = false; game.keys.ArrowLeft = false; }
  if (code === 'KeyS' || code === 'ArrowDown' || key === 's') { game.keys.s = false; game.keys.ArrowDown = false; }
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'd') { game.keys.d = false; game.keys.ArrowRight = false; }

  if (code === 'KeyJ' || code === 'ShiftLeft' || code === 'ShiftRight' || key === 'j' || key === 'shift') {
    game.player.isSprinting = false;
  }
});

DOM.worldCanvas.addEventListener('click', (e) => {
  if (isAnyModalOpen()) return;
  const rect = DOM.worldCanvas.getBoundingClientRect();
  game.player.targetX = (e.clientX - rect.left) + game.camera.x;
  game.player.targetY = (e.clientY - rect.top) + game.camera.y;
});

// 手機極簡虛擬搖桿
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

// ==================== 7. 物理碰撞、區域判定與鏡頭動態跟隨 ====================

function checkCollision(x, y) {
  if (game.currentScene === 'indoor') {
    if (x < 120 || x > INDOOR_WIDTH - 120 || y < 280 || y > INDOOR_HEIGHT - 60) return true;
    if (x > 380 && x < 680 && y > 300 && y < 390) return true; // 吧台阻擋
    return false;
  }

  // 戶外邊界
  if (x < 50 || x > WORLD_WIDTH - 50 || y < 650 || y > WORLD_HEIGHT - 60) return true;

  // 1. 中央酒館實體建築阻擋
  const h = TAVERN_HOUSE;
  if (x > h.solidMinX && x < h.solidMaxX && y > h.solidMinY && y < h.solidMaxY) {
    if (!(x > h.doorX - 45 && x < h.doorX + 45 && y > h.doorY - 30)) return true;
  }

  // 2. 街區店鋪阻擋
  for (const shop of STREET_SHOPS) {
    if (x > shop.x + 10 && x < shop.x + shop.w - 10 && y > shop.y + 40 && y < shop.y + shop.h - 10) {
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

function updateTownNPCs() {
  TOWN_NPCS.forEach(npc => {
    // 悠閒慢速漫步
    npc.x += npc.speed * npc.dir;
    npc.animTime += 0.08;

    if (npc.x > npc.maxX) {
      npc.x = npc.maxX;
      npc.dir = -1;
    } else if (npc.x < npc.minX) {
      npc.x = npc.minX;
      npc.dir = 1;
    }
  });
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
    game.player.walkAnimTime += 0.24;
  }

  // 螢火小精靈自然悠游
  game.player.fairyAngle += 0.06;
  const fairyTargetX = game.player.x - Math.cos(game.player.angle) * 32 + Math.sin(game.player.fairyAngle) * 18;
  const fairyTargetY = game.player.y - Math.sin(game.player.angle) * 32 - 24 + Math.cos(game.player.fairyAngle) * 14;
  game.player.fairyX += (fairyTargetX - game.player.fairyX) * 0.14;
  game.player.fairyY += (fairyTargetY - game.player.fairyY) * 0.14;

  // 鏡頭全景動態跟隨（垂直深遠跟隨，向前走時背景環境自然流動退去！）
  const curWorldW = game.currentScene === 'indoor' ? INDOOR_WIDTH : WORLD_WIDTH;
  const curWorldH = game.currentScene === 'indoor' ? INDOOR_HEIGHT : WORLD_HEIGHT;

  const targetCamX = game.player.x - DOM.worldCanvas.width / 2;
  const targetCamY = game.player.y - DOM.worldCanvas.height * 0.62; // 讓主角保持在畫面下三分之二，展現前方寬闊視野
  game.camera.x += (targetCamX - game.camera.x) * 0.12;
  game.camera.y += (targetCamY - game.camera.y) * 0.12;

  const maxCamX = Math.max(0, curWorldW - DOM.worldCanvas.width);
  const maxCamY = Math.max(0, curWorldH - DOM.worldCanvas.height);
  game.camera.x = Math.max(0, Math.min(maxCamX, game.camera.x));
  game.camera.y = Math.max(0, Math.min(maxCamY, game.camera.y));

  // 環境落葉與氣泡粒子漂浮
  AMBIENT_PARTICLES.forEach(p => {
    p.x += p.speedX;
    p.sway += 0.04;
    p.y += Math.sin(p.sway) * 0.4;
    if (p.x > WORLD_WIDTH) p.x = 0;
  });

  // 樹冠遮蔽透明度
  if (game.currentScene === 'outdoor') {
    FOREST_TREES.forEach(tree => {
      const d = Math.hypot(game.player.x - tree.x, game.player.y - (tree.y - 30));
      const targetAlpha = d < tree.crownR + 20 ? 0.3 : 1.0;
      tree.currentAlpha += (targetAlpha - tree.currentAlpha) * 0.15;
    });
    updateForestMist();
    updateTownNPCs();
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
  window.soundEngine.playWhoosh();
  DOM.lostAlertBanner.classList.add('show');

  // 隨機遺失部分森林採集物
  Object.keys(game.collectedInCurrentRun).forEach(k => {
    game.inventory[k] = Math.max(0, (game.inventory[k] || 0) - game.collectedInCurrentRun[k]);
  });
  game.collectedInCurrentRun = {};

  // 護送回酒館大門外
  game.player.x = TAVERN_HOUSE.doorX;
  game.player.y = TAVERN_HOUSE.doorY + 80;
  game.player.targetX = null;
  game.player.targetY = null;
  game.camera.x = game.player.x - DOM.worldCanvas.width / 2;
  game.camera.y = game.player.y - DOM.worldCanvas.height * 0.62;

  setTimeout(() => {
    DOM.lostAlertBanner.classList.remove('show');
  }, 4000);
}

// 互動目標偵測
function detectNearbyInteraction() {
  let closest = null;
  let minDist = 75;

  if (game.currentScene === 'indoor') {
    // 吧台
    const dBar = Math.hypot(game.player.x - 530, game.player.y - 340);
    if (dBar < 80) {
      closest = { type: 'bar', x: 530, y: 340, prompt: '開始調酒' };
      minDist = dBar;
    }
    // 出口
    const dExit = Math.hypot(game.player.x - 550, game.player.y - 650);
    if (dExit < 70) {
      closest = { type: 'exit_tavern', x: 550, y: 650, prompt: '推門外出' };
      minDist = dExit;
    }
  } else {
    // 1. 酒館大門
    const dDoor = Math.hypot(game.player.x - TAVERN_HOUSE.doorX, game.player.y - TAVERN_HOUSE.doorY);
    if (dDoor < 75 && dDoor < minDist) {
      closest = { type: 'enter_tavern', x: TAVERN_HOUSE.doorX, y: TAVERN_HOUSE.doorY, prompt: '進入酒館' };
      minDist = dDoor;
    }

    // 2. 街區店鋪
    STREET_SHOPS.forEach(shop => {
      const dShop = Math.hypot(game.player.x - shop.doorX, game.player.y - shop.doorY);
      if (dShop < 85 && dShop < minDist) {
        closest = { type: 'shop', shopId: shop.id, x: shop.doorX, y: shop.doorY, prompt: `拜訪 ${shop.name}` };
        minDist = dShop;
      }
    });

    // 3. 街區 NPC 居民
    TOWN_NPCS.forEach(npc => {
      const dNpc = Math.hypot(game.player.x - npc.x, game.player.y - npc.y);
      if (dNpc < 70 && dNpc < minDist) {
        closest = { type: 'npc_chat', npc: npc, x: npc.x, y: npc.y, prompt: `與 ${npc.name} 交談` };
        minDist = dNpc;
      }
    });

    // 4. 森林古老寶箱
    FOREST_CHESTS.forEach(chest => {
      if (!chest.opened) {
        const dChest = Math.hypot(game.player.x - chest.x, game.player.y - chest.y);
        if (dChest < 75 && dChest < minDist) {
          closest = { type: 'chest', chest: chest, x: chest.x, y: chest.y, prompt: `開啟 ${chest.name}` };
          minDist = dChest;
        }
      }
    });

    // 5. 森林草藥採集點
    FOREST_HERBS.forEach(herb => {
      if (!herb.gathered) {
        const dHerb = Math.hypot(game.player.x - herb.x, game.player.y - herb.y);
        if (dHerb < 70 && dHerb < minDist) {
          closest = { type: 'gather_herb', herb: herb, x: herb.x, y: herb.y, prompt: `採集 ${herb.name}` };
          minDist = dHerb;
        }
      }
    });
  }

  game.activeInteractable = closest;
  if (closest) {
    DOM.promptActionText.textContent = closest.prompt;
    DOM.proximityPrompt.classList.remove('hidden');
    const sx = closest.x - game.camera.x;
    const sy = closest.y - game.camera.y - 45;
    DOM.proximityPrompt.style.left = `${Math.max(40, Math.min(window.innerWidth - 180, sx))}px`;
    DOM.proximityPrompt.style.top = `${Math.max(40, Math.min(window.innerHeight - 80, sy))}px`;
  } else {
    DOM.proximityPrompt.classList.add('hidden');
  }

  // 頂部區域名稱更新
  if (game.currentScene === 'indoor') {
    DOM.currentZoneName.textContent = '奇幻酒館・溫暖室內吧台';
  } else if (game.player.x < ZONE_MARKET_MAX_X) {
    DOM.currentZoneName.textContent = '星光街區・手繪市集';
  } else if (game.player.x < ZONE_TAVERN_MAX_X) {
    DOM.currentZoneName.textContent = '奇幻酒館・莊園庭院';
  } else {
    DOM.currentZoneName.textContent = '秘境古林・神聖巨木群';
  }
}

function triggerActiveInteraction() {
  if (!game.activeInteractable) return;
  const act = game.activeInteractable;

  if (act.type === 'enter_tavern') {
    window.soundEngine.playDoor();
    game.currentScene = 'indoor';
    game.player.x = 550;
    game.player.y = 590;
    game.player.angle = -Math.PI / 2;
    game.camera.x = 0;
    game.camera.y = 0;
  } else if (act.type === 'exit_tavern') {
    window.soundEngine.playDoor();
    game.currentScene = 'outdoor';
    game.player.x = TAVERN_HOUSE.doorX;
    game.player.y = TAVERN_HOUSE.doorY + 65;
    game.player.angle = Math.PI / 2;
  } else if (act.type === 'shop') {
    window.soundEngine.playChime();
    openMarketModal(act.shopId);
  } else if (act.type === 'npc_chat') {
    window.soundEngine.playChime();
    alert(`【${act.npc.title}・${act.npc.name}】

${act.npc.chat}`);
  } else if (act.type === 'bar') {
    window.soundEngine.playChime();
    openBartenderModal();
  } else if (act.type === 'chest') {
    openTreasureChest(act.chest);
  } else if (act.type === 'gather_herb') {
    gatherHerb(act.herb);
  }
}

function gatherHerb(herb) {
  herb.gathered = true;
  window.soundEngine.playCoin();
  game.inventory[herb.itemId] = (game.inventory[herb.itemId] || 0) + herb.count;
  game.collectedInCurrentRun[herb.itemId] = (game.collectedInCurrentRun[herb.itemId] || 0) + herb.count;
  game.points += 15;
  updateResourceDisplays();
  alert(`✨ 成功採集了【${herb.name}】！
獲得 ${herb.icon} x${herb.count}，已放入調酒背包。`);
  game.activeInteractable = null;
  DOM.proximityPrompt.classList.add('hidden');
}

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

// ==================== 8. 全景吉卜力手繪世界繪製系統 ====================

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

  if (game.currentScene === 'outdoor') {
    drawTreeCrowns();
    drawAmbientParticles();
  }

  worldCtx.restore();
}

// -------------------------------------------------------------
// A. 吉卜力手繪溫馨酒館室內 (Indoor Scene)
// -------------------------------------------------------------
function drawTavernInterior() {
  if (ASSET_IMAGES.tavernInterior.complete && ASSET_IMAGES.tavernInterior.naturalWidth > 0) {
    worldCtx.drawImage(ASSET_IMAGES.tavernInterior, 0, 0, INDOOR_WIDTH, INDOOR_HEIGHT);
  } else {
    const bgGrad = worldCtx.createLinearGradient(0, 0, 0, INDOOR_HEIGHT);
    bgGrad.addColorStop(0, '#3e2714');
    bgGrad.addColorStop(0.5, '#5c3a21');
    bgGrad.addColorStop(1, '#2c180b');
    worldCtx.fillStyle = bgGrad;
    worldCtx.fillRect(0, 0, INDOOR_WIDTH, INDOOR_HEIGHT);
  }

  // 石砌壁爐燃燒動畫
  const fireFlicker = Math.sin(Date.now() * 0.009) * 4;
  const fireGrad = worldCtx.createRadialGradient(190, 410, 4, 190, 400, 35 + fireFlicker);
  fireGrad.addColorStop(0, '#fffa65');
  fireGrad.addColorStop(0.35, '#ff9f1a');
  fireGrad.addColorStop(0.75, '#ff3838');
  fireGrad.addColorStop(1, 'rgba(255, 56, 56, 0)');
  worldCtx.fillStyle = fireGrad;
  worldCtx.beginPath();
  worldCtx.arc(190, 405, 36 + fireFlicker, 0, Math.PI * 2);
  worldCtx.fill();

  const hearthGlow = worldCtx.createRadialGradient(190, 420, 10, 190, 420, 190);
  hearthGlow.addColorStop(0, 'rgba(255, 159, 26, 0.28)');
  hearthGlow.addColorStop(1, 'rgba(255, 159, 26, 0)');
  worldCtx.fillStyle = hearthGlow;
  worldCtx.beginPath();
  worldCtx.arc(190, 420, 190, 0, Math.PI * 2);
  worldCtx.fill();

  // 吧台亮光與提示
  worldCtx.save();
  worldCtx.font = 'bold 14px "Noto Sans TC", sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.textAlign = 'center';
  worldCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  worldCtx.shadowBlur = 8;
  worldCtx.fillText('★ 傳奇調酒吧台（按 空白鍵 開始調製特飲）★', 530, 310);
  worldCtx.restore();

  // 顧客 NPC
  const cust = CUSTOMERS[game.currentCustomerIndex];
  worldCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  worldCtx.beginPath();
  worldCtx.ellipse(530, 405, 20, 9, 0, 0, Math.PI * 2);
  worldCtx.fill();

  worldCtx.font = '34px serif';
  worldCtx.textAlign = 'center';
  worldCtx.textBaseline = 'middle';
  worldCtx.fillText(cust.avatar, 530, 380);

  worldCtx.fillStyle = 'rgba(30, 18, 10, 0.85)';
  worldCtx.strokeStyle = 'var(--amber-gold)';
  worldCtx.lineWidth = 1.5;
  worldCtx.beginPath();
  worldCtx.roundRect(430, 415, 200, 26, 6);
  worldCtx.fill();
  worldCtx.stroke();

  worldCtx.font = 'bold 12px "Noto Sans TC", sans-serif';
  worldCtx.fillStyle = '#ffeaa7';
  worldCtx.fillText(`${cust.name}（等待品味）`, 530, 428);

  // 出口提示
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.font = 'bold 13px "Noto Sans TC", sans-serif';
  worldCtx.textAlign = 'center';
  worldCtx.fillText('🚪 走至此處按 空白鍵 推門回花園庭院', 550, 655);
}

// -------------------------------------------------------------
// B. 吉卜力手繪全景大世界 (Outdoor Scene)
// -------------------------------------------------------------
function drawOutdoorWorld() {
  // 1. 遠景手繪天際穹頂 (帶有輕微視差滾動 Parallax，增強 3D 空間深邃感)
  const skyParallaxX = game.camera.x * 0.15;
  const skyParallaxY = game.camera.y * 0.15;
  worldCtx.save();
  const skyGrad = worldCtx.createLinearGradient(0, -skyParallaxY, 0, 650 - skyParallaxY);
  skyGrad.addColorStop(0, '#5da8e8');
  skyGrad.addColorStop(0.6, '#9ad0f5');
  skyGrad.addColorStop(1, '#cdebfd');
  worldCtx.fillStyle = skyGrad;
  worldCtx.fillRect(game.camera.x, game.camera.y, DOM.worldCanvas.width, DOM.worldCanvas.height);
  worldCtx.restore();

  // 2. 全景吉卜力手繪大世界背景（覆蓋 4800 x 2200，絕無黑邊空隙）
  if (ASSET_IMAGES.worldMasterBg.complete && ASSET_IMAGES.worldMasterBg.naturalWidth > 0) {
    worldCtx.drawImage(ASSET_IMAGES.worldMasterBg, 0, 450, WORLD_WIDTH, WORLD_HEIGHT - 450);
  } else {
    // 備用柔和水彩草坪
    const groundGrad = worldCtx.createLinearGradient(0, 450, 0, WORLD_HEIGHT);
    groundGrad.addColorStop(0, '#78e08f');
    groundGrad.addColorStop(1, '#20bf6b');
    worldCtx.fillStyle = groundGrad;
    worldCtx.fillRect(0, 450, WORLD_WIDTH, WORLD_HEIGHT - 450);
  }

  // 3. 中央水彩石板漫步大街 (貫穿全地圖，隨視差流動)
  worldCtx.save();
  worldCtx.fillStyle = 'rgba(215, 195, 168, 0.45)';
  worldCtx.beginPath();
  worldCtx.moveTo(100, 1200);
  worldCtx.lineTo(2300, 1220);
  worldCtx.lineTo(4600, 1300);
  worldCtx.lineTo(4600, 1550);
  worldCtx.lineTo(2300, 1500);
  worldCtx.lineTo(100, 1460);
  worldCtx.closePath();
  worldCtx.fill();
  worldCtx.restore();

  // 4. 左側街區手繪工坊商鋪
  STREET_SHOPS.forEach(shop => {
    if (shop.isGhibliStall && ASSET_IMAGES.fruitStall.complete && ASSET_IMAGES.fruitStall.naturalWidth > 0) {
      // 繪製專屬手繪柑橘工坊
      worldCtx.save();
      worldCtx.shadowColor = 'rgba(211, 84, 0, 0.45)';
      worldCtx.shadowBlur = 24;
      worldCtx.drawImage(ASSET_IMAGES.fruitStall, shop.x, shop.y, shop.w, shop.h);
      worldCtx.restore();

      worldCtx.font = 'bold 14px "Noto Sans TC", sans-serif';
      worldCtx.fillStyle = '#d35400';
      worldCtx.textAlign = 'center';
      worldCtx.fillText('★ 柑橘水果工坊 ★', shop.doorX, shop.doorY - 14);
    } else {
      // 其他手繪歐風木構小洋房
      worldCtx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      worldCtx.beginPath();
      worldCtx.roundRect(shop.x + 6, shop.y + 6, shop.w, shop.h, 8);
      worldCtx.fill();

      const colors = {
        rum: { wall: '#843b22', roof: '#b71540', sign: '烈酒蒸餾廠' },
        herbs: { wall: '#276749', roof: '#22543d', sign: '草藥晨露屋' },
        frost: { wall: '#2b6cb0', roof: '#2c5282', sign: '極地薄荷閣' }
      }[shop.id.replace('shop_', '')] || { wall: '#4a5568', roof: '#2d3748', sign: shop.name };

      worldCtx.fillStyle = colors.wall;
      worldCtx.beginPath();
      worldCtx.roundRect(shop.x, shop.y + 30, shop.w, shop.h - 30, 6);
      worldCtx.fill();

      worldCtx.fillStyle = colors.roof;
      worldCtx.beginPath();
      worldCtx.moveTo(shop.x - 10, shop.y + 32);
      worldCtx.lineTo(shop.x + shop.w / 2, shop.y);
      worldCtx.lineTo(shop.x + shop.w + 10, shop.y + 32);
      worldCtx.closePath();
      worldCtx.fill();
      worldCtx.strokeStyle = '#f6c23e';
      worldCtx.lineWidth = 2;
      worldCtx.stroke();

      worldCtx.font = '32px serif';
      worldCtx.textAlign = 'center';
      worldCtx.fillText(shop.icon, shop.x + shop.w / 2, shop.y + 80);
      worldCtx.font = 'bold 13px "Noto Sans TC", sans-serif';
      worldCtx.fillStyle = '#f6c23e';
      worldCtx.fillText(colors.sign, shop.x + shop.w / 2, shop.y + 110);
    }

    // 地面互動光圈
    worldCtx.strokeStyle = 'rgba(246, 194, 62, 0.45)';
    worldCtx.lineWidth = 2;
    worldCtx.beginPath();
    worldCtx.arc(shop.doorX, shop.doorY, 26, 0, Math.PI * 2);
    worldCtx.stroke();
  });

  // 5. 街區漫步 NPC 居民
  TOWN_NPCS.forEach(npc => {
    const bob = Math.sin(npc.animTime * 3) * 2;
    worldCtx.save();
    // 腳底陰影
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    worldCtx.beginPath();
    worldCtx.ellipse(npc.x, npc.y + 12, 14, 6, 0, 0, Math.PI * 2);
    worldCtx.fill();

    worldCtx.font = '30px serif';
    worldCtx.textAlign = 'center';
    worldCtx.textBaseline = 'middle';
    worldCtx.fillText(npc.avatar, npc.x, npc.y + bob - 10);

    // 頭頂可愛心情氣泡
    worldCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    worldCtx.beginPath();
    worldCtx.arc(npc.x + 14, npc.y + bob - 28, 11, 0, Math.PI * 2);
    worldCtx.fill();
    worldCtx.font = '12px serif';
    worldCtx.fillText(npc.bubble, npc.x + 14, npc.y + bob - 28);

    worldCtx.restore();
  });

  // 6. 中央調酒師酒館小店 (手繪溫馨建築)
  if (ASSET_IMAGES.tavernHouse.complete && ASSET_IMAGES.tavernHouse.naturalWidth > 0) {
    worldCtx.save();
    worldCtx.shadowColor = 'rgba(0, 0, 0, 0.35)';
    worldCtx.shadowBlur = 20;
    worldCtx.drawImage(ASSET_IMAGES.tavernHouse, TAVERN_HOUSE.x, TAVERN_HOUSE.y, TAVERN_HOUSE.w, TAVERN_HOUSE.h);
    worldCtx.restore();
  }

  // 煙囪裊裊白煙
  const smokeTime = Date.now() * 0.002;
  worldCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let si = 0; si < 5; si++) {
    const st = (smokeTime + si * 0.8) % 4;
    const sx = 1920 + Math.sin(st * 2 + si) * 16 - st * 12;
    const sy = 820 - st * 55;
    const sr = 12 + st * 10;
    worldCtx.beginPath();
    worldCtx.arc(sx, sy, sr, 0, Math.PI * 2);
    worldCtx.fill();
  }

  // 酒館門前暖光與標籤
  const doorGlow = worldCtx.createRadialGradient(TAVERN_HOUSE.doorX, TAVERN_HOUSE.doorY, 6, TAVERN_HOUSE.doorX, TAVERN_HOUSE.doorY + 20, 75);
  doorGlow.addColorStop(0, 'rgba(255, 220, 100, 0.65)');
  doorGlow.addColorStop(1, 'rgba(255, 220, 100, 0)');
  worldCtx.fillStyle = doorGlow;
  worldCtx.beginPath();
  worldCtx.arc(TAVERN_HOUSE.doorX, TAVERN_HOUSE.doorY + 20, 75, 0, Math.PI * 2);
  worldCtx.fill();

  worldCtx.save();
  worldCtx.font = 'bold 15px "Noto Sans TC", sans-serif';
  worldCtx.fillStyle = '#f6c23e';
  worldCtx.textAlign = 'center';
  worldCtx.shadowColor = 'rgba(0, 0, 0, 0.85)';
  worldCtx.shadowBlur = 8;
  worldCtx.fillText('★ 奇幻調酒館・自家工坊（按 Space 入內）★', TAVERN_HOUSE.doorX, TAVERN_HOUSE.doorY + 45);
  worldCtx.restore();

  // 7. 神秘迷霧古林神聖盤根與寶藏
  if (ASSET_IMAGES.forestRoots.complete && ASSET_IMAGES.forestRoots.naturalWidth > 0) {
    worldCtx.drawImage(ASSET_IMAGES.forestRoots, FOREST_LANDMARK.x - 180, FOREST_LANDMARK.y - 180, FOREST_LANDMARK.w, FOREST_LANDMARK.h);
  }

  const shroomPulse = 0.45 + 0.25 * Math.sin(Date.now() * 0.003);
  const shroomGlow = worldCtx.createRadialGradient(FOREST_LANDMARK.x, FOREST_LANDMARK.y, 10, FOREST_LANDMARK.x, FOREST_LANDMARK.y, 110);
  shroomGlow.addColorStop(0, `rgba(46, 213, 115, ${shroomPulse})`);
  shroomGlow.addColorStop(0.6, `rgba(15, 185, 177, ${shroomPulse * 0.5})`);
  shroomGlow.addColorStop(1, 'rgba(46, 213, 115, 0)');
  worldCtx.fillStyle = shroomGlow;
  worldCtx.beginPath();
  worldCtx.arc(FOREST_LANDMARK.x, FOREST_LANDMARK.y, 110, 0, Math.PI * 2);
  worldCtx.fill();

  // 森林陽光光柱 (God Rays)
  worldCtx.save();
  worldCtx.fillStyle = 'rgba(255, 250, 205, 0.06)';
  for (let rx = 2400; rx < WORLD_WIDTH; rx += 320) {
    worldCtx.beginPath();
    worldCtx.moveTo(rx, 450);
    worldCtx.lineTo(rx + 100, 450);
    worldCtx.lineTo(rx + 240, WORLD_HEIGHT);
    worldCtx.lineTo(rx + 60, WORLD_HEIGHT);
    worldCtx.closePath();
    worldCtx.fill();
  }
  worldCtx.restore();

  // 4 處森林寶箱
  FOREST_CHESTS.forEach(chest => {
    if (!chest.opened) {
      const g = worldCtx.createRadialGradient(chest.x, chest.y, 4, chest.x, chest.y, 36);
      g.addColorStop(0, 'rgba(246, 194, 62, 0.75)');
      g.addColorStop(1, 'rgba(246, 194, 62, 0)');
      worldCtx.fillStyle = g;
      worldCtx.beginPath();
      worldCtx.arc(chest.x, chest.y, 36, 0, Math.PI * 2);
      worldCtx.fill();
    }
    worldCtx.font = '30px serif';
    worldCtx.textAlign = 'center';
    worldCtx.textBaseline = 'middle';
    worldCtx.fillText(chest.opened ? '📭' : '🎁', chest.x, chest.y);
  });

  // 3 處草藥採集點
  FOREST_HERBS.forEach(herb => {
    if (!herb.gathered) {
      const hg = worldCtx.createRadialGradient(herb.x, herb.y, 3, herb.x, herb.y, 28);
      hg.addColorStop(0, 'rgba(46, 213, 115, 0.7)');
      hg.addColorStop(1, 'rgba(46, 213, 115, 0)');
      worldCtx.fillStyle = hg;
      worldCtx.beginPath();
      worldCtx.arc(herb.x, herb.y, 28, 0, Math.PI * 2);
      worldCtx.fill();

      worldCtx.font = '26px serif';
      worldCtx.textAlign = 'center';
      worldCtx.textBaseline = 'middle';
      worldCtx.fillText(herb.icon, herb.x, herb.y);
    }
  });

  // 古樹樹幹
  FOREST_TREES.forEach(tree => {
    worldCtx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    worldCtx.beginPath();
    worldCtx.ellipse(tree.x, tree.y + tree.trunkR, tree.crownR * 0.8, tree.crownR * 0.35, 0, 0, Math.PI * 2);
    worldCtx.fill();

    worldCtx.fillStyle = '#3a2414';
    worldCtx.beginPath();
    worldCtx.arc(tree.x, tree.y, tree.trunkR, 0, Math.PI * 2);
    worldCtx.fill();
    worldCtx.strokeStyle = '#24140a';
    worldCtx.lineWidth = 2.5;
    worldCtx.stroke();
  });
}

// -------------------------------------------------------------
// C. 樹冠手繪水彩質感（半透明遮蔽）
// -------------------------------------------------------------
function drawTreeCrowns() {
  FOREST_TREES.forEach(tree => {
    worldCtx.save();
    worldCtx.globalAlpha = tree.currentAlpha;

    const cy = tree.y - 35;
    const leafClusters = [
      { ox: 0, oy: 0, r: tree.crownR },
      { ox: -tree.crownR * 0.35, oy: -tree.crownR * 0.25, r: tree.crownR * 0.65 },
      { ox: tree.crownR * 0.35, oy: -tree.crownR * 0.2, r: tree.crownR * 0.65 }
    ];

    leafClusters.forEach((cl) => {
      const g = worldCtx.createRadialGradient(tree.x + cl.ox, cy + cl.oy, 6, tree.x + cl.ox, cy + cl.oy, cl.r);
      g.addColorStop(0, '#26de81');
      g.addColorStop(0.65, '#20bf6b');
      g.addColorStop(1, '#0f7546');
      worldCtx.fillStyle = g;
      worldCtx.beginPath();
      worldCtx.arc(tree.x + cl.ox, cy + cl.oy, cl.r, 0, Math.PI * 2);
      worldCtx.fill();
    });

    worldCtx.strokeStyle = 'rgba(38, 222, 129, 0.45)';
    worldCtx.lineWidth = 2;
    worldCtx.stroke();

    worldCtx.restore();
  });
}

// -------------------------------------------------------------
// D. 主角調酒師手繪精緻造型 (遠近空間縮放透視 + 羽毛禮帽 + 提燈光錐)
// -------------------------------------------------------------
function drawPlayer() {
  const p = game.player;

  // 空間透視景深縮放（在長街深處為 0.78x，在近處為 1.22x）
  const depthRatio = Math.max(0, Math.min(1, (p.y - 650) / (WORLD_HEIGHT - 850)));
  const scale = 0.78 + depthRatio * 0.44;

  const bobY = Math.sin(p.walkAnimTime) * 3.5;
  const legSwing = Math.sin(p.walkAnimTime) * 8;
  const isMoving = Math.hypot(p.targetX ? (p.targetX - p.x) : 0, p.targetY ? (p.targetY - p.y) : 0) > 2 ||
                   game.keys.w || game.keys.s || game.keys.a || game.keys.d ||
                   Math.hypot(game.joystickVector.x, game.joystickVector.y) > 0.1;

  worldCtx.save();
  worldCtx.translate(p.x, p.y);
  worldCtx.scale(scale, scale);

  // 水平朝向鏡像翻轉 (Facing Left / Right)
  const isFacingLeft = Math.cos(p.angle) < -0.1;
  if (isFacingLeft) {
    worldCtx.scale(-1, 1);
  }

  // 1. 腳底水彩柔和陰影
  worldCtx.fillStyle = 'rgba(20, 30, 20, 0.38)';
  worldCtx.beginPath();
  worldCtx.ellipse(0, 20, 18, 8, 0, 0, Math.PI * 2);
  worldCtx.fill();

  // 2. 手提魔燈柔和光錐 (照亮前方石板地面)
  const lanternX = 16;
  const lanternY = 4 + bobY + Math.sin(p.walkAnimTime * 0.8) * 3;
  worldCtx.save();
  const lightGrad = worldCtx.createRadialGradient(lanternX, lanternY, 4, lanternX, lanternY, 130);
  lightGrad.addColorStop(0, 'rgba(255, 230, 140, 0.55)');
  lightGrad.addColorStop(0.5, 'rgba(255, 180, 50, 0.22)');
  lightGrad.addColorStop(1, 'rgba(255, 180, 50, 0)');
  worldCtx.fillStyle = lightGrad;
  worldCtx.beginPath();
  worldCtx.arc(lanternX, lanternY, 130, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.restore();

  // 3. 雙腿走動踩踏邁步動畫
  worldCtx.strokeStyle = '#2c3e50'; // 深灰調酒長褲
  worldCtx.lineWidth = 5;
  worldCtx.lineCap = 'round';
  worldCtx.beginPath();
  worldCtx.moveTo(-4, 10 + bobY);
  worldCtx.lineTo(-4 - (isMoving ? legSwing : 0), 20);
  worldCtx.stroke();

  worldCtx.beginPath();
  worldCtx.moveTo(4, 10 + bobY);
  worldCtx.lineTo(4 + (isMoving ? legSwing : 0), 20);
  worldCtx.stroke();

  // 4. 調酒師身軀 (酒紅馬甲 + 白襯衫)
  worldCtx.fillStyle = '#ffffff'; // 襯衫底色
  worldCtx.beginPath();
  worldCtx.roundRect(-8, -8 + bobY, 16, 18, 4);
  worldCtx.fill();

  worldCtx.fillStyle = '#800c2a'; // 深酒紅修身背心
  worldCtx.beginPath();
  worldCtx.roundRect(-7, -5 + bobY, 14, 15, 3);
  worldCtx.fill();

  // 鮮紅蝴蝶結領結
  worldCtx.fillStyle = '#e74c3c';
  worldCtx.beginPath();
  worldCtx.arc(-2, -5 + bobY, 2.5, 0, Math.PI * 2);
  worldCtx.arc(2, -5 + bobY, 2.5, 0, Math.PI * 2);
  worldCtx.fill();

  // 5. 調酒師頭部與面容
  worldCtx.fillStyle = '#fce2c4'; // 溫潤膚色
  worldCtx.beginPath();
  worldCtx.arc(0, -15 + bobY, 7.5, 0, Math.PI * 2);
  worldCtx.fill();

  worldCtx.fillStyle = '#2c3e50';
  worldCtx.beginPath();
  worldCtx.arc(3, -15 + bobY, 1.2, 0, Math.PI * 2);
  worldCtx.fill();

  // 6. 調酒師羽毛高禮帽
  worldCtx.fillStyle = '#2d3436'; // 帽簷
  worldCtx.beginPath();
  worldCtx.ellipse(0, -21 + bobY, 13, 3.5, 0, 0, Math.PI * 2);
  worldCtx.fill();

  worldCtx.fillStyle = '#2d3436'; // 帽身
  worldCtx.beginPath();
  worldCtx.roundRect(-7, -32 + bobY, 14, 12, [3, 3, 0, 0]);
  worldCtx.fill();

  worldCtx.fillStyle = '#f1c40f'; // 金色絲帶
  worldCtx.fillRect(-7, -23 + bobY, 14, 2.5);

  // 翠綠飄逸羽毛
  worldCtx.strokeStyle = '#2ecc71';
  worldCtx.lineWidth = 2.5;
  worldCtx.beginPath();
  worldCtx.moveTo(4, -23 + bobY);
  worldCtx.quadraticCurveTo(8, -34 + bobY, 6, -38 + bobY);
  worldCtx.stroke();

  // 7. 手提黃銅魔燈
  worldCtx.strokeStyle = '#d35400';
  worldCtx.lineWidth = 1.8;
  worldCtx.beginPath();
  worldCtx.moveTo(7, 0 + bobY);
  worldCtx.lineTo(lanternX, lanternY - 7);
  worldCtx.stroke();

  worldCtx.fillStyle = '#f39c12';
  worldCtx.fillRect(lanternX - 4, lanternY - 7, 8, 3);

  worldCtx.fillStyle = '#fff275';
  worldCtx.beginPath();
  worldCtx.roundRect(lanternX - 3.5, lanternY - 4, 7, 8, 2);
  worldCtx.fill();

  worldCtx.strokeStyle = '#e67e22';
  worldCtx.lineWidth = 1;
  worldCtx.strokeRect(lanternX - 3.5, lanternY - 4, 7, 8);

  worldCtx.restore();

  // 8. 引路螢火小精靈（自由飄舞）
  worldCtx.save();
  worldCtx.fillStyle = 'rgba(0, 230, 230, 0.95)';
  worldCtx.shadowColor = '#00ffff';
  worldCtx.shadowBlur = 12;
  worldCtx.beginPath();
  worldCtx.arc(p.fairyX, p.fairyY, 4.5, 0, Math.PI * 2);
  worldCtx.fill();
  worldCtx.restore();
}

function drawAmbientParticles() {
  worldCtx.save();
  AMBIENT_PARTICLES.forEach(p => {
    if (p.type === 'leaf') {
      worldCtx.fillStyle = 'rgba(46, 204, 113, 0.45)';
      worldCtx.beginPath();
      worldCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      worldCtx.fill();
    } else if (p.type === 'spore') {
      worldCtx.fillStyle = 'rgba(241, 196, 15, 0.55)';
      worldCtx.beginPath();
      worldCtx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      worldCtx.fill();
    } else {
      worldCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      worldCtx.lineWidth = 1;
      worldCtx.beginPath();
      worldCtx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
      worldCtx.stroke();
    }
  });
  worldCtx.restore();
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
      <div class="ing-icon">${item.icon}</div>
      <div class="ing-name">${item.name}</div>
      <div class="ing-stock">存量: ${stock}</div>
    `;

    card.addEventListener('click', () => {
      if (stock <= 0) return;
      game.selectedIngredient = item.id;
      renderBartenderIngredients();
    });

    DOM.ingredientGrid.appendChild(card);
  });

  if (!game.selectedIngredient && firstValid) {
    game.selectedIngredient = firstValid;
    renderBartenderIngredients();
  }
}

// 長按倒酒實作
function startPouring() {
  if (!game.selectedIngredient) return;
  if ((game.inventory[game.selectedIngredient] || 0) <= 0) return;
  if (game.isPouring) return;

  game.isPouring = true;
  window.soundEngine.startPouring();

  game.pourTimer = setInterval(() => {
    const totalVol = game.glassLayers.reduce((acc, l) => acc + l.volume, 0);
    if (totalVol >= game.glassCapacity) {
      stopPouring();
      return;
    }

    const item = INGREDIENTS[game.selectedIngredient];
    const topLayer = game.glassLayers[game.glassLayers.length - 1];

    if (topLayer && topLayer.id === item.id) {
      topLayer.volume += 2;
    } else {
      game.glassLayers.push({
        id: item.id,
        name: item.name,
        color: item.color,
        volume: 2,
        flavors: { ...item.flavors }
      });
    }

    drawCocktailGlass();
    updateFlavorHUD();
  }, 60);
}

function stopPouring() {
  if (!game.isPouring) return;
  game.isPouring = false;
  clearInterval(game.pourTimer);
  game.pourTimer = null;
  window.soundEngine.stopPouring();
}

DOM.pourBtn.addEventListener('mousedown', startPouring);
window.addEventListener('mouseup', stopPouring);
DOM.pourBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startPouring(); });
window.addEventListener('touchend', stopPouring);

DOM.resetDrinkBtn.addEventListener('click', () => {
  game.glassLayers = [];
  drawCocktailGlass();
  updateFlavorHUD();
});

function drawCocktailGlass() {
  cocktailCtx.clearRect(0, 0, DOM.cocktailCanvas.width, DOM.cocktailCanvas.height);
  const totalVol = game.glassLayers.reduce((acc, l) => acc + l.volume, 0);
  DOM.glassVolumeText.textContent = `${Math.min(game.glassCapacity, Math.round(totalVol))} / ${game.glassCapacity} ml`;

  // 玻璃杯邊框外形
  cocktailCtx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  cocktailCtx.lineWidth = 3;
  cocktailCtx.strokeRect(30, 20, 140, 250);

  // 液體層層堆疊
  let currentY = 270;
  game.glassLayers.forEach(layer => {
    const layerH = (layer.volume / game.glassCapacity) * 250;
    const topY = currentY - layerH;

    cocktailCtx.fillStyle = layer.color;
    cocktailCtx.fillRect(32, topY, 136, layerH);

    // 液體分層交界微光
    cocktailCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    cocktailCtx.fillRect(32, topY, 136, 2);

    currentY = topY;
  });

  // 氣泡湧動微粒
  if (game.isPouring && totalVol > 0) {
    cocktailCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    for (let i = 0; i < 6; i++) {
      const bx = 36 + Math.random() * 128;
      const by = 265 - Math.random() * ((totalVol / game.glassCapacity) * 240);
      cocktailCtx.beginPath();
      cocktailCtx.arc(bx, by, 2 + Math.random() * 2, 0, Math.PI * 2);
      cocktailCtx.fill();
    }
  }
}

function updateFlavorHUD() {
  const totals = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  const totalVol = game.glassLayers.reduce((acc, l) => acc + l.volume, 0) || 1;

  game.glassLayers.forEach(l => {
    const weight = l.volume / totalVol;
    Object.keys(totals).forEach(k => {
      totals[k] += (l.flavors[k] || 0) * weight * 3.5;
    });
  });

  DOM.hudSweet.style.width = `${Math.min(100, totals.sweet * 14)}%`;
  DOM.hudSour.style.width = `${Math.min(100, totals.sour * 14)}%`;
  DOM.hudSpirit.style.width = `${Math.min(100, totals.spirit * 14)}%`;
  DOM.hudMagic.style.width = `${Math.min(100, totals.magic * 14)}%`;
  DOM.hudSpicy.style.width = `${Math.min(100, totals.spicy * 14)}%`;
}

// 結算出品與三維評鑑算法
DOM.finishDrinkBtn.addEventListener('click', () => {
  const totalVol = game.glassLayers.reduce((acc, l) => acc + l.volume, 0);
  if (totalVol < 15) {
    alert('酒杯中液體太少，請再注入一些原料！');
    return;
  }

  // 扣除調酒用量
  game.glassLayers.forEach(layer => {
    if (game.inventory[layer.id]) {
      game.inventory[layer.id] = Math.max(0, game.inventory[layer.id] - 1);
    }
  });

  const cust = CUSTOMERS[game.currentCustomerIndex];
  const layerCount = game.glassLayers.length;

  // 1. 視覺分層星級
  let visualStars = 1;
  if (layerCount >= 2) visualStars = 2;
  if (layerCount >= 3) visualStars = 3;

  // 2. 風味契合度星級
  const totals = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  game.glassLayers.forEach(l => {
    const w = l.volume / totalVol;
    Object.keys(totals).forEach(k => {
      totals[k] += (l.flavors[k] || 0) * w * 3.5;
    });
  });

  let matchScore = 0;
  let targetScore = 0;
  Object.entries(cust.preferred).forEach(([flv, req]) => {
    targetScore += req;
    matchScore += Math.min(req, totals[flv] || 0);
  });
  const flavorRatio = targetScore > 0 ? matchScore / targetScore : 1;
  let flavorStars = 1;
  if (flavorRatio > 0.45) flavorStars = 2;
  if (flavorRatio > 0.8) flavorStars = 3;

  // 3. 倒酒精準度星級
  let precisionStars = 2;
  if (totalVol >= 85 && totalVol <= 100) precisionStars = 3;
  if (totalVol < 60) precisionStars = 1;

  // 命名特調酒品
  let drinkName = '原創微醺特調';
  let drinkTier = '★ 匠心之作 ★';
  if (totals.magic >= 5 && layerCount >= 2) {
    drinkName = '極光之夜';
    drinkTier = '★★★ 傳奇秘釀 ★★★';
  } else if (totals.spirit >= 4 && totals.spicy >= 3) {
    drinkName = '熔岩心跳';
    drinkTier = '★★ 狂野特選 ★★';
  } else if (totals.sweet >= 5 && totals.sour >= 2) {
    drinkName = '月影甘泉';
    drinkTier = '★★ 清雅仙品 ★★';
  } else if (game.glassLayers.some(l => l.id === 'glowing_shroom' || l.id === 'fairy_tear')) {
    drinkName = '幽谷幻精靈';
    drinkTier = '★★★ 秘傳仙露 ★★★';
  } else if (game.glassLayers.some(l => l.id === 'star_fruit') && totalVol >= 90) {
    drinkName = '星空詠嘆調';
    drinkTier = '★★★ 璀璨奇蹟 ★★★';
  }

  game.unlockedRecipes.add(drinkName);

  // 金幣與聲望結算
  const baseGold = 35 + layerCount * 12;
  const totalStars = visualStars + flavorStars + precisionStars;
  const earnGold = Math.round(baseGold * (totalStars / 9) * cust.tipBonus);
  const earnRep = totalStars >= 7 ? 6 : (totalStars >= 5 ? 4 : 2);
  const earnPts = totalStars * 5;

  game.gold += earnGold;
  game.reputation += earnRep;
  game.points += earnPts;

  // 顧客回饋評語
  let comment = `「這杯特調風味很獨特！謝謝招待！」`;
  if (totalStars >= 8) {
    comment = `「不可思議！這正是我夢寐以求的夢幻味道，完美分層與香氣讓我陶醉！」`;
  } else if (totalStars <= 4) {
    comment = `「嗯... 味道稍微跟我想像中有些出入，不過還是感謝你的用心。」`;
  }

  // 彈窗呈現
  DOM.resDrinkName.textContent = drinkName;
  DOM.resDrinkTier.textContent = drinkTier;
  DOM.resVisualStars.textContent = '★'.repeat(visualStars) + '☆'.repeat(3 - visualStars);
  DOM.resFlavorStars.textContent = '★'.repeat(flavorStars) + '☆'.repeat(3 - flavorStars);
  DOM.resPrecisionStars.textContent = '★'.repeat(precisionStars) + '☆'.repeat(3 - precisionStars);

  DOM.resNpcAvatar.textContent = cust.avatar;
  DOM.resNpcName.textContent = cust.name;
  DOM.resNpcComment.textContent = comment;

  DOM.resEarnGold.textContent = `+${earnGold}`;
  DOM.resEarnRep.textContent = `+${earnRep}`;
  DOM.resEarnPts.textContent = `+${earnPts}`;

  updateResourceDisplays();
  window.soundEngine.playFanfare();

  DOM.bartenderModal.classList.add('hidden');
  DOM.resultModal.classList.remove('hidden');

  // 下一位顧客輪轉
  game.currentCustomerIndex = (game.currentCustomerIndex + 1) % CUSTOMERS.length;
  game.glassLayers = [];
});

DOM.confirmResultBtn.addEventListener('click', () => {
  DOM.resultModal.classList.add('hidden');
});

// ==================== 10. 市集店鋪與圖鑑 ====================

function openMarketModal(shopId) {
  const shop = STREET_SHOPS.find(s => s.id === shopId) || STREET_SHOPS[0];
  DOM.shopModalIcon.textContent = shop.icon;
  DOM.shopModalName.textContent = shop.name;
  DOM.shopModalIntro.textContent = shop.intro;

  DOM.marketGrid.innerHTML = '';
  const shopItems = Object.values(INGREDIENTS).filter(item => item.shopId === shop.id);

  shopItems.forEach(item => {
    const canAfford = game.gold >= item.price;
    const repUnlocked = game.reputation >= item.repReq;

    const card = document.createElement('div');
    card.className = 'market-item-card';

    card.innerHTML = `
      <div class="market-item-header">
        <span class="m-icon">${item.icon}</span>
        <div>
          <h4 class="m-name">${item.name}</h4>
          <span class="m-price">🪙 ${item.price} 金幣</span>
        </div>
      </div>
      <p class="m-desc">${item.desc}</p>
      <div class="m-meta">
        <span>背包現存: ${game.inventory[item.id] || 0}</span>
        <span>${repUnlocked ? '已解鎖' : `需要聲望: ${item.repReq}`}</span>
      </div>
      <button class="fantasy-btn ${(!canAfford || !repUnlocked) ? 'disabled' : 'primary-glow'}" style="width:100%;margin-top:10px;" ${(!canAfford || !repUnlocked) ? 'disabled' : ''}>
        ${!repUnlocked ? '聲望不足' : (!canAfford ? '金幣不足' : '購入原料')}
      </button>
    `;

    const buyBtn = card.querySelector('button');
    buyBtn.addEventListener('click', () => {
      if (game.gold >= item.price && repUnlocked) {
        game.gold -= item.price;
        game.inventory[item.id] = (game.inventory[item.id] || 0) + 1;
        window.soundEngine.playCoin();
        updateResourceDisplays();
        openMarketModal(shopId);
      }
    });

    DOM.marketGrid.appendChild(card);
  });

  DOM.marketModal.classList.remove('hidden');
}

DOM.closeMarketBtn.addEventListener('click', () => {
  DOM.marketModal.classList.add('hidden');
});

// 酒譜秘籍圖鑑
DOM.recipeBookBtn.addEventListener('click', () => {
  DOM.recipeGrid.innerHTML = '';
  RECIPES_CATALOG.forEach(r => {
    const isUnlocked = game.unlockedRecipes.has(r.name);
    const card = document.createElement('div');
    card.className = `recipe-card ${isUnlocked ? 'unlocked' : 'locked'}`;
    card.innerHTML = `
      <div style="font-size:1.6rem;margin-bottom:6px;">${isUnlocked ? r.icon : '🔒'}</div>
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

// ==================== 11. 主遊戲循環與安全啟動 ====================

function gameLoop() {
  updatePlayer();
  drawWorld();
  requestAnimationFrame(gameLoop);
}

function initGame() {
  updateResourceDisplays();
  requestAnimationFrame(gameLoop);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initGame();
} else {
  window.addEventListener('DOMContentLoaded', initGame);
}
