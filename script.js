const MONTHS = [
  { key: 'jan', label: 'Jan', name: 'Janeiro' },
  { key: 'fev', label: 'Fev', name: 'Fevereiro' },
  { key: 'mar', label: 'Mar', name: 'Março' },
  { key: 'abr', label: 'Abr', name: 'Abril' },
  { key: 'mai', label: 'Mai', name: 'Maio' },
  { key: 'jun', label: 'Jun', name: 'Junho' },
  { key: 'jul', label: 'Jul', name: 'Julho' },
  { key: 'ago', label: 'Ago', name: 'Agosto' },
  { key: 'set', label: 'Set', name: 'Setembro' },
  { key: 'out', label: 'Out', name: 'Outubro' },
  { key: 'nov', label: 'Nov', name: 'Novembro' },
  { key: 'dez', label: 'Dez', name: 'Dezembro' },
];

// Preenchidos a partir da API (/api/parks), que lê a base de dados TiDB.
let PARKS = [];
let ZONE_META = {};
let CITY_MONTH_SERIES = Array(12).fill(null);

function slugify(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function loadDashboardData() {
  const response = await fetch('/api/parks', { headers: { Accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`Pedido dos dados dos parques falhou (${response.status}).`);
  }

  const data = await response.json();
  if (!data || !Array.isArray(data.parks) || !Array.isArray(data.cityMonthly)) {
    throw new TypeError('A resposta da API dos parques tem um formato inválido.');
  }

  const zones = {};
  PARKS = data.parks.map((park) => {
    const zoneId = slugify(park.zone);
    zones[zoneId] = { label: park.zone };
    return {
      id: park.id,
      name: park.name,
      zoneId,
      capacity: park.capacity || 0,
      occupancy: park.occupancy ?? 0,
      maximum: park.peak ?? 0,
      monthly: park.monthly,
      cluster: park.cluster,
      demandProfile: park.demandProfile,
    };
  });
  ZONE_META = Object.fromEntries(
    Object.entries(zones).sort(([, a], [, b]) => a.label.localeCompare(b.label, 'pt')),
  );
  CITY_MONTH_SERIES = data.cityMonthly;

  parkLocations = new Map();
  data.parks.forEach((park) => {
    if (Number.isFinite(park.latitude) && Number.isFinite(park.longitude)) {
      parkLocations.set(park.id, { latitude: park.latitude, longitude: park.longitude });
    }
  });
}

const FAVORITES_STORAGE_KEY = 'parkview:favorites:v1';

function readFavoriteParkIds() {
  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedFavorites) return { ids: new Set(), error: '' };

    const parsedFavorites = JSON.parse(storedFavorites);
    if (!Array.isArray(parsedFavorites)) {
      throw new TypeError('Os favoritos guardados não têm o formato esperado.');
    }

    // Os parques só chegam da API depois; aqui guardam-se apenas ids válidos (ex.: "P016").
    const favoriteIds = parsedFavorites.filter((id) => typeof id === 'string');
    return { ids: new Set(favoriteIds), error: '' };
  } catch (error) {
    console.error('Não foi possível carregar os parques favoritos.', error);
    return { ids: new Set(), error: 'Não foi possível carregar os favoritos guardados neste browser.' };
  }
}

const storedFavorites = readFavoriteParkIds();

const state = {
  zoneFilter: 'all',
  monthFilter: 'all',
  parkFilter: 'all',
  selectedParkId: null,
  selectedZoneId: 'all',
  favoriteParkIds: storedFavorites.ids,
  favoriteStorageError: storedFavorites.error,
};

let parkMap = null;
let parkMarkersLayer = null;
let parkLocations = new Map();
let lastMappedParkId = null;

const parkInfoState = {
  parkId: null,
  requestId: 0,
  status: 'idle',
  data: null,
};

const numberFormatter = new Intl.NumberFormat('pt-PT');
const currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

// Só os campos que existem nos dados da EMEL (ver server.js, /api/parks/:id/info).
const parkInfoFields = {
  places: [
    { key: 'total_spaces', label: 'Lugares totais', format: 'number' },
    { key: 'reduced_mobility_spaces', label: 'Mobilidade reduzida', format: 'number' },
  ],
  schedules: [
    { key: 'service_hours', label: 'Horário de rotação', format: 'text' },
    { key: 'subscription_hours', label: 'Horário de avenças', format: 'text' },
  ],
  prices: [
    { key: 'first_hour_price', label: 'Primeira hora', format: 'currency' },
    { key: 'daily_max_price', label: 'Máximo diário', format: 'currency' },
  ],
  details: [
    { key: 'park_type', label: 'Tipologia', format: 'text' },
    { key: 'operation_mode', label: 'Modo de exploração', format: 'text' },
  ],
  transport: [
    { key: 'nearest_metro', label: 'Metro mais próximo', format: 'text' },
    { key: 'nearest_metro_distance_m', label: 'Distância ao metro', format: 'meters' },
    { key: 'bus_stops_300m', label: 'Paragens de autocarro (300 m)', format: 'number' },
  ],
  products: [
    { key: 'subscriptions', label: 'Avenças', icon: 'pass' },
    { key: 'electric_charging', label: 'Carregamento elétrico', icon: 'bolt' },
  ],
  payments: [
    { key: 'via_verde_payment', label: 'Via Verde', icon: 'toll' },
  ],
};

const parkInfoIconPaths = {
  pass: '<path d="M4 5h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4z"/><path d="M12 7v2m0 2v2m0 2v2"/>',
  bolt: '<path d="m13 2-3 8h6l-5 12 2-9H7z"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  terminal: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h3m-3 6h8"/>',
  camera: '<path d="M4 7h3l2-3h6l2 3h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><circle cx="12" cy="13" r="3"/>',
  elevator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="m9 8 2-2 2 2m-4 8 2 2 2-2m2-7v6"/>',
  wash: '<path d="M3 15h18l-2-6H5zM5 15l-1 4h16l-1-4"/><circle cx="8" cy="18" r="1"/><circle cx="16" cy="18" r="1"/><path d="M8 5v2m4-3v3m4-2v2"/>',
  phone: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 18h4"/>',
  card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18m-14 5h4"/>',
  cash: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 9h.01M18 15h.01"/>',
  toll: '<path d="M3 19h18M5 19V9h14v10M8 9V5h8v4"/><path d="m10 3 2-2 2 2"/>',
  car: '<path d="m5 11 2-5h10l2 5 2 2v5h-2v-2H5v2H3v-5z"/><circle cx="7" cy="14" r="1"/><circle cx="17" cy="14" r="1"/>',
  van: '<path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>',
  motorcycle: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="m6 17 4-7h4l4 7m-6-7-2-3h4m-2 3 4 2"/>',
  ruler: '<path d="M4 20 20 4l-3-3L1 17zM7 17l-2-2m5-1-2-2m5-1-2-2m5-1-2-2"/>',
};

function getParkInfo(parkId) {
  return fetch(`/api/parks/${encodeURIComponent(parkId)}/info`, {
    headers: { Accept: 'application/json' },
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`Pedido de informação do parque falhou (${response.status}).`);
    }

    return response.json();
  }).then((data) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new TypeError('A resposta da informação do parque tem um formato inválido.');
    }
    return data;
  });
}

function hasParkInfoValue(value) {
  return value !== null && value !== undefined && value !== '';
}

function escapeParkInfoHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function formatParkInfoValue(value, format) {
  if (typeof value === 'boolean') return value ? 'Sim' : 'Não';
  if (format === 'currency' && Number.isFinite(Number(value))) return currencyFormatter.format(Number(value));
  if (format === 'number' && Number.isFinite(Number(value))) return numberFormatter.format(Number(value));
  if (format === 'meters' && Number.isFinite(Number(value))) return `${numberFormatter.format(Number(value))} m`;
  return escapeParkInfoHtml(value);
}

function renderParkInfoTable(title, fields, data) {
  const rows = fields.filter(({ key }) => hasParkInfoValue(data[key]));
  if (!rows.length) return '';

  return `
    <section class="park-info-section">
      <h5>${title}</h5>
      <table class="park-info-table">
        <tbody>
          ${rows.map(({ key, label, format }) => `
            <tr><th scope="row">${label}</th><td>${formatParkInfoValue(data[key], format)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
}

function renderParkInfoGroup(title, fields, data) {
  const items = fields.filter(({ key }) => hasParkInfoValue(data[key]));
  if (!items.length) return '';

  return `
    <section class="park-info-section">
      <h5>${title}</h5>
      <ul class="park-info-list">
        ${items.map(({ key, label, icon }) => `
          <li class="park-info-item">
            <svg class="park-info-icon" viewBox="0 0 24 24" aria-hidden="true">${parkInfoIconPaths[icon]}</svg>
            <span class="park-info-label">${label}</span>
            <strong>${formatParkInfoValue(data[key], 'boolean')}</strong>
          </li>
        `).join('')}
      </ul>
    </section>
  `;
}

function renderParkInfoContent(container, selectedPark) {
  if (parkInfoState.status === 'loading') {
    container.setAttribute('aria-busy', 'true');
    container.innerHTML = '<p class="park-info-message" role="status">A carregar informação do parque…</p>';
    return;
  }

  if (parkInfoState.status === 'error') {
    container.setAttribute('aria-busy', 'false');
    container.innerHTML = '<p class="park-info-message" role="status">Informação indisponível. Tenta novamente mais tarde.</p>';
    return;
  }

  const data = parkInfoState.data || {};
  const allFields = [
    ...parkInfoFields.places,
    ...parkInfoFields.schedules,
    ...parkInfoFields.prices,
    ...parkInfoFields.details,
    ...parkInfoFields.transport,
    ...parkInfoFields.products,
    ...parkInfoFields.payments,
  ];
  if (!allFields.some(({ key }) => hasParkInfoValue(data[key]))) {
    container.setAttribute('aria-busy', 'false');
    container.innerHTML = `
      <div class="park-info-heading"><h4>Informação do parque</h4><p>${escapeParkInfoHtml(selectedPark.name)}</p></div>
      <p class="park-info-message">Não existe informação disponível para este parque.</p>
    `;
    return;
  }

  container.setAttribute('aria-busy', 'false');
  container.innerHTML = `
    <div class="park-info-heading"><h4>Informação do parque</h4><p>${escapeParkInfoHtml(selectedPark.name)}</p></div>
    <div class="park-info-grid">
      <div class="park-info-column">
        ${renderParkInfoTable('Horários', parkInfoFields.schedules, data)}
        ${renderParkInfoTable('Preços gerais', parkInfoFields.prices, data)}
        ${renderParkInfoTable('Lugares', parkInfoFields.places, data)}
      </div>
      <div class="park-info-column">
        ${renderParkInfoTable('Caracterização', parkInfoFields.details, data)}
        ${renderParkInfoTable('Transportes próximos', parkInfoFields.transport, data)}
        ${renderParkInfoGroup('Produtos', parkInfoFields.products, data)}
        ${renderParkInfoGroup('Forma de pagamento', parkInfoFields.payments, data)}
      </div>
    </div>
  `;
}

function renderParkInfo() {
  const container = document.getElementById('parkInfo');
  const selectedPark = getSelectedPark();
  if (!selectedPark) {
    parkInfoState.requestId += 1;
    parkInfoState.parkId = null;
    parkInfoState.status = 'idle';
    parkInfoState.data = null;
    container.hidden = true;
    container.setAttribute('aria-busy', 'false');
    container.innerHTML = '';
    return;
  }

  container.hidden = false;
  if (parkInfoState.parkId !== selectedPark.id) {
    const requestId = parkInfoState.requestId + 1;
    parkInfoState.parkId = selectedPark.id;
    parkInfoState.requestId = requestId;
    parkInfoState.status = 'loading';
    parkInfoState.data = null;
    renderParkInfoContent(container, selectedPark);

    getParkInfo(selectedPark.id).then((data) => {
      if (parkInfoState.requestId !== requestId || parkInfoState.parkId !== selectedPark.id) return;
      parkInfoState.status = 'loaded';
      parkInfoState.data = data;
      renderParkInfoContent(container, selectedPark);
    }).catch(() => {
      if (parkInfoState.requestId !== requestId || parkInfoState.parkId !== selectedPark.id) return;
      parkInfoState.status = 'error';
      renderParkInfoContent(container, selectedPark);
    });
    return;
  }

  renderParkInfoContent(container, selectedPark);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getEffectiveOccupancy(park, monthKey = 'all') {
  if (monthKey === 'all') return park.occupancy;
  const monthIndex = MONTHS.findIndex((item) => item.key === monthKey);
  const value = park.monthly?.[monthIndex];
  return clamp(value ?? park.occupancy, 0, 100);
}

// Limites ajustados aos dados reais de 2022 (taxas médias entre 13% e 71%);
// ficam próximos dos perfis de procura do clustering (C1/C3/C2).
function getParkPressureClass(value) {
  if (value < 30) return 'low';
  if (value < 50) return 'medium';
  return 'high';
}

function getSelectedPark() {
  return PARKS.find((park) => park.id === state.selectedParkId) || null;
}

function getFilteredParks() {
  const byZone = state.zoneFilter === 'all'
    ? PARKS
    : PARKS.filter((park) => park.zoneId === state.zoneFilter);

  if (state.parkFilter !== 'all') {
    return byZone.filter((park) => park.id === state.parkFilter);
  }

  return byZone;
}

function getZoneParks(zoneId) {
  return PARKS.filter((park) => park.zoneId === zoneId);
}

function getZoneOccupancy(zoneId, monthKey = 'all') {
  const zoneParks = getZoneParks(zoneId);
  if (!zoneParks.length) return 0;
  const adjustedTotal = zoneParks.reduce((sum, park) => sum + (park.capacity * getEffectiveOccupancy(park, monthKey)), 0);
  const totalCapacity = zoneParks.reduce((sum, park) => sum + park.capacity, 0);
  return totalCapacity ? adjustedTotal / totalCapacity : 0;
}

function getCityWeightedOccupancy(monthKey = 'all') {
  const filtered = getFilteredParks();
  if (!filtered.length) return 0;
  const totalCapacity = filtered.reduce((sum, park) => sum + park.capacity, 0);
  const weightedTotal = filtered.reduce((sum, park) => sum + (park.capacity * getEffectiveOccupancy(park, monthKey)), 0);
  return totalCapacity ? weightedTotal / totalCapacity : 0;
}

function getCriticalPark(monthKey = 'all') {
  const filtered = getFilteredParks();
  if (!filtered.length) return null;

  return filtered.reduce((max, park) => {
    const value = getEffectiveOccupancy(park, monthKey);
    if (!max || value > max.value) {
      return { park, value };
    }
    return max;
  }, null);
}

function updateFilterOptions() {
  const zoneSelect = document.getElementById('zoneFilter');
  const parkSelect = document.getElementById('parkFilter');

  const zoneOptions = ['<option value="all">Todas as freguesias</option>'];
  Object.entries(ZONE_META).forEach(([zoneId, meta]) => {
    zoneOptions.push(`<option value="${zoneId}">${meta.label}</option>`);
  });
  zoneSelect.innerHTML = zoneOptions.join('');
  zoneSelect.value = state.zoneFilter;

  const relevantParks = state.zoneFilter === 'all'
    ? PARKS
    : PARKS.filter((park) => park.zoneId === state.zoneFilter);

  const parkOptions = ['<option value="all">Todos os parques</option>'];
  relevantParks.forEach((park) => {
    parkOptions.push(`<option value="${park.id}">${park.name}</option>`);
  });
  parkSelect.innerHTML = parkOptions.join('');

  if (state.parkFilter !== 'all' && !relevantParks.some((park) => park.id === state.parkFilter)) {
    state.parkFilter = 'all';
  }
  parkSelect.value = state.parkFilter;
}

function renderKpis() {
  const kpiGrid = document.getElementById('kpiGrid');
  const filteredParks = getFilteredParks();
  const totalCapacity = filteredParks.reduce((sum, park) => sum + park.capacity, 0);
  const occupancyRate = getCityWeightedOccupancy(state.monthFilter);
  const critical = getCriticalPark(state.monthFilter);
  const peakMonthIndex = CITY_MONTH_SERIES.reduce(
    (best, value, index) => (value !== null && (best < 0 || value > CITY_MONTH_SERIES[best]) ? index : best),
    -1,
  );

  const kpis = [
    {
      label: 'Lugares totais',
      value: `${numberFormatter.format(totalCapacity)}`,
      subvalue: `${filteredParks.length} ${filteredParks.length === 1 ? "parque" : "parques"}`,
      badge: 'primary',
      type: 'total',
    },
    {
      label: 'Taxa média de ocupação',
      value: `${Math.round(occupancyRate)}%`,
      subvalue: 'média ponderada',
      badge: 'teal',
      type: 'progress',
      progress: Math.round(occupancyRate),
    },
    {
      label: 'Parque mais crítico',
      value: critical ? critical.park.name : 'Sem dados',
      subvalue: critical ? `${Math.round(getEffectiveOccupancy(critical.park, state.monthFilter))}% ocupação` : '—',
      badge: 'warning',
      type: 'text',
    },
    {
      label: 'Mês de maior pressão',
      value: peakMonthIndex >= 0 ? MONTHS[peakMonthIndex].name : 'Sem dados',
      subvalue: peakMonthIndex >= 0 ? `${Math.round(CITY_MONTH_SERIES[peakMonthIndex])}% ocupação média` : '—',
      badge: 'danger',
      type: 'text',
    },
  ];

  kpiGrid.innerHTML = kpis.map((kpi) => {
    if (kpi.type === 'progress') {
      return `
        <article class="kpi-card" aria-label="${kpi.label}">
          <div class="kpi-topline">
            <span class="kpi-label">${kpi.label}</span>
            <span class="kpi-badge" style="background:${kpi.badge === 'teal' ? '#2a9d86' : '#197a9e'}"></span>
          </div>
          <div class="kpi-progress">
            <div>
              <h3 class="kpi-value">${kpi.value}</h3>
              <div class="kpi-subvalue">${kpi.subvalue}</div>
            </div>
            <div class="progress-ring" style="--progress:${kpi.progress}; background: conic-gradient(var(--primary) ${kpi.progress}%, rgba(25, 122, 158, 0.12) 0);">
              <span>${kpi.progress}%</span>
            </div>
          </div>
        </article>
      `;
    }

    return `
      <article class="kpi-card" aria-label="${kpi.label}">
        <div class="kpi-topline">
          <span class="kpi-label">${kpi.label}</span>
          <span class="kpi-badge" style="background:${kpi.badge === 'primary' ? '#197a9e' : kpi.badge === 'teal' ? '#2a9d86' : kpi.badge === 'warning' ? '#dfa13a' : '#df5a5a'}"></span>
        </div>
        <h3 class="kpi-value">${kpi.value}</h3>
        <div class="kpi-subvalue">${kpi.subvalue}</div>
      </article>
    `;
  }).join('');
}

function initializeParkMap() {
  const notice = document.getElementById('mapNotice');
  if (!window.L) {
    notice.textContent = 'Não foi possível carregar o mapa. Verifica a ligação à internet e tenta novamente.';
    throw new Error('A biblioteca Leaflet não foi carregada.');
  }

  parkMap = window.L.map('mapCanvas', { scrollWheelZoom: false }).setView([38.735, -9.145], 12);
  window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(parkMap);
  window.L.control.scale({ imperial: false }).addTo(parkMap);
  if (!window.L.markerClusterGroup) {
    notice.textContent = 'Não foi possível carregar o agrupamento dos pontos do mapa. Verifica a ligação à internet e tenta novamente.';
    throw new Error('O plugin Leaflet.markercluster não foi carregado.');
  }
  parkMarkersLayer = window.L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 35,
    disableClusteringAtZoom: 17,
    iconCreateFunction: (cluster) => window.L.divIcon({
      html: `<span>${cluster.getChildCount()}</span>`,
      className: 'park-marker-cluster',
      iconSize: [40, 40],
    }),
  }).addTo(parkMap);
}

function renderMap() {
  if (!parkMap || !parkMarkersLayer) return;

  const visibleParkIds = new Set(getFilteredParks().map((park) => park.id));
  const selectedPark = getSelectedPark();
  parkMarkersLayer.clearLayers();

  PARKS.forEach((park) => {
    const location = parkLocations.get(park.id);
    if (!location) return;

    const occupancy = getEffectiveOccupancy(park, state.monthFilter);
    const pressureClass = getParkPressureClass(occupancy);
    const isSelected = state.selectedParkId === park.id;
    const isVisible = visibleParkIds.has(park.id);
    const icon = window.L.divIcon({
      className: 'park-leaflet-icon',
      html: `<span class="park-map-marker ${pressureClass} ${isSelected ? 'is-selected' : ''} ${isVisible ? '' : 'is-dimmed'}" aria-hidden="true"><span>P</span></span>`,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
    const marker = window.L.marker([location.latitude, location.longitude], {
      icon,
      keyboard: true,
      title: park.name,
      alt: `${park.name}, ${ZONE_META[park.zoneId].label}`,
    });
    marker.bindTooltip(
      `${park.name}<br>${ZONE_META[park.zoneId].label}<br>Ocupação: ${Math.round(occupancy)}%`,
    );
    marker.on('click', () => {
      state.selectedParkId = park.id;
      state.selectedZoneId = park.zoneId;
      updateDashboard();
    });
    marker.addTo(parkMarkersLayer);
  });

  if (selectedPark && lastMappedParkId !== selectedPark.id) {
    const location = parkLocations.get(selectedPark.id);
    if (location) {
      parkMap.setView(
        [location.latitude, location.longitude],
        Math.max(parkMap.getZoom(), 15),
      );
    }
  }
  lastMappedParkId = selectedPark ? selectedPark.id : null;
}

function renderMapSummary() {
  const summaryContainer = document.getElementById('mapSummary');
  const filteredParks = getFilteredParks();
  const totalCapacity = filteredParks.reduce((sum, park) => sum + park.capacity, 0);
  const avgOccupancy = filteredParks.length ? (filteredParks.reduce((sum, park) => sum + getEffectiveOccupancy(park, state.monthFilter), 0) / filteredParks.length) : 0;

  summaryContainer.innerHTML = `
    <div class="summary-item">
      <span class="label">Parques visíveis</span>
      <strong>${filteredParks.length}</strong>
    </div>
    <div class="summary-item">
      <span class="label">Total de lugares</span>
      <strong>${numberFormatter.format(totalCapacity)}</strong>
    </div>
    <div class="summary-item">
      <span class="label">Ocupação média</span>
      <strong>${Math.round(avgOccupancy)}%</strong>
    </div>
  `;
}

function renderParkDetail() {
  const parkDetail = document.getElementById('parkDetail');
  const selectedPark = getSelectedPark();

  if (!selectedPark) {
    parkDetail.innerHTML = `
      <div class="detail-header">
        <h4>Selecione um parque</h4>
      </div>
      <p style="margin:0;color:var(--muted);">Clique num marcador do mapa ou numa linha do ranking para ver a informação detalhada.</p>
    `;
    return;
  }

  const occupancy = getEffectiveOccupancy(selectedPark, state.monthFilter);
  const pressureClass = getParkPressureClass(occupancy);
  const isFavorite = state.favoriteParkIds.has(selectedPark.id);

  parkDetail.innerHTML = `
    <div class="detail-header">
      <h4>${selectedPark.name}</h4>
      <div class="detail-actions">
        <button type="button" class="favorite-toggle ${isFavorite ? 'is-favorite' : ''}" data-park-id="${selectedPark.id}" aria-pressed="${isFavorite}" aria-label="${isFavorite ? 'Remover' : 'Adicionar'} ${selectedPark.name} ${isFavorite ? 'dos' : 'aos'} favoritos">${isFavorite ? '★' : '☆'}</button>
        <span class="pressure-pill ${pressureClass}">${pressureClass === 'low' ? 'Baixa' : pressureClass === 'medium' ? 'Média' : 'Alta'}</span>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-item"><span>Freguesia</span><strong>${ZONE_META[selectedPark.zoneId].label}</strong></div>
      <div class="detail-item"><span>Capacidade</span><strong>${numberFormatter.format(selectedPark.capacity)}</strong></div>
      <div class="detail-item"><span>Taxa média</span><strong>${Math.round(occupancy)}%</strong></div>
      <div class="detail-item"><span>Pico (percentil 90)</span><strong>${Math.round(selectedPark.maximum)}%</strong></div>
      <div class="detail-item"><span>Perfil de procura</span><strong>${selectedPark.demandProfile || '—'}</strong></div>
    </div>
  `;

  parkDetail.querySelector('.favorite-toggle').addEventListener('click', () => {
    toggleFavorite(selectedPark.id);
  });
}

function renderFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  const favoriteParks = PARKS.filter((park) => state.favoriteParkIds.has(park.id));

  if (state.favoriteStorageError) {
    favoritesList.innerHTML = `<p class="favorites-message" role="status">${state.favoriteStorageError}</p>`;
    return;
  }

  if (!favoriteParks.length) {
    favoritesList.innerHTML = '<p class="favorites-message">Ainda não guardaste parques. Seleciona um no mapa e carrega na estrela.</p>';
    return;
  }

  favoritesList.innerHTML = favoriteParks.map((park) => `
    <div class="favorite-row">
      <button type="button" class="favorite-select" data-park-id="${park.id}" aria-label="Ver ${park.name}">
        <span class="favorite-name">${park.name}</span>
        <span class="favorite-zone">${ZONE_META[park.zoneId].label}</span>
      </button>
      <button type="button" class="favorite-toggle is-favorite" data-park-id="${park.id}" aria-pressed="true" aria-label="Remover ${park.name} dos favoritos">★</button>
    </div>
  `).join('');

  favoritesList.querySelectorAll('.favorite-select').forEach((button) => {
    button.addEventListener('click', () => {
      const parkId = button.getAttribute('data-park-id');
      const park = PARKS.find((item) => item.id === parkId);
      state.selectedParkId = parkId;
      state.selectedZoneId = park.zoneId;
      state.zoneFilter = park.zoneId;
      state.parkFilter = 'all';
      updateDashboard();
    });
  });

  favoritesList.querySelectorAll('.favorite-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      toggleFavorite(button.getAttribute('data-park-id'));
    });
  });
}

function toggleFavorite(parkId) {
  const nextFavoriteIds = new Set(state.favoriteParkIds);
  if (nextFavoriteIds.has(parkId)) {
    nextFavoriteIds.delete(parkId);
  } else {
    nextFavoriteIds.add(parkId);
  }

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...nextFavoriteIds]));
    state.favoriteParkIds = nextFavoriteIds;
    state.favoriteStorageError = '';
  } catch (error) {
    console.error('Não foi possível guardar os parques favoritos.', error);
    state.favoriteStorageError = 'Não foi possível guardar os favoritos neste browser. Verifica as definições de armazenamento.';
  }

  updateDashboard();
}

function renderZoneChart() {
  const container = document.getElementById('zoneChart');
  const zoneEntries = Object.entries(ZONE_META);

  const rows = zoneEntries.map(([zoneId, meta]) => {
    const zoneParks = getZoneParks(zoneId);
    const totalCapacity = zoneParks.reduce((sum, park) => sum + park.capacity, 0);
    const occupiedPlaces = zoneParks.reduce((sum, park) => sum + Math.round((park.capacity * getEffectiveOccupancy(park, state.monthFilter)) / 100), 0);
    const occupancyRate = totalCapacity ? (occupiedPlaces / totalCapacity) * 100 : 0;
    const pressureClass = getParkPressureClass(occupancyRate);
    const isSelected = state.zoneFilter === zoneId || state.selectedZoneId === zoneId;

    return `
      <button type="button" class="zone-row ${isSelected ? 'is-selected' : ''}" data-zone-id="${zoneId}" aria-label="Detalhes da freguesia ${meta.label}">
        <div class="zone-row-header">
          <strong>${meta.label}</strong>
          <span class="percent-label ${pressureClass}">${Math.round(occupancyRate)}%</span>
        </div>
        <div class="zone-meter" role="img" aria-label="${Math.round(occupancyRate)}% de ocupação">
          <span class="zone-meter-fill ${pressureClass}" style="width:${occupancyRate}%"></span>
        </div>
        <span class="zone-caption">${numberFormatter.format(occupiedPlaces)} de ${numberFormatter.format(totalCapacity)} lugares ocupados</span>
      </button>
    `;
  }).join('');

  container.innerHTML = rows;

  container.querySelectorAll('.zone-row').forEach((row) => {
    row.addEventListener('click', () => {
      const zoneId = row.getAttribute('data-zone-id');
      state.zoneFilter = zoneId;
      state.selectedZoneId = zoneId;
      state.selectedParkId = null;
      updateDashboard();
    });
    row.addEventListener('mouseenter', (event) => {
      const zoneId = row.getAttribute('data-zone-id');
      const zoneParks = getZoneParks(zoneId);
      const totalCapacity = zoneParks.reduce((sum, park) => sum + park.capacity, 0);
      const occupiedPlaces = zoneParks.reduce((sum, park) => sum + Math.round((park.capacity * getEffectiveOccupancy(park, state.monthFilter)) / 100), 0);
      showTooltip(event, `${ZONE_META[zoneId].label}<br>Capacidade: ${numberFormatter.format(totalCapacity)}<br>Ocupados: ${numberFormatter.format(occupiedPlaces)}`);
    });
    row.addEventListener('mousemove', (event) => {
      const zoneId = row.getAttribute('data-zone-id');
      const zoneParks = getZoneParks(zoneId);
      const totalCapacity = zoneParks.reduce((sum, park) => sum + park.capacity, 0);
      const occupiedPlaces = zoneParks.reduce((sum, park) => sum + Math.round((park.capacity * getEffectiveOccupancy(park, state.monthFilter)) / 100), 0);
      showTooltip(event, `${ZONE_META[zoneId].label}<br>Capacidade: ${numberFormatter.format(totalCapacity)}<br>Ocupados: ${numberFormatter.format(occupiedPlaces)}`);
    });
    row.addEventListener('mouseleave', hideTooltip);
  });
}

function renderRanking() {
  const rankingList = document.getElementById('rankingList');
  const parks = [...getFilteredParks()].sort((a, b) => getEffectiveOccupancy(b, state.monthFilter) - getEffectiveOccupancy(a, state.monthFilter)).slice(0, 5);

  rankingList.innerHTML = parks.map((park, index) => {
    const selected = state.selectedParkId === park.id;
    const occupancy = Math.round(getEffectiveOccupancy(park, state.monthFilter));
    return `
      <button type="button" class="ranking-row ${selected ? 'is-selected' : ''}" data-park-id="${park.id}" aria-label="Selecionar parque ${park.name}, ${occupancy}% de ocupação">
        <span class="ranking-rank">${String(index + 1).padStart(2, '0')}</span>
        <span class="ranking-content">
          <span class="ranking-row-top">
            <span class="ranking-label">${park.name}</span>
            <span class="ranking-value">${occupancy}%</span>
          </span>
          <span class="ranking-meter"><span style="width:${occupancy}%"></span></span>
        </span>
      </button>
    `;
  }).join('');

  rankingList.querySelectorAll('.ranking-row').forEach((row) => {
    row.addEventListener('click', () => {
      const parkId = row.getAttribute('data-park-id');
      state.selectedParkId = parkId;
      state.selectedZoneId = PARKS.find((park) => park.id === parkId)?.zoneId || 'all';
      state.zoneFilter = state.selectedZoneId;
      updateDashboard();
    });
  });
}

function getSelectedParkSeries() {
  const selectedPark = getSelectedPark();
  if (!selectedPark) return null;

  return MONTHS.map((item, index) => ({
    month: item.label,
    value: Math.round(selectedPark.monthly?.[index] ?? 0),
  }));
}

function renderMonthlyChart() {
  const svg = document.getElementById('monthlyChart');
  const legend = document.getElementById('monthlyLegend');
  const width = 980;
  const height = 300;
  const padding = { top: 18, right: 20, bottom: 42, left: 48 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const selectedParkSeries = getSelectedParkSeries();
  const selectedPark = getSelectedPark();
  const chartHint = document.getElementById('chartHint');
  if (chartHint) chartHint.hidden = Boolean(selectedParkSeries);
  const maxValue = 100;
  legend.innerHTML = `
    <span class="chart-legend-item"><i class="chart-legend-dot city"></i>Média de Lisboa</span>
    ${selectedPark ? `<span class="chart-legend-item"><i class="chart-legend-dot selected"></i>${selectedPark.name}</span>` : ''}
  `;
  const citySeries = MONTHS.map((item, index) => ({ month: item.label, value: Math.round(CITY_MONTH_SERIES[index] ?? 0) }));
  const groupWidth = chartWidth / citySeries.length;
  const barWidth = selectedParkSeries ? 24 : 38;
  const yScale = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;
  const baseline = height - padding.bottom;
  const yGrid = [0, 25, 50, 75, 100].map((tick) => {
    const y = yScale(tick);
    return `
      <line class="grid-line" x1="${padding.left}" x2="${width - padding.right}" y1="${y}" y2="${y}"></line>
      <text class="axis-label" x="${padding.left - 10}" y="${y + 4}" text-anchor="end">${tick}%</text>
    `;
  }).join('');
  const bars = citySeries.map((point, index) => {
    const center = padding.left + (index + 0.5) * groupWidth;
    const cityX = center - (selectedParkSeries ? barWidth + 4 : barWidth / 2);
    const cityY = yScale(point.value);
    const cityBar = `
      <rect class="chart-bar city-bar" x="${cityX}" y="${cityY}" width="${barWidth}" height="${baseline - cityY}" rx="6" data-tooltip="${point.month}<br>Média de Lisboa: ${point.value}%">
        <title>${point.month}: média de Lisboa ${point.value}%</title>
      </rect>
    `;
    const parkValue = selectedParkSeries ? selectedParkSeries[index].value : null;
    const parkY = parkValue === null ? 0 : yScale(parkValue);
    const parkBar = parkValue === null ? '' : `
      <rect class="chart-bar selected-bar" x="${center + 4}" y="${parkY}" width="${barWidth}" height="${baseline - parkY}" rx="6" data-tooltip="${point.month}<br>${selectedPark.name}: ${parkValue}%">
        <title>${point.month}: ${selectedPark.name} ${parkValue}%</title>
      </rect>
    `;
    return `
      ${cityBar}
      ${parkBar}
      <text class="axis-label month-label" x="${center}" y="${height - 12}" text-anchor="middle">${point.month}</text>
    `;
  }).join('');

  svg.innerHTML = `
    <g>
      ${yGrid}
      <line class="axis-line" x1="${padding.left}" x2="${width - padding.right}" y1="${baseline}" y2="${baseline}"></line>
      ${bars}
    </g>
  `;

  svg.querySelectorAll('.chart-bar').forEach((bar) => {
    bar.addEventListener('mouseenter', (event) => {
      const tooltipText = bar.getAttribute('data-tooltip');
      showTooltip(event, tooltipText);
    });
    bar.addEventListener('mousemove', (event) => {
      const tooltipText = bar.getAttribute('data-tooltip');
      showTooltip(event, tooltipText);
    });
    bar.addEventListener('mouseleave', hideTooltip);
  });
}

function showTooltip(event, content) {
  const tooltip = document.getElementById('customTooltip');
  tooltip.innerHTML = content;
  tooltip.classList.remove('hidden');
  tooltip.style.left = `${event.clientX + 16}px`;
  tooltip.style.top = `${event.clientY + 16}px`;
}

function hideTooltip() {
  document.getElementById('customTooltip').classList.add('hidden');
}

function syncSelectedStateFromFilters() {
  const currentPark = state.parkFilter === 'all' ? null : PARKS.find((park) => park.id === state.parkFilter);
  if (currentPark) {
    state.selectedParkId = currentPark.id;
    state.selectedZoneId = currentPark.zoneId;
  }

  if (state.zoneFilter !== 'all' && !PARKS.some((park) => park.zoneId === state.zoneFilter)) {
    state.zoneFilter = 'all';
  }

  if (state.parkFilter !== 'all' && currentPark && currentPark.zoneId !== state.zoneFilter) {
    state.parkFilter = 'all';
  }
}

function updateDashboard() {
  syncSelectedStateFromFilters();
  updateFilterOptions();
  renderKpis();
  renderMap();
  renderMapSummary();
  renderParkDetail();
  renderParkInfo();
  renderFavorites();
  renderZoneChart();
  renderRanking();
  renderMonthlyChart();
}

function renderHomeSummary() {
  const parkCount = document.getElementById('homeParkCount');
  const zoneCount = document.getElementById('homeZoneCount');
  const occupancy = document.getElementById('homeOccupancy');

  if (parkCount) parkCount.textContent = String(PARKS.length).padStart(2, '0');
  if (zoneCount) zoneCount.textContent = String(Object.keys(ZONE_META).length).padStart(2, '0');
  const december = CITY_MONTH_SERIES[CITY_MONTH_SERIES.length - 1];
  if (occupancy && december !== null) occupancy.innerHTML = `${Math.round(december)}<small>%</small>`;
}

function initializeCityCardFlip() {
  const card = document.getElementById('cityCard');
  if (!card) return;

  const front = card.querySelector('.city-card-front');
  const back = card.querySelector('.city-card-back');
  const toggle = card.querySelector('.city-card-toggle');
  const backLink = card.querySelector('.city-card-back-bottom a');
  let isHovered = false;
  let manualOverride = null;

  const updateCardSide = () => {
    const isFlipped = manualOverride === null ? isHovered : manualOverride;
    card.classList.toggle('is-flipped', isFlipped);
    front.setAttribute('aria-hidden', String(isFlipped));
    back.setAttribute('aria-hidden', String(!isFlipped));
    backLink.tabIndex = isFlipped ? 0 : -1;
    toggle.setAttribute('aria-pressed', String(isFlipped));
    toggle.setAttribute('aria-label', isFlipped ? 'Mostrar a frente do cartão' : 'Mostrar o verso do cartão');
  };

  card.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    isHovered = true;
    updateCardSide();
  });

  card.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'mouse') return;
    isHovered = false;
    if (!back.contains(document.activeElement)) manualOverride = null;
    updateCardSide();
  });

  toggle.addEventListener('click', () => {
    const isFlipped = manualOverride === null ? isHovered : manualOverride;
    manualOverride = !isFlipped;
    updateCardSide();
  });

  card.addEventListener('focusout', () => {
    window.setTimeout(() => {
      if (!card.contains(document.activeElement)) {
        manualOverride = null;
        updateCardSide();
      }
    }, 0);
  });

  updateCardSide();
}

function bindEvents() {
  document.getElementById('zoneFilter').addEventListener('change', (event) => {
    state.zoneFilter = event.target.value;
    if (state.zoneFilter !== 'all') {
      state.selectedZoneId = state.zoneFilter;
    } else {
      state.selectedZoneId = 'all';
    }
    state.parkFilter = 'all';
    state.selectedParkId = null;
    updateDashboard();
  });

  document.getElementById('monthFilter').addEventListener('change', (event) => {
    state.monthFilter = event.target.value;
    updateDashboard();
  });

  document.getElementById('parkFilter').addEventListener('change', (event) => {
    state.parkFilter = event.target.value;
    if (state.parkFilter === 'all') {
      state.selectedParkId = null;
    } else {
      const park = PARKS.find((item) => item.id === state.parkFilter);
      state.selectedParkId = park ? park.id : null;
      state.selectedZoneId = park ? park.zoneId : state.zoneFilter;
      state.zoneFilter = park ? park.zoneId : state.zoneFilter;
    }
    updateDashboard();
  });

}

window.addEventListener('DOMContentLoaded', async () => {
  initializeCityCardFlip();

  let dataError = null;
  try {
    await loadDashboardData();
  } catch (error) {
    dataError = error;
    console.error('Não foi possível carregar os dados dos parques.', error);
  }

  renderHomeSummary();
  if (document.getElementById('mapCanvas')) {
    bindEvents();
    try {
      initializeParkMap();
    } catch (error) {
      console.error('Não foi possível inicializar o mapa.', error);
    }

    if (dataError) {
      document.getElementById('mapNotice').textContent = 'Não foi possível carregar os dados da base de dados. Confirma que o servidor (npm start) está a correr.';
    }

    updateDashboard();
    console.log('Dashboard inicializado; total de parques:', PARKS.length);
  }
});
