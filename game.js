/**
 * 奇幻調酒館 (Fantasy Bartender) - Studio Ghibli 3D WebGL Anime Perspective Engine
 * 1. Three.js 3D WebGL 前進景深視角 (Z-Axis Depth Movement & Vanishing Point Scaling)
 * 2. 吉卜力賽璐珞風格美術 (Ghibli Cel-Shading, Fluffy Clouds, Swaying Foliage & Ambient Particles)
 * 3. 4 大核心視覺場景實裝：
 *    - 場景 1：中央基地 —— 微風酒館正門與露台（第三人稱越肩視角，黃銅風鈴，石板路沿 Z 軸動態延伸）
 *    - 場景 2：左側集市 —— 漫長熱鬧的香料與果香長街（第一/第三人稱可切換，切片柑橘鋪、紫霧香料帳篷）
 *    - 場景 3：右側秘境 —— 幽光巨木與迷霧森林（沉浸式古樹探險，螢火蟲粒子，真實立體迷霧）
 *    - 場景 4：吧台操作核心 —— 第一人稱沉浸式調酒工作台（3D 琉璃杯、漸變流體、冰塊彈跳與氣泡水花）
 * 4. 雙端 (手機橫螢幕 Landscape / 電腦 Desktop) 專屬 UX 與轉屏提醒
 */

// ==================== 1. 資料定義 & 資產預載 ====================

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

// 街區特色店鋪定義 (3D 世界座標)
const STREET_SHOPS_3D = [
  { id: 'shop_rum', name: '深淵烈酒蒸餾廠', icon: '🍷', x: -16, z: -120, intro: '紅磚大煙囪手繪蒸餾廠，飄散著濃郁烈酒與橡木香。' },
  { id: 'shop_citrus', name: '切片柑橘糖果工坊', icon: '🍊', x: -14, z: -55, intro: '切片柑橘造型木質手繪工坊，掛滿果籃與七彩琉璃糖漿罐。' },
  { id: 'shop_herbs', name: '精靈香草晨露屋', icon: '🌿', x: 14, z: -40, intro: '綠藤纏繞的木屋，販售純淨晨露與草藥。' },
  { id: 'shop_frost', name: '極地薄荷霜閣', icon: '🧊', x: 15, z: -100, intro: '屋簷結著晶瑩冰柱，提供沁涼薄荷精粹。' }
];

// 4 處森林寶箱
const FOREST_CHESTS_3D = [
  { id: 'chest_roots', name: '盤根老樹下的古老寶箱', x: 8, z: -260, opened: false, rewardIndex: 0 },
  { id: 'chest_tree_1', name: '微光幽谷古樹後的寶盒', x: -12, z: -210, opened: false, rewardIndex: 1 },
  { id: 'chest_tree_2', name: '紫霧深處青苔寶藏', x: 14, z: -320, opened: false, rewardIndex: 2 },
  { id: 'chest_phoenix', name: '神殿遺跡不滅鳥寶藏', x: -6, z: -410, opened: false, rewardIndex: 3 }
];

// 3 處草藥採集點
const FOREST_HERBS_3D = [
  { id: 'herb_flowers', name: '微光陽光花叢', x: -8, z: -180, icon: '🌼', itemId: 'dawn_water', count: 2, gathered: false },
  { id: 'herb_shrooms', name: '翠光幽靈菇聚落', x: 10, z: -230, icon: '🍄', itemId: 'glowing_shroom', count: 2, gathered: false },
  { id: 'herb_spring', name: '古木精靈甘泉水池', x: -10, z: -290, icon: '💧', itemId: 'fairy_tear', count: 1, gathered: false }
];

// 4 位 NPC
const TOWN_NPCS_3D = [
  { id: 'npc_baker', name: '艾莉', title: '小鎮少女', avatar: '🍞', x: -5, z: -30, chat: '艾莉微笑著說：「今天陽光真好，我烤了熱騰騰的焦糖奶油麵包，要來一塊嗎？」' },
  { id: 'npc_dwarf', name: '葛倫', title: '矮人老爹', avatar: '🧔', x: 6, z: -60, chat: '葛倫拍著小木酒桶大笑：「哈哈！深淵蒸餾廠剛出了新批次烈酒，夠勁夠辣！」' },
  { id: 'npc_cat', name: '咪咪', title: '橘斑花貓', avatar: '🐾', x: -3, z: -15, chat: '咪咪瞇起金黃色眼睛在石板路上打了個滾：「喵嗚～（蹭了蹭你的調酒師提燈）」' },
  { id: 'npc_scholar', name: '羅納德', title: '旅行學者', avatar: '📜', x: 7, z: -90, chat: '羅納德扶了扶金邊眼鏡：「根據古代星象記載，右側古林深處似乎封存著不死鳥的餘燼...」' }
];

// ==================== 2. 遊戲狀態類別 ====================

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
    this.currentCustomerIndex = 0;
    this.unlockedRecipes = new Set(['冒險家特飲']);

    this.glassCapacity = 100;
    this.glassLayers = [];
    this.selectedIngredient = null;
    this.isPouring = false;
    this.pourInterval = null;

    this.cameraMode = '3rd'; // '3rd' (第三人稱越肩) 或 '1st' (第一人稱)
  }

  getGlassVolume() {
    return this.glassLayers.reduce((sum, l) => sum + l.amount, 0);
  }

  getCurrentFlavors() {
    const totals = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
    let totalAmt = 0;
    this.glassLayers.forEach(l => {
      const ing = INGREDIENTS[l.ingId];
      if (ing) {
        totalAmt += l.amount;
        Object.keys(totals).forEach(f => {
          totals[f] += ing.flavors[f] * (l.amount / 10);
        });
      }
    });
    return totals;
  }
}

const state = new GameState();

// ==================== 3. THREE.JS 3D 世界渲染引擎 ====================

class ThreeWorldEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();

    // 焦距 60 度的透視攝影機，營造強烈消失點景深
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 天空背景 (吉卜力天空藍)
    this.scene.background = new THREE.Color(0x74b9ff);

    // 森林立體迷霧 (Exp2 霧化效果)
    this.scene.fog = new THREE.FogExp2(0x74b9ff, 0.003);

    // 玩家物理世界座標
    this.playerPos = new THREE.Vector3(0, 0, 10); // Z 向負延伸
    this.playerRotY = 0;

    // 按鍵狀態
    this.keys = { w: false, a: false, s: false, d: false, shift: false };
    this.joystickDir = { x: 0, y: 0 };

    this.animatedMeshes = [];
    this.particleSystems = [];

    this.initLights();
    this.buildGhibliClouds();
    this.buildWorldEnvironment();
    this.buildPlayerCharacter();
    this.setupEventListeners();

    this.clock = new THREE.Clock();
  }

  initLights() {
    // 太陽溫暖琥珀光
    const sunLight = new THREE.DirectionalLight(0xfffae6, 1.3);
    sunLight.position.set(30, 60, 40);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    this.scene.add(sunLight);

    // 軟天藍天空環境光
    const ambientLight = new THREE.AmbientLight(0x89c4f4, 0.85);
    this.scene.add(ambientLight);

    // 微風酒館大門暖光提燈
    const tavernLantern = new THREE.PointLight(0xffa502, 1.8, 25);
    tavernLantern.position.set(0, 3.5, 0);
    this.scene.add(tavernLantern);
  }

  buildGhibliClouds() {
    // 吉卜力棉花糖白雲
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshLambertMaterial({ color: 0xffffff, flatShading: true });

    for (let i = 0; i < 20; i++) {
      const singleCloud = new THREE.Group();
      const puffCount = 5 + Math.floor(Math.random() * 4);
      for (let j = 0; j < puffCount; j++) {
        const radius = 6 + Math.random() * 8;
        const geo = new THREE.DodecahedronGeometry(radius, 1);
        const mesh = new THREE.Mesh(geo, cloudMat);
        mesh.position.set((j - puffCount / 2) * 6, Math.random() * 3, Math.random() * 4);
        singleCloud.add(mesh);
      }
      singleCloud.position.set(
        (Math.random() - 0.5) * 300,
        45 + Math.random() * 25,
        -Math.random() * 450
      );
      cloudGroup.add(singleCloud);
    }
    this.scene.add(cloudGroup);
    this.clouds = cloudGroup;
  }

  buildWorldEnvironment() {
    // 1. 沿 Z 軸動態延伸的石板路與草地地面 (Z: 20 到 -500)
    const groundGeo = new THREE.PlaneGeometry(120, 600, 32, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x485460,
      roughness: 0.8,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, -250);
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 中央街道石板步道
    const pathGeo = new THREE.PlaneGeometry(16, 600);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x808e9b, roughness: 0.7 });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(0, 0.05, -250);
    path.receiveShadow = true;
    this.scene.add(path);

    // ==================== 場景 1：微風酒館正門與露台 (Z: 0 處) ====================
    this.buildTavernHouse3D(0, 0, 0);

    // ==================== 場景 2：漫長熱鬧的香料與果香長街 (Z: -30 到 -150) ====================
    STREET_SHOPS_3D.forEach(shop => this.buildShop3D(shop));
    this.buildMarketCanopySails();

    // ==================== 場景 3：幽光巨木與迷霧森林 (Z: -160 到 -500) ====================
    this.buildForest3D();

    // ==================== 環境飄落花瓣/樹葉粒子系統 ====================
    this.buildLeavesParticleSystem();
  }

  buildTavernHouse3D(x, y, z) {
    const tavernGroup = new THREE.Group();
    tavernGroup.position.set(x, y, z);

    // 主體木造圓頂建物
    const wallGeo = new THREE.CylinderGeometry(7, 8, 8, 12);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x5e35b1, roughness: 0.6 });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.y = 4;
    wall.castShadow = true;
    wall.receiveShadow = true;
    tavernGroup.add(wall);

    // 圓頂紅瓦屋頂
    const roofGeo = new THREE.ConeGeometry(9, 6, 12);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xd35400, roughness: 0.5 });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 11;
    roof.castShadow = true;
    tavernGroup.add(roof);

    // 大門與露台木階
    const doorGeo = new THREE.BoxGeometry(3, 5, 0.4);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x3e2723 });
    const door = new THREE.Mesh(doorGeo, doorMat);
    door.position.set(0, 2.5, 7.8);
    tavernGroup.add(door);

    // 門上黃銅風鈴
    const chimeGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
    const chimeMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, metalness: 0.9, roughness: 0.2 });
    const chime = new THREE.Mesh(chimeGeo, chimeMat);
    chime.position.set(0, 5.2, 8.2);
    tavernGroup.add(chime);
    this.animatedMeshes.push({ mesh: chime, type: 'sway' });

    // 露台兩側繡球花叢與木桶
    for (let i = -1; i <= 1; i += 2) {
      const bushGeo = new THREE.DodecahedronGeometry(1.5, 1);
      const bushMat = new THREE.MeshStandardMaterial({ color: i > 0 ? 0x247551 : 0x8e44ad });
      const bush = new THREE.Mesh(bushGeo, bushMat);
      bush.position.set(i * 5.5, 1, 7.5);
      tavernGroup.add(bush);

      const barrelGeo = new THREE.CylinderGeometry(1, 1, 2.4, 10);
      const barrelMat = new THREE.MeshStandardMaterial({ color: 0x795548 });
      const barrel = new THREE.Mesh(barrelGeo, barrelMat);
      barrel.position.set(i * 7.5, 1.2, 6.5);
      tavernGroup.add(barrel);
    }

    this.scene.add(tavernGroup);
  }

  buildShop3D(shop) {
    const group = new THREE.Group();
    group.position.set(shop.x, 0, shop.z);

    if (shop.id === 'shop_citrus') {
      // 半切蜜柑造型水果工坊
      const citrusGeo = new THREE.SphereGeometry(5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const citrusMat = new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.4 });
      const dome = new THREE.Mesh(citrusGeo, citrusMat);
      dome.position.y = 2.5;
      group.add(dome);
    } else if (shop.id === 'shop_rum') {
      // 紫霧/蒸餾廠
      const bodyGeo = new THREE.BoxGeometry(7, 6, 7);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x833471 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 3;
      group.add(body);
    } else {
      // 一般香草/薄荷木屋
      const houseGeo = new THREE.BoxGeometry(6, 5, 6);
      const houseMat = new THREE.MeshStandardMaterial({ color: shop.id === 'shop_frost' ? 0x48dbfb : 0x10ac84 });
      const house = new THREE.Mesh(houseGeo, houseMat);
      house.position.y = 2.5;
      group.add(house);
    }

    this.scene.add(group);
  }

  buildMarketCanopySails() {
    // 長街上方七彩遮陽帆布
    const sailGeo = new THREE.PlaneGeometry(16, 10);
    const sailMat = new THREE.MeshStandardMaterial({
      color: 0xee5253,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    const sail = new THREE.Mesh(sailGeo, sailMat);
    sail.rotation.x = Math.PI / 2.5;
    sail.position.set(0, 10, -70);
    this.scene.add(sail);
  }

  buildForest3D() {
    // 秘境古林：古木盤根與樹冠 (Z: -160 到 -480)
    for (let z = -160; z >= -480; z -= 25) {
      for (let side = -1; side <= 1; side += 2) {
        const x = side * (12 + Math.random() * 8);
        const trunkGeo = new THREE.CylinderGeometry(1.8 + Math.random(), 3 + Math.random(), 18, 10);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(x, 9, z);
        trunk.castShadow = true;
        this.scene.add(trunk);

        // 蓬鬆圓球樹冠 (吉卜力綠)
        const crownGeo = new THREE.DodecahedronGeometry(6 + Math.random() * 3, 1);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0x10ac84, roughness: 0.6 });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.set(x, 20, z);
        this.scene.add(crown);
      }
    }

    // 森林螢火蟲浮動光點粒子
    const fireflyCount = 150;
    const fireflyGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(fireflyCount * 3);
    for (let i = 0; i < fireflyCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = 1 + Math.random() * 8;
      positions[i * 3 + 2] = -160 - Math.random() * 320;
    }
    fireflyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const fireflyMat = new THREE.PointsMaterial({
      color: 0x55efc4,
      size: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const fireflies = new THREE.Points(fireflyGeo, fireflyMat);
    this.scene.add(fireflies);
    this.particleSystems.push({ points: fireflies, type: 'fireflies' });
  }

  buildLeavesParticleSystem() {
    // 隨風飄落的櫻花與綠葉粒子
    const count = 100;
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = Math.random() * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 300;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0xff7979, size: 0.5, transparent: true, opacity: 0.8 });
    const particles = new THREE.Points(geo, mat);
    this.scene.add(particles);
    this.particleSystems.push({ points: particles, type: 'leaves' });
  }

  buildPlayerCharacter() {
    // 3D 調酒師小主角（精細造型：禮帽、馬甲與手提燈光錐）
    this.playerGroup = new THREE.Group();

    // 身體馬甲
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.5, 1.6, 8);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb71540 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.6;
    this.playerGroup.add(body);

    // 頭部
    const headGeo = new THREE.SphereGeometry(0.5, 12, 12);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xffddc1 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.7;
    this.playerGroup.add(head);

    // 羽毛禮帽
    const hatGeo = new THREE.CylinderGeometry(0.8, 0.8, 0.3, 12);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0x2c3e50 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.y = 3.1;
    this.playerGroup.add(hat);

    // 手提黃銅提燈與前向光錐
    const lanternGeo = new THREE.OctahedronGeometry(0.25);
    const lanternMat = new THREE.MeshStandardMaterial({ color: 0xf39c12, emissive: 0xd35400 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(0.7, 1.4, -0.4);
    this.playerGroup.add(lantern);

    const playerSpotLight = new THREE.SpotLight(0xffa502, 2.5, 20, Math.PI / 4, 0.5);
    playerSpotLight.position.set(0, 1.8, 0);
    playerSpotLight.target.position.set(0, 0, -10);
    this.playerGroup.add(playerSpotLight);
    this.playerGroup.add(playerSpotLight.target);

    this.playerGroup.position.copy(this.playerPos);
    this.scene.add(this.playerGroup);
  }

  setupEventListeners() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.keys.w = true;
      if (k === 's' || k === 'arrowdown') this.keys.s = true;
      if (k === 'a' || k === 'arrowleft') this.keys.a = true;
      if (k === 'd' || k === 'arrowright') this.keys.d = true;
      if (k === 'shift') this.keys.shift = true;
      if (k === ' ' || e.code === 'Space') {
        if (this.currentInteractAction) {
          this.currentInteractAction();
        }
      }
      if (k === 'c') {
        state.cameraMode = state.cameraMode === '3rd' ? '1st' : '3rd';
        updateCameraModeUI();
      }
    });

    window.addEventListener('keyup', (e) => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.keys.w = false;
      if (k === 's' || k === 'arrowdown') this.keys.s = false;
      if (k === 'a' || k === 'arrowleft') this.keys.a = false;
      if (k === 'd' || k === 'arrowright') this.keys.d = false;
      if (k === 'shift') this.keys.shift = false;
    });

    // 觸控虛擬搖桿支援
    this.initJoystick();
  }

  initJoystick() {
    const joyZone = document.getElementById('joystick-zone');
    const joyStick = document.getElementById('joystick-stick');
    if (!joyZone || !joyStick) return;

    let activeTouchId = null;
    let startX = 0, startY = 0;

    const handleStart = (clientX, clientY, touchId) => {
      activeTouchId = touchId;
      const rect = joyZone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      handleMove(clientX, clientY);
    };

    const handleMove = (clientX, clientY) => {
      const dx = clientX - startX;
      const dy = clientY - startY;
      const dist = Math.hypot(dx, dy);
      const maxR = 35;
      const angle = Math.atan2(dy, dx);

      const clampedDist = Math.min(dist, maxR);
      const stickX = Math.cos(angle) * clampedDist;
      const stickY = Math.sin(angle) * clampedDist;

      joyStick.style.transform = `translate(${stickX}px, ${stickY}px)`;
      this.joystickDir.x = stickX / maxR;
      this.joystickDir.y = stickY / maxR;
    };

    const handleEnd = () => {
      activeTouchId = null;
      joyStick.style.transform = 'translate(0px, 0px)';
      this.joystickDir.x = 0;
      this.joystickDir.y = 0;
    };

    joyZone.addEventListener('touchstart', (e) => {
      const t = e.changedTouches[0];
      handleStart(t.clientX, t.clientY, t.identifier);
    });

    window.addEventListener('touchmove', (e) => {
      if (activeTouchId === null) return;
      for (let t of e.changedTouches) {
        if (t.identifier === activeTouchId) {
          handleMove(t.clientX, t.clientY);
        }
      }
    });

    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
  }

  update(dt) {
    if (state.currentScene !== 'outdoor') return;

    // 1. 移動速度與向量
    const speed = (this.keys.shift ? 16 : 9) * dt;
    let moveX = 0, moveZ = 0;

    if (this.keys.w) moveZ -= 1;
    if (this.keys.s) moveZ += 1;
    if (this.keys.a) moveX -= 1;
    if (this.keys.d) moveX += 1;

    // 結合虛擬搖桿
    if (Math.hypot(this.joystickDir.x, this.joystickDir.y) > 0.1) {
      moveX += this.joystickDir.x;
      moveZ += this.joystickDir.y;
    }

    if (moveX !== 0 || moveZ !== 0) {
      const len = Math.hypot(moveX, moveZ);
      this.playerPos.x += (moveX / len) * speed;
      this.playerPos.z += (moveZ / len) * speed;

      // 限制步道邊界
      this.playerPos.x = Math.max(-14, Math.min(14, this.playerPos.x));
      this.playerPos.z = Math.max(-460, Math.min(15, this.playerPos.z));

      this.playerGroup.position.copy(this.playerPos);

      // 人物旋轉面向
      this.playerGroup.rotation.y = Math.atan2(-moveX, -moveZ);
    }

    // 2. 攝影機跟隨 (Z-Axis Depth Perspective)
    if (state.cameraMode === '3rd') {
      // 第三人稱越肩：鏡頭位於角色背後斜上方
      this.camera.position.set(
        this.playerPos.x * 0.7,
        this.playerPos.y + 4.5,
        this.playerPos.z + 8.5
      );
      this.camera.lookAt(this.playerPos.x, this.playerPos.y + 1.8, this.playerPos.z - 5);
    } else {
      // 第一人稱：眼睛視野
      this.camera.position.set(this.playerPos.x, this.playerPos.y + 2.4, this.playerPos.z);
      this.camera.lookAt(this.playerPos.x, this.playerPos.y + 2.4, this.playerPos.z - 10);
    }

    // 3. 區域動態偵測與迷霧強度
    this.updateZoneAndFog();

    // 4. 動態微風動畫 (風鈴搖曳 / 粒子浮動)
    const time = this.clock.getElapsedTime();
    this.animatedMeshes.forEach(item => {
      if (item.type === 'sway') {
        item.mesh.rotation.z = Math.sin(time * 3) * 0.15;
      }
    });

    // 5. 近身互動檢查
    this.checkProximityPrompts();
  }

  updateZoneAndFog() {
    const z = this.playerPos.z;
    const zoneTextEl = document.getElementById('current-zone-name');
    const mistEl = document.getElementById('mist-vignette');

    if (z > -25) {
      if (zoneTextEl) zoneTextEl.innerText = '奇幻酒館・門前庭院';
      this.scene.fog.density = 0.002;
      if (mistEl) mistEl.className = 'mist-vignette';
    } else if (z > -150) {
      if (zoneTextEl) zoneTextEl.innerText = '集市長街・果香與香料區';
      this.scene.fog.density = 0.003;
      if (mistEl) mistEl.className = 'mist-vignette';
    } else {
      if (zoneTextEl) zoneTextEl.innerText = '幽光巨木・迷霧森林秘境';
      // 越深迷霧越濃
      const depthRatio = Math.min(1, (Math.abs(z) - 150) / 300);
      this.scene.fog.density = 0.005 + depthRatio * 0.025;

      if (mistEl) {
        if (depthRatio > 0.8) {
          mistEl.className = 'mist-vignette extreme';
        } else if (depthRatio > 0.4) {
          mistEl.className = 'mist-vignette danger';
        } else {
          mistEl.className = 'mist-vignette';
        }
      }

      // 觸發迷失判定 (Z < -440)
      if (z < -440 && !this.isLostTeleporting) {
        this.triggerLostTeleport();
      }
    }
  }

  triggerLostTeleport() {
    this.isLostTeleporting = true;
    const banner = document.getElementById('lost-alert-banner');
    if (banner) banner.classList.add('show');

    if (typeof playSound === 'function') playSound('lostAlert');

    setTimeout(() => {
      // 傳送回酒館門口
      this.playerPos.set(0, 0, 10);
      this.playerGroup.position.copy(this.playerPos);
      if (banner) banner.classList.remove('show');
      this.isLostTeleporting = false;
    }, 2800);
  }

  checkProximityPrompts() {
    const promptEl = document.getElementById('proximity-prompt');
    const actionTextEl = document.getElementById('prompt-action-text');
    if (!promptEl || !actionTextEl) return;

    const z = this.playerPos.z;
    const x = this.playerPos.x;
    let foundInteractable = false;

    // 1. 靠近酒館大門 (Z: 0 處)
    if (Math.hypot(x, z - 2) < 4) {
      actionTextEl.innerText = '進入酒館酒吧 (調酒台)';
      this.currentInteractAction = () => openBartenderModal();
      foundInteractable = true;
    }

    // 2. 靠近集市店鋪
    STREET_SHOPS_3D.forEach(shop => {
      if (Math.hypot(x - shop.x, z - shop.z) < 5) {
        actionTextEl.innerText = `進入 ${shop.name}`;
        this.currentInteractAction = () => openMarketModal(shop.id);
        foundInteractable = true;
      }
    });

    // 3. 靠近森林寶箱
    FOREST_CHESTS_3D.forEach(chest => {
      if (!chest.opened && Math.hypot(x - chest.x, z - chest.z) < 4) {
        actionTextEl.innerText = `開啟 ${chest.name}`;
        this.currentInteractAction = () => openChest(chest);
        foundInteractable = true;
      }
    });

    // 4. 靠近草藥採集點
    FOREST_HERBS_3D.forEach(herb => {
      if (!herb.gathered && Math.hypot(x - herb.x, z - herb.z) < 4) {
        actionTextEl.innerText = `採集 ${herb.name}`;
        this.currentInteractAction = () => gatherHerb(herb);
        foundInteractable = true;
      }
    });

    // 5. 靠近 NPC 對話
    TOWN_NPCS_3D.forEach(npc => {
      if (Math.hypot(x - npc.x, z - npc.z) < 4) {
        actionTextEl.innerText = `與 ${npc.name} 對話`;
        this.currentInteractAction = () => talkToNpc(npc);
        foundInteractable = true;
      }
    });

    if (foundInteractable) {
      promptEl.classList.remove('hidden');
      promptEl.style.left = '50%';
      promptEl.style.top = '75%';
    } else {
      promptEl.classList.add('hidden');
      this.currentInteractAction = null;
    }
  }

  render() {
    const dt = this.clock.getDelta();
    this.update(dt);

    // 粒子旋轉
    const time = this.clock.getElapsedTime();
    this.particleSystems.forEach(sys => {
      sys.points.rotation.y = time * 0.05;
    });

    this.renderer.render(this.scene, this.camera);
  }
}

let worldEngine = null;

// ==================== 4. 視角切換 & UI 初始化 ====================

function updateCameraModeUI() {
  const btn = document.getElementById('camera-view-btn');
  if (btn) {
    btn.innerText = state.cameraMode === '3rd' ? '🎥 視角: 第三人稱' : '👁️ 視角: 第一人稱';
  }
}

// ==================== 5. MODAL 與遊戲邏輯實作 ====================

function updateHUD() {
  const goldEl = document.getElementById('gold-display');
  const repEl = document.getElementById('rep-display');
  const ptsEl = document.getElementById('points-display');
  if (goldEl) goldEl.innerText = state.gold;
  if (repEl) repEl.innerText = state.reputation;
  if (ptsEl) ptsEl.innerText = state.points;
}

function talkToNpc(npc) {
  if (typeof playSound === 'function') playSound('bubblePop');
  alert(`💬 ${npc.name}（${npc.title}）：\n\n${npc.chat}`);
}

function openMarketModal(shopId) {
  const shop = STREET_SHOPS_3D.find(s => s.id === shopId);
  const modal = document.getElementById('market-modal');
  const titleEl = document.getElementById('shop-modal-name');
  const iconEl = document.getElementById('shop-modal-icon');
  const introEl = document.getElementById('shop-modal-intro');
  const grid = document.getElementById('market-grid');

  if (!modal || !grid) return;

  if (titleEl) titleEl.innerText = shop ? shop.name : '街區原料行';
  if (iconEl) iconEl.innerText = shop ? shop.icon : '🏪';
  if (introEl) introEl.innerText = shop ? shop.intro : '採購特製調酒原料。';

  grid.innerHTML = '';
  Object.values(INGREDIENTS).forEach(ing => {
    if (ing.shopId === shopId || (!ing.shopId && !ing.forestOnly)) {
      const card = document.createElement('div');
      card.className = 'market-card';
      const userCount = state.inventory[ing.id] || 0;
      const canBuy = state.gold >= ing.price && state.reputation >= ing.repReq;

      card.innerHTML = `
        <div class="market-card-top">
          <div class="market-card-icon">${ing.icon}</div>
          <div class="market-card-info">
            <h4>${ing.name}</h4>
            <div class="market-tags">
              <span class="mtag">持有: ${userCount}</span>
              ${ing.repReq > 0 ? `<span class="mtag">需聲望 ${ing.repReq}</span>` : ''}
            </div>
          </div>
        </div>
        <p style="font-size: 0.78rem; color: #dcdde1;">${ing.desc}</p>
        <div class="market-card-bottom">
          <span style="color: #f6c23e; font-weight: 800;">🪙 ${ing.price}</span>
          <button class="fantasy-btn primary-glow" ${canBuy ? '' : 'disabled'} onclick="buyIngredient('${ing.id}')">
            購買 1 份
          </button>
        </div>
      `;
      grid.appendChild(card);
    }
  });

  modal.classList.remove('hidden');
}

window.buyIngredient = function(ingId) {
  const ing = INGREDIENTS[ingId];
  if (ing && state.gold >= ing.price) {
    state.gold -= ing.price;
    state.inventory[ingId] = (state.inventory[ingId] || 0) + 1;
    updateHUD();
    if (typeof playSound === 'function') playSound('coinClink');
    openMarketModal(ing.shopId);
  }
};

function openChest(chest) {
  chest.opened = true;
  const reward = CHEST_REWARD_POOL[chest.rewardIndex || 0];
  state.points += reward.pts || 20;
  state.gold += reward.gold || 30;

  if (reward.type === 'recipe') {
    state.unlockedRecipes.add(reward.name);
  } else if (reward.itemId) {
    state.inventory[reward.itemId] = (state.inventory[reward.itemId] || 0) + (reward.count || 1);
  }

  updateHUD();

  const modal = document.getElementById('chest-reward-modal');
  const titleEl = document.getElementById('chest-reward-title');
  const descEl = document.getElementById('chest-reward-desc');
  if (titleEl) titleEl.innerText = reward.name;
  if (descEl) descEl.innerText = reward.desc;

  if (modal) modal.classList.remove('hidden');
  if (typeof playSound === 'function') playSound('chestOpen');
}

function gatherHerb(herb) {
  herb.gathered = true;
  state.inventory[herb.itemId] = (state.inventory[herb.itemId] || 0) + herb.count;
  state.points += 15;
  updateHUD();
  if (typeof playSound === 'function') playSound('herbGather');
  alert(`✨ 採集成功！獲得了 ${herb.count} 份【${INGREDIENTS[herb.itemId].name}】！`);
}

// ==================== 6. 第一人稱沉浸式調酒工作台 (Bartending Modal) ====================

function openBartenderModal() {
  state.glassLayers = [];
  state.selectedIngredient = null;

  // 隨機顧客
  state.currentCustomerIndex = Math.floor(Math.random() * CUSTOMERS.length);
  const cust = CUSTOMERS[state.currentCustomerIndex];

  const custAvatar = document.getElementById('order-cust-avatar');
  const custName = document.getElementById('order-cust-name');
  const custBadge = document.getElementById('order-cust-badge');
  const custQuote = document.getElementById('order-cust-quote');
  const desiresEl = document.getElementById('order-cust-desires');

  if (custAvatar) custAvatar.innerText = cust.avatar;
  if (custName) custName.innerText = cust.name;
  if (custBadge) custBadge.innerText = cust.badge;
  if (custQuote) custQuote.innerText = cust.quote;

  if (desiresEl) {
    desiresEl.innerHTML = '';
    if (cust.preferred.sweet) desiresEl.innerHTML += `<span class="desire-tag tag-sweet">甘甜 +${cust.preferred.sweet}</span>`;
    if (cust.preferred.sour) desiresEl.innerHTML += `<span class="desire-tag tag-sour">酸爽 +${cust.preferred.sour}</span>`;
    if (cust.preferred.spirit) desiresEl.innerHTML += `<span class="desire-tag tag-spirit">烈度 +${cust.preferred.spirit}</span>`;
    if (cust.preferred.magic) desiresEl.innerHTML += `<span class="desire-tag tag-magic">魔幻 +${cust.preferred.magic}</span>`;
    if (cust.preferred.spicy) desiresEl.innerHTML += `<span class="desire-tag tag-spicy">辛辣 +${cust.preferred.spicy}</span>`;
  }

  renderIngredientGrid();
  renderCocktailGlass();

  const modal = document.getElementById('bartender-modal');
  if (modal) modal.classList.remove('hidden');
}

function renderIngredientGrid() {
  const grid = document.getElementById('ingredient-grid');
  if (!grid) return;
  grid.innerHTML = '';

  Object.values(INGREDIENTS).forEach(ing => {
    const count = state.inventory[ing.id] || 0;
    const card = document.createElement('div');
    card.className = `ing-select-card ${state.selectedIngredient === ing.id ? 'selected' : ''}`;
    card.onclick = () => selectIngredient(ing.id);

    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:1.2rem;">${ing.icon}</span>
        <span style="font-size:0.75rem; color:#f6c23e;">x${count}</span>
      </div>
      <strong style="font-size:0.8rem; color:#fff;">${ing.name}</strong>
    `;
    grid.appendChild(card);
  });
}

function selectIngredient(ingId) {
  if ((state.inventory[ingId] || 0) <= 0) {
    alert('此原料庫存不足，請先至長街店鋪採購或於古林採集！');
    return;
  }
  state.selectedIngredient = ingId;
  renderIngredientGrid();

  const pourBtn = document.getElementById('pour-btn');
  if (pourBtn) {
    pourBtn.disabled = false;
    pourBtn.querySelector('.pour-btn-text').innerText = `按住注入【${INGREDIENTS[ingId].name}】`;
  }
}

function setupPouringControls() {
  const pourBtn = document.getElementById('pour-btn');
  if (!pourBtn) return;

  const startPouring = (e) => {
    e.preventDefault();
    if (!state.selectedIngredient || (state.inventory[state.selectedIngredient] || 0) <= 0) return;
    if (state.getGlassVolume() >= state.glassCapacity) return;

    state.isPouring = true;
    pourBtn.classList.add('pouring');
    if (typeof playSound === 'function') playSound('liquidPour');

    state.pourInterval = setInterval(() => {
      if (state.getGlassVolume() >= state.glassCapacity) {
        stopPouring();
        return;
      }

      const ingId = state.selectedIngredient;
      const lastLayer = state.glassLayers[state.glassLayers.length - 1];

      if (lastLayer && lastLayer.ingId === ingId) {
        lastLayer.amount += 2;
      } else {
        state.glassLayers.push({ ingId: ingId, amount: 2, color: INGREDIENTS[ingId].color });
      }

      state.inventory[ingId] -= 0.1;
      renderCocktailGlass();
    }, 80);
  };

  const stopPouring = () => {
    state.isPouring = false;
    pourBtn.classList.remove('pouring');
    if (state.pourInterval) clearInterval(state.pourInterval);
    renderIngredientGrid();
  };

  pourBtn.addEventListener('mousedown', startPouring);
  pourBtn.addEventListener('mouseup', stopPouring);
  pourBtn.addEventListener('mouseleave', stopPouring);

  pourBtn.addEventListener('touchstart', startPouring);
  pourBtn.addEventListener('touchend', stopPouring);
}

function renderCocktailGlass() {
  const canvas = document.getElementById('cocktail-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const totalVol = state.getGlassVolume();
  const glassW = 120, glassH = 220;
  const glassX = (canvas.width - glassW) / 2;
  const glassY = canvas.height - glassH - 20;

  // 1. 繪製 3D 琉璃杯身外框
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(glassX, glassY);
  ctx.lineTo(glassX + 15, glassY + glassH);
  ctx.lineTo(glassX + glassW - 15, glassY + glassH);
  ctx.lineTo(glassX + glassW, glassY);
  ctx.stroke();

  // 2. 繪製多層液體漸層與冰塊
  let currentY = glassY + glassH;
  const maxFillH = glassH - 20;

  state.glassLayers.forEach(l => {
    const layerH = (l.amount / state.glassCapacity) * maxFillH;
    ctx.fillStyle = l.color;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(glassX + 10, currentY - layerH, glassW - 20, layerH);
    currentY -= layerH;
  });

  // 冰塊浮動
  if (totalVol > 15) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(glassX + 35, currentY + 10, 24, 24);
    ctx.fillRect(glassX + 65, currentY + 25, 20, 20);
  }

  ctx.restore();

  // 3. 更新 HUD 數值與容量
  const volText = document.getElementById('glass-volume-text');
  if (volText) volText.innerText = `${Math.floor(totalVol)} / ${state.glassCapacity} ml`;

  const flavors = state.getCurrentFlavors();
  const fSweet = document.getElementById('hud-sweet');
  const fSour = document.getElementById('hud-sour');
  const fSpirit = document.getElementById('hud-spirit');
  const fMagic = document.getElementById('hud-magic');
  const fSpicy = document.getElementById('hud-spicy');

  if (fSweet) fSweet.style.width = `${Math.min(100, flavors.sweet * 15)}%`;
  if (fSour) fSour.style.width = `${Math.min(100, flavors.sour * 15)}%`;
  if (fSpirit) fSpirit.style.width = `${Math.min(100, flavors.spirit * 15)}%`;
  if (fMagic) fMagic.style.width = `${Math.min(100, flavors.magic * 15)}%`;
  if (fSpicy) fSpicy.style.width = `${Math.min(100, flavors.spicy * 15)}%`;

  const finishBtn = document.getElementById('finish-drink-btn');
  if (finishBtn) finishBtn.disabled = totalVol < 20;
}

function finishDrinkAndSettle() {
  const cust = CUSTOMERS[state.currentCustomerIndex];
  const flavors = state.getCurrentFlavors();
  const totalVol = state.getGlassVolume();

  let earnedGold = Math.floor(30 * (cust.tipBonus || 1.1) + totalVol * 0.2);
  let earnedRep = 6 + Math.floor(flavors.magic);
  let earnedPts = 15 + state.glassLayers.length * 5;

  state.gold += earnedGold;
  state.reputation += earnedRep;
  state.points += earnedPts;
  updateHUD();

  // 關閉調酒台，打開結算 Modal
  document.getElementById('bartender-modal').classList.add('hidden');

  const resModal = document.getElementById('result-modal');
  const resDrinkName = document.getElementById('res-drink-name');
  const resGold = document.getElementById('res-earn-gold');
  const resRep = document.getElementById('res-earn-rep');
  const resPts = document.getElementById('res-earn-pts');
  const resComment = document.getElementById('res-npc-comment');

  if (resDrinkName) resDrinkName.innerText = flavors.magic > 3 ? '極光月影星霜' : '夢幻特調美釀';
  if (resGold) resGold.innerText = `+${earnedGold}`;
  if (resRep) resRep.innerText = `+${earnedRep}`;
  if (resPts) resPts.innerText = `+${earnedPts}`;
  if (resComment) resComment.innerText = `「這美味簡直直擊靈魂！正是我想要的奇幻風味！」`;

  if (resModal) resModal.classList.remove('hidden');
  if (typeof playSound === 'function') playSound('victoryFanfare');
}

// ==================== 7. 主程式啟動 ====================

window.addEventListener('load', () => {
  const canvas = document.getElementById('world-canvas');
  if (canvas) {
    worldEngine = new ThreeWorldEngine(canvas);

    // Three.js 渲染迴圈
    function loop() {
      requestAnimationFrame(loop);
      worldEngine.render();
    }
    loop();
  }

  // 綁定視角切換按鈕
  const camBtn = document.getElementById('camera-view-btn');
  if (camBtn) {
    camBtn.addEventListener('click', () => {
      state.cameraMode = state.cameraMode === '3rd' ? '1st' : '3rd';
      updateCameraModeUI();
    });
  }

  // 綁定關閉 Modal 按鈕
  const closeMarket = document.getElementById('close-market-btn');
  if (closeMarket) closeMarket.onclick = () => document.getElementById('market-modal').classList.add('hidden');

  const closeBartender = document.getElementById('close-bartender-btn');
  if (closeBartender) closeBartender.onclick = () => document.getElementById('bartender-modal').classList.add('hidden');

  const closeChest = document.getElementById('close-chest-btn');
  if (closeChest) closeChest.onclick = () => document.getElementById('chest-reward-modal').classList.add('hidden');

  const confirmRes = document.getElementById('confirm-result-btn');
  if (confirmRes) confirmRes.onclick = () => document.getElementById('result-modal').classList.add('hidden');

  const resetDrink = document.getElementById('reset-drink-btn');
  if (resetDrink) resetDrink.onclick = () => {
    state.glassLayers = [];
    renderCocktailGlass();
  };

  const finishDrink = document.getElementById('finish-drink-btn');
  if (finishDrink) finishDrink.onclick = finishDrinkAndSettle;

  // 圖鑑 Modal
  const bookBtn = document.getElementById('recipe-book-btn');
  if (bookBtn) bookBtn.onclick = () => {
    const modal = document.getElementById('recipe-book-modal');
    const grid = document.getElementById('recipe-grid');
    if (grid) {
      grid.innerHTML = '';
      RECIPES_CATALOG.forEach(r => {
        const isUnlocked = state.unlockedRecipes.has(r.name);
        const card = document.createElement('div');
        card.className = `recipe-card ${isUnlocked ? '' : 'locked'}`;
        card.innerHTML = `
          <div style="font-size:1.5rem;">${r.icon}</div>
          <strong style="font-size:0.9rem; color:#f6c23e;">${r.name}</strong>
          <p style="font-size:0.75rem; color:#dcdde1; margin-top:4px;">${r.requirement}</p>
        `;
        grid.appendChild(card);
      });
    }
    if (modal) modal.classList.remove('hidden');
  };

  const closeBook = document.getElementById('close-book-btn');
  if (closeBook) closeBook.onclick = () => document.getElementById('recipe-book-modal').classList.add('hidden');

  // 音效按鈕
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn && typeof toggleAudio === 'function') {
    audioBtn.onclick = toggleAudio;
  }

  setupPouringControls();
  updateHUD();
});
