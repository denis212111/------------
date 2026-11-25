const photo = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`;

const places = [
  { title: 'Слепить кружку из глины', category: 'Мастер-класс', price: 900, days: ['weekend'], time: 'Суббота, 15:00', group: true, ad: true, address: 'ул. Нижняя Сыромятническая, 10', image: '1565193298595-6ba9dcb5ac8d', description: 'За 90 минут можно вручную слепить кружку. Материалы и обжиг входят в стоимость.' },
  { title: 'Посмотреть выставку иллюстраций', category: 'Выставка', price: 0, days: ['today', 'weekend'], time: 'До 20:00', group: false, address: '4-й Сыромятнический пер., 1/8', image: '1577083552431-6e5fd01aa342', description: 'Посмотри, как художники изображают город, и выбери свою любимую работу.' },
  { title: 'Сыграть в настолки', category: 'Игры', price: 350, days: ['today'], time: 'Сегодня с 18:00', group: true, address: 'ул. Покровка, 17', image: '1610890716171-6b1bb98ffd09', description: 'Вечер простых настольных игр. Можно прийти со своей компанией или присоединиться к общему столу.' },
  { title: 'Устроить кофейную прогулку', category: 'Еда и напитки', price: 450, days: ['today', 'weekend'], time: 'С 10:00 до 19:00', group: true, address: 'ул. Мясницкая, 13', image: '1501339847302-ac426a4a7cbb', description: 'Возьми кофе с собой и прогуляйся от Мясницкой до Чистых прудов.' },
  { title: 'Научиться снимать на плёнку', category: 'Мастер-класс', price: 1400, days: ['weekend'], time: 'Воскресенье, 12:00', group: false, address: 'ул. Казакова, 8', image: '1516035069371-29a1b244cc32', description: 'Разберись с настройками камеры и сделай первые кадры на прогулке.' },
  { title: 'Послушать акустический концерт', category: 'Музыка', price: 800, days: ['weekend'], time: 'Суббота, 19:00', group: true, address: 'ул. Старая Басманная, 15', image: '1516280440614-37939bbacd81', description: 'Небольшой концерт с живой гитарой и авторскими песнями.' },
];

const cards = document.querySelector('#cards');
const results = document.querySelector('#results');
const filters = [...document.querySelectorAll('[data-filter]')];
const dialog = document.querySelector('#details');
const currency = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
const priceLabel = (price) => price === 0 ? 'Бесплатно' : currency.format(price);

function showDetails(place) {
  const map = new URL('https://yandex.ru/maps/');
  map.searchParams.set('text', `Москва, ${place.address}`);
  document.querySelector('#details-content').innerHTML = `
    <img class="details-photo" src="${photo(place.image)}" alt="">
    <p class="muted">${place.ad ? 'Реклама · ' : ''}${place.category} · Демо</p>
    <h2 id="details-title">${place.title}</h2>
    <p>${place.description}</p>
    <p><strong>${priceLabel(place.price)}</strong> · ${place.time}</p>
    <p>${place.address}</p>
    <a class="button" href="${map.href}" target="_blank" rel="noopener">Открыть адрес на карте</a>`;
  dialog.showModal();
}

function renderCards() {
  const active = new Set(filters.filter((button) => button.getAttribute('aria-pressed') === 'true').map((button) => button.dataset.filter));
  const days = ['today', 'weekend'].filter((day) => active.has(day));
  const visible = places.filter((place) =>
    (!days.length || days.some((day) => place.days.includes(day))) &&
    (!active.has('budget') || place.price <= 1000) &&
    (!active.has('group') || place.group)
  );
  results.textContent = visible.length ? `Найдено предложений: ${visible.length}` : 'Подходящих предложений нет. Попробуй изменить фильтры.';
  cards.replaceChildren(...visible.map((place) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${photo(place.image)}" alt="" loading="lazy">
      ${place.ad ? '<span class="ad">Реклама</span>' : ''}
      <div class="card-body">
        <p class="muted">${place.category} · ${place.time}</p>
        <h3><button type="button">${place.title}</button></h3>
        <p><strong>${priceLabel(place.price)}</strong></p>
      </div>`;
    card.querySelector('button').addEventListener('click', () => showDetails(place));
    return card;
  }));
}

for (const button of filters) {
  button.addEventListener('click', () => {
    button.setAttribute('aria-pressed', String(button.getAttribute('aria-pressed') !== 'true'));
    renderCards();
  });
}

const application = document.querySelector('#application');
const status = document.querySelector('#form-status');
const draftKey = 'kuda-today-application';

try {
  const draft = JSON.parse(localStorage.getItem(draftKey));
  for (const field of ['venue', 'email', 'offer']) {
    if (typeof draft?.[field] === 'string') application.elements.namedItem(field).value = draft[field];
  }
} catch {
  status.textContent = 'Черновик не удалось загрузить.';
}

application.addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    localStorage.setItem(draftKey, JSON.stringify(Object.fromEntries(new FormData(application))));
    status.textContent = 'Черновик сохранён в этом браузере.';
  } catch {
    status.textContent = 'Браузер не разрешил сохранить черновик.';
  }
});

renderCards();
