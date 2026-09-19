/**
 * 奇幻調酒館 (Fantasy Bartender) - 真三維 (3D) 沉浸式世界與調酒工坊
 * 基於 Three.js 打造全真 3D 空間漫步（Minecraft 式身後第三人稱視角）
 * 包含：3D 星光市集街道、酒館庭院莊園、廣闊神秘古林、動態居民NPC、真實發光提燈與流暢調酒閉環
 */

// ==================== 1. 原料、酒譜與顧客數據 ====================

const INGREDIENTS = {
  moon_syrup: { id: 'moon_syrup', name: '月光糖漿', icon: '🍯', price: 15, repReq: 0, color: '#f6e58d', flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 }, desc: '柑橘水果工坊特釀，入口溫潤甘甜。', shopId: 'shop_citrus' },
  dawn_water: { id: 'dawn_water', name: '晨露純水', icon: '💧', price: 10, repReq: 0, color: '#7ed6df', flavors: { sweet: 1, sour: 2, spirit: 0, magic: 0, spicy: 0 }, desc: '花苞採集純淨晨露，微酸沁涼。', shopId: 'shop_herbs' },
  abyss_rum: { id: 'abyss_rum', name: '深淵烈酒', icon: '🍷', price: 25, repReq: 0, color: '#e056fd', flavors: { sweet: 0, sour: 0, spirit: 3, magic: 1, spicy: 1 }, desc: '地下熔岩烈火蒸餾，微醺狂烈。', shopId: 'shop_rum' },
  star_fruit: { id: 'star_fruit', name: '星輝果萃', icon: '✨', price: 20, repReq: 10, color: '#ffbe76', flavors: { sweet: 2, sour: 2, spirit: 0, magic: 2, spicy: 0 }, desc: '柑橘鋪鮮採星辰果，滿溢魔法流光。', shopId: 'shop_citrus' },
  frost_mint: { id: 'frost_mint', name: '極地薄荷霜', icon: '🌿', price: 30, repReq: 25, color: '#686de0', flavors: { sweet: 0, sour: 3, spirit: 1, magic: 1, spicy: 0 }, desc: '冰原凝鍊薄荷冰霜，沁涼透骨。', shopId: 'shop_frost' },
  dragon_chili: { id: 'dragon_chili', name: '巨龍朝天椒', icon: '🌶️', price: 45, repReq: 40, color: '#ff4757', flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 }, desc: '龍息炙烤朝天椒，喉中爆發辛香。', shopId: 'shop_rum' },
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
  { name: '翡翠妖精之露', requirement: '在森林古樹後寶箱獲得秘籍', tags: '古林秘籍 / 珍品', icon: '📜' },
  { name: '冒險家特飲', requirement: '任一混調出品之基礎特飲', tags: '常規 / 家常', icon: '🍹' }
];

const CHEST_REWARD_POOL = [
  { type: 'recipe', name: '翡翠妖精之露', desc: '在古橡樹盤根交錯深處發現的手繪羊皮古卷，解鎖了失落的高階特調酒譜！', pts: 35, gold: 45 },
  { type: 'recipe', name: '幽谷幻精靈', desc: '在生物光蘑菇樹蔭下掘得前代調酒師秘錄，已完整收錄至圖鑑！', pts: 30, gold: 40 },
  { type: 'item', itemId: 'fairy_tear', count: 2, desc: '寶箱中盛放著清澈璀璨的妖精之淚靈液！', pts: 20, gold: 35 },
  { type: 'item', itemId: 'phoenix_ember', count: 2, desc: '箱中封存著熾烈的不死鳥餘燼，散發溫暖金紅微光！', pts: 25, gold: 50 },
  { type: 'item', itemId: 'glowing_shroom', count: 3, desc: '箱內生長著整簇剛採摘的夜光幽魂菇！', pts: 15, gold: 25 }
];

// 3D 空間店鋪位置 (左側星光小鎮大道)
const STREET_SHOPS_3D = [
  { id: 'shop_citrus', name: '切片柑橘糖果工坊', icon: '🍊', x: -28, z: -10, doorX: -28, doorZ: -5, color: 0xf39c12, intro: '切片柑橘造型木質手繪工坊，掛滿果籃與七彩琉璃糖漿罐。' },
  { id: 'shop_rum', name: '深淵烈酒蒸餾廠', icon: '🍷', x: -48, z: -10, doorX: -48, doorZ: -5, color: 0x8b0000, intro: '紅磚大煙囪手繪蒸餾廠，飄散著濃郁烈酒與橡木香。' },
  { id: 'shop_herbs', name: '精靈香草晨露屋', icon: '🌿', x: -36, z: 10, doorX: -36, doorZ: 5, color: 0x27ae60, intro: '綠藤纏繞的草藥小木屋，販售純淨晨露與草藥萃取。' },
  { id: 'shop_frost', name: '極地薄荷霜閣', icon: '🧊', x: -56, z: 10, doorX: -56, doorZ: 5, color: 0x2980b9, intro: '屋簷結著晶瑩冰柱，提供沁涼透骨的極地薄荷精粹。' }
];

// 3D 森林寶箱位置 (右側神秘古林)
const FOREST_CHESTS_3D = [
  { id: 'chest_roots', name: '盤根老樹下的青苔古寶箱', x: 28, z: -6, opened: false, rewardIndex: 0 },
  { id: 'chest_tree_1', name: '幽谷古樹後的珍寶盒', x: 44, z: 10, opened: false, rewardIndex: 1 },
  { id: 'chest_ancient', name: '迷霧古林遺跡秘箱', x: 60, z: -8, opened: false, rewardIndex: 2 },
  { id: 'chest_deep', name: '深林不滅鳥寶藏', x: 74, z: 6, opened: false, rewardIndex: 3 }
];

// 3D 森林特色採集點
const FOREST_HERBS_3D = [
  { id: 'herb_flower', name: '微光陽光花叢', x: 22, z: 8, icon: '🌼', itemId: 'star_fruit', count: 1, ready: true },
  { id: 'herb_shroom', name: '翠光幽靈菇聚落', x: 38, z: -12, icon: '🍄', itemId: 'glowing_shroom', count: 2, ready: true },
  { id: 'herb_tear', name: '古木精靈甘泉', x: 54, z: 12, icon: '💧', itemId: 'fairy_tear', count: 1, ready: true }
];

// 3D 街區居民 NPC
const TOWN_NPCS_3D = [
  { id: 'npc_ellie', name: '小鎮少女 艾莉', type: 'baker', x: -26, z: 2, minX: -34, maxX: -18, speed: 0.035, dir: 1, quote: '「早安！柑橘工坊今天的果醬香氣好濃郁呢～」' },
  { id: 'npc_grum', name: '矮人老爹 葛倫', type: 'dwarf', x: -46, z: -2, minX: -52, maxX: -40, speed: 0.025, dir: 1, quote: '「咕嘟！深淵烈酒的橡木香，才是真男人的味道！」' },
  { id: 'npc_mimi', name: '橘斑小貓 咪咪', type: 'cat', x: -35, z: -1, minX: -40, maxX: -28, speed: 0.045, dir: 1, quote: '「喵嗚～（在溫暖的石板路上伸著懶腰）」' },
  { id: 'npc_scholar', name: '旅行學者 羅納德', type: 'scholar', x: -54, z: 2, minX: -60, maxX: -48, speed: 0.03, dir: -1, quote: '「唔...晨露水與薄荷霜的配比，能激發出極佳的漸變光澤...」' }
];

// ==================== 2. DOM 快取 ====================

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

const cocktailCtx = DOM.cocktailCanvas.getContext('2d');

function isAnyModalOpen() {
  return !DOM.marketModal.classList.contains('hidden') ||
         !DOM.bartenderModal.classList.contains('hidden') ||
         !DOM.resultModal.classList.contains('hidden') ||
         !DOM.recipeBookModal.classList.contains('hidden') ||
         !DOM.chestRewardModal.classList.contains('hidden');
}

// ==================== 3. 遊戲狀態 ====================

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

    // 玩家 3D 運動狀態
    this.playerSpeed = 0.18;
    this.sprintMultiplier = 1.6;
    this.isSprinting = false;
    this.walkAnimTime = 0;
    this.activeInteractable = null;

    this.keys = {
      w: false, a: false, s: false, d: false,
      Shift: false, j: false, ' ': false
    };

    this.cameraPitch = 0.28; // 鏡頭俯仰角
    this.cameraYaw = 0;      // 鏡頭水平角
    this.cameraDistance = 7.5; // 鏡頭身後跟隨距離
  }
}

const game = new GameState();

// ==================== 4. Three.js 真三維場景系統 (融入吉卜力宮崎駿手繪美學) ====================

let scene, camera, renderer;
let playerGroup, playerLanternLight, playerFairyMesh;
let leftLegMesh, rightLegMesh, lanternGroup;
let smokeParticles = [];
let magicFairyAngle = 0;
let fireflyPoints;

// 1. 載入上一版備受喜愛的吉卜力高畫質手繪資產
const textureLoader = new THREE.TextureLoader();
const GHIBLI_TEX = {
  worldMasterBg: textureLoader.load('assets/world_master_bg.jpg'),
  marketStreet: textureLoader.load('assets/market_street.jpg'),
  tavernGrounds: textureLoader.load('assets/tavern_grounds.jpg'),
  tavernHouse: textureLoader.load('assets/tavern_house.jpg'),
  fruitStall: textureLoader.load('assets/fruit_stall.png'),
  forestRoots: textureLoader.load('assets/forest_roots.jpg'),
  enchantedForest: textureLoader.load('assets/enchanted_forest.jpg')
};

// 確保紋理平滑高品質過濾
Object.values(GHIBLI_TEX).forEach(tex => {
  if (tex) {
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
  }
});

function initThreeScene() {
  // 1. 建立 3D 場景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9bd0f5); // 吉卜力晴朗湛藍
  scene.fog = new THREE.FogExp2(0xb8e1fc, 0.006); // 輕柔水彩遠景迷霧，保留遠景手繪巨幕清晰度

  // 2. 鏡頭 (Minecraft/RPG 第三人稱視野)
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 350);

  // 3. WebGL 渲染器 (支援 ACESFilmic 色調映射，呈現宮崎駿動畫電影級豐富溫潤色彩)
  renderer = new THREE.WebGLRenderer({
    canvas: DOM.worldCanvas,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // 4. 吉卜力電影級溫暖光照 (溫暖晨曦陽光 + 天空蔚藍天光)
  const hemiLight = new THREE.HemisphereLight(0xdcf1ff, 0x88b066, 0.85);
  scene.add(hemiLight);

  const sunLight = new THREE.DirectionalLight(0xfffae0, 0.95);
  sunLight.position.set(40, 60, 45);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.width = 2048;
  sunLight.shadow.mapSize.height = 2048;
  sunLight.shadow.camera.near = 10;
  sunLight.shadow.camera.far = 180;
  sunLight.shadow.camera.left = -70;
  sunLight.shadow.camera.right = 70;
  sunLight.shadow.camera.top = 45;
  sunLight.shadow.camera.bottom = -45;
  scene.add(sunLight);

  // 5. 建造吉卜力大世界：手繪遠景穹幕、水彩地面、手繪立體酒館、特色市集、蓬鬆古林與居民
  buildGhibliSkyAndPanorama();
  buildTerrain();
  buildTavern();
  buildStreetShops();
  buildEnchantedForest();
  buildTownNPCs();

  // 6. 建造主角調酒師 3D 形象
  buildPlayerCharacter();

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// -------------------------------------------------------------
// 1. 吉卜力手繪全景遠景穹幕 (Ghibli Panoramic Backdrop & Sky Dome)
// -------------------------------------------------------------
function buildGhibliSkyAndPanorama() {
  // 手繪世界全景大巨幕 (world_master_bg.jpg: 4800x1000)
  // 橫跨整個世界背後，提供真實 3D 移動視差 (Parallax)
  const panoGeo = new THREE.CylinderGeometry(140, 140, 62, 64, 1, true, -Math.PI * 0.72, Math.PI * 1.44);
  const panoMat = new THREE.MeshBasicMaterial({
    map: GHIBLI_TEX.worldMasterBg,
    side: THREE.BackSide,
    depthWrite: false
  });
  const panoMesh = new THREE.Mesh(panoGeo, panoMat);
  panoMesh.position.set(10, 18, 0);
  scene.add(panoMesh);

  // 上方柔和水彩天空穹頂
  const skyGeo = new THREE.SphereGeometry(175, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const skyCanvas = document.createElement('canvas');
  skyCanvas.width = 128;
  skyCanvas.height = 128;
  const sCtx = skyCanvas.getContext('2d');
  const sGrad = sCtx.createLinearGradient(0, 0, 0, 128);
  sGrad.addColorStop(0, '#5da8e8');
  sGrad.addColorStop(0.5, '#9ad0f5');
  sGrad.addColorStop(1, '#cdebfd');
  sCtx.fillStyle = sGrad;
  sCtx.fillRect(0, 0, 128, 128);
  const skyTex = new THREE.CanvasTexture(skyCanvas);
  const skyMat = new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide });
  const skyMesh = new THREE.Mesh(skyGeo, skyMat);
  skyMesh.position.set(10, 0, 0);
  scene.add(skyMesh);
}

// -------------------------------------------------------------
// 2. 水彩手繪風格大地與小溪 (Watercolor Meadow, Cobblestones, Stream & Bridge)
// -------------------------------------------------------------
function createGhibliGroundTexture() {
  const cvs = document.createElement('canvas');
  cvs.width = 1024;
  cvs.height = 1024;
  const ctx = cvs.getContext('2d');

  // 吉卜力草綠水彩基底
  ctx.fillStyle = '#7db55b';
  ctx.fillRect(0, 0, 1024, 1024);

  // 斑駁水彩筆觸光影
  for (let i = 0; i < 700; i++) {
    const gx = Math.random() * 1024;
    const gy = Math.random() * 1024;
    const gr = 8 + Math.random() * 26;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fillStyle = (Math.random() > 0.5) ? 'rgba(146, 198, 110, 0.38)' : 'rgba(88, 138, 58, 0.32)';
    ctx.fill();
  }

  // 手繪星散小白花、金蒲公英與草葉
  for (let i = 0; i < 350; i++) {
    const fx = Math.random() * 1024;
    const fy = Math.random() * 1024;
    ctx.fillStyle = (Math.random() > 0.4) ? '#ffffff' : '#ffd32a';
    ctx.beginPath();
    ctx.arc(fx, fy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(cvs);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 12);
  return tex;
}

function createGhibliStreetTexture() {
  const cvs = document.createElement('canvas');
  cvs.width = 512;
  cvs.height = 512;
  const ctx = cvs.getContext('2d');

  // 暖褐石板底色
  ctx.fillStyle = '#c4b59d';
  ctx.fillRect(0, 0, 512, 512);

  // 手繪石板磚縫隙與鵝卵石塊
  const rows = 8, cols = 8;
  const rw = 512 / cols, rh = 512 / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const ox = (r % 2 === 0) ? 0 : rw * 0.45;
      const x = (c * rw + ox) % 512;
      const y = r * rh;
      
      ctx.fillStyle = (Math.random() > 0.5) ? '#dacbb5' : '#b3a085';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(x + 3, y + 3, rw - 6, rh - 6, 6);
      } else {
        ctx.rect(x + 3, y + 3, rw - 6, rh - 6);
      }
      ctx.fill();

      // 青苔接縫微痕
      if (Math.random() > 0.55) {
        ctx.fillStyle = 'rgba(106, 150, 78, 0.4)';
        ctx.fillRect(x + 2, y + 2, 7, 7);
      }
    }
  }

  const tex = new THREE.CanvasTexture(cvs);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(18, 2);
  return tex;
}

function buildTerrain() {
  // 1. 廣闊水彩手繪綠茵大地
  const groundGeo = new THREE.PlaneGeometry(240, 140, 32, 32);
  const groundTex = createGhibliGroundTexture();
  const groundMat = new THREE.MeshLambertMaterial({ map: groundTex });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);

  // 2. 手繪青石板漫步大街
  const streetGeo = new THREE.PlaneGeometry(160, 8.5);
  const streetTex = createGhibliStreetTexture();
  const streetMat = new THREE.MeshLambertMaterial({ map: streetTex });
  const streetMesh = new THREE.Mesh(streetGeo, streetMat);
  streetMesh.rotation.x = -Math.PI / 2;
  streetMesh.position.set(0, 0.03, 0);
  streetMesh.receiveShadow = true;
  scene.add(streetMesh);

  // 3. 清澈流淌的護城小溪 (碧藍清透水面)
  const streamGeo = new THREE.PlaneGeometry(6.5, 36);
  const streamMat = new THREE.MeshLambertMaterial({
    color: 0x48dbfb,
    transparent: true,
    opacity: 0.85
  });
  const streamMesh = new THREE.Mesh(streamGeo, streamMat);
  streamMesh.rotation.x = -Math.PI / 2;
  streamMesh.position.set(9, 0.04, -4);
  scene.add(streamMesh);

  // 溪邊白卵石點綴
  for (let s = 0; s < 14; s++) {
    const pebble = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.3, 0),
      new THREE.MeshLambertMaterial({ color: 0xecf0f1 })
    );
    pebble.position.set(s % 2 === 0 ? 5.6 : 12.4, 0.2, -18 + s * 2.6);
    scene.add(pebble);
  }

  // 4. 木質拱橋 (跨越小溪)
  const bridgeGeo = new THREE.BoxGeometry(7.5, 0.35, 4.2);
  const bridgeMat = new THREE.MeshLambertMaterial({ color: 0x795548 });
  const bridgeMesh = new THREE.Mesh(bridgeGeo, bridgeMat);
  bridgeMesh.position.set(9, 0.28, 0);
  bridgeMesh.castShadow = true;
  bridgeMesh.receiveShadow = true;
  scene.add(bridgeMesh);

  // 橋兩側扶手
  const railMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
  const leftRail = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.6, 0.15), railMat);
  leftRail.position.set(9, 0.7, -2.0);
  scene.add(leftRail);

  const rightRail = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.6, 0.15), railMat);
  rightRail.position.set(9, 0.7, 2.0);
  scene.add(rightRail);
}

// -------------------------------------------------------------
// 3. 建造吉卜力雙層木造調酒師酒館 (Tavern House)
// -------------------------------------------------------------
let tavernHouseMesh;
function buildTavern() {
  const tavernGroup = new THREE.Group();
  tavernGroup.position.set(0, 0, -15);

  // 1. 酒館本體 (主正面覆以吉卜力手繪酒館紋理 tavernHouse)
  const wallMat = new THREE.MeshLambertMaterial({ color: 0xfbf7ed });
  const frontFacadeMat = new THREE.MeshLambertMaterial({
    map: GHIBLI_TEX.tavernHouse
  });

  // 主屋體 (立方體，正面貼上手繪酒館立面)
  const materials = [
    wallMat, wallMat, wallMat, wallMat,
    frontFacadeMat, // 正面 (Z+)
    wallMat
  ];
  const bodyGeo = new THREE.BoxGeometry(14, 7.5, 10);
  const bodyMesh = new THREE.Mesh(bodyGeo, materials);
  bodyMesh.position.y = 3.75;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  tavernGroup.add(bodyMesh);

  // 2. 溫暖木樑外框 (吉卜力經典半木結構)
  const beamMat = new THREE.MeshLambertMaterial({ color: 0x4e342e });
  const roofMat = new THREE.MeshLambertMaterial({ color: 0x8d4925 }); // 暖紅陶瓦

  // 傾斜雙坡大屋頂
  const roofGeo = new THREE.ConeGeometry(11.5, 4.8, 4);
  const roofMesh = new THREE.Mesh(roofGeo, roofMat);
  roofMesh.position.y = 9.8;
  roofMesh.rotation.y = Math.PI / 4;
  roofMesh.castShadow = true;
  tavernGroup.add(roofMesh);

  // 3. 石砌大煙囪 (冒著手繪白色柴火炊煙)
  const chimneyGeo = new THREE.BoxGeometry(1.8, 6.5, 1.8);
  const chimneyMat = new THREE.MeshLambertMaterial({ color: 0x78909c });
  const chimneyMesh = new THREE.Mesh(chimneyGeo, chimneyMat);
  chimneyMesh.position.set(4.2, 9.6, 2);
  chimneyMesh.castShadow = true;
  tavernGroup.add(chimneyMesh);

  // 4. 門廊與暖光門燈 (PointLight)
  const porchGeo = new THREE.BoxGeometry(4.2, 0.35, 2.2);
  const porchMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
  const porchMesh = new THREE.Mesh(porchGeo, porchMat);
  porchMesh.position.set(0, 0.2, 5.8);
  tavernGroup.add(porchMesh);

  const doorLight = new THREE.PointLight(0xffa726, 2.2, 18);
  doorLight.position.set(0, 3.4, 6.0);
  tavernGroup.add(doorLight);

  // 5. 正門招牌
  const signCanvas = document.createElement('canvas');
  signCanvas.width = 256;
  signCanvas.height = 64;
  const sCtx = signCanvas.getContext('2d');
  sCtx.fillStyle = '#2d1d11';
  sCtx.fillRect(0, 0, 256, 64);
  sCtx.strokeStyle = '#f6c23e';
  sCtx.lineWidth = 4;
  sCtx.strokeRect(4, 4, 248, 56);
  sCtx.fillStyle = '#f6c23e';
  sCtx.font = 'bold 24px sans-serif';
  sCtx.textAlign = 'center';
  sCtx.fillText('★ 奇幻調酒館 ★', 128, 40);

  const signTex = new THREE.CanvasTexture(signCanvas);
  const signMat = new THREE.MeshBasicMaterial({ map: signTex });
  const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.8, 1.25), signMat);
  signMesh.position.set(0, 4.8, 5.25);
  tavernGroup.add(signMesh);

  // 6. 酒館門前常春藤花箱點綴
  const flowerBoxGeo = new THREE.BoxGeometry(3.6, 0.5, 0.6);
  const flowerBoxMat = new THREE.MeshLambertMaterial({ color: 0x43a047 });
  const flowerBox = new THREE.Mesh(flowerBoxGeo, flowerBoxMat);
  flowerBox.position.set(0, 0.6, 5.3);
  tavernGroup.add(flowerBox);

  scene.add(tavernGroup);
  tavernHouseMesh = tavernGroup;
}

// -------------------------------------------------------------
// 4. 建造星光市集特色商鋪 (Street Shops)
// -------------------------------------------------------------
function buildStreetShops() {
  STREET_SHOPS_3D.forEach(shop => {
    const shopGroup = new THREE.Group();
    shopGroup.position.set(shop.x, 0, shop.z);

    const isSouth = shop.z < 0; // 面對街道方向
    const facadeZ = isSouth ? 3.55 : -3.55;
    const awningZ = isSouth ? 4.5 : -4.5;

    // 特色店鋪 1: 柑橘水果工坊 (完美採用吉卜力透明切片柑橘商鋪 fruitStall)
    if (shop.id === 'shop_citrus') {
      const wallGeo = new THREE.BoxGeometry(8, 5.2, 6.8);
      const wallMat = new THREE.MeshLambertMaterial({ color: 0xfef9e7 });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.y = 2.6;
      wallMesh.castShadow = true;
      shopGroup.add(wallMesh);

      // 正面採用透明手繪柑橘商鋪 cutout billboard
      const stallMat = new THREE.MeshLambertMaterial({
        map: GHIBLI_TEX.fruitStall,
        transparent: true,
        alphaTest: 0.15
      });
      const stallMesh = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 5.5), stallMat);
      stallMesh.position.set(0, 2.75, facadeZ + (isSouth ? 0.1 : -0.1));
      if (!isSouth) stallMesh.rotation.y = Math.PI;
      shopGroup.add(stallMesh);

      // 橘色暖條紋斜遮雨棚
      const roofGeo = new THREE.ConeGeometry(6.6, 3.2, 4);
      const roofMesh = new THREE.Mesh(roofGeo, new THREE.MeshLambertMaterial({ color: 0xf39c12 }));
      roofMesh.position.y = 6.8;
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      shopGroup.add(roofMesh);

      // 水果箱道具
      const crateGeo = new THREE.BoxGeometry(1.2, 0.8, 1.0);
      const crateMesh = new THREE.Mesh(crateGeo, new THREE.MeshLambertMaterial({ color: 0xd35400 }));
      crateMesh.position.set(2.4, 0.4, awningZ);
      shopGroup.add(crateMesh);
    } else {
      // 其他特色吉卜力手繪風格工坊
      const wallGeo = new THREE.BoxGeometry(8, 5, 7);
      const wallMat = new THREE.MeshLambertMaterial({
        color: shop.id === 'shop_rum' ? 0xb71540 : (shop.id === 'shop_herbs' ? 0x2e86de : 0x00d2d3)
      });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.y = 2.5;
      wallMesh.castShadow = true;
      shopGroup.add(wallMesh);

      // 斜屋頂
      const roofGeo = new THREE.ConeGeometry(6.5, 3.2, 4);
      const roofMat = new THREE.MeshLambertMaterial({ color: shop.color });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.y = 6.6;
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      shopGroup.add(roofMesh);

      // 店鋪遮陽雨棚
      const awningGeo = new THREE.BoxGeometry(6.2, 0.3, 2.5);
      const awningMat = new THREE.MeshLambertMaterial({ color: shop.color });
      const awningMesh = new THREE.Mesh(awningGeo, awningMat);
      awningMesh.position.set(0, 3, awningZ);
      awningMesh.rotation.x = isSouth ? 0.2 : -0.2;
      shopGroup.add(awningMesh);

      // 深淵烈酒廠專屬：酒桶與銅管
      if (shop.id === 'shop_rum') {
        const barrelGeo = new THREE.CylinderGeometry(0.6, 0.7, 1.2, 8);
        const barrelMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.set(-2.6, 0.6, awningZ);
        shopGroup.add(barrel);
      }
    }

    // 店鋪手繪招牌
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 256;
    sCanvas.height = 64;
    const ctx = sCanvas.getContext('2d');
    ctx.fillStyle = '#2c1e14';
    ctx.fillRect(0, 0, 256, 64);
    ctx.strokeStyle = '#f6c23e';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 248, 56);
    ctx.fillStyle = '#ffeaa7';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${shop.icon} ${shop.name}`, 128, 40);

    const sTex = new THREE.CanvasTexture(sCanvas);
    const sMat = new THREE.MeshBasicMaterial({ map: sTex });
    const sMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.8, 0.95), sMat);
    sMesh.position.set(0, 4.3, awningZ);
    if (!isSouth) sMesh.rotation.y = Math.PI;
    shopGroup.add(sMesh);

    // 店前金色微光光圈 (引導互動)
    const ringGeo = new THREE.RingGeometry(1.2, 2.4, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf6c23e, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.set(0, 0.05, isSouth ? 5.5 : -5.5);
    shopGroup.add(ringMesh);

    scene.add(shopGroup);
  });
}

// -------------------------------------------------------------
// 5. 建造吉卜力蓬鬆雲朵古林、神聖盤根巨木與生物光菇群
// -------------------------------------------------------------
function buildEnchantedForest() {
  // 1. 宮崎駿動畫風「蓬鬆水彩葉團樹」材質
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
  const leavesSunMat = new THREE.MeshLambertMaterial({ color: 0x8bc34a });  // 亮面陽光草綠
  const leavesMidMat = new THREE.MeshLambertMaterial({ color: 0x43a047 });  // 中間色翡翠綠
  const leavesDarkMat = new THREE.MeshLambertMaterial({ color: 0x1b5e20 }); // 深邃森林綠

  // 2. 42 棵分層生長的高聳蓬鬆巨樹 (不再是單調的硬圓錐，而是多球團聚的吉卜力雲朵樹木！)
  for (let i = 0; i < 42; i++) {
    const tx = 16 + (i * 1.6) + Math.sin(i * 3) * 5;
    const tz = (i % 2 === 0 ? 1 : -1) * (8 + (i * 0.7) % 28) + Math.cos(i * 2) * 4;

    const treeGroup = new THREE.Group();
    treeGroup.position.set(tx, 0, tz);

    const treeH = 9 + (i % 4) * 2.5;
    const trunkGeo = new THREE.CylinderGeometry(0.7, 1.2, treeH, 8);
    const trunkMesh = new THREE.Mesh(trunkGeo, trunkMat);
    trunkMesh.position.y = treeH / 2;
    trunkMesh.castShadow = true;
    treeGroup.add(trunkMesh);

    // 吉卜力式雲朵狀蓬鬆樹冠團 (3-4 個有機交疊球體)
    const crownCount = 4;
    for (let c = 0; c < crownCount; c++) {
      const cR = 2.8 + (c % 2) * 0.8;
      const crownGeo = new THREE.DodecahedronGeometry(cR, 1);
      const mat = (c === 0 ? leavesSunMat : (c % 2 === 1 ? leavesMidMat : leavesDarkMat));
      const crownMesh = new THREE.Mesh(crownGeo, mat);
      
      const ox = (c === 1 ? 1.2 : (c === 2 ? -1.2 : 0));
      const oz = (c === 3 ? 1.0 : (c === 2 ? -0.8 : 0));
      crownMesh.position.set(ox, treeH - 1 + c * 1.6, oz);
      crownMesh.castShadow = true;
      treeGroup.add(crownMesh);
    }

    scene.add(treeGroup);
  }

  // 3. 森林深處的神聖盤根古樹 (x: 55, z: 0)
  // 完美運用上一版的 forestRoots 手繪盤根與樹洞
  const sacredTreeGroup = new THREE.Group();
  sacredTreeGroup.position.set(55, 0, 0);

  // 巨大手繪神木樹幹
  const sacredTrunkGeo = new THREE.CylinderGeometry(3.5, 5.2, 18, 12);
  const sacredTrunkMat = new THREE.MeshLambertMaterial({
    map: GHIBLI_TEX.forestRoots
  });
  const sacredTrunk = new THREE.Mesh(sacredTrunkGeo, sacredTrunkMat);
  sacredTrunk.position.y = 9;
  sacredTrunk.castShadow = true;
  sacredTreeGroup.add(sacredTrunk);

  // 巨木頂部浩瀚繁茂雲頂
  for (let s = 0; s < 6; s++) {
    const sCloud = new THREE.Mesh(
      new THREE.DodecahedronGeometry(5.5 + (s % 2), 1),
      s % 2 === 0 ? leavesSunMat : leavesDarkMat
    );
    const sa = (s / 6) * Math.PI * 2;
    sCloud.position.set(Math.cos(sa) * 3.5, 17 + (s % 3) * 1.5, Math.sin(sa) * 3.5);
    sacredTreeGroup.add(sCloud);
  }

  // 神木內部樹洞暖光
  const sacredHollowLight = new THREE.PointLight(0x00d2d3, 2.5, 15);
  sacredHollowLight.position.set(0, 2.5, 2.5);
  sacredTreeGroup.add(sacredHollowLight);

  scene.add(sacredTreeGroup);

  // 4. 生物光斑點夜光蘑菇
  const shroomMatCyan = new THREE.MeshLambertMaterial({ color: 0x00d2d3, emissive: 0x00a8ff, emissiveIntensity: 0.6 });
  const shroomMatViolet = new THREE.MeshLambertMaterial({ color: 0xa55eea, emissive: 0x8854d0, emissiveIntensity: 0.55 });
  for (let m = 0; m < 20; m++) {
    const mx = 20 + m * 3.2;
    const mz = (m % 2 === 0 ? -1 : 1) * (5 + (m * 2) % 18);
    const capGeo = new THREE.SphereGeometry(0.7, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const capMesh = new THREE.Mesh(capGeo, m % 3 === 0 ? shroomMatViolet : shroomMatCyan);
    capMesh.position.set(mx, 0.6, mz);
    scene.add(capMesh);

    const stemGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.6, 6);
    const stemMesh = new THREE.Mesh(stemGeo, new THREE.MeshLambertMaterial({ color: 0xffffff }));
    stemMesh.position.set(mx, 0.3, mz);
    scene.add(stemMesh);
  }

  // 5. 飄逸的森林螢火小精靈粒子 (Fireflies / Forest Motes)
  const fireflyGeo = new THREE.BufferGeometry();
  const fireflyCount = 60;
  const fireflyPos = new Float32Array(fireflyCount * 3);
  for (let f = 0; f < fireflyCount; f++) {
    fireflyPos[f * 3] = 18 + Math.random() * 65;
    fireflyPos[f * 3 + 1] = 1.0 + Math.random() * 6;
    fireflyPos[f * 3 + 2] = -25 + Math.random() * 50;
  }
  fireflyGeo.setAttribute('position', new THREE.BufferAttribute(fireflyPos, 3));
  const fireflyMat = new THREE.PointsMaterial({
    color: 0x7bed9f,
    size: 0.45,
    transparent: true,
    opacity: 0.85
  });
  fireflyPoints = new THREE.Points(fireflyGeo, fireflyMat);
  scene.add(fireflyPoints);

  // 6. 4 處 3D 雕花古老寶箱
  const chestWoodMat = new THREE.MeshLambertMaterial({ color: 0x6d4c41 });
  const chestGoldMat = new THREE.MeshLambertMaterial({ color: 0xf1c40f });
  FOREST_CHESTS_3D.forEach(chest => {
    const cGroup = new THREE.Group();
    cGroup.position.set(chest.x, 0, chest.z);

    const cBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 1.1), chestWoodMat);
    cBody.position.y = 0.5;
    cBody.castShadow = true;
    cGroup.add(cBody);

    const cLid = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 8, 1, false, 0, Math.PI), chestWoodMat);
    cLid.rotation.z = Math.PI / 2;
    cLid.position.set(0, 1.0, 0);
    cLid.castShadow = true;
    cGroup.add(cLid);

    // 金質鎖頭與飾條
    const lock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.3, 0.2), chestGoldMat);
    lock.position.set(0, 0.7, 0.6);
    cGroup.add(lock);

    // 寶箱微光光暈
    const cLight = new THREE.PointLight(0xf1c40f, 1.4, 9);
    cLight.position.set(0, 1.5, 0);
    cGroup.add(cLight);

    scene.add(cGroup);
  });

  // 7. 3 處特色草藥採集點
  FOREST_HERBS_3D.forEach(herb => {
    const hGroup = new THREE.Group();
    hGroup.position.set(herb.x, 0, herb.z);

    const flowerMesh = new THREE.Mesh(new THREE.SphereGeometry(0.55, 8, 8), new THREE.MeshBasicMaterial({ color: 0x2ecc71 }));
    flowerMesh.position.y = 0.6;
    hGroup.add(flowerMesh);

    const fLight = new THREE.PointLight(0x2ecc71, 1.1, 7);
    fLight.position.set(0, 1, 0);
    hGroup.add(fLight);

    scene.add(hGroup);
  });
}

// -------------------------------------------------------------
// 建造 3D 街區 NPC 居民
// -------------------------------------------------------------
const npc3DMeshes = [];
function buildTownNPCs() {
  TOWN_NPCS_3D.forEach(npc => {
    const nGroup = new THREE.Group();
    nGroup.position.set(npc.x, 0, npc.z);

    // 身體
    const bodyMat = new THREE.MeshLambertMaterial({
      color: npc.type === 'cat' ? 0xe67e22 : (npc.type === 'dwarf' ? 0x27ae60 : (npc.type === 'baker' ? 0x3498db : 0x2c3e50))
    });

    if (npc.type === 'cat') {
      const catBody = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), bodyMat);
      catBody.position.y = 0.45;
      catBody.scale.set(1.4, 0.9, 0.9);
      nGroup.add(catBody);

      const catHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), bodyMat);
      catHead.position.set(0.6, 0.6, 0);
      nGroup.add(catHead);
    } else {
      const charH = npc.type === 'dwarf' ? 1.4 : 1.8;
      const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, charH * 0.6, 8), bodyMat);
      bMesh.position.y = charH * 0.5;
      bMesh.castShadow = true;
      nGroup.add(bMesh);

      // 頭部
      const headMat = new THREE.MeshLambertMaterial({ color: 0xfad390 });
      const hMesh = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), headMat);
      hMesh.position.y = charH * 0.85;
      nGroup.add(hMesh);
    }

    scene.add(nGroup);
    npc3DMeshes.push({ data: npc, group: nGroup });
  });
}

// -------------------------------------------------------------
// 建造主角調酒師 3D 模型 (羽毛禮帽、調酒馬甲、發光提燈、雙腿踩踏)
// -------------------------------------------------------------
function buildPlayerCharacter() {
  playerGroup = new THREE.Group();
  playerGroup.position.set(0, 0, 0); // 出生在酒館正門外的大道中央

  // 1. 軀幹與馬甲背心
  const vestMat = new THREE.MeshLambertMaterial({ color: 0x800c2a }); // 深酒紅調酒馬甲
  const shirtMat = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 白襯衫

  const torsoGeo = new THREE.BoxGeometry(0.9, 1.1, 0.55);
  const torsoMesh = new THREE.Mesh(torsoGeo, vestMat);
  torsoMesh.position.y = 1.35;
  torsoMesh.castShadow = true;
  playerGroup.add(torsoMesh);

  // 襯衫領口與領結
  const collarGeo = new THREE.BoxGeometry(0.45, 0.35, 0.58);
  const collarMesh = new THREE.Mesh(collarGeo, shirtMat);
  collarMesh.position.set(0, 1.7, 0);
  playerGroup.add(collarMesh);

  const bowGeo = new THREE.BoxGeometry(0.3, 0.15, 0.64);
  const bowMesh = new THREE.Mesh(bowGeo, new THREE.MeshLambertMaterial({ color: 0xe74c3c }));
  bowMesh.position.set(0, 1.7, 0.05);
  playerGroup.add(bowMesh);

  // 2. 雙腿 (行走邁步踩踏動畫)
  const pantsMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
  const legGeo = new THREE.BoxGeometry(0.32, 0.8, 0.35);

  leftLegMesh = new THREE.Mesh(legGeo, pantsMat);
  leftLegMesh.position.set(-0.24, 0.45, 0);
  leftLegMesh.castShadow = true;
  playerGroup.add(leftLegMesh);

  rightLegMesh = new THREE.Mesh(legGeo, pantsMat);
  rightLegMesh.position.set(0.24, 0.45, 0);
  rightLegMesh.castShadow = true;
  playerGroup.add(rightLegMesh);

  // 3. 調酒師頭部與羽毛禮帽
  const headGeo = new THREE.SphereGeometry(0.38, 12, 12);
  const headMesh = new THREE.Mesh(headGeo, new THREE.MeshLambertMaterial({ color: 0xfad390 }));
  headMesh.position.set(0, 2.15, 0);
  headMesh.castShadow = true;
  playerGroup.add(headMesh);

  // 禮帽帽簷與帽身
  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.08, 16), new THREE.MeshLambertMaterial({ color: 0x2d3436 }));
  hatBrim.position.set(0, 2.45, 0);
  playerGroup.add(hatBrim);

  const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.55, 16), new THREE.MeshLambertMaterial({ color: 0x2d3436 }));
  hatCrown.position.set(0, 2.7, 0);
  playerGroup.add(hatCrown);

  // 金色飾帶與翠綠羽毛
  const hatRibbon = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.12, 16), new THREE.MeshLambertMaterial({ color: 0xf1c40f }));
  hatRibbon.position.set(0, 2.52, 0);
  playerGroup.add(hatRibbon);

  const feather = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.6, 6), new THREE.MeshLambertMaterial({ color: 0x2ecc71 }));
  feather.position.set(0.38, 2.85, 0);
  feather.rotation.z = -0.4;
  playerGroup.add(feather);

  // 4. 手提發光黃銅魔燈 (即時 PointLight 照亮 3D 世界)
  lanternGroup = new THREE.Group();
  lanternGroup.position.set(0.65, 1.1, 0.35);

  const lampFrame = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 6), new THREE.MeshLambertMaterial({ color: 0xd35400 }));
  lampFrame.castShadow = true;
  lanternGroup.add(lampFrame);

  const lampCore = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), new THREE.MeshBasicMaterial({ color: 0xfffa65 }));
  lampCore.position.y = 0.05;
  lanternGroup.add(lampCore);

  playerLanternLight = new THREE.PointLight(0xffa502, 2.2, 16);
  playerLanternLight.position.set(0, 0.1, 0);
  playerLanternLight.castShadow = true;
  lanternGroup.add(playerLanternLight);

  playerGroup.add(lanternGroup);

  // 5. 圍繞隨行的螢火小精靈
  const fairyGeo = new THREE.SphereGeometry(0.14, 8, 8);
  const fairyMat = new THREE.MeshBasicMaterial({ color: 0x00d2d3 });
  playerFairyMesh = new THREE.Mesh(fairyGeo, fairyMat);
  scene.add(playerFairyMesh);

  scene.add(playerGroup);
}

// ==================== 5. 輸入與第三人稱鏡頭控制 ====================

// 鍵盤事件
window.addEventListener('keydown', (e) => {
  const code = e.code;
  const key = (e.key || '').toLowerCase();

  if (code === 'KeyW' || code === 'ArrowUp' || key === 'w') game.keys.w = true;
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a') game.keys.a = true;
  if (code === 'KeyS' || code === 'ArrowDown' || key === 's') game.keys.s = true;
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'd') game.keys.d = true;

  if (code === 'KeyJ' || code === 'ShiftLeft' || code === 'ShiftRight' || key === 'j' || key === 'shift') {
    game.isSprinting = true;
  }

  if (code === 'Space' || key === ' ' || key === 'spacebar') {
    e.preventDefault();
    triggerActiveInteraction();
  }
});

window.addEventListener('keyup', (e) => {
  const code = e.code;
  const key = (e.key || '').toLowerCase();

  if (code === 'KeyW' || code === 'ArrowUp' || key === 'w') game.keys.w = false;
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a') game.keys.a = false;
  if (code === 'KeyS' || code === 'ArrowDown' || key === 's') game.keys.s = false;
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'd') game.keys.d = false;

  if (code === 'KeyJ' || code === 'ShiftLeft' || code === 'ShiftRight' || key === 'j' || key === 'shift') {
    game.isSprinting = false;
  }
});

// 滑鼠拖曳旋轉 3D 視角 (環顧四周)
let isMouseDown = false;
let lastMouseX = 0, lastMouseY = 0;
DOM.worldCanvas.addEventListener('mousedown', (e) => {
  if (isAnyModalOpen()) return;
  isMouseDown = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
});
window.addEventListener('mousemove', (e) => {
  if (!isMouseDown) return;
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  game.cameraYaw -= dx * 0.006;
  game.cameraPitch = Math.max(0.08, Math.min(1.1, game.cameraPitch + dy * 0.005));
});
window.addEventListener('mouseup', () => { isMouseDown = false; });

// 手機極簡虛擬搖桿
let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joyVector = { x: 0, y: 0 };
const maxJoyR = 38;

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
  joyVector.x = sx / maxJoyR;
  joyVector.y = sy / maxJoyR;
}
function joyEnd() {
  joystickActive = false;
  DOM.joystickStick.style.transform = 'translate(0px, 0px)';
  joyVector.x = 0;
  joyVector.y = 0;
}

DOM.joystickZone.addEventListener('mousedown', (e) => joyStart(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => { if (joystickActive) joyMove(e.clientX, e.clientY); });
window.addEventListener('mouseup', joyEnd);
DOM.joystickZone.addEventListener('touchstart', (e) => { if (e.touches.length > 0) joyStart(e.touches[0].clientX, e.touches[0].clientY); });
window.addEventListener('touchmove', (e) => { if (joystickActive && e.touches.length > 0) joyMove(e.touches[0].clientX, e.touches[0].clientY); });
window.addEventListener('touchend', joyEnd);

// ==================== 6. 3D 角色移動與鏡頭跟隨更新 ====================

function update3DPlayer() {
  if (isAnyModalOpen()) return;

  let moveForward = 0;
  let moveSide = 0;

  if (game.keys.w) moveForward += 1;
  if (game.keys.s) moveForward -= 1;
  if (game.keys.a) moveSide -= 1;
  if (game.keys.d) moveSide += 1;

  if (Math.hypot(joyVector.x, joyVector.y) > 0.15) {
    moveForward -= joyVector.y;
    moveSide += joyVector.x;
  }

  const isMoving = Math.hypot(moveForward, moveSide) > 0.1;
  const curSpeed = (game.isSprinting ? game.playerSpeed * game.sprintMultiplier : game.playerSpeed);

  if (isMoving) {
    // 依據鏡頭視角計算真實 3D 移動方向 (Minecraft / 3rd-Person Style)
    const moveAngle = Math.atan2(moveSide, moveForward) + game.cameraYaw;
    const dx = Math.sin(moveAngle) * curSpeed;
    const dz = -Math.cos(moveAngle) * curSpeed;

    const nextX = playerGroup.position.x + dx;
    const nextZ = playerGroup.position.z + dz;

    // 活動範圍邊界約束 (x: -65 ~ 85, z: -28 ~ 28)
    if (nextX >= -65 && nextX <= 85) playerGroup.position.x = nextX;
    if (nextZ >= -28 && nextZ <= 28) playerGroup.position.z = nextZ;

    // 角色面朝移動方向
    playerGroup.rotation.y = moveAngle + Math.PI;

    // 行走雙腿踏步動畫
    game.walkAnimTime += 0.22;
    const legSwing = Math.sin(game.walkAnimTime) * 0.45;
    leftLegMesh.rotation.x = legSwing;
    rightLegMesh.rotation.x = -legSwing;

    // 提燈隨步伐自然擺動
    lanternGroup.rotation.z = Math.sin(game.walkAnimTime * 0.8) * 0.25;
  } else {
    // 靜止呼吸微動
    leftLegMesh.rotation.x = 0;
    rightLegMesh.rotation.x = 0;
    lanternGroup.rotation.z = Math.sin(Date.now() * 0.003) * 0.08;
  }

  // 螢火小精靈飄動飛舞
  magicFairyAngle += 0.05;
  playerFairyMesh.position.x = playerGroup.position.x + Math.sin(magicFairyAngle) * 1.8;
  playerFairyMesh.position.y = 2.2 + Math.cos(magicFairyAngle * 2) * 0.4;
  playerFairyMesh.position.z = playerGroup.position.z + Math.cos(magicFairyAngle) * 1.8;

  // 第三人稱越肩跟隨鏡頭平滑插值 (Smooth 3rd-Person Follow)
  const camDistXZ = game.cameraDistance * Math.cos(game.cameraPitch);
  const camDistY = game.cameraDistance * Math.sin(game.cameraPitch);

  const targetCamX = playerGroup.position.x + Math.sin(game.cameraYaw) * camDistXZ;
  const targetCamY = playerGroup.position.y + camDistY + 1.2;
  const targetCamZ = playerGroup.position.z + Math.cos(game.cameraYaw) * camDistXZ;

  camera.position.x += (targetCamX - camera.position.x) * 0.12;
  camera.position.y += (targetCamY - camera.position.y) * 0.12;
  camera.position.z += (targetCamZ - camera.position.z) * 0.12;

  // 鏡頭聚焦於主角頭頂上方
  camera.lookAt(playerGroup.position.x, playerGroup.position.y + 1.6, playerGroup.position.z);

  // 更新 NPC 漫步
  update3DNPCs();

  // 檢測當前區域與周圍互動項目
  detect3DInteractions();
}

// 更新 3D NPC 散步
function update3DNPCs() {
  npc3DMeshes.forEach(item => {
    const npc = item.data;
    const mesh = item.group;

    // 緩慢踱步
    npc.x += npc.speed * npc.dir;
    mesh.position.x = npc.x;

    if (npc.x >= npc.maxX) {
      npc.dir = -1;
      mesh.rotation.y = -Math.PI / 2;
    } else if (npc.x <= npc.minX) {
      npc.dir = 1;
      mesh.rotation.y = Math.PI / 2;
    }
  });
}

// -------------------------------------------------------------
// 3D 空間互動檢測 (酒館大門、商鋪、寶箱、採集點、NPC)
// -------------------------------------------------------------
function detect3DInteractions() {
  const px = playerGroup.position.x;
  const pz = playerGroup.position.z;

  let closest = null;
  let minDist = 4.2;

  // 1. 酒館大門 (x: 0, z: -9.5)
  const dDoor = Math.hypot(px - 0, pz - (-9.5));
  if (dDoor < 4.5) {
    closest = { type: 'enter_tavern', prompt: '🏠 推門進入奇幻調酒館 (按 空白鍵)' };
  }

  // 2. 街區店鋪
  STREET_SHOPS_3D.forEach(shop => {
    const d = Math.hypot(px - shop.doorX, pz - shop.doorZ);
    if (d < minDist) {
      closest = { type: 'shop', shop: shop, prompt: `🛒 走進 ${shop.name} (按 空白鍵)` };
    }
  });

  // 3. 森林寶箱
  FOREST_CHESTS_3D.forEach(chest => {
    if (chest.opened) return;
    const d = Math.hypot(px - chest.x, pz - chest.z);
    if (d < minDist - 0.5) {
      closest = { type: 'chest', chest: chest, prompt: `🎁 開啟 ${chest.name} (按 空白鍵)` };
    }
  });

  // 4. 森林採集點
  FOREST_HERBS_3D.forEach(herb => {
    if (!herb.ready) return;
    const d = Math.hypot(px - herb.x, pz - herb.z);
    if (d < minDist - 0.8) {
      closest = { type: 'herb', herb: herb, prompt: `🌿 採集 ${herb.name} (按 空白鍵)` };
    }
  });

  // 5. 街區 NPC
  TOWN_NPCS_3D.forEach(npc => {
    const d = Math.hypot(px - npc.x, pz - npc.z);
    if (d < minDist - 1.2) {
      closest = { type: 'npc_chat', npc: npc, prompt: `💬 與 ${npc.name} 交談 (按 空白鍵)` };
    }
  });

  game.activeInteractable = closest;

  // 更新 HUD 區域名稱
  if (px < -15) {
    DOM.currentZoneName.textContent = '🛒 星光夜市・3D 漫步街區';
  } else if (px < 15) {
    DOM.currentZoneName.textContent = '🏠 奇幻酒館・莊園庭院';
  } else if (px < 50) {
    DOM.currentZoneName.textContent = '🌲 神祕微光 3D 古林';
  } else {
    DOM.currentZoneName.textContent = '🌌 迷霧遠古樹海';
  }

  // 浮動互動提示
  if (closest) {
    DOM.promptActionText.textContent = closest.prompt;
    DOM.proximityPrompt.style.left = '50%';
    DOM.proximityPrompt.style.top = '72%';
    DOM.proximityPrompt.classList.remove('hidden');
  } else {
    DOM.proximityPrompt.classList.add('hidden');
  }

  // 森林深處迷霧與心跳
  update3DForestMist(px);
}

function update3DForestMist(px) {
  if (px <= 15) {
    DOM.mistVignette.style.opacity = '0';
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
    scene.fog.density = 0.012;
    return;
  }

  if (px < 50) {
    const t = (px - 15) / 35;
    DOM.mistVignette.style.opacity = `${t * 0.35}`;
    DOM.mistVignette.classList.remove('danger', 'extreme');
    stopHeartbeat();
    scene.fog.density = 0.012 + t * 0.015;
  } else if (px < 70) {
    DOM.mistVignette.classList.add('danger');
    DOM.mistVignette.classList.remove('extreme');
    startHeartbeat(1900, 0.35);
    scene.fog.density = 0.035;
  } else if (px < 82) {
    DOM.mistVignette.classList.remove('danger');
    DOM.mistVignette.classList.add('extreme');
    startHeartbeat(1000, 0.7);
    scene.fog.density = 0.06;
  } else {
    triggerLostIn3DForest();
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

function triggerLostIn3DForest() {
  stopHeartbeat();
  window.soundEngine.playLostSound();
  DOM.lostAlertBanner.classList.add('show');

  Object.keys(game.collectedInCurrentRun).forEach(id => {
    const lostCount = Math.ceil(game.collectedInCurrentRun[id] / 2);
    game.inventory[id] = Math.max(0, (game.inventory[id] || 0) - lostCount);
  });
  game.collectedInCurrentRun = {};

  // 提燈護衛傳送回自家酒館正門大道
  playerGroup.position.set(0, 0, 0);
  game.cameraYaw = 0;

  updateResourceDisplays();
  setTimeout(() => DOM.lostAlertBanner.classList.remove('show'), 3800);
}

// -------------------------------------------------------------
// 觸發互動
// -------------------------------------------------------------
function triggerActiveInteraction() {
  if (!game.activeInteractable) return;
  const target = game.activeInteractable;

  if (target.type === 'enter_tavern') {
    window.soundEngine.playIceClink();
    openBartenderModal();
  } else if (target.type === 'shop') {
    openShopModal(target.shop);
  } else if (target.type === 'chest') {
    openTreasureChest(target.chest);
  } else if (target.type === 'herb') {
    harvestForestHerb(target.herb);
  } else if (target.type === 'npc_chat') {
    showNpcChat(target.npc);
  }
}

function showNpcChat(npc) {
  window.soundEngine.playCoinSound();
  alert(`${npc.name}：\n${npc.quote}`);
}

function harvestForestHerb(herb) {
  herb.ready = false;
  window.soundEngine.playFanfare();
  const item = INGREDIENTS[herb.itemId];
  game.inventory[herb.itemId] = (game.inventory[herb.itemId] || 0) + herb.count;
  game.collectedInCurrentRun[herb.itemId] = (game.collectedInCurrentRun[herb.itemId] || 0) + herb.count;
  game.points += 15;
  updateResourceDisplays();

  DOM.chestRewardType.textContent = '🌿 森林採集收穫';
  DOM.chestRewardTitle.textContent = `${item.icon} ${item.name} x${herb.count}`;
  DOM.chestRewardDesc.textContent = `你在${herb.name}採集到了天然新鮮的特調原料！已收存入背包。`;
  DOM.chestRewardPill.innerHTML = `<span>✨ 靈積分 +15</span><span>🎒 存入調酒背包</span>`;
  DOM.chestRewardModal.classList.remove('hidden');

  setTimeout(() => { herb.ready = true; }, 15000);
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
  const shop = STREET_SHOPS_3D.find(s => s.id === shopId);
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

// ==================== 7. 調酒工坊與結算系統 ====================

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
      <div style="font-size:1.5rem;">${item.icon}</div>
      <strong style="font-size:0.85rem;color:#fff;">${item.name}</strong>
      <div style="font-size:0.7rem;color:var(--crystal-cyan);">庫存: ${stock}</div>
    `;

    card.addEventListener('click', () => {
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

function startPouring() {
  if (game.isPouring || !game.selectedIngredient) return;
  const currentVol = game.glassLayers.reduce((acc, l) => acc + l.volume, 0);
  if (currentVol >= game.glassCapacity) return;

  const stock = game.inventory[game.selectedIngredient] || 0;
  if (stock <= 0) return;

  game.isPouring = true;
  window.soundEngine.startPour();

  game.pourTimer = setInterval(() => {
    const volNow = game.glassLayers.reduce((acc, l) => acc + l.volume, 0);
    if (volNow >= game.glassCapacity) {
      stopPouring();
      return;
    }

    const item = INGREDIENTS[game.selectedIngredient];
    const lastLayer = game.glassLayers[game.glassLayers.length - 1];

    if (lastLayer && lastLayer.id === item.id) {
      lastLayer.volume += 1.5;
    } else {
      game.glassLayers.push({
        id: item.id,
        color: item.color,
        volume: 1.5,
        flavors: { ...item.flavors }
      });
    }

    drawCocktailGlass();
    updateFlavorHUD();
  }, 50);
}

function stopPouring() {
  if (!game.isPouring) return;
  game.isPouring = false;
  window.soundEngine.stopPour();
  if (game.pourTimer) {
    clearInterval(game.pourTimer);
    game.pourTimer = null;
  }

  if (game.selectedIngredient) {
    game.inventory[game.selectedIngredient] = Math.max(0, (game.inventory[game.selectedIngredient] || 0) - 1);
    renderBartenderIngredients();
  }
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

  stopPouring();
  DOM.bartenderModal.classList.add('hidden');

  // 計算風味標籤
  const totals = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  game.glassLayers.forEach(l => {
    Object.keys(totals).forEach(k => {
      totals[k] += (l.flavors[k] || 0) * (l.volume / 10);
    });
  });

  const layerCount = game.glassLayers.length;
  const hasShroom = game.glassLayers.some(l => l.id === 'glowing_shroom');
  const hasTear = game.glassLayers.some(l => l.id === 'fairy_tear');
  const hasStar = game.glassLayers.some(l => l.id === 'star_fruit');

  let drinkName = '冒險家特飲';
  if (totals.magic >= 5 && layerCount >= 2) drinkName = '極光之夜';
  else if (totals.spirit >= 4 && totals.spicy >= 3) drinkName = '熔岩心跳';
  else if (totals.sweet >= 5 && totals.sour >= 2) drinkName = '月影甘泉';
  else if (hasShroom || hasTear) drinkName = '幽谷幻精靈';
  else if (hasStar && totalVol >= 88) drinkName = '星空詠嘆調';
  else if (game.unlockedRecipes.has('翡翠妖精之露')) drinkName = '翡翠妖精之露';

  game.unlockedRecipes.add(drinkName);

  let visualStars = Math.min(5, Math.max(2, Math.floor(layerCount * 1.5) + (totals.magic > 3 ? 1 : 0)));
  let precisionStars = 3;
  if (totalVol >= 90 && totalVol <= 100) precisionStars = 5;
  else if (totalVol >= 75) precisionStars = 4;
  else precisionStars = 2;

  const cust = CUSTOMERS[game.currentCustomerIndex];
  let flavorScore = 2;
  Object.entries(cust.preferred).forEach(([flv, req]) => {
    if (totals[flv] >= req) flavorScore += 1.5;
  });
  let flavorStars = Math.min(5, Math.max(1, Math.round(flavorScore)));

  const baseGold = 35 + Math.round(totalVol * 0.4);
  const totalStars = visualStars + flavorStars + precisionStars;
  const earnedGold = Math.round(baseGold * cust.tipBonus * (totalStars / 12));
  const earnedRep = Math.round(6 + (totalStars - 8) * 1.5);
  const earnedPts = Math.round(15 + totalStars * 3);

  game.gold += earnedGold;
  game.reputation += earnedRep;
  game.points += earnedPts;

  DOM.resDrinkName.textContent = drinkName;
  DOM.resDrinkTier.textContent = totalStars >= 13 ? '傳奇特調 ★★★' : (totalStars >= 10 ? '精緻之釀 ★★' : '清新飲品 ★');
  DOM.resVisualStars.textContent = '★'.repeat(visualStars) + '☆'.repeat(5 - visualStars);
  DOM.resFlavorStars.textContent = '★'.repeat(flavorStars) + '☆'.repeat(5 - flavorStars);
  DOM.resPrecisionStars.textContent = '★'.repeat(precisionStars) + '☆'.repeat(5 - precisionStars);

  DOM.resNpcAvatar.textContent = cust.avatar;
  DOM.resNpcName.textContent = cust.name;
  DOM.resNpcComment.textContent = totalStars >= 12
    ? `「太不可思議了！這杯《${drinkName}》正是我靈魂所尋找的極致滋味！」`
    : `「風味相當不錯，層次也很舒心，謝謝你的招待！」`;

  DOM.resEarnGold.textContent = `+${earnedGold}`;
  DOM.resEarnRep.textContent = `+${earnedRep}`;
  DOM.resEarnPts.textContent = `+${earnedPts}`;

  window.soundEngine.playFanfare();
  updateResourceDisplays();
  DOM.resultModal.classList.remove('hidden');

  game.glassLayers = [];
  game.currentCustomerIndex = (game.currentCustomerIndex + 1) % CUSTOMERS.length;
});

DOM.confirmResultBtn.addEventListener('click', () => {
  DOM.resultModal.classList.add('hidden');
});

// 酒譜秘籍圖鑑
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

// ==================== 8. 主 3D 遊戲循環與安全啟動 ====================

function updateSmokeAndFireflies() {
  // 1. 酒館煙囪炊煙自然飄散
  if (Math.random() < 0.26) {
    const puffGeo = new THREE.DodecahedronGeometry(0.35 + Math.random() * 0.25, 0);
    const puffMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75
    });
    const puff = new THREE.Mesh(puffGeo, puffMat);
    puff.position.set(4.2 + (Math.random() - 0.5) * 0.4, 13.2, -13 + (Math.random() - 0.5) * 0.4);
    scene.add(puff);
    smokeParticles.push({ mesh: puff, life: 1.0 });
  }

  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const p = smokeParticles[i];
    p.life -= 0.012;
    p.mesh.position.y += 0.035;
    p.mesh.position.x += 0.015;
    p.mesh.scale.multiplyScalar(1.015);
    p.mesh.material.opacity = p.life * 0.65;
    if (p.life <= 0) {
      scene.remove(p.mesh);
      smokeParticles.splice(i, 1);
    }
  }

  // 2. 螢火蟲微粒自然起伏懸浮
  if (fireflyPoints && fireflyPoints.geometry && fireflyPoints.geometry.attributes.position) {
    const pos = fireflyPoints.geometry.attributes.position.array;
    const time = Date.now() * 0.0015;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] += Math.sin(time + pos[i]) * 0.015;
    }
    fireflyPoints.geometry.attributes.position.needsUpdate = true;
  }
}

function game3DLoop() {
  try {
    update3DPlayer();
    updateSmokeAndFireflies();
    renderer.render(scene, camera);
  } catch (err) {
    console.warn('3D Loop warning:', err);
  }
  requestAnimationFrame(game3DLoop);
}

function initGame() {
  updateResourceDisplays();
  initThreeScene();
  requestAnimationFrame(game3DLoop);
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initGame();
} else {
  window.addEventListener('DOMContentLoaded', initGame);
}
