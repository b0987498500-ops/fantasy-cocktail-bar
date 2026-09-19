/**
 * 奇幻調酒館 (Fantasy Bartender) - 核心遊戲引擎
 * 涵蓋：三元經濟、探索防迷路邊界、Canvas 液體分層調酒、顧客 AI 與圖鑑
 */

// ==================== 1. 資料定義 ====================

const INGREDIENTS = {
  moon_syrup: {
    id: 'moon_syrup',
    name: '月光糖漿',
    icon: '🌙',
    price: 15,
    repReq: 0,
    color: '#f6e58d',
    flavors: { sweet: 3, sour: 0, spirit: 0, magic: 1, spicy: 0 },
    desc: '採集自月圓之夜的甘露，入口溫潤綿長。'
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
    desc: '蘊含地下熔岩熱力的烈酒，微醺而狂野。'
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
    desc: '極北冰原的薄荷霜凝，帶來沁涼透骨之感。'
  },
  dragon_chili: {
    id: 'dragon_chili',
    name: '巨龍朝天椒',
    icon: '🌶️',
    price: 45,
    repReq: 40,
    color: '#ff4757',
    flavors: { sweet: 0, sour: 0, spirit: 2, magic: 1, spicy: 4 },
    desc: '幼龍吐息烤炙的辣椒，在喉中引爆辛香狂潮。'
  },
  // 森林專屬原料
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

// ==================== 2. 遊戲狀態 ====================

class GameState {
  constructor() {
    this.gold = 160;
    this.reputation = 15;
    this.points = 0;
    this.currentZone = 'tavern'; // market, tavern, forest
    
    // 玩家背包庫存
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

    // 森林探索狀態
    this.forestDistance = 0;
    this.forestMaxSafe = 100;
    this.forestMaxDanger = 150;
    this.forestLimit = 200;
    this.collectedInCurrentRun = {};
    this.heartbeatInterval = null;

    // 當前顧客
    this.currentCustomerIndex = 0;

    // 調酒杯當前狀態
    this.glassCapacity = 100; // ml
    this.glassLayers = []; // [{ id, color, amount, flavors }]
    this.selectedIngredient = null;
    this.isPouring = false;
    this.pourTimer = null;

    // 解鎖圖鑑
    this.unlockedRecipes = new Set(['冒險家特飲']);
  }
}

const game = new GameState();

// ==================== 3. DOM 元素快取 ====================

const DOM = {
  // 數值顯示
  goldDisplay: document.getElementById('gold-display'),
  repDisplay: document.getElementById('rep-display'),
  pointsDisplay: document.getElementById('points-display'),
  audioToggleBtn: document.getElementById('audio-toggle-btn'),
  recipeBookBtn: document.getElementById('recipe-book-btn'),

  // 區域視圖與按鈕
  navMarket: document.getElementById('nav-market'),
  navTavern: document.getElementById('nav-tavern'),
  navForest: document.getElementById('nav-forest'),
  zoneMarket: document.getElementById('zone-market'),
  zoneTavern: document.getElementById('zone-tavern'),
  zoneForest: document.getElementById('zone-forest'),

  // 市集
  marketShelves: document.getElementById('market-shelves'),

  // 酒吧台
  custAvatar: document.getElementById('cust-avatar'),
  custBadge: document.getElementById('cust-badge'),
  custDialogText: document.getElementById('cust-dialog-text'),
  custDesires: document.getElementById('cust-desires'),
  openBartenderBtn: document.getElementById('open-bartender-btn'),
  barInvChips: document.getElementById('bar-inv-chips'),

  // 森林
  forestDistance: document.getElementById('forest-distance'),
  dangerLevel: document.getElementById('danger-level'),
  gaugeFill: document.getElementById('gauge-fill'),
  btnExploreForward: document.getElementById('btn-explore-forward'),
  btnExploreBack: document.getElementById('btn-explore-back'),
  btnEmergencyReturn: document.getElementById('btn-emergency-return'),
  forestEncounters: document.getElementById('forest-encounters'),
  mistOverlay: document.getElementById('mist-overlay'),
  lostAlertBanner: document.getElementById('lost-alert-banner'),

  // 調酒工作台
  bartenderModal: document.getElementById('bartender-modal'),
  closeBartenderBtn: document.getElementById('close-bartender-btn'),
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

  // 結算彈窗
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

  // 圖鑑彈窗
  recipeBookModal: document.getElementById('recipe-book-modal'),
  closeBookBtn: document.getElementById('close-book-btn'),
  recipeGrid: document.getElementById('recipe-grid')
};

// ==================== 4. 基礎更新與 UI 渲染 ====================

function updateResourceDisplays() {
  DOM.goldDisplay.textContent = game.gold;
  DOM.repDisplay.textContent = game.reputation;
  DOM.pointsDisplay.textContent = game.points;

  // 更新吧台庫存縮圖
  DOM.barInvChips.innerHTML = '';
  Object.keys(game.inventory).forEach(id => {
    const count = game.inventory[id];
    if (count > 0) {
      const ing = INGREDIENTS[id];
      const chip = document.createElement('div');
      chip.className = 'inv-chip';
      chip.innerHTML = `<span>${ing.icon}</span> <span>${ing.name} x${count}</span>`;
      DOM.barInvChips.appendChild(chip);
    }
  });
}

// 渲染市集貨架
function renderMarket() {
  DOM.marketShelves.innerHTML = '';

  Object.values(INGREDIENTS).forEach(item => {
    if (item.forestOnly) return; // 森林專屬不在市集販售

    const isLocked = game.reputation < item.repReq;
    const canAfford = game.gold >= item.price && !isLocked;
    const currentStock = game.inventory[item.id] || 0;

    const card = document.createElement('div');
    card.className = 'market-item-card glass-panel';

    const tagsHtml = Object.entries(item.flavors)
      .filter(([_, val]) => val > 0)
      .map(([flv, val]) => {
        const names = { sweet: '甜', sour: '酸', spirit: '烈', magic: '魔', spicy: '辣' };
        return `<span class="tag-badge">${names[flv]} +${val}</span>`;
      }).join('');

    card.innerHTML = `
      <div class="item-top">
        <div class="item-icon">${item.icon}</div>
        <div class="item-details">
          <h4>${item.name}</h4>
          <div class="item-tags">${tagsHtml}</div>
        </div>
      </div>
      <p class="item-desc">${item.desc}</p>
      <div class="item-bottom">
        <div>
          <span class="item-price">🪙 ${item.price} 金幣</span>
          <div class="item-stock">持有: ${currentStock} 份</div>
        </div>
        <button class="buy-btn" data-id="${item.id}" ${canAfford ? '' : 'disabled'}>
          ${isLocked ? `⭐需聲望 ${item.repReq}` : '購買 +1'}
        </button>
      </div>
    `;

    DOM.marketShelves.appendChild(card);
  });

  // 綁定購買事件
  DOM.marketShelves.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      buyIngredient(id);
    });
  });
}

function buyIngredient(id) {
  const item = INGREDIENTS[id];
  if (!item || game.gold < item.price || game.reputation < item.repReq) return;

  game.gold -= item.price;
  game.inventory[id] = (game.inventory[id] || 0) + 1;

  window.soundEngine.playCoinSound();
  updateResourceDisplays();
  renderMarket();
}

// 渲染當前顧客
function renderCustomer() {
  const cust = CUSTOMERS[game.currentCustomerIndex];
  DOM.custAvatar.textContent = cust.avatar;
  DOM.custBadge.textContent = cust.badge;
  DOM.custDialogText.innerHTML = cust.quote;

  DOM.custDesires.innerHTML = '';
  const flvLabels = { sweet: '甘甜', sour: '酸爽', spirit: '烈度', magic: '魔幻', spicy: '辛辣' };
  const tagClasses = { sweet: 'tag-sweet', sour: 'tag-sour', spirit: 'tag-spirit', magic: 'tag-magic', spicy: 'tag-spicy' };

  Object.entries(cust.preferred).forEach(([flv, level]) => {
    const plus = '+'.repeat(level);
    const tag = document.createElement('span');
    tag.className = `desire-tag ${tagClasses[flv] || ''}`;
    tag.textContent = `渴求：${flvLabels[flv]} ${plus}`;
    DOM.custDesires.appendChild(tag);
  });
}

// ==================== 5. 三向區域切換 ====================

function switchZone(targetZone) {
  game.currentZone = targetZone;

  // 更新導航按鈕樣式
  [DOM.navMarket, DOM.navTavern, DOM.navForest].forEach(btn => btn.classList.remove('active'));
  if (targetZone === 'market') DOM.navMarket.classList.add('active');
  if (targetZone === 'tavern') DOM.navTavern.classList.add('active');
  if (targetZone === 'forest') DOM.navForest.classList.add('active');

  // 切換螢幕類別
  [DOM.zoneMarket, DOM.zoneTavern, DOM.zoneForest].forEach(z => {
    z.classList.remove('active-zone', 'hidden-left', 'hidden-right');
  });

  if (targetZone === 'market') {
    DOM.zoneMarket.classList.add('active-zone');
    DOM.zoneTavern.classList.add('hidden-right');
    DOM.zoneForest.classList.add('hidden-right');
    renderMarket();
    stopHeartbeatMonitor();
  } else if (targetZone === 'tavern') {
    DOM.zoneTavern.classList.add('active-zone');
    DOM.zoneMarket.classList.add('hidden-left');
    DOM.zoneForest.classList.add('hidden-right');
    updateResourceDisplays();
    stopHeartbeatMonitor();
  } else if (targetZone === 'forest') {
    DOM.zoneForest.classList.add('active-zone');
    DOM.zoneMarket.classList.add('hidden-left');
    DOM.zoneTavern.classList.add('hidden-left');
    updateForestHUD();
    startHeartbeatMonitor();
  }

  window.soundEngine.playIceClink();
}

DOM.navMarket.addEventListener('click', () => switchZone('market'));
DOM.navTavern.addEventListener('click', () => switchZone('tavern'));
DOM.navForest.addEventListener('click', () => switchZone('forest'));

// ==================== 6. 神祕森林探索與防迷路系統 ====================

function updateForestHUD() {
  DOM.forestDistance.textContent = game.forestDistance;
  const pct = Math.min(100, (game.forestDistance / game.forestLimit) * 100);
  DOM.gaugeFill.style.width = `${pct}%`;

  DOM.dangerLevel.classList.remove('safe', 'warning', 'danger');
  DOM.mistOverlay.classList.remove('warning', 'extreme');

  if (game.forestDistance < game.forestMaxSafe) {
    DOM.dangerLevel.textContent = '安全範圍';
    DOM.dangerLevel.classList.add('safe');
    DOM.mistOverlay.style.opacity = '0';
  } else if (game.forestDistance < game.forestMaxDanger) {
    DOM.dangerLevel.textContent = '起霧警戒！';
    DOM.dangerLevel.classList.add('warning');
    DOM.mistOverlay.style.opacity = '0.5';
    DOM.mistOverlay.classList.add('warning');
  } else {
    DOM.dangerLevel.textContent = '⚠️ 極度危險！即將迷失';
    DOM.dangerLevel.classList.add('danger');
    DOM.mistOverlay.style.opacity = '0.9';
    DOM.mistOverlay.classList.add('extreme');
  }

  renderForestEncounters();
}

// 根據目前距離隨機刷新採集物與寶箱
function renderForestEncounters() {
  DOM.forestEncounters.innerHTML = '';

  if (game.forestDistance === 0) {
    DOM.forestEncounters.innerHTML = `
      <div class="encounter-card glass-panel" style="grid-column: 1 / -1;">
        <span class="encounter-icon">⛺</span>
        <div class="encounter-title">酒吧林徑邊緣</div>
        <p style="color:var(--text-muted);font-size:0.88rem;">點擊「深入探索」向森林深處前進。距離越遠，越有機會遇見傳說原料與古代寶箱！</p>
      </div>
    `;
    return;
  }

  // 產生 1~3 個探索點
  const count = Math.min(3, 1 + Math.floor(game.forestDistance / 60));
  const pool = [
    { type: 'item', id: 'glowing_shroom', chance: 0.5 },
    { type: 'item', id: 'fairy_tear', chance: 0.35 },
    { type: 'item', id: 'dragon_chili', chance: 0.25 },
    { type: 'item', id: 'phoenix_ember', chance: 0.15 },
    { type: 'chest', gold: 30 + Math.floor(game.forestDistance * 0.5), chance: 0.4 }
  ];

  for (let i = 0; i < count; i++) {
    const itemPick = pool[Math.floor(Math.random() * pool.length)];
    const card = document.createElement('div');
    card.className = 'encounter-card glass-panel';

    if (itemPick.type === 'chest') {
      card.innerHTML = `
        <span class="encounter-icon">🎁</span>
        <div class="encounter-title">古代隱藏寶箱</div>
        <span class="encounter-rarity rarity-legend">藏有 ${itemPick.gold} 金幣與靈氣</span>
        <button class="action-btn glow-primary" style="margin-top:8px;padding:6px 14px;font-size:0.85rem;" onclick="gatherReward('chest', ${itemPick.gold}, this)">
          開啟寶箱
        </button>
      `;
    } else {
      const ing = INGREDIENTS[itemPick.id];
      card.innerHTML = `
        <span class="encounter-icon">${ing.icon}</span>
        <div class="encounter-title">${ing.name}</div>
        <span class="encounter-rarity rarity-rare">稀有原料</span>
        <button class="action-btn glow-green" style="margin-top:8px;padding:6px 14px;font-size:0.85rem;" onclick="gatherReward('item', '${ing.id}', this)">
          ✨ 採集採收
        </button>
      `;
    }
    DOM.forestEncounters.appendChild(card);
  }
}

// 拾取採集或寶箱
window.gatherReward = function(type, val, btnElem) {
  btnElem.disabled = true;
  btnElem.textContent = '已採集 ✓';

  if (type === 'chest') {
    game.gold += val;
    game.points += 5;
    window.soundEngine.playCoinSound();
  } else {
    game.inventory[val] = (game.inventory[val] || 0) + 1;
    game.collectedInCurrentRun[val] = (game.collectedInCurrentRun[val] || 0) + 1;
    window.soundEngine.playGatherSound();
  }

  updateResourceDisplays();
};

// 森林前進與後退
DOM.btnExploreForward.addEventListener('click', () => {
  game.forestDistance += 25;
  window.soundEngine.playIceClink();

  if (game.forestDistance >= game.forestLimit) {
    triggerLostInForest();
  } else {
    updateForestHUD();
  }
});

DOM.btnExploreBack.addEventListener('click', () => {
  game.forestDistance = Math.max(0, game.forestDistance - 25);
  window.soundEngine.playIceClink();
  updateForestHUD();
});

DOM.btnEmergencyReturn.addEventListener('click', () => {
  game.forestDistance = 0;
  game.collectedInCurrentRun = {};
  switchZone('tavern');
});

// 觸發迷路懲罰機制
function triggerLostInForest() {
  window.soundEngine.playLostSound();
  DOM.lostAlertBanner.classList.add('show');
  
  // 遺失本次採集物的一半
  Object.keys(game.collectedInCurrentRun).forEach(id => {
    const lostAmount = Math.ceil(game.collectedInCurrentRun[id] / 2);
    game.inventory[id] = Math.max(0, (game.inventory[id] || 0) - lostAmount);
  });
  game.collectedInCurrentRun = {};
  game.forestDistance = 0;

  setTimeout(() => {
    DOM.lostAlertBanner.classList.remove('show');
    switchZone('tavern');
  }, 3500);
}

// 心跳音效定時監聽器
function startHeartbeatMonitor() {
  stopHeartbeatMonitor();
  game.heartbeatInterval = setInterval(() => {
    if (game.currentZone !== 'forest') return;
    if (game.forestDistance >= game.forestMaxDanger) {
      window.soundEngine.playHeartbeat(0.65);
    } else if (game.forestDistance >= game.forestMaxSafe) {
      window.soundEngine.playHeartbeat(0.35);
    }
  }, 1600);
}

function stopHeartbeatMonitor() {
  if (game.heartbeatInterval) {
    clearInterval(game.heartbeatInterval);
    game.heartbeatInterval = null;
  }
  DOM.mistOverlay.style.opacity = '0';
  DOM.mistOverlay.classList.remove('warning', 'extreme');
}

// ==================== 7. 調酒互動工作台 ====================

const canvas = DOM.cocktailCanvas;
const ctx = canvas.getContext('2d');

DOM.openBartenderBtn.addEventListener('click', () => {
  openBartenderModal();
});

DOM.closeBartenderBtn.addEventListener('click', () => {
  closeBartenderModal();
});

function openBartenderModal() {
  DOM.bartenderModal.classList.remove('hidden');
  renderBartenderIngredients();
  drawCocktailGlass();
  updateFlavorHUD();
}

function closeBartenderModal() {
  DOM.bartenderModal.classList.add('hidden');
  stopPouring();
}

function renderBartenderIngredients() {
  DOM.ingredientGrid.innerHTML = '';
  let firstAvailable = null;

  Object.values(INGREDIENTS).forEach(item => {
    const count = game.inventory[item.id] || 0;
    const card = document.createElement('div');
    card.className = `ing-select-card ${game.selectedIngredient === item.id ? 'selected' : ''}`;
    if (count <= 0) {
      card.style.opacity = '0.35';
      card.style.pointerEvents = 'none';
    } else if (!firstAvailable) {
      firstAvailable = item.id;
    }

    const flvText = Object.entries(item.flavors)
      .filter(([_, v]) => v > 0)
      .map(([k, v]) => {
        const short = { sweet: '甜', sour: '酸', spirit: '烈', magic: '魔', spicy: '辣' };
        return `${short[k]}${v}`;
      }).join(' ');

    card.innerHTML = `
      <div class="ing-select-top">
        <span class="ing-name">${item.icon} ${item.name}</span>
        <span class="ing-count">x${count}</span>
      </div>
      <div class="ing-flavors">${flvText}</div>
    `;

    card.addEventListener('click', () => {
      selectIngredient(item.id);
    });

    DOM.ingredientGrid.appendChild(card);
  });

  if (!game.selectedIngredient && firstAvailable) {
    selectIngredient(firstAvailable);
  } else if (game.selectedIngredient) {
    selectIngredient(game.selectedIngredient);
  }
}

function selectIngredient(id) {
  game.selectedIngredient = id;
  const count = game.inventory[id] || 0;

  document.querySelectorAll('.ing-select-card').forEach(c => c.classList.remove('selected'));
  renderBartenderIngredients();

  if (count > 0) {
    const item = INGREDIENTS[id];
    DOM.pourBtn.disabled = false;
    DOM.pourBtn.innerHTML = `<span class="pour-btn-icon">${item.icon}</span> 按住注入 ${item.name}`;
  } else {
    DOM.pourBtn.disabled = true;
    DOM.pourBtn.textContent = '此原料已耗盡';
  }
}

// 倒酒長按事件（適配滑鼠 + 行動裝置觸控）
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

function getTotalVolume() {
  return game.glassLayers.reduce((sum, layer) => sum + layer.amount, 0);
}

function startPouring() {
  if (game.isPouring || !game.selectedIngredient) return;
  const count = game.inventory[game.selectedIngredient] || 0;
  if (count <= 0) return;

  const currentVol = getTotalVolume();
  if (currentVol >= game.glassCapacity) return;

  game.isPouring = true;
  DOM.pourBtn.classList.add('pouring');
  window.soundEngine.startPour();

  const item = INGREDIENTS[game.selectedIngredient];

  game.pourTimer = setInterval(() => {
    const vol = getTotalVolume();
    if (vol >= game.glassCapacity) {
      stopPouring();
      return;
    }

    // 每次注入 2.5ml
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

    // 扣除庫存 (每倒滿 25ml 消耗 1 單位庫存)
    const totalPouredOfThis = game.glassLayers
      .filter(l => l.id === item.id)
      .reduce((s, l) => s + l.amount, 0);
    
    // 即時微調
    drawCocktailGlass();
    updateFlavorHUD();
    DOM.finishDrinkBtn.disabled = getTotalVolume() < 20;

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

  // 結算原料消耗（一次調酒每使用該原料至少扣 1 份）
  if (game.selectedIngredient && game.inventory[game.selectedIngredient] > 0) {
    game.inventory[game.selectedIngredient] = Math.max(0, game.inventory[game.selectedIngredient] - 1);
    updateResourceDisplays();
    renderBartenderIngredients();
  }
}

// 倒掉重調
DOM.resetDrinkBtn.addEventListener('click', () => {
  game.glassLayers = [];
  stopPouring();
  drawCocktailGlass();
  updateFlavorHUD();
  DOM.finishDrinkBtn.disabled = true;
  window.soundEngine.playIceClink();
});

// Canvas 繪製調酒杯與液體分層
function drawCocktailGlass() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const glassX = 35;
  const glassY = 30;
  const glassW = 150;
  const glassH = 260;
  const bottomW = 100;

  // 1. 杯身背景與高光
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3;

  // 繪製高腳杯梯形輪廓路徑
  ctx.beginPath();
  ctx.moveTo(glassX, glassY);
  ctx.lineTo(glassX + (glassW - bottomW) / 2, glassY + glassH);
  ctx.lineTo(glassX + (glassW + bottomW) / 2, glassY + glassH);
  ctx.lineTo(glassX + glassW, glassY);
  ctx.stroke();

  // 2. 剪裁路徑以填滿液體
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(glassX, glassY);
  ctx.lineTo(glassX + (glassW - bottomW) / 2, glassY + glassH);
  ctx.lineTo(glassX + (glassW + bottomW) / 2, glassY + glassH);
  ctx.lineTo(glassX + glassW, glassY);
  ctx.closePath();
  ctx.clip();

  // 繪製各層液體（由底部堆疊向上）
  const totalVol = getTotalVolume();
  let currentBaseY = glassY + glassH;

  game.glassLayers.forEach((layer) => {
    const layerHeight = (layer.amount / game.glassCapacity) * glassH;
    const topY = currentBaseY - layerHeight;

    // 建立液體漸層與微光
    const grad = ctx.createLinearGradient(0, topY, 0, currentBaseY);
    grad.addColorStop(0, layer.color);
    grad.addColorStop(1, adjustColorBrightness(layer.color, -30));

    ctx.fillStyle = grad;
    ctx.fillRect(0, topY, canvas.width, layerHeight);

    // 液體表面流光小弧線
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(0, topY, canvas.width, 2.5);

    // 隨機小氣泡
    if (Math.random() > 0.4) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      const bX = glassX + 20 + Math.random() * (glassW - 40);
      const bY = topY + Math.random() * layerHeight;
      ctx.arc(bX, bY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    currentBaseY = topY;
  });

  ctx.restore(); // 取消 clip

  // 3. 杯身高光反光線
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(glassX + 6, glassY + 10);
  ctx.lineTo(glassX + (glassW - bottomW) / 2 + 6, glassY + glassH - 10);
  ctx.stroke();

  // 杯底座
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fillRect(glassX + 15, glassY + glassH, glassW - 30, 8);

  ctx.restore();

  // 更新體積數值
  DOM.glassVolumeText.textContent = `${Math.round(totalVol)} / ${game.glassCapacity} ml`;
}

// 輔助顏色明暗函式
function adjustColorBrightness(hex, percent) {
  let num = parseInt(hex.replace('#',''), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = (num >> 8 & 0x00FF) + amt,
      B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

// 更新風味儀表 HUD
function updateFlavorHUD() {
  const totals = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  let totalAmount = getTotalVolume() || 1;

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

// ==================== 8. 完成調配與綜合評分結算 ====================

DOM.finishDrinkBtn.addEventListener('click', () => {
  finishCocktailEvaluation();
});

function finishCocktailEvaluation() {
  const totalVol = getTotalVolume();
  if (totalVol < 15) return;

  closeBartenderModal();
  window.soundEngine.playFanfare();

  // 計算風味加總
  const flavors = { sweet: 0, sour: 0, spirit: 0, magic: 0, spicy: 0 };
  game.glassLayers.forEach(l => {
    Object.keys(flavors).forEach(k => {
      flavors[k] += (l.flavors[k] || 0) * (l.amount / 10);
    });
  });

  // 1. 視覺與分層評分 (1~5 星)
  const layerCount = game.glassLayers.length;
  let visualStars = 3;
  if (layerCount >= 3) visualStars = 5;
  else if (layerCount === 2) visualStars = 4;

  // 2. 倒酒精確度評分 (1~5 星)
  let precisionStars = 3;
  if (totalVol >= 85 && totalVol <= 100) precisionStars = 5;
  else if (totalVol >= 60) precisionStars = 4;
  else precisionStars = 2;

  // 3. 顧客風味契合度評分 (1~5 星)
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

  const flavorRatio = matchScore / (targetCount || 1);
  let flavorStars = Math.max(2, Math.min(5, Math.round(flavorRatio * 5)));

  // 命名演算法與酒名判定
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

  // 解鎖圖鑑
  game.unlockedRecipes.add(drinkName);

  // 計算三元獎勵
  const avgStars = (visualStars + precisionStars + flavorStars) / 3;
  const baseGold = 25 + Math.round(totalVol * 0.2);
  const tipBonus = cust.tipBonus * (avgStars / 4);
  const earnedGold = Math.round(baseGold * tipBonus);
  const earnedRep = Math.max(3, Math.round(avgStars * 2.2));
  const earnedPts = Math.round(avgStars * 3 + (layerCount >= 3 ? 5 : 0));

  // 發放獎勵
  game.gold += earnedGold;
  game.reputation += earnedRep;
  game.points += earnedPts;

  // 渲染結算視窗
  DOM.resDrinkName.textContent = drinkName;
  DOM.resDrinkTier.textContent = tier;
  DOM.resVisualStars.textContent = '⭐'.repeat(visualStars);
  DOM.resFlavorStars.textContent = '⭐'.repeat(flavorStars);
  DOM.resPrecisionStars.textContent = '⭐'.repeat(precisionStars);

  DOM.resNpcAvatar.textContent = cust.avatar;
  DOM.resNpcName.textContent = cust.name;
  
  let comment = `「非常感謝！這正是我想品嚐的風味，乾杯！」`;
  if (avgStars >= 4.5) {
    comment = `「不可思議！這色彩如同星河倒映，香氣在舌尖綻放，這是我一生喝過最驚豔的特調！」`;
  } else if (avgStars >= 3.5) {
    comment = `「層次調配得非常巧妙，恰到好處的口感讓我疲勞盡消，期待下次再來！」`;
  }
  DOM.resNpcComment.textContent = comment;

  DOM.resEarnGold.textContent = `+${earnedGold}`;
  DOM.resEarnRep.textContent = `+${earnedRep}`;
  DOM.resEarnPts.textContent = `+${earnedPts}`;

  // 清空調酒杯
  game.glassLayers = [];

  // 顯示結果
  DOM.resultModal.classList.remove('hidden');
  updateResourceDisplays();
}

DOM.confirmResultBtn.addEventListener('click', () => {
  DOM.resultModal.classList.add('hidden');
  // 切換至下一位顧客
  game.currentCustomerIndex = (game.currentCustomerIndex + 1) % CUSTOMERS.length;
  renderCustomer();
});

// ==================== 9. 圖鑑收藏櫃 ====================

DOM.recipeBookBtn.addEventListener('click', () => {
  openRecipeBook();
});

DOM.closeBookBtn.addEventListener('click', () => {
  DOM.recipeBookModal.classList.add('hidden');
});

function openRecipeBook() {
  DOM.recipeGrid.innerHTML = '';

  RECIPES_CATALOG.forEach(r => {
    const isUnlocked = game.unlockedRecipes.has(r.name);
    const card = document.createElement('div');
    card.className = `recipe-card glass-panel ${isUnlocked ? '' : 'locked'}`;

    card.innerHTML = `
      <div style="font-size:1.8rem;">${isUnlocked ? r.icon : '🔒'}</div>
      <div class="recipe-card-name">${isUnlocked ? r.name : '？？？（未解鎖）'}</div>
      <div class="recipe-card-tags">${r.tags}</div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;">
        ${isUnlocked ? '已完成解鎖記錄' : `解鎖線索: ${r.requirement}`}
      </p>
    `;

    DOM.recipeGrid.appendChild(card);
  });

  DOM.recipeBookModal.classList.remove('hidden');
}

// 音效開關
DOM.audioToggleBtn.addEventListener('click', () => {
  const muted = window.soundEngine.toggleMute();
  DOM.audioToggleBtn.textContent = muted ? '🔇' : '🔊';
  DOM.audioToggleBtn.title = muted ? '音效已靜音' : '音效已開啟';
});

// 初始化載入
function initGame() {
  updateResourceDisplays();
  renderCustomer();
  renderMarket();
  updateForestHUD();
}

window.addEventListener('DOMContentLoaded', () => {
  initGame();
});
