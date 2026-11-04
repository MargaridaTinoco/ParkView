const MONTHS = [
  { key: 'jul', label: 'Jul', adjustment: -1 },
  { key: 'ago', label: 'Ago', adjustment: -2 },
  { key: 'set', label: 'Set', adjustment: 0 },
  { key: 'out', label: 'Out', adjustment: 1 },
  { key: 'nov', label: 'Nov', adjustment: 2 },
  { key: 'dez', label: 'Dez', adjustment: 3 },
];

const CITY_MONTH_SERIES = [43, 44, 44, 45, 46, 47];

const ZONE_META = {
  'avenidas-novas': { label: 'Avenidas Novas', color: '#ebf5f8' },
  'arroios': { label: 'Arroios', color: '#eef7f2' },
  'santo-antonio': { label: 'Santo António', color: '#eff8f9' },
  'alvalade': { label: 'Alvalade', color: '#eef4fb' },
  'santa-maria-maior': { label: 'Santa Maria Maior', color: '#f6f1f9' },
};

const PARKS = [
  { id: 1, name: 'Atrium Saldanha', zoneId: 'avenidas-novas', capacity: 420, occupancy: 88, maximum: 98, x: 250, y: 140 },
  { id: 2, name: 'Campo Pequeno', zoneId: 'avenidas-novas', capacity: 310, occupancy: 70, maximum: 91, x: 205, y: 140 },
  { id: 3, name: 'Saldanha Residence', zoneId: 'avenidas-novas', capacity: 260, occupancy: 66, maximum: 87, x: 280, y: 170 },
  { id: 4, name: 'Picoas Plaza', zoneId: 'avenidas-novas', capacity: 190, occupancy: 61, maximum: 82, x: 330, y: 115 },
  { id: 5, name: 'Duque d’Ávila', zoneId: 'avenidas-novas', capacity: 215, occupancy: 58, maximum: 80, x: 230, y: 210 },
  { id: 6, name: 'Berna', zoneId: 'avenidas-novas', capacity: 180, occupancy: 49, maximum: 73, x: 315, y: 210 },
  { id: 7, name: 'Entrecampos', zoneId: 'avenidas-novas', capacity: 340, occupancy: 46, maximum: 69, x: 360, y: 250 },
  { id: 8, name: 'Gulbenkian', zoneId: 'avenidas-novas', capacity: 280, occupancy: 43, maximum: 68, x: 175, y: 235 },
  { id: 9, name: 'Palácio Sotto Mayor', zoneId: 'avenidas-novas', capacity: 225, occupancy: 55, maximum: 79, x: 270, y: 250 },
  { id: 10, name: 'Arco Cego', zoneId: 'arroios', capacity: 300, occupancy: 82, maximum: 96, x: 410, y: 140 },
  { id: 11, name: 'Chile', zoneId: 'arroios', capacity: 180, occupancy: 68, maximum: 89, x: 455, y: 175 },
  { id: 12, name: 'Alameda', zoneId: 'arroios', capacity: 240, occupancy: 63, maximum: 85, x: 540, y: 150 },
  { id: 13, name: 'Anjos 70', zoneId: 'arroios', capacity: 165, occupancy: 59, maximum: 81, x: 500, y: 210 },
  { id: 14, name: 'Mercado do Forno', zoneId: 'arroios', capacity: 140, occupancy: 52, maximum: 76, x: 565, y: 205 },
  { id: 15, name: 'Instituto Superior Técnico', zoneId: 'arroios', capacity: 320, occupancy: 48, maximum: 72, x: 465, y: 260 },
  { id: 16, name: 'Martim Moniz Norte', zoneId: 'arroios', capacity: 210, occupancy: 65, maximum: 88, x: 400, y: 220 },
  { id: 17, name: 'Fonte Luminosa', zoneId: 'arroios', capacity: 195, occupancy: 41, maximum: 67, x: 470, y: 305 },
  { id: 18, name: 'Penha de França', zoneId: 'arroios', capacity: 155, occupancy: 45, maximum: 70, x: 555, y: 275 },
  { id: 19, name: 'Marquês de Pombal', zoneId: 'santo-antonio', capacity: 360, occupancy: 73, maximum: 93, x: 305, y: 95 },
  { id: 20, name: 'Alexandre Herculano', zoneId: 'santo-antonio', capacity: 185, occupancy: 69, maximum: 89, x: 355, y: 145 },
  { id: 21, name: 'Rato', zoneId: 'santo-antonio', capacity: 210, occupancy: 62, maximum: 84, x: 390, y: 110 },
  { id: 22, name: 'Avenida da Liberdade', zoneId: 'santo-antonio', capacity: 330, occupancy: 58, maximum: 82, x: 290, y: 70 },
  { id: 23, name: 'Mayer', zoneId: 'santo-antonio', capacity: 160, occupancy: 54, maximum: 78, x: 360, y: 70 },
  { id: 24, name: 'Largo do Rato', zoneId: 'santo-antonio', capacity: 145, occupancy: 51, maximum: 75, x: 420, y: 90 },
  { id: 25, name: 'Amoreiras', zoneId: 'santo-antonio', capacity: 380, occupancy: 47, maximum: 71, x: 335, y: 190 },
  { id: 26, name: 'Restauradores', zoneId: 'santo-antonio', capacity: 230, occupancy: 64, maximum: 86, x: 430, y: 70 },
  { id: 27, name: 'Rua Castilho', zoneId: 'santo-antonio', capacity: 190, occupancy: 44, maximum: 69, x: 435, y: 145 },
  { id: 28, name: 'Roma', zoneId: 'alvalade', capacity: 275, occupancy: 77, maximum: 94, x: 160, y: 355 },
  { id: 29, name: 'Alvalade XXI', zoneId: 'alvalade', capacity: 310, occupancy: 64, maximum: 86, x: 215, y: 325 },
  { id: 30, name: 'Areeiro', zoneId: 'alvalade', capacity: 245, occupancy: 58, maximum: 80, x: 250, y: 370 },
  { id: 31, name: 'Av. de Roma', zoneId: 'alvalade', capacity: 190, occupancy: 55, maximum: 78, x: 170, y: 410 },
  { id: 32, name: 'Praça de Alvalade', zoneId: 'alvalade', capacity: 220, occupancy: 50, maximum: 74, x: 120, y: 305 },
  { id: 33, name: 'Cidade Universitária', zoneId: 'alvalade', capacity: 420, occupancy: 39, maximum: 65, x: 65, y: 390 },
  { id: 34, name: 'Bela Vista', zoneId: 'alvalade', capacity: 340, occupancy: 36, maximum: 60, x: 280, y: 430 },
  { id: 35, name: 'José Alvalade', zoneId: 'alvalade', capacity: 280, occupancy: 42, maximum: 68, x: 155, y: 270 },
  { id: 36, name: 'Campo Grande', zoneId: 'alvalade', capacity: 370, occupancy: 45, maximum: 70, x: 225, y: 455 },
  { id: 37, name: 'Chão do Loureiro', zoneId: 'santa-maria-maior', capacity: 190, occupancy: 68, maximum: 89, x: 520, y: 330 },
  { id: 38, name: 'Praça da Figueira', zoneId: 'santa-maria-maior', capacity: 230, occupancy: 65, maximum: 87, x: 600, y: 300 },
  { id: 39, name: 'Portas do Sol', zoneId: 'santa-maria-maior', capacity: 145, occupancy: 61, maximum: 84, x: 610, y: 350 },
  { id: 40, name: 'Campo das Cebolas', zoneId: 'santa-maria-maior', capacity: 260, occupancy: 57, maximum: 80, x: 525, y: 385 },
  { id: 41, name: 'Largo da Graça', zoneId: 'santa-maria-maior', capacity: 130, occupancy: 53, maximum: 77, x: 575, y: 420 },
  { id: 42, name: 'Baixa-Chiado', zoneId: 'santa-maria-maior', capacity: 320, occupancy: 49, maximum: 73, x: 650, y: 250 },
  { id: 43, name: 'Terreiro do Paço', zoneId: 'santa-maria-maior', capacity: 290, occupancy: 43, maximum: 69, x: 675, y: 330 },
  { id: 44, name: 'Mouraria', zoneId: 'santa-maria-maior', capacity: 160, occupancy: 47, maximum: 72, x: 470, y: 365 },
  { id: 45, name: 'Sé', zoneId: 'santa-maria-maior', capacity: 175, occupancy: 40, maximum: 66, x: 660, y: 395 },
];

const FAVORITES_STORAGE_KEY = 'parkview:favorites:v1';

function readFavoriteParkIds() {
  try {
    const storedFavorites = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedFavorites) return { ids: new Set(), error: '' };

    const parsedFavorites = JSON.parse(storedFavorites);
    if (!Array.isArray(parsedFavorites)) {
      throw new TypeError('Os favoritos guardados não têm o formato esperado.');
    }

    const favoriteIds = parsedFavorites.filter((id) => PARKS.some((park) => park.id === id));
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
  mapZoom: 1,
  favoriteParkIds: storedFavorites.ids,
  favoriteStorageError: storedFavorites.error,
};

const parkInfoState = {
  parkId: null,
  requestId: 0,
  status: 'idle',
  data: null,
};

const numberFormatter = new Intl.NumberFormat('pt-PT');
const currencyFormatter = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

const parkInfoFields = {
  places: [
    { key: 'total_spaces', label: 'Lugares totais', format: 'number' },
    { key: 'reduced_mobility_spaces', label: 'Mobilidade reduzida', format: 'number' },
    { key: 'electric_charging_spaces', label: 'Carregamento elétrico', format: 'number' },
  ],
  schedules: [
    { key: 'service_hours', label: 'Horário de serviço', format: 'text' },
    { key: 'customer_service_hours', label: 'Horário do serviço ao cliente', format: 'text' },
  ],
  prices: [
    { key: 'first_hour_price', label: 'Primeira hora', format: 'currency' },
    { key: 'daily_max_price', label: 'Máximo diário', format: 'currency' },
  ],
  products: [
    { key: 'subscriptions', label: 'Avenças', icon: 'pass' },
    { key: 'electric_charging', label: 'Carregamento elétrico', icon: 'bolt' },
    { key: 'express_entry', label: 'Entrada express', icon: 'arrow' },
    { key: 'multipass', label: 'Multipass', icon: 'grid' },
    { key: 'reservations', label: 'Reservas', icon: 'calendar' },
  ],
  services: [
    { key: 'support_24h', label: 'Apoio 24 horas', icon: 'clock' },
    { key: 'automatic_payment_machine', label: 'Caixa de pagamento automático', icon: 'terminal' },
    { key: 'cctv', label: 'CCTV', icon: 'camera' },
    { key: 'elevator', label: 'Elevador', icon: 'elevator' },
    { key: 'car_wash', label: 'Lavagem de veículos', icon: 'wash' },
  ],
  payments: [
    { key: 'app_payment', label: 'Aplicação', icon: 'phone' },
    { key: 'credit_card_payment', label: 'Cartão de crédito', icon: 'card' },
    { key: 'cash_payment', label: 'Numerário', icon: 'cash' },
    { key: 'via_verde_payment', label: 'Via Verde', icon: 'toll' },
  ],
  vehicles: [
    { key: 'cars_allowed', label: 'Carro', icon: 'car' },
    { key: 'vans_allowed', label: 'Furgão', icon: 'van' },
    { key: 'motorcycles_allowed', label: 'Motocicleta', icon: 'motorcycle' },
  ],
  height: { key: 'max_height_cm', label: 'Altura máxima', icon: 'ruler', format: 'height' },
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
  // TODO: Ligar este endpoint ao serviço backend que consulta a tabela park_info na base de dados.
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
  if (format === 'height' && Number.isFinite(Number(value))) return `${numberFormatter.format(Number(value))} cm`;
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
    ...parkInfoFields.products,
    ...parkInfoFields.services,
    ...parkInfoFields.payments,
    ...parkInfoFields.vehicles,
    parkInfoFields.height,
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
        ${renderParkInfoGroup('Produtos', parkInfoFields.products, data)}
        ${renderParkInfoGroup('Serviços', parkInfoFields.services, data)}
        ${renderParkInfoGroup('Forma de pagamento', parkInfoFields.payments, data)}
        ${renderParkInfoGroup('Veículos aptos', parkInfoFields.vehicles, data)}
        ${renderParkInfoGroup('Altura máxima', [parkInfoFields.height], data)}
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

function getMonthAdjustment(monthKey) {
  if (monthKey === 'all') return 0;
  const month = MONTHS.find((item) => item.key === monthKey);
  return month ? month.adjustment : 0;
}

function getEffectiveOccupancy(park, monthKey = 'all') {
  const adjusted = park.occupancy + getMonthAdjustment(monthKey);
  return clamp(adjusted, 0, 99);
}

function getParkPressureClass(value) {
  if (value < 50) return 'low';
  if (value < 70) return 'medium';
  return 'high';
}

function getSelectedPark() {
  return PARKS.find((park) => park.id === Number(state.selectedParkId)) || null;
}

function getFilteredParks() {
  const byZone = state.zoneFilter === 'all'
    ? PARKS
    : PARKS.filter((park) => park.zoneId === state.zoneFilter);

  if (state.parkFilter !== 'all') {
    return byZone.filter((park) => park.id === Number(state.parkFilter));
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

  if (state.parkFilter !== 'all' && !relevantParks.some((park) => park.id === Number(state.parkFilter))) {
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
  const cityAvgMonth = CITY_MONTH_SERIES[MONTHS.findIndex((item) => item.key === 'dez')];

  const kpis = [
    {
      label: 'Lugares totais',
      value: `${numberFormatter.format(totalCapacity)}`,
      subvalue: `${filteredParks.length} parques`,
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
      value: 'Dezembro',
      subvalue: `${cityAvgMonth}% ocupação média`,
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

function getPressureColor(value) {
  if (value < 50) return '#22a277';
  if (value < 70) return '#dfa13a';
  return '#df5a5a';
}

function buildMapSvgContent() {
  return `
    <defs>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="rgba(25, 122, 158, 0.22)"/>
      </filter>
    </defs>
    <g id="mapGroup" transform="translate(0 0) scale(${state.mapZoom})" style="transform-origin: center;">
      <path class="water-shape" d="M0 130 C80 80, 120 70, 180 95 L220 140 L170 215 L50 230 L0 190 Z"></path>
      <path class="city-shape" d="M60 90 L140 50 L220 60 L310 28 L410 40 L520 76 L660 120 L720 180 L700 300 L650 390 L560 472 L430 490 L300 470 L180 430 L90 350 L40 260 Z"></path>
      <path class="road-line" d="M80 105 L180 60 L280 95 L360 70 L470 110 L590 140"></path>
      <path class="road-line" d="M130 220 L270 160 L390 190 L520 210 L680 255"></path>
      <path class="road-line" d="M230 330 L350 260 L465 300 L624 360"></path>
      <path class="road-line" d="M120 400 L250 325 L345 390 L430 430 L560 440"></path>
      <path class="road-line" d="M355 80 L340 190 L325 300 L315 430"></path>
      <path class="road-line" d="M485 155 L510 255 L530 360"></path>
      <g>
        <path class="zone-area ${state.selectedZoneId === 'avenidas-novas' ? 'is-selected' : ''}" data-zone-id="avenidas-novas" fill="${ZONE_META['avenidas-novas'].color}" d="M150 100 L260 70 L330 120 L310 205 L240 220 L170 200 Z"></path>
        <path class="zone-area ${state.selectedZoneId === 'arroios' ? 'is-selected' : ''}" data-zone-id="arroios" fill="${ZONE_META['arroios'].color}" d="M315 120 L430 110 L500 170 L470 290 L385 310 L300 255 Z"></path>
        <path class="zone-area ${state.selectedZoneId === 'santo-antonio' ? 'is-selected' : ''}" data-zone-id="santo-antonio" fill="${ZONE_META['santo-antonio'].color}" d="M255 68 L390 40 L440 95 L405 180 L315 165 L260 120 Z"></path>
        <path class="zone-area ${state.selectedZoneId === 'alvalade' ? 'is-selected' : ''}" data-zone-id="alvalade" fill="${ZONE_META['alvalade'].color}" d="M90 260 L215 220 L245 410 L130 455 L60 365 Z"></path>
        <path class="zone-area ${state.selectedZoneId === 'santa-maria-maior' ? 'is-selected' : ''}" data-zone-id="santa-maria-maior" fill="${ZONE_META['santa-maria-maior'].color}" d="M470 310 L620 290 L680 330 L670 445 L520 470 L455 390 Z"></path>
      </g>
      <text class="zone-label" x="85" y="98">Monsanto</text>
      <text class="zone-label" x="40" y="170">Rio Tejo</text>
    </g>
  `;
}

function renderMap() {
  const svg = document.getElementById('mapSvg');
  const filteredParks = getFilteredParks();
  const visibleParkIds = new Set(filteredParks.map((park) => park.id));

  svg.innerHTML = buildMapSvgContent();

  const mapGroup = svg.querySelector('#mapGroup');
  const markersGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  markersGroup.setAttribute('id', 'parkMarkers');

  PARKS.forEach((park) => {
    const isVisible = visibleParkIds.has(park.id);
    const effectiveOccupancy = getEffectiveOccupancy(park, state.monthFilter);
    const isSelected = Number(state.selectedParkId) === park.id;
    const isDimmed = state.zoneFilter !== 'all' && !isVisible;
    const color = getPressureColor(effectiveOccupancy);

    const iconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    iconGroup.setAttribute('class', `park-marker ${isSelected ? 'is-selected' : ''} ${isDimmed ? 'is-dimmed' : ''}`);
    iconGroup.setAttribute('tabindex', '0');
    iconGroup.setAttribute('role', 'button');
    iconGroup.setAttribute('aria-label', `${park.name}, ${ZONE_META[park.zoneId].label}, ${effectiveOccupancy}% de ocupação`);
    iconGroup.setAttribute('data-park-id', String(park.id));
    iconGroup.setAttribute('transform', `translate(${park.x}, ${park.y}) scale(${isSelected ? 1.16 : 1})`);
    iconGroup.style.opacity = isVisible ? '1' : '0.18';

    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    halo.setAttribute('class', 'marker-halo');
    halo.setAttribute('r', isSelected ? '16' : '12');
    halo.setAttribute('fill', color);
    halo.setAttribute('opacity', isSelected ? '0.18' : '0.1');

    const core = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    core.setAttribute('class', 'marker-core');
    core.setAttribute('r', isSelected ? '7' : '5.7');
    core.setAttribute('fill', color);

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'marker-label');
    label.setAttribute('x', 11);
    label.setAttribute('y', 3);
    label.textContent = `${park.name.split(' ')[0]}`;

    const tooltipText = `${park.name}<br>${ZONE_META[park.zoneId].label}<br>Ocupação: ${effectiveOccupancy}%<br>Capacidade: ${numberFormatter.format(park.capacity)}`;
    iconGroup.setAttribute('data-tooltip', tooltipText);

    iconGroup.addEventListener('click', () => {
      state.selectedParkId = park.id;
      state.selectedZoneId = park.zoneId;
      updateDashboard();
    });

    iconGroup.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        state.selectedParkId = park.id;
        state.selectedZoneId = park.zoneId;
        updateDashboard();
      }
    });

    iconGroup.addEventListener('mouseenter', (event) => {
      showTooltip(event, tooltipText);
    });
    iconGroup.addEventListener('mousemove', (event) => {
      showTooltip(event, tooltipText);
    });
    iconGroup.addEventListener('mouseleave', hideTooltip);
    iconGroup.addEventListener('focus', (event) => {
      showTooltip(event, tooltipText);
    });
    iconGroup.addEventListener('blur', hideTooltip);

    iconGroup.appendChild(halo);
    iconGroup.appendChild(core);
    iconGroup.appendChild(label);
    markersGroup.appendChild(iconGroup);
  });

  mapGroup.appendChild(markersGroup);

  svg.querySelectorAll('.zone-area').forEach((zoneElement) => {
    zoneElement.addEventListener('click', () => {
      const zoneId = zoneElement.getAttribute('data-zone-id');
      state.selectedZoneId = zoneId;
      state.zoneFilter = zoneId;
      state.selectedParkId = null;
      updateDashboard();
    });
    zoneElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const zoneId = zoneElement.getAttribute('data-zone-id');
        state.selectedZoneId = zoneId;
        state.zoneFilter = zoneId;
        state.selectedParkId = null;
        updateDashboard();
      }
    });
    zoneElement.setAttribute('tabindex', '0');
  });

  const zoomGroup = svg.querySelector('#mapGroup');
  zoomGroup.setAttribute('transform', `translate(0 0) scale(${state.mapZoom})`);
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
      <div class="detail-item"><span>Taxa máxima</span><strong>${selectedPark.maximum}%</strong></div>
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
      const parkId = Number(button.getAttribute('data-park-id'));
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
      toggleFavorite(Number(button.getAttribute('data-park-id')));
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
    const selected = Number(state.selectedParkId) === park.id;
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
      const parkId = Number(row.getAttribute('data-park-id'));
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

  return MONTHS.map((item) => {
    const adjusted = clamp(selectedPark.occupancy + item.adjustment, 0, 99);
    return {
      month: item.label,
      value: adjusted,
    };
  });
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
  const citySeries = MONTHS.map((item, index) => ({ month: item.label, value: CITY_MONTH_SERIES[index] }));
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

function adjustMapZoom(delta) {
  state.mapZoom = clamp(Number((state.mapZoom + delta).toFixed(2)), 0.9, 1.6);
  renderMap();
}

function syncSelectedStateFromFilters() {
  const currentPark = state.parkFilter === 'all' ? null : PARKS.find((park) => park.id === Number(state.parkFilter));
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
  if (occupancy) occupancy.innerHTML = `${CITY_MONTH_SERIES[CITY_MONTH_SERIES.length - 1]}<small>%</small>`;
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
      const park = PARKS.find((item) => item.id === Number(state.parkFilter));
      state.selectedParkId = park ? park.id : null;
      state.selectedZoneId = park ? park.zoneId : state.zoneFilter;
      state.zoneFilter = park ? park.zoneId : state.zoneFilter;
    }
    updateDashboard();
  });

  document.querySelectorAll('.zoom-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.getAttribute('data-action');
      if (action === 'zoom-in') adjustMapZoom(0.1);
      if (action === 'zoom-out') adjustMapZoom(-0.1);
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderHomeSummary();
  if (document.getElementById('mapSvg')) {
    bindEvents();
    updateDashboard();
    console.log('Dashboard inicializado; total de parques:', PARKS.length);
  }
});
